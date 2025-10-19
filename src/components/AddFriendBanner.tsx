import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AddFriendBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add your friend to the mesh?</Text>
        <Text style={styles.subtitle}>Show them your QR</Text>
      </View>
      <TouchableOpacity style={styles.showButton}>
        <Text style={styles.showButtonText}>Show</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#000',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  showButton: {
    backgroundColor: '#ffa500',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  showButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddFriendBanner;
