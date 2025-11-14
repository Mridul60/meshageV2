import { Route, Packet, PacketType, RREQPacket, RREPPacket, RERRPacket, DataPacket } from '../types/routing';
import { NativeModules } from 'react-native';

const { MeshNetwork } = NativeModules;

class RoutingService {
  private static instance: RoutingService;
  private routingTable: Map<string, Route> = new Map(); // Key: destinationId, Value: Route
  private rreqCache: Set<string> = new Set(); // Stores packetIds of recently seen RREQs
  private myPersistentId: string = '';
  private myDeviceAddress: string = ''; // Our device address for routing
  private connectedPeers: Set<string> = new Set(); // Track directly connected peers
  private reverseRoutes: Map<string, { nextHop: string; hopCount: number }> = new Map(); // For RREP routing
  private username: string = 'User'; // For display purposes
  
  // Route expiration constants
  private static readonly ROUTE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  private static readonly RREQ_CACHE_TIMEOUT = 30 * 1000; // 30 seconds
  private static readonly BROADCAST_CACHE_TIMEOUT = 30 * 1000; // 30 seconds
  
  // Broadcast message tracking
  private broadcastCache: Set<string> = new Set(); // Prevents broadcast loops

  private constructor() {}

  public static getInstance(): RoutingService {
    if (!RoutingService.instance) {
      RoutingService.instance = new RoutingService();
    }
    return RoutingService.instance;
  }

  public initialize(myId: string, deviceAddress?: string, username?: string) {
    this.myPersistentId = myId;
    this.myDeviceAddress = deviceAddress || `device_${myId.slice(-8)}`;
    this.username = username || 'User';
    console.log('RoutingService initialized:', { myId, deviceAddress: this.myDeviceAddress, username });
    
    // Clean up old RREQ cache entries periodically
    setInterval(() => this.cleanupRreqCache(), RoutingService.RREQ_CACHE_TIMEOUT);
    
    // Clean up expired routes periodically
    setInterval(() => this.cleanupExpiredRoutes(), 60 * 1000); // Every minute
    
    // Clean up old broadcast cache entries
    setInterval(() => this.cleanupBroadcastCache(), RoutingService.BROADCAST_CACHE_TIMEOUT);
  }

  /**
   * Main entry point for handling all incoming packets from the native layer.
   */
  public handleIncomingPacket(packetString: string) {
    try {
      const packet: Packet = JSON.parse(packetString);

      switch (packet.type) {
        case PacketType.DATA:
          this.handleDataPacket(packet as DataPacket);
          break;
        case PacketType.RREQ:
          this.handleRreqPacket(packet as RREQPacket);
          break;
        case PacketType.RREP:
          this.handleRrepPacket(packet as RREPPacket);
          break;
        case PacketType.RERR:
          this.handleRerrPacket(packet as RERRPacket);
          break;
      }
    } catch (error) {
      console.error('Failed to handle incoming packet:', error);
    }
  }

  private handleDataPacket(packet: DataPacket) {
    console.log(`Received DATA packet from ${packet.sourceId} to ${packet.destinationId}`);
    
    // Handle broadcast messages
    if (packet.destinationId === 'BROADCAST') {
      return this.handleBroadcastPacket(packet);
    }
    
    if (packet.destinationId === this.myPersistentId) {
      // This packet is for me - deliver to application layer
      console.log('✅ DATA packet delivered:', {
        from: packet.senderName,
        payload: packet.payload,
        hops: this.calculateHops(packet)
      });
      
      // TODO: Emit event or callback to notify UI layer
      // For now, we'll just log it
    } else {
      // Not for me, need to forward it
      console.log(`📤 Forwarding DATA packet to ${packet.destinationId}`);
      this.forwardPacket(packet);
    }
  }

