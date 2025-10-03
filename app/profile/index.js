import React from 'react';
import { Stack, useRouter } from 'expo-router';
import UserProfile from '../../components/UserProfile';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ProfilePage() {
  const router = useRouter();
  
  return (
    <ProtectedRoute requireAuth={true} fallbackMessage="يجب تسجيل الدخول لعرض الملف الشخصي">
      <Stack.Screen options={{ headerShown: false }} />
      <UserProfile visible={true} onClose={() => router.back()} />
    </ProtectedRoute>
  );
}