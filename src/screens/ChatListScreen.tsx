import React from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import ChatItem from '../components/ChatItem';
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
    message: 'You: Just do not leave you out of anything',
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

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <View style={styles.chatsHeader}>
          <Text style={styles.chatsTitle}>Chats</Text>
          <Text style={styles.unreadCount}>Unread messages • 2</Text>
        </View>
        <FlatList
          data={chatData}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
        {/* <AddFriendBanner /> */}
      </View>
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
  unreadCount: {
    fontSize: 14,
    color: '#666',
  },
  chatList: {
    flex: 1,
  },
});


export default ChatScreen;
