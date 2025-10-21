import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ChatScreen />
      </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});