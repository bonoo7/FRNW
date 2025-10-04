import React from 'react';
import { Stack } from 'expo-router';
import GameSetup from '../../components/GameSetup';
import RequiredAuthWrapper from '../../components/RequiredAuthWrapper';

const GameSetupScreen = () => {
  return (
    <RequiredAuthWrapper 
      title="إعداد اللعبة"
      message="لإعداد اللعبة وحفظ البيانات، يجب تسجيل الدخول أولاً"
    >
      <Stack.Screen 
        options={{
          title: 'إعداد اللعبة',
          headerShown: false
        }}
      />
      <GameSetup />
    </RequiredAuthWrapper>
  );
};

export default GameSetupScreen; 