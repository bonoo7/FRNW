import React from 'react';
import { Stack } from 'expo-router';
import ForceAuthScreen from '../../components/ForceAuthScreen';

export default function ForceAuthPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ForceAuthScreen />
    </>
  );
}