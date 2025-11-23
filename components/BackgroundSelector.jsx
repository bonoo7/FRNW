import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Pattern, Rect, Circle, Polygon, Path } from 'react-native-svg';

const BackgroundSelector = ({ children }) => {
  const { currentTheme } = useTheme();

  // For web platform
  const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

  if (isWeb) {
    let backgroundStyle = {};

    // Dark theme
    if (currentTheme === 'dark') {
      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: `
          repeating-conic-gradient(
            from 61.93deg at 75% 36.5%,
            #1a1a1a 0%, #1a1a1a 2%, #0d0d0d 16%, transparent 0% 100%
          ) 50% / calc(20px * 12) calc(20px * 12.8),
          repeating-conic-gradient(
            from 118.07deg at 75% 87.5%,
            #3a3a3a 0% 34.5%, transparent 0% 100%
          ) 50% / calc(20px * 12) calc(20px * 12.8),
          repeating-conic-gradient(
            from 118.07deg at 50% 75%,
            transparent 2%, #0d0d0d 17.15%, transparent 0% 100%
          ) 50% / calc(20px * 12) calc(20px * 12.8),
          repeating-conic-gradient(
            from 61.93deg at 50% 50%,
            #3a3a3a 0% 15.59%, #2d2d2d 0% 32.79%, transparent 0% 100%
          ) 50% / calc(20px * 12) calc(20px * 12.8),
          repeating-conic-gradient(
            from -118.07deg at 25% 12.5%,
            #2d2d2d 0% 32.79%, #1a1a1a 0% 50%, transparent 0% 100%
          ) 50% / calc(20px * 12) calc(20px * 12.8),
          repeating-conic-gradient(
            from -61.93deg at 25% 87.5%,
            transparent 0 67.25%, #2d2d2d 0% 100%
          ) 50% / calc(20px * 12) calc(20px * 12.8),
          repeating-conic-gradient(
            from -61.93deg at 50% 75%,
            transparent 0% 66.5%, #1a1a1a 0% 84.25%, #3a3a3a 0% 100%
          ) 50% / calc(20px * 12) calc(20px * 12.8),
          repeating-conic-gradient(
            from -61.93deg at 25% 37.5%,
            #3a3a3a 0% 34.5%, #1a1a1a 0% 67.25%, #2d2d2d 0% 100%
          ) 50% / calc(20px * 12) calc(20px * 12.8)
        `,
        zIndex: 0
      };
    }
    // Fresh theme
    else if (currentTheme === 'fresh') {
      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: `
          radial-gradient(circle at top left, #90EE90 0%, #90EE90 8%, transparent 15%),
          radial-gradient(circle at top left, transparent 5%, #FFFF00 5%, #FFFF00 18%, transparent 25%),
          radial-gradient(circle at top left, transparent 12%, #ff9966 12%, #ff9966 30%, transparent 38%),
          radial-gradient(circle at top left, transparent 20%, #88e9a0 20%, #88e9a0 42%, transparent 50%),
          radial-gradient(circle at top left, transparent 35%, #90EE90 35%, #90EE90 55%, transparent 63%),
          radial-gradient(circle at top left, transparent 48%, #FFFF00 48%, #FFFF00 68%, transparent 75%),
          radial-gradient(circle at top left, transparent 60%, #ff9966 60%, #ff9966 78%, transparent 85%),
          radial-gradient(circle at top left, transparent 72%, #88e9a0 72%, #88e9a0 88%, transparent 95%),
          radial-gradient(circle at top left, transparent 82%, #90EE90 82%, #90EE90 98%, transparent 100%)
        `,
        backgroundBlendMode: 'overlay',
        zIndex: 0
      };
    }
    // Default Blue theme
    else {
      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: `
          conic-gradient(from -60deg at 50% calc(100%/3), #1E40AF 0 120deg, transparent 0),
          conic-gradient(from 120deg at 50% calc(200%/3), #1E40AF 0 120deg, transparent 0),
          conic-gradient(from 60deg at calc(200%/3), #1E40AF 60deg, #2E6FD0 0 120deg, transparent 0),
          conic-gradient(from 180deg at calc(100%/3), #3B82F6 60deg, #1E40AF 0 120deg, transparent 0),
          linear-gradient(90deg, #3B82F6 calc(100%/6), #2E6FD0 0 50%, #3B82F6 0 calc(500%/6), #2E6FD0 0)
        `,
        backgroundSize: `calc(1.732 * 82px) 82px`,
        zIndex: 0
      };
    }

    return React.createElement(
      'div',
      { style: backgroundStyle },
      React.createElement(
        'div',
        { style: { position: 'relative', width: '100%', height: '100%', zIndex: 1 } },
        children
      )
    );
  }

  // Mobile/Native rendering with SVG patterns
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      zIndex: 1,
    },
    svgContainer: {
      ...StyleSheet.absoluteFill,
    },
    content: {
      ...StyleSheet.absoluteFill,
      zIndex: 2,
    },
  });

  // Dark theme pattern
  if (currentTheme === 'dark') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0D0D0D', '#1A1A1A', '#0F0F0F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlay}>
          <Svg height="100%" width="100%" style={styles.svgContainer}>
            <Defs>
              <Pattern id="darkPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <Rect x="0" y="0" width="40" height="40" fill="#1a1a1a" />
                <Circle cx="10" cy="10" r="1.5" fill="#333" opacity="0.5" />
                <Circle cx="30" cy="10" r="1" fill="#2d2d2d" opacity="0.3" />
                <Circle cx="10" cy="30" r="1" fill="#2d2d2d" opacity="0.3" />
                <Circle cx="30" cy="30" r="1.5" fill="#333" opacity="0.5" />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#darkPattern)" />
          </Svg>
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  // Fresh theme pattern
  if (currentTheme === 'fresh') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#90EE90', '#FFFF99', '#FFB366']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlay}>
          <Svg height="100%" width="100%" style={styles.svgContainer}>
            <Defs>
              <Pattern id="freshPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <Rect x="0" y="0" width="60" height="60" fill="transparent" />
                <Circle cx="15" cy="15" r="8" fill="#A2FF76" opacity="0.3" />
                <Circle cx="45" cy="15" r="6" fill="#FFA000" opacity="0.2" />
                <Circle cx="15" cy="45" r="6" fill="#FFA000" opacity="0.2" />
                <Circle cx="45" cy="45" r="8" fill="#A2FF76" opacity="0.3" />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#freshPattern)" />
          </Svg>
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  // Blue theme pattern (default)
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#0EA5E9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.overlay}>
        <Svg height="100%" width="100%" style={styles.svgContainer}>
          <Defs>
            <Pattern id="bluePattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <Rect x="0" y="0" width="50" height="50" fill="transparent" />
              <Polygon points="25,5 35,20 25,35 15,20" fill="#1E40AF" opacity="0.4" />
              <Polygon points="25,25 40,35 25,45 10,35" fill="#3B82F6" opacity="0.3" />
              <Circle cx="25" cy="25" r="3" fill="#0EA5E9" opacity="0.5" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#bluePattern)" />
        </Svg>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

export default BackgroundSelector;
