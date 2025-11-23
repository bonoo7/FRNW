import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import {
  LinearGradient
} from 'expo-linear-gradient';
import { SPACING, FONTS, SHADOWS } from '../styles/theme';
import { useTheme, getTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import categoryImages from '../assets/categories.js';
import { globalStyles, withThemeStyles } from '../styles/styles';
import StorageService from '../services/storageService';
import CreditsService from '../services/creditsService';
import { getResponsiveStyles, wp } from '../styles/responsive';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import BackgroundPattern from '../components/BackgroundPattern';
import BackgroundSelector from '../components/BackgroundSelector';
// React Reanimated removed - not actively used
// import Animated from 'react-native-reanimated';
import { CategoryCard } from '../components/CategoryCard';
import { GameService } from '../services/gameService';

// التأكد من وجود الصورة
const getCategoryImage = (category) => {
  const image = categoryImages[category];
  if (!image) {
    console.warn(`No image found for category: ${category}`);
    return categoryImages['معلومات عامة']; // صورة افتراضية
  }
  return image;
};

const staticStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
  },
  gridContainer: {
    gap: 0,
    padding: 0,
    paddingBottom: 0,
    flexGrow: 0,
    justifyContent: 'flex-start',
  },
  categoriesContainer: {
    height: '38%',
    borderRadius: 16,
    padding: 0,
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: '85%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 0,
    padding: 0,
  },
  categoryItem: {
    padding: 0,
    margin: 0,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    zIndex: 100,
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
  },
  progressContentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  progressWrapper: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  progressAndCategoriesContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.xxs,
    width: '20%',
    marginRight: SPACING.sm,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: FONTS.sizes.xxs,
    fontWeight: FONTS.weights.bold,
    fontFamily: 'ReadexPro_700Bold',
    color: '#666',
    textAlign: 'right',
  },
  teamInfo: {
    fontSize: FONTS.sizes.xxs,
    fontWeight: FONTS.weights.medium,
    fontFamily: 'ReadexPro_500Medium',
    color: '#666',
    textAlign: 'right',
  },
  startButton: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '20%',
    marginLeft: SPACING.sm,
  },
  startButtonContent: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.bold,
    fontFamily: 'ReadexPro_700Bold',
    color: '#FFFFFF',
  },
  selectedCategoriesWrapper: {
    width: '55%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: 'hidden',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  selectedCategoriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 4,
    flexGrow: 0,
    alignSelf: 'center',
  },
  selectedCategoryItem: {
    width: 40,
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCategoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedCategoryText: {
    display: 'none', // إخفاء اسم الفئة
    fontSize: FONTS.sizes.xxs,
    fontWeight: FONTS.weights.medium,
    color: '#333',
    textAlign: 'center',
    padding: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  orderBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 1,
    minWidth: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: 7,
    fontWeight: FONTS.weights.bold,
    fontFamily: 'ReadexPro_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ContainerBackground = ({ style, children }) => {
  const { theme } = useTheme();
  const imageSource = theme?.colors?.background?.containerImage;

  // استخراج borderRadius وباقي الأنماط من style
  const flatStyle = StyleSheet.flatten(style || {});
  const { borderRadius, backgroundColor, ...restStyle } = flatStyle;

  // نمط الحاوية الخارجية (للقص والحواف الدائرية)
  const wrapperStyle = {
    ...restStyle,
    borderRadius: borderRadius || 0,
    overflow: 'hidden', // ضروري لقص صورة الخلفية
    position: 'relative', // ضروري لتحديد موضع ImageBackground المطلق
    flex: 1, // إضافة flex: 1 لضمان امتداد الحاوية
    height: '100%', // ضمان امتداد الارتفاع
    width: '100%', // ضمان امتداد العرض
  };

  // نمط الخلفية الموحدة - استخدام backgroundColor المُمرر أو اللون من theme
  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: backgroundColor || 
                     theme.colors.background?.card || 
                     theme.colors.background?.light || 
                     theme.colors.secondary || 
                     '#A0C6FF', // احتياطي في حال عدم وجود الألوان
    borderWidth: 1.5,
    borderColor: '#2E5DB8',
  };

  return (
    <View style={wrapperStyle}>
      {/* خلفية موحدة بلون الثيم */}
      <View style={backgroundStyle} />
      
      {/* صورة الخلفية (النقش) - تملأ كل القالب */}
      {imageSource && (
        <ImageBackground
          source={imageSource}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.35,
          }}
          imageStyle={{ 
            opacity: 0.6,
            resizeMode: 'repeat',
          }}
          resizeMode="repeat"
        />
      )}
      {children}
    </View>
  );
};

