import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, Image, Platform } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { GameService } from '../services/gameService';
import { TeamsHeader } from '../components/TeamsHeader';
import BackgroundPattern from '../components/BackgroundPattern';
import AnimatedGridPattern from '../components/AnimatedGridPattern';
import StorageService from '../services/storageService';
import PentaPointsService from '../services/pentaPointsService';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONTS } from '../styles/theme';
import categoryImages from '../assets/categories';
import QuestionDetailsModal from '../components/QuestionDetailsModal';
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
    width: 30,
    height: 30,
    marginBottom: 0,
    marginRight: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 1,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 8,
    fontWeight: FONTS.weights.bold,
    textAlign: 'left',
    letterSpacing: 0,
  },
  questionsContainer: {
    padding: 2,
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
    marginBottom: 1,
    gap: 1,
    padding: 1,
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
    width: 28,
    height: 10,
    margin: 0.5,
    borderRadius: 4,
    borderWidth: 1.2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionButtonGradient: {
    padding: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  pointsText: {
    fontSize: 7,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
});

const QuestionButton = ({ difficulty, isUsed, points, onPress, theme, categories }) => {
  const difficultyColors = {
    'سهل': { bg: '#C8E6C9', border: '#2E7D32', text: '#1B5E20' },
    'متوسط': { bg: '#FFE0B2', border: '#E65100', text: '#BF360C' },
    'صعب': { bg: '#FFCDD2', border: '#C62828', text: '#B71C1C' },  
  };

  // حساب حجم الزر بناءً على عدد الفئات
  const getButtonSize = () => {
    if (categories?.length === 6) {
      return { width: 22, height: 22, margin: 2, fontSize: 7 };
    } else if (categories?.length === 8) {
      return { width: 20, height: 20, margin: 1.5, fontSize: 6.5 };
    } else {
      return { width: 21, height: 21, margin: 1.8, fontSize: 6.8 };
    }
  };

  const buttonSize = getButtonSize();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isUsed}
      style={[
        staticStyles.questionButton,
        {
          width: buttonSize.width,
          height: buttonSize.height,
          margin: buttonSize.margin,
          backgroundColor: isUsed ? '#F0F0F0' : difficultyColors[difficulty].bg,
          borderColor: isUsed ? '#D0D0D0' : difficultyColors[difficulty].border,
          borderWidth: 1.8,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 6,
          elevation: isUsed ? 0 : 2,
          shadowColor: difficultyColors[difficulty].border,
          shadowOffset: { width: 0, height: 0.8 },
          shadowOpacity: isUsed ? 0 : 0.2,
          shadowRadius: 1.5,
        },
      ]}
    >
      <Text
        style={[
          staticStyles.pointsText,
          {
            color: isUsed ? '#B0B0B0' : difficultyColors[difficulty].text,
            opacity: 1,
            fontSize: buttonSize.fontSize,
            fontWeight: '700',
            fontFamily: 'ReadexPro_700Bold'
          }
        ]}
      >
        {points}
      </Text>
    </TouchableOpacity>
  );
};

const CategoryColumn = ({ category, questions = {}, onQuestionPress, style, theme, categories }) => {
  const isLandscape = useIsLandscape();
  const questionList = Object.values(questions).flat();

  return (
    <View style={[{
      backgroundColor: theme.colors.background?.surface || '#FFF',
      borderRadius: 10,
      marginVertical: 2,
      marginHorizontal: 2,
      paddingVertical: isLandscape ? 8 : 6,
      paddingHorizontal: isLandscape ? 6 : 10,
      shadowColor: theme.colors.primary || '#2E5DB8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border?.primary || theme.colors.primary || '#E8E8E8',
      alignItems: 'center',
      justifyContent: isLandscape ? 'center' : 'space-between',
      flex: 1,
      flexDirection: isLandscape ? 'column' : 'row',
    }, style]}>
      {/* الصورة واسم الفئة - في الأعلى (Landscape) أو اليسار (Portrait) */}
      <View style={{
        alignItems: 'center',
        marginBottom: isLandscape ? 6 : 0,
        marginRight: isLandscape ? 0 : 8,
        width: isLandscape ? '100%' : 'auto',
        minWidth: isLandscape ? 'auto' : 80,
        paddingRight: isLandscape ? 0 : 6,
        borderRightWidth: isLandscape ? 0 : 1,
        borderRightColor: isLandscape ? 'transparent' : (theme.colors.border?.primary || theme.colors.primary || '#E8E8E8'),
      }}>
        <Image 
          source={categoryImages[category]} 
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            marginBottom: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
          resizeMode="cover"
        />
        <Text 
          style={{
            fontSize: 10,
            fontWeight: '700',
            textAlign: 'center',
            maxWidth: '95%',
            color: theme.colors.text?.primary || '#000',
            fontFamily: 'ReadexPro_700Bold',
          }}
          numberOfLines={2}
        >
          {category}
        </Text>
      </View>

      {/* الأسئلة - في الجانب (Portrait) أو تحت الاسم (Landscape) */}
      <View style={{
        flexDirection: 'row',
        flexWrap: isLandscape ? 'wrap' : 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: isLandscape ? 2 : 3,
        width: isLandscape ? '100%' : 'auto',
        flex: isLandscape ? 0 : 1,
      }}>
        {questionList.slice(0, 6).map((question, index) => (
          <QuestionButton
            key={`${category}-${index}`}
            difficulty={question?.difficulty || 'سهل'}
            isUsed={question?.used || false}
            points={question?.points || 10}
            onPress={() => onQuestionPress?.(category, index)}
            theme={theme}
            categories={categories}
          />
        ))}
      </View>
    </View>
  );
};

