import React from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import ChatItem from '../components/ChatItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import AddFriendBanner from '../components/AddFriendBanner';

interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
}

const chatData: Chat[] = [
  {
    id: '1',
    name: 'Shahid Anowar',
    message: 'You: Just do not leave you out of anything',
    time: 'Yesterday',
    avatar: 'SA',
  },
  {
    id: '2',
    name: 'Sourav Sharma',
    message: 'Kaha hai ?',
    time: '11:11',
    avatar: 'SS',
  },
  {
    id: '3',
    name: 'Sourav Sharma',
    message: 'Kaha hai ?',
    time: '11:11',
    avatar: 'SS',
  },
  {
    id: '4',
    name: 'Sanjeev Iqbal Ahmed',
    message: 'Khana khaya?',
    time: '15:11',
    avatar: 'SI',
  },
  {
    id: '5',
    name: 'Sanjeev Iqbal Ahmed',
    message: 'Khana khaya?',
    time: '15:11',
    avatar: 'SI',
  },
  {
    id: '6',
    name: 'Faruk Khan',
    message: 'You: Has ki thoda bhai',
    time: 'Yesterday',
    avatar: 'FK',
  },
  {
    id: '7',
    name: 'Sanjeev Iqbal Ahmed',
    message: 'Khana khaya?',
    time: '15:11',
    avatar: 'SI',
  },
  {
    id: '8',
    name: 'Shahid Anowar',
    message: 'You: Just to not leave you out of anything',
    time: 'Yesterday',
    avatar: 'SA',
  },
  {
    id: '9',
    name: 'Sanjeev Iqbal Ahmed',
    message: 'Khana khaya?',
    time: '15:11',
    avatar: 'SI',
  },
  {
    id: '10',
    name: 'Shahid Anowar',
    message: 'You: Just to not leave you out of anything',
    time: 'Yesterday',
    avatar: 'SA',
  },
];

const ChatScreen: React.FC = () => {
  const renderChatItem = ({ item }: { item: Chat }) => (
    <ChatItem
      name={item.name}
      message={item.message}
      time={item.time}
      avatar={item.avatar}
    />
  );

  const handleAddFriend = () => {
    // Add your navigation or action here
    console.log('Add friend button pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.chatsHeader}>
          <Text style={styles.chatsTitle}>Chats</Text>
          <View style={styles.unreadContainer}>
            <Text style={styles.unreadText}>Unread messages</Text>
            <Text style={styles.unreadCount}>99</Text>
          </View>
        </View>
        <FlatList
          data={chatData}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatListContent}
        />
        {/* <AddFriendBanner /> */}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddFriend}
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatsHeader: {
    paddingVertical: 16,
  },
  chatsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  unreadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Space between text and count
  },
  unreadText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000', // Adjust color as needed
  },
  unreadCount: {
    fontSize: 10,
    fontWeight: '800', // Slightly bold but less than the label
    // color: '#666', // Slightly muted color for the count
    // Or you could style it as a badge:
    backgroundColor: '#F59E0B',
    color: '#000000ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  chatList: {
    flex: 1
  },
  chatListContent: {
    paddingBottom: 80, // Add padding to prevent FAB from covering last item
  },
  fab: {
    position: 'absolute',
    bottom: 20, // Position above bottom navigation
    right: 14,
    width: 58,
    height: 55,
    borderRadius: 21,
    backgroundColor: '#F59E0B', // Orange color matching your theme
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#595555ff', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default ChatScreen;