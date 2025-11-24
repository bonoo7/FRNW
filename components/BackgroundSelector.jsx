import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Pattern, Rect, Circle, Polygon, Path } from 'react-native-svg';

const BackgroundSelector = ({ children, design = 'auto' }) => {
  const { currentTheme } = useTheme();

  // تحديد التصميم تلقائياً حسب الثيم إذا لم يتم تحديده يدويا
  let effectiveDesign = design;
  if (design === 'auto') {
    if (currentTheme === 'dark') {
      effectiveDesign = 'modern4'; // Aurora للثيم الداكن
    } else if (currentTheme === 'fresh') {
      effectiveDesign = 'modern5'; // Gradient Mesh للفريش
    } else if (currentTheme === 'pink' || currentTheme === 'rose') {
      effectiveDesign = 'modern3'; // Neumorphism للوردي
    } else {
      effectiveDesign = 'modern1'; // Glassmorphism الافتراضي
    }
  }

  // For web platform - using Tailwind CSS + CSS animations
  const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

  if (isWeb) {
    // Add styles dynamically for animations
    if (!document.getElementById('animated-bg-styles')) {
      const style = document.createElement('style');
      style.id = 'animated-bg-styles';
      style.textContent = `
        @keyframes flicker {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; filter: blur(40px); }
          50% { opacity: 0.6; filter: blur(60px); }
        }
        
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .bg-flicker {
          animation: flicker 3s ease-in-out infinite;
        }
        
        .float-1 {
          animation: float1 6s ease-in-out infinite;
        }
        
        .float-2 {
          animation: float2 7s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        
        .drift {
          animation: drift 8s ease-in-out infinite;
        }
        
        .rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
        
        .shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    let backgroundStyle = {};
    let gridElements = null;

    // Modern Design 1 - Glassmorphism with Blue Gradient
    if (effectiveDesign === 'modern1') {
      let glassBackground = 'linear-gradient(135deg, #0F2A5E 0%, #1E40AF 25%, #3B82F6 50%, #06B6D4 75%, #0F2A5E 100%)';
      let glassOrbs = [
        { x: '10%', y: '20%', size: 200, color: '#3B82F6', delay: 0 },
        { x: '80%', y: '60%', size: 300, color: '#06B6D4', delay: 1 },
        { x: '40%', y: '80%', size: 250, color: '#0EA5E9', delay: 2 }
      ];

      // For pink theme - use pink gradient
      if (currentTheme === 'pink' || currentTheme === 'rose') {
        glassBackground = 'linear-gradient(135deg, #FFB6D9 0%, #FFC0CB 25%, #FFD9E8 50%, #FFEBF0 75%, #FFB6D9 100%)';
        glassOrbs = [
          { x: '10%', y: '20%', size: 200, color: '#FF69B4', delay: 0 },
          { x: '80%', y: '60%', size: 300, color: '#FFB6D9', delay: 1 },
          { x: '40%', y: '80%', size: 250, color: '#FFC0CB', delay: 2 }
        ];
      }

      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: glassBackground,
        backgroundSize: '400% 400%',
        zIndex: 0
      };

      gridElements = React.createElement(
        'div',
        { style: { position: 'absolute', inset: 0 } },
        glassOrbs.map((orb, i) =>
          React.createElement('div', {
            key: i,
            className: 'pulse-glow',
            style: {
              position: 'absolute',
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              backgroundColor: orb.color,
              borderRadius: '50%',
              left: orb.x,
              top: orb.y,
              filter: 'blur(60px)',
              opacity: 0.3,
              animationDelay: `${orb.delay}s`,
              zIndex: 1
            }
          })
        )
      );
    }

    // Modern Design 2 - Neon Grid (Cyberpunk)
    else if (effectiveDesign === 'modern2') {
      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0A0E27 0%, #1a1a3e 50%, #0A0E27 100%)',
        zIndex: 0
      };

      gridElements = React.createElement(
        'div',
        { style: { position: 'absolute', inset: 0 } },
        React.createElement('svg', {
          style: { width: '100%', height: '100%', position: 'absolute' },
          children: [
            React.createElement('defs', { key: 'defs' },
              React.createElement('linearGradient', { id: 'neonGradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
                React.createElement('stop', { offset: '0%', stopColor: '#00D9FF', stopOpacity: 0.3 }),
                React.createElement('stop', { offset: '100%', stopColor: '#FF006E', stopOpacity: 0.3 })
              )
            ),
            // Grid lines
            ...Array.from({ length: 15 }).map((_, i) =>
              React.createElement('line', {
                key: `h${i}`,
                x1: '0',
                y1: `${(i / 14) * 100}%`,
                x2: '100%',
                y2: `${(i / 14) * 100}%`,
                stroke: '#00D9FF',
                strokeWidth: 1,
                opacity: 0.1
              })
            ),
            ...Array.from({ length: 15 }).map((_, i) =>
              React.createElement('line', {
                key: `v${i}`,
                x1: `${(i / 14) * 100}%`,
                y1: '0',
                x2: `${(i / 14) * 100}%`,
                y2: '100%',
                stroke: '#FF006E',
                strokeWidth: 1,
                opacity: 0.1
              })
            )
          ]
        })
      );
    }

    // Modern Design 3 - Neumorphism Soft
    else if (effectiveDesign === 'modern3') {
      // Check if it's pink theme and apply pink Neumorphism
      let neuBgColor = 'linear-gradient(135deg, #E0E5EC 0%, #F5F7FA 50%, #E0E5EC 100%)';
      let neuShapeColor = 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(200,200,200,0.2))';
      let neuShadow = '0 8px 20px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.8)';
      
      if (currentTheme === 'pink' || currentTheme === 'rose') {
        // Pink theme colors - pink gradient Neumorphism
        neuBgColor = 'linear-gradient(135deg, #FFB6D9 0%, #FFC0CB 30%, #FFD9E8 60%, #FFEBF0 100%)';
        neuShapeColor = 'radial-gradient(circle, rgba(255,182,193,0.5), rgba(255,192,203,0.2))';
        neuShadow = '0 8px 20px rgba(255,105,180,0.15), inset 0 2px 4px rgba(255,255,255,0.9)';
      }
      
      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: neuBgColor,
        zIndex: 0
      };

      gridElements = React.createElement(
        'div',
        { style: { position: 'absolute', inset: 0 } },
        Array.from({ length: 5 }).map((_, i) =>
          React.createElement('div', {
            key: i,
            className: 'drift',
            style: {
              position: 'absolute',
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              background: neuShapeColor,
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: neuShadow,
              animationDelay: `${i * 0.5}s`
            }
          })
        )
      );
    }

    // Modern Design 4 - Aurora Borealis
    else if (effectiveDesign === 'modern4') {
      let auroraBackground = 'linear-gradient(180deg, #0B1929 0%, #1A3A52 30%, #0D2E3D 60%, #051418 100%)';
      let auroraColors = [
        { color: '#00D9FF', left: '20%', delay: 0 },
        { color: '#7B2FF7', left: '50%', delay: 1.5 },
        { color: '#00FFA3', left: '80%', delay: 3 }
      ];
      
      // For dark theme - use dark colors: black, gray, dark purple
      if (currentTheme === 'dark') {
        auroraBackground = 'linear-gradient(180deg, #000000 0%, #1a1a2e 30%, #16213e 60%, #0f1419 100%)';
        auroraColors = [
          { color: '#4A4A6A', left: '20%', delay: 0 },      // رمادي بنفسجي
          { color: '#2D1B4E', left: '50%', delay: 1.5 },    // بنفسجي غامق
          { color: '#1a1a2e', left: '80%', delay: 3 }       // رمادي داكن
        ];
      }
      
      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: auroraBackground,
        zIndex: 0
      };

      gridElements = React.createElement(
        'div',
        { style: { position: 'absolute', inset: 0 } },
        auroraColors.map((wave, i) =>
          React.createElement('div', {
            key: i,
            className: 'pulse-glow',
            style: {
              position: 'absolute',
              width: '400px',
              height: '400px',
              background: `radial-gradient(circle, ${wave.color}, transparent)`,
              borderRadius: '50%',
              left: wave.left,
              top: '50%',
              transform: 'translateY(-50%)',
              filter: 'blur(80px)',
              opacity: currentTheme === 'dark' ? 0.2 : 0.4,
              animationDelay: `${wave.delay}s`,
              zIndex: 1
            }
          })
        )
      );
    }

    // Modern Design 5 - Gradient Mesh
    else if (effectiveDesign === 'modern5') {
      let meshBackground = `
        radial-gradient(circle at 20% 50%, #FF6B9D 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, #A29BFE 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, #00D2D3 0%, transparent 50%),
        linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      `;
      
      // For fresh theme - use brighter colors
      if (currentTheme === 'fresh') {
        meshBackground = `
          radial-gradient(circle at 20% 50%, #FF8FD1 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #90EE90 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, #FFFF99 0%, transparent 50%),
          linear-gradient(135deg, #FFCC00 0%, #FF9933 100%)
        `;
      }
      
      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: meshBackground,
        zIndex: 0
      };
    }

    // Modern Design 6 - Minimal Dots
    else if (effectiveDesign === 'modern6') {
      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)',
        backgroundImage: `radial-gradient(circle, #60a5fa 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        zIndex: 0
      };
    }

    // Dark theme
    else if (currentTheme === 'dark') {
      backgroundStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0D0D0D 100%)',
        zIndex: 0
      };

      gridElements = React.createElement(
        'div',
        { style: { position: 'absolute', inset: 0 } },
        Array.from({ length: 20 }).map((_, i) => 
          React.createElement('div', {
            key: i,
            className: 'bg-flicker',
            style: {
              position: 'absolute',
              width: '4px',
              height: '4px',
              backgroundColor: `rgba(${50 + i * 5}, ${50 + i * 5}, ${50 + i * 5}, 0.4)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: '1px',
              animationDelay: `${i * 0.15}s`
            }
          })
        )
      );
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
        background: 'linear-gradient(135deg, #90EE90 0%, #FFFF99 50%, #FFB366 100%)',
        zIndex: 0
      };
    }
    // Default Blue theme with flickering effect
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
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #0EA5E9 100%)',
        zIndex: 0
      };

      gridElements = React.createElement(
        'div',
        { style: { position: 'absolute', inset: 0 } },
        Array.from({ length: 25 }).map((_, i) => 
          React.createElement('div', {
            key: i,
            className: 'bg-flicker',
            style: {
              position: 'absolute',
              width: '4px',
              height: '4px',
              backgroundColor: `rgba(${59 + i * 3}, ${130 + i * 2}, ${246 - i * 3}, 0.35)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: '1px',
              animationDelay: `${i * 0.12}s`
            }
          })
        )
      );
    }

    return React.createElement(
      'div',
      { style: backgroundStyle },
      gridElements,
      React.createElement(
        'div',
        { style: { position: 'relative', width: '100%', height: '100%', zIndex: 1 } },
        children
      )
    );
  }

  // Mobile/Native rendering with optimized SVG patterns (no heavy animations on Android)
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

  // Mobile/Native rendering - Aurora for dark theme with dark colors
  if (currentTheme === 'dark') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#000000', '#1a1a2e', '#16213e', '#0f1419']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlay}>
          <Svg height="100%" width="100%" style={styles.svgContainer}>
            <Defs>
              <Pattern id="darkAuroraPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <Circle cx="25" cy="25" r="15" fill="#4A4A6A" opacity="0.2" />
                <Circle cx="75" cy="75" r="20" fill="#2D1B4E" opacity="0.15" />
                <Circle cx="50" cy="50" r="18" fill="#1a1a2e" opacity="0.1" />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#darkAuroraPattern)" />
          </Svg>
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  // Mobile/Native rendering - Gradient Mesh for fresh theme
  if (currentTheme === 'fresh') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFCC00', '#FFB366', '#FF9933', '#90EE90']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlay}>
          <Svg height="100%" width="100%" style={styles.svgContainer}>
            <Defs>
              <Pattern id="freshMeshPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <Circle cx="20" cy="20" r="12" fill="#90EE90" opacity="0.25" />
                <Circle cx="60" cy="20" r="10" fill="#FFFF99" opacity="0.2" />
                <Circle cx="20" cy="60" r="10" fill="#FFFF99" opacity="0.2" />
                <Circle cx="60" cy="60" r="12" fill="#FF8FD1" opacity="0.25" />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#freshMeshPattern)" />
          </Svg>
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  // Mobile/Native rendering - Neumorphism for pink theme with pink gradient
  if (currentTheme === 'pink' || currentTheme === 'rose') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFB6D9', '#FFC0CB', '#FFD9E8', '#FFEBF0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlay}>
          <Svg height="100%" width="100%" style={styles.svgContainer}>
            <Defs>
              <Pattern id="pinkNeuPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <Circle cx="15" cy="15" r="10" fill="#FF69B4" opacity="0.15" />
                <Circle cx="45" cy="15" r="8" fill="#FFB6D9" opacity="0.1" />
                <Circle cx="15" cy="45" r="8" fill="#FFB6D9" opacity="0.1" />
                <Circle cx="45" cy="45" r="10" fill="#FFC0CB" opacity="0.15" />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#pinkNeuPattern)" />
          </Svg>
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  // Mobile/Native rendering - Glassmorphism for blue theme (default)
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.overlay}>
        <Svg height="100%" width="100%" style={styles.svgContainer}>
          <Defs>
            <Pattern id="blueAuroraPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <Circle cx="25" cy="25" r="15" fill="#60A5FA" opacity="0.2" />
              <Circle cx="75" cy="75" r="20" fill="#3B82F6" opacity="0.15" />
              <Circle cx="50" cy="50" r="18" fill="#2563EB" opacity="0.1" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#blueAuroraPattern)" />
        </Svg>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

export default BackgroundSelector;
