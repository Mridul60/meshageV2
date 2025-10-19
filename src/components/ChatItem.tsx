import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ChatItemProps {
  name: string;
  message: string;
  time: string;
  avatar: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ name, message, time, avatar }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatar}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});

export default ChatItem;
