import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7zhPmejtehdLu5PLje3K37Vie4_sMPZI",
  authDomain: "copd-app-ca470.firebaseapp.com",
  projectId: "copd-app-ca470",
  storageBucket: "copd-app-ca470.firebasestorage.app",
  messagingSenderId: "641876872329",
  appId: "1:641876872329:web:04b909b3c9e768f48f4a58",
  measurementId: "G-4C4XP6H0K3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore
