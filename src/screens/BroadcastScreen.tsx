import React, { useState } from 'react';
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
import NearbyDevicesModal from './components/NearbyDevicesModal';

interface Message {
    id: string;
    text: string;
    isSent: boolean;
}

interface BroadcastScreenProps {
    navigation: any;
}

// Mock devices data for frontend development
const mockDevices = [
    { id: '1', name: 'Shahid Anowar', isFriend: true },
    { id: '2', name: 'Sourav Sharma', isFriend: false },
    { id: '3', name: 'Sanjeev Iqbal Ahmed', isFriend: false },
    { id: '4', name: 'Faruk Khan', isFriend: true },
];

export default function BroadcastScreen({ }: BroadcastScreenProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Welcome to the mesh.', isSent: false },
        { id: '2', text: 'Hello everyone!', isSent: true },
        { id: '3', text: 'This is a sample message.', isSent: false },
        { id: '4', text: 'Looks good!', isSent: true },
    ]);

    const handleSend = () => {
        if (message.trim()) {
            setMessages([
                ...messages,
                {
                    id: Date.now().toString(),
                    text: message,
                    isSent: true,
                },
            ]);
            setMessage('');
        }
    };

    const handleDevicesPress = () => {
        setModalVisible(true);
    };

    const handleMessage = (deviceId: string) => {
        console.log('Message device:', deviceId);
        // TODO: Navigate to chat or handle message action
        setModalVisible(false);
    };

    const handleAddFriend = (deviceId: string) => {
        console.log('Add friend:', deviceId);
        // TODO: Handle add friend logic (update backend when ready)
    };

    return (
        <View style={styles.container}>
            {/* STATUS BAR */}
            <View style={styles.statusBar}>
                <Text style={styles.statusLabel}>Broadcast Status:</Text>
                <Text style={styles.statusValue}>DISCONNECTED</Text>
                <TouchableOpacity
                    style={styles.statusRight}
                    onPress={handleDevicesPress}
                    activeOpacity={0.7}
                >
                    <View style={styles.statusDot} />
                    <Text style={styles.statusCount}>{mockDevices.length}</Text>
                </TouchableOpacity>
            </View>

            {/* CHAT MESSAGES */}
            <KeyboardAvoidingView
                style={styles.flexContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageRow,
                                msg.isSent ? styles.sentRow : styles.receivedRow,
                            ]}
                        >
                            {!msg.isSent && <View style={styles.avatar} />}
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
                            {msg.isSent && <View style={styles.avatar} />}
                        </View>
                    ))}
                </ScrollView>

                {/* INPUT BAR */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your message"
                        placeholderTextColor="#888"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Send size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* NEARBY DEVICES MODAL */}
            <NearbyDevicesModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                devices={mockDevices}
                onMessage={handleMessage}
                onAddFriend={handleAddFriend}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E1DE',
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
        backgroundColor: '#22C55E',
        borderWidth: 1,
        borderColor: '#000',
    },
    statusCount: {
        fontSize: 12,
        color: '#22C55E',
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#E5E1DE',
    },
    scrollContent: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexGrow: 1,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    messageBubble: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        maxWidth: '70%',
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#FFF',
        marginHorizontal: 10,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E1DE',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        borderTopWidth: 1,
        borderTopColor: '#00000020',
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
});