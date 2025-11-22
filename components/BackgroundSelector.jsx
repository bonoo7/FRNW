import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { PatternDiagonal, PatternCrosses, PatternHexagons } from './BackgroundPatterns';
import { TextureFilmGrain, TexturePaper, TextureMetallic } from './AdvancedTextures';

const BackgroundSelector = ({
  children,
}) => {
  const { currentTheme, theme } = useTheme();

  // Dark theme - new conic gradient pattern with dark colors
  if (currentTheme === 'dark') {
    // Web version with conic gradient pattern
    if (typeof window !== 'undefined') {
      return (
        <div style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          '--u': '20px',
          '--hue': 'hue-rotate(0deg)',
          '--c1': '#1a1a1a',
          '--c2': '#2d2d2d',
          '--c3': '#3a3a3a',
          '--cs': '#0d0d0d',
          '--gp': '50% / calc(var(--u) * 12) calc(var(--u) * 12.8)',
          filter: 'var(--hue)',
          background: `
            repeating-conic-gradient(
              from 61.93deg at 75% 36.5%,
              var(--c1) 0%,
              var(--c1) 2%,
              var(--cs) 16%,
              #fff0 0% 100%
            ) var(--gp),
            repeating-conic-gradient(
              from 118.07deg at 75% 87.5%,
              var(--c3) 0% 34.5%,
              #fff0 0% 100%
            ) var(--gp),
            repeating-conic-gradient(
              from 118.07deg at 50% 75%,
              #fff0 2%,
              var(--cs) 17.15%,
              #fff0 0% 100%
            ) var(--gp),
            repeating-conic-gradient(
              from 61.93deg at 50% 50%,
              var(--c3) 0% 15.59%,
              var(--c2) 0% 32.79%,
              #fff0 0% 100%
            ) var(--gp),
            repeating-conic-gradient(
              from -118.07deg at 25% 12.5%,
              var(--c2) 0% 32.79%,
              var(--c1) 0% 50%,
              #fff0 0% 100%
            ) var(--gp),
            repeating-conic-gradient(
              from -61.93deg at 25% 87.5%,
              #fff0 0 67.25%,
              var(--c2) 0% 100%
            ) var(--gp),
            repeating-conic-gradient(
              from -61.93deg at 50% 75%,
              #fff0 0% 66.5%,
              var(--c1) 0% 84.25%,
              var(--c3) 0% 100%
            ) var(--gp),
            repeating-conic-gradient(
              from -61.93deg at 25% 37.5%,
              var(--c3) 0% 34.5%,
              var(--c1) 0% 67.25%,
              var(--c2) 0% 100%
            ) var(--gp)
          `,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
            {children}
          </div>
        </div>
      );
    }
    
    // Mobile fallback
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#0D0D0D', '#1A1A1A', '#0F0F0F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  // Fresh theme - radial gradient pattern with current colors
  if (currentTheme === 'fresh') {
    // Web version
    if (typeof window !== 'undefined') {
      return (
        <div style={{
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
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
            {children}
          </div>
        </div>
      );
    }

    // Mobile fallback
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#ff9999', '#ffb366', '#88e9a0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  // Default/Blue theme - hexagon gradient pattern
  if (typeof window !== 'undefined') {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        '--s': '82px',
        '--c1': '#3B82F6',
        '--c2': '#2E6FD0',
        '--c3': '#1E40AF',
        '--_g': 'var(--c3) 0 120deg,#0000 0',
        background: `
          conic-gradient(from -60deg at 50% calc(100%/3),var(--_g)),
          conic-gradient(from 120deg at 50% calc(200%/3),var(--_g)),
          conic-gradient(from 60deg at calc(200%/3),var(--c3) 60deg,var(--c2) 0 120deg,#0000 0),
          conic-gradient(from 180deg at calc(100%/3),var(--c1) 60deg,var(--_g)),
          linear-gradient(90deg,var(--c1) calc(100%/6),var(--c2) 0 50%,var(--c1) 0 calc(500%/6),var(--c2) 0)
        `,
        backgroundSize: `calc(1.732*var(--s)) var(--s)`,
        zIndex: 0
      }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
          {children}
        </div>
      </div>
    );
  }

  // Mobile fallback for blue theme
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#0EA5E9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

export default BackgroundSelector;
