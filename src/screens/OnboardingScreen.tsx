import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import MobileShell from '../components/mobileshell';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Onboarding: undefined;
    Main: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OnboardingScreen() {
    const [name, setName] = useState('');
    const navigation = useNavigation<NavigationProp>();

    const handleConnect = () => {
        if (name.trim()) {
            navigation.navigate('Main');
        }
    };

    return (
        <MobileShell>
            <View style={styles.container}>
                <Text style={styles.title}>ENTER YOUR NAME</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>FULL NAME</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholder=""
                        placeholderTextColor="#9ca3af"
                    />
                    <TouchableOpacity
                        style={[
                            styles.button,
                            !name.trim() && styles.buttonDisabled,
                        ]}
                        onPress={handleConnect}
                        disabled={!name.trim()}
                    >
                        <Text style={styles.buttonText}>CONNECT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </MobileShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 3,
        color: '#737373',
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 320,
    },
    label: {
        fontSize: 12,
        color: '#737373',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 48,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d4d4d8',
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#262626',
        marginBottom: 16,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: 8,
        backgroundColor: '#f59e0b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 2,
        color: '#000000',
    },
});