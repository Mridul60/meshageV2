import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { Wifi, Signal } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Header from '../components/Header';

interface Device {
    id: string;
    name: string;
    signalStrength: number; // 0-100
    status: 'connected' | 'available' | 'unavailable';
}

interface NearbyDevicesScreenProps {
    navigation: any; // Use proper navigation type from @react-navigation/native
}

export default function NearbyDevicesScreen({ navigation }: NearbyDevicesScreenProps) {
    const [devices] = useState<Device[]>(
        [
            { id: '1', name: 'Sourav', signalStrength: 85, status: 'connected' },
            { id: '2', name: 'Shahid', signalStrength: 72, status: 'available' },
            { id: '3', name: 'Mridul', signalStrength: 60, status: 'available' },
            { id: '4', name: 'Faruk', signalStrength: 45, status: 'available' },
        ]
    );

    const getSignalColor = (strength: number) => {
        if (strength >= 70) return '#22C55E';
        if (strength >= 40) return '#F59E0B';
        return '#EF4444';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected':
                return '#22C55E';
            case 'available':
                return '#3B82F6';
            case 'unavailable':
                return '#6B7280';
            default:
                return '#6B7280';
        }
    };

    return (
        <View style={styles.container}>
            <Header
                title="Nearby Devices"
                leftIcon="arrow-back"
                onLeftPress={() => navigation.goBack()}
                rightIcon={<Wifi size={20} color="#000" />}
            />

            {/* DEVICE COUNT BAR */}
            <View style={styles.countBar}>
                <Text style={styles.countText}>
                    {devices.length} {devices.length === 1 ? 'device' : 'devices'} in range
                </Text>
            </View>

            {/* DEVICES LIST */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {devices.map((device) => (
                    <TouchableOpacity
                        key={device.id}
                        style={styles.deviceCard}
                        activeOpacity={0.7}
                    >
                        <View style={styles.deviceLeft}>
                            <View
                                style={[
                                    styles.deviceIcon,
                                    { backgroundColor: getStatusColor(device.status) + '20' },
                                ]}
                            >
                                <Signal
                                    size={24}
                                    color={getSignalColor(device.signalStrength)}
                                />
                            </View>
                            <View style={styles.deviceInfo}>
                                <Text style={styles.deviceName}>{device.name}</Text>
                                <Text style={styles.deviceStatus}>
                                    {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.deviceRight}>
                            <View style={styles.signalBar}>
                                <View
                                    style={[
                                        styles.signalFill,
                                        {
                                            width: `${device.signalStrength}%`,
                                            backgroundColor: getSignalColor(device.signalStrength),
                                        },
                                    ]}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.signalText,
                                    { color: getSignalColor(device.signalStrength) },
                                ]}
                            >
                                {device.signalStrength}%
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* REFRESH BUTTON */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.refreshButton} activeOpacity={0.7}>
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E1DE',
    },
    countBar: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#00000020',
    },
    countText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    deviceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deviceIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    deviceInfo: {
        marginLeft: 12,
        flex: 1,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    deviceStatus: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    deviceRight: {
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    signalBar: {
        width: 60,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000',
        overflow: 'hidden',
        marginBottom: 4,
    },
    signalFill: {
        height: '100%',
        borderRadius: 3,
    },
    signalText: {
        fontSize: 12,
        fontWeight: '700',
    },
    footer: {
        padding: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#00000020',
        backgroundColor: '#E5E1DE',
    },
    refreshButton: {
        backgroundColor: '#F59E0B',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    refreshButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
});