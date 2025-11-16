import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

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
  const [gridState, setGridState] = useState({});
  const screenWidth = width || Dimensions.get('window').width;
  const screenHeight = height || Dimensions.get('window').height;

  useEffect(() => {
    const squareSizeNum = squareSize;
    const gridGapNum = gridGap;
    const totalSize = squareSizeNum + gridGapNum;
    
    const cols = Math.ceil(screenWidth / totalSize);
    const rows = Math.ceil(screenHeight / totalSize);
    
    // Initialize grid state
    const initialState = {};
    for (let i = 0; i < cols * rows; i++) {
      initialState[i] = {
        opacity: Math.random() * maxOpacity,
        flickering: Math.random() < flickerChance,
        direction: Math.random() > 0.5 ? 1 : -1,
      };
    }
    setGridState(initialState);

    const speedMultiplier = {
      slow: 0.5,
      medium: 1,
      fast: 2,
    }[animationSpeed] || 1;

    const animationInterval = setInterval(() => {
      setGridState((prevState) => {
        const newState = { ...prevState };
        
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            const state = newState[index] || prevState[index];

            if (state.flickering) {
              state.opacity += state.direction * (0.02 * speedMultiplier);
              
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
            
            newState[index] = state;
          }
        }
        
        return newState;
      });
    }, 50);

    return () => clearInterval(animationInterval);
  }, [screenWidth, screenHeight, squareSize, gridGap, flickerChance, color, maxOpacity, animationSpeed]);

  const squareSizeNum = squareSize;
  const gridGapNum = gridGap;
  const totalSize = squareSizeNum + gridGapNum;
  const cols = Math.ceil(screenWidth / totalSize);
  const rows = Math.ceil(screenHeight / totalSize);
  
  // Parse color
  const colorMatch = color.match(/\d+/g);
  const [r, g, b] = colorMatch ? [colorMatch[0], colorMatch[1], colorMatch[2]] : ['100', '181', '246'];

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: screenWidth,
      height: screenHeight,
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      <Svg width={screenWidth} height={screenHeight}>
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const index = row * cols + col;
            const state = gridState[index];
            const opacity = state ? state.opacity : 0;
            
            return (
              <Rect
                key={`${row}-${col}`}
                x={col * totalSize}
                y={row * totalSize}
                width={squareSizeNum}
                height={squareSizeNum}
                fill={`rgba(${r}, ${g}, ${b}, ${opacity})`}
              />
            );
          })
        )}
      </Svg>
    </View>
  );
};

export default FlickeringGrid;
