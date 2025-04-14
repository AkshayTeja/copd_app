import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from './firebase'; // Firebase imports
import { doc, getDoc } from 'firebase/firestore';  // Firestore imports
import * as Notifications from 'expo-notifications'; // Import Expo Notifications

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log("No user data found");
        }
      }
    };

    fetchUserData();
  }, []);

  // Function to request notification permissions
  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // Request permission if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Notification Permission', 'Failed to get push token for push notification!');
      return;
    }
    // Optionally, get and log the push token for later use
    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log('Expo Push Token:', tokenData.data);
    Alert.alert('Notification Permission', 'Notifications are enabled!');
  }

  // Handler when pressing the "Manage Notifications" button
  const handleManageNotifications = async () => {
    await registerForPushNotificationsAsync();
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
        <Ionicons name="arrow-back-outline" size={30} color="#1976D2" />
      </TouchableOpacity>

      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>

      {/* Health Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Information</Text>
        <Text style={styles.infoText}>COPD Severity: {userData.copdSeverity}</Text>
        <Text style={styles.infoText}>Smoking History: {userData.smokingHistory}</Text>
        <Text style={styles.infoText}>Current Medications: {userData.medications}</Text>
      </View>

      {/* Symptom Tracking & Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity & Tracking</Text>
        <Text style={styles.infoText}>Last Symptom Entry: {userData.lastSymptom}</Text>
        <Text style={styles.infoText}>Last Exercise Completed: {userData.lastExercise}</Text>
      </View>

      {/* Doctor Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Doctor & Care Team</Text>
        <Text style={styles.infoText}>Primary Doctor: {userData.doctor}</Text>
        <Text style={styles.infoText}>Next Appointment: {userData.nextAppointment}</Text>
      </View>

      {/* Settings & Logout */}
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingButton} onPress={handleManageNotifications}>
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
    marginLeft: 10,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
