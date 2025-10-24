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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <Text style={styles.header}>Broadcast</Text>
                <View style={styles.messagesContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageBubble,
                                    msg.isSent ? styles.sentMessage : styles.receivedMessage,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.messageText,
                                        msg.isSent ? styles.sentText : styles.receivedText,
                                    ]}
                                >
                                    {msg.text}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type your message"
                        placeholderTextColor="#9ca3af"
                        style={styles.input}
                        multiline={false}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Send color="#000000" size={20} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </MobileShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
        color: '#737373',
        marginBottom: 8,
    },
    messagesContainer: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 12,
        gap: 8,
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        marginBottom: 8,
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#fef3c7',
        borderWidth: 1,
        borderColor: '#fcd34d',
    },
    messageText: {
        fontSize: 14,
    },
    receivedText: {
        color: '#000000',
    },
    sentText: {
        color: '#78350f',
    },
    inputContainer: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    input: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d4d4d8',
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#000000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#f59e0b',
        alignItems: 'center',
        justifyContent: 'center',
    },
});