  private handleRreqPacket(packet: RREQPacket) {
    // Anti-flooding: discard if we've seen this RREQ before
    if (this.rreqCache.has(packet.packetId)) {
      console.log(`🚫 RREQ ${packet.packetId} already seen, discarding`);
      return;
    }
    this.rreqCache.add(packet.packetId);

    console.log(`📡 Received RREQ from ${packet.sourceId} for ${packet.destinationId} (hops: ${packet.hopCount})`);

    // Record reverse route to source for RREP
    const senderDeviceAddress = this.getDeviceAddressFromPath(packet.path);
    if (senderDeviceAddress) {
      this.reverseRoutes.set(packet.sourceId, {
        nextHop: senderDeviceAddress,
        hopCount: packet.hopCount
      });
      console.log(`📝 Recorded reverse route to ${packet.sourceId} via ${senderDeviceAddress}`);
    }

    if (packet.destinationId === this.myPersistentId) {
      // RREQ has reached its destination - send RREP back
      console.log('🎯 RREQ reached destination. Sending RREP back.');
      this.sendRREP(packet.sourceId, packet.packetId, packet.hopCount);
    } else {
      // Check if we have a route to the destination
      const existingRoute = this.routingTable.get(packet.destinationId);
      if (existingRoute && !existingRoute.isDirect) {
        // We have a route, send RREP on behalf of destination
        console.log(`📍 Have route to ${packet.destinationId}, sending RREP`);
        this.sendRREP(packet.sourceId, packet.packetId, packet.hopCount + existingRoute.hopCount);
      } else {
        // Forward the RREQ to all neighbors except sender
        console.log(`🔄 Forwarding RREQ for ${packet.destinationId}`);
        this.forwardRREQ(packet, senderDeviceAddress || undefined);
      }
    }
  }

  private handleRrepPacket(packet: RREPPacket) {
    console.log(`📨 Received RREP from ${packet.sourceId} to ${packet.destinationId} (hops: ${packet.hopCount})`);

    // Extract sender's device address from path
    const senderDeviceAddress = this.getDeviceAddressFromPath(packet.path);
    if (!senderDeviceAddress) {
      console.error('Cannot determine sender device address from RREP path');
      return;
    }

    // Record forward route to destination
    const route: Route = {
      destination: packet.sourceId, // The source of RREP is our destination
      nextHop: senderDeviceAddress,
      hopCount: packet.hopCount,
      timestamp: Date.now(),
      isDirect: packet.hopCount === 1
    };
    
    this.routingTable.set(packet.sourceId, route);
    console.log(`📝 Added route to ${packet.sourceId} via ${senderDeviceAddress} (${packet.hopCount} hops)`);

    if (packet.destinationId === this.myPersistentId) {
      // RREP has reached the original RREQ sender - route is established
      console.log(`✅ Route established to ${packet.sourceId}`);
      this.printRoutingTable();
    } else {
      // Forward RREP along reverse path
      console.log(`🔄 Forwarding RREP to ${packet.destinationId}`);
      this.forwardRREP(packet);
    }
  }

  /**
   * Forwards a packet to the next hop in its path.
   */
  private forwardPacket(packet: Packet) {
    const route = this.routingTable.get(packet.destinationId);
    if (route) {
      console.log(`📤 Forwarding ${packet.type} packet for ${packet.destinationId} to next hop ${route.nextHop} (${route.hopCount} hops)`);
      this.sendPacketToDevice(route.nextHop, packet);
    } else {
      console.warn(`❌ No route to ${packet.destinationId}. Cannot forward ${packet.type} packet.`);
      
      // For DATA packets, initiate route discovery
      if (packet.type === PacketType.DATA) {
        console.log(`🔍 Initiating route discovery for ${packet.destinationId}`);
        this.initiateRouteDiscovery(packet.destinationId);
        // TODO: Queue the packet for later delivery
      }
    }
  }

