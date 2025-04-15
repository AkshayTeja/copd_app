import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import axios from 'axios';

// Define the type for the doctor response from Google Places API
interface Doctor {
  name: string;
  address: string;
  place_id: string;
  rating?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  vicinity: string;
}

// Define the structure of the Google Places API response
interface GooglePlacesResponse {
  results: {
    name: string;
    vicinity: string;
    place_id: string;
    rating?: number;
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
  }[];
  status: string;
  error_message?: string;
}

// Replace with your actual Google API key
const GOOGLE_API_KEY = 'AIzaSyD2TesSENjPJAtpGzAzI5uZt1XMkuZ8Ga4';

export default function DoctorsScreen() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const location = await getUserLocation();
        if (location) {
          const results = await fetchNearbyDoctors(location.latitude, location.longitude);
          setDoctors(results);
        }
      } catch (error) {
        console.error("Error in loadDoctors:", error);
        setErrorMessage("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to find nearby doctors.');
        setErrorMessage("Location permission denied");
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Less battery usage than High
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert('Error', 'Failed to get your location. Please check your location settings.');
      return null;
    }
  };

  const fetchNearbyDoctors = async (latitude: number, longitude: number): Promise<Doctor[]> => {
    const radius = 5000; // meters
    const type = 'doctor'; // Use type instead of keyword for better results
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await axios.get<GooglePlacesResponse>(url);
      
      // Check API response status
      if (response.data.status !== 'OK') {
        const errorMsg = response.data.error_message || 'API Error: ' + response.data.status;
        console.error('Google Places API Error:', errorMsg);
        setErrorMessage(errorMsg);
        return [];
      }

      const data = response.data.results;

      // Check if no results are found
      if (data.length === 0) {
        Alert.alert('No doctors found', 'There are no doctors nearby. Try increasing the search radius.');
      }

      // Map the results to the Doctor type
      return data.map((item) => ({
        name: item.name,
        address: item.vicinity,
        place_id: item.place_id,
        rating: item.rating,
        photos: item.photos,
        vicinity: item.vicinity
      }));
    } catch (error) {
      console.error('Error fetching nearby doctors:', error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(`Network error: ${error.message}`);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
      return [];
    }
  };

  const openInMaps = (doctor: Doctor) => {
    // Open the location in the maps app
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.name)}&query_place_id=${doctor.place_id}`;
    Linking.openURL(mapUrl).catch(err => {
      console.error('Error opening map:', err);
      Alert.alert('Error', 'Could not open maps application');
    });
  };

  const getPhotoUrl = (photoReference: string) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text>Loading nearby doctors...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {errorMessage}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard')}>
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Find Nearby Doctors</Text>

      {doctors.length === 0 ? (
        <Text style={styles.noResultsText}>No doctors found in your area</Text>
      ) : (
        doctors.map((doctor, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.card}
            onPress={() => openInMaps(doctor)}
          >
            {doctor.photos && doctor.photos.length > 0 ? (
              <Image 
                source={{ uri: getPhotoUrl(doctor.photos[0].photo_reference) }} 
                style={styles.cardImage}
                defaultSource={require('../assets/images/maps.png')}
              />
            ) : (
              <Image source={require('../assets/images/maps.png')} style={styles.cardImage} />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{doctor.name}</Text>
              <Text style={styles.cardText}>{doctor.address}</Text>
              {doctor.rating && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>Rating: {doctor.rating.toFixed(1)}</Text>
                  <Text style={styles.ratingStars}>
                    {'★'.repeat(Math.floor(doctor.rating)) + 
                     (doctor.rating % 1 >= 0.5 ? '½' : '')}
                  </Text>
                </View>
              )}
              <Text style={styles.tapText}>Tap to view in Maps</Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard')}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1976D2',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 16,
    color: '#444',
    marginRight: 5,
  },
  ratingStars: {
    fontSize: 16,
    color: '#FFC107',
    fontWeight: 'bold',
  },
  tapText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});