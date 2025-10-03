import React from 'react';
import { Stack } from 'expo-router';
import RequiredAuthWrapper from '../../components/RequiredAuthWrapper';
import GameScreen from '../../screens/GameScreen';

/**
 * صفحة تجبر المستخدم على تسجيل الدخول قبل اللعب
 * هذه ميزة مفيدة للمطورين الأحين يريدون إجبار المستخدمين على التسجيل
 */
export default function AuthRequiredGamePage() {
  return (
    <RequiredAuthWrapper 
      title="تسجيل الدخول مطلوب للعب"
      message="للاستمتاع بتجربة اللعب الكاملة وحفظ نتائجك، يجب تسجيل الدخول أولاً"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <GameScreen forceAuth={true} />
    </RequiredAuthWrapper>
  );
}