import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Pattern, Path, Rect, Defs, G, Polygon } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

const BackgroundPattern = ({ children, style, patternId = 'pattern', pattern }) => {
  const { theme, currentTheme } = useTheme();
  const uniquePatternId = `${patternId}-${Math.random().toString(36).substr(2, 9)}`;
  const patternRef = useRef(null);

  console.log('Current theme:', currentTheme);

  // التأكد من وجود النمط وإعداداته
  const defaultPattern = {
    color: theme.colors.primary,
    opacity: 0.15,
    type: 'grid',
    size: 24,
    rotation: 45,
    density: 1,
    imagePath: null,
    backgroundImage: null,
    svgData: null,
  };

  // استخدام defaultPattern إذا كان pattern غير موجود أو غير مكتمل
  const mergedPattern = {
    ...defaultPattern,
    ...(theme.colors.background.pattern || {}),
    color: theme.colors.background.pattern?.color || theme.colors.primary,
  };

  const [currentPattern, setCurrentPattern] = useState(mergedPattern);

  // التأكد من تحديث النمط عند تغيير الثيم
  useEffect(() => {
    console.log('Theme changed:', theme.colors.background.pattern);
    const updatedPattern = {
      ...defaultPattern,
      ...(theme.colors.background.pattern || {}),
      color: theme.colors.background.pattern?.color || theme.colors.primary,
    };
    setCurrentPattern(updatedPattern);
  }, [theme]);

  // تطبيق الأنماط المخصصة وإزالة أي إطار
  const customStyle = StyleSheet.flatten(style || {});
  const containerStyle = {
    ...styles.container,
    ...customStyle,
    borderWidth: 0,
    borderColor: 'transparent',
  };

  // إذا كان النمط يحتوي على خاصية backgroundImage، نستخدمها مباشرة
  if (currentPattern.backgroundImage) {
    console.log('Using backgroundImage directly:', currentPattern.backgroundImage);
    
    // تحويل URL المشفر إلى صيغة يمكن استخدامها في React Native
    const imageUrl = currentPattern.backgroundImage.replace(/^url\(['"]?|['"]?\)$/g, '');
    
    return (
      <View style={containerStyle}>
        <View style={[StyleSheet.absoluteFill, {
          backgroundColor: currentPattern.background || theme.colors.background?.primary || '#FFFFFF',
        }]} />
        
        <Image
          source={{ uri: imageUrl }}
          style={[StyleSheet.absoluteFill, {
            opacity: 1,
            resizeMode: 'contain',
          }]}
        />
        
        {children}
      </View>
    );
  }

  // إذا كان النمط هو صورة، نستخدم لون خلفية ثابت مع SVG مبسط
  if (currentPattern.type === 'image' || currentPattern.type === 'svg') {
    // تحديد لون الخلفية المناسب للثيم الحالي
    const backgroundColor = currentTheme === 'dark' ? '#010101' : 'rgba(255, 255, 255, 0.98)';
    
    // في الأندرويد، استخدم خلفية بسيطة فقط
    if (Platform.OS === 'android') {
      return (
        <View style={containerStyle}>
          <LinearGradient
            colors={[
              backgroundColor,
              backgroundColor
            ]}
            style={StyleSheet.absoluteFill}
          />
          {children}
        </View>
      );
    }

    // للويب و iOS، استخدم SVG
    if (currentTheme === 'dark') {
      return (
        <View style={[containerStyle, { flex: 1, width: '100%', height: '100%' }]}>
          <View style={[StyleSheet.absoluteFill, {
            backgroundColor: backgroundColor,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%'
          }]} />
          {children}
        </View>
      );
    }

    return (
      <View style={[containerStyle, { flex: 1, width: '100%', height: '100%' }]}>
        <View style={[StyleSheet.absoluteFill, {
          backgroundColor: backgroundColor,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }]} />
        {children}
      </View>
    );
  }

  const renderPattern = () => {
    // التأكد من أن النمط له قيم صالحة
    const patternSize = currentPattern.size || defaultPattern.size;
    const patternColor = currentPattern.color || defaultPattern.color;
    const patternOpacity = currentPattern.opacity || defaultPattern.opacity;
    const patternRotation = currentPattern.rotation || defaultPattern.rotation;
    const patternDensity = currentPattern.density || defaultPattern.density;
    
    switch (currentPattern.type) {
      case 'hearts':
        return (
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={patternColor}
            opacity={patternOpacity}
            transform={`rotate(${patternRotation}, 12, 12)`}
          />
        );
      case 'stars':
        return (
          <Path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill={patternColor}
            opacity={patternOpacity}
            transform={`rotate(${patternRotation}, 12, 12)`}
          />
        );
      case 'dots':
        return (
          <Path
            d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"
            fill={patternColor}
            opacity={patternOpacity}
          />
        );
      case 'grid':
      default:
        const pathSize = patternSize * patternDensity;
        return (
          <>
            <Path
              d={`M ${pathSize/2} 0 L ${pathSize} ${pathSize/2} L ${pathSize/2} ${pathSize} L 0 ${pathSize/2} Z`}
              fill="none"
              stroke={patternColor}
              strokeWidth={2}
              opacity={patternOpacity}
            />
            <Path
              d={`M 0 0 L ${pathSize} ${pathSize} M ${pathSize} 0 L 0 ${pathSize}`}
              fill="none"
              stroke={patternColor}
              strokeWidth={1}
              opacity={patternOpacity * 0.5}
            />
          </>
        );
    }
  };

  // في الأندرويد، استخدم خلفية بسيطة بدلاً من SVG المعقد
  if (Platform && Platform.OS === 'android') {
    return (
      <View style={containerStyle}>
        <LinearGradient
          colors={[
            theme.colors.background.primary || '#FFFFFF',
            theme.colors.background.secondary || theme.colors.background.primary || '#FFFFFF'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {children}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <LinearGradient
        colors={[
          theme.colors.background.primary || '#FFFFFF',
          theme.colors.background.secondary || theme.colors.background.primary || '#FFFFFF'
        ]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, styles.patternOverlay]}>
        <Svg height="100%" width="100%" style={styles.svgContainer}>
          <Defs>
            <Pattern
              id={uniquePatternId}
              patternUnits="userSpaceOnUse"
              width={currentPattern.size || defaultPattern.size}
              height={currentPattern.size || defaultPattern.size}
            >
              {renderPattern()}
            </Pattern>
          </Defs>
          <Rect
            ref={patternRef}
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${uniquePatternId})`}
          />
        </Svg>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundAttachment: 'fixed',
    backgroundSize: 'contain',
  },
  patternOverlay: {
    opacity: 1,
    width: '100%',
    height: '100%',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default BackgroundPattern;