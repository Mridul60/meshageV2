import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

interface Friend {
    id: number;
    name: string;
}

const friends: Friend[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Friend ${i + 1}`,
}));

export default function FriendsScreen() {
    const renderFriendItem = ({ item, index }: { item: Friend; index: number }) => (
        <View
            style={[
                styles.friendItem,
                index !== friends.length - 1 && styles.friendItemBorder,
            ]}
        >
            <View style={styles.friendInfo}>
                <View style={styles.avatar} />
                <Text style={styles.friendName}>{item.name}</Text>
            </View>
            <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
        </View>
    );

    return (
            <View style={styles.container}>
                <Text style={styles.header}>Your Friends</Text>
                <View style={styles.friendsList}>
                    <FlatList
                        data={friends}
                        renderItem={renderFriendItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
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
    friendsList: {
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
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    friendItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e5e5e5',
    },
    friendName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#262626',
    },
    messageButton: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    messageButtonText: {
        fontSize: 12,
        color: '#737373',
    },
});