const GameSetup = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [gameData, setGameData] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const responsiveStyles = getResponsiveStyles();
  
  // تعديل الأنماط بناءً على اتجاه الشاشة وحجم الشاشة
  const dynamicStyles = {
    categoriesContainer: {
      width: responsiveStyles.isLandscape ? '90%' : '85%',
      maxWidth: responsiveStyles.isLandscape ? '90%' : '85%',
      height: responsiveStyles.isLandscape ? '45%' : '38%',
      paddingVertical: 0,
      paddingHorizontal: 0,
      overflow: 'hidden',
    }
  };

  const getMaxCategories = (teamCount) => {
    console.log('Calculating categories for team count:', teamCount);
    switch (teamCount) {
      case 2:
        return 6;  // 3 فئات لكل فريق = 6
      case 3:
        return 6;  // 2 فئات لكل فريق = 6
      case 4:
        return 8;  // 2 فئات لكل فريق = 8
      case 5:
        return 10; // 2 فئات لكل فريق = 10
      default:
        console.warn('عدد فرق غير معروف:', teamCount);
        return 6;
    }
  };

  const getCategoriesPerTeam = () => {
    const maxCategories = getMaxCategories(gameData.teams.length);
    const categoriesPerTeam = Math.floor(maxCategories / gameData.teams.length);
    return categoriesPerTeam;
  };

  const getProgressBarWidth = () => {
    const maxCategories = getMaxCategories(gameData.teams.length);
    return (selectedCategories.length / maxCategories) * 100;
  };

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const data = await StorageService.getCurrentGame();
        if (data) {
          console.log('Loaded game data:', {
            teams: data.teams,
            teamCount: data.teams.length,
            maxCategories: getMaxCategories(data.teams.length)
          });
          setGameData(data);
          // حساب عدد الفئات المطلوبة بناءً على عدد الفرق
          console.log('Calculated maxCategories:', getMaxCategories(data.teams.length));
        } else {
          console.error('No game data found');
          Alert.alert('خطأ', 'لم يتم العثور على بيانات اللعبة');
          router.back();
        }
      } catch (error) {
        console.error('Error loading game data:', error);
        Alert.alert('خطأ', 'حدث خطأ في تحميل بيانات اللعبة');
        router.back();
      }
    };
    
    loadGameData();
  }, []);

  // تنظيم الفئات في مجموعات
  const categoryGroups = {
    'معارف دينية': ['إسلامي', 'قرآن', 'الرسول والصحابة', 'غزوات وفتوحات', 'ديانات'],
    'علوم وطبيعة': ['فيزياء', 'كيمياء', 'فلك', 'نباتات', 'علوم', 'حيوانات'],
    'معارف عامة': ['معلومات عامة', 'اختراعات', 'مكتشفون', 'أوائل', 'تكنولوجيا', 'جوائز'],
    'تاريخ وجغرافيا': ['تاريخ', 'جغرافيا', 'حضارات', 'دول ومعالم', 'عواصم', 'معارك وحروب', 'أمراء وحكام'],
    'فنون وأدب': ['فنون', 'شعر وأدب', 'من القائل', 'لغات ولهجات'],
    'رياضة': ['رياضة', 'كرة قدم'],
    'متنوعات': ['عملات', 'معاني', 'ألقاب', 'شخصيات', 'فلسفة'],
    'ترفيه': ['ون بيس', 'إنمي', 'ألعاب السولز', 'ميتل غير', 'ألعاب الفيديو', 'بوسترات ألعاب', 'فيديو'],
    'اختبار': ['test']
  };

  // تجميع كل الفئات في مصفوفة واحدة
  const categories = Object.values(categoryGroups).reduce((acc, curr) => [...acc, ...curr], []);

  const checkCategoryAvailability = async (category) => {
    try {
      const availability = await StorageService.checkCategoryAvailability(category);
      
      // التحقق من وجود أسئلة كافية لكل مستوى صعوبة
      if (availability.byDifficulty) {
        const minQuestionsNeeded = 2; // الحد الأدنى المطلوب لكل مستوى
        const difficulties = ['سهل', 'متوسط', 'صعب'];
        
        for (const difficulty of difficulties) {
          if ((availability.byDifficulty[difficulty] || 0) < minQuestionsNeeded) {
            Alert.alert(
              'تنبيه',
              `لا توجد أسئلة كافية في فئة "${category}" للمستوى ${difficulty}\nالحد الأدنى المطلوب: ${minQuestionsNeeded} أسئلة`,
              [{ text: 'حسناً', style: 'default' }]
            );
            return false;
          }
        }
      }
      
      if (availability.availableQuestions === 0) {
        Alert.alert(
          'تنبيه',
          `لا توجد أسئلة متوفرة في فئة "${category}"`,
          [{ text: 'حسناً', style: 'default' }]
        );
        return false;  // منع اختيار الفئة
      }
      
      if (availability.needsNewCycle) {
        Alert.alert(
          'تنبيه',
          `تم استخدام جميع أسئلة فئة "${category}" في هذه الدورة. سيتم بدء دورة جديدة.`,
          [{ text: 'حسناً', style: 'default' }]
        );
      } else if (availability.availableQuestions < 9) { // زيادة الحد الأدنى المطلوب
        Alert.alert(
          'تحذير',
          `باقي ${availability.availableQuestions} أسئلة فقط في فئة "${category}"\nقد لا تكون كافية لجميع المستويات`,
          [{ text: 'حسناً', style: 'default' }]
        );
        return false; // منع اختيار الفئة إذا كان عدد الأسئلة غير كافٍ
      }
      return true;  // السماح باختيار الفئة
    } catch (error) {
      console.error('خطأ في فحص توفر الأسئلة:', error);
      Alert.alert(
        'خطأ',
        'حدث خطأ أثناء فحص توفر الأسئلة',
        [{ text: 'حسناً', style: 'default' }]
      );
      return false;  // منع اختيار الفئة في حالة الخطأ
    }
  };

  const toggleCategory = async (category) => {
    console.log('Current selected categories:', selectedCategories.length);
    console.log('Max categories allowed:', getMaxCategories(gameData.teams.length));
    console.log('Teams count:', gameData.teams.length);

    setHistory(prev => [...prev, selectedCategories]);
    setSelectedCategories(prev => {
      const index = prev.indexOf(category);
      if (index > -1) {
        const newOrder = { ...selectedOrder };
        delete newOrder[category];
        setSelectedOrder(newOrder);
        return prev.filter(cat => cat !== category);
      } else if (prev.length < getMaxCategories(gameData.teams.length)) {
        setSelectedOrder(prev => ({
          ...prev,
          [category]: Object.keys(prev).length + 1
        }));
        return [...prev, category];
      }
      return prev;
    });
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setSelectedCategories(prevState);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleStart = async () => {
    if (selectedCategories.length === getMaxCategories(gameData.teams.length)) {
      try {
        setLoading(true);
        
        if (!currentUser) {
          Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً');
          return;
        }
        
        // التحقق من توفر الرصيد وخصمه
        const creditResult = await CreditsService.consumeCreditForGame(currentUser.uid);
        
        if (!creditResult.success) {
          Alert.alert('رصيد غير كافي', creditResult.message, [
            { text: 'شراء ألعاب', onPress: () => router.push('/purchase') },
            { text: 'إلغاء', style: 'cancel' }
          ]);
          return;
        }
        
        console.log('✅ Credit deducted successfully');
        
        // استخدام GameService لتهيئة اللعبة
        const updatedGameData = await GameService.gameState.initialize({
          ...gameData,
          categories: selectedCategories,
          isNewGame: true // ✓ علم: هذه لعبة جديدة من الشاشة الرئيسية
        });

        console.log('✅ Game data initialized', { isNewGame: true });
        
        await StorageService.saveCurrentGame(updatedGameData);
        
        console.log('✅ Game data saved, navigating to game...');
        
        // الانتقال مباشرة للعبة
        setLoading(false);
        setTimeout(() => {
          router.push('/game');
        }, 100);
      } catch (error) {
        console.error('❌ خطأ في تهيئة الجولة:', error);
        setLoading(false);
        Alert.alert('خطأ', error.message || 'حدث خطأ في تهيئة الجولة');
      }
    } else {
      Alert.alert('تنبيه', `الرجاء اختيار ${getMaxCategories(gameData.teams.length)} فئات`);
    }
  };

  const handleLongPress = (category) => {
    Alert.alert(
      category,
      'هل تريد معرفة المزيد عن هذه الفئة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'عرض التفاصيل', 
          onPress: () => showCategoryDetails(category)
        }
      ]
    );
  };

  const showCategoryDetails = async (category) => {
    const availability = await StorageService.checkCategoryAvailability(category);
    Alert.alert(
      category,
      `عدد الأسئلة المتاحة: ${availability.availableQuestions}\nمستويات الصعوبة: سهل، متوسط، صعب`
    );
  };

  // إضافة فحص لوجود البيانات
  if (!gameData) {
    return (
      <BackgroundPattern>
        <View style={staticStyles.loadingContainer}>
          <Text>جاري تحميل البيانات...</Text>
        </View>
      </BackgroundPattern>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* الخلفية الزرقاء الغامقة مع نمط شبكة متحرك جديد - تغطي كل الشاشة */}
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
        
        {/* نمط الخلفية - FlickeringGrid للثيم الفاتح، SquaresBackground للثيم الداكن */}
        <BackgroundSelector
          lightConfig={{
            squareSize: 4,
            gridGap: 6,
            flickerChance: 0.3,
            color: 'rgb(59, 130, 246)',
            maxOpacity: 0.35,
            animationSpeed: 'medium',
          }}
          darkConfig={{
            direction: 'right',
            speed: 1,
            borderColor: '#404040',
            squareSize: 40,
            hoverFillColor: '#222',
          }}
        />
      </View>
      
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[staticStyles.container, { position: 'relative', zIndex: 2 }]}>
        <ScrollView 
          contentContainerStyle={[staticStyles.gridContainer, { paddingBottom: 80 }]}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: 'transparent' }}
        >
          <ContainerBackground
            style={[
              staticStyles.categoriesContainer,
              dynamicStyles.categoriesContainer,
              { 
                backgroundColor: theme.colors.background.card,
                borderColor: theme.colors.border.primary,
                borderWidth: 2,
                elevation: 20,
                shadowColor: theme.colors.border.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 15,
                width: '90%',
                alignSelf: 'center',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 0,
                height: responsiveStyles.isLandscape ? '45%' : '38%',
              }
            ]}
          >
            {/* المحتوى - ScrollView داخل حاوية ثابتة */}
            <ScrollView 
              style={{ position: 'relative', zIndex: 1, width: '100%', flex: 1 }}
              contentContainerStyle={{ 
                alignItems: 'center',
                paddingVertical: SPACING.md,
                paddingHorizontal: SPACING.md,
              }}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
            >
            {/* عرض الفئات مقسمة حسب المجموعات */}
            {Object.entries(categoryGroups).map(([groupName, groupCategories]) => (
              <View key={groupName} style={styles.categoryGroupContainer}>
                <View style={styles.groupHeaderContainer}>
                  <View style={[styles.headerLineContainer, { backgroundColor: `${theme.colors.border}40` }]}>
                    <View style={[styles.headerLine, { backgroundColor: `${theme.colors.border}80` }]} />
                  </View>
                  <LinearGradient
                    colors={theme.colors.gradient.primary}
                    style={styles.groupHeaderGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.groupHeaderText}>{groupName}</Text>
                  </LinearGradient>
                  <View style={[styles.headerLineContainer, { backgroundColor: `${theme.colors.border}40` }]}>
                    <View style={[styles.headerLine, { backgroundColor: `${theme.colors.border}80` }]} />
                  </View>
                </View>
                <View style={styles.groupCategoriesContainer}>
                  {groupCategories.map((category) => (
                    <View key={category} style={staticStyles.categoryItem}>
                      <CategoryCard
                        key={category}
                        category={category}
                        isSelected={selectedCategories.includes(category)}
                        order={selectedOrder[category]}
                        onPress={async () => {
                          const isAvailable = await checkCategoryAvailability(category);
                          if (isAvailable) {
                            toggleCategory(category);
                          }
                        }}
                        onLongPress={() => handleLongPress(category)}
                        theme={theme}
                        image={getCategoryImage(category)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            ))}
            </ScrollView>
          </ContainerBackground>
        </ScrollView>

        <View style={[
          staticStyles.progressContainer,
          { 
            backgroundColor: `${theme.colors.background.surface}E6`,
            borderTopColor: theme.colors.border?.primary || theme.colors.border,
          }
        ]}>
          <View style={staticStyles.progressContent}>
            {/* العبارات التعريفية في الجهة اليمنى */}
            <View style={staticStyles.progressInfoContainer}>
              <Text style={[
                staticStyles.progressText,
                { color: theme.colors.text.secondary }
              ]}>
                {`${selectedCategories.length} من ${getMaxCategories(gameData.teams.length)} فئة`}
              </Text>
              <Text style={[
                staticStyles.teamInfo,
                { color: theme.colors.text.secondary }
              ]}>
                {`${getCategoriesPerTeam()} فئات لكل فريق`}
              </Text>
            </View>

            {/* حاوية الفئات في المنتصف */}
            <View style={staticStyles.middleContainer}>
              {/* عرض الفئات المحددة مع صورها في المنتصف */}
              <View style={staticStyles.selectedCategoriesWrapper}>
                {selectedCategories.length > 0 && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={staticStyles.selectedCategoriesContent}
                  >
                    {selectedCategories.map((category, index) => (
                      <TouchableOpacity 
                        key={category} 
                        style={staticStyles.selectedCategoryItem}
                        onPress={() => toggleCategory(category)}
                      >
                        <Image 
                          source={getCategoryImage(category)} 
                          style={staticStyles.selectedCategoryImage} 
                          resizeMode="cover"
                        />
                        <View style={[
                          staticStyles.orderBadge,
                          { backgroundColor: theme.colors.primary }
                        ]}>
                          <Text style={staticStyles.orderText}>{selectedOrder[category]}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>

            {/* زر بدء اللعب على الطرف الأيسر */}
            <TouchableOpacity
              style={[
                staticStyles.startButton,
                { opacity: selectedCategories.length < getMaxCategories(gameData.teams.length) || loading ? 0.7 : 1 }
              ]}
              onPress={handleStart}
              disabled={selectedCategories.length < getMaxCategories(gameData.teams.length) || loading}
            >
              <LinearGradient
                colors={theme.colors.gradient.primary}
                style={staticStyles.startButtonContent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={staticStyles.startButtonText}>
                    بدء اللعب
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* شريط التقدم في الأسفل */}
          <View style={staticStyles.progressBarContainer}>
            <LinearGradient
              colors={theme.colors.gradient.primary}
              style={[
                staticStyles.progressBar,
                { width: `${getProgressBarWidth()}%` }
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryGroupContainer: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.lg,
    width: '98%',
    alignSelf: 'center',
  },
  groupHeaderContainer: {
    marginBottom: SPACING.md,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  groupHeaderGradient: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    width: 'auto',
    minWidth: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
  },
  groupHeaderText: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.bold,
    fontFamily: 'ReadexPro_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  groupCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 0,
    marginBottom: SPACING.md,
  },
  headerLine: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: SPACING.sm,
  },
  headerLineContainer: {
    flex: 1,
    flexDirection: 'column',
    height: 12,
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderRadius: 4,
  },
});

export default GameSetup;