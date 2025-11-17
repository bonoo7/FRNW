import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Line, Path, Polygon, G, Filter, feTurbulence, feDisplacementMap } from 'react-native-svg';

// Texture النسيج - نسيج دقيق يشبه الكتان
const TextureWeave = ({ opacity = 0.05, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="weave-texture" patternUnits="userSpaceOnUse" width="10" height="10">
        <Rect width="10" height="10" fill="none" />
        <Line x1="0" y1="0" x2="10" y2="10" stroke={color} strokeWidth="0.3" opacity={opacity} />
        <Line x1="10" y1="0" x2="0" y2="10" stroke={color} strokeWidth="0.3" opacity={opacity * 0.6} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#weave-texture)" />
  </Svg>
);

// Texture النقوش - نقوش عميقة تعطي عمق
const TextureEmbossed = ({ opacity = 0.08, color = '#FFFFFF' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="embossed-texture" patternUnits="userSpaceOnUse" width="20" height="20">
        <Rect width="20" height="20" fill="none" />
        {/* أشكال دائرية صغيرة لتعطي تأثير نقش */}
        <Circle cx="10" cy="10" r="2.5" fill={color} opacity={opacity} />
        <Circle cx="5" cy="5" r="1" fill={color} opacity={opacity * 0.5} />
        <Circle cx="15" cy="15" r="1" fill={color} opacity={opacity * 0.5} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#embossed-texture)" />
  </Svg>
);

// Texture الجسيمات - جسيمات عشوائية
const TextureParticles = ({ opacity = 0.06, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="particles-texture" patternUnits="userSpaceOnUse" width="50" height="50">
        <Rect width="50" height="50" fill="none" />
        {/* جسيمات عشوائية */}
        <Circle cx="12" cy="8" r="0.8" fill={color} opacity={opacity} />
        <Circle cx="35" cy="22" r="0.6" fill={color} opacity={opacity * 0.7} />
        <Circle cx="8" cy="40" r="0.7" fill={color} opacity={opacity * 0.8} />
        <Circle cx="42" cy="45" r="0.5" fill={color} opacity={opacity * 0.6} />
        <Circle cx="25" cy="15" r="0.6" fill={color} opacity={opacity * 0.9} />
        <Circle cx="48" cy="12" r="0.5" fill={color} opacity={opacity * 0.7} />
        <Circle cx="5" cy="28" r="0.7" fill={color} opacity={opacity} />
        <Circle cx="38" cy="38" r="0.6" fill={color} opacity={opacity * 0.8} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#particles-texture)" />
  </Svg>
);

// Texture الخطوط المموجة - خطوط ناعمة متموجة
const TextureWavyLines = ({ opacity = 0.07, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="wavy-lines-texture" patternUnits="userSpaceOnUse" width="60" height="60">
        <Path
          d="M0,30 Q15,20 30,30 T60,30"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity={opacity}
        />
        <Path
          d="M0,40 Q15,30 30,40 T60,40"
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          opacity={opacity * 0.6}
        />
        <Path
          d="M0,20 Q15,10 30,20 T60,20"
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          opacity={opacity * 0.6}
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#wavy-lines-texture)" />
  </Svg>
);

// Texture الرخام - تأثير رخام ناعم
const TextureMarble = ({ opacity = 0.08, colors = ['#000000', '#FFFFFF'] }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="marble-texture" patternUnits="userSpaceOnUse" width="80" height="80">
        {/* خطوط منحنية عشوائية تحاكي نمط الرخام */}
        <Path
          d="M0,0 Q20,30 40,20 T80,0"
          fill="none"
          stroke={colors[0]}
          strokeWidth="0.8"
          opacity={opacity * 0.7}
        />
        <Path
          d="M0,40 Q25,50 50,40 T80,40"
          fill="none"
          stroke={colors[0]}
          strokeWidth="0.8"
          opacity={opacity * 0.6}
        />
        <Path
          d="M0,80 Q20,70 40,75 T80,80"
          fill="none"
          stroke={colors[0]}
          strokeWidth="1"
          opacity={opacity * 0.5}
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#marble-texture)" />
  </Svg>
);

// Texture النقاط المتدرجة - نقاط بأحجام مختلفة
const TextureGradientDots = ({ opacity = 0.07, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="gradient-dots-texture" patternUnits="userSpaceOnUse" width="40" height="40">
        <Rect width="40" height="40" fill="none" />
        <Circle cx="10" cy="10" r="2" fill={color} opacity={opacity} />
        <Circle cx="30" cy="10" r="1.5" fill={color} opacity={opacity * 0.8} />
        <Circle cx="10" cy="30" r="1.5" fill={color} opacity={opacity * 0.8} />
        <Circle cx="30" cy="30" r="2" fill={color} opacity={opacity * 0.9} />
        <Circle cx="20" cy="20" r="1" fill={color} opacity={opacity * 0.6} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#gradient-dots-texture)" />
  </Svg>
);

// Texture الشطرنج - رقعة شطرنج دقيقة
const TextureCheckerboard = ({ opacity = 0.05, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="checkerboard-texture" patternUnits="userSpaceOnUse" width="20" height="20">
        <Rect width="10" height="10" x="0" y="0" fill={color} opacity={opacity} />
        <Rect width="10" height="10" x="10" y="10" fill={color} opacity={opacity} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#checkerboard-texture)" />
  </Svg>
);

export {
  TextureWeave,
  TextureEmbossed,
  TextureParticles,
  TextureWavyLines,
  TextureMarble,
  TextureGradientDots,
  TextureCheckerboard
};