  /**
   * Sends a broadcast message to all reachable devices
   */
  public sendBroadcast(payload: any, messageType: string = 'BROADCAST') {
    console.log(`📢 Broadcasting message:`, payload);
    
    const broadcastPacket: DataPacket = {
      type: PacketType.DATA,
      packetId: `broadcast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceId: this.myPersistentId,
      destinationId: 'BROADCAST', // Special destination for broadcast
      payload: {
        ...payload,
        messageType, // 'BROADCAST', 'ANNOUNCEMENT', etc.
        isBroadcast: true
      },
      senderName: this.username,
      timestamp: Date.now(),
    };

    // Add to our own cache to prevent loops
    this.broadcastCache.add(broadcastPacket.packetId);
    
    // Broadcast immediately to all connected peers
    this.floodBroadcast(broadcastPacket);
  }

  /**
   * Kicks off the process of sending a message.
   */
  public sendData(destinationId: string, payload: any) {
    console.log(`📨 Sending data to ${destinationId}:`, payload);
    
    const dataPacket: DataPacket = {
      type: PacketType.DATA,
      packetId: `data-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceId: this.myPersistentId,
      destinationId,
      payload,
      senderName: this.username,
      timestamp: Date.now(),
    };

    const route = this.routingTable.get(destinationId);
    if (route) {
      console.log(`📍 Using existing route to ${destinationId} via ${route.nextHop}`);
      this.forwardPacket(dataPacket);
    } else {
      console.log(`🔍 No route for ${destinationId}. Initiating route discovery.`);
      this.initiateRouteDiscovery(destinationId);
      // TODO: Queue the data packet for delivery after route is discovered
    }
  }

  /**
   * Initiates route discovery by broadcasting an RREQ
   */
  private initiateRouteDiscovery(destinationId: string) {
    const rreqPacket: RREQPacket = {
      type: PacketType.RREQ,
      packetId: `rreq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceId: this.myPersistentId,
      destinationId,
      hopCount: 0,
      path: [this.myDeviceAddress],
      timestamp: Date.now(),
    };

    // Add to our own cache to prevent loops
    this.rreqCache.add(rreqPacket.packetId);
    
    console.log(`🔍 Broadcasting RREQ for ${destinationId}`);
    this.broadcastPacket(rreqPacket);
  }
  /**
   * Utility methods
   */
  private getDeviceAddressFromPath(path: string[]): string | null {
    // The last device in the path is the sender
    return path.length > 0 ? path[path.length - 1] : null;
  }

  private calculateHops(packet: Packet): number {
    // For DATA packets, we can estimate hops from path or routing table
    if ('path' in packet && packet.path) {
      return packet.path.length - 1; // Subtract 1 for the source
    }
    
    const route = this.routingTable.get(packet.sourceId);
    return route ? route.hopCount : 0;
  }

  private cleanupRreqCache() {
    // For now, just clear the entire cache periodically
    // In a real implementation, you'd track timestamps
    this.rreqCache.clear();
    console.log('🧹 Cleaned up RREQ cache');
  }

  private cleanupBroadcastCache() {
    // Clear broadcast cache to allow re-broadcasting of similar messages
    this.broadcastCache.clear();
    console.log('🧹 Cleaned up broadcast cache');
  }

  /**
   * Handles incoming broadcast messages
   */
  private handleBroadcastPacket(packet: DataPacket) {
    // Check if we've already seen this broadcast to prevent loops
    if (this.broadcastCache.has(packet.packetId)) {
      console.log(`🚫 Broadcast ${packet.packetId} already seen, discarding`);
      return;
    }
    
    // Add to cache to prevent re-processing
    this.broadcastCache.add(packet.packetId);
    
    console.log('📢 Received broadcast message:', {
      from: packet.senderName,
      payload: packet.payload,
      hops: this.calculateHops(packet)
    });
    
    // Deliver to application layer (always process broadcasts)
    // TODO: Emit event or callback to notify UI layer
    
    // Forward to other peers (flood with loop prevention)
    console.log('🔄 Forwarding broadcast to other peers');
    this.floodBroadcast(packet, this.getLastHopFromPacket(packet));
  }

  /**
   * Floods a broadcast message to all connected peers except the sender
   */
  private floodBroadcast(packet: DataPacket, excludeDevice?: string) {
    console.log(`📡 Flooding broadcast message${excludeDevice ? ` (excluding ${excludeDevice})` : ''}`);
    
    // Get all connected peers
    const connectedDevices = Array.from(this.connectedPeers);
    
    if (connectedDevices.length === 0) {
      console.log('📭 No connected peers to forward broadcast to');
      return;
    }
    
    // Send to each connected peer except the one we received it from
    connectedDevices.forEach(deviceAddress => {
      if (deviceAddress !== excludeDevice) {
        console.log(`📤 Sending broadcast to ${deviceAddress}`);
        this.sendPacketToDevice(deviceAddress, packet);
      }
    });
  }

  /**
   * Extracts the last hop device address from a packet (for flood control)
   */
  private getLastHopFromPacket(packet: DataPacket): string | undefined {
    // In a real implementation, you might track the path or sender info
    // For now, we'll use a simple approach
    return undefined; // This means we'll rely on the broadcast cache for loop prevention
  }

  private cleanupExpiredRoutes() {
    const now = Date.now();
    const expiredRoutes: string[] = [];
    
    for (const [destination, route] of this.routingTable.entries()) {
      if (now - route.timestamp > RoutingService.ROUTE_TIMEOUT) {
        expiredRoutes.push(destination);
      }
    }
    
    expiredRoutes.forEach(dest => {
      console.log(`⏰ Route to ${dest} expired, removing`);
      this.routingTable.delete(dest);
    });
    
    if (expiredRoutes.length > 0) {
      console.log(`🧹 Cleaned up ${expiredRoutes.length} expired routes`);
    }
  }

  /**
   * Handles route error packets
   */
  private handleRerrPacket(packet: RERRPacket) {
    console.log(`⚠️ Received RERR for broken link: ${packet.brokenLink[0]} <-> ${packet.brokenLink[1]}`);
    
    // Remove routes that use the broken link
    const brokenRoutes: string[] = [];
    for (const [destination, route] of this.routingTable.entries()) {
      if (route.nextHop === packet.brokenLink[0] || route.nextHop === packet.brokenLink[1]) {
        brokenRoutes.push(destination);
      }
    }
    
    brokenRoutes.forEach(dest => {
      console.log(`🗑️ Removing broken route to ${dest}`);
      this.routingTable.delete(dest);
    });
    
    // Forward RERR to other nodes if we have affected routes
    if (brokenRoutes.length > 0) {
      this.broadcastPacket(packet);
    }
  }

  /**
   * Sends an RREP back to the source
   */
  private sendRREP(destinationId: string, originalRreqId: string, hopCount: number) {
    const rrepPacket: RREPPacket = {
      type: PacketType.RREP,
      packetId: `rrep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceId: this.myPersistentId,
      destinationId,
      hopCount: hopCount + 1,
      path: [this.myDeviceAddress],
      timestamp: Date.now(),
    };

    // Send RREP along reverse path
    const reverseRoute = this.reverseRoutes.get(destinationId);
    if (reverseRoute) {
      console.log(`📨 Sending RREP to ${destinationId} via ${reverseRoute.nextHop}`);
      this.sendPacketToDevice(reverseRoute.nextHop, rrepPacket);
    } else {
      console.error(`❌ No reverse route to ${destinationId} for RREP`);
    }
  }

