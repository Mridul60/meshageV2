import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './components/Header';

interface Friend {
    id: number;
    name: string;
}

const friends: Friend[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: 'Friend',
}));

export default function FriendsScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleClose = () => {
        navigation.goBack();
    };

    const handleAddFriend = () => {
        console.log('Add friend pressed');
    };

    const handleMessage = (friendId: number) => {
        console.log(`Message friend ${friendId}`);
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
                <Ionicons name="chatbubble" size={20} color="#666" />
            </TouchableOpacity>
        </View>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.root}>
                <Header />

                <View style={styles.container}>
                    <View style={styles.headerSection}>
                        <View style={styles.headerTop}>
                            <View style={styles.headerTextContainer}>
                                <Text style={styles.title}>Your Friends</Text>
                                <Text style={styles.availableText}>
                                    Available : <Text style={styles.availableCount}>23</Text>
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleClose}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={28} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.searchContainer,
                            isSearchFocused && styles.searchContainerFocused,
                        ]}
                    >
                        <Ionicons
                            name="search"
                            size={20}
                            color={isSearchFocused ? '#F59E0B' : '#666'}
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
                    </View>

                    <FlatList
                        data={friends}
                        renderItem={renderFriendItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                </View>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={handleAddFriend}
                    activeOpacity={0.8}
                >
                    <Ionicons name="person-add" size={24} color="#000" />
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    headerSection: {
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    headerTextContainer: {
        flex: 1,
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
    closeButton: {
        padding: 4,
        marginLeft: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 2,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    searchContainerFocused: {
        backgroundColor: '#FFF',
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
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
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