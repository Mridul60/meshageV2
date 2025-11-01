import React from 'react';
import { StatusBar, View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Ionicons from 'react-native-vector-icons/Ionicons';

import OnboardingScreen from './src/screens/OnboardingScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import BroadcastScreen from './src/screens/BroadcastScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MoreInfoPage from './src/screens/moreInfoScreen';
import Header from './src/components/Header'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();
const devMode = true;

/* ---------------------- CUSTOM BOTTOM NAV ---------------------- */
function CustomBottomNavigation({ state, navigation }: any) {
  const currentRouteName = state.routes[state.index].name;

  return (
    <SafeAreaView edges={['bottom']} style={styles.bottomSafeArea}>
      <View style={styles.bottomContainer}>
        {
        state.routes
          .filter((route: any) => route.name !== 'Friends') // ✅ hide Friends
          .map((route: any) => {
            const isFocused = route.name === currentRouteName;


          let iconName = 'home';
          if (route.name === 'Broadcast') iconName = 'radio';
          else if (route.name === 'Chat') iconName = 'chatbubble';
          else if (route.name === 'Friends') iconName = 'people';
          else if (route.name === 'Settings') iconName = 'settings';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={onPress}
              style={styles.navItem}
            >
              <View style={isFocused ? styles.activeIndicator : undefined}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? '#ffa500' : '#666'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* ---------------------- MAIN TABS WITH HEADER ---------------------- */
function MainTabs() {
  return (
    <SafeAreaProvider style={styles.mainContainer}>
      {/* ✅ Custom Header shown above all tab screens */}
      <Header />

      {/* ✅ Tabs below the header */}
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={CustomBottomNavigation}
      >
        <Tab.Screen name="Broadcast" component={BroadcastScreen} />
        <Tab.Screen name="Chat" component={ChatListScreen} />
        {/* <Tab.Screen name="Friends" component={FriendsScreen} /> */}
        {/* <Tab.Screen
          name="Friends"
          component={FriendsScreen}
          options={{ tabBarButton: () => null }} // hides from nav bar
        /> */}
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}

/* ---------------------- ROOT APP ---------------------- */
export default function App() {
  if (devMode) {
    // ✅ Shortcut — directly load your Demo Mode UI
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Main" // change to your "working" screen 
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen
                name="Friends"
                component={FriendsScreen}
                options={{
                  presentation: 'modal', // 🪄 makes it slide up like WhatsApp
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen 
              name="MoreInfoPage" 
              component={MoreInfoPage}
              // options={{ headerShown: true, title: 'More Information' }} 
            />
              </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Friends"
              component={FriendsScreen}
              options={{
                presentation: 'modal', // 🪄 makes it slide up like WhatsApp
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
            name="MoreInfoPage" 
            component={MoreInfoPage}
            // options={{ headerShown: true, title: 'More Information' }} 
          />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000', // keeps consistent with dark theme
  },
  bottomContainer: {
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 2,
   
  },
    bottomSafeArea: {
  backgroundColor: '#1a1a1a',
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
