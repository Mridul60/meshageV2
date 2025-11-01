import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

// Stack navigation (Onboarding -> Main)
export type RootStackParamList = {
    Onboarding: undefined;
    Main: undefined;
    Friends: undefined;
};

// Bottom tab navigation
export type MainTabParamList = {
    Broadcast: undefined;
    Chat: undefined;
    Settings: undefined;
};

// Navigation prop types
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

// Route prop types
export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<
    RootStackParamList,
    T
>;

export type MainTabRouteProp<T extends keyof MainTabParamList> = RouteProp<
    MainTabParamList,
    T
>;

// Declare global navigation types for TypeScript
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}