  /**
   * Forwards an RREQ to all neighbors except the sender
   */
  private forwardRREQ(packet: RREQPacket, excludeDevice?: string) {
    const nextRreq: RREQPacket = {
      ...packet,
      hopCount: packet.hopCount + 1,
      path: [...packet.path, this.myDeviceAddress],
    };
    
    this.broadcastPacket(nextRreq, excludeDevice);
  }

  /**
   * Forwards an RREP along the reverse path
   */
  private forwardRREP(packet: RREPPacket) {
    const reverseRoute = this.reverseRoutes.get(packet.destinationId);
    if (reverseRoute) {
      const nextRrep: RREPPacket = {
        ...packet,
        path: [...packet.path, this.myDeviceAddress],
      };
      
      console.log(`🔄 Forwarding RREP to ${packet.destinationId} via ${reverseRoute.nextHop}`);
      this.sendPacketToDevice(reverseRoute.nextHop, nextRrep);
    } else {
      console.error(`❌ No reverse route to forward RREP to ${packet.destinationId}`);
    }
  }

  private printRoutingTable() {
    console.log('📋 Current Routing Table:');
    if (this.routingTable.size === 0) {
      console.log('  (empty)');
    } else {
      for (const [dest, route] of this.routingTable.entries()) {
        console.log(`  ${dest} -> ${route.nextHop} (${route.hopCount} hops, ${route.isDirect ? 'direct' : 'indirect'})`);
      }
    }
  }

