import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function DashboardScreen() {
  const router = useRouter();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const API_KEY = '252b968530ad0a9e12c8395ab84a4430';
      const CITY = 'Manipal'; // Change this to user's location dynamically if needed
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
      );

      setWeather(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch weather data');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Profile Icon */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Your Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={40} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>Manage your COPD self-care features here.</Text>

      {/* Feature Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/symptoms')}>
          <Ionicons name="pulse-outline" size={40} color="#4CAF50" style={styles.icon} />
          <Text style={styles.cardText}>Symptom Tracker</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/exercise')}>
          <Ionicons name="walk-outline" size={40} color="#FF9800" style={styles.icon} />
          <Text style={styles.cardText}>Exercises</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => Linking.openURL('tel:1234567890')}>
          <Ionicons name="medkit-outline" size={40} color="#F44336" style={styles.icon} />
          <Text style={styles.cardText}>Emergency Assistance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/doctors')}>
          <Ionicons name="people-outline" size={40} color="#2196F3" style={styles.icon} />
          <Text style={styles.cardText}>Find Doctors</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 Live Weather Card */}
      <View style={styles.weatherCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#1976D2" />
        ) : weather ? (
          <>
            <Text style={styles.weatherTitle}>Live Weather Updates</Text>
            <Ionicons name="cloud-outline" size={40} color="#2196F3" />
            <Text style={styles.weatherText}>
              {weather.name}: {weather.weather[0].description}
            </Text>
            <Text style={styles.weatherText}>🌡 {weather.main.temp}°C</Text>
            <Text style={styles.weatherText}>💨 Wind: {weather.wind.speed} m/s</Text>
            <Text style={styles.weatherText}>💧 Humidity: {weather.main.humidity}%</Text>
          </>
        ) : (
          <Text style={styles.weatherError}>⚠️ Failed to load weather</Text>
        )}
      </View>

      {/* 🗣 Talk to Community Card */}
      <TouchableOpacity style={styles.communityCard} onPress={() => router.push('/community-chat')}>
        <Ionicons name="chatbubbles-outline" size={40} color="#FF5722" style={styles.icon} />
        <Text style={styles.communityText}>Talk to the Community</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  icon: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  weatherCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  weatherText: {
    fontSize: 16,
    color: '#444',
  },
  weatherError: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  communityCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  communityText: {
    fontSize: 18,
    color: '#FF5722',
    fontWeight: 'bold',
  },
});
