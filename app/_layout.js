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
import * as NavigationBar from 'expo-navigation-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashScreen from '../components/SplashScreen';
import { 
  useFonts as useReadexPro,
  ReadexPro_400Regular,
  ReadexPro_500Medium,
  ReadexPro_600SemiBold,
  ReadexPro_700Bold
} from '@expo-google-fonts/readex-pro';

const RootLayoutContent = () => {
  let backgroundColor = '#FFFFFF';
  
  try {
    const { currentTheme } = useTheme();
    backgroundColor = currentTheme === 'blue' ? '#1E40AF' : '#FFFFFF';
  } catch (e) {
    // fallback
  }

  // إخفاء شريط الإشعارات والنيفيجيشن
  StatusBar.setHidden(true, 'none');
  
  // إخفاء شريط النيفيجيشن السفلي في Android
  try {
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setButtonStyleAsync('light');
  } catch (e) {
    // قد لا يكون متاحاً في جميع الإصدارات
  }
  
  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { 
            backgroundColor: backgroundColor,
            flex: 1
          },
          sceneContainerStyle: {
            flex: 1
          }
        }}
        screenListeners={{
          beforeRemove: (e) => {
            // Prevent showing unmatched deep link error
            if (e.data.action?.type === 'GO_BACK') {
              return;
            }
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

  // إظهار splash screen أثناء تحميل الخطوط
  if (!fontsLoaded || !readexProLoaded) {
    return <SplashScreen />;
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