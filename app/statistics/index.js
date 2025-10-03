import React from 'react';
import { Stack } from 'expo-router';
import StatisticsScreen from '../../screens/StatisticsScreen';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function StatisticsPage() {
  return (
    <ProtectedRoute requireAuth={true} fallbackMessage="يجب تسجيل الدخول لعرض الإحصائيات">
      <Stack.Screen options={{ headerShown: false }} />
      <StatisticsScreen />
    </ProtectedRoute>
  );
}