import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function SymptomsScreen() {
  const [showSymptoms, setShowSymptoms] = useState(true);
  const [date, setDate] = useState('');
  const [symptomsData, setSymptomsData] = useState<{ date: string; symptoms: string }[]>([]);

  const symptoms = [
    { name: 'Shortness of Breath', description: 'Difficulty in breathing, often worsened by physical activity.' },
    { name: 'Chronic Cough', description: 'Persistent cough that produces mucus, often more noticeable in the morning.' },
    { name: 'Wheezing', description: 'A high-pitched whistling sound made during breathing, often a sign of airway obstruction.' },
    { name: 'Fatigue', description: 'A feeling of tiredness and exhaustion that can result from decreased oxygen levels.' },
    { name: 'Sputum Production', description: 'Excess mucus production in the lungs, varying in color and consistency.' },
    { name: 'Chest Tightness', description: 'A feeling of pressure or constriction in the chest, often associated with difficulty in breathing.' },
  ];

  const severityLevels = ['Mild', 'Moderate', 'Severe'];

  const handleAddEntry = async () => {
    if (!date) {
      Alert.alert('Error', 'Please enter todays date.');
      return;
    }

    let symptomEntries: string[] = [];
    for (let symptom of symptoms) {
      let level = await new Promise<string | null>((resolve) => {
        Alert.alert(
          `Select severity for ${symptom.name}`,
          symptom.description,
          [
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

    setSymptomsData([...symptomsData, { date, symptoms: symptomEntries.join(', ') }]);
    setDate('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Symptom Tracker</Text>
      <Text style={styles.description}>
        Chronic Obstructive Pulmonary Disease (COPD) is a progressive lung disease that causes breathing difficulties. 
        The key symptoms of COPD can vary in intensity, and a symptom tracker can help monitor the disease.
      </Text>

      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowSymptoms(!showSymptoms)}>
        <Text style={styles.toggleButtonText}>{showSymptoms ? 'Hide Symptoms' : 'Show Symptoms'}</Text>
      </TouchableOpacity>

      {showSymptoms && (
        <View>
          <Text style={styles.subtitle}>Common COPD Symptoms</Text>
          {symptoms.map((symptom, index) => (
            <View key={index}>
              <Text style={styles.list}>{index + 1}. {symptom.name} (Mild, Moderate, Severe)</Text>
              <Text style={styles.description}>{symptom.description}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.subtitle}>Symptom Tracking Table</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter today's date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
        <Text style={styles.addButtonText}>Add Entry</Text>
      </TouchableOpacity>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Date</Text>
          <Text style={styles.tableHeader}>Symptoms</Text>
        </View>
        {symptomsData.map((entry, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{entry.date}</Text>
            <Text style={styles.tableCell}>{entry.symptoms}</Text>
          </View>
        ))}
      </View>
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
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  list: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: '#B3E5FC',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    padding: 10,
    textAlign: 'center',
  },
});