import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  Easing,
  useSharedValue
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ConfettiPiece = ({ delay, color }) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(Math.random() * SCREEN_WIDTH);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    setTimeout(() => {
      translateY.value = withTiming(SCREEN_HEIGHT + 50, {
        duration: 2000,
        easing: Easing.linear
      });
      rotate.value = withTiming(360 * (Math.random() > 0.5 ? 1 : -1), {
        duration: 2000,
        easing: Easing.linear
      });
      opacity.value = withTiming(0, {
        duration: 2000,
        easing: Easing.linear
      });
    }, delay);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confetti,
        style,
        { backgroundColor: color }
      ]}
    />
  );
};

const WinnerCelebration = ({ isVisible }) => {
  const { theme } = useTheme();

  if (!isVisible) return null;

  const confettiColors = [
    theme.colors.primary,
    theme.colors.accent,
    theme.colors.success,
    theme.colors.warning
  ];

  return (
    <View style={styles.container} pointerEvents="none">
      {Array(400).fill(0).map((_, index) => (
        <ConfettiPiece
          key={index}
          delay={Math.random() * 3000}
          color={confettiColors[index % confettiColors.length]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 16,
    borderRadius: 4,
  }
});

export default WinnerCelebration;
