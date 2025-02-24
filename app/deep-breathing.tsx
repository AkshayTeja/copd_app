import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function DeepBreathingScreen() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Breathing Exercise</Text>

      <Text style={styles.description}>
        Sit or stand comfortably with your elbows slightly back to allow full chest expansion.
        {"\n\n"}1️⃣ Take a deep breath and hold it as long as possible.
        {"\n\n"}2️⃣ Exhale slowly and cough strongly.
        {"\n\n"}3️⃣ Repeat for 10 breaths.
      </Text>

      <Text style={styles.timer}>Time Left: {countdown}s</Text>

      {countdown === 0 ? (
        <TouchableOpacity style={styles.button} onPress={() => router.push('/exercise')}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      ) : null}
    </View>
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  timer: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 20,
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
