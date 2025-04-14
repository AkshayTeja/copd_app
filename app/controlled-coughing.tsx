import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Linking } from 'react-native';
import { useRouter } from 'expo-router';

export default function DeepBreathingScreen() {
  const router = useRouter();

  const openYouTube = () => {
    Linking.openURL('https://www.youtube.com/watch?v=pmJU3osuHSo');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Controlled Coughing Exercise</Text>

      {/* Button to open YouTube */}
      <TouchableOpacity style={styles.videoButton} onPress={openYouTube}>
        <Text style={styles.videoButtonText}>Watch on YouTube</Text>
      </TouchableOpacity>

      {/* Button to go back */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/exercise')}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  videoButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
