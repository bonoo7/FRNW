import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import BackgroundPattern from '../../components/BackgroundPattern';
import StorageService from '../../services/storageService';
import { GameService } from '../../services/gameService';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, FONTS } from '../../styles/theme';
import categoryImages from '../../assets/categories';
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

export default GameSetupScreen; 