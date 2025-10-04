import React from 'react';
import { Stack } from 'expo-router';
import HomeScreen from '../screens/HomeScreen';
import RequiredAuthWrapper from '../components/RequiredAuthWrapper';

export default function HomePage() {
  return (
    <RequiredAuthWrapper 
      title="مرحباً بك في تطبيق فكّر"
      message="للاستمتاع بجميع ميزات التطبيق وحفظ تقدمك، يجب تسجيل الدخول أولاً"
      showGuestOption={false}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </RequiredAuthWrapper>
  );
}