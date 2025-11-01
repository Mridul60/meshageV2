import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ChatItemProps {
  name: string;
  message: string;
  time: string;
  avatar: string;
  isRead: boolean;
  onPress: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ name, message, time, avatar, isRead, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatar}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.timeContainer}>
            <Text style={[styles.time, !isRead && styles.unreadTime]}>{time}</Text>
            {!isRead && <View style={styles.unreadDot} />}
          </View>
        </View>

        <Text
          style={[styles.message, !isRead && styles.unreadMessage]}
          numberOfLines={1}
        >
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  unreadTime: {
    fontWeight: 'bold',
    color: '#000',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#000',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    marginLeft: 6,
  },
});

export default ChatItem;
