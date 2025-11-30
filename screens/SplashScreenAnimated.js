import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import BackgroundSelector from '../components/BackgroundSelector';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // تشغيل الرسوميات
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // تشغيل دورة اللوجو
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // الانتقال للتطبيق الرئيسي بعد 3 ثواني
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim, rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <BackgroundSelector>
      <View style={styles.container}>

        {/* اللوجو الرئيسي */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        >
          <View style={styles.logoBg}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* اسم التطبيق */}
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

        {/* الشعار الفرعي */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          اختبر معلوماتك وتنافس مع الآخرين
        </Animated.Text>

        {/* مؤشر التحميل */}
        <View style={styles.loaderContainer}>
          <Animated.View
            style={[
              styles.loaderDot,
              {
                opacity: Animated.timing(
                  new Animated.Value(0.3),
                  {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                  }
                ),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loaderDot,
              {
                opacity: Animated.timing(
                  new Animated.Value(0.3),
                  {
                    toValue: 1,
                    duration: 800,
                    delay: 200,
                    useNativeDriver: true,
                  }
                ),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loaderDot,
              {
                opacity: Animated.timing(
                  new Animated.Value(0.3),
                  {
                    toValue: 1,
                    duration: 800,
                    delay: 400,
                    useNativeDriver: true,
                  }
                ),
              },
            ]}
          />
        </View>
      </View>
    </BackgroundSelector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  floatingElement: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBg: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    width: 140,
    height: 140,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'ReadexPro_700Bold',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontFamily: 'ReadexPro_500Medium',
    marginBottom: 60,
  },
  loaderContainer: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 100,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
});

export default SplashScreen;
