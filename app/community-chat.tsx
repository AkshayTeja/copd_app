import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Function to show chat guidelines
  const showGuidelines = () => {
    Alert.alert(
      "Community Chat Guidelines",
      "✅ Be respectful to others.\n✅ Keep discussions related to COPD and health experiences.\n✅ Avoid spamming or sharing personal data.\n✅ Support each other and engage in positive discussions.",
      [{ text: "OK", style: "cancel" }]
    );
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'User', // Placeholder for now
    };

    setMessages([...messages, messageData]);
    setNewMessage('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Header Section with Back & Info Buttons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back-outline" size={30} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.title}>Community Chat</Text>
        <TouchableOpacity onPress={showGuidelines}>
          <Ionicons name="information-circle-outline" size={30} color="#1976D2" />
        </TouchableOpacity>
      </View>

      {/* Description Below the Heading */}
      <Text style={styles.description}>
        🗣️ Share your COPD journey, ask questions, and connect with others experiencing similar challenges.
      </Text>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.sender}>{item.sender}:</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Input & Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  messageContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sender: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  messageText: {
    fontSize: 16,
    color: '#444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 30,
  },
});

