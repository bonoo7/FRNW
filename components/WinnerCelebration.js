import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ConfettiPiece = ({ delay, color }) => {
  const translateY = React.useRef(new Animated.Value(-20)).current;
  const translateX = React.useRef(new Animated.Value(Math.random() * SCREEN_WIDTH)).current;
  const rotate = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 50,
          duration: 2000,
          useNativeDriver: false
        }),
        Animated.timing(rotate, {
          toValue: 360 * (Math.random() > 0.5 ? 1 : -1),
          duration: 2000,
          useNativeDriver: false
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false
        })
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, translateY, rotate, opacity]);

  const rotateString = rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  });

  const style = {
    transform: [
      { translateY },
      { translateX },
      { rotate: rotateString }
    ],
    opacity
  };

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