  /**
   * Broadcasts a packet to all connected peers
   */
  private broadcastPacket(packet: Packet, excludeDevice?: string) {
    console.log(`📡 Broadcasting ${packet.type} packet${excludeDevice ? ` (excluding ${excludeDevice})` : ''}`);
    
    // Use MeshNetwork to broadcast
    try {
      const packetString = JSON.stringify(packet);
      MeshNetwork.sendMessage(packetString, this.username, null); // null = broadcast
    } catch (error) {
      console.error('Failed to broadcast packet:', error);
    }
  }

  /**
   * Sends a packet to a specific device
   */
  private sendPacketToDevice(deviceAddress: string, packet: Packet) {
    try {
      const packetString = JSON.stringify(packet);
      console.log(`📤 Sending ${packet.type} to ${deviceAddress}`);
      MeshNetwork.sendMessage(packetString, this.username, deviceAddress);
    } catch (error) {
      console.error(`Failed to send packet to ${deviceAddress}:`, error);
      
      // If sending fails, the link might be broken
      if (packet.type === PacketType.DATA) {
        this.handleBrokenLink(deviceAddress);
      }
    }
  }

  /**
   * Handles a broken link by sending RERR and updating routes
   */
  private handleBrokenLink(brokenDeviceAddress: string) {
    console.log(`💔 Detected broken link to ${brokenDeviceAddress}`);
    
    // Find all routes that use this broken link
    const affectedDestinations: string[] = [];
    for (const [destination, route] of this.routingTable.entries()) {
      if (route.nextHop === brokenDeviceAddress) {
        affectedDestinations.push(destination);
        this.routingTable.delete(destination);
      }
    }
    
    // Send RERR if there are affected routes
    if (affectedDestinations.length > 0) {
      const rerrPacket: RERRPacket = {
        type: PacketType.RERR,
        packetId: `rerr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceId: this.myPersistentId,
        destinationId: 'BROADCAST',
        brokenLink: [this.myDeviceAddress, brokenDeviceAddress],
        timestamp: Date.now(),
      };
      
      console.log(`📢 Broadcasting RERR for ${affectedDestinations.length} affected routes`);
      this.broadcastPacket(rerrPacket);
    }
    
    // Remove from connected peers
    this.connectedPeers.delete(brokenDeviceAddress);
  }

  /**
   * Public methods for network management
   */
  public addConnectedPeer(deviceAddress: string, persistentId?: string) {
    this.connectedPeers.add(deviceAddress);
    
    // Add direct route if we have the persistent ID
    if (persistentId) {
      const directRoute: Route = {
        destination: persistentId,
        nextHop: deviceAddress,
        hopCount: 1,
        timestamp: Date.now(),
        isDirect: true
      };
      
      this.routingTable.set(persistentId, directRoute);
      console.log(`➕ Added direct route to ${persistentId} via ${deviceAddress}`);
    }
  }

  public removeConnectedPeer(deviceAddress: string) {
    this.connectedPeers.delete(deviceAddress);
    
    // Remove direct routes using this device
    const routesToRemove: string[] = [];
    for (const [dest, route] of this.routingTable.entries()) {
      if (route.nextHop === deviceAddress && route.isDirect) {
        routesToRemove.push(dest);
      }
    }
    
    routesToRemove.forEach(dest => {
      console.log(`➖ Removed direct route to ${dest}`);
      this.routingTable.delete(dest);
    });
  }

  public getRoutingTable(): Map<string, Route> {
    return new Map(this.routingTable);
  }

  public getConnectedPeers(): Set<string> {
    return new Set(this.connectedPeers);
  }

  public updateMyInfo(deviceAddress: string, username: string) {
    this.myDeviceAddress = deviceAddress;
    this.username = username;
    console.log(`📝 Updated device info: ${deviceAddress}, ${username}`);
  }
}

export const routingService = RoutingService.getInstance();
