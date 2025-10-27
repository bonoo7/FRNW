import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useOrientation() {
  const [orientation, setOrientation] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'LANDSCAPE' : 'PORTRAIT';
  });

  useEffect(() => {
    const handleDimensionChange = ({ window }) => {
      const newOrientation = window.width > window.height ? 'LANDSCAPE' : 'PORTRAIT';
      setOrientation(newOrientation);
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionChange);

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  return orientation;
}

export function useIsLandscape() {
  const orientation = useOrientation();
  return orientation === 'LANDSCAPE';
}