import React from 'react';
import { Stack, useRouter } from 'expo-router';
import UserProfile from '../../components/UserProfile';
import RequiredAuthWrapper from '../../components/RequiredAuthWrapper';

export default function ProfilePage() {
  const router = useRouter();
  
  return (
    <RequiredAuthWrapper 
      title="الملف الشخصي" 
      message="لعرض وإدارة ملفك الشخصي، يجب تسجيل الدخول أولاً"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <UserProfile visible={true} onClose={() => router.back()} />
    </RequiredAuthWrapper>
  );
}