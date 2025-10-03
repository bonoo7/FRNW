import React from 'react';
import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AdminIndex() {
  return (
    <ProtectedRoute requireAuth={true} fallbackMessage="يجب تسجيل الدخول للوصول إلى لوحة الإدارة">
      <Stack.Screen options={{ headerShown: false }} />
      <Redirect href="/admin/question-editor" />
    </ProtectedRoute>
  );
}
