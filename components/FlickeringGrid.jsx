import React, { useEffect, useRef } from 'react';
import { View, Dimensions } from 'react-native';

const FlickeringGrid = ({
  className = '',
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(100, 181, 246)',
  maxOpacity = 0.3,
  animationSpeed = 'medium',
  width,
  height,
}) => {
  const gridStateRef = useRef({});
  const screenWidth = width || Dimensions.get('window').width;
  const screenHeight = height || Dimensions.get('window').height;

  useEffect(() => {
    const squareSizeNum = squareSize;
    const gridGapNum = gridGap;
    const totalSize = squareSizeNum + gridGapNum;
    
    const cols = Math.ceil(screenWidth / totalSize);
    const rows = Math.ceil(screenHeight / totalSize);
    
    for (let i = 0; i < cols * rows; i++) {
      if (!gridStateRef.current[i]) {
        gridStateRef.current[i] = {
          opacity: Math.random() * maxOpacity,
          flickering: Math.random() < flickerChance,
          direction: Math.random() > 0.5 ? 1 : -1,
        };
      }
    }

    const speedMultiplier = {
      slow: 0.5,
      medium: 1,
      fast: 2,
    }[animationSpeed] || 1;

    const animationInterval = setInterval(() => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          const state = gridStateRef.current[index];
          
          if (!state) continue;

          if (state.flickering) {
            state.opacity += state.direction * (0.02 * speedMultiplier);
            
            state.opacity = Math.max(0, Math.min(maxOpacity, state.opacity));
            
            if (state.opacity >= maxOpacity || state.opacity <= 0) {
              state.direction *= -1;
              if (Math.random() < flickerChance) {
                state.flickering = false;
              }
            }
          } else {
            if (Math.random() < flickerChance * 0.1) {
              state.flickering = true;
              state.direction = Math.random() > 0.5 ? 1 : -1;
            }
            state.opacity *= 0.95;
          }
        }
      }
    }, 100);

    return () => clearInterval(animationInterval);
  }, [squareSize, gridGap, flickerChance, maxOpacity, animationSpeed, screenWidth, screenHeight]);

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: screenWidth,
      height: screenHeight,
      pointerEvents: 'none',
      zIndex: 0,
      backgroundColor: 'transparent',
    }}
    />
  );
};

export default FlickeringGrid;
