import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
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
      const CITY = 'Manipal';
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Your Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={40} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>Manage your COPD self-care features here.</Text>

      {/* Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/symptoms')}>
          <Ionicons name="pulse-outline" size={40} color="#4CAF50" />
          <Text style={styles.cardText}>Symptom Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/exercise')}>
          <Ionicons name="walk-outline" size={40} color="#FF9800" />
          <Text style={styles.cardText}>Exercises</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => Linking.openURL('tel:1234567890')}>
          <Ionicons name="medkit-outline" size={40} color="#F44336" />
          <Text style={styles.cardText}>Emergency Assistance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/doctors')}>
          <Ionicons name="people-outline" size={40} color="#2196F3" />
          <Text style={styles.cardText}>Find Doctors</Text>
        </TouchableOpacity>
      </View>

      {/* Weather Card */}
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

      {/* Community */}
      <TouchableOpacity style={styles.communityCard} onPress={() => router.push('/community-chat')}>
        <Ionicons name="chatbubbles-outline" size={40} color="#FF5722" />
        <Text style={styles.communityText}>Talk to the Community</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
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
    color: 'red',
  },
  communityCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  communityText: {
    fontSize: 18,
    color: '#FF5722',
    fontWeight: 'bold',
    marginTop: 10,
  },
});
