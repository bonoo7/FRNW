import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { Suspense } from 'react';
import { View, ActivityIndicator, StatusBar, Image, Text, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import ErrorBoundary from '../contexts/ErrorBoundary';
import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashScreen from '../components/SplashScreen';
import { FONTS } from '../styles/theme';
import { 
  useFonts as useReadexPro,
  ReadexPro_400Regular,
  ReadexPro_500Medium,
  ReadexPro_600SemiBold,
  ReadexPro_700Bold
} from '@expo-google-fonts/readex-pro';

// شاشة تحميل مخصصة للخطوط
const FontsLoadingScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#000' }}>
    {/* الخلفية */}
    <View style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#1E40AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ 
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 0
        }}
      />
      {/* دوائر ناعمة بدلاً من BackgroundSelector */}
      <View style={{
        position: 'absolute',
        width: 300,
        height: 300,
        top: -100,
        right: -50,
        borderRadius: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }} />
      <View style={{
        position: 'absolute',
        width: 200,
        height: 200,
        bottom: -80,
        left: -50,
        borderRadius: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }} />
    </View>

    {/* المحتوى */}
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Image
          source={require('../assets/logo.png')}
          style={{
            width: 100,
            height: 100,
            resizeMode: 'contain',
            marginBottom: 30
          }}
        />
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: '#FFF',
          fontFamily: Platform.select({
            ios: 'Damascus',
            android: 'sans-serif',
            web: "system-ui, -apple-system, sans-serif",
          }),
          fontWeight: '500'
        }}>
          جاري التحميل...
        </Text>
      </View>
    </View>
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
  try {
    ScreenOrientation.unlockAsync();
  } catch (e) {
    // قد لا يكون متاحاً على الويب
  }

  // إظهار splash screen أثناء تحميل الخطوط
  if (!fontsLoaded || !readexProLoaded) {
    return <FontsLoadingScreen />;
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
