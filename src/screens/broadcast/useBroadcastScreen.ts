/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import {
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
import { Nearby } from '../../services/Nearby';

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
    const peersRef = useRef<Peer[]>([]);

    const requestPermissions = async (): Promise<boolean> => {
        if (Platform.OS !== 'android') return true;

        const permissionsToRequest: Array<typeof PermissionsAndroid.PERMISSIONS[keyof typeof PermissionsAndroid.PERMISSIONS]> = [];

        if (Platform.Version >= 33) {
            permissionsToRequest.push(
                PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            );
        } else if (Platform.Version >= 31) {
            permissionsToRequest.push(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            );
        } else {
            permissionsToRequest.push(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            );
        }

        try {
            const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);
            const anyGranted = Object.values(granted).some(
                r => r === PermissionsAndroid.RESULTS.GRANTED,
            );
            return anyGranted;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const updatePeers = (updater: (prev: Peer[]) => Peer[]) => {
        setPeers(prev => {
            const next = updater(prev);
            peersRef.current = next;
            return next;
        });
    };

    useEffect(() => {
        const initializeApp = async () => {
            // Load username and persistent ID
            const savedUsername = await StorageService.getUsername();
            const savedPersistentId = await StorageService.getPersistentId();

            const deviceIdentifier = savedUsername
                ? `${savedUsername}|${savedPersistentId}`
                : `User|${savedPersistentId}`;

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

            const hasPermission = await requestPermissions();
            if (!hasPermission) {
                setStatus('PERMISSION_REQUIRED');
                return;
            }

            setStatus('DISCOVERING');
            await Nearby.start(deviceIdentifier);
        };

        initializeApp();

        const subs = Nearby.addListeners({
            onEndpointFound: ({ id, name }) => {
                const { displayName, persistentId } = parseDeviceIdentifier(name);
                updatePeers(prev => {
                    const existingIndex = prev.findIndex(p => p.deviceAddress === id);
                    const nextPeer: Peer = {
                        deviceAddress: id,
                        deviceName: name,
                        status: 3,
                        displayName,
                        persistentId,
                    };
                    if (existingIndex >= 0) {
                        const copy = [...prev];
                        copy[existingIndex] = nextPeer;
                        return copy;
                    }
                    return [...prev, nextPeer];
                });

                // Auto-connect to discovered endpoints
                Nearby.connect(id).catch(() => { });
            },
            onEndpointLost: ({ id }) => {
                updatePeers(prev => prev.filter(p => p.deviceAddress !== id));
                setConnectedPeers(prev => prev.filter(p => p !== id));
            },
            onConnectionChanged: ({ id, connected }) => {
                setConnectedPeers(prev => {
                    let next: string[];
                    if (connected) {
                        next = [...new Set([...prev, id])];
                    } else {
                        next = prev.filter(p => p !== id);
                    }
                    setStatus(next.length > 0 ? 'CONNECTED' : 'DISCONNECTED');
                    return next;
                });
            },
            onMessageReceived: ({ fromId, message, timestamp }) => {
                const peer = peersRef.current.find(p => p.deviceAddress === fromId);
                const senderName = peer?.displayName || peer?.deviceName || 'Unknown';
                const newMessage: Message = {
                    id: `${timestamp}-${fromId}`,
                    text: message,
                    fromAddress: fromId,
                    senderName,
                    timestamp,
                    isSent: false,
                };
                setMessages(prev => [...prev, newMessage]);
            },
        });

        return () => {
            subs.remove();
            Nearby.stop().catch(() => { });
        };
    }, []);

    const handleSendMessage = () => {
        if (!messageText.trim()) return;

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
        Nearby.sendMessage(messageText, null).catch(() => { });
        setMessageText('');

        setTimeout(() => {
            messagesEndRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleAddFriend = async (deviceId: string) => {
        const peer = peers.find(p => p.deviceAddress === deviceId);
        if (!peer || !peer.persistentId) return;

        const friendRequestMessage = `FRIEND_REQUEST:${persistentId}:${username}`;
        // Send friend request via Nearby to this specific endpoint
        Nearby.sendMessage(friendRequestMessage, peer.deviceAddress).catch(() => { });

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