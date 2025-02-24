import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
        <Ionicons name="arrow-back-outline" size={30} color="#1976D2" />
      </TouchableOpacity>

      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>johndoe@example.com</Text>
      </View>

      {/* Health Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Information</Text>
        <Text style={styles.infoText}>COPD Severity: Moderate</Text>
        <Text style={styles.infoText}>Smoking History: 5 Years</Text>
        <Text style={styles.infoText}>Current Medications: Albuterol, Inhaler</Text>
      </View>

      {/* Symptom Tracking & Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity & Tracking</Text>
        <Text style={styles.infoText}>Last Symptom Entry: Shortness of Breath (Moderate) - Yesterday</Text>
        <Text style={styles.infoText}>Last Exercise Completed: Deep Breathing - Today</Text>
      </View>

      {/* Doctor Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Doctor & Care Team</Text>
        <Text style={styles.infoText}>Primary Doctor: Dr. Sarah Johnson</Text>
        <Text style={styles.infoText}>Next Appointment: March 10, 2024</Text>
      </View>

      {/* Settings & Logout */}
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingButton} onPress={() => alert('Manage Notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#555" />
          <Text style={styles.settingText}>Manage Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingButton} onPress={() => alert('Change Language')}>
          <Ionicons name="globe-outline" size={24} color="#555" />
          <Text style={styles.settingText}>Change Language</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  backButton: {  // 🔙 Back Button Styling
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
  },
  settingsContainer: {
    width: '100%',
    marginTop: 20,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
