import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";

export default function ApprovalPending() {
  const navigation = useNavigation();

  const handleBackToLogin = async () => {
    try {
      await SecureStore.deleteItemAsync("flag");
      navigation.navigate('index');
    } catch (error) {
      console.error('Error removing flag from AsyncStorage:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your approval is currently pending...</Text>
      <Text style={styles.subtitle}>
        Please contact home Owner for approval and check back later.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleBackToLogin}>
        <Text style={styles.buttonText}>Back to login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5', // Light gray background
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  button: {
    backgroundColor: '#4CAF50', // Green color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
