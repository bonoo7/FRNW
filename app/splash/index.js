import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import SplashScreen from '../../components/SplashScreen';

export default function SplashScreenPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
    // التنقل للصفحة الرئيسية أو صفحة المصادقة
    router.replace('/');
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <View style={{ flex: 1 }} />;
}
