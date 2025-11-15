import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Animated,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { StorageService } from '../../utils/storage';
import QRCode from 'react-native-qrcode-svg';
import { Camera } from 'react-native-camera-kit';

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
    qrPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrPlaceholderText: {
        fontSize: 14,
        color: '#737373',
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
    scannerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerContainer: {
        width: '100%',
        height: '100%',
    },
    scannerCamera: {
        width: '100%',
        height: '100%',
    },
    scannerText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    scannerCancelButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#ffffff',
    },
    scannerCancelText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
});

export default function SettingsScreen() {
    const [isConnected, setIsConnected] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [userName, setUserName] = useState('');
    const [persistentId, setPersistentId] = useState('');
    const [showScanner, setShowScanner] = useState(false);
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

    const requestCameraPermission = async (): Promise<boolean> => {
        if (Platform.OS !== 'android') {
            return true;
        }

        try {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            console.error('Error requesting camera permission:', error);
            return false;
        }
    };

    const handleScanPress = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Permission required', 'Camera permission is needed to scan QR codes.');
            return;
        }
        setScanning(true);
        setShowScanner(true);
    };

    const handleScanSuccess = async (e: { data?: string }) => {
        setShowScanner(false);
        setScanning(false);

        const raw = e?.data;
        if (!raw || typeof raw !== 'string') {
            Alert.alert('Invalid QR code', 'Could not read QR code data.');
            return;
        }

        const parts = raw.split('|');
        if (parts.length !== 2) {
            Alert.alert('Invalid QR code', 'QR code format must be username|persistent-uuid.');
            return;
        }

        const scannedName = parts[0]?.trim();
        const scannedPersistentId = parts[1]?.trim();

        if (!scannedName || !scannedPersistentId) {
            Alert.alert('Invalid QR code', 'Missing username or persistent ID.');
            return;
        }

        // Prevent adding self as friend
        if (persistentId && scannedPersistentId === persistentId) {
            Alert.alert('Info', 'This is your own QR code.');
            return;
        }

        try {
            const alreadyFriend = await StorageService.isFriend(scannedPersistentId);
            const message = `Name: ${scannedName}\nID: ${scannedPersistentId}`;

            if (alreadyFriend) {
                Alert.alert('Already a friend', message);
                return;
            }

            Alert.alert(
                'Add Friend',
                message,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Send Friend Request',
                        onPress: async () => {
                            try {
                                await StorageService.addFriendRequest({
                                    persistentId: scannedPersistentId,
                                    displayName: scannedName,
                                    deviceAddress: '',
                                    timestamp: Date.now(),
                                    type: 'outgoing',
                                });
                                Alert.alert('Friend Request', 'Friend request saved for this user.');
                            } catch (error) {
                                console.error('Error saving friend request from QR scan:', error);
                                Alert.alert('Error', 'Could not save friend request.');
                            }
                        },
                    },
                ],
            );
        } catch (error) {
            console.error('Error handling QR scan result:', error);
            Alert.alert('Error', 'Something went wrong handling the scanned code.');
        }
    };

    const handleMoreInfo = () => {
        navigation.navigate('MoreInfoPage'); // Replace 'MoreInfo' with your actual screen name
    };

    const qrValue = persistentId
        ? `${userName || 'User'}|${persistentId}`
        : '';

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <Text style={styles.userName}>{userName || 'User'}</Text>
                        <Text style={styles.userId}>ID · {persistentId ? persistentId.split('-')[0] : '...'}</Text>

                        <View style={styles.scanButtonContainer}>
                            <TouchableOpacity
                                style={styles.scanIconButton}
                                onPress={handleScanPress}
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
                            {qrValue ? (
                                <QRCode
                                    value={qrValue}
                                    size={260}
                                />
                            ) : (
                                <View style={styles.qrPlaceholder}>
                                    <Text style={styles.qrPlaceholderText}>Generating QR...</Text>
                                </View>
                            )}
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

        {showScanner && (
            <View style={styles.scannerOverlay}>
                <View style={styles.scannerContainer}>
                    <Camera
                        style={styles.scannerCamera}
                        scanBarcode
                        showFrame
                        onReadCode={(event: any) => {
                            const value = event?.nativeEvent?.codeStringValue;
                            if (value) {
                                handleScanSuccess({ data: value });
                            }
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 40,
                            alignSelf: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={styles.scannerCancelButton}
                            onPress={() => {
                                setShowScanner(false);
                                setScanning(false);
                            }}
                        >
                            <Text style={styles.scannerCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )}
    </View>
);
}