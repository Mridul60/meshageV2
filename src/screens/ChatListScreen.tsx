import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import ChatItem from '../components/ChatItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type ChatListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
  isRead: boolean;
}

const chatData: Chat[] = [
  { id: '1', name: 'Shahid Anowar', message: 'You: Just to not leave you out of anything', time: 'Yesterday', avatar: 'SA', isRead: false },
  { id: '2', name: 'Sourav Sharma', message: 'Kaha hai ?', time: '11:11', avatar: 'SS', isRead: true },
  { id: '3', name: 'Sourav Sharma', message: 'Kaha hai ?', time: '11:11', avatar: 'SS', isRead: false },
  { id: '4', name: 'Sanjeev Iqbal Ahmed', message: 'Khana khaya?', time: '15:11', avatar: 'SI', isRead: true },
  { id: '5', name: 'Sanjeev Iqbal Ahmed', message: 'Khana khaya?', time: '15:11', avatar: 'SI', isRead: true },
  { id: '6', name: 'Faruk Khan', message: 'You: Has ki thoda bhai', time: 'Yesterday', avatar: 'FK', isRead: true },
  { id: '7', name: 'Sanjeev Iqbal Ahmed', message: 'Khana khaya?', time: '15:11', avatar: 'SI', isRead: true },
  { id: '8', name: 'Shahid Anowar', message: 'You: Just to not leave you out of anything', time: 'Yesterday', avatar: 'SA', isRead: true },
  { id: '9', name: 'Sanjeev Iqbal Ahmed', message: 'Khana khaya?', time: '15:11', avatar: 'SI', isRead: false },
  { id: '10', name: 'Shahid Anowar', message: 'You: Just to not leave you out of anything', time: 'Yesterday', avatar: 'SA', isRead: true },
];

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<ChatListNavigationProp>();

  const [chats, setChats] = useState<Chat[]>(chatData);
  const [unreadCount, setUnreadCount] = useState(
    chatData.filter(c => !c.isRead).length
  );

  const handleChatItemPress = (chat: Chat) => {
    // Mark as read
    if (!chat.isRead) {
      setUnreadCount(prev => prev - 1);
      setChats(prevChats =>
        prevChats.map(c =>
          c.id === chat.id ? { ...c, isRead: true } : c
        )
      );
    }

    // Navigate to the chat screen with contact name
    navigation.navigate('ChatDetail', {
      contactName: chat.name,
      contactId: chat.id
    });
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <ChatItem
      name={item.name}
      message={item.message}
      time={item.time}
      avatar={item.avatar}
      isRead={item.isRead}
      onPress={() => handleChatItemPress(item)}
    />
  );

  const handleFriendsPageButton = () => {
    navigation.navigate('Friends');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.chatsHeader}>
          <Text style={styles.chatsTitle}>Chats</Text>
          <View style={styles.unreadContainer}>
            <Text style={styles.unreadText}>Unread messages</Text>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
        </View>

        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatListContent}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleFriendsPageButton}
        activeOpacity={0.8}
      >
        <Ionicons name="people" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatsHeader: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  chatsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  unreadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  unreadCount: {
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: '#F59E0B',
    color: '#000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 14,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default ChatScreen;