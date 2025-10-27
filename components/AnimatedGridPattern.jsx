import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Platform } from 'react-native';

const AnimatedGridPattern = ({ 
  width = 80, 
  height = 80, 
  dotSize = 12,
  dotColor = '#4285F4',
  dotOpacity = 0.3,
  animationDuration = 3000,
  animationDelay = 0,
  shapeType = 'rounded-square',
  variant = 'default',
  isAnimated = true, // يتحكم في تفعيل الحركة
}) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const cols = Math.ceil(screenWidth / width) + 2;
  const rows = Math.ceil(screenHeight / height) + 2;
  
  const animationValues = useRef(
    Array.from({ length: rows * cols }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // فقط إذا كان isAnimated = true
    if (!isAnimated) return;
    
    animationValues.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: animationDuration / 2,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: animationDuration / 2,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      ).start();
    });
  }, [animationValues, animationDuration, isAnimated]);

  const cells = animationValues.map((animValue, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * width - width;
    const y = row * height - height;

    // بدون حركة إذا كان isAnimated = false
    const opacity = isAnimated 
      ? animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [dotOpacity * 0.3, dotOpacity],
        })
      : dotOpacity;

    const scale = isAnimated
      ? animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.5, 1.5, 0.5],
        })
      : 1;

    const rotate = isAnimated
      ? animValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        })
      : '0deg';

    // للخلفية الخارجية - شكل مختلف (نقاط فقط)
    if (variant === 'background') {
      return (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: dotColor,
            opacity,
            transform: [{ scale }],
            left: x,
            top: y,
            shadowColor: dotColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 6,
            elevation: 4,
          }}
        />
      );
    }

    // شكل مربع بزوايا دائرية عصري
    if (shapeType === 'rounded-square') {
      return (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize * 0.3,
            backgroundColor: dotColor,
            opacity,
            transform: [{ scale }, { rotate }],
            left: x,
            top: y,
            shadowColor: dotColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 8,
            elevation: 5,
            borderWidth: 1.5,
            borderColor: dotColor,
          }}
        />
      );
    }

    // شكل مربع بحدود فقط (Outline)
    if (shapeType === 'outline-square') {
      return (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize * 0.25,
            backgroundColor: 'transparent',
            opacity,
            transform: [{ scale }, { rotate }],
            left: x,
            top: y,
            shadowColor: dotColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 6,
            elevation: 4,
            borderWidth: 2,
            borderColor: dotColor,
          }}
        />
      );
    }

    // شكل ماسة (Diamond)
    if (shapeType === 'diamond') {
      return (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            opacity,
            transform: [{ rotate: '45deg' }, { scale }, { rotate: '-45deg' }],
            left: x,
            top: y,
            shadowColor: dotColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 8,
            elevation: 5,
            borderRadius: dotSize * 0.1,
          }}
        />
      );
    }

    // شكل افتراضي - مربع دائري
    return (
      <Animated.View
        key={index}
        style={{
          position: 'absolute',
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize * 0.3,
          backgroundColor: dotColor,
          opacity,
          transform: [{ scale }, { rotate }],
          left: x,
          top: y,
          shadowColor: dotColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 5,
          borderWidth: 1.5,
          borderColor: dotColor,
        }}
      />
    );
  });

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {cells}
    </View>
  );
};

export default AnimatedGridPattern;
