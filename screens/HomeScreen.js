import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  BackHandler,
  ImageBackground,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../styles/theme';
import { useTheme, getTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import StorageService from '../services/storageService';
import EnhancedStorageService from '../services/enhancedStorageService';
import RewardsGuide from '../components/RewardsGuide';
import PentaPointsGuide from '../components/PentaPointsGuide';
import PentaPointsService from '../services/pentaPointsService';
import ResponsiveView from '../components/ResponsiveView';
import { ThemeSelector } from '../components/ThemeSelector';
import UserMenu from '../components/UserMenu';
import { 
  wp, 
  hp, 
  getResponsiveStyles, 
  breakpoints
} from '../styles/responsive';
import BackgroundPattern from '../components/BackgroundPattern';
import { useRouter, Link, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable } from 'react-native';

// تعريف الثوابت خارج المكون
const TEAM_NUMBERS = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
const MIN_TEAMS = 2;
const MAX_TEAMS = 5;

// تعريف الأنماط الثابتة فقط
const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%', // تقليل العرض
    alignSelf: 'center',
  },
  content: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    marginBottom: SPACING.sm,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: -SPACING.md,
  },
  title: {
    fontSize: wp(6), // تقليل حجم الخط
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginBottom: SPACING.xxs,
    fontFamily: Platform.select({
      ios: 'Damascus',
      android: 'sans-serif-black',
      web: "'Noto Kufi Arabic', 'Tajawal', system-ui, -apple-system, sans-serif",
    }),
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: wp(3), // تقليل حجم الخط
    textAlign: 'center',
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row-reverse',
    marginBottom: getResponsiveStyles().isSmallScreen ? SPACING.xs : SPACING.sm, // تقليل المسافة
    alignItems: 'flex-start',
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: FONTS.sizes.small, // تقليل حجم الخط
    fontWeight: FONTS.weights.medium,
    marginBottom: SPACING.xxs, // تقليل المسافة
    textAlign: 'right',
    fontFamily: FONTS.families.secondary,
    fontWeight: FONTS.weights.bold,
  },
  teamCountContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  teamCountButton: {
    flex: 1,
    paddingVertical: getResponsiveStyles().isSmallScreen ? SPACING.xs : SPACING.sm, // تقليل المسافة
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamCountText: {
    fontSize: getResponsiveStyles().isSmallScreen ? FONTS.sizes.body : FONTS.sizes.h4, // تقليل حجم الخط
    fontWeight: FONTS.weights.bold,
    fontFamily: FONTS.families.secondary,
  },
  teamsGrid: {
    flexDirection: 'row-reverse', // من اليمين لليسار
    flexWrap: 'nowrap', // منع التفاف العناصر
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4, // تقليل المسافة
    width: '100%',
  },
  teamInputContainer: {
    marginBottom: 2, // تقليل المسافة أكثر
    marginHorizontal: 2, // تقليل المسافة
    padding: 2, // تقليل المساحة الداخلية
  },
  input: {
    borderRadius: 12,
    padding: SPACING.xxs,
    paddingHorizontal: SPACING.sm,
    fontSize: FONTS.sizes.small,
    textAlign: 'right',
    borderWidth: 1,
    height: 28,
    fontFamily: FONTS.families.secondary,
    fontWeight: FONTS.weights.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4, // تقليل المسافة
  },
  startButtonContent: {
    padding: 4, // تقليل المسافة أكثر
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: FONTS.sizes.h4,
    color: '#fff',
    fontWeight: FONTS.weights.bold,
    fontFamily: FONTS.families.secondary,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  settingsCard: {
    width: '100%',
    marginTop: getResponsiveStyles().isSmallScreen ? SPACING.md : SPACING.lg, // تقليل المسافة
    marginBottom: SPACING.md, // تقليل المسافة
  },
  settingRow: {
    flexDirection: 'row-reverse', // تغيير الاتجاه ليناسب الكتابة العربية
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs, // تقليل المسافة
  },
  settingText: {
    fontSize: FONTS.sizes.body, // تقليل حجم الخط
    fontWeight: FONTS.weights.medium,
    textAlign: 'right',
  },
  settingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm, // تقليل المسافة
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: SPACING.sm, // تقليل المسافة
    paddingHorizontal: SPACING.sm,
  },
  switchLabel: {
    fontSize: FONTS.sizes.small, // تقليل حجم الخط
    fontWeight: FONTS.weights.medium,
    marginRight: SPACING.sm, // تقليل المسافة
  },
  switchStyle: {
    transform: Platform.select({
      ios: [
        { scaleX: 0.8 }, // تقليل حجم المفتاح
        { scaleY: 0.8 }, // تقليل حجم المفتاح
      ],
      android: [
        { scaleX: 0.8 }, // تقليل حجم المفتاح
        { scaleY: 0.8 }, // تقليل حجم المفتاح
      ],
      default: [
        { scaleX: 0.8 }, // تقليل حجم المفتاح
        { scaleY: 0.8 }, // تقليل حجم المفتاح
      ],
    }),
    marginVertical: 2, // تقليل المسافة
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm, // تقليل المسافة
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm, // تقليل المسافة
  },
  logo: {
    width: 60, // تقليل حجم الشعار
    height: 60, // تقليل حجم الشعار
    marginRight: SPACING.sm,
  },
  welcomeText: {
    fontSize: FONTS.sizes.regular, // تقليل حجم النص أكثر
    fontWeight: FONTS.weights.semibold,
    textAlign: 'right',
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  gameContainer: {
    flex: 1,
  },
  card: {
    borderRadius: 8, // تقليل نصف قطر الحواف
    padding: 4, // تقليل المساحة الداخلية أكثر
    borderWidth: 1,
  },
  mainContentContainer: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)', // استخدام قيمة ثابتة بدلاً من theme
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // استخدام قيمة ثابتة بدلاً من theme
    overflow: 'hidden',
    padding: SPACING.xxs, // تقليل المساحة الداخلية
    width: '95%', // تقليل العرض
    alignSelf: 'center',
  },
  innerBorder: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: 'rgba(255, 255, 255, 0.3)', // استخدام قيمة ثابتة بدلاً من theme
    zIndex: -1,
  },
});

