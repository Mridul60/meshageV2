import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Animated
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { StorageService } from '../../utils/storage';

export default function SettingsScreen() {
    const [isConnected, setIsConnected] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [userName, setUserName] = useState('');
    const [persistentId, setPersistentId] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const loadUserInfo = async () => {
            const savedUsername = await StorageService.getUsername();
            const savedPersistentId = await StorageService.getPersistentId();

            if (savedUsername) {
                setUserName(savedUsername);
            }
            setPersistentId(savedPersistentId);
        };

        loadUserInfo();
    }, []);

    const handleScan = async () => {
        setScanning(true);
        // Simulate scanning - in real app, you'd use react-native-camera or expo-camera
        setTimeout(() => {
            setScanning(false);
            Alert.alert('Success', 'QR code scanned successfully!');
        }, 3000);
    };

    const handleMoreInfo = () => {
        navigation.navigate('MoreInfoPage'); // Replace 'MoreInfo' with your actual screen name
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Text style={styles.userName}>{userName || 'User'}</Text>
                    <Text style={styles.userId}>ID · {persistentId ? persistentId.split('-')[0] : '...'}</Text>

                    <View style={styles.scanButtonContainer}>
                        <TouchableOpacity
                            style={styles.scanIconButton}
                            onPress={handleScan}
                            disabled={scanning}
                            activeOpacity={0.7}
                        >
                            <Svg width="24" height="24" viewBox="0 0 24 24">
                                <Path
                                    fill="#060606ff"
                                    d="M17 22v-2h3v-3h2v3.5c0 .4-.2.7-.5 1s-.7.5-1 .5zM7 22H3.5c-.4 0-.7-.2-1-.5s-.5-.7-.5-1V17h2v3h3zM17 2h3.5c.4 0 .7.2 1 .5s.5.6.5 1V7h-2V4h-3zM7 2v2H4v3H2V3.5c0-.4.2-.7.5-1s.6-.5 1-.5zm12 9H5v2h14z"
                                />
                            </Svg>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.qrContainer}>
                        <Image
                            source={require('../../../assets/images/qrcode (1).png')}
                            style={styles.qrImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>
            </View>

            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>Stay connected to the network</Text>

                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            isConnected && styles.toggleButtonActive
                        ]}
                        onPress={() => setIsConnected(!isConnected)}
                        activeOpacity={0.8}
                    >
                        <Animated.View
                            style={[
                                styles.toggleCircle,
                                isConnected && styles.toggleCircleActive
                            ]}
                        >
                            <Ionicons
                                name="globe-outline"
                                size={18}
                                color={isConnected ? "#f59e0b" : "#666666"}
                                style={styles.globeIcon}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <View style={styles.warningContainer}>
                    <Text style={styles.warningText}>
                        WARNING:{' '}
                        <Text style={styles.warningDescription}>
                            Disconnecting will lead to loss in messages and connectivity.
                        </Text>
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.moreInfoButton}
                onPress={handleMoreInfo}
                activeOpacity={0.7}
            >
                <Text style={styles.moreInfoButtonText}>More Info</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        alignItems: 'center',
        padding: 16,
        paddingTop: 32,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 24,
    },
    cardContent: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#262626',
        marginBottom: 4,
    },
    userId: {
        fontSize: 12,
        color: '#737373',
        // marginBottom: 1,
    },
    scanButtonContainer: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    scanIconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ede3e3ff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    qrContainer: {
        width: 280,
        height: 280,
        borderWidth: 4,
        borderColor: '#e5e5e5',
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
    },
    qrImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoCard: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#262626',
        flex: 1,
    },
    toggleButton: {
        width: 64,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e5e5e5',
        padding: 2,
        justifyContent: 'center',
    },
    toggleCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        position: 'absolute',
        left: 2,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateX: 0 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    toggleButtonActive: {
        backgroundColor: '#f59e0b',
    },
    toggleCircleActive: {
        transform: [{ translateX: 32 }],
    },
    globeIcon: {
        marginLeft: 0,
    },
    warningContainer: {
        marginTop: 4,
    },
    warningText: {
        fontSize: 12,
        color: '#dc2626',
        fontWeight: '600',
        marginBottom: 4,
    },
    warningDescription: {
        fontSize: 12,
        color: '#737373',
        fontWeight: '500',
    },
    moreInfoButton: {
        width: '100%',
        maxWidth: 400,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#262626',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    moreInfoButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
    },
});