const GameScreen = () => {
  const { theme } = useTheme();
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
    <View style={{ flex: 1, backgroundColor: '#0F1C3F' }}>
      {/* خلفية احترافية متعددة الطبقات */}
      <View style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* تدرج رئيسي */}
        <LinearGradient
          colors={['#1a3a5e', '#0F1C3F', '#0a1220']}
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
        
        {/* تدرج ثانوي للحواف */}
        <LinearGradient
          colors={['#4A90E2', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.3 }}
          style={{ 
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '30%',
            zIndex: 0,
            opacity: 0.15,
          }}
        />
        
        {/* نمط شبكة متحرك مع حجم أصغر للتفاصيل */}
        <AnimatedGridPattern
          width={120}
          height={120}
          dotSize={12}
          dotColor="#64B5F6"
          dotOpacity={0.20}
          animationDuration={5000}
          animationDelay={0}
          variant="background"
          isAnimated={true}
        />
        
        {/* نمط إضافي للعمق */}
        <AnimatedGridPattern
          width={200}
          height={200}
          dotSize={20}
          dotColor="#2196F3"
          dotOpacity={0.08}
          animationDuration={8000}
          animationDelay={1000}
          variant="background"
          isAnimated={true}
        />
      </View>
      
      <Stack.Screen 
        options={{ 
          headerShown: false,
          animation: 'none'
        }} 
      />
      {/* حاوية رئيسية احترافية مع تأثيرات عميقة */}
      <View style={{
        flex: 1,
        margin: 20,
        borderRadius: 28,
        borderWidth: 3,
        borderColor: '#2E5DB8',
        backgroundColor: 'rgba(227, 240, 255, 0.6)',
        overflow: 'hidden',
        shadowColor: '#2E5DB8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 28,
        position: 'relative',
        zIndex: 2,
        justifyContent: 'center',
      }}>
        {/* تدرج داخلي للحاوية */}
        <LinearGradient
          colors={['#E3F0FF', '#D6E9FF', '#CDDBF0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        />
        <View style={[staticStyles.container, { backgroundColor: 'transparent', zIndex: 2, flexDirection: 'row-reverse' }]}>
          {/* التيم هيدر على الجانب الأيمن - رأسي مع خلفية متحركة احترافية */}
          <View style={{
            width: 120,
            height: '100%',
            borderLeftWidth: 2,
            borderLeftColor: '#4A90E2',
            backgroundColor: '#D6E9FF',
            overflow: 'hidden',
            position: 'relative',
            borderTopRightRadius: 22,
            borderBottomRightRadius: 22,
          }}>
            {/* خلفية متحركة احترافية */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}>
              {/* تدرج رئيسي */}
              <LinearGradient
                colors={['#E8F4FF', '#D6E9FF', '#C8E0F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  zIndex: 0,
                }}
              />
              
              {/* تدرج إضافي من الأعلى */}
              <LinearGradient
                colors={['#4A90E2', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '40%',
                  opacity: 0.08,
                  zIndex: 0,
                }}
              />
              
              {/* نمط شبكة متحرك للتيم هيدر */}
              <AnimatedGridPattern
                width={120}
                height={120}
                dotSize={5}
                dotColor="#4A90E2"
                dotOpacity={0.08}
                animationDuration={5000}
                animationDelay={0}
                variant="background"
                isAnimated={true}
              />
            </View>

            {/* محتوى التيم هيدر */}
            <View style={{
              flex: 1,
              position: 'relative',
              zIndex: 1,
              paddingHorizontal: 4,
              paddingVertical: 4,
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
                  borderWidth: 0,
                  height: '100%',
                }}
                vertical={true}
              />
            </View>
          </View>

          {/* تخطيط أفقي: الفئات والأسئلة تملأ بقية المساحة */}
          <View style={{ 
            flex: 1,
            height: '100%',
            width: '100%',
            paddingHorizontal: isLandscapeMode ? 2 : 4,
            paddingVertical: isLandscapeMode ? 8 : 4,
            paddingTop: isLandscapeMode ? 12 : 4,
            justifyContent: isLandscapeMode ? 'flex-start' : 'flex-start',
            alignItems: 'center',
          }}>
            {/* الجزء الرئيسي (الفئات والأسئلة) - Grid متعدد الأعمدة */}
            <View
                style={{
                  flex: 1,
                  width: '100%',
                  flexDirection: isLandscapeMode ? 'row' : 'column',
                  flexWrap: isLandscapeMode ? 'wrap' : 'nowrap',
                  justifyContent: isLandscapeMode ? 'center' : 'flex-start',
                  alignItems: isLandscapeMode ? 'flex-start' : 'center',
                  paddingHorizontal: isLandscapeMode ? 4 : 6,
                  paddingVertical: isLandscapeMode ? 4 : 6,
                }}
            >
                {(() => {
                  const categories = gameData.categories || [];
                  
                  return (
                    <>
                      {categories.map(category => (
                        <CategoryColumn
                          key={category}
                          category={category}
                          questions={gameData.questions[category]}
                          onQuestionPress={handleQuestionPress}
                          style={{ 
                            width: isLandscapeMode ? '32%' : '100%',
                            marginHorizontal: isLandscapeMode ? '1%' : 0,
                            marginBottom: isLandscapeMode ? 6 : 10,
                            marginVertical: isLandscapeMode ? 4 : 6,
                            flex: 0,
                            minHeight: isLandscapeMode ? 220 : 'auto',
                            height: isLandscapeMode ? 'auto' : 90,
                          }}
                          theme={theme}
                          categories={categories}
                        />
                      ))}
                    </>
                  );
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
      </View>
    </View>
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
