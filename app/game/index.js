import React from 'react';
import GameScreen from '../../screens/GameScreen';
import RequiredAuthWrapper from '../../components/RequiredAuthWrapper';

export default function GamePage() {
  return (
    <RequiredAuthWrapper 
      title="اللعبة تتطلب تسجيل الدخول"
      message="لبدء اللعبة وحفظ نتائجك والتنافس مع الفرق، يجب تسجيل الدخول أولاً"
    >
      <GameScreen />
    </RequiredAuthWrapper>
  );
}