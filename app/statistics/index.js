import React from 'react';
import { Stack } from 'expo-router';
import StatisticsScreen from '../../screens/StatisticsScreen';
import RequiredAuthWrapper from '../../components/RequiredAuthWrapper';

export default function StatisticsPage() {
  return (
    <RequiredAuthWrapper 
      title="الإحصائيات والتقدم"
      message="لعرض إحصائياتك وتتبع تقدمك في الألعاب، يجب تسجيل الدخول أولاً"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatisticsScreen />
    </RequiredAuthWrapper>
  );
}