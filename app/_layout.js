import { Stack } from 'expo-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Suspense } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import ErrorBoundary from '../contexts/ErrorBoundary';
import { 
  useFonts as useReadexPro,
  ReadexPro_400Regular,
  ReadexPro_500Medium,
  ReadexPro_600SemiBold,
  ReadexPro_700Bold
} from '@expo-google-fonts/readex-pro';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#4A6FFF" />
  </View>
);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...MaterialIcons.font,
    'Mada': require('../assets/fonts/Mada-Regular.ttf'),
    'Mada-Regular': require('../assets/fonts/Mada-Regular.ttf'),
    'Mada-SemiBold': require('../assets/fonts/Mada-SemiBold.ttf'),
  });

  const [readexProLoaded] = useReadexPro({
    ReadexPro_400Regular,
    ReadexPro_500Medium,
    ReadexPro_600SemiBold,
    ReadexPro_700Bold
  });

  if (!fontsLoaded || !readexProLoaded) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade'
          }}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}