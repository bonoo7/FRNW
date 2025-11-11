import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import FlickeringGrid from './FlickeringGrid';
import SquaresBackground from './SquaresBackground';
import AnimatedCirclesBackground from './AnimatedCirclesBackground';

const BackgroundSelector = ({
  lightConfig = {
    squareSize: 4,
    gridGap: 6,
    flickerChance: 0.3,
    color: 'rgb(59, 130, 246)',
    maxOpacity: 0.35,
    animationSpeed: 'medium',
  },
  darkConfig = {
    direction: 'right',
    speed: 1,
    borderColor: '#404040',
    squareSize: 40,
    hoverFillColor: '#222',
  },
  children,
}) => {
  const { currentTheme } = useTheme();

  // في الثيم الداكن استخدم SquaresBackground
  if (currentTheme === 'dark') {
    return (
      <SquaresBackground 
        squaresProps={darkConfig}
      >
        {children}
      </SquaresBackground>
    );
  }

  // في الثيم الفريش استخدم AnimatedCirclesBackground
  if (currentTheme === 'fresh') {
    return (
      <AnimatedCirclesBackground>
        {children}
      </AnimatedCirclesBackground>
    );
  }

  // في الثيمات الأخرى استخدم FlickeringGrid
  return <FlickeringGrid {...lightConfig} />;
};

export default BackgroundSelector;
