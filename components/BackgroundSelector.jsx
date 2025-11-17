import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const BackgroundSelector = ({
  children,
}) => {
  const { currentTheme, theme } = useTheme();

  // Dark theme - simple dark background
  if (currentTheme === 'dark') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        {children}
      </View>
    );
  }

  // Fresh theme - simple gradient background
  if (currentTheme === 'fresh') {
    return (
      <LinearGradient
        colors={['#F0F9FF', '#E0F2FE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }

  // Default/Light theme - simple light background
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {children}
    </View>
  );
};

export default BackgroundSelector;
