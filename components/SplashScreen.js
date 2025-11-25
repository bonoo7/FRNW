import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // تسلسل الحركات
    Animated.sequence([
      // المرحلة 1: ظهور وتكبير الشعار
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(rotateAnim, {
          toValue: 360,
          duration: 1500,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
      // الانتظار لمدة ثانية واحدة
      Animated.delay(1000),
      // المرحلة 2: اختفاء الشاشة
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      onFinish && onFinish();
    });
  }, []);

  const rotationInterpolate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6', '#1E40AF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFill, styles.container]}
    >
      {/* خلفية متحركة - دوائر ناعمة */}
      <View style={styles.backgroundCircles}>
        <Animated.View
          style={[
            styles.circle,
            styles.circle1,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.3, 0],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            styles.circle2,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.2, 0],
              }),
            },
          ]}
        />
      </View>

      {/* محتوى الشعار والنص */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              {
                scale: scaleAnim,
              },
              {
                rotate: rotationInterpolate,
              },
            ],
            zIndex: 2,
            position: 'relative'
          },
        ]}
      >
        {/* الشعار */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* اسم التطبيق */}
        <View style={styles.textContainer}>
          <Animated.Text
            style={[
              styles.appName,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            فكّر
          </Animated.Text>
          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            لعبة مسابقات ثقافية
          </Animated.Text>
        </View>
      </Animated.View>

      {/* مؤشر التحميل */}
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[
            styles.loaderDot,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
              }),
            },
          ]}
        />
        <Animated.Text
          style={[
            styles.loadingText,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
              }),
            },
          ]}
        >
          جاري التحميل...
        </Animated.Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -50,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -80,
    left: -50,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Damascus',
      android: 'sans-serif-black',
      web: "'Noto Kufi Arabic', 'Tajawal', system-ui, -apple-system, sans-serif",
    }),
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      web: "'Tajawal', system-ui, -apple-system, sans-serif",
    }),
    textAlign: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  loaderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      web: "'Tajawal', system-ui, -apple-system, sans-serif",
    }),
  },
});

export default SplashScreen;
