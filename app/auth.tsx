import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from './firebase'; // import Firestore and Auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign-Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [copdSeverity, setCopdSeverity] = useState('');
  const [smokingHistory, setSmokingHistory] = useState('');
  const [medications, setMedications] = useState('');
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');


  const handleAuth = async () => {
    try {
      if (isLogin) {
        // Login User
        await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Login successful");
      } else {
        // Sign Up User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Save additional user data to Firestore
        await setDoc(doc(db, 'users', uid), {
          name,
          email,
          copdSeverity,
          smokingHistory,
          medications,
          lastSymptom: 'N/A',
          lastExercise: 'N/A',
          doctor: 'N/A',
          nextAppointment: 'N/A',
        });

        console.log("✅ Signup successful and data saved");
      }

      // Redirect to Dashboard after successful login/sign-up
      router.push('/dashboard');
    } catch (error: any) {
      console.log("❌ Auth Error:", error.message);
      Alert.alert("Authentication Failed", error.message); // Display alert if there's an error
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", "Check your email for password reset instructions.");
    } catch (error: any) {
      console.log("❌ Reset Password Error:", error.message);
      Alert.alert("Reset Password Failed", error.message); // Display alert if reset fails
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>

      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={displayName}
            onChangeText={setDisplayName}
          />

          {/* Name Field for Sign-Up */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          {/* COPD Severity Field */}
          <TextInput
            style={styles.input}
            placeholder="COPD Severity"
            value={copdSeverity}
            onChangeText={setCopdSeverity}
          />

          {/* Smoking History Field */}
          <TextInput
            style={styles.input}
            placeholder="Smoking History"
            value={smokingHistory}
            onChangeText={setSmokingHistory}
          />

          {/* Medications Field */}
          <TextInput
            style={styles.input}
            placeholder="Current Medications"
            value={medications}
            onChangeText={setMedications}
          />
        </>
      )}

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
      </TouchableOpacity>

      {/* Password Reset Link for Login */}
      {isLogin && (
        <TouchableOpacity onPress={handlePasswordReset}>
          <Text style={styles.toggleText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}

      {/* Toggle between Login and Sign-Up */}
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles for Auth Screen
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#1976D2',
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleText: {
    marginTop: 15,
    color: '#1976D2',
    fontSize: 16,
  },
});
