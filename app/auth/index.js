import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { LoginScreen, RegisterScreen } from '../../components/AuthScreens';

export default function AuthIndex() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          title: isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'
        }} 
      />
      
      {isLogin ? (
        <LoginScreen onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterScreen onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});