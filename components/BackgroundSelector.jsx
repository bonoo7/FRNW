import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import FlickeringGrid from './FlickeringGrid';
import HexagonBackground from './HexagonBackground';

const BackgroundSelector = ({
  lightConfig = {
    squareSize: 4,
    gridGap: 6,
    flickerChance: 0.3,
    color: 'rgb(100, 181, 246)',
    maxOpacity: 0.25,
    animationSpeed: 'medium',
  },
  darkConfig = {
    hexagonSize: 75,
    hexagonMargin: 3,
  },
  children,
}) => {
  const { currentTheme } = useTheme();

  // في الثيم الداكن استخدم HexagonBackground
  if (currentTheme === 'dark') {
    return (
      <HexagonBackground 
        hexagonSize={darkConfig.hexagonSize}
        hexagonMargin={darkConfig.hexagonMargin}
      >
        {children}
      </HexagonBackground>
    );
  }

  // في الثيمات الأخرى استخدم FlickeringGrid
  return <FlickeringGrid {...lightConfig} />;
};

export default BackgroundSelector;
