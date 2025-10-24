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
import MobileShell from '../components/mobileshell';
import { Send } from 'lucide-react-native';

interface Message {
    id: string;
    text: string;
    isSent: boolean;
}

export default function BroadcastScreen() {
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

    return (
        <MobileShell>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>MESHAGE</Text>
                </View>

                {/* STATUS BAR */}
                <View style={styles.statusBar}>
                    <Text style={styles.statusLabel}>Broadcast Status:</Text>
                    <Text style={styles.statusValue}>DISCONNECTED</Text>
                    <View style={styles.statusRight}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusCount}>4</Text>
                    </View>
                </View>

                {/* CHAT MESSAGES */}
                <View style={styles.chatContainer}>
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
                </View>

                {/* INPUT BAR */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your message"
                        placeholderTextColor="#000000"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Send size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </MobileShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E1DE',
    },
    header: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    headerText: {
        color: '#D4A373',
        fontWeight: '900',
        fontSize: 18,
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 6,
        paddingHorizontal: 8,
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
    chatContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 16,
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
        padding: 10,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20,
        paddingHorizontal: 14,
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
