import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Line, Path, Polygon } from 'react-native-svg';

const PatternDots = ({ color = '#1E40AF', opacity = 0.08 }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="dots-pattern" patternUnits="userSpaceOnUse" width="30" height="30">
        <Rect width="30" height="30" fill="none" />
        <Circle cx="15" cy="15" r="2" fill={color} opacity={opacity} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#dots-pattern)" />
  </Svg>
);

const PatternGrid = ({ color = '#000000', opacity = 0.05 }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="grid-pattern" patternUnits="userSpaceOnUse" width="40" height="40">
        <Rect width="40" height="40" fill="none" />
        <Line x1="0" y1="0" x2="40" y2="0" stroke={color} strokeWidth="0.5" opacity={opacity} />
        <Line x1="0" y1="0" x2="0" y2="40" stroke={color} strokeWidth="0.5" opacity={opacity} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#grid-pattern)" />
  </Svg>
);

const PatternWaves = ({ color = '#60D394', opacity = 0.1 }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="waves-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
        <Path
          d="M0,50 Q25,30 50,50 T100,50"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity={opacity}
        />
        <Path
          d="M0,60 Q25,40 50,60 T100,60"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity={opacity * 0.6}
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#waves-pattern)" />
  </Svg>
);

const PatternDiagonal = ({ color = '#1E40AF', opacity = 0.06 }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="diagonal-pattern" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(45)">
        <Line x1="0" y1="0" x2="0" y2="50" stroke={color} strokeWidth="1" opacity={opacity} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#diagonal-pattern)" />
  </Svg>
);

const PatternHexagons = ({ color = '#3B82F6', opacity = 0.07 }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="hexagon-pattern" patternUnits="userSpaceOnUse" width="60" height="60">
        <Polygon
          points="30,5 50,15 50,35 30,45 10,35 10,15"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity={opacity}
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
  </Svg>
);

const PatternCrosses = ({ color = '#000000', opacity = 0.04 }) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="crosses-pattern" patternUnits="userSpaceOnUse" width="50" height="50">
        <Line x1="25" y1="10" x2="25" y2="40" stroke={color} strokeWidth="0.5" opacity={opacity} />
        <Line x1="10" y1="25" x2="40" y2="25" stroke={color} strokeWidth="0.5" opacity={opacity} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#crosses-pattern)" />
  </Svg>
);

export { PatternDots, PatternGrid, PatternWaves, PatternDiagonal, PatternHexagons, PatternCrosses };
