import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, Image, Platform } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { GameService } from '../services/gameService';
import { TeamsHeader } from '../components/TeamsHeader';
import BackgroundPattern from '../components/BackgroundPattern';
import BackgroundSelector from '../components/BackgroundSelector';
import StorageService from '../services/storageService';
import PentaPointsService from '../services/pentaPointsService';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { SPACING, FONTS } from '../styles/theme';
import categoryImages from '../assets/categories';
import QuestionDetailsModal from '../components/QuestionDetailsModal';
import SavedGamesService from '../services/savedGamesService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrientation, useIsLandscape } from '../hooks/useOrientation';

const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
    marginHorizontal: SPACING.xxs,
    width: '98%',
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    padding: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
    marginRight: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 1,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    letterSpacing: 0,
  },
  questionsContainer: {
    padding: 8,
    alignItems: 'center',
    width: '100%',
    borderRadius: 2,
    margin: 0,
    flex: 1,
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
    gap: 4,
    padding: 4,
    borderRadius: 2,
    flexWrap: 'wrap',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  errorText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
  questionButton: {
    width: 60,
    height: 50,
    margin: 4,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionButtonGradient: {
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
});

const QuestionButton = ({ difficulty, isUsed, points, onPress, theme, categories, isLandscape, buttonSize = 50, buttonFontSize = 17 }) => {
  const difficultyColors = {
    'سهل': { bg: '#E8F5E9', border: '#2E7D32', text: '#1B5E20' },
    'متوسط': { bg: '#FFF3E0', border: '#E65100', text: '#BF360C' },
    'صعب': { bg: '#FFEBEE', border: '#C62828', text: '#B71C1C' },  
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: buttonSize,
        height: buttonSize,
        backgroundColor: isUsed ? '#F5F5F5' : difficultyColors[difficulty].bg,
        borderColor: isUsed ? '#D0D0D0' : difficultyColors[difficulty].border,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        elevation: isUsed ? 0 : 4,
        shadowColor: difficultyColors[difficulty].border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isUsed ? 0 : 0.35,
        shadowRadius: 4,
        opacity: isUsed ? 0.6 : 1,
      }}
    >
      <Text
        style={{
          color: isUsed ? '#B8B8B8' : difficultyColors[difficulty].text,
          fontSize: buttonFontSize,
          fontWeight: '800',
          fontFamily: 'ReadexPro_700Bold',
        }}
      >
        {points}
      </Text>
    </TouchableOpacity>
  );
};

