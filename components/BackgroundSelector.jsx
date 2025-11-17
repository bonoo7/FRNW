import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { PatternDots, PatternGrid, PatternWaves, PatternHexagons, PatternCrosses, PatternDiagonal } from './BackgroundPatterns';

const BackgroundSelector = ({
  children,
}) => {
  const { currentTheme, theme } = useTheme();

  // Dark theme - dark gradient with subtle crosses pattern
  if (currentTheme === 'dark') {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#0F0F0F', '#1A1A1A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <PatternCrosses color="#FFFFFF" opacity={0.03} />
          {children}
        </LinearGradient>
      </View>
    );
  }

  // Fresh theme - light gradient with hexagon pattern
  if (currentTheme === 'fresh') {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#F0F9FF', '#E0F2FE', '#D0E8FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <PatternHexagons color="#3B82F6" opacity={0.06} />
          {children}
        </LinearGradient>
      </View>
    );
  }

  // Default/Blue theme - blue gradient with diagonal lines pattern
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <PatternDiagonal color="#FFFFFF" opacity={0.08} />
        {children}
      </LinearGradient>
    </View>
  );
};

export default BackgroundSelector;
