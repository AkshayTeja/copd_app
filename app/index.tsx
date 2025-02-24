import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function HomeScreen() {
  const router = useRouter(); // Navigation hook

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Image */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <Image 
          source={require('../assets/images/logo.png')} // Local image
          style={styles.image}
        />
        <Text style={styles.title}>COPD Self-Care App</Text>
      </Animated.View>

      {/* Features Section */}
      <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.featuresContainer}>
        <Text style={styles.subtitle}>Key Features</Text>

        <View style={styles.featureItem}>
          <Ionicons name="pulse-outline" size={30} color="#4CAF50" />
          <Text style={styles.featureText}>Symptom Tracking</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="alarm-outline" size={30} color="#FF9800" />
          <Text style={styles.featureText}>Medication Reminders</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="medkit-outline" size={30} color="#F44336" />
          <Text style={styles.featureText}>Emergency Assistance</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="cloud-outline" size={30} color="#2196F3" />
          <Text style={styles.featureText}>Air Quality Alerts</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="analytics-outline" size={30} color="#9C27B0" />
          <Text style={styles.featureText}>AI-driven Health Insights</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="doctor" size={30} color="#009688" />
          <Text style={styles.featureText}>Doctor Collaboration</Text>
        </View>
      </Animated.View>

      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/auth')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
  button: {
    marginTop: 20,
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
