export type NodeMessageType = 'DISCOVER' | 'RESPONSE' | 'DATA';

export interface NodeMessage<T = any> {
  nodeId: string;
  sessionId: string;
  type: NodeMessageType;
  payload: T;
}

const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

let nodeId: string | null = null;
const sessionId: string = generateUuid();

export const NodeIdentity = {
  setNodeId(id: string) {
    nodeId = id;
  },
  getNodeId(): string {
    if (!nodeId) {
      throw new Error('NodeIdentity not initialized');
    }
    return nodeId;
  },
  tryGetNodeId(): string | null {
    return nodeId;
  },
  getSessionId(): string {
    return sessionId;
  },
};
