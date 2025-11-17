import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Line, Path, Polygon, G } from 'react-native-svg';

// تكسجتشر نقاط ممل Grain - يعطي مظهر فيلم قديم (محسّن - أوضح وأقوى)
const TextureFilmGrain = ({ opacity = 0.08, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="film-grain" patternUnits="userSpaceOnUse" width="6" height="6">
        <Rect width="6" height="6" fill="none" />
        {/* نقاط بأحجام مختلفة لتأثير حبيبات قوي */}
        <Circle cx="1.5" cy="1.5" r="0.6" fill={color} opacity={opacity * 0.9} />
        <Circle cx="4.5" cy="2" r="0.5" fill={color} opacity={opacity * 0.7} />
        <Circle cx="2" cy="4.5" r="0.55" fill={color} opacity={opacity * 0.8} />
        <Circle cx="5" cy="5" r="0.65" fill={color} opacity={opacity} />
        <Circle cx="0.5" cy="5.5" r="0.45" fill={color} opacity={opacity * 0.75} />
        <Circle cx="3.5" cy="0.5" r="0.5" fill={color} opacity={opacity * 0.85} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#film-grain)" />
  </Svg>
);

// تكسجتشر نسيج ناعم - يعطي مظهر قماش ناعم
const TextureSoftFabric = ({ opacity = 0.06, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="soft-fabric" patternUnits="userSpaceOnUse" width="15" height="15">
        <Path
          d="M0,7.5 Q3.75,0 7.5,7.5 T15,7.5"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          opacity={opacity}
        />
        <Path
          d="M0,11.25 Q3.75,4 7.5,11.25 T15,11.25"
          fill="none"
          stroke={color}
          strokeWidth="0.25"
          opacity={opacity * 0.7}
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#soft-fabric)" />
  </Svg>
);

// تكسجتشر رمل - حبيبات عشوائية
const TextureSand = ({ opacity = 0.07, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="sand" patternUnits="userSpaceOnUse" width="30" height="30">
        {/* حبيبات رمل عشوائية */}
        <Circle cx="5" cy="5" r="0.7" fill={color} opacity={opacity * 0.9} />
        <Circle cx="12" cy="8" r="0.5" fill={color} opacity={opacity * 0.7} />
        <Circle cx="8" cy="15" r="0.6" fill={color} opacity={opacity * 0.8} />
        <Circle cx="20" cy="6" r="0.55" fill={color} opacity={opacity * 0.8} />
        <Circle cx="25" cy="12" r="0.65" fill={color} opacity={opacity} />
        <Circle cx="15" cy="22" r="0.5" fill={color} opacity={opacity * 0.7} />
        <Circle cx="28" cy="25" r="0.6" fill={color} opacity={opacity * 0.85} />
        <Circle cx="3" cy="28" r="0.55" fill={color} opacity={opacity * 0.75} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#sand)" />
  </Svg>
);

// تكسجتشر معادن - تأثير معدني لامع واضح وقوي
const TextureMetallic = ({ opacity = 0.08, color = '#FFFFFF' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="metallic" patternUnits="userSpaceOnUse" width="30" height="30">
        {/* خطوط معدنية أفقية وعمودية قوية */}
        <Line x1="0" y1="2" x2="30" y2="2" stroke={color} strokeWidth="0.35" opacity={opacity * 0.9} />
        <Line x1="0" y1="8" x2="30" y2="8" stroke={color} strokeWidth="0.3" opacity={opacity * 0.6} />
        <Line x1="0" y1="14" x2="30" y2="14" stroke={color} strokeWidth="0.35" opacity={opacity * 0.8} />
        <Line x1="0" y1="20" x2="30" y2="20" stroke={color} strokeWidth="0.3" opacity={opacity * 0.7} />
        <Line x1="0" y1="26" x2="30" y2="26" stroke={color} strokeWidth="0.35" opacity={opacity * 0.85} />
        
        {/* خطوط عمودية دقيقة */}
        <Line x1="5" y1="0" x2="5" y2="30" stroke={color} strokeWidth="0.2" opacity={opacity * 0.5} />
        <Line x1="15" y1="0" x2="15" y2="30" stroke={color} strokeWidth="0.25" opacity={opacity * 0.6} />
        <Line x1="25" y1="0" x2="25" y2="30" stroke={color} strokeWidth="0.2" opacity={opacity * 0.5} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#metallic)" />
  </Svg>
);

// تكسجتشر زجاج مثلج - تأثير زجاج مجمد
const TextureEmboss = ({ opacity = 0.08, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="emboss" patternUnits="userSpaceOnUse" width="25" height="25">
        <Rect width="25" height="25" fill="none" />
        <Path
          d="M0,12.5 Q6.25,0 12.5,12.5 Q18.75,25 25,12.5"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity={opacity * 0.6}
        />
        <Path
          d="M12.5,0 L12.5,25"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          opacity={opacity * 0.4}
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#emboss)" />
  </Svg>
);

// تكسجتشر الورق - تأثير ورقي واضح وقوي
const TexturePaper = ({ opacity = 0.07, color = '#000000' }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="paper" patternUnits="userSpaceOnUse" width="25" height="25">
        {/* خطوط عشوائية قوية وواضحة تعطي مظهر ورق */}
        <Path
          d="M0,3 L25,5"
          fill="none"
          stroke={color}
          strokeWidth="0.35"
          opacity={opacity}
        />
        <Path
          d="M0,10 L25,12"
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          opacity={opacity * 0.85}
        />
        <Path
          d="M0,18 L25,20"
          fill="none"
          stroke={color}
          strokeWidth="0.35"
          opacity={opacity * 0.9}
        />
        <Path
          d="M3,0 L5,25"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          opacity={opacity * 0.7}
        />
        <Path
          d="M12,0 L10,25"
          fill="none"
          stroke={color}
          strokeWidth="0.35"
          opacity={opacity * 0.8}
        />
        <Path
          d="M22,0 L20,25"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          opacity={opacity * 0.6}
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#paper)" />
  </Svg>
);

export {
  TextureFilmGrain,
  TextureSoftFabric,
  TextureSand,
  TextureMetallic,
  TextureEmboss,
  TexturePaper
};
