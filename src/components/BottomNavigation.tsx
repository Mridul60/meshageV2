import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BottomNavigation: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.activeIndicator}>
          <Ionicons name="home" size={24} color="#ffa500" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="people" size={24} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="settings" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    paddingBottom: 5,
  },
  navItem: {
    padding: 8,
  },
  activeIndicator: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 8,
  },
});

export default BottomNavigation;
