/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import {
    NativeModules,
    NativeEventEmitter,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import type {
    Peer,
    Message,
    DiscoveryEvent,
    ConnectionInfo,
    MessageReceivedEvent,
    FriendRequest,
} from '../../types';
import { StorageService } from '../../utils/storage';
import { routingService } from '../../services/RoutingService';
import { DataPacket, PacketType } from '../../types/routing';

const { MeshNetwork } = NativeModules;
const MeshNetworkEvents = new NativeEventEmitter(MeshNetwork);

// Parse device identifier "username|persistentId"
const parseDeviceIdentifier = (deviceName: string): { displayName: string; persistentId?: string } => {
    const parts = deviceName.split('|');
    if (parts.length === 2) {
        return {
            displayName: parts[0],
            persistentId: parts[1],
        };
    }
    return {
        displayName: deviceName,
        persistentId: undefined,
    };
};

export const useBroadcastScreen = () => {
    const [status, setStatus] = useState<string>('DISCONNECTED');
    const [peers, setPeers] = useState<Peer[]>([]);
    const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState<string>('');
    const [username, setUsername] = useState<string>('User');
    const [persistentId, setPersistentId] = useState<string>('');
    const [friendsList, setFriendsList] = useState<Set<string>>(new Set());
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [showDevicesModal, setShowDevicesModal] = useState<boolean>(false);
    const messagesEndRef = useRef<any>(null);
    const hasAutoStarted = useRef<boolean>(false);
    const connectionAttempts = useRef<Map<string, number>>(new Map());
    const connectionRetryTimers = useRef<Map<string, any>>(new Map());

    const requestPermissions = async (): Promise<boolean> => {
        if (Platform.OS !== 'android') return true;

        const permissionsToRequest: Array<typeof PermissionsAndroid.PERMISSIONS[keyof typeof PermissionsAndroid.PERMISSIONS]> = [];

        if (Platform.Version >= 33) {
            permissionsToRequest.push(
                PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            );
        } else if (Platform.Version >= 31) {
            permissionsToRequest.push(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
        } else {
            permissionsToRequest.push(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            );
        }

        try {
            const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);
            const allGranted = Object.values(granted).every(
                r => r === PermissionsAndroid.RESULTS.GRANTED,
            );
            return allGranted;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    useEffect(() => {
        const initializeApp = async () => {
            // Load username and persistent ID
            const savedUsername = await StorageService.getUsername();
            const savedPersistentId = await StorageService.getPersistentId();

            // Create device identifier for routing
            const deviceIdentifier = savedUsername
                ? `${savedUsername}|${savedPersistentId}`
                : `User|${savedPersistentId}`;

            // Initialize the routing service with our ID, device address, and username
            routingService.initialize(savedPersistentId, deviceIdentifier, savedUsername || 'User');

            if (savedUsername) {
                setUsername(savedUsername);
            }
            setPersistentId(savedPersistentId);

            // Load friends list
            const friends = await StorageService.getFriends();
            setFriendsList(new Set(friends.map(f => f.persistentId)));

            // Load friend requests
            const requests = await StorageService.getFriendRequests();
            setFriendRequests(requests);

            MeshNetwork.setDeviceName(deviceIdentifier);
            MeshNetwork.init();
            setStatus('DISCONNECTED');

            // Auto-start discovery
            if (!hasAutoStarted.current) {
                hasAutoStarted.current = true;
                const hasPermission = await requestPermissions();
                if (hasPermission) {
                    setTimeout(() => {
                        MeshNetwork.discoverPeers();
                    }, 1000);
                }
            }
        };

        initializeApp();

        const attemptConnection = (peer: Peer) => {
            const attempts = connectionAttempts.current.get(peer.deviceAddress) || 0;
            const maxAttempts = 3;

            if (!connectedPeers.includes(peer.deviceAddress)) {
                if (attempts >= maxAttempts) {
                    return;
                }

                MeshNetwork.connectToPeer(peer.deviceAddress);
                connectionAttempts.current.set(peer.deviceAddress, attempts + 1);

                const existingTimer = connectionRetryTimers.current.get(peer.deviceAddress);
                if (existingTimer) {
                    clearTimeout(existingTimer);
                }

                const retryTimer = setTimeout(() => {
                    if (!connectedPeers.includes(peer.deviceAddress) &&
                        peers.some(p => p.deviceAddress === peer.deviceAddress)) {
                        attemptConnection(peer);
                    }
                }, 3000);

                connectionRetryTimers.current.set(peer.deviceAddress, retryTimer);
            }
        };

        const onPeersFoundListener = MeshNetworkEvents.addListener(
            'onPeersFound',
            (event: Peer[]) => {
                const parsedPeers = event.map((peer: Peer) => {
                    const { displayName, persistentId } = parseDeviceIdentifier(peer.deviceName);
                    return { ...peer, displayName, persistentId };
                });

                setPeers(parsedPeers);

                parsedPeers.forEach((peer: Peer) => {
                    if ((peer.status === 3 || peer.status !== 0) && !connectedPeers.includes(peer.deviceAddress)) {
                        attemptConnection(peer);
                    }
                });
            },
        );

        const onDiscoveryStateChangedListener = MeshNetworkEvents.addListener(
            'onDiscoveryStateChanged',
            (event: DiscoveryEvent | string) => {
                let eventStatus: string;

                if (typeof event === 'object' && event.status) {
                    eventStatus = event.status;
                } else {
                    eventStatus = event as string;
                }

                if (eventStatus.includes('Failed')) {
                    setStatus('DISCONNECTED');
                    setTimeout(() => {
                        MeshNetwork.discoverPeers();
                    }, 3000);
                }
            },
        );

        const onConnectionChangedListener = MeshNetworkEvents.addListener(
            'onConnectionChanged',
            (event: ConnectionInfo | boolean) => {
                if (typeof event === 'boolean') {
                    if (!event) {
                        setConnectedPeers([]);
                        setStatus('DISCONNECTED');
                    }
                } else {
                    setStatus('CONNECTED');
                }
            },
        );

        const onPeerConnectedListener = MeshNetworkEvents.addListener(
            'onPeerConnected',
            (data: { address: string } | string) => {
                const address = typeof data === 'string' ? data : data.address;
                setConnectedPeers(prev => [...new Set([...prev, address])]);
                setStatus('CONNECTED');

                const timer = connectionRetryTimers.current.get(address);
                if (timer) {
                    clearTimeout(timer);
                    connectionRetryTimers.current.delete(address);
                }
                connectionAttempts.current.delete(address);
            },
        );

        const onPeerDisconnectedListener = MeshNetworkEvents.addListener(
            'onPeerDisconnected',
            (data: { address: string } | string) => {
                const address = typeof data === 'string' ? data : data.address;
                setConnectedPeers(prev => prev.filter(p => p !== address));
                if (connectedPeers.length <= 1) {
                    setStatus('DISCONNECTED');
                }
            },
        );

        const onMessageReceivedListener = MeshNetworkEvents.addListener(
            'onMessageReceived',
            (packetString: string) => {
                // All incoming messages are now treated as packets and handled by the RoutingService
                routingService.handleIncomingPacket(packetString);
            }
        );

        const onConnectionErrorListener = MeshNetworkEvents.addListener(
            'onConnectionError',
            (error: any) => {
                const reasonCode = error?.reasonCode || error;
                const deviceAddress = error?.deviceAddress;

                if (reasonCode === 1) return;

                if (reasonCode === 3) {
                    const timer = connectionRetryTimers.current.get(deviceAddress);
                    if (timer) {
                        clearTimeout(timer);
                        connectionRetryTimers.current.delete(deviceAddress);
                    }
                    connectionAttempts.current.delete(deviceAddress);
                }
            },
        );

        return () => {
            onPeersFoundListener.remove();
            onDiscoveryStateChangedListener.remove();
            onConnectionChangedListener.remove();
            onPeerConnectedListener.remove();
            onPeerDisconnectedListener.remove();
            onMessageReceivedListener.remove();
            onConnectionErrorListener.remove();

            connectionRetryTimers.current.forEach((timer) => {
                clearTimeout(timer);
            });
            connectionRetryTimers.current.clear();
            connectionAttempts.current.clear();
        };
    }, [connectedPeers, peers]);

    const handleSendMessage = (destinationId: string | null) => {
        if (!messageText.trim()) return;

        // For broadcast screen, always send as broadcast
        if (!destinationId) {
            // Use the new broadcast functionality
            routingService.sendBroadcast({
                text: messageText,
                type: 'BROADCAST_MESSAGE'
            }, 'BROADCAST');
        } else {
            // If a specific destination is provided, use regular routing
            routingService.sendData(destinationId, {
                text: messageText,
                type: 'DIRECT_MESSAGE'
            });
        }

        // Optimistically display the message in the UI
        const newMessage: Message = {
            id: `${Date.now()}-sent`,
            text: messageText,
            fromAddress: 'me',
            senderName: username,
            timestamp: Date.now(),
            isSent: true,
        };

        setMessages(prev => [...prev, newMessage]);
        setMessageText('');

        setTimeout(() => {
            messagesEndRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleAddFriend = async (deviceId: string) => {
        const peer = peers.find(p => p.deviceAddress === deviceId);
        if (!peer || !peer.persistentId) return;

        const friendRequestMessage = `FRIEND_REQUEST:${persistentId}:${username}`;
        MeshNetwork.sendMessage(friendRequestMessage, username, peer.deviceAddress);

        await StorageService.addFriendRequest({
            persistentId: peer.persistentId,
            displayName: peer.displayName || peer.deviceName,
            deviceAddress: peer.deviceAddress,
            timestamp: Date.now(),
            type: 'outgoing',
        });

        setFriendRequests(prev => {
            const filtered = prev.filter(r => r.persistentId !== peer.persistentId);
            return [...filtered, {
                persistentId: peer.persistentId!,
                displayName: peer.displayName || peer.deviceName,
                deviceAddress: peer.deviceAddress,
                timestamp: Date.now(),
                type: 'outgoing' as const,
            }];
        });
    };

    const isFriend = (persistentId?: string): boolean => {
        if (!persistentId) return false;
        return friendsList.has(persistentId);
    };

    return {
        status,
        peers,
        connectedPeers,
        messages,
        messageText,
        username,
        showDevicesModal,
        friendRequests,
        messagesEndRef,
        setMessageText,
        setShowDevicesModal,
        handleSendMessage,
        handleAddFriend,
        isFriend,
    };
};