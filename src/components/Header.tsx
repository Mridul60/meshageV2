import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>MESHAGE</Text>
      <TouchableOpacity style={styles.expandButton}>
        <Ionicons name="expand" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  expandButton: {
    padding: 4,
  },
});

export default Header;
