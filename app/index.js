import React from 'react';
import { Stack } from 'expo-router';
import HomeScreen from '../screens/HomeScreen';
import AuthGuard from '../components/AuthGuard';

export default function HomePage() {
  return (
    <AuthGuard forceAuth={false}>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </AuthGuard>
  );
}