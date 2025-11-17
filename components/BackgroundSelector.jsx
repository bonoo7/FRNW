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
  // يستخدم: صلبان واضحة + حبيبات فيلم سينمائي قوية
  if (currentTheme === 'dark') {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#0A0E27', '#1A1F3A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* الطبقة الأولى: النمط الأساسي (صلبان واضحة) */}
          <PatternCrosses color="#4F46E5" opacity={0.12} />
          
          {/* الطبقة الثانية: التكسجتشر (حبيبات فيلم قوية للمظهر السينمائي) */}
          <TextureFilmGrain color="#FFFFFF" opacity={0.15} />
          
          {children}
        </LinearGradient>
      </View>
    );
  }

  // Fresh theme - light gradient with hexagon pattern + paper texture
  // يستخدم: سادسات زاهية + ورقي طبيعي واضح
  // الألوان الأصلية: من AnimatedCirclesBackground (أحمر-برتقالي إلى أخضر فاتح)
  if (currentTheme === 'fresh') {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#ee6055', '#f57a5b', '#60d394']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* الطبقة الأولى: النمط الأساسي (سادسات) */}
          <PatternHexagons color="#E85D42" opacity={0.15} />
          
          {/* الطبقة الثانية: التكسجتشر (ورقي طبيعي واضح) */}
          <TexturePaper color="#C23B1B" opacity={0.12} />
          
          {children}
        </LinearGradient>
      </View>
    );
  }

  // Default/Blue theme - vibrant blue gradient with diagonal + metallic
  // يستخدم: خطوط قطرية واضحة + معادن لامعة احترافية
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#0EA5E9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* الطبقة الأولى: النمط الأساسي (خطوط قطرية واضحة) */}
        <PatternDiagonal color="#FFFFFF" opacity={0.15} />
        
        {/* الطبقة الثانية: التكسجتشر (معادن لامعة احترافية) */}
        <TextureMetallic color="#FFFFFF" opacity={0.12} />
        
        {children}
      </LinearGradient>
    </View>
  );
};

export default BackgroundSelector;
