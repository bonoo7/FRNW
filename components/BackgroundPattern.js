import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
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
          backgroundColor: currentPattern.background || '#000000',
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
    // استخدام svgData مباشرة إذا كان موجودًا، وإلا نستخدم SVG الافتراضي
    const svgBase64 = currentPattern.svgData || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' gradientUnits=\'userSpaceOnUse\' x1=\'0\' x2=\'0\' y1=\'0\' y2=\'100%25\' gradientTransform=\'rotate(240)\'%3E%3Cstop offset=\'0\' stop-color=\'%23162A95\'/%3E%3Cstop offset=\'1\' stop-color=\'%231E3B87\'/%3E%3C/linearGradient%3E%3Cpattern patternUnits=\'userSpaceOnUse\' id=\'b\' width=\'540\' height=\'450\' x=\'0\' y=\'0\' viewBox=\'0 0 1080 900\'%3E%3Cg fill-opacity=\'0.1\'%3E%3Cpolygon fill=\'%23444\' points=\'90 150 0 300 180 300\'/%3E%3Cpolygon points=\'90 150 180 0 0 0\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'270 150 360 0 180 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'450 150 360 300 540 300\'/%3E%3Cpolygon fill=\'%23999\' points=\'450 150 540 0 360 0\'/%3E%3Cpolygon points=\'630 150 540 300 720 300\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'630 150 720 0 540 0\'/%3E%3Cpolygon fill=\'%23444\' points=\'810 150 720 300 900 300\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'810 150 900 0 720 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'990 150 900 300 1080 300\'/%3E%3Cpolygon fill=\'%23444\' points=\'990 150 1080 0 900 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'90 450 0 600 180 600\'/%3E%3Cpolygon points=\'90 450 180 300 0 300\'/%3E%3Cpolygon fill=\'%23666\' points=\'270 450 180 600 360 600\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'270 450 360 300 180 300\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'450 450 360 600 540 600\'/%3E%3Cpolygon fill=\'%23999\' points=\'450 450 540 300 360 300\'/%3E%3Cpolygon fill=\'%23999\' points=\'630 450 540 600 720 600\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'630 450 720 300 540 300\'/%3E%3Cpolygon points=\'810 450 720 600 900 600\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'810 450 900 300 720 300\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'990 450 900 600 1080 600\'/%3E%3Cpolygon fill=\'%23444\' points=\'990 450 1080 300 900 300\'/%3E%3Cpolygon fill=\'%23222\' points=\'90 750 0 900 180 900\'/%3E%3Cpolygon points=\'270 750 180 900 360 900\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'270 750 360 600 180 600\'/%3E%3Cpolygon points=\'450 750 540 600 360 600\'/%3E%3Cpolygon points=\'630 750 540 900 720 900\'/%3E%3Cpolygon fill=\'%23444\' points=\'630 750 720 600 540 600\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'810 750 720 900 900 900\'/%3E%3Cpolygon fill=\'%23666\' points=\'810 750 900 600 720 600\'/%3E%3Cpolygon fill=\'%23999\' points=\'990 750 900 900 1080 900\'/%3E%3Cpolygon fill=\'%23999\' points=\'180 0 90 150 270 150\'/%3E%3Cpolygon fill=\'%23444\' points=\'360 0 270 150 450 150\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'540 0 450 150 630 150\'/%3E%3Cpolygon points=\'900 0 810 150 990 150\'/%3E%3Cpolygon fill=\'%23222\' points=\'0 300 -90 450 90 450\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'0 300 90 150 -90 150\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'180 300 90 450 270 450\'/%3E%3Cpolygon fill=\'%23666\' points=\'180 300 270 150 90 150\'/%3E%3Cpolygon fill=\'%23222\' points=\'360 300 270 450 450 450\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'360 300 450 150 270 150\'/%3E%3Cpolygon fill=\'%23444\' points=\'540 300 450 450 630 450\'/%3E%3Cpolygon fill=\'%23222\' points=\'540 300 630 150 450 150\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'720 300 630 450 810 450\'/%3E%3Cpolygon fill=\'%23666\' points=\'720 300 810 150 630 150\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'900 300 810 450 990 450\'/%3E%3Cpolygon fill=\'%23999\' points=\'900 300 990 150 810 150\'/%3E%3Cpolygon points=\'0 600 -90 750 90 750\'/%3E%3Cpolygon fill=\'%23666\' points=\'0 600 90 450 -90 450\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'180 600 90 750 270 750\'/%3E%3Cpolygon fill=\'%23444\' points=\'180 600 270 450 90 450\'/%3E%3Cpolygon fill=\'%23444\' points=\'360 600 270 750 450 750\'/%3E%3Cpolygon fill=\'%23999\' points=\'360 600 450 450 270 450\'/%3E%3Cpolygon fill=\'%23666\' points=\'540 600 630 450 450 450\'/%3E%3Cpolygon fill=\'%23222\' points=\'720 600 630 750 810 750\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'900 600 810 750 990 750\'/%3E%3Cpolygon fill=\'%23222\' points=\'900 600 990 450 810 450\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'0 900 90 750 -90 750\'/%3E%3Cpolygon fill=\'%23444\' points=\'180 900 270 750 90 750\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'360 900 450 750 270 750\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'540 900 630 750 450 750\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'720 900 810 750 630 750\'/%3E%3Cpolygon fill=\'%23222\' points=\'900 900 990 750 810 750\'/%3E%3Cpolygon fill=\'%23222\' points=\'1080 300 990 450 1170 450\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'1080 300 1170 150 990 150\'/%3E%3Cpolygon points=\'1080 600 990 750 1170 750\'/%3E%3Cpolygon fill=\'%23666\' points=\'1080 600 1170 450 990 450\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'1080 900 1170 750 990 750\'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x=\'0\' y=\'0\' fill=\'url(%23a)\' width=\'100%25\' height=\'100%25\'/%3E%3Crect x=\'0\' y=\'0\' fill=\'url(%23b)\' width=\'100%25\' height=\'100%25\'/%3E%3C/svg%3E';

    // تحديد لون الخلفية المناسب للثيم الحالي
    const backgroundColor = currentTheme === 'dark' ? '#010101' : '#162A95';
    
    // استخدام الباترن الجديد للثيم الداكن
    if (currentTheme === 'dark') {
      const darkPatternSvg = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'142\' height=\'142\' viewBox=\'0 0 200 200\'%3E%3Cg %3E%3Cpolygon fill=\'%230e011b\' points=\'100 57.1 64 93.1 71.5 100.6 100 72.1\'/%3E%3Cpolygon fill=\'%230f031b\' points=\'100 57.1 100 72.1 128.6 100.6 136.1 93.1\'/%3E%3Cpolygon fill=\'%230e011b\' points=\'100 163.2 100 178.2 170.7 107.5 170.8 92.4\'/%3E%3Cpolygon fill=\'%230f031b\' points=\'100 163.2 29.2 92.5 29.2 107.5 100 178.2\'/%3E%3Cpath fill=\'%2310041C\' d=\'M100 21.8L29.2 92.5l70.7 70.7l70.7-70.7L100 21.8z M100 127.9L64.6 92.5L100 57.1l35.4 35.4L100 127.9z\'/%3E%3Cpolygon fill=\'%2318051e\' points=\'0 157.1 0 172.1 28.6 200.6 36.1 193.1\'/%3E%3Cpolygon fill=\'%23190720\' points=\'70.7 200 70.8 192.4 63.2 200\'/%3E%3Cpolygon fill=\'%231A0A21\' points=\'27.8 200 63.2 200 70.7 192.5 0 121.8 0 157.2 35.3 192.5\'/%3E%3Cpolygon fill=\'%23190720\' points=\'200 157.1 164 193.1 171.5 200.6 200 172.1\'/%3E%3Cpolygon fill=\'%2318051e\' points=\'136.7 200 129.2 192.5 129.2 200\'/%3E%3Cpolygon fill=\'%231A0A21\' points=\'172.1 200 164.6 192.5 200 157.1 200 157.2 200 121.8 200 121.8 129.2 192.5 136.7 200\'/%3E%3Cpolygon fill=\'%2318051e\' points=\'129.2 0 129.2 7.5 200 78.2 200 63.2 136.7 0\'/%3E%3Cpolygon fill=\'%231A0A21\' points=\'200 27.8 200 27.9 172.1 0 136.7 0 200 63.2 200 63.2\'/%3E%3Cpolygon fill=\'%23190720\' points=\'63.2 0 0 63.2 0 78.2 70.7 7.5 70.7 0\'/%3E%3Cpolygon fill=\'%231A0A21\' points=\'0 63.2 63.2 0 27.8 0 0 27.8\'/%3E%3C/g%3E%3C/svg%3E';
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
          
          <Image
            source={{ uri: darkPatternSvg }}
            style={[StyleSheet.absoluteFill, {
              opacity: currentPattern.opacity || 1,
              resizeMode: 'repeat',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%'
            }]}
          />
          
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
        
        <Image
          source={{ uri: svgBase64 }}
          style={[StyleSheet.absoluteFill, {
            opacity: currentPattern.opacity || 1,
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%'
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