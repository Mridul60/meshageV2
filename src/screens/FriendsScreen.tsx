import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Friend {
    id: number;
    name: string;
}

const friends: Friend[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: 'Friend',
}));

export default function FriendsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);


/**
 * Handle the "Add friend" button press
 * - Add your navigation or modal logic here
 */
    const handleAddFriend = () => {
        console.log('Add friend pressed');
        // Add your navigation or modal logic here
    };

    const handleMessage = (friendId: number) => {
        console.log(`Message friend ${friendId}`);
        // Add your navigation to chat logic here
    };

    const renderFriendItem = ({ item }: { item: Friend }) => (
        <View style={styles.friendItem}>
            <View style={styles.friendInfo}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={20} color="#666" />
                </View>
                <Text style={styles.friendName}>{item.name}</Text>
            </View>
            <TouchableOpacity
                style={styles.messageIcon}
                onPress={() => handleMessage(item.id)}
            >
                <Ionicons name="chatbubble" size={20} color="#767676ff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerSection}>
                <Text style={styles.title}>Your Friends</Text>
                <Text style={styles.availableText}>
                    Available : <Text style={styles.availableCount}>23</Text>
                </Text>
            </View>

            {/* Search Bar */}
            <View style={[
                styles.searchContainer,
                isSearchFocused && styles.searchContainerFocused
            ]}>
                <Ionicons
                    name="search"
                    size={20}
                    color={isSearchFocused ? "#F59E0B" : "#666"}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by names"
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                />
                {!isSearchFocused && (
                    <TouchableOpacity style={styles.sortButton}>
                        <Ionicons name="refresh" size={20} color="#000" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Friends List */}
            <FlatList
                data={friends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={handleAddFriend}
                activeOpacity={0.8}
            >
                <Ionicons name="person-add" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
        paddingHorizontal: 16,
    },
    headerSection: {
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    availableText: {
        fontSize: 13,
        color: '#666',
    },
    availableCount: {
        fontWeight: '600',
        color: '#000',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    searchContainerFocused: {
        backgroundColor: '#fff',
        borderColor: '#F59E0B', 
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: '#000',
    },
    sortButton: {
        padding: 4,
    },

    listContent: {
        paddingBottom: 100,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 8,
        // borderWidth: 1,
        // borderColor: '#000',
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 37,
        height: 37,
        borderRadius: 20,
        backgroundColor: '#E5E5E5',
        borderWidth: 0.3,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    messageIcon: {
        padding: 8,
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