import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Platform, Alert } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, { displayName });
      
      // Create user profile in Firestore
      await createUserProfile(user, { displayName });
      
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Sign in with email and password
  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create or load user profile
      await createUserProfile(user);
      
      return userCredential;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      let result;
      if (Platform.OS === 'web') {
        // For web, use popup
        result = await signInWithPopup(auth, provider);
      } else {
        // For mobile, this would need Google Sign-In SDK
        // For now, show message that it's web-only
        Alert.alert(
          'تسجيل الدخول بجوجل',
          'تسجيل الدخول بجوجل متاح حالياً على الويب فقط'
        );
        return;
      }
      
      const user = result.user;
      
      // Create or update user profile
      await createUserProfile(user);
      
      return result;
    } catch (error) {
      console.error('Google signin error:', error);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process...');
      await signOut(auth);
      setUserProfile(null);
      console.log('AuthContext: Logout successful');
      
      // Force page reload to ensure clean state
      if (Platform.OS === 'web') {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
      throw error;
    }
  };

  // Create user profile in Firestore
  const createUserProfile = async (user, additionalData = {}) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = new Date().toISOString();
        
        const userData = {
          uid: user.uid,
          displayName: displayName || additionalData.displayName || '',
          email,
          photoURL: photoURL || '',
          createdAt,
          lastLoginAt: createdAt,
          // Game statistics
          statistics: {
            totalGames: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            totalScore: 0,
            averageScore: 0,
            favoriteCategories: [],
            gamesWon: 0,
            streakRecord: 0,
            playtimeMinutes: 0
          },
          // Preferences
          preferences: {
            rewardsEnabled: true,
            pentaPointsEnabled: true,
            theme: 'blue',
            language: 'ar',
            soundEnabled: true,
            notifications: true
          },
          // Achievement tracking
          achievements: {
            firstGame: false,
            first100Points: false,
            first500Points: false,
            first1000Points: false,
            categoryMaster: [], // Categories mastered
            speedDemon: false, // Fast answers
            perfectGame: false, // All correct answers
            socialPlayer: false, // Played with friends
          },
          ...additionalData
        };
        
        await setDoc(userRef, userData);
        setUserProfile(userData);
      } else {
        // Update last login
        await updateDoc(userRef, {
          lastLoginAt: new Date().toISOString()
        });
        
        // Load existing profile
        const existingData = userSnap.data();
        setUserProfile(existingData);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Load user profile
  const loadUserProfile = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserProfile(userData);
        return userData;
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
    return null;
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) return;
      
      const userRef = doc(db, 'users', currentUser.uid);
      
      // First, check if the document exists
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // If document doesn't exist, create it with the updates
        await setDoc(userRef, {
          uid: currentUser.uid,
          displayName: currentUser.displayName || '',
          email: currentUser.email,
          photoURL: currentUser.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          statistics: {
            totalGames: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            totalScore: 0,
            averageScore: 0,
            favoriteCategories: [],
            gamesWon: 0,
            streakRecord: 0,
            playtimeMinutes: 0
          },
          preferences: {
            rewardsEnabled: true,
            pentaPointsEnabled: true,
            theme: 'blue',
            language: 'ar',
            soundEnabled: true,
            notifications: true
          },
          achievements: {
            firstGame: false,
            first100Points: false,
            first500Points: false,
            first1000Points: false,
            categoryMaster: [],
            speedDemon: false,
            perfectGame: false,
            socialPlayer: false,
          },
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } else {
        // If document exists, update it
        await updateDoc(userRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      }
      
      // Update local state
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Create or load user profile when user signs in
        try {
          await createUserProfile(user);
        } catch (error) {
          console.error('Error creating/loading user profile:', error);
          // Still load existing profile even if update fails
          await loadUserProfile(user.uid);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle redirect result for Google Sign-In
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          await createUserProfile(user);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      }
    };

    if (Platform.OS === 'web') {
      handleRedirectResult();
    }
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    signin,
    signInWithGoogle,
    logout,
    createUserProfile,
    loadUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};