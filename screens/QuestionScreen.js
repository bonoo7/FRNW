import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Alert, Modal, ScrollView, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundSelector from '../components/BackgroundSelector';
import { SPACING, FONTS } from '../styles/theme';
import StorageService from '../services/storageService';
import RewardsService from '../services/rewardsService';
import PentaPointsService from '../services/pentaPointsService';
import ReportService from '../services/reportService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import QuestionImage from '../components/QuestionImage';
import QuestionMedia from '../components/QuestionMedia';
import categoryImages from '../assets/categories';

const getDifficultyTime = (difficulty) => {
  switch (difficulty) {
    case 'سهل': return 60; // دقيقة
    case 'متوسط': return 90; // دقيقة ونصف
    case 'صعب': return 120; // دقيقتين
    default: return 60;
  }
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const ReportTypes = {
  QUESTION_FORMAT: 'صياغة السؤال',
  WRONG_ANSWER: 'خطأ في الإجابة',
  WRONG_CATEGORY: 'خطأ في الفئة',
  DIFFICULTY_LEVEL: 'مستوى صعوبة غير مناسب',
  OTHER: 'سبب آخر'
};

const QuestionScreen = ({ questionData }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isQuestionHandled, setIsQuestionHandled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [teams, setTeams] = useState([]);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [remainingTeams, setRemainingTeams] = useState([]);
  const [currentQuestionTeam, setCurrentQuestionTeam] = useState('');
  const [teamTimings, setTeamTimings] = useState({});
  const [settings, setSettings] = useState({ rewardsEnabled: true, pentaPointsEnabled: true });
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportComment, setReportComment] = useState('');

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isLandscape = screenWidth > screenHeight;
  const isSmallScreen = screenWidth < 768;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // تحميل إعدادات اللعبة
        const savedSettings = await StorageService.getSettings();
        setSettings(savedSettings || { rewardsEnabled: true, pentaPointsEnabled: true });
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
        setSettings({ rewardsEnabled: true, pentaPointsEnabled: true });
      }
    };
    
    loadSettings();
  }, []);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        // التحقق إذا كانت هذه معاينة سؤال
        if (questionData.isPreviewMode && questionData.teams) {
          // استخدام الفرق المحددة في بيانات معاينة السؤال
          setTeams(questionData.teams);
          setRemainingTeams(questionData.teams);
          setCurrentQuestionTeam(questionData.teams[questionData.currentTeamIndex || 0]);
          return;
        }

        // الحصول على بيانات اللعبة العادية
        const gameData = await StorageService.getCurrentGame();
        if (!gameData || !gameData.teams) {
          console.error('لا توجد بيانات فرق متاحة');
          return;
        }

        const allTeams = gameData.teams || [];
        setTeams(allTeams);
        
        // البدء من الفريق النشط في شاشة اللعب
        const startTeam = questionData.teamName;
        const startIndex = allTeams.findIndex(team => team === startTeam);
        
        // ترتيب الفرق بدءاً من الفريق النشط
        const orderedTeams = [
          ...allTeams.slice(startIndex),
          ...allTeams.slice(0, startIndex)
        ];
        setRemainingTeams(orderedTeams);
        setCurrentQuestionTeam(orderedTeams[0]);
      } catch (error) {
        console.error('خطأ في تحميل بيانات الفرق:', error);
      }
    };
    loadTeams();
  }, [questionData]);

  useEffect(() => {
    if (!questionData) return;
    // الفريق الأول يحصل على الوقت كاملاً
    setTimeLeft(getDifficultyTime(questionData.difficulty));
  }, [questionData]);

  // دالة جديدة لتحديد وقت العد التنازلي حسب ترتيب الفريق
  const getTeamTime = (difficulty, isFirstTeam) => {
    const fullTime = getDifficultyTime(difficulty);
    // الفريق الأول يحصل على الوقت كاملاً، باقي الفرق تحصل على نصف الوقت
    return isFirstTeam ? fullTime : Math.floor(fullTime / 2);
  };

  useEffect(() => {
    if (currentQuestionTeam && !isAnswerRevealed) {
      try {
        // التحقق إذا كانت هذه معاينة سؤال
        if (questionData.isPreviewMode) {
          // في حالة المعاينة، نستخدم الوقت الكامل دائمًا
          setTimeLeft(getDifficultyTime(questionData.difficulty));
          setIsTimerActive(true);
          return;
        }

        // تحديد ما إذا كان هذا هو الفريق الأول أم لا
        const isFirstTeam = currentQuestionTeam === questionData.teamName;
        // إعادة ضبط المؤقت للفريق الجديد (الفريق الأول يحصل على الوقت كاملاً، باقي الفرق تحصل على نصف الوقت)
        setTimeLeft(getTeamTime(questionData.difficulty, isFirstTeam));
        // تنشيط المؤقت
        setIsTimerActive(true);
      } catch (error) {
        console.error('خطأ في إعداد المؤقت للفريق:', error);
        // استخدام الوقت الافتراضي في حالة الخطأ
        setTimeLeft(getDifficultyTime(questionData.difficulty));
      }
    }
  }, [currentQuestionTeam, questionData, isAnswerRevealed]);

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  const handleTimerEnd = useCallback(() => {
    // حفظ وقت التثبيت للفريق الحالي (صفر لأن الوقت انتهى)
    setTeamTimings(prev => ({
      ...prev,
      [currentQuestionTeam]: 0
    }));

    // إذا كان آخر فريق، نظهر الإجابة فقط
    if (remainingTeams.length <= 1) {
      setIsAnswerRevealed(true);
      setIsTimerActive(false);
    } else {
      // إذا كان هناك فرق أخرى، ننتقل للفريق التالي
      const nextTeams = remainingTeams.slice(1);
      setRemainingTeams(nextTeams);
      setCurrentQuestionTeam(nextTeams[0]);
      
      // لا نحتاج لإعادة ضبط المؤقت هنا لأن useEffect سيتولى ذلك
      // عند تغيير currentQuestionTeam
    }
  }, [remainingTeams, currentQuestionTeam]);

  const handleSkip = async () => {
    if (!isTimerActive || isAnswerRevealed) return;
    
    // حفظ وقت التثبيت للفريق الحالي
    setTeamTimings(prev => ({
      ...prev,
      [currentQuestionTeam]: timeLeft
    }));

    // إذا كان آخر فريق، نظهر الإجابة فقط
    if (remainingTeams.length <= 1) {
      setIsAnswerRevealed(true);
      setIsTimerActive(false);
    } else {
      // إذا كان هناك فرق أخرى، ننتقل للفريق التالي
      const nextTeams = remainingTeams.slice(1);
      setRemainingTeams(nextTeams);
      setCurrentQuestionTeam(nextTeams[0]);
      setTimeLeft(getDifficultyTime(questionData.difficulty));
      setIsTimerActive(true);
    }
  };

  const handleTeamAnswer = async (teamName) => {
    if (isQuestionHandled) return;
    try {
      setIsQuestionHandled(true);
      
      // التحقق إذا كانت هذه معاينة سؤال
      if (questionData.isPreviewMode) {
        // في حالة المعاينة، نكشف الإجابة فقط دون تحديث النقاط
        setIsAnswerRevealed(true);
        setIsTimerActive(false);
        return;
      }
      
      const gameData = await StorageService.getCurrentGame();
      if (!gameData) throw new Error('لم يتم العثور على بيانات اللعبة');
      
      const { category, difficulty, index } = questionData;
      // تحقق مما إذا كان الفريق الحالي هو الفريق الأصلي الذي ظهر له زر المضاعفة
      const isOriginalTeam = teamName === questionData.teamName;
      
      // تطبيق المضاعفات:
      // 1. إذا كان السؤال بمضاعفة 5 مرات، تطبق على جميع الفرق
      // 2. إذا كان السؤال بمضاعفة عادية (×2)، تطبق فقط على الفريق الأصلي
      let multiplier = 1;
      
      if (questionData.isPentaPoints && settings.pentaPointsEnabled) {
        // مضاعفة ×5 تطبق على جميع الفرق فقط إذا كان النظام مفعلاً
        multiplier = PentaPointsService.calculateMultiplier();
      } else if (questionData.isDoublePoints && isOriginalTeam) {
        // مضاعفة ×2 تطبق فقط على الفريق الأصلي
        multiplier = 2;
      }
      
      const actualPoints = questionData.points * multiplier;
      let finalPoints = actualPoints;
      let bonusMessage = null;
      
      if (teamName !== 'none') {
        // حساب المكافآت إذا كان النظام مفعل
        if (settings.rewardsEnabled) {
          const maxTime = getDifficultyTime(difficulty);
          // استخدام وقت التثبيت المحفوظ للفريق
          const teamTimeLeft = teamTimings[teamName] || 0;
          
          const timeBonus = RewardsService.calculateTimeBonus(teamTimeLeft, maxTime, actualPoints);
          
          if (timeBonus && timeBonus.bonus > 0) {
            finalPoints += timeBonus.bonus;
            bonusMessage = timeBonus.message;
            
            // حفظ المكافأة في سجل المكافآت
            await RewardsService.saveRewardHistory(teamName, {
              type: 'time_bonus',
              points: timeBonus.bonus,
              message: timeBonus.message,
              questionCategory: category,
              questionDifficulty: difficulty
            });
          }
        }
        
        gameData.scores[teamName] = (gameData.scores[teamName] || 0) + finalPoints;

        // عرض رسالة المكافأة إذا وجدت
        if (bonusMessage) {
          Alert.alert(
            'مكافأة!',
            `${bonusMessage}\nالنقاط النهائية: ${finalPoints}`,
            [{ text: 'حسناً', style: 'default' }]
          );
        }
      }

      if (gameData.questions[category]?.[difficulty]?.[index]) {
        gameData.questions[category][difficulty][index] = {
          ...gameData.questions[category][difficulty][index],
          isUsed: true,
          answeredBy: teamName,
          // تسجيل حالات المضاعفة
          wasDoublePoints: questionData.isDoublePoints && isOriginalTeam,
          wasPentaPoints: questionData.isPentaPoints,
          earnedPoints: finalPoints,
          answeredAt: new Date().toISOString(),
          question: questionData.question,
          answer: questionData.answer,
          points: questionData.points,
          timeBonus: bonusMessage
        };
      }
      
      await StorageService.saveCurrentGame(gameData);
      
      // عدم الانتقال إلى شاشة اللعبة في حالة المعاينة
      if (!questionData.isPreviewMode) {
        router.replace({
          pathname: "/game",
          params: { 
            shouldRefresh: Date.now(),
            shouldMoveNext: true
          }
        });
      }
    } catch (error) {
      console.error('تفاصيل الخطأ:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ النتيجة');
      setIsQuestionHandled(false);
    }
  };

  const handleReportSubmit = async () => {
    try {
      await ReportService.submitReport({
        question: questionData.question,
        answer: questionData.answer,
        reportType: selectedReportType,
        reason: reportReason,
        comment: reportComment
      });
      
      setShowReportModal(false);
      
      Alert.alert(
        'تم إرسال البلاغ',
        'شكراً على مساعدتنا في تحسين المحتوى',
        [{ text: 'حسناً' }]
      );
    } catch (error) {
      Alert.alert(
        'خطأ',
        'حدث خطأ أثناء إرسال البلاغ. الرجاء المحاولة مرة أخرى.',
        [{ text: 'حسناً' }]
      );
    }
  };

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        if (questionData) {
          const data = questionData;
          // التحقق من حالة تفعيل نظام علي وعلى أعدائي
          const settings = await StorageService.getSettings();
          const isPentaPointsEnabled = settings?.pentaPointsEnabled !== undefined ? settings.pentaPointsEnabled : true;
          
          // تعديل حالة مضاعفة النقاط ×5 بناءً على حالة التفعيل
          if (data.isPentaPoints && !isPentaPointsEnabled) {
            data.isPentaPoints = false;
          }
        }
      } catch (error) {
        console.error('خطأ في تحميل بيانات السؤال:', error);
      }
    };

    loadQuestion();
  }, [questionData]);

  const calculateFinalPoints = async () => {
    try {
      let finalPoints = 0;
      const isOriginalTeam = questionData.teamName === currentQuestionTeam;
      let multiplier = 1;
      
      // التحقق من حالة تفعيل نظام علي وعلى أعدائي
      const settings = await StorageService.getSettings();
      const isPentaPointsEnabled = settings?.pentaPointsEnabled !== undefined ? settings.pentaPointsEnabled : true;
      
      if (questionData.isPentaPoints && isPentaPointsEnabled) {
        // مضاعفة ×5 تطبق على جميع الفرق
        multiplier = PentaPointsService.calculateMultiplier();
      } else if (questionData.isDoublePoints && isOriginalTeam) {
        // مضاعفة ×2 تطبق فقط على الفريق الأصلي
        multiplier = 2;
      }
    } catch (error) {
      console.error('خطأ في حساب النقاط النهائية:', error);
    }
  };

  if (!questionData) {
    return (
      <BackgroundSelector>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
            جاري تحميل السؤال...
          </Text>
        </View>
      </BackgroundSelector>
    );
  }

  const {
    question,
    answer,
    category,
    difficulty,
    points,
    teamName,
    isDoublePoints,
    isPentaPoints,
    imgQ,
    imgA,
    vidQ,
    vidA
  } = questionData;

  const actualPoints = isDoublePoints ? points * 2 : points;

  return (
    <BackgroundSelector>
      <View style={[
        styles.container, 
        { 
          backgroundColor: 'transparent', 
          height: '100vh', 
          borderWidth: 0,
          borderColor: 'transparent',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }
      ]}>
        {/* زر العودة إلى محرر الأسئلة (يظهر فقط في وضع المعاينة) */}
        {questionData?.isPreviewMode && (
          <TouchableOpacity 
            style={styles.backToEditorButton}
            onPress={() => router.replace('/question-editor')}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backToEditorText}>العودة إلى محرر الأسئلة</Text>
          </TouchableOpacity>
        )}
        
        <View style={[
          styles.card,
          {
            backgroundColor: `${theme.colors.background.card}CC`,
            borderColor: 'transparent', 
            borderWidth: 0, 
            flex: 1,
            maxWidth: Platform.select({ web: '100%', default: '100%' }),
            maxHeight: Platform.select({ web: '100vh', default: '100%' }),
            alignSelf: 'center',
            width: '100%',
            elevation: 0,
            shadowColor: 'transparent',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            padding: 0,
            overflow: 'hidden'
          }
        ]}>
          <BackgroundSelector>
            <View style={[
              styles.questionHeader,
              { 
                backgroundColor: `${theme.colors.background.surface}CC`, 
                borderWidth: 0,
                borderColor: 'transparent',
                width: '90%',
                alignSelf: 'center',
                marginTop: SPACING.md,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            ]}>
              {/* قسم الفريق الحالي (يسار) */}
              <View style={styles.headerLeftSection}>
                {!isAnswerRevealed && currentQuestionTeam && (
                  <View style={{
                    backgroundColor: theme.colors.button?.secondary || theme.colors.secondary,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                    <MaterialIcons name="group" size={16} color="#FFF" />
                    <Text style={{
                      fontSize: 12,
                      color: '#FFF',
                      fontFamily: FONTS.families.secondary,
                      fontWeight: FONTS.weights.bold,
                    }} numberOfLines={1}>
                      {currentQuestionTeam}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* قسم العد التنازلي (وسط) */}
              <View style={styles.timerCenterSection}>
                {!isAnswerRevealed && (
                  <Text style={[
                    styles.timer,
                    { 
                      color: timeLeft <= 10 ? theme.colors.error : theme.colors.text.primary,
                      fontFamily: 'ReadexPro_700Bold'
                    }
                  ]}>
                    {formatTime(timeLeft)}
                  </Text>
                )}
              </View>
              
              {/* قسم الفئة (يمين) */}
              <View style={styles.headerRightSection}>
                {/* زر الفئات - يشبه زر ألعابي والملف الشخصي */}
                <View style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                  <MaterialIcons name="category" size={16} color="#FFF" />
                  <Text style={{
                    fontSize: 12,
                    color: '#FFF',
                    fontFamily: FONTS.families.secondary,
                    fontWeight: FONTS.weights.bold,
                    marginRight: 4
                  }}>
                    {questionData.category}
                  </Text>
                </View>

                {/* شارة المضاعفة */}
                {(isDoublePoints || isPentaPoints) && (
                  <View style={[styles.multiplierBadge, { 
                    backgroundColor: isPentaPoints ? '#FF572240' : `${theme.colors.success}40`,
                    borderColor: isPentaPoints ? '#FF5722' : theme.colors.success,
                    marginRight: 8,
                  }]}>
                    <Text style={[styles.multiplierText, { 
                      color: isPentaPoints ? '#FF5722' : theme.colors.success 
                    }]}>
                      {isPentaPoints ? 'x5' : 'x2'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={[
              styles.questionContainer,
              { 
                backgroundColor: `${theme.colors.background.surface}CC`,
                borderColor: 'transparent',
                borderWidth: 0,
                marginBottom: SPACING.xs,
                // ارتفاع متجاوب مع حجم الشاشة لعرض الأزرار أسفله
                height: isSmallScreen ? screenHeight * 0.5 : screenHeight * 0.6,
                paddingVertical: SPACING.md,
              }
            ]}>
              {/* إضافة صورة الفئة كخلفية */}
              {categoryImages[questionData.category.toLowerCase()] && (
                <Image 
                  source={categoryImages[questionData.category.toLowerCase()]}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.35,
                    zIndex: -1,
                    resizeMode: 'cover'
                  }}
                />
              )}
              
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => setShowReportModal(true)}
              >
                <MaterialIcons
                  name="report-problem"
                  size={24}
                  color={theme.colors.warning}
                />
              </TouchableOpacity>
              <Text style={[
                styles.question,
                { 
                  color: '#990000', // أحمر غامق جداً
                  fontWeight: 'bold',
                  fontSize: 20, // تقليل حجم الخط من 22 إلى 20
                  fontFamily: 'ReadexPro_700Bold',
                  marginBottom: 2 // تقليل المسافة السفلية إلى الحد الأدنى
                }
              ]}>
                {question}
              </Text>

              {isAnswerRevealed && (
                <Text style={[
                  styles.answer,
                  { 
                    color: '#006600', // أخضر غامق جداً
                    fontWeight: 'bold',
                    fontSize: 20, // تقليل حجم الخط من 22 إلى 20
                    fontFamily: 'ReadexPro_700Bold',
                    marginTop: 2 // تقليل المسافة العلوية إلى الحد الأدنى
                  }
                ]}>
                  {answer}
                </Text>
              )}

              {/* إذا كان هناك فيديو أو صوت، اعرضه مكان الصورة */}
              {(vidQ && !isAnswerRevealed) || (vidA && isAnswerRevealed) ? (
                <QuestionMedia
                  questionVideo={vidQ}
                  answerVideo={vidA}
                  isAnswerRevealed={isAnswerRevealed}
                  style={{ alignSelf: 'center', marginTop: SPACING.sm }}
                />
              ) : (
                <QuestionImage
                  questionImage={imgQ}
                  answerImage={imgA}
                  isAnswerRevealed={isAnswerRevealed}
                  style={{ alignSelf: 'center', marginTop: SPACING.sm }}
                />
              )}
            </View>

            <View style={[
              styles.buttonsContainer,
              isLandscape && styles.buttonsContainerLandscape,
              {
                width: '90%', // نفس عرض شريط العداد
                alignSelf: 'center', // توسيط الأزرار
                marginBottom: SPACING.md, // إضافة هامش سفلي
              }
            ]}>
              {!isAnswerRevealed ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { 
                        backgroundColor: theme.colors.primary,
                        borderWidth: 1,
                        borderColor: theme.colors.border?.primary || theme.colors.primary
                      },
                      isLandscape && styles.buttonLandscape,
                      { alignSelf: 'stretch' } // تمدد الزر ليملأ العرض المتاح
                    ]}
                    onPress={() => setIsAnswerRevealed(true)}
                  >
                    <Text style={[
                      styles.buttonText,
                      isLandscape && styles.buttonTextLandscape,
                      { fontFamily: 'ReadexPro_700Bold' }
                    ]}>
                      إظهار الإجابة
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { 
                        backgroundColor: theme.colors.warning,
                        borderWidth: 1,
                        borderColor: theme.colors.border?.primary || theme.colors.primary
                      },
                      !isTimerActive && styles.buttonDisabled,
                      isLandscape && styles.buttonLandscape,
                      { alignSelf: 'stretch' } // تمدد الزر ليملأ العرض المتاح
                    ]}
                    onPress={handleSkip}
                    disabled={!isTimerActive}
                  >
                    <Text style={[
                      styles.buttonText,
                      isLandscape && styles.buttonTextLandscape,
                      { fontFamily: 'ReadexPro_700Bold' }
                    ]}>
                      {remainingTeams.length <= 1 ? 'تثبيت' : 'تثبيت'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={[
                  styles.teamsAnswerContainer,
                  {
                    width: '100%',
                    alignSelf: 'center',
                    marginBottom: SPACING.md,
                    marginTop: SPACING.sm,
                  }
                ]}>
                  <View style={[
                    styles.teamsRow,
                    {
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      gap: 6,
                    }
                  ]}>
                    {teams.map((team) => (
                      <TouchableOpacity
                        key={team}
                        style={[
                          styles.teamAnswerButton,
                          { 
                            backgroundColor: theme.colors.primary,
                            minWidth: teams.length > 3 ? '30%' : 60,
                            maxWidth: teams.length > 3 ? '48%' : 'auto',
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            marginHorizontal: 2,
                            marginVertical: 3,
                            borderWidth: 1,
                            borderColor: theme.colors.border?.primary || theme.colors.primary,
                            elevation: isAnswerRevealed ? 30 : 0,
                            transform: isAnswerRevealed ? [{ translateY: -25 }] : []
                          }
                        ]}
                        onPress={() => handleTeamAnswer(team)}
                      >
                        <Text style={[
                          styles.teamButtonText,
                          { 
                            fontSize: teams.length > 4 ? 11 : FONTS.sizes.small, 
                            fontFamily: 'ReadexPro_700Bold',
                            textAlign: 'center',
                            color: '#FFFFFF',
                          }
                        ]} numberOfLines={1} adjustsFontSizeToFit>
                          {team}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={[
                        styles.teamAnswerButton,
                        { 
                          backgroundColor: '#D61C1C',
                          minWidth: 100,
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          marginHorizontal: 2,
                          marginVertical: 3,
                          marginLeft: 8,
                          borderWidth: 1.5,
                          borderColor: '#FF0000',
                          elevation: isAnswerRevealed ? 30 : 0,
                          transform: isAnswerRevealed ? [{ translateY: -25 }] : []
                        }
                      ]}
                      onPress={() => handleTeamAnswer('none')}
                    >
                      <Text style={[
                        styles.teamButtonText,
                        { 
                          fontSize: FONTS.sizes.small, 
                          fontFamily: 'ReadexPro_700Bold',
                          textAlign: 'center',
                          color: '#FFFFFF',
                        }
                      ]} numberOfLines={1} adjustsFontSizeToFit>
                        لم يجب أحد
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </BackgroundSelector>
        </View>
      </View>

      {/* Modal التبليغ */}
      <Modal
        visible={showReportModal}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
        statusBarTranslucent={true}
      >
        <View style={{
          flex: 1,
          backgroundColor: theme.colors.background.primary,
        }}>
          <View style={[styles.modalHeader, {
            backgroundColor: theme.colors.primary,
            padding: SPACING.md,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: Platform.OS === 'android' ? SPACING.lg : SPACING.md
          }]}>
            <Text style={[styles.modalTitle, { 
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              flex: 1,
              fontFamily: 'ReadexPro_700Bold'
            }]}>
              تبليغ عن مشكلة
            </Text>
            <TouchableOpacity
              onPress={() => setShowReportModal(false)}
              style={{
                padding: SPACING.sm,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              padding: SPACING.md,
              paddingBottom: SPACING.xl
            }}
            scrollEnabled={true}
          >
            <View style={[styles.reportQuestionContainer, {
              backgroundColor: theme.colors.background.card,
              borderColor: theme.colors.border.primary,
              borderRadius: 12,
              padding: SPACING.md,
              marginBottom: SPACING.md,
              borderWidth: 1,
            }]}>
              <Text style={[styles.reportLabel, { 
                color: theme.colors.primary,
                fontWeight: 'bold',
                marginBottom: SPACING.sm,
                fontSize: 15,
                fontFamily: 'ReadexPro_500Medium'
              }]}>
                السؤال:
              </Text>
              <Text style={[styles.reportQuestion, { 
                color: theme.colors.text.primary,
                marginBottom: SPACING.md,
                fontSize: 15,
                fontFamily: 'ReadexPro_400Regular',
                lineHeight: 24
              }]}>
                {questionData.question}
              </Text>
              <Text style={[styles.reportLabel, { 
                color: theme.colors.primary,
                fontWeight: 'bold',
                marginBottom: SPACING.sm,
                fontSize: 15,
                fontFamily: 'ReadexPro_500Medium'
              }]}>
                الإجابة:
              </Text>
              <Text style={[styles.reportQuestion, { 
                color: theme.colors.text.primary,
                fontSize: 15,
                fontFamily: 'ReadexPro_400Regular',
                lineHeight: 24
              }]}>
                {questionData.answer}
              </Text>
            </View>

            <Text style={{
              color: theme.colors.text.primary,
              fontWeight: 'bold',
              marginBottom: SPACING.sm,
              fontSize: 15,
              fontFamily: 'ReadexPro_500Medium'
            }}>
              نوع المشكلة:
            </Text>

            <View style={[styles.reportTypeContainer, {
              marginBottom: SPACING.md,
              flexDirection: 'column',
              gap: SPACING.xs
            }]}>
              {Object.entries(ReportTypes).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.reportTypeButton,
                    {
                      backgroundColor: selectedReportType === value 
                        ? `${theme.colors.primary}20`
                        : theme.colors.background.card,
                      borderColor: selectedReportType === value 
                        ? theme.colors.primary
                        : theme.colors.border.primary,
                      borderWidth: selectedReportType === value ? 2 : 1,
                      borderRadius: 10,
                      padding: SPACING.md,
                      width: '100%',
                    }
                  ]}
                  onPress={() => setSelectedReportType(value)}
                >
                  <Text style={[
                    styles.reportTypeText,
                    { 
                      color: selectedReportType === value 
                        ? theme.colors.primary
                        : theme.colors.text.secondary,
                      fontWeight: selectedReportType === value ? 'bold' : 'normal',
                      fontSize: 15,
                      textAlign: 'right',
                      fontFamily: 'ReadexPro_500Medium'
                    }
                  ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{
              color: theme.colors.text.primary,
              fontWeight: 'bold',
              marginBottom: SPACING.sm,
              fontSize: 15,
              fontFamily: 'ReadexPro_500Medium'
            }}>
              سبب التبليغ:
            </Text>

            <TextInput
              style={[
                styles.reportInput,
                { 
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.primary,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: SPACING.md,
                  marginBottom: SPACING.md,
                  minHeight: 100,
                  fontSize: 15,
                  fontFamily: 'ReadexPro_400Regular',
                  textAlignVertical: 'top',
                  placeholderTextColor: theme.colors.text.secondary
                }
              ]}
              placeholder="اشرح سبب التبليغ..."
              placeholderTextColor={theme.colors.text.secondary}
              value={reportReason}
              onChangeText={setReportReason}
              multiline
            />

            <Text style={{
              color: theme.colors.text.primary,
              fontWeight: 'bold',
              marginBottom: SPACING.sm,
              fontSize: 15,
              fontFamily: 'ReadexPro_500Medium'
            }}>
              تعليق إضافي (اختياري):
            </Text>

            <TextInput
              style={[
                styles.reportInput,
                { 
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border.primary,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: SPACING.md,
                  marginBottom: SPACING.lg,
                  minHeight: 100,
                  fontSize: 15,
                  fontFamily: 'ReadexPro_400Regular',
                  textAlignVertical: 'top',
                  placeholderTextColor: theme.colors.text.secondary
                }
              ]}
              placeholder="أضف أي معلومات إضافية..."
              placeholderTextColor={theme.colors.text.secondary}
              value={reportComment}
              onChangeText={setReportComment}
              multiline
            />

            <View style={[styles.modalButtons, { 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              gap: SPACING.md,
              marginBottom: SPACING.lg
            }]}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { 
                    backgroundColor: theme.colors.primary,
                    flex: 1,
                    borderRadius: 10,
                    padding: SPACING.md,
                    elevation: 3,
                  }
                ]}
                onPress={handleReportSubmit}
              >
                <Text style={[
                  styles.modalButtonText,
                  { 
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 16,
                    fontFamily: 'ReadexPro_700Bold'
                  }
                ]}>
                  إرسال التبليغ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { 
                    backgroundColor: theme.colors.error,
                    flex: 1,
                    borderRadius: 10,
                    padding: SPACING.md,
                    elevation: 3,
                  }
                ]}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={[
                  styles.modalButtonText,
                  { 
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 16,
                    fontFamily: 'ReadexPro_700Bold'
                  }
                ]}>
                  إلغاء
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </BackgroundSelector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 16,
    gap: SPACING.sm,
    maxWidth: Platform.select({ web: '100%', default: '100%' }),
    maxHeight: Platform.select({ web: '100vh', default: '100%' }),
    alignSelf: 'center',
    width: '100%',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.xs,
    width: '90%',
    alignSelf: 'center',
    marginTop: SPACING.md,
  },
  headerLeftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerRightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timerCenterSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timer: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    fontFamily: 'ReadexPro_700Bold',
  },
  teamName: {
    fontSize: FONTS.sizes.h4,
    fontWeight: FONTS.weights.medium,
    textAlign: 'left',
    fontFamily: 'ReadexPro_500Medium',
  },
  category: {
    fontSize: FONTS.sizes.h4,
    fontWeight: FONTS.weights.medium,
    textAlign: 'right',
    fontFamily: 'ReadexPro_500Medium',
  },
  multiplierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiplierText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionContainer: {
    position: 'relative',
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 8,
    flex: 1,
    maxHeight: '70%',
  },
  reportButton: {
    position: 'absolute',
    bottom: 10, // تغيير الموضع إلى أسفل الحاوية
    right: 10,
    zIndex: 10,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
  },
  question: {
    fontSize: 20, // تقليل حجم الخط من 22 إلى 20
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginBottom: 2, // تقليل المسافة السفلية إلى الحد الأدنى
    fontFamily: 'ReadexPro_700Bold',
  },
  answer: {
    fontSize: 20, // تقليل حجم الخط من 22 إلى 20
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginTop: 2, // تقليل المسافة العلوية إلى الحد الأدنى
    fontFamily: 'ReadexPro_700Bold',
  },
  buttonsContainer: {
    marginTop: SPACING.md, // تقليل المسافة العلوية من 'auto' إلى SPACING.md
    gap: SPACING.sm,
    width: '90%', // نفس عرض شريط العداد
    alignSelf: 'center', // توسيط الأزرار
    marginBottom: SPACING.md, // إضافة هامش سفلي
  },
  buttonsContainerLandscape: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    width: '90%', // نفس عرض شريط العداد
    alignSelf: 'center', // توسيط الأزرار
  },
  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    minWidth: 120,
    alignSelf: 'stretch', // تمدد الزر ليملأ العرض المتاح
  },
  buttonLandscape: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 100,
  },
  buttonText: {
    fontSize: FONTS.sizes.button,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    fontFamily: 'ReadexPro_700Bold',
  },
  buttonTextLandscape: {
    fontSize: FONTS.sizes.caption,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  teamsAnswerContainer: {
    width: '100%', // توسيع الحاوية لتشمل جميع الأزرار
    alignSelf: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm, // إضافة مسافة علوية قبل أزرار الفرق
  },
  teamsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  teamAnswerButton: {
    paddingVertical: 4, // تقليل الحشو العمودي أكثر
    paddingHorizontal: SPACING.md, // تقليل الحشو الأفقي أيضاً
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0, // السماح بتقليص الأزرار
    height: 32, // تقليل الارتفاع أكثر
    marginHorizontal: 2,
  },
  teamButtonText: {
    fontSize: 12, // تقليل حجم الخط أكثر
    textAlign: 'center',
    fontFamily: 'ReadexPro_700Bold', // تغيير الخط ليكون مثل زر "لم يجب أحد"
  },
  modalContainer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: SPACING.lg,
  },
  modalHeader: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  modalBody: {
    padding: SPACING.lg,
  },
  reportQuestionContainer: {
    marginVertical: SPACING.md,
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  reportLabel: {
    fontSize: FONTS.sizes.small,
    marginBottom: SPACING.xs,
    fontWeight: 'bold',
    fontFamily: 'ReadexPro_500Medium',
  },
  reportQuestion: {
    fontSize: FONTS.sizes.body,
    marginBottom: SPACING.md,
    fontFamily: 'ReadexPro_400Regular',
  },
  reportTypeContainer: {
    marginBottom: SPACING.lg,
  },
  reportTypeButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  reportTypeText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'ReadexPro_500Medium',
  },
  reportInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    minHeight: 80,
    maxHeight: 120,
    textAlign: 'right',
    fontFamily: 'ReadexPro_400Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ReadexPro_700Bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToEditorButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    padding: SPACING.sm,
    borderRadius: 8,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToEditorText: {
    color: '#fff',
    fontSize: FONTS.sizes.body,
    marginLeft: SPACING.xs,
  },
});

export default QuestionScreen; 

