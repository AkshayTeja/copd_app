import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// Define TypeScript interface for symptom entries
interface SymptomEntry {
  date: string;
  symptoms: string;
}

export default function SymptomsScreen() {
  const [showSymptoms, setShowSymptoms] = useState(true);
  const [date, setDate] = useState('');
  const [symptomsData, setSymptomsData] = useState<SymptomEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const symptoms = [
    { name: 'Shortness of Breath', description: 'Difficulty in breathing, often worsened by physical activity.' },
    { name: 'Chronic Cough', description: 'Persistent cough that produces mucus, often more noticeable in the morning.' },
    { name: 'Wheezing', description: 'A high-pitched whistling sound made during breathing, often a sign of airway obstruction.' },
    { name: 'Fatigue', description: 'A feeling of tiredness and exhaustion that can result from decreased oxygen levels.' },
    { name: 'Sputum Production', description: 'Excess mucus production in the lungs, varying in color and consistency.' },
    { name: 'Chest Tightness', description: 'A feeling of pressure or constriction in the chest, often associated with difficulty in breathing.' },
  ];

  // Load saved symptom data when component mounts
  useEffect(() => {
    loadSymptomsData();
  }, []);

  // Function to load saved symptom data from AsyncStorage
  const loadSymptomsData = async () => {
    try {
      setIsLoading(true);
      const savedData = await AsyncStorage.getItem('symptomsData');
      if (savedData) {
        setSymptomsData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading symptom data:', error);
      Alert.alert('Error', 'Failed to load your symptom history.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save symptom data to AsyncStorage
  const saveSymptomsData = async (data: SymptomEntry[]) => {
    try {
      await AsyncStorage.setItem('symptomsData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving symptom data:', error);
      Alert.alert('Error', 'Failed to save your symptom data.');
    }
  };

  // Function to set today's date automatically
  const setTodaysDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
  };

  const handleAddEntry = async () => {
    if (!date) {
      Alert.alert('Error', 'Please enter today\'s date.');
      return;
    }

    // Check if an entry for this date already exists
    const existingEntry = symptomsData.find(entry => entry.date === date);
    if (existingEntry) {
      Alert.alert(
        'Date Already Exists',
        'An entry for this date already exists. Do you want to replace it?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Replace', onPress: () => collectAndSaveSymptoms() }
        ]
      );
    } else {
      collectAndSaveSymptoms();
    }
  };

  const collectAndSaveSymptoms = async () => {
    let symptomEntries: string[] = [];
    for (let symptom of symptoms) {
      let level = await new Promise<string | null>((resolve) => {
        Alert.alert(
          `Select severity for ${symptom.name}`,
          symptom.description,
          [
            { text: 'Skip', onPress: () => resolve(null) },
            { text: 'Mild', onPress: () => resolve('Mild') },
            { text: 'Moderate', onPress: () => resolve('Moderate') },
            { text: 'Severe', onPress: () => resolve('Severe') },
          ],
          { cancelable: false }
        );
      });

      if (level) {
        symptomEntries.push(`${symptom.name} (${level})`);
      }
    }

    if (symptomEntries.length === 0) {
      Alert.alert('No Symptoms', 'No symptoms were selected. Entry not saved.');
      return;
    }

    // Remove any existing entry for the same date
    const filteredData = symptomsData.filter(entry => entry.date !== date);

    // Add the new entry
    const updatedData = [...filteredData, { date, symptoms: symptomEntries.join(', ') }];

    // Sort by date (newest first)
    updatedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setSymptomsData(updatedData);
    await saveSymptomsData(updatedData);
    setDate('');

    Alert.alert('Success', 'Symptom data saved successfully!');
  };

  const handleDeleteEntry = (indexToDelete: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const updatedData = symptomsData.filter((_, index) => index !== indexToDelete);
            setSymptomsData(updatedData);
            await saveSymptomsData(updatedData);
            Alert.alert('Deleted', 'Entry has been removed.');
          } 
        }
      ]
    );
  };

  const generateChartData = () => {
    const labels: string[] = []; // Dates on the x-axis
    const dataset: any[] = symptoms.map(() => ({ data: [] })); // One dataset per symptom
  
    // Process symptoms data
    symptomsData.forEach((entry) => {
      labels.push(entry.date); // Add the date to the labels
  
      // Process each symptom's severity for the current entry
      const symptomLevels = entry.symptoms.split(', ').map((symptom) => {
        const [name, severity] = symptom.split('(');
        const level = severity?.replace(')', '').trim();
        return level ? ['Mild', 'Moderate', 'Severe'].indexOf(level) + 1 : 0;
      });
  
      // Push the severity level for each symptom into its corresponding dataset
      symptomLevels.forEach((level, index) => {
        dataset[index].data.push(level);
      });
    });
  
    // Prepare chart data
    return {
      labels, // Dates
      datasets: dataset.map((item: { data: any; }, index: number) => ({
        data: item.data, // Severity levels
        color: (opacity = 1) => `rgba(${(index + 1) * 50}, 150, 255, ${opacity})`, // Color for each line
        strokeWidth: 2, // Line thickness
        legendLabel: symptoms[index]?.name, // Symptom name in the legend
      })),
    };
  };
  
  

  const renderSymptomEntries = () => {
    return symptomsData.map((entry, index) => (
      <View key={index} style={styles.tableRow}>
        <Text style={styles.tableCell}>{entry.date}</Text>
        <Text style={styles.tableCell}>{entry.symptoms}</Text>
        <TouchableOpacity onPress={() => handleDeleteEntry(index)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>COPD Symptom Tracker</Text>
      <Text style={styles.description}>
        Track your COPD symptoms over time to monitor your condition and share with your healthcare provider.
      </Text>

      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowSymptoms(!showSymptoms)}>
        <Text style={styles.toggleButtonText}>{showSymptoms ? 'Hide Symptoms Info' : 'Show Symptoms Info'}</Text>
      </TouchableOpacity>

      {showSymptoms && (
        <View style={styles.symptomsInfoSection}>
          <Text style={styles.subtitle}>Common COPD Symptoms</Text>
          {symptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomItem}>
              <Text style={styles.symptomName}>{index + 1}. {symptom.name}</Text>
              <Text style={styles.symptomDescription}>{symptom.description}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.subtitle}>Add New Symptom Entry</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity style={styles.todayButton} onPress={setTodaysDate}>
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
        <Text style={styles.addButtonText}>Add Symptom Entry</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Symptom Insights</Text>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading your symptom history...</Text>
      ) : symptomsData.length === 0 ? (
        <Text style={styles.noDataText}>No symptom entries yet. Add your first entry above.</Text>
      ) : (
        <>
          <View style={styles.chartContainer}>
          <LineChart
              data={generateChartData()} // Pass the data for the chart
              width={Dimensions.get('window').width - 40} // Adjust width with padding
              height={220} // Set height of the chart
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0, // No decimal places for severity levels
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color for the axis
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color for labels
                style: { borderRadius: 16 },
                propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' }, // Style for the data points
              }}
              bezier // Smooth lines
            />

          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Date</Text>
              <Text style={styles.tableHeader}>Symptoms</Text>
              <Text style={styles.tableHeader}>Actions</Text>
            </View>
            {renderSymptomEntries()}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1976D2',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  symptomsInfoSection: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
  },
  symptomItem: {
    marginBottom: 10,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  symptomDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
  },
  toggleButton: {
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  toggleButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  todayButton: {
    backgroundColor: '#673AB7',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  todayButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#388E3C',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    margin: 20,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    margin: 20,
    fontStyle: 'italic',
    color: '#666',
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  tableHeader: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#B3E5FC',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 14,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
