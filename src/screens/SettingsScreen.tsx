import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, } from '@react-navigation/native';

export default function SettingsScreen() {
  const [isConnected, setIsConnected] = useState(true);
  const [scanning, setScanning] = useState(false);
  const navigation = useNavigation();

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
        
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>MESHAGE</Text>
      </View> */}

      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.userName}>JOHN DOE</Text>
          <Text style={styles.userId}>ID · ewjqr1q330rnf</Text>

          <View style={styles.qrContainer}>
            <Image
                source={require('../../assets/images/qrcode (1).png')}
                style={styles.qrImage}
                resizeMode="cover"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.showButton]}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}> Show</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.scanButton]}
              onPress={handleScan}
              disabled={scanning}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>
                {scanning ? ' Scanning...' : ' Scan'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoContent}>
        <View style={styles.iconContainer}>
        <Ionicons name="wifi" size={22} color="black" />
        </View>
          
          <View style={styles.infoText}>
            <View style={styles.infoTitle}>
              <Text style={styles.infoTitleText}>Stay connected to the network</Text>
              
              <TouchableOpacity 
                style={[
                  styles.toggleSwitch, 
                  isConnected ? styles.toggleActive : styles.toggleInactive
                ]}
                onPress={() => setIsConnected(!isConnected)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.toggleCircle,
                  isConnected ? styles.toggleCircleActive : styles.toggleCircleInactive
                ]} />
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
        </View>
      </View>

        <TouchableOpacity 
        style={styles.moreInfoButton}
        onPress={handleMoreInfo} // Add this line
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
//   header: {
//     width: '100%',
//     maxWidth: 400,
//     marginBottom: 32,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000000',
//     letterSpacing: 0.5,
//   },
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
    marginBottom: 24,
  },
  qrContainer: {
    width: 256,
    height: 256,
    borderWidth: 4,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  qrImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  showButton: {
    backgroundColor: '#f59e0b',
  },
  scanButton: {
    backgroundColor: '#f59e0b',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
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
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f59e0b',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    textAlign: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  infoTitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#262626',
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
  },
  toggleSwitch: {
    position: 'relative',
    width: 48,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },

  toggleActive: {
    backgroundColor: '#f59e0b',
  },
  toggleInactive: {
    backgroundColor: '#d4d4d4',
  },
  toggleSwitchConnected: {
    backgroundColor: '#f59e0b',
  },
  toggleSwitchDisconnected: {
    backgroundColor: '#d4d4d4',
  },
  toggleCircle: {
    position: 'absolute',
    top: 2,
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },

  toggleCircleActive: {
    left: 26,
  },
  toggleCircleInactive: {
    left: 2,
  },
  toggleCircleConnected: {
    left: 26,
  },
  toggleCircleDisconnected: {
    left: 2,
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