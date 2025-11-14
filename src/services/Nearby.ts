import { NativeModules, NativeEventEmitter } from 'react-native';

const { NearbyModule } = NativeModules as { NearbyModule?: any };

const emitter = NearbyModule ? new NativeEventEmitter(NearbyModule) : null;

export type NearbyEvents = {
  onEndpointFound?: (data: { id: string; name: string }) => void;
  onEndpointLost?: (data: { id: string }) => void;
  onConnectionChanged?: (data: { id: string; connected: boolean }) => void;
  onMessageReceived?: (data: { fromId: string; message: string; timestamp: number }) => void;
};

export const Nearby = {
  async start(endpointName: string) {
    if (!NearbyModule) return false;
    return NearbyModule.start(endpointName);
  },
  async stop() {
    if (!NearbyModule) return false;
    return NearbyModule.stop();
  },
  async connect(endpointId: string) {
    if (!NearbyModule) return false;
    return NearbyModule.connect(endpointId);
  },
  async sendMessage(message: string, targetId?: string | null) {
    if (!NearbyModule) return false;
    return NearbyModule.sendMessage(message, targetId ?? null);
  },
  addListeners(handlers: NearbyEvents) {
    if (!emitter || !NearbyModule) return { remove: () => {} };

    const subs = [
      handlers.onEndpointFound &&
        emitter.addListener('Nearby_onEndpointFound', handlers.onEndpointFound),
      handlers.onEndpointLost &&
        emitter.addListener('Nearby_onEndpointLost', handlers.onEndpointLost),
      handlers.onConnectionChanged &&
        emitter.addListener('Nearby_onConnectionChanged', handlers.onConnectionChanged),
      handlers.onMessageReceived &&
        emitter.addListener('Nearby_onMessageReceived', handlers.onMessageReceived),
    ].filter(Boolean) as { remove: () => void }[];

    return {
      remove() {
        subs.forEach(s => s.remove());
      },
    };
  },
};
