import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Send } from 'lucide-react-native';
import NearbyDevicesModal from './NearbyDevicesModal';
import { useBroadcastScreen } from './useBroadcastScreen';

interface BroadcastScreenProps {
    navigation: any;
}

export default function BroadcastScreen({ navigation }: BroadcastScreenProps) {
    const {
        status,
        peers,
        connectedPeers,
        messages,
        messageText,
        showDevicesModal,
        messagesEndRef,
        setMessageText,
        setShowDevicesModal,
        handleSendMessage,
        handleAddFriend,
        isFriend,
    } = useBroadcastScreen();

    const handleDevicesPress = () => {
        setShowDevicesModal(true);
    };

    const handleMessage = (deviceId: string) => {
        console.log('Message device:', deviceId);
        // TODO: Navigate to personal chat when implemented
        setShowDevicesModal(false);
    };

    // Transform peers to match NearbyDevicesModal format
    const devicesForModal = peers.map(peer => ({
        id: peer.deviceAddress,
        name: peer.displayName || peer.deviceName,
        isFriend: isFriend(peer.persistentId),
    }));

    return (
        <View style={styles.container}>
            {/* STATUS BAR */}
            <View style={styles.statusBar}>
                <Text style={styles.statusLabel}>Broadcast Status:</Text>
                <Text style={styles.statusValue}>{status}</Text>
                <TouchableOpacity
                    style={styles.statusRight}
                    onPress={handleDevicesPress}
                    activeOpacity={0.7}
                >
                    <View style={[
                        styles.statusDot,
                        connectedPeers.length > 0 && styles.statusDotConnected
                    ]} />
                    <Text style={[
                        styles.statusCount,
                        connectedPeers.length > 0 && styles.statusCountConnected
                    ]}>
                        {peers.length}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* CHAT MESSAGES */}
            <KeyboardAvoidingView
                style={styles.flexContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={messagesEndRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() =>
                        messagesEndRef.current?.scrollToEnd({ animated: true })
                    }
                >
                    {messages.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {connectedPeers.length > 0
                                    ? 'No messages yet. Start broadcasting!'
                                    : 'Waiting for peers to connect\nDiscovering nearby devices...'}
                            </Text>
                        </View>
                    ) : (
                        messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageRow,
                                    msg.isSent ? styles.sentRow : styles.receivedRow,
                                ]}
                            >
                                {!msg.isSent && <View style={styles.avatar} />}
                                <View style={styles.messageContainer}>
                                    {!msg.isSent && (
                                        <Text style={styles.senderName}>
                                            {msg.senderName || 'Unknown'}
                                        </Text>
                                    )}
                                    <View
                                        style={[
                                            styles.messageBubble,
                                            msg.isSent
                                                ? styles.sentBubble
                                                : styles.receivedBubble,
                                        ]}
                                    >
                                        <Text style={styles.messageText}>{msg.text}</Text>
                                    </View>
                                    <Text style={styles.messageTime}>
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </Text>
                                </View>
                                {msg.isSent && <View style={styles.avatar} />}
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* INPUT BAR */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your message"
                        placeholderTextColor="#888"
                        value={messageText}
                        onChangeText={setMessageText}
                        onSubmitEditing={handleSendMessage}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !messageText.trim() && styles.sendButtonDisabled
                        ]}
                        onPress={handleSendMessage}
                        disabled={!messageText.trim()}
                    >
                        <Send size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* NEARBY DEVICES MODAL */}
            <NearbyDevicesModal
                visible={showDevicesModal}
                onClose={() => setShowDevicesModal(false)}
                devices={devicesForModal}
                onMessage={handleMessage}
                onAddFriend={handleAddFriend}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    flexContainer: {
        flex: 1,
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    statusLabel: {
        fontSize: 12,
        color: '#000',
        fontWeight: '600',
    },
    statusValue: {
        fontSize: 12,
        color: '#000',
        fontWeight: '700',
        marginLeft: 4,
    },
    statusRight: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#EF4444',
        borderWidth: 1,
        borderColor: '#000',
    },
    statusDotConnected: {
        backgroundColor: '#22C55E',
    },
    statusCount: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '700',
    },
    statusCountConnected: {
        color: '#22C55E',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    sentRow: {
        justifyContent: 'flex-end',
    },
    receivedRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#000',
    },
    messageContainer: {
        marginHorizontal: 10,
        maxWidth: '70%',
    },
    senderName: {
        fontSize: 11,
        color: '#666',
        marginBottom: 4,
        marginLeft: 4,
    },
    messageBubble: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#FFF',
    },
    receivedBubble: {
        transform: [{ skewX: '-10deg' }],
    },
    sentBubble: {
        transform: [{ skewX: '10deg' }],
    },
    messageText: {
        color: '#000',
        fontSize: 14,
        transform: [{ skewX: '0deg' }],
    },
    messageTime: {
        fontSize: 10,
        color: '#888',
        marginTop: 4,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20,
        paddingHorizontal: 16,
        height: 44,
        fontSize: 14,
        color: '#000',
    },
    sendButton: {
        width: 44,
        height: 44,
        marginLeft: 8,
        borderRadius: 22,
        backgroundColor: '#F59E0B',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});