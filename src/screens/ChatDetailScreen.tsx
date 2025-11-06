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
import { Send, ArrowLeft, Ban } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

interface Message {
    id: string;
    text: string;
    isSent: boolean;
}

export default function ChatDetailScreen({ navigation, route }: Props) {
    const { contactName, contactId } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hey, how are you?', isSent: false },
        { id: '2', text: 'I am good, thanks! What about you?', isSent: true },
        { id: '3', text: 'Doing great! Are you free this weekend?', isSent: false },
        { id: '4', text: 'Yes, I am free. What do you have in mind?', isSent: true },
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

        <SafeAreaView style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    {/* <View style={styles.avatar}>
                        <Ionicons name="person" size={20} color="#FFF" />
                    </View> */}
                    <Text style={styles.headerTitle}>{contactName}</Text>
                </View>

                <TouchableOpacity
                    style={styles.headerButton}
                    activeOpacity={0.7}
                >
                    <Ban size={18} color="#FF3B30" />
                </TouchableOpacity>
            </View>

            {/* CHAT MESSAGES */}
            <KeyboardAvoidingView
                style={styles.flexContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
                        </View>
                    ))}
                </ScrollView>

                {/* INPUT BAR */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your message"
                        placeholderTextColor="#999"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}
                        activeOpacity={0.7}
                    >
                        <Send size={22} color="#000" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // not grey
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 12,
    },
    headerButton: {
        padding: 4,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    flexContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#C0C0C0',
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        flexGrow: 1,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    sentRow: {
        justifyContent: 'flex-end',
    },
    receivedRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        maxWidth: '75%',
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#FFF',
    },
    receivedBubble: {
        transform: [{ skewX: '-8deg' }],
    },
    sentBubble: {
        transform: [{ skewX: '8deg' }],
    },
    messageText: {
        color: '#000',
        fontSize: 15,
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#292929',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 20 : 16,
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 50,
        fontSize: 15,
        color: '#000',
    },
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F59E0B',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },

});