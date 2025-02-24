import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to COPD Self-Care App</Text>
      <Text style={styles.description}>
        This app helps COPD patients manage their condition with:
        {"\n"}- Symptom Tracking
        {"\n"}- Medication Reminders
        {"\n"}- Emergency Action Plan
        {"\n"}- Air Quality Alerts
        {"\n"}- AI-driven Health Insights
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#121212', // Dark background for contrast
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'white', // Change text color to white
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      color: 'white', // Change text color to white
    },
  });
  
