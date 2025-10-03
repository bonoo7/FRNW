import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Pattern, Path, Rect, Defs, G, Polygon } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

const BackgroundPattern = ({ children, style, patternId = 'pattern' }) => {
  const { theme } = useTheme();
  const uniquePatternId = `${patternId}-${Math.random().toString(36).substr(2, 9)}`;
  const patternRef = useRef(null);

  // التأكد من وجود النمط وإعداداته
  const defaultPattern = {
    color: theme.colors.primary,
    opacity: 0.15,
    type: 'grid',
    size: 24,
    rotation: 45,
    density: 1,
    imagePath: null
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

  // إذا كان النمط هو صورة، نستخدم لون خلفية ثابت مع SVG مبسط
  if (currentPattern.type === 'image') {
    // تحويل رمز SVG إلى صيغة Base64 لاستخدامه كصورة خلفية
    const backgroundStyle = `
      background-color: #467FFF;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg stroke='%23000' stroke-width='67.9' stroke-opacity='0.06' %3E%3Ccircle fill='%23467FFF' cx='0' cy='0' r='1800'/%3E%3Ccircle fill='%234677f0' cx='0' cy='0' r='1700'/%3E%3Ccircle fill='%23466fe2' cx='0' cy='0' r='1600'/%3E%3Ccircle fill='%234667d4' cx='0' cy='0' r='1500'/%3E%3Ccircle fill='%23455fc6' cx='0' cy='0' r='1400'/%3E%3Ccircle fill='%234458b8' cx='0' cy='0' r='1300'/%3E%3Ccircle fill='%234250aa' cx='0' cy='0' r='1200'/%3E%3Ccircle fill='%2340499d' cx='0' cy='0' r='1100'/%3E%3Ccircle fill='%233e418f' cx='0' cy='0' r='1000'/%3E%3Ccircle fill='%233c3a82' cx='0' cy='0' r='900'/%3E%3Ccircle fill='%23393376' cx='0' cy='0' r='800'/%3E%3Ccircle fill='%23362c69' cx='0' cy='0' r='700'/%3E%3Ccircle fill='%2333255d' cx='0' cy='0' r='600'/%3E%3Ccircle fill='%23301e51' cx='0' cy='0' r='500'/%3E%3Ccircle fill='%232c1745' cx='0' cy='0' r='400'/%3E%3Ccircle fill='%2328113a' cx='0' cy='0' r='300'/%3E%3Ccircle fill='%23240a2e' cx='0' cy='0' r='200'/%3E%3Ccircle fill='%23210024' cx='0' cy='0' r='100'/%3E%3C/g%3E%3C/svg%3E");
      background-attachment: fixed;
      background-size: cover;
    `;
    
    const svgBase64 = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1600 800">
        <style>
          svg { ${backgroundStyle} }
        </style>
        <rect width="100%" height="100%" fill="#467FFF" />
      </svg>
    `)}`;

    return (
      <View style={containerStyle}>
        <View style={[StyleSheet.absoluteFill, {
          backgroundColor: '#0E2044', // لون الخلفية المحدد
        }]} />
        
        <Image
          source={{ uri: svgBase64 }}
          style={[StyleSheet.absoluteFill, {
            opacity: 1, // شفافية النمط
            resizeMode: 'repeat',
          }]}
        />
        
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

  return (
    <View style={containerStyle}>
      <LinearGradient
        colors={[
          theme.colors.background.primary,
          theme.colors.background.secondary || theme.colors.background.primary
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