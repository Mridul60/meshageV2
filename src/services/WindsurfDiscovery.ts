import { NativeModules } from 'react-native';
import { NodeIdentity, NodeMessage } from './NodeIdentity';

const { MeshNetwork } = NativeModules;

export interface WindsurfPeer {
  nodeId: string;
  sessionId: string;
  lastSeen: number;
}

class WindsurfDiscovery {
  private static instance: WindsurfDiscovery;

  private peers: Map<string, WindsurfPeer> = new Map(); // key: nodeId
  private intervalId: any | null = null;
  private username: string = 'User';

  private static readonly DISCOVERY_INTERVAL_MS = 3000; // 3 seconds
  private static readonly PEER_TIMEOUT_MS = 10_000; // 10 seconds

  private constructor() {}

  public static getInstance(): WindsurfDiscovery {
    if (!WindsurfDiscovery.instance) {
      WindsurfDiscovery.instance = new WindsurfDiscovery();
    }
    return WindsurfDiscovery.instance;
  }

  /**
   * Start the continuous discovery loop. Safe to call multiple times.
   */
  public start(username: string) {
    this.username = username || 'User';

    if (this.intervalId) {
      return; // already running
    }

    this.intervalId = setInterval(() => {
      this.broadcastDiscover();
      this.cleanupPeers();
    }, WindsurfDiscovery.DISCOVERY_INTERVAL_MS);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Called whenever we receive a NodeMessage from the network.
   * Applies self-filtering and updates the peer list.
   */
  public handleIncoming(envelope: NodeMessage<any>, fromAddress: string) {
    const myNodeId = NodeIdentity.tryGetNodeId();
    if (myNodeId && envelope.nodeId === myNodeId) {
      // SELF-PROTECTION: never process our own nodeId
      return;
    }

    const now = Date.now();

    // Update or insert peer entry for any valid non-self message
    const existing = this.peers.get(envelope.nodeId);
    if (existing) {
      existing.sessionId = envelope.sessionId;
      existing.lastSeen = now;
    } else {
      this.peers.set(envelope.nodeId, {
        nodeId: envelope.nodeId,
        sessionId: envelope.sessionId,
        lastSeen: now,
      });
    }

    // If this is a DISCOVER from a non-self peer, respond with RESPONSE
    if (envelope.type === 'DISCOVER') {
      this.sendResponse(fromAddress);
    }
  }

  public getPeers(): WindsurfPeer[] {
    return Array.from(this.peers.values());
  }

  private broadcastDiscover() {
    try {
      const nodeId = NodeIdentity.getNodeId();
      const sessionId = NodeIdentity.getSessionId();

      const discoverEnvelope: NodeMessage<{}> = {
        nodeId,
        sessionId,
        type: 'DISCOVER',
        payload: {},
      };

      const message = JSON.stringify(discoverEnvelope);
      MeshNetwork.sendMessage(message, this.username, null); // broadcast
    } catch (error) {
      console.error('WindsurfDiscovery.broadcastDiscover error:', error);
    }
  }

  private sendResponse(toAddress: string) {
    try {
      const nodeId = NodeIdentity.getNodeId();
      const sessionId = NodeIdentity.getSessionId();

      const responseEnvelope: NodeMessage<{}> = {
        nodeId,
        sessionId,
        type: 'RESPONSE',
        payload: {},
      };

      const message = JSON.stringify(responseEnvelope);
      MeshNetwork.sendMessage(message, this.username, toAddress);
    } catch (error) {
      console.error('WindsurfDiscovery.sendResponse error:', error);
    }
  }

  private cleanupPeers() {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [nodeId, peer] of this.peers.entries()) {
      if (now - peer.lastSeen > WindsurfDiscovery.PEER_TIMEOUT_MS) {
        toDelete.push(nodeId);
      }
    }

    toDelete.forEach(id => this.peers.delete(id));
  }
}

export const windsurfDiscovery = WindsurfDiscovery.getInstance();
