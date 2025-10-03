import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, Image, Platform } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { GameService } from '../services/gameService';
import { TeamsHeader } from '../components/TeamsHeader';
import BackgroundPattern from '../components/BackgroundPattern';
import StorageService from '../services/storageService';
import PentaPointsService from '../services/pentaPointsService';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONTS } from '../styles/theme';
import categoryImages from '../assets/categories';
import QuestionDetailsModal from '../components/QuestionDetailsModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: SPACING.md, // زيادة الهامش العلوي من SPACING.xs إلى SPACING.md
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.xs,
    width: '90%', // تقليل العرض إلى 90% من عرض الشاشة
    alignSelf: 'center', // توسيط الحاوية
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.xs,
  },
  categoryHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: SPACING.xs,
    borderBottomWidth: 1,
    marginBottom: 2,
  },
  categoryImage: {
    width: 44,
    height: 44,
    marginBottom: 2,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 2,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 10, // تعديل حجم الخط إلى 10
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    letterSpacing: 0,
  },
  questionsContainer: {
    padding: SPACING.xs,
    alignItems: 'center',
    width: '100%',
    borderRadius: 4,
    margin: 2,
  },
  difficultyRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    gap: 1,
    padding: 1,
    borderRadius: 2,
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
    width: 36,
    height: 9,
    margin: 0.5,
    borderRadius: 36,
    borderWidth: 2,
    overflow: 'hidden',
  },
  questionButtonGradient: {
    padding: 2,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  pointsText: {
    fontSize: 8,
    fontWeight: FONTS.weights.bold,
  },
});