const ContainerBackground = ({ style, children }) => {
  const { theme } = useTheme();
  const imageSource = theme?.colors?.background?.containerImage;

  // استخراج borderRadius وباقي الأنماط من style
  // استخدام StyleSheet.flatten للتأكد من التعامل مع مصفوفات الأنماط
  const flatStyle = StyleSheet.flatten(style || {});
  const { borderRadius, ...restStyle } = flatStyle;

  // نمط الحاوية الخارجية (للقص والحواف الدائرية)
  const wrapperStyle = {
    ...restStyle,
    borderRadius: borderRadius || 0,
    overflow: 'hidden', // ضروري لقص صورة الخلفية
    position: 'relative', // ضروري لتحديد موضع ImageBackground المطلق
  };

  // نمط الخلفية الموحدة
  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background?.card || 
                     theme.colors.background?.light || 
                     theme.colors.secondary || 
                     '#A0C6FF', // احتياطي في حال عدم وجود الألوان
    borderWidth: 1.5,
    borderColor: theme.currentTheme === 'dark' ? theme.colors.shadow?.color || '#8B5CF6' : theme.colors.primary || '#1E40AF',
  };

  return (
    <View style={wrapperStyle}>
      {/* خلفية موحدة بلون الثيم */}
      <View style={backgroundStyle} />
      
      {/* صورة الخلفية (إذا كانت موجودة) */}
      {imageSource && (
        <ImageBackground
          source={imageSource}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2, // تقليل الشفافية لتظهر الخلفية الملونة
          }}
          imageStyle={{ opacity: 0.5 }}
          resizeMode="cover"
        />
      )}
      
      {/* عرض المحتوى فوق الخلفية */}
      {children}
    </View>
  );
};

const HomeScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [isSmallScreen, setIsSmallScreen] = useState(screenWidth < breakpoints.tablet);
  const [settings, setSettings] = useState({
    rewardsEnabled: true,
    pentaPointsEnabled: true
  });
  const [showRewardsGuide, setShowRewardsGuide] = useState(false);
  const [showPentaPointsGuide, setShowPentaPointsGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [patternKey, setPatternKey] = useState(Date.now());
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/auth');
    }
  }, [currentUser, authLoading]);

  if (!theme) {
    return null;
  }

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background?.primary }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!currentUser) {
    return null;
  }

  useFocusEffect(
    React.useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      setPatternKey(Date.now());

      return () => {
        fadeAnim.setValue(0);
      };
    }, [])
  );

  const [roundCount, setRoundCount] = useState(1);

  useEffect(() => {
    const loadRoundCount = async () => {
      try {
        const savedCount = await AsyncStorage.getItem('roundCount');
        if (savedCount) {
          setRoundCount(parseInt(savedCount));
        }
      } catch (error) {
        console.error('خطأ في تحميل رقم الجولة:', error);
      }
    };
    loadRoundCount();
  }, []);

  const getDefaultRoundName = () => {
    const numbers = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
    return `الجولة ${numbers[roundCount - 1] || roundCount}`;
  };

  const getDefaultTeamName = (index) => {
    return `الفريق ${index + 1}`;
  };

  const [gameSettings, setGameSettings] = useState({
    roundName: '',
    teamCount: MIN_TEAMS,
    teams: Array(MIN_TEAMS).fill(''),
    rewardsEnabled: true,
    pentaPointsEnabled: true
  });

  const updateTeamCount = (count) => {
    setGameSettings(prev => ({ ...prev, teamCount: count, teams: Array(count).fill('') }));
  };

  const updateTeam = (index, value) => {
    const newTeams = [...gameSettings.teams];
    newTeams[index] = value;
    setGameSettings(prev => ({ ...prev, teams: newTeams }));
  };

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await StorageService.getSettings();
      if (savedSettings) {
        setGameSettings(prev => ({ 
          ...prev, 
          rewardsEnabled: savedSettings.rewardsEnabled !== undefined ? savedSettings.rewardsEnabled : true,
          pentaPointsEnabled: savedSettings.pentaPointsEnabled !== undefined ? savedSettings.pentaPointsEnabled : true
        }));
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const handleDimensionsChange = ({ window }) => {
      if (Math.abs(window.width - screenWidth) > 50) {  
        setScreenWidth(window.width);
        setIsSmallScreen(window.width < breakpoints.tablet);
      }
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionsChange);
    return () => subscription.remove();
  }, [screenWidth]);

  useEffect(() => {
    const hasUnsavedData = gameSettings.teams.some(team => team.trim()) || gameSettings.roundName.trim();
    
    if (hasUnsavedData) {
      const handleBackPress = () => {
        Alert.alert(
          'تأكيد الخروج',
          'هل أنت متأكد من الخروج؟ ستفقد البيانات المدخلة',
          [
            { text: 'إلغاء', style: 'cancel' },
            { 
              text: 'خروج', 
              style: 'destructive', 
              onPress: () => router.back() 
            }
          ]
        );
        return true;
      };
      
      if (Platform.OS !== 'web') {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }
  }, [gameSettings.teams, gameSettings.roundName]);

  const toggleRewards = async (value) => {
    try {
      const updatedSettings = { ...settings, rewardsEnabled: value };
      setSettings(updatedSettings);
      await StorageService.saveSettings(updatedSettings);
    } catch (error) {
      console.error('خطأ في حفظ إعدادات المكافآت:', error);
    }
  };

  const togglePentaPoints = async (value) => {
    try {
      const updatedSettings = { ...settings, pentaPointsEnabled: value };
      setSettings(updatedSettings);
      await PentaPointsService.toggleEnabled(value);
    } catch (error) {
      console.error('خطأ في حفظ إعدادات علي وعلى أعدائي:', error);
    }
  };

  const validateGameSettings = (settings) => {
    if (settings.teams.some(team => team.trim().length > 0 && team.trim().length < 2)) {
      throw new Error('اسم الفريق يجب أن يكون حرفين على الأقل');
    }
    if (settings.teams.some(team => team.length > 20)) {
      throw new Error('اسم الفريق يجب أن لا يتجاوز 20 حرف');
    }
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
    if (settings.teams.some(team => specialCharsRegex.test(team))) {
      throw new Error('اسم الفريق يجب أن لا يحتوي على رموز خاصة');
    }
    if (new Set(settings.teams.filter(Boolean)).size !== settings.teams.filter(Boolean).length) {
      throw new Error('لا يمكن تكرار أسماء الفرق');
    }
  };

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      validateGameSettings(gameSettings);
      
      const finalRoundName = gameSettings.roundName.trim() || getDefaultRoundName();
      const finalTeams = gameSettings.teams
        .map((team, index) => team.trim() || getDefaultTeamName(index))
        .filter(team => team);

      const initialGameData = {
        roundName: finalRoundName,
        teams: finalTeams,
        teamCount: finalTeams.length,
        categories: [],
        questions: {},
        rewardsEnabled: gameSettings.rewardsEnabled,
        pentaPointsEnabled: gameSettings.pentaPointsEnabled,
        scores: finalTeams.reduce((acc, team) => ({
          ...acc,
          [team]: 0
        }), {}),
        currentTeamIndex: 0,
        usedDoublePoints: finalTeams.reduce((acc, team) => ({
          ...acc,
          [team]: false
        }), {}),
        timestamp: new Date().toISOString(),
        createdBy: currentUser?.uid || null,
        status: 'setup' // setup, active, completed
      };

      // حفظ اللعبة باستخدام الخدمة المحسنة التي تدعم Firebase
      await EnhancedStorageService.saveCurrentGame(initialGameData, currentUser?.uid);
      
      // إذا كان المستخدم مسجل دخول، قم بالمزامنة
      if (currentUser) {
        await EnhancedStorageService.syncWithFirebase(currentUser.uid);
      }
      
      router.push('/game/setup');
    } catch (error) {
      console.error('خطأ في حفظ بيانات اللعبة:', error);
      Alert.alert('خطأ', error.message || 'حدث خطأ في حفظ بيانات اللعبة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatistics = () => {
    router.push('/statistics');
  };

  const responsiveStyles = getResponsiveStyles();

  const getTeamInputWidth = () => {
    if (screenWidth >= breakpoints.tablet) {
      return wp(30);
    }
    return wp(45);
  };

  const switchTransform = [{ scaleX: -1 }, { scaleY: 1 }];

  const switchThumbColorByPlatform = Platform.select({
    ios: '#FFFFFF',
    android: gameSettings.rewardsEnabled ? theme.colors.text.light : '#f4f3f4',
    default: '#FFFFFF',
  });

  const styles = StyleSheet.create({
    welcomeText: {
      ...staticStyles.welcomeText,
      color: theme.colors.text.primary,
    },
    settingLabel: {
      ...staticStyles.settingLabel,
      color: theme.colors.text.primary,
      marginRight: 4, 
    },
    settingValue: {
      ...staticStyles.settingValue,
      color: theme.colors.text.secondary,
    },
    container: {
      flex: 1,
      width: '90%', 
      alignSelf: 'center',
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainContentContainer: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: `${theme.colors.border.primary}80`,
      backgroundColor: `${theme.colors.background.card}80`, // زيادة الشفافية
      overflow: 'hidden',
      padding: SPACING.xxs, 
      width: '95%', 
      alignSelf: 'center',
    },
    innerBorder: {
      position: 'absolute',
      left: 4,
      right: 4,
      top: 4,
      bottom: 4,
      borderWidth: 1,
      borderRadius: 16,
      borderColor: `${theme.colors.border.primary}60`,
    },
    input: {
      ...staticStyles.input,
      borderColor: theme.colors.border || theme.colors.primary,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      height: 28, 
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    startButtonText: {
      fontSize: FONTS.sizes.h4,
      color: theme.colors.text.onPrimary,
      fontWeight: FONTS.weights.bold,
      fontFamily: FONTS.families.secondary,
    },
    gameContainer: {
      flex: 1,
      marginTop: 0,
      paddingHorizontal: SPACING.xxs, 
      paddingVertical: SPACING.xxs, 
    },
    teamsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 4, 
      marginBottom: 4, 
    },
    teamInputContainer: {
      marginBottom: 2,
      marginHorizontal: 2,
      padding: 2,
    },
    startButton: {
      marginTop: 4, 
      borderRadius: 8,
      overflow: 'hidden',
    },
    startButtonContent: {
      paddingVertical: 6, 
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsContainer: {
      alignSelf: 'center',
      borderRadius: 16,
      padding: SPACING.sm, 
      marginTop: 2, 
      borderWidth: 1,
      overflow: 'hidden',
      backgroundColor: `${theme.colors.background.card}95`,
      borderColor: theme.colors.border.primary,
      elevation: 4,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    settingsSection: {
      marginTop: 2, 
    },
    settingRow: {
      flexDirection: 'row-reverse', 
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingItem: {
      flexDirection: 'row-reverse', 
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4, 
      marginTop: 4, 
    },
    guideIcon: {
      width: 16, 
      height: 16, 
      borderRadius: 8, 
      backgroundColor: `${theme.colors.primary}10`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4, 
    },
  });

  const saveSettings = async () => {
    try {
      await StorageService.saveSettings({
        ...gameSettings
      });
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
    }
  };

  const toggleRewardsSystem = () => {
    setGameSettings(prev => {
      const newSettings = { ...prev, rewardsEnabled: !prev.rewardsEnabled };
      StorageService.saveSettings(newSettings);
      return newSettings;
    });
  };
  
  const togglePentaPointsSystem = () => {
    setGameSettings(prev => {
      const newSettings = { ...prev, pentaPointsEnabled: !prev.pentaPointsEnabled };
      StorageService.saveSettings(newSettings);
      return newSettings;
    });
  };

  const openHelpModal = (modalType) => {
    setSettingsMenuVisible(false);
    
    setTimeout(() => {
      if (modalType === 'rewards') {
        setShowRewardsGuide(true);
      } else if (modalType === 'pentaPoints') {
        setShowPentaPointsGuide(true);
      }
    }, 300);
  };

  const SettingsSelector = () => {
    const settingsOptions = [
      { 
        id: 'rewards', 
        name: 'نظام سرعة التثبيت', 
        enabled: gameSettings.rewardsEnabled,
        onToggle: toggleRewardsSystem,
        icon: 'emoji-events',
        helpModal: 'rewards'
      },
      { 
        id: 'pentaPoints', 
        name: 'نظام علي وعلى أعدائي', 
        enabled: gameSettings.pentaPointsEnabled,
        onToggle: togglePentaPointsSystem,
        icon: 'star',
        helpModal: 'pentaPoints'
      }
    ];

    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={() => setSettingsMenuVisible(true)}
          style={{ 
            backgroundColor: 'transparent',
            padding: SPACING.xxs
          }}
        >
          <MaterialIcons 
            name="settings" 
            size={30} 
            color={theme.colors.border.primary} 
          />
        </TouchableOpacity>

        <Modal
          visible={settingsMenuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSettingsMenuVisible(false)}
        >
          <View 
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)'
            }}
          >
            <View 
              style={{
                width: '80%',
                maxWidth: 300,
                backgroundColor: theme.colors.background.card,
                borderRadius: BORDER_RADIUS.lg,
                borderWidth: 2,
                borderColor: theme.colors.border.primary,
                overflow: 'hidden',
                ...SHADOWS.lg
              }}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingHorizontal: SPACING.sm,
                paddingVertical: SPACING.xs,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border.primary
              }}>
                <TouchableOpacity 
                  onPress={() => setSettingsMenuVisible(false)}
                  style={{
                    padding: 4,
                    borderRadius: 15,
                    backgroundColor: 'rgba(52, 152, 219, 0.15)'
                  }}
                >
                  <MaterialIcons name="close" size={20} color="#3498db" />
                </TouchableOpacity>
                <Text style={{
                  flex: 1,
                  textAlign: 'center',
                  color: theme.colors.text.primary,
                  fontFamily: FONTS.families.secondary,
                  fontWeight: FONTS.weights.medium,
                  fontSize: FONTS.sizes.body
                }}>
                  الإعدادات
                </Text>
              </View>
              {settingsOptions.map(option => (
                <View key={option.id}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: SPACING.md,
                      borderBottomWidth: option.id === 'rewards' ? 1 : 0,
                      borderBottomColor: theme.colors.border.primary,
                      backgroundColor: option.enabled ? 'rgba(52, 152, 219, 0.15)' : 'transparent'
                    }}
                    onPress={option.onToggle}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialIcons 
                        name={option.icon} 
                        size={24} 
                        color={option.enabled ? theme.colors.border.primary : theme.colors.text.secondary} 
                      />
                      <Text style={{
                        color: theme.colors.text.primary,
                        fontFamily: FONTS.families.secondary,
                        fontWeight: FONTS.weights.medium,
                        marginRight: 8,
                        fontSize: FONTS.sizes.body,
                        marginLeft: 12
                      }}>
                        {option.name}
                      </Text>
                      
                      <TouchableOpacity 
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: 'rgba(52, 152, 219, 0.2)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: 8
                        }}
                        onPress={(e) => {
                          e.stopPropagation(); 
                          if (option.helpModal === 'rewards') {
                            setShowRewardsGuide(true);
                          } else if (option.helpModal === 'pentaPoints') {
                            setShowPentaPointsGuide(true);
                          }
                        }}
                      >
                        <MaterialIcons 
                          name="help" 
                          size={16} 
                          color={theme.colors.border.primary || "#3498db"} 
                        />
                      </TouchableOpacity>
                    </View>
                    <MaterialIcons 
                      name={option.enabled ? "check-box" : "check-box-outline-blank"} 
                      size={24} 
                      color={option.enabled ? theme.colors.border.primary : theme.colors.text.secondary} 
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </Modal>
        
        {/* ملاحظة: المودالات موجودة في المكون الرئيسي HomeScreen وليس هنا */}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: 'transparent'
    }}>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />

      <ScrollView 
        style={{ 
          flex: 1,
          backgroundColor: 'transparent'
        }}
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 1 }}
      >
        {/* رأس الصفحة مع أيقونة الملف الشخصي */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View style={{ flex: 1 }} />
          <UserMenu style={{ position: 'relative', zIndex: 10 }} />
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* رأس البرنامج */}
          <View style={{ marginBottom: 30, marginTop: 10 }}>
            <Text style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#1E40AF',
              textAlign: 'center',
              fontFamily: FONTS.families.secondary,
              marginBottom: 10
            }}>
              🎮 فكّر
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#666',
              textAlign: 'center',
              fontFamily: FONTS.families.secondary
            }}>
              إعداد لعبة جديدة
            </Text>
          </View>

          {/* قسم عدد الفرق */}
          <View style={{ marginBottom: 25 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333',
                fontFamily: FONTS.families.secondary,
                marginLeft: 10
              }}>
                عدد الفرق
              </Text>
            </View>

            <View style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-around',
              backgroundColor: '#F5F5F5',
              borderRadius: 15,
              padding: 12
            }}>
              {[2, 3, 4, 5].map(count => (
                <TouchableOpacity
                  key={count}
                  onPress={() => updateTeamCount(count)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: gameSettings.teamCount === count ? '#1E40AF' : '#DDD',
                    backgroundColor: gameSettings.teamCount === count ? '#1E40AF' : '#FFF',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: gameSettings.teamCount === count ? '#FFF' : '#333',
                    fontFamily: FONTS.families.secondary,
                  }}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* قسم اسم الجولة */}
          <View style={{ marginBottom: 25 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 10,
              fontFamily: FONTS.families.secondary,
            }}>
              اسم الجولة
            </Text>

            <TextInput
              style={{
                borderWidth: 2,
                borderColor: '#1E40AF',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                fontFamily: FONTS.families.secondary,
                color: '#333',
                textAlign: 'right',
                backgroundColor: '#FFF',
                minHeight: 50,
              }}
              placeholder="الجولة الأولى"
              placeholderTextColor="#CCC"
              value={gameSettings.roundName}
              onChangeText={(value) => setGameSettings(prev => ({ ...prev, roundName: value }))}
            />
          </View>

          {/* قسم أسماء الفرق */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 12,
              fontFamily: FONTS.families.secondary,
            }}>
              أسماء الفرق
            </Text>

            <View style={{
              flexDirection: 'row-reverse',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
              {Array.from({ length: gameSettings.teamCount }).map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: gameSettings.teamCount <= 2 ? '48%' : gameSettings.teamCount === 3 ? '31%' : '23%',
                    marginBottom: 16,
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: 8,
                    fontFamily: FONTS.families.secondary,
                    textAlign: 'right',
                  }}>
                    الفريق {index + 1}
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 2,
                      borderColor: '#1E40AF',
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      fontSize: 14,
                      fontFamily: FONTS.families.secondary,
                      color: '#333',
                      textAlign: 'right',
                      backgroundColor: '#FFF',
                      minHeight: 45,
                    }}
                    placeholder={getDefaultTeamName(index)}
                    placeholderTextColor="#CCC"
                    value={gameSettings.teams[index]}
                    onChangeText={(value) => updateTeam(index, value)}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* زر البدء */}
          <TouchableOpacity
            onPress={handleStartGame}
            disabled={isLoading}
            style={{
              backgroundColor: '#1E40AF',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading ? 0.7 : 1,
              elevation: 4,
              shadowColor: '#1E40AF',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              marginBottom: 20
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                fontFamily: FONTS.families.secondary,
              }}>
                بدء اللعبة
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
