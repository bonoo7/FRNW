import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageService from './storageService';
import FirebaseStorageService from './firebaseStorageService';

/**
 * خدمة التخزين المحسنة التي تدمج التخزين المحلي مع Firebase
 */
const EnhancedStorageService = {
  // قائمة المفاتيح التي يجب مزامنتها مع Firebase
  SYNC_KEYS: [
    'currentGame',
    'gameHistory',
    'statistics',
    'usedQuestions',
    'settings',
    'questionCycle'
  ],

  /**
   * حفظ اللعبة الحالية مع المزامنة
   */
  saveCurrentGame: async (gameData, userId = null) => {
    try {
      // حفظ محلي أولاً للسرعة
      await StorageService.saveCurrentGame(gameData);
      
      // إذا كان المستخدم مسجل دخول، احفظ في Firebase
      if (userId && gameData) {
        // إنشاء أو تحديث اللعبة في Firebase
        if (gameData.firebaseGameId) {
          await FirebaseStorageService.updateGame(gameData.firebaseGameId, {
            ...gameData,
            lastSavedAt: new Date().toISOString()
          });
        } else {
          const gameId = await FirebaseStorageService.saveGame(userId, {
            ...gameData,
            lastSavedAt: new Date().toISOString()
          });
          
          // حفظ معرف Firebase محلياً
          gameData.firebaseGameId = gameId;
          await StorageService.saveCurrentGame(gameData);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error saving current game:', error);
      // في حالة فشل Firebase، على الأقل البيانات محفوظة محلياً
      return false;
    }
  },

  /**
   * إنهاء اللعبة مع حفظ الإحصائيات
   */
  completeGame: async (gameData, userId = null) => {
    try {
      // حساب إحصائيات اللعبة
      const gameStats = EnhancedStorageService.calculateGameStats(gameData);
      
      // حفظ في التاريخ المحلي
      await StorageService.saveToHistory(gameData);
      
      // تحديث الإحصائيات المحلية
      await StorageService.updateStatistics(gameStats);
      
      // إذا كان المستخدم مسجل دخول
      if (userId) {
        // إنهاء اللعبة في Firebase
        if (gameData.firebaseGameId) {
          await FirebaseStorageService.completeGame(gameData.firebaseGameId, {
            finalScores: gameData.scores,
            totalQuestions: gameStats.totalQuestions,
            duration: gameStats.playtimeMinutes,
            categories: gameData.categories,
            completedAt: new Date().toISOString()
          });
        }
        
        // تحديث إحصائيات المستخدم في Firebase
        await FirebaseStorageService.updateUserStatistics(userId, gameStats);
        
        // حفظ تفاصيل الأسئلة المجاب عليها
        await EnhancedStorageService.saveGameQuestions(userId, gameData);
      }
      
      // مسح اللعبة الحالية
      await StorageService.clearCurrentGame();
      
      return gameStats;
    } catch (error) {
      console.error('Error completing game:', error);
      throw error;
    }
  },

  /**
   * حفظ تفاصيل الأسئلة المجاب عليها
   */
  saveGameQuestions: async (userId, gameData) => {
    try {
      if (!gameData.questions || !gameData.firebaseGameId) return;
      
      const promises = [];
      
      // التكرار عبر جميع الفئات والصعوبات
      Object.entries(gameData.questions).forEach(([category, difficulties]) => {
        Object.entries(difficulties).forEach(([difficulty, questions]) => {
          questions.forEach((question, index) => {
            if (question.isUsed && question.answeredBy) {
              const questionData = {
                question: question.question,
                answer: question.answer,
                category,
                difficulty,
                isCorrect: question.answeredBy !== 'none',
                pointsEarned: question.earnedPoints || 0,
                timeToAnswer: question.timeToAnswer || 0,
                teamName: question.answeredBy,
                wasDoublePoints: question.wasDoublePoints || false,
                wasPentaPoints: question.wasPentaPoints || false
              };
              
              promises.push(
                FirebaseStorageService.saveQuestionAnswer(
                  userId, 
                  gameData.firebaseGameId, 
                  questionData
                )
              );
            }
          });
        });
      });
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error saving game questions:', error);
    }
  },

  /**
   * حساب إحصائيات اللعبة
   */
  calculateGameStats: (gameData) => {
    let totalQuestions = 0;
    let correctAnswers = 0;
    let fastAnswers = 0;
    let bestStreak = 0;
    let currentStreak = 0;
    
    const categoriesPlayed = gameData.categories || [];
    const finalScores = gameData.scores || {};
    const finalScore = Math.max(...Object.values(finalScores), 0);
    
    // حساب إحصائيات الأسئلة
    if (gameData.questions) {
      Object.entries(gameData.questions).forEach(([category, difficulties]) => {
        Object.entries(difficulties).forEach(([difficulty, questions]) => {
          questions.forEach(question => {
            if (question.isUsed) {
              totalQuestions++;
              
              if (question.answeredBy && question.answeredBy !== 'none') {
                correctAnswers++;
                currentStreak++;
                bestStreak = Math.max(bestStreak, currentStreak);
                
                // إذا كان هناك مكافأة وقت، فهذا يعني إجابة سريعة
                if (question.timeBonus) {
                  fastAnswers++;
                }
              } else {
                currentStreak = 0;
              }
            }
          });
        });
      });
    }
    
    // تحديد الفائز
    const winnerTeam = Object.entries(finalScores).reduce(
      (winner, [team, score]) => score > winner.score ? { team, score } : winner,
      { team: '', score: -1 }
    );
    
    // حساب وقت اللعب (تقديري)
    const playtimeMinutes = Math.max(totalQuestions * 2, 5); // دقيقتان لكل سؤال كحد أدنى
    
    return {
      totalQuestions,
      correctAnswers,
      fastAnswers,
      bestStreak,
      categoriesPlayed,
      finalScore,
      isWinner: false, // سيتم تحديد هذا بناءً على منطق اللعبة
      playtimeMinutes,
      winnerTeam: winnerTeam.team
    };
  },

  /**
   * مزامنة البيانات المحلية مع Firebase
   */
  syncWithFirebase: async (userId) => {
    try {
      if (!userId) return;
      
      // مزامنة الإعدادات
      const localSettings = await StorageService.getSettings();
      if (localSettings) {
        await FirebaseStorageService.updateUserPreferences(userId, localSettings);
      }
      
      // مزامنة الإحصائيات المحلية مع السحابة
      const localStats = await StorageService.getStatistics();
      if (localStats && Object.keys(localStats).length > 0) {
        // يمكن إضافة منطق لدمج الإحصائيات هنا
        console.log('Local statistics found, merging with cloud data...');
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing with Firebase:', error);
      return false;
    }
  },

  /**
   * استيراد البيانات من Firebase إلى التخزين المحلي
   */
  importFromFirebase: async (userId) => {
    try {
      if (!userId) return;
      
      // استيراد الألعاب الأخيرة
      const userGames = await FirebaseStorageService.getUserGames(userId, 'completed', 50);
      
      // استيراد الأسئلة المجاب عليها مؤخراً
      const answeredQuestions = await FirebaseStorageService.getAnsweredQuestions(userId, 500);
      
      // تحديث قائمة الأسئلة المستخدمة محلياً
      if (answeredQuestions.length > 0) {
        const usedQuestionIds = answeredQuestions.map(q => 
          `${q.category}-${q.difficulty}-${q.question.substring(0, 50)}`
        );
        await StorageService.saveUsedQuestions(usedQuestionIds);
      }
      
      return {
        gamesImported: userGames.length,
        questionsImported: answeredQuestions.length
      };
    } catch (error) {
      console.error('Error importing from Firebase:', error);
      return null;
    }
  },

  /**
   * حفظ تقرير سؤال
   */
  saveQuestionReport: async (reportData, userId = null) => {
    try {
      // حفظ محلي أولاً
      await StorageService.saveItem(`report_${Date.now()}`, JSON.stringify(reportData));
      
      // حفظ في Firebase إذا كان المستخدم مسجل دخول
      if (userId) {
        await FirebaseStorageService.saveQuestionReport(userId, reportData);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving question report:', error);
      return false;
    }
  },

  /**
   * تحديث تفضيلات المستخدم
   */
  updateSettings: async (settings, userId = null) => {
    try {
      // حفظ محلي
      await StorageService.saveSettings(settings);
      
      // حفظ في Firebase
      if (userId) {
        await FirebaseStorageService.updateUserPreferences(userId, settings);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  },

  /**
   * الحصول على الإحصائيات المدمجة (محلي + سحابي)
   */
  getCombinedStatistics: async (userId = null) => {
    try {
      // الإحصائيات المحلية
      const localStats = await StorageService.getStatistics();
      
      // إذا لم يكن هناك مستخدم مسجل، أرجع المحلية فقط
      if (!userId) {
        return localStats || {};
      }
      
      // إذا كان هناك مستخدم، يمكن دمج الإحصائيات من Firebase
      // (يتطلب تطوير إضافي لمنطق الدمج)
      return localStats || {};
    } catch (error) {
      console.error('Error getting combined statistics:', error);
      return {};
    }
  }
};

export default EnhancedStorageService;