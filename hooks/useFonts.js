import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Mada': require('../assets/fonts/Mada-Regular.ttf'),
          'Mada-SemiBold': require('../assets/fonts/Mada-SemiBold.ttf'),
          'Mada-Bold': require('../assets/fonts/Mada-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // في حالة فشل تحميل الخطوط، نستخدم الخط الافتراضي
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}
