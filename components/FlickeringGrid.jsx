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
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const gridStateRef = useRef({});

  const screenWidth = width || Dimensions.get('window').width;
  const screenHeight = height || Dimensions.get('window').height;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    const squareSizeNum = squareSize;
    const gridGapNum = gridGap;
    const totalSize = squareSizeNum + gridGapNum;
    
    // إنشاء شبكة من المربعات
    const cols = Math.ceil(screenWidth / totalSize);
    const rows = Math.ceil(screenHeight / totalSize);
    
    // تهيئة حالة الشبكة
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // تحويل لون RGB إلى مكونات
      const colorMatch = color.match(/\d+/g);
      const [r, g, b] = colorMatch ? [colorMatch[0], colorMatch[1], colorMatch[2]] : ['100', '181', '246'];

      // رسم الشبكة
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          const state = gridStateRef.current[index];

          const x = col * totalSize;
          const y = row * totalSize;

          // تحديث الشفافية
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
            state.opacity *= 0.95; // التلاشي التدريجي
          }

          // رسم المربع
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${state.opacity})`;
          ctx.fillRect(x, y, squareSizeNum, squareSizeNum);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [screenWidth, screenHeight, squareSize, gridGap, flickerChance, color, maxOpacity, animationSpeed]);

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
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
};

export default FlickeringGrid;
