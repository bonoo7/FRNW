import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { Suspense } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import ErrorBoundary from '../contexts/ErrorBoundary';
import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenOrientation from 'expo-screen-orientation';
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

const RootLayoutContent = () => {
  let backgroundColor = '#FFFFFF';
  
  try {
    const { currentTheme } = useTheme();
    backgroundColor = currentTheme === 'blue' ? '#1E40AF' : '#FFFFFF';
  } catch (e) {
    // fallback
  }
  
  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar style={backgroundColor === '#1E40AF' ? 'light' : 'auto'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { 
            backgroundColor: backgroundColor,
            flex: 1
          }
        }}
      />
    </View>
  );
};

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

  // تفعيل جميع الاتجاهات
  ScreenOrientation.unlockAsync();

  if (!fontsLoaded || !readexProLoaded) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}