const CategoryCard = ({ category, questions = {}, onQuestionPress, style, theme, categories, isLandscape }) => {
  const difficultyOrder = ['سهل', 'متوسط', 'صعب'];
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  if (!isLandscape) {
    // الوضع الرأسي: بطاقات أفقية - متجاوبة تماماً مع الحاوية
    const numCategories = categories.length;
    const teamsHeaderWidth = 120;
    const availableWidth = screenWidth - teamsHeaderWidth - 50;
    const availableHeight = (screenHeight - 60) / numCategories;
    
    // تحديد كثافة الفئات لضبط المسافات
    const isHighDensity = numCategories > 6;
    const isUltraHighDensity = numCategories > 8;

    // مسافات حول البطاقات - تقليل الهوامش عند زيادة عدد الفئات
    const outerPadding = isUltraHighDensity ? 2 : (isHighDensity ? 4 : 8);
    const innerCardPadding = isUltraHighDensity ? 2 : (isHighDensity ? 4 : 6);
    
    // المساحة المتاحة بعد الهوامش الخارجية
    const cardContainerWidth = availableWidth - (outerPadding * 2);
    const cardContainerHeight = availableHeight - (outerPadding * 2);
    
    // حساب حجم البطاقة مع المسافات بينها
    const cardHeight = cardContainerHeight;
    const cardWidth = cardContainerWidth;
    
    // حساب المساحة المتاحة داخل البطاقة
    const cardInnerWidth = cardWidth - (innerCardPadding * 2);
    const cardInnerHeight = cardHeight - (innerCardPadding * 2);
    
    // توزيع المساحة: عنوان متغير الارتفاع حسب الكثافة
    const headerHeight = isUltraHighDensity ? 20 : (isHighDensity ? 24 : 28);
    const headerMarginBottom = isUltraHighDensity ? 1 : 2;
    const headerFontSize = isUltraHighDensity ? 10 : 12;

    const buttonsSpaceHeight = cardInnerHeight - headerHeight - (headerMarginBottom * 2);
    const buttonsSpaceWidth = cardInnerWidth;
    
    // حساب حجم الزر
    // لدينا 6 أزرار في صف واحد (2 سهل، 2 متوسط، 2 صعب)
    const buttonsPerRow = 6;
    const numRows = 1;
    
    // حساب الحجم بناءً على العرض والارتفاع المتاحين
    const maxButtonWidth = (buttonsSpaceWidth / buttonsPerRow) - 2; // 2px gap
    const maxButtonHeight = (buttonsSpaceHeight / numRows) - 2; // 2px gap
    
    const buttonSize = Math.min(maxButtonWidth, maxButtonHeight, 50);
    const buttonFontSize = Math.min(buttonSize * 0.36, 13);
    
    return (
      <View style={[{
        borderRadius: 12,
        padding: 0,
        shadowColor: theme.colors.primary || '#2E5DB8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 3,
        borderColor: theme.colors.primary || '#2E5DB8',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // تغيير من center إلى flex-start
        height: cardHeight,
        width: cardWidth,
        marginVertical: outerPadding,
        marginHorizontal: outerPadding,
        overflow: 'hidden',
        position: 'relative',
      }, style]}>
        {/* الصورة كخلفية تغطي كل البطاقة */}
        <Image 
          source={categoryImages[category]} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
          resizeMode="cover"
        />
        
        {/* طبقة داكنة نصف شفافة فوق الصورة */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          zIndex: 1,
        }} />

        {/* عنوان الفئة */}
        <View style={{
          width: '100%',
          height: headerHeight, // تحديد ارتفاع ثابت
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          opacity: 0.9,
          marginBottom: headerMarginBottom,
        }}>
          <Text style={{
            color: '#FFFFFF',
            fontSize: headerFontSize,
            fontWeight: 'bold',
            fontFamily: 'ReadexPro_700Bold',
            textAlign: 'center',
          }} numberOfLines={1}>
            {category}
          </Text>
        </View>

        {/* أزرار الأسئلة - صف واحد يحتوي على جميع الأسئلة */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          flex: 1,
          width: '100%',
          zIndex: 2,
          position: 'relative',
        }}>
          {/* مجموعة سهل */}
          <View style={{
            flexDirection: 'row',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {(() => {
              const easyQuestions = questions['سهل'] || [];
              return [0, 1].map((btnIndex) => {
                const question = easyQuestions[btnIndex];
                return question ? (
                  <QuestionButton
                    key={`${category}-سهل-${btnIndex}`}
                    difficulty="سهل"
                    isUsed={question?.isUsed || false}
                    points={question?.points || 10}
                    onPress={() => onQuestionPress?.(category, 'سهل', btnIndex)}
                    theme={theme}
                    categories={categories}
                    isLandscape={isLandscape}
                    buttonSize={buttonSize}
                    buttonFontSize={buttonFontSize}
                  />
                ) : null;
              });
            })()}
          </View>

           {/* مجموعة متوسط */}
           <View style={{
             flexDirection: 'row',
             gap: 2,
             justifyContent: 'center',
             alignItems: 'center',
           }}>
            {(() => {
              const mediumQuestions = questions['متوسط'] || [];
              return [0, 1].map((btnIndex) => {
                const question = mediumQuestions[btnIndex];
                return question ? (
                  <QuestionButton
                    key={`${category}-متوسط-${btnIndex}`}
                    difficulty="متوسط"
                    isUsed={question?.isUsed || false}
                    points={question?.points || 10}
                    onPress={() => onQuestionPress?.(category, 'متوسط', btnIndex)}
                    theme={theme}
                    categories={categories}
                    isLandscape={isLandscape}
                    buttonSize={buttonSize}
                    buttonFontSize={buttonFontSize}
                  />
                ) : null;
              });
            })()}
          </View>

          {/* مجموعة صعب */}
          <View style={{
            flexDirection: 'row',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {(() => {
              const hardQuestions = questions['صعب'] || [];
              return [0, 1].map((btnIndex) => {
                const question = hardQuestions[btnIndex];
                return question ? (
                  <QuestionButton
                    key={`${category}-صعب-${btnIndex}`}
                    difficulty="صعب"
                    isUsed={question?.isUsed || false}
                    points={question?.points || 10}
                    onPress={() => onQuestionPress?.(category, 'صعب', btnIndex)}
                    theme={theme}
                    categories={categories}
                    isLandscape={isLandscape}
                    buttonSize={buttonSize}
                    buttonFontSize={buttonFontSize}
                  />
                ) : null;
              });
            })()}
          </View>
        </View>
      </View>
    );
  }
  
  // الوضع الأفقي: بطاقات رأسية - متجاوبة تماماً مع الحاوية
  const teamsHeaderWidth = 120;
  const availableHeight = screenHeight - 60;
  const availableWidth = screenWidth - teamsHeaderWidth - 50;
  const numCategories = categories.length;
  
  // مسافات حول البطاقات
  const outerPadding = 8; // تقليل من 12 إلى 8
  const cardMarginBetween = 6; // تقليل من 10 إلى 6
  const innerCardPadding = 6; // تقليل من 8 إلى 6
  
  // المساحة المتاحة بعد الهوامش الخارجية
  const cardsContainerWidth = availableWidth - (outerPadding * 2);
  const cardsContainerHeight = availableHeight - (outerPadding * 2);
  
  // حساب حجم البطاقة - توزيع متساوي
  const cardWidth = (cardsContainerWidth - (cardMarginBetween * (numCategories - 1))) / numCategories;
  const cardHeight = cardsContainerHeight;
  
  // حساب المساحة المتاحة داخل البطاقة
  const cardInnerWidth = cardWidth - (innerCardPadding * 2);
  const cardInnerHeight = cardHeight - (innerCardPadding * 2);
  
  // توزيع المساحة العمودية - عنوان متغير الارتفاع والباقي للأزرار
  // زيادة ارتفاع العنوان للسماح بأسطر متعددة
  const headerHeight = 40; 
  const buttonsHeight = cardInnerHeight - headerHeight - 4;
  
  // لدينا 6 أزرار في عمود واحد
  const buttonSize = Math.min((buttonsHeight / 6) - 2, cardInnerWidth - 4, 45);
  const buttonFontSize = Math.min(buttonSize * 0.36, 13);

  return (
    <View style={[{
      borderRadius: 12,
      padding: 0,
      shadowColor: theme.colors.primary || '#2E5DB8',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 3,
      borderColor: theme.colors.primary || '#2E5DB8',
      alignItems: 'center',
      justifyContent: 'flex-start', // تغيير من center إلى flex-start
      width: cardWidth,
      height: cardHeight,
      marginVertical: outerPadding,
      marginHorizontal: outerPadding / 2,
      overflow: 'hidden',
      position: 'relative',
    }, style]}>
      {/* الصورة كخلفية تغطي كل البطاقة */}
      <Image 
        source={categoryImages[category]} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
        resizeMode="cover"
      />
      
      {/* طبقة داكنة نصف شفافة فوق الصورة */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        zIndex: 1,
      }} />
      
      {/* عنوان الفئة */}
      <View style={{
        width: '100%',
        height: headerHeight, // ارتفاع ثابت أكبر
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        opacity: 0.9,
        marginBottom: 2,
        paddingHorizontal: 2, // إضافة هامش داخلي للنص
      }}>
        <Text style={{
          color: '#FFFFFF',
          fontSize: 11, // تصغير الخط الافتراضي قليلاً
          fontWeight: 'bold',
          fontFamily: 'ReadexPro_700Bold',
          textAlign: 'center',
          lineHeight: 14, // ضبط ارتفاع السطر
        }} 
        numberOfLines={2} // السماح بسطرين
        adjustsFontSizeToFit={true} // تصغير الخط تلقائياً إذا لزم الأمر
        minimumFontScale={0.7} // الحد الأدنى لتصغير الخط
        >
          {category}
        </Text>
      </View>

      {/* أزرار الأسئلة - في عمود واحد */}
      <View style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1, // ملء المساحة المتبقية
        width: '100%',
        zIndex: 2,
        position: 'relative',
        gap: 2,
      }}>
        {difficultyOrder.map((difficulty) => {
          const diffQuestions = questions[difficulty] || [];
          return [0, 1].map((btnIndex) => {
            const question = diffQuestions[btnIndex];
            return question ? (
              <QuestionButton
                key={`${category}-${difficulty}-${btnIndex}`}
                difficulty={difficulty}
                isUsed={question?.isUsed || false}
                points={question?.points || 10}
                onPress={() => onQuestionPress?.(category, difficulty, btnIndex)}
                theme={theme}
                categories={categories}
                isLandscape={isLandscape}
                buttonSize={buttonSize}
                buttonFontSize={buttonFontSize}
              />
            ) : null;
          });
        }).flat()}
      </View>
    </View>
  );
};

const GameScreen = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const isLandscapeMode = useIsLandscape();
  const params = useLocalSearchParams();
  const styles = StyleSheet.create({
    ...staticStyles,
    container: {
      ...staticStyles.container,
      backgroundColor: theme.colors.background.primary,
    },
  });
  
  const [gameData, setGameData] = useState(null);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isDoublePoints, setIsDoublePoints] = useState(false);
  const [isPentaPoints, setIsPentaPoints] = useState(false); // إضافة حالة لزر مضاعفة النقاط 5 مرات
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [teams, setTeams] = useState([]);
  const [usedDoublePoints, setUsedDoublePoints] = useState({});
  const [usedPentaPoints, setUsedPentaPoints] = useState({}); // إضافة حالة لتتبع استخدام زر مضاعفة النقاط 5 مرات
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestionDetails, setSelectedQuestionDetails] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [pentaPointsEnabled, setPentaPointsEnabled] = useState(true);
  const [isNavigatingToResults, setIsNavigatingToResults] = useState(false);
  const [orientation, setOrientation] = useState('portrait');

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isLandscape = screenWidth > screenHeight;
  const isSmallScreen = screenWidth < 768;

  // الاستماع لتغيير الاتجاه
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      const newOrientation = width > height ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
    });
    
    return () => subscription?.remove();
  }, []);

  const getCategoriesPerRow = () => {
    const teamCount = teams.length;
    if (teamCount <= 3) {
      return 3; // 2-3 فرق = 6 فئات: 3 فئات في كل صف
    } else if (teamCount === 4) {
      return 4; // 4 فرق = 8 فئات: 4 فئات في كل صف
    } else {
      return 5; // 5 فرق = 10 فئات: 5 فئات في كل صف
    }
  };

  const getColumnWidth = () => {
    const padding = SPACING.xs * 2; // هامش الحاوية
    const minGap = 2; // تقليل المسافة بين البطاقات
    const availableWidth = (screenWidth * 0.75) - padding; // تناسب عرض منطقة الفئات (75% من عرض الشاشة)
    
    // استخدام دالة getCategoriesPerRow لتحديد عدد الفئات في كل صف
    const itemsPerRow = getCategoriesPerRow();
    
    // حساب العرض المتاح مع الهوامش
    const totalGapWidth = minGap * (itemsPerRow - 1);
    const calculatedWidth = (availableWidth - totalGapWidth) / itemsPerRow;
    
    return Math.max(calculatedWidth, 80); // تحديد حد أدنى للعرض
  };

  const updateCurrentTeam = useCallback(async (newIndex) => {
    try {
      const gameData = await StorageService.getCurrentGame();
      if (!gameData?.teams?.length) return;
      
      setCurrentTeamIndex(newIndex);
      gameData.currentTeamIndex = newIndex;
      await StorageService.saveCurrentGame(gameData);
      await loadGameData();
    } catch (error) {
      console.error('Error updating team:', error);
    }
  }, []);

  const moveToNextTeam = useCallback(async () => {
    try {
      const gameData = await StorageService.getCurrentGame();
      if (!gameData?.teams?.length) return;
      
      const currentIndex = gameData.currentTeamIndex || 0;
      const nextTeamIndex = (currentIndex + 1) % gameData.teams.length;

      await updateCurrentTeam(nextTeamIndex);
    } catch (error) {
      console.error('Error moving to next team:', error);
    }
  }, [updateCurrentTeam]);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        setIsLoading(true);
        
        // التحقق من وجود بيانات لعبة ممررة (من استكمال أو إعادة تشغيل)
        if (params.gameData) {
          console.log('Loading game data from params...');
          const parsedGameData = JSON.parse(params.gameData);
          
          // حفظ البيانات في التخزين المحلي
          await StorageService.saveCurrentGame(parsedGameData);
          
          setGameData(parsedGameData);
          setCurrentTeamIndex(parsedGameData.currentTeamIndex || 0);
          setScores(parsedGameData.scores);
          setUsedDoublePoints(parsedGameData.usedDoublePoints || {});
          setUsedPentaPoints(parsedGameData.usedPentaPoints || {});
          
          checkAllQuestionsUsed(parsedGameData);
          setIsLoading(false);
          return;
        }

        const data = await StorageService.getCurrentGame();
        if (data) {
          setGameData(data);
          setCurrentTeamIndex(data.currentTeamIndex || 0);
          setScores(data.scores);
          data.usedDoublePoints = data.usedDoublePoints || {};
          data.usedPentaPoints = data.usedPentaPoints || {}; // تهيئة حالة استخدام زر مضاعفة النقاط 5 مرات
          setGameData(data);
          setUsedDoublePoints(data.usedDoublePoints);
          setUsedPentaPoints(data.usedPentaPoints); // تحديث حالة استخدام زر مضاعفة النقاط 5 مرات
      
          // التحقق مما إذا كانت جميع الأسئلة قد استخدمت
          checkAllQuestionsUsed(data);
      
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading game data:', error.message);
        Alert.alert('', '');
      }
    };

    loadGameData();
  }, [params.gameData]);

  useEffect(() => {
    if (params.shouldRefresh) {
      const now = new Date().getTime();
      if (now - lastRefreshTime > 500) {
        setLastRefreshTime(now);
        console.log('تحديث بيانات اللعبة بعد العودة من شاشة السؤال');
        
        const refreshGameData = async () => {
          await loadGameData();
          
          // التحقق من استخدام جميع الأسئلة بعد تحديث بيانات اللعبة
          const currentGameData = await StorageService.getCurrentGame();
          if (currentGameData && currentGameData.questions) {
            console.log('التحقق من استخدام جميع الأسئلة بعد تحديث بيانات اللعبة');
            checkAllQuestionsUsed(currentGameData);
          }
          
          setTimeout(() => {
            moveToNextTeam();
          }, 100);
        };
        
        refreshGameData();
      }
    }
  }, [params.shouldRefresh, moveToNextTeam, lastRefreshTime]);

  useFocusEffect(
    React.useCallback(() => {
      const loadAndCheck = async () => {
        await loadGameData();
        
        // التحقق من استخدام جميع الأسئلة بعد العودة من شاشة السؤال
        if (gameData && gameData.questions) {
          checkAllQuestionsUsed(gameData);
        }
        
        setIsLoading(false);
      };
      
      loadAndCheck();
    }, [])
  );

  const parseTeams = (teamsData) => {
    try {
      if (!teamsData) return [];
      const parsed = Array.isArray(teamsData) ? teamsData : JSON.parse(teamsData);
      console.log('Parsed teams in game:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error parsing teams:', error);
      return [];
    }
  };

  const loadGameData = async () => {
    try {
      setIsLoading(true);
      const data = await StorageService.getCurrentGame();
      
      console.log('Loaded game data:', {
        categories: data.categories,
        questions: data.questions,
        teams: data.teams
      });

      if (!data) {
        throw new Error('');
      }

      if (!data.questions || !data.categories || !data.teams) {
        throw new Error('');
      }

      const savedTeams = parseTeams(data.teams);
      setTeams(savedTeams);
      setCurrentTeamIndex(data.currentTeamIndex || 0);
      setScores(data.scores);
      data.usedDoublePoints = data.usedDoublePoints || {};
      data.usedPentaPoints = data.usedPentaPoints || {}; // تهيئة حالة استخدام زر مضاعفة النقاط 5 مرات
      setGameData(data);
      setUsedDoublePoints(data.usedDoublePoints);
      setUsedPentaPoints(data.usedPentaPoints); // تحديث حالة استخدام زر مضاعفة النقاط 5 مرات
      
      // التحقق مما إذا كانت جميع الأسئلة قد استخدمت
      checkAllQuestionsUsed(data);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading game data:', error.message);
      Alert.alert('', '');
    }
  };

  const handleDoublePointsChange = async (newValue) => {
    const currentTeam = gameData.teams[gameData.currentTeamIndex];
    
    if (newValue && usedDoublePoints[currentTeam]) {
      Alert.alert(
        'تم استخدام المضاعفة',
        'لقد استخدمت بالفعل مضاعفة النقاط في هذه الجولة'
      );
      return;
    }
    
    try {
      setIsDoublePoints(newValue);
      // إذا تم تفعيل مضاعفة النقاط، نقوم بإلغاء تفعيل مضاعفة النقاط 5 مرات
      if (newValue) {
        setIsPentaPoints(false);
      }
    } catch (error) {
      console.error('Error updating double points:', error);
      Alert.alert('', '');
    }
  };

  // إضافة وظيفة جديدة للتعامل مع زر مضاعفة النقاط 5 مرات
  const handlePentaPointsChange = (newValue) => {
    if (!pentaPointsEnabled) return; // عدم السماح بالتفعيل إذا كان النظام معطلاً
    
    const currentTeam = gameData.teams[gameData.currentTeamIndex];
    
    // التحقق مما إذا كان الفريق قد استخدم الزر من قبل
    if (newValue && usedPentaPoints[currentTeam]) {
      Alert.alert(
        'تم استخدام المضاعفة',
        'لقد استخدمت بالفعل مضاعفة النقاط 5 مرات في هذه الجولة'
      );
      return;
    }
    
    // التحقق مما إذا كان الفريق هو صاحب أقل نقاط
    if (newValue && !isLowestScoringTeam(currentTeam)) {
      Alert.alert(
        'غير مسموح',
        'فقط الفريق صاحب أقل نقاط يمكنه استخدام زر مضاعفة النقاط 5 مرات'
      );
      return;
    }
    
    try {
      setIsPentaPoints(newValue);
      // إذا تم تفعيل مضاعفة النقاط 5 مرات، نقوم بإلغاء تفعيل مضاعفة النقاط العادية
      if (newValue) {
        setIsDoublePoints(false);
      }
    } catch (error) {
      console.error('Error updating penta points:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحديث حالة مضاعفة النقاط');
    }
  };
  
  // وظيفة للتحقق مما إذا كان الفريق هو صاحب أقل نقاط
  const isLowestScoringTeam = (teamName) => {
    if (!gameData || !gameData.scores || !gameData.teams || gameData.teams.length === 0) {
      return false;
    }
    
    // الحصول على نقاط الفريق الحالي
    const currentTeamScore = gameData.scores[teamName] || 0;
    
    // التحقق مما إذا كان هناك أي فريق آخر لديه نقاط أقل
    for (const team of gameData.teams) {
      if (team !== teamName) {
        const teamScore = gameData.scores[team] || 0;
        if (teamScore < currentTeamScore) {
          return false; // هناك فريق آخر لديه نقاط أقل
        }
      }
    }
    
    // في حالة التعادل في أقل نقاط، نسمح لجميع الفرق المتعادلة باستخدام الزر
    const lowestScore = Math.min(...gameData.teams.map(team => gameData.scores[team] || 0));
    return currentTeamScore === lowestScore;
  };

  const showQuestionDetails = (question, category, difficulty) => {
    setSelectedQuestionDetails({
      question: question.question,
      answer: question.answer,
      category,
      difficulty,
      answeredBy: question.answeredBy,
      wasDoublePoints: question.wasDoublePoints,
      earnedPoints: question.earnedPoints,
      answeredAt: question.answeredAt
    });
    setModalVisible(true);
  };

  const handleQuestionPress = async (category, difficulty, questionIndex) => {
    const question = gameData.questions[category][difficulty][questionIndex];
    const currentTeam = gameData.teams[gameData.currentTeamIndex];
    
    if (!question) {
      console.error('لم يتم العثور على السؤال', {
        category,
        difficulty,
        questionIndex
      });
      return;
    }

    if (question.isUsed) {
      showQuestionDetails(question, category, difficulty);
      return;
    }

    const questionData = {
      ...question,
      category,
      difficulty,
      index: questionIndex,
      teamName: currentTeam,
      isDoublePoints,
      isPentaPoints, // إضافة حالة مضاعفة النقاط 5 مرات للبيانات المرسلة
      points: question.points || 50
    };

    if (!questionData.question || !questionData.answer) {
      console.error('السؤال أو الإجابة غير موجودة', questionData);
      return;
    }

    try {
      let updatedGameData = { ...gameData };
      
      if (isDoublePoints) {
        updatedGameData.usedDoublePoints = {
          ...gameData.usedDoublePoints,
          [currentTeam]: true
        };
      }
      
      if (isPentaPoints) {
        updatedGameData = PentaPointsService.updateUsedPentaPoints(updatedGameData, currentTeam);
      }
      
      await StorageService.saveCurrentGame(updatedGameData);
      setGameData(updatedGameData);
      setUsedDoublePoints(updatedGameData.usedDoublePoints);
      setUsedPentaPoints(updatedGameData.usedPentaPoints);

      router.push({
        pathname: '/game/question',
        params: {
          questionData: JSON.stringify(questionData)
        }
      });
      
      setIsDoublePoints(false);
      setIsPentaPoints(false); // إعادة ضبط حالة مضاعفة النقاط 5 مرات
    } catch (error) {
      console.error('Error navigating to question:', error);
      Alert.alert('', '');
    }
  };

  const handleEndRound = async () => {
    try {
      console.log('بدء تنفيذ دالة إنهاء الجولة...');
      
      // الحصول على أحدث بيانات اللعبة من التخزين
      const latestGameData = await StorageService.getCurrentGame();
      
      if (!latestGameData) {
        console.error('لا توجد بيانات لعبة متاحة');
        return;
      }
      
      if (!latestGameData.teams || !latestGameData.scores || !latestGameData.questions) {
        console.error('بيانات اللعبة غير مكتملة', {
          hasTeams: !!latestGameData.teams,
          hasScores: !!latestGameData.scores,
          hasQuestions: !!latestGameData.questions
        });
        return;
      }

      console.log('تم الحصول على بيانات اللعبة بنجاح، جاري إعداد الإحصائيات...');

      const statistics = {
        totalQuestions: 0,
        answeredQuestions: 0,
        doublePointsUsed: 0,
        categoryStats: {}
      };

      // بناء categoryStats بالمعلومات الكاملة لكل فريق
      const categoryStats = {};

      Object.entries(latestGameData.questions).forEach(([category, difficulties]) => {
        statistics.categoryStats[category] = {
          total: 0,
          answered: 0
        };
        
        // تهيئة إحصائيات الفئة لكل فريق
        latestGameData.teams.forEach(team => {
          if (!categoryStats[team]) {
            categoryStats[team] = {};
          }
          categoryStats[team][category] = {
            points: 0,
            correct: 0
          };
        });
        
        Object.values(difficulties).forEach(questions => {
          questions.forEach(question => {
            statistics.totalQuestions++;
            statistics.categoryStats[category].total++;
            
            if (question.isUsed) {
              statistics.answeredQuestions++;
              statistics.categoryStats[category].answered++;
              
              // إضافة النقاط والإجابات الصحيحة لكل فريق
              if (question.answeredBy) {
                categoryStats[question.answeredBy][category].correct += 1;
                categoryStats[question.answeredBy][category].points += question.earnedPoints || 0;
              }
              
              if (question.wasDoublePoints) {
                statistics.doublePointsUsed++;
              }
            }
          });
        });
      });

      console.log('تم إعداد الإحصائيات بنجاح، جاري تحديد الفائز...');

      // تحديد الفائز بناءً على النقاط
      const sortedTeams = Object.entries(latestGameData.scores).sort(([,a], [,b]) => b - a);
      const winner = sortedTeams.length > 0 ? sortedTeams[0][0] : '';

      const gameResults = {
        // بيانات اللعبة الأساسية
        roundName: latestGameData.roundName || 'جولة بدون اسم',
        teams: latestGameData.teams,
        scores: latestGameData.scores,
        categories: latestGameData.categories,
        selectedQuestions: latestGameData.selectedQuestions || [],
        statistics: statistics,
        categoryStats: categoryStats,
        winner: winner,
        timestamp: new Date().toISOString(),
        
        // ✓ البيانات المهمة لتحديد نوع اللعبة
        questions: latestGameData.questions,
        isNewGame: latestGameData.isNewGame || false, // ✓ علم: لعبة جديدة من الشاشة الرئيسية
        isContinuing: latestGameData.isContinuing || false,
        isReplaying: latestGameData.isReplaying || false,
        savedGameId: latestGameData.savedGameId || null,
        currentTeamIndex: latestGameData.currentTeamIndex || 0,
        currentCategoryIndex: latestGameData.currentCategoryIndex || 0
      };

      console.log('تم إعداد نتائج اللعبة بنجاح', {
        isNewGame: gameResults.isNewGame,
        isContinuing: gameResults.isContinuing,
        isReplaying: gameResults.isReplaying,
        savedGameId: gameResults.savedGameId
      });
      
      await StorageService.saveGameToHistory(gameResults);
      
      // حفظ اللعبة في "ألعابي" إذا كان المستخدم مسجلاً للدخول
      if (currentUser?.uid) {
        try {
          console.log('جاري حفظ اللعبة في ألعابي للمستخدم:', currentUser.uid);
          
          // التحقق من اكتمال اللعبة
          const isGameCompleted = statistics.answeredQuestions === statistics.totalQuestions;
          
          // إعداد بيانات اللعبة للحفظ
          const gameToSave = {
            ...gameResults,
            isCompleted: isGameCompleted, // تحديد حالة اكتمال اللعبة بناءً على الأسئلة المجابة
            updatedAt: new Date().toISOString()
          };
          
          // إذا كانت لعبة مستكملة، نقوم بتحديثها بدلاً من إنشاء واحدة جديدة
          if (gameResults.isContinuing && gameResults.savedGameId) {
            console.log('تحديث لعبة موجودة:', gameResults.savedGameId);
            await SavedGamesService.updateSavedGame(gameResults.savedGameId, gameToSave);
          } else if (!gameResults.isReplaying) {
            // حفظ لعبة جديدة فقط إذا لم تكن إعادة تشغيل
            console.log('حفظ لعبة جديدة');
            await SavedGamesService.saveGame(currentUser.uid, gameToSave);
          } else {
            console.log('لعبة معاد تشغيلها، لن يتم حفظها في ألعابي');
          }
        } catch (saveError) {
          console.error('خطأ في حفظ اللعبة في ألعابي:', saveError);
          // لا نوقف العملية إذا فشل الحفظ في ألعابي، فقط نسجل الخطأ
        }
      }

      setUsedDoublePoints({});
      setUsedPentaPoints({});

      console.log('تم حفظ النتائج بنجاح، جاري الانتقال إلى شاشة النتائج...');

      router.push({
        pathname: '/round-results',
        params: {
          gameData: JSON.stringify(gameResults)
        }
      });
    } catch (error) {
      console.error('حدث خطأ أثناء إنهاء الجولة:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إنهاء الجولة، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleScoreChange = async (team, newScore) => {
    try {
      const updatedGameData = { ...gameData };
      updatedGameData.scores[team] = newScore;
      
      console.log('', {
        team,
        newScore,
        scores: updatedGameData.scores
      });
      
      await StorageService.saveCurrentGame(updatedGameData);
      setGameData(updatedGameData);
      setScores(updatedGameData.scores);
    } catch (error) {
      console.error('', error);
      Alert.alert('', '');
    }
  };

  const checkAllQuestionsUsed = (gameData) => {
    if (!gameData || !gameData.questions) {
      console.log('لا توجد بيانات لعبة أو أسئلة للتحقق منها');
      return;
    }

    console.log('التحقق من استخدام جميع الأسئلة...');
    
    let totalQuestions = 0;
    let usedQuestions = 0;
    let allQuestionsUsed = true;
    
    Object.entries(gameData.questions).forEach(([category, difficulties]) => {
      Object.values(difficulties).forEach(questions => {
        questions.forEach(question => {
          totalQuestions++;
          if (question.isUsed) {
            usedQuestions++;
          } else {
            allQuestionsUsed = false;
          }
        });
      });
    });
    
    console.log(`إجمالي الأسئلة: ${totalQuestions}, الأسئلة المستخدمة: ${usedQuestions}, جميع الأسئلة مستخدمة: ${allQuestionsUsed}`);
    
    if (allQuestionsUsed && totalQuestions > 0) {
      console.log('جميع الأسئلة مستخدمة، جاري الانتقال إلى شاشة النتائج...');
      
      // استخدام setTimeout لتجنب مشاكل التزامن
      // وتأكد من أن handleEndRound لن يتم استدعاؤه أكثر من مرة
      if (!isNavigatingToResults) {
        setIsNavigatingToResults(true);
        setTimeout(() => {
          handleEndRound();
        }, 500);
      }
    }
  };

  if (isLoading) {
    return (
      <BackgroundSelector>
        <View style={[staticStyles.container, staticStyles.loadingContainer]}>
          <Text style={[
            staticStyles.loadingText,
            { color: theme.colors.text.primary, fontFamily: 'ReadexPro_700Bold' }
          ]}>
            
          </Text>
        </View>
      </BackgroundSelector>
    );
  }

  if (!teams.length) {
    return (
      <BackgroundSelector>
        <View style={[staticStyles.container, staticStyles.loadingContainer]}>
          <Text style={[
            staticStyles.errorText,
            { color: theme.colors.error, fontFamily: 'ReadexPro_700Bold' }
          ]}>
            
          </Text>
        </View>
      </BackgroundSelector>
    );
  }

  return (
    <BackgroundSelector>
      
      <Stack.Screen 
        options={{ 
          headerShown: false,
          animation: 'none'
        }} 
      />
      <View style={[staticStyles.container, { backgroundColor: 'transparent', zIndex: 1, flexDirection: 'row-reverse', minHeight: screenHeight }]}>
        {/* التيم هيدر */}
        <View style={{
          width: 120,
          height: '100%',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: 1,
        }}>
          <TeamsHeader
            teams={gameData.teams}
            currentTeamIndex={gameData.currentTeamIndex}
            scores={gameData.scores}
            onTeamChange={updateCurrentTeam}
            onScoreChange={handleScoreChange}
            onEndRound={handleEndRound}
            isDoublePoints={isDoublePoints}
            onDoublePointsChange={handleDoublePointsChange}
            isPentaPoints={isPentaPoints}
            onPentaPointsChange={handlePentaPointsChange}
            usedDoublePoints={usedDoublePoints}
            usedPentaPoints={usedPentaPoints}
            style={{
              backgroundColor: 'transparent',
              paddingHorizontal: 4,
              paddingVertical: 4,
              width: '100%',
              height: 'auto',
            }}
            vertical={true}
          />
        </View>

        {/* تخطيط: الفئات والأسئلة */}
        <View style={{ 
          flex: 1,
          height: '100%',
          width: '100%',
          paddingHorizontal: 4,
          paddingVertical: 4,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}>
          {/* عرض الفئات والأسئلة في صف واحد أفقي مع مسافات قليلة */}
          <View
            style={{
              width: '100%',
              height: '100%',
              flexDirection: isLandscapeMode ? 'row' : 'column',
              flexWrap: 'nowrap', // منع الالتفاف - جميع البطاقات في صف واحد
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              overflow: isLandscapeMode ? 'scroll' : 'visible', // السماح بالتمرير الأفقي في الوضع الأفقي
              paddingHorizontal: 2, // تقليل من 12 إلى 2
              paddingVertical: 2,   // تقليل من 12 إلى 2
            }}
          >
              {(() => {
                const categories = gameData.categories || [];
                
                return categories.map(category => (
                  <CategoryCard
                    key={category}
                    category={category}
                    questions={gameData.questions[category]}
                    onQuestionPress={handleQuestionPress}
                    theme={theme}
                    categories={categories}
                    isLandscape={isLandscapeMode}
                  />
                ));
              })()}
          </View>
        </View>
      </View>

      <QuestionDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        details={selectedQuestionDetails}
        theme={theme}
      />
    </BackgroundSelector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xs,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    fontFamily: 'ReadexPro_700Bold',
  },
  errorText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    fontFamily: 'ReadexPro_700Bold',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  modalTitle: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontFamily: 'ReadexPro_700Bold',
  },
  modalText: {
    fontSize: FONTS.sizes.body,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontFamily: 'ReadexPro_500Medium',
  },
  buttonText: {
    fontSize: FONTS.sizes.button,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    fontFamily: 'ReadexPro_700Bold',
  },
});

export default GameScreen;
