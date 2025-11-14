/**
 * Unified packet structure for the AODV-like routing protocol.
 */

// Defines the purpose of a network packet
export enum PacketType {
  DATA = 'DATA', // User-facing message
  RREQ = 'RREQ', // Route Request
  RREP = 'RREP', // Route Reply
  RERR = 'RERR', // Route Error
}

// Represents an entry in the routing table
export interface Route {
  destination: string; // Final destination's persistentId
  nextHop: string; // The deviceAddress of the next peer in the path
  hopCount: number; // Number of hops to the destination
  timestamp: number; // When the route was last updated
  isDirect: boolean; // True if the destination is a direct neighbor
}

// Base structure for all network packets
interface BasePacket {
  type: PacketType;
  packetId: string; // Unique ID for this packet
  sourceId: string; // persistentId of the original sender
  destinationId: string; // persistentId of the final recipient
  timestamp: number;
}

// Packet for discovering a route
export interface RREQPacket extends BasePacket {
  type: PacketType.RREQ;
  hopCount: number; // Incremented by each node that forwards the RREQ
  path: string[]; // List of deviceAddresses this RREQ has traversed
}

// Packet for replying to a route request
export interface RREPPacket extends BasePacket {
  type: PacketType.RREP;
  hopCount: number; // Hop count from the destination back to the source
  path: string[]; // The full path from source to destination
}

// Packet for notifying others of a broken link
export interface RERRPacket extends BasePacket {
  type: PacketType.RERR;
  brokenLink: [string, string]; // The two nodes involved in the broken link
}

// Packet containing the actual user message
export interface DataPacket extends BasePacket {
  type: PacketType.DATA;
  payload: any; // The actual message content (e.g., text, friend request)
  senderName: string; // Display name of the sender
}

// A union of all possible packet types
export type Packet = RREQPacket | RREPPacket | RERRPacket | DataPacket;
