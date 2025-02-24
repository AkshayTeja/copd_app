import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const dummyDoctors = [
  { name: 'Dr. John Smith', specialty: 'General Physician', address: '123 Main St, City, State', phone: '123-456-7890' },
  { name: 'Dr. Sarah Johnson', specialty: 'Lung Specialist', address: '456 Oak Ave, City, State', phone: '234-567-8901' },
  { name: 'Dr. Emily Davis', specialty: 'Pulmonologist', address: '789 Pine Rd, City, State', phone: '345-678-9012' },
  { name: 'Dr. Michael Brown', specialty: 'General Practitioner', address: '101 Maple Dr, City, State', phone: '456-789-0123' },
  { name: 'Dr. Anna White', specialty: 'Respiratory Therapist', address: '202 Elm St, City, State', phone: '567-890-1234' },
];

export default function DoctorsScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Find Nearby Doctors</Text>

      {/* Static Map Image */}
      <Image source={require('../assets/images/maps.png')} style={styles.mapImage} />

      {/* Dummy Doctor List */}
      {dummyDoctors.map((doctor, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{doctor.name}</Text>
          <Text style={styles.cardText}>{doctor.specialty}</Text>
          <Text style={styles.cardText}>{doctor.address}</Text>
          <Text style={styles.cardText}>📞 {doctor.phone}</Text>
        </View>
      ))}

      {/* Back to Dashboard Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard')}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mapImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
    color: '#444',
  },
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
