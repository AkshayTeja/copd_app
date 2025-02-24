import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const exercises = [
  { name: 'Deep Breathing', page: '/deep-breathing' },
  { name: 'Pursed Lip Breathing', page: '/pursed-lip-breathing' },
  { name: 'Diaphragmatic Breathing', page: '/diaphragmatic-breathing' },
  { name: 'Controlled Coughing', page: '/controlled-coughing' },
];

export default function ExerciseScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breathing Exercises</Text>
      <Text style={styles.description}>
        Select an exercise to view its details and instructions.
      </Text>

      {exercises.map((exercise) => (
        <TouchableOpacity 
          key={exercise.name} 
          style={styles.button} 
          onPress={() => router.push(exercise.page as any)}
        >
          <Text style={styles.buttonText}>{exercise.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Back to Dashboard Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  backButton: {  // ✅ Added back button styling
    marginTop: 20,
    backgroundColor: '#D32F2F',  // Red color for contrast
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
