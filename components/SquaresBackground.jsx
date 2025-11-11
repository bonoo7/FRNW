import React from 'react';
import { View } from 'react-native';
import Squares from './Squares';

const SquaresBackground = ({
  className = '',
  children,
  squaresProps = {},
  direction = 'right',
  speed = 1,
  borderColor = '#404040',
  squareSize = 40,
  hoverFillColor = '#222',
  ...props
}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#000000',
        zIndex: 0,
      }}
      {...props}
    >
      {/* Squares Canvas Background */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Squares
          direction={squaresProps.direction || direction}
          speed={squaresProps.speed || speed}
          borderColor={squaresProps.borderColor || borderColor}
          squareSize={squaresProps.squareSize || squareSize}
          hoverFillColor={squaresProps.hoverFillColor || hoverFillColor}
          className={className}
        />
      </View>

      {/* Content */}
      {children && (
        <View
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default SquaresBackground;
