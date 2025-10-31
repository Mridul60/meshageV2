import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default function SettingsScreen() {
    return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <Text style={styles.userName}>John Doe</Text>
                        <Text style={styles.userId}>ID: mesh-xxxx</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.qrShowButton}>
                                <Text style={styles.qrShowButtonText}>QR Show</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.qrScanButton}>
                                <Text style={styles.qrScanButtonText}>QR Scan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Text style={styles.description}>
                    Stay connected to the network. Share your connection via QR to add
                    friends nearby.
                </Text>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardContent: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#262626',
    },
    userId: {
        fontSize: 12,
        color: '#737373',
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    qrShowButton: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrShowButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
    },
    qrScanButton: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#f59e0b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrScanButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
    },
    description: {
        fontSize: 11,
        color: '#737373',
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 24,
        lineHeight: 16,
    },
});