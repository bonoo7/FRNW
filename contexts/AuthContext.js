import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Platform, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

WebBrowser.maybeCompleteAuthSession();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
    iosClientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
    androidClientId: '372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com',
    scopes: ['profile', 'email']
  });

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === 'success' && response?.authentication) {
      handleGoogleAuthResponse(response.authentication)
        .catch(error => {
          console.error('Error handling auth response:', error);
          Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مجدداً');
        });
    } else if (response?.type === 'dismiss') {
      console.log('Google login dismissed by user');
    }
  }, [response]);

  // Handle Expo Auth response
  const handleGoogleAuthResponse = async (authentication) => {
    try {
      if (!authentication) {
        throw new Error('لم يتم استقبال بيانات المصادقة من Google');
      }

      console.log('Authentication object:', {
        hasIdToken: !!authentication.idToken,
        hasAccessToken: !!authentication.accessToken,
        keys: Object.keys(authentication)
      });

      // محاولة استخدام idToken + accessToken
      let credential;
      
      if (authentication.idToken && authentication.accessToken) {
        credential = GoogleAuthProvider.credential(
          authentication.idToken,
          authentication.accessToken
        );
      } else if (authentication.accessToken) {
        // إذا لم يكن هناك idToken، استخدم accessToken فقط
        credential = GoogleAuthProvider.credential(
          null,
          authentication.accessToken
        );
      } else {
        throw new Error('لا توجد بيانات مصادقة صحيحة: لا idToken ولا accessToken');
      }
      
      const result = await signInWithCredential(auth, credential);
      await createUserProfile(result.user);
      console.log('Google signin successful');
    } catch (error) {
      console.error('Error handling Expo auth response:', error);
      throw error;
    }
  };

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
      // للويب استخدم signInWithPopup بدلاً من Expo
      if (Platform.OS === 'web') {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          await createUserProfile(result.user);
          console.log('Web Google signin successful');
          return { type: 'success' };
        } catch (error) {
          console.error('Web popup signin error:', error);
          if (error.code === 'auth/popup-closed-by-user') {
            return { type: 'dismiss' };
          }
          throw error;
        }
      }
      
      // للموبايل استخدم Expo
      const result = await promptAsync();
      
      // Check if user cancelled
      if (result?.type !== 'success') {
        console.log('Google login cancelled');
        return result;
      }

      // The response will be handled by useEffect
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
          // Credits System (Freemium)
          credits: {
            remaining: 2,              // رصيد البداية: لعبتان مجانيتان
            initialFree: 2,            // عدد الألعاب المجانية الممنوحة عند التسجيل
            totalPurchased: 0,         // إجمالي الألعاب المشتراة
            totalUsed: 0,              // إجمالي الألعاب المستخدمة
            totalGranted: 0,           // إجمالي الألعاب المجانية الممنوحة (مكافآت)
            lastUsedAt: null,          // آخر استخدام للرصيد
            lastPurchaseAt: null       // آخر عملية شراء
          },
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

  // Handle redirect result for Google Sign-In - REMOVED FOR EXPO GO
  // useEffect(() => {
  //   const handleRedirectResult = async () => {
  //     try {
  //       const result = await getRedirectResult(auth);
  //       if (result) {
  //         const user = result.user;
  //         await createUserProfile(user);
  //       }
  //     } catch (error) {
  //       console.error('Redirect result error:', error);
  //     }
  //   };
  //
  //   if (Platform.OS === 'web') {
  //     handleRedirectResult();
  //   }
  // }, []);

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