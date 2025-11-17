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

  // Dark theme - dark gradient with crosses pattern + film grain texture
  if (currentTheme === 'dark') {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#0F0F0F', '#1A1A1A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* الطبقة الأولى: النمط الأساسي */}
          <PatternCrosses color="#FFFFFF" opacity={0.03} />
          
          {/* الطبقة الثانية: التكسجتشر (Film Grain يعطي مظهر سينمائي) */}
          <TextureFilmGrain color="#FFFFFF" opacity={0.03} />
          
          {children}
        </LinearGradient>
      </View>
    );
  }

  // Fresh theme - light gradient with hexagon pattern + paper texture
  if (currentTheme === 'fresh') {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#F0F9FF', '#E0F2FE', '#D0E8FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* الطبقة الأولى: النمط الأساسي */}
          <PatternHexagons color="#3B82F6" opacity={0.06} />
          
          {/* الطبقة الثانية: التكسجتشر (Paper يعطي مظهر ورقي طبيعي) */}
          <TexturePaper color="#60A5FA" opacity={0.03} />
          
          {children}
        </LinearGradient>
      </View>
    );
  }

  // Default/Blue theme - blue gradient with diagonal lines + metallic texture
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* الطبقة الأولى: النمط الأساسي */}
        <PatternDiagonal color="#FFFFFF" opacity={0.08} />
        
        {/* الطبقة الثانية: التكسجتشر (Metallic يعطي لمعة احترافية) */}
        <TextureMetallic color="#FFFFFF" opacity={0.04} />
        
        {children}
      </LinearGradient>
    </View>
  );
};

export default BackgroundSelector;
