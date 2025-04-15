import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log('No user data found');
        }
      }
    };

    fetchUserData();
  }, []);

  // Register for Push Notifications and send a test notification immediately
  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Notification Permission', 'Failed to get push token for push notification!');
      return;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log('Expo Push Token:', tokenData.data);
    Alert.alert('Notification Permission', 'Notifications are enabled!');

    // Send a push notification immediately after enabling it
    sendPushNotification(tokenData.data);
  }

  // Function to send Push Notification
  async function sendPushNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Welcome!',
      body: 'You have successfully enabled notifications!',
      data: { someData: 'Test data' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    console.log('Push notification sent!');
  }

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);

    if (newValue) {
      await registerForPushNotificationsAsync();
    } else {
      Alert.alert('Notifications Disabled', 'You will no longer receive notifications.');
      // Optionally remove/disable push token from the server
    }
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

      {/* Settings & Logout */}
      <View style={styles.settingsContainer}>
        <View style={styles.settingButton}>
          <Ionicons name="notifications-outline" size={24} color="#555" />
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            style={{ marginLeft: 'auto' }}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor={'#fff'}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
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
