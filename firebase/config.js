import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyBfhQMOfg8k4p0hVpMA6G_gpajfyLfJ5-w",
  authDomain: "fakker-auth.firebaseapp.com",
  projectId: "fakker-auth",
  storageBucket: "fakker-auth.firebasestorage.app",
  messagingSenderId: "372931862438",
  appId: "1:372931862438:web:974c4408358809ea297967",
  measurementId: "G-2W827KM685"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Analytics (only on web)
let analytics = null;
if (Platform.OS === 'web') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics not available:', error);
  }
}

export { auth, db, storage, analytics };
export default app;