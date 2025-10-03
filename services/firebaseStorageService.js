import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  increment,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * خدمة Firebase للتخزين السحابي
 * تدير جميع عمليات قاعدة البيانات المتعلقة باللعبة
 */
const FirebaseStorageService = {
  
  // ====== إدارة الألعاب ======
  
  /**
   * حفظ لعبة جديدة في قاعدة البيانات
   */
  saveGame: async (userId, gameData) => {
    try {
      const gameRef = collection(db, 'games');
      const gameDoc = await addDoc(gameRef, {
        userId,
        ...gameData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active' // active, completed, paused
      });
      
      console.log('Game saved with ID:', gameDoc.id);
      return gameDoc.id;
    } catch (error) {
      console.error('Error saving game:', error);
      throw error;
    }
  },

  /**
   * تحديث بيانات لعبة موجودة
   */
  updateGame: async (gameId, updates) => {
    try {
      const gameRef = doc(db, 'games', gameId);
      await updateDoc(gameRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('Game updated successfully');
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  },

  /**
   * إنهاء لعبة وحفظ النتائج النهائية
   */
  completeGame: async (gameId, finalResults) => {
    try {
      const gameRef = doc(db, 'games', gameId);
      
      await updateDoc(gameRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        finalResults,
        updatedAt: serverTimestamp()
      });

      console.log('Game completed successfully');
      return true;
    } catch (error) {
      console.error('Error completing game:', error);
      throw error;
    }
  },

  /**
   * الحصول على ألعاب المستخدم
   */
  getUserGames: async (userId, status = 'all', limitCount = 20) => {
    try {
      let q = query(
        collection(db, 'games'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (status !== 'all') {
        q = query(
          collection(db, 'games'),
          where('userId', '==', userId),
          where('status', '==', status),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const games = [];
      
      querySnapshot.forEach((doc) => {
        games.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return games;
    } catch (error) {
      console.error('Error getting user games:', error);
      throw error;
    }
  },

  // ====== إدارة الإحصائيات ======

  /**
   * تحديث إحصائيات المستخدم بعد انتهاء اللعبة
   */
  updateUserStatistics: async (userId, gameStats) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      const currentStats = userDoc.data().statistics || {};
      
      // حساب الإحصائيات الجديدة
      const newTotalGames = (currentStats.totalGames || 0) + 1;
      const newTotalQuestions = (currentStats.totalQuestionsAnswered || 0) + gameStats.totalQuestions;
      const newCorrectAnswers = (currentStats.totalCorrectAnswers || 0) + gameStats.correctAnswers;
      const newTotalScore = (currentStats.totalScore || 0) + gameStats.finalScore;
      const newAverageScore = Math.round(newTotalScore / newTotalGames);
      
      // تحديث الفئات المفضلة
      const favoriteCategories = [...(currentStats.favoriteCategories || [])];
      gameStats.categoriesPlayed.forEach(category => {
        const existingCategory = favoriteCategories.find(fav => fav.name === category);
        if (existingCategory) {
          existingCategory.count += 1;
        } else {
          favoriteCategories.push({ name: category, count: 1 });
        }
      });
      
      // ترتيب الفئات حسب الأكثر لعباً
      favoriteCategories.sort((a, b) => b.count - a.count);

      const updatedStats = {
        totalGames: newTotalGames,
        totalQuestionsAnswered: newTotalQuestions,
        totalCorrectAnswers: newCorrectAnswers,
        totalScore: newTotalScore,
        averageScore: newAverageScore,
        favoriteCategories: favoriteCategories.slice(0, 10), // أفضل 10 فئات
        gamesWon: (currentStats.gamesWon || 0) + (gameStats.isWinner ? 1 : 0),
        streakRecord: Math.max(currentStats.streakRecord || 0, gameStats.bestStreak || 0),
        playtimeMinutes: (currentStats.playtimeMinutes || 0) + Math.round(gameStats.playtimeMinutes || 0)
      };

      await updateDoc(userRef, {
        statistics: updatedStats,
        lastGameAt: serverTimestamp()
      });

      // التحقق من الإنجازات الجديدة
      await FirebaseStorageService.checkAndUpdateAchievements(userId, updatedStats, gameStats);

      return updatedStats;
    } catch (error) {
      console.error('Error updating user statistics:', error);
      throw error;
    }
  },

  /**
   * حفظ تفاصيل سؤال تم الإجابة عليه
   */
  saveQuestionAnswer: async (userId, gameId, questionData) => {
    try {
      const answerRef = collection(db, 'questionAnswers');
      
      await addDoc(answerRef, {
        userId,
        gameId,
        question: questionData.question,
        answer: questionData.answer,
        category: questionData.category,
        difficulty: questionData.difficulty,
        isCorrect: questionData.isCorrect,
        pointsEarned: questionData.pointsEarned,
        timeToAnswer: questionData.timeToAnswer,
        teamName: questionData.teamName,
        wasDoublePoints: questionData.wasDoublePoints || false,
        wasPentaPoints: questionData.wasPentaPoints || false,
        answeredAt: serverTimestamp()
      });

    } catch (error) {
      console.error('Error saving question answer:', error);
      throw error;
    }
  },

  /**
   * الحصول على أسئلة مجاب عليها سابقاً
   */
  getAnsweredQuestions: async (userId, limit = 100) => {
    try {
      const q = query(
        collection(db, 'questionAnswers'),
        where('userId', '==', userId),
        orderBy('answeredAt', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      const questions = [];
      
      querySnapshot.forEach((doc) => {
        questions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return questions;
    } catch (error) {
      console.error('Error getting answered questions:', error);
      throw error;
    }
  },

  // ====== إدارة الإنجازات ======

  /**
   * التحقق من الإنجازات الجديدة وتحديثها
   */
  checkAndUpdateAchievements: async (userId, userStats, gameStats) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return;

      const currentAchievements = userDoc.data().achievements || {};
      const newAchievements = { ...currentAchievements };
      let hasNewAchievements = false;

      // إنجاز اللعبة الأولى
      if (!newAchievements.firstGame && userStats.totalGames >= 1) {
        newAchievements.firstGame = true;
        hasNewAchievements = true;
      }

      // إنجازات النقاط
      if (!newAchievements.first100Points && userStats.totalScore >= 100) {
        newAchievements.first100Points = true;
        hasNewAchievements = true;
      }
      
      if (!newAchievements.first500Points && userStats.totalScore >= 500) {
        newAchievements.first500Points = true;
        hasNewAchievements = true;
      }
      
      if (!newAchievements.first1000Points && userStats.totalScore >= 1000) {
        newAchievements.first1000Points = true;
        hasNewAchievements = true;
      }

      // إنجاز الإجابات السريعة
      if (!newAchievements.speedDemon && gameStats.fastAnswers >= 5) {
        newAchievements.speedDemon = true;
        hasNewAchievements = true;
      }

      // إنجاز اللعبة المثالية
      if (!newAchievements.perfectGame && gameStats.correctAnswers === gameStats.totalQuestions && gameStats.totalQuestions >= 10) {
        newAchievements.perfectGame = true;
        hasNewAchievements = true;
      }

      // إنجاز إتقان الفئات
      const categoryMasters = newAchievements.categoryMaster || [];
      gameStats.categoriesPlayed.forEach(category => {
        if (!categoryMasters.includes(category)) {
          // إذا لعب المستخدم 10 ألعاب في هذه الفئة
          const categoryCount = userStats.favoriteCategories.find(fav => fav.name === category)?.count || 0;
          if (categoryCount >= 10) {
            categoryMasters.push(category);
            hasNewAchievements = true;
          }
        }
      });
      newAchievements.categoryMaster = categoryMasters;

      if (hasNewAchievements) {
        await updateDoc(userRef, {
          achievements: newAchievements,
          lastAchievementAt: serverTimestamp()
        });

        // إرسال الإنجازات الجديدة للمستخدم
        return FirebaseStorageService.getNewAchievements(currentAchievements, newAchievements);
      }

      return [];
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  },

  /**
   * الحصول على الإنجازات الجديدة
   */
  getNewAchievements: (oldAchievements, newAchievements) => {
    const newOnes = [];
    
    Object.keys(newAchievements).forEach(key => {
      if (!oldAchievements[key] && newAchievements[key]) {
        newOnes.push({
          id: key,
          name: FirebaseStorageService.getAchievementName(key),
          description: FirebaseStorageService.getAchievementDescription(key),
          unlockedAt: new Date().toISOString()
        });
      }
    });

    return newOnes;
  },

  /**
   * أسماء الإنجازات
   */
  getAchievementName: (achievementId) => {
    const names = {
      firstGame: 'أول لعبة',
      first100Points: 'المئة الأولى',
      first500Points: 'نصف الألف',
      first1000Points: 'الألف الأولى',
      speedDemon: 'السرعة البرق',
      perfectGame: 'اللعبة المثالية',
      categoryMaster: 'خبير الفئة'
    };
    return names[achievementId] || achievementId;
  },

  /**
   * أوصاف الإنجازات
   */
  getAchievementDescription: (achievementId) => {
    const descriptions = {
      firstGame: 'أكمل أول لعبة لك',
      first100Points: 'اجمع 100 نقطة إجمالية',
      first500Points: 'اجمع 500 نقطة إجمالية',
      first1000Points: 'اجمع 1000 نقطة إجمالية',
      speedDemon: 'أجب على 5 أسئلة بسرعة في لعبة واحدة',
      perfectGame: 'أجب على جميع الأسئلة بشكل صحيح',
      categoryMaster: 'العب 10 ألعاب في نفس الفئة'
    };
    return descriptions[achievementId] || '';
  },

  // ====== إدارة التفضيلات ======

  /**
   * تحديث تفضيلات المستخدم
   */
  updateUserPreferences: async (userId, preferences) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        preferences: {
          ...preferences
        },
        updatedAt: serverTimestamp()
      });

    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  // ====== إدارة التقارير ======

  /**
   * حفظ تقرير عن سؤال
   */
  saveQuestionReport: async (userId, reportData) => {
    try {
      const reportRef = collection(db, 'questionReports');
      
      await addDoc(reportRef, {
        userId,
        question: reportData.question,
        answer: reportData.answer,
        reportType: reportData.reportType,
        reason: reportData.reason,
        comment: reportData.comment,
        status: 'pending', // pending, reviewed, resolved
        createdAt: serverTimestamp()
      });

    } catch (error) {
      console.error('Error saving question report:', error);
      throw error;
    }
  },

  // ====== إحصائيات عامة ======

  /**
   * الحصول على إحصائيات اللعبة العامة
   */
  getGlobalStatistics: async () => {
    try {
      // يمكن إضافة مجموعة للإحصائيات العامة
      // مثل عدد الألعاب الإجمالي، الأسئلة المجاب عليها، إلخ
      // هذه الوظيفة يمكن تطويرها لاحقاً
      return {
        totalGames: 0,
        totalPlayers: 0,
        mostPlayedCategory: '',
        averageGameDuration: 0
      };
    } catch (error) {
      console.error('Error getting global statistics:', error);
      throw error;
    }
  }
};

export default FirebaseStorageService;