const QuestionButton = ({ difficulty, isUsed, points, onPress, theme, categories }) => {
  const difficultyColors = {
    'سهل': theme.colors.gradient?.success || ['#4CAF50', '#388E3C'],
    'متوسط': theme.colors.gradient?.warning || ['#FFA000', '#FFD740'],
    'صعب': ['#FF0000', '#D32F2F'],  
  };

  const difficultyBackgrounds = {
    'سهل': `${theme.colors.success}20`,
    'متوسط': `${theme.colors.warning}20`,
    'صعب': `${theme.colors.error}20`,
  };

  const difficultyBorders = {
    'سهل': theme.colors.border?.primary || theme.colors.success,
    'متوسط': theme.colors.border?.primary || theme.colors.warning,
    'صعب': theme.colors.border?.primary || theme.colors.error,  
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        staticStyles.questionButton,
        {
          width: categories?.length === 6 ? 60 : 36,
          height: categories?.length === 6 ? 12 : 9,
          margin: categories?.length === 6 ? 2 : 0.5,
          backgroundColor: isUsed ? `${theme.colors.background.card}80` : difficultyBackgrounds[difficulty],
          borderColor: isUsed ? theme.colors.border : difficultyBorders[difficulty],
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <LinearGradient
        colors={[
          isUsed ? `${theme.colors.background.card}00` : `${difficultyColors[difficulty][0]}20`,
          isUsed ? `${theme.colors.background.card}00` : `${difficultyColors[difficulty][1]}10`
        ]}
        style={[
          staticStyles.questionButtonGradient,
          {
            width: '100%',
            height: '100%',
          }
        ]}
      >
        <Text
          style={[
            staticStyles.pointsText,
            {
              color: isUsed ? theme.colors.text.secondary : theme.colors.text.primary,
              opacity: isUsed ? 0.6 : 1,
              fontSize: 10,
              fontFamily: 'ReadexPro_700Bold'
            }
          ]}
        >
          {points}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const CategoryColumn = ({ category, questions = {}, onQuestionPress, style, theme, categories }) => {
  const primaryColorWithOpacity = `${theme.colors.primary}80`; // إضافة 80 للشفافية (حوالي 50%)
  
  const columnStyles = StyleSheet.create({
    column: {
      flex: 0,
      minWidth: categories?.length === 6 ? 150 : 100, // زيادة عرض البطاقة عند وجود 6 فئات
      minHeight: 160,
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      borderWidth: 0,
      borderColor: primaryColorWithOpacity,
      paddingBottom: 4,
      margin: 2,
      position: 'relative', 
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      opacity: 0.15, 
      zIndex: -1, 
    },
    categoryHeader: {
      ...staticStyles.categoryHeader,
      padding: SPACING.xs,
      minHeight: 36, // تقليل الارتفاع الأدنى لرأس الفئة من 40 إلى 36
      height: 70, // تقليل ارتفاع رأس الفئة من 80 إلى 70
      alignItems: 'center',
      justifyContent: 'center', // إضافة محاذاة رأسية للمنتصف
      flexDirection: 'column',
      backgroundColor: 'transparent',
      borderBottomWidth: 2, 
      borderBottomColor: primaryColorWithOpacity, // استخدام اللون نصف الشفاف
    },
    categoryImage: {
      ...staticStyles.categoryImage,
      width: 40, // تقليل عرض الصورة من 46 إلى 40
      height: 40, // تقليل ارتفاع الصورة من 46 إلى 40
      marginBottom: 2, // تقليل الهامش السفلي من 4 إلى 2
      borderRadius: 18,
      padding: 2,
      borderWidth: 2, 
      borderColor: primaryColorWithOpacity, // استخدام اللون نصف الشفاف
      backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    },
    categoryTitle: {
      ...staticStyles.categoryTitle,
      fontSize: 10, // تعديل حجم الخط إلى 10
      textAlign: 'center',
      marginTop: 2,
      marginHorizontal: 2,
      letterSpacing: 0,
      flexWrap: 'wrap',
      // إزالة الظلال
      textShadowColor: undefined,
      textShadowOffset: undefined,
      textShadowRadius: undefined,
      width: '100%',
      height: 24, // تقليل ارتفاع اسم الفئة من 30 إلى 24
      fontFamily: 'ReadexPro_600SemiBold'
    },
    questionsContainer: {
      ...staticStyles.questionsContainer,
      padding: 2,
      marginBottom: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.3)', 
      flex: 1, // إضافة خاصية flex لملء المساحة المتبقية
      justifyContent: 'space-around', // توزيع الأسئلة بالتساوي
      height: 80, // تقليل ارتفاع حاوية الأسئلة من 90 إلى 80
    },
    difficultyRow: {
      ...staticStyles.difficultyRow,
      marginBottom: 0,
      justifyContent: 'center',
      padding: categories?.length === 6 ? 4 : 1,
      gap: categories?.length === 6 ? 4 : 2,
      flexDirection: 'row', // تغيير من 'column' إلى 'row' لجعل الأزرار في نفس السطر
      flexWrap: 'wrap', // إضافة خاصية التفاف عند الحاجة
      alignItems: 'center'
    }
  });

  return (
    <View style={[columnStyles.column, style]}>
      <Image 
        source={categoryImages[category]} 
        style={columnStyles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={[
        columnStyles.categoryHeader,
        { 
          borderBottomColor: theme.colors.border,
        }
      ]}>
        <Image 
          source={categoryImages[category]} 
          style={columnStyles.categoryImage}
          resizeMode="contain"
        />
        <Text 
          style={[columnStyles.categoryTitle, { color: theme.colors.text.primary }]}
          adjustsFontSizeToFit={true}
          numberOfLines={2} // السماح بسطرين للنص
          minimumFontScale={0.5} // زيادة الحد الأدنى لحجم الخط
        >
          {category}
        </Text>
      </View>
      
      <View style={[
        staticStyles.questionsContainer,
        columnStyles.questionsContainer
      ]}>
        {['سهل', 'متوسط', 'صعب'].map((difficulty) => {
          const questions_by_difficulty = questions[difficulty] || [];
          // تقسيم الأسئلة إلى مجموعات من زرين في كل سطر
          const rows = [];
          for (let i = 0; i < questions_by_difficulty.length; i += 2) {
            rows.push(questions_by_difficulty.slice(i, i + 2));
          }
          
          return (
            <View key={difficulty} style={[
              staticStyles.difficultyRow,
              { 
                marginBottom: 0,
                backgroundColor: difficulty === 'سهل' 
                  ? `${theme.colors.success}20` 
                  : difficulty === 'متوسط' 
                    ? `${theme.colors.warning}20` 
                    : `${theme.colors.error}20`
              }
            ]}>
              {rows.map((row, rowIndex) => (
                <View 
                  key={`row-${rowIndex}`} 
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    paddingVertical: 1
                  }}
                >
                  {row.map((question, qIndex) => (
                    <QuestionButton
                      key={`${difficulty}-${rowIndex * 2 + qIndex}`}
                      difficulty={difficulty}
                      isUsed={question.isUsed}
                      points={question.points}
                      onPress={() => onQuestionPress(category, difficulty, rowIndex * 2 + qIndex)}
                      theme={theme}
                      categories={categories}
                    />
                  ))}
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const GameScreen = () => {
  const { theme } = useTheme();
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

  const screenWidth = Dimensions.get('window').width;
  const isLandscape = screenWidth > Dimensions.get('window').height;
  const isSmallScreen = screenWidth < 768;

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
  }, []);

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

      Object.entries(latestGameData.questions).forEach(([category, difficulties]) => {
        statistics.categoryStats[category] = {
          total: 0,
          answered: 0
        };
        
        Object.values(difficulties).forEach(questions => {
          questions.forEach(question => {
            statistics.totalQuestions++;
            statistics.categoryStats[category].total++;
            
            if (question.isUsed) {
              statistics.answeredQuestions++;
              statistics.categoryStats[category].answered++;
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
        roundName: latestGameData.roundName || 'جولة بدون اسم',
        teams: latestGameData.teams,
        scores: latestGameData.scores,
        categories: latestGameData.categories,
        statistics: statistics,
        winner: winner,
        timestamp: new Date().toISOString()
      };

      console.log('تم إعداد نتائج اللعبة بنجاح، جاري حفظ النتائج في السجل...');
      
      await StorageService.saveGameToHistory(gameResults);
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
      <BackgroundPattern>
        <View style={[staticStyles.container, staticStyles.loadingContainer]}>
          <Text style={[
            staticStyles.loadingText,
            { color: theme.colors.text.primary, fontFamily: 'ReadexPro_700Bold' }
          ]}>
            
          </Text>
        </View>
      </BackgroundPattern>
    );
  }

  if (!teams.length) {
    return (
      <BackgroundPattern>
        <View style={[staticStyles.container, staticStyles.loadingContainer]}>
          <Text style={[
            staticStyles.errorText,
            { color: theme.colors.error, fontFamily: 'ReadexPro_700Bold' }
          ]}>
            
          </Text>
        </View>
      </BackgroundPattern>
    );
  }

  return (
    <BackgroundPattern
      style={{ flex: 1 }}
      patternId="gameScreenPattern"
    >
      <Stack.Screen 
        options={{ 
          headerShown: false,
          animation: 'none'
        }} 
      />
      {/* إضافة حاوية شفافة ذات إطار ذهبي تحيط بكل المحتويات */}
      <View style={{
        flex: 1,
        margin: 8,
        borderRadius: 18,
        borderWidth: 3, // إطار سميك واحد
        borderColor: theme.colors.border?.primary || theme.colors.primary,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
        // إضافة ظل خفيف لتحسين المظهر
        shadowColor: theme.colors.border?.primary || theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <View style={[staticStyles.container, { backgroundColor: 'transparent', zIndex: 2 }]}>
          {/* تخطيط أفقي: التيم هيدر على اليمين والفئات على اليسار */}
          <View style={{ 
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            paddingHorizontal: 4,
            paddingVertical: 4
          }}>
            {/* الجزء الرئيسي (الفئات والأسئلة) - على اليسار */}
            <View style={{ 
              flex: 3,
              marginRight: 4
            }}>
              <ScrollView
                style={staticStyles.scrollView}
                contentContainerStyle={[
                  staticStyles.gridContainer,
                  {
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    paddingHorizontal: SPACING.xs,
                    paddingVertical: 2,
                  }
                ]}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                {(() => {
                  const categories = gameData.categories || [];
                  const totalCategories = categories.length;
                  const categoriesPerRow = Math.ceil(totalCategories / 2); // تقسيم الفئات بالتساوي على سطرين
                  
                  // تقسيم الفئات إلى سطرين
                  const row1 = categories.slice(0, categoriesPerRow);
                  const row2 = categories.slice(categoriesPerRow);
                  
                  // حساب عرض البطاقة
                  const availableWidth = screenWidth * 0.7;
                  const itemSpacing = 4;
                  const totalSpacing = itemSpacing * (categoriesPerRow - 1);
                  const itemWidth = (availableWidth - totalSpacing) / categoriesPerRow;
                  
                  return (
                    <>
                      {/* السطر الأول */}
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center', // تغيير من flex-start إلى center
                        marginBottom: 4,
                        width: '100%',
                      }}>
                        {row1.map(category => (
                          <CategoryColumn
                            key={category}
                            category={category}
                            questions={gameData.questions[category]}
                            onQuestionPress={handleQuestionPress}
                            style={{ 
                              width: itemWidth,
                              marginHorizontal: 2,
                              backgroundColor: `${theme.colors.background.surface}80`, 
                              borderColor: theme.colors.border?.primary || theme.colors.primary,
                              borderWidth: 1,
                              shadowColor: theme.colors.border?.primary || theme.colors.primary,
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.1,
                              shadowRadius: 2,
                              elevation: 2,
                            }}
                            theme={theme}
                            categories={categories}
                          />
                        ))}
                      </View>
                      
                      {/* السطر الثاني */}
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center', // تغيير من flex-start إلى center
                        width: '100%',
                      }}>
                        {row2.map(category => (
                          <CategoryColumn
                            key={category}
                            category={category}
                            questions={gameData.questions[category]}
                            onQuestionPress={handleQuestionPress}
                            style={{ 
                              width: itemWidth,
                              marginHorizontal: 2,
                              backgroundColor: `${theme.colors.background.surface}80`, 
                              borderColor: theme.colors.border?.primary || theme.colors.primary,
                              borderWidth: 1,
                              shadowColor: theme.colors.border?.primary || theme.colors.primary,
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.1,
                              shadowRadius: 2,
                              elevation: 2,
                            }}
                            theme={theme}
                            categories={categories}
                          />
                        ))}
                      </View>
                    </>
                  );
                })()}
              </ScrollView>
            </View>

            {/* التيم هيدر - على اليمين */}
            <View style={{ 
              flex: 1,
              marginLeft: 2
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
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                  overflow: 'hidden',
                  borderWidth: 1.5,
                  borderColor: theme.colors.gold || '#FFD700',
                }}
                vertical={true}
              />
            </View>
          </View>
        </View>
      </View>
      
      <QuestionDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        details={selectedQuestionDetails}
        theme={theme}
      />
    </BackgroundPattern>
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
