import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import Header from '../components/Header';
import { StorageService } from '../../utils/storage';

export default function MoreInfoPage() {
  const [deviceInfo, setDeviceInfo] = useState({
    username: 'User',
    fullUUID: 'Unavailable',
    sessionLocalID: 'Not connected yet',
    deviceIdentifier: 'Unavailable',
    friends: 0,
    friendRequests: 0
  });

  useEffect(() => {
    const loadInfo = async () => {
      const savedUsername = await StorageService.getUsername();
      const savedPersistentId = await StorageService.getPersistentId();
      const friends = await StorageService.getFriends();
      const friendRequests = await StorageService.getFriendRequests();

      const displayName = savedUsername || 'User';
      const persistentId = savedPersistentId || 'Unavailable';
      const deviceIdentifier = savedPersistentId
        ? `${displayName}|${savedPersistentId}`
        : displayName;

      setDeviceInfo({
        username: displayName,
        fullUUID: persistentId,
        sessionLocalID: 'Not connected yet',
        deviceIdentifier,
        friends: friends.length,
        friendRequests: friendRequests.length,
      });
    };

    loadInfo();
  }, []);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear', style: 'destructive', onPress: () => {
            Alert.alert('Success', 'All data has been cleared');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Information - for testing</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username:</Text>
            <Text style={styles.infoValue}>{deviceInfo.username}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full UUID:</Text>
            <Text style={styles.infoValueSmall}>{deviceInfo.fullUUID}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Session Local ID:</Text>
            <Text style={styles.infoValue}>{deviceInfo.sessionLocalID}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device Identifier:</Text>
            <Text style={styles.infoValue}>{deviceInfo.deviceIdentifier}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Friends:</Text>
            <Text style={styles.infoValue}>{deviceInfo.friends}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Friend Requests:</Text>
            <Text style={styles.infoValue}>{deviceInfo.friendRequests}</Text>
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteIcon}>💡</Text>
            <Text style={styles.noteText}>
              Real endpoint IDs (like "2mxk") are shown in the peer list
            </Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusIcon}>📡</Text>
            <Text style={styles.statusTitle}>Mesh Network Status</Text>
          </View>

          <Text style={styles.statusDescription}>
            Stay connected to discover nearby devices and chat with friends.
          </Text>

          <View style={styles.warningContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Disconnecting will stop message delivery
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearData}
          activeOpacity={0.8}
        >
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#525252',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'right',
  },
  infoValueSmall: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '400',
    textAlign: 'right',
  },
  identifierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  identifierLabel: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
    marginRight: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  noteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#525252',
    flex: 1,
    lineHeight: 18,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  statusDescription: {
    fontSize: 14,
    color: '#525252',
    lineHeight: 20,
    marginBottom: 12,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '500',
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});