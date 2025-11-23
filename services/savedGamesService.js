import { collection, addDoc, getDocs, deleteDoc, doc, query, where, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const SAVED_GAMES_COLLECTION = 'savedGames';

const SavedGamesService = {
  // حفظ لعبة جديدة
  saveGame: async (userId, gameData) => {
    try {
      if (!userId || !gameData) {
        throw new Error('Missing userId or gameData');
      }

      // إذا كانت لعبة معاد تشغيلها، لا نحفظها كلعبة جديدة
      if (gameData.isReplaying) {
        console.log('هذه لعبة معاد تشغيلها - لن يتم حفظها كلعبة جديدة');
        return null;
      }

      const gameToSave = {
        userId,
        roundName: gameData.roundName || 'جولة بدون اسم',
        teams: gameData.teams || [],
        categories: gameData.categories || [],
        selectedQuestions: gameData.selectedQuestions || [],
        questions: gameData.questions || {}, // حفظ جميع الأسئلة
        scores: gameData.scores || {},
        statistics: gameData.statistics || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCompleted: gameData.isCompleted || false,
        currentTeamIndex: gameData.currentTeamIndex || 0,
        currentCategoryIndex: gameData.currentCategoryIndex || 0,
        replayCount: 0, // عدد مرات إعادة التشغيل
      };

      const docRef = await addDoc(collection(db, SAVED_GAMES_COLLECTION), gameToSave);
      console.log('تم حفظ اللعبة بنجاح:', docRef.id);
      
      return {
        id: docRef.id,
        ...gameToSave
      };
    } catch (error) {
      console.error('Error saving game:', error);
      throw error;
    }
  },

  // الحصول على جميع الألعاب المحفوظة للمستخدم
  getUserSavedGames: async (userId) => {
    try {
      if (!userId) {
        throw new Error('Missing userId');
      }

      // بدلاً من استخدام query مع ترتيب، نحصل على كل المستندات ثم نرتبها محلياً
      const q = query(
        collection(db, SAVED_GAMES_COLLECTION),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const games = [];
      
      querySnapshot.forEach((doc) => {
        games.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // ترتيب محلي حسب التاريخ (الأحدث أولاً)
      games.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return games;
    } catch (error) {
      console.error('Error getting saved games:', error);
      throw error;
    }
  },

  // الحصول على لعبة محفوظة واحدة
  getSavedGame: async (gameId) => {
    try {
      if (!gameId) {
        throw new Error('Missing gameId');
      }

      const gameRef = doc(db, SAVED_GAMES_COLLECTION, gameId);
      const gameDoc = await getDoc(gameRef);

      if (!gameDoc.exists()) {
        return null;
      }

      return {
        id: gameDoc.id,
        ...gameDoc.data()
      };
    } catch (error) {
      console.error('Error getting saved game:', error);
      throw error;
    }
  },

  // حذف لعبة محفوظة
  deleteSavedGame: async (gameId) => {
    try {
      if (!gameId) {
        throw new Error('Missing gameId');
      }

      await deleteDoc(doc(db, SAVED_GAMES_COLLECTION, gameId));
      console.log('تم حذف اللعبة بنجاح:', gameId);
      
      return true;
    } catch (error) {
      console.error('Error deleting saved game:', error);
      throw error;
    }
  },

  // تحديث لعبة محفوظة (مثل استكمالها)
  updateSavedGame: async (gameId, updates) => {
    try {
      if (!gameId || !updates) {
        throw new Error('Missing gameId or updates');
      }

      const gameRef = doc(db, SAVED_GAMES_COLLECTION, gameId);
      const gameDoc = await getDoc(gameRef);

      if (!gameDoc.exists()) {
        throw new Error('Game not found');
      }

      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(gameRef, updatedData);
      console.log('تم تحديث اللعبة بنجاح:', gameId);
      
      return {
        id: gameId,
        ...gameDoc.data(),
        ...updatedData
      };
    } catch (error) {
      console.error('Error updating saved game:', error);
      throw error;
    }
  },

  // استكمال لعبة (بدون حفظ كلعبة جديدة)
  continueGame: async (savedGame) => {
    try {
      if (!savedGame) {
        throw new Error('Missing saved game');
      }

      // الأسئلة تبقى كما هي (مع علم isUsed)
      return {
        roundName: savedGame.roundName,
        teams: [...savedGame.teams],
        categories: [...savedGame.categories],
        selectedQuestions: [...(savedGame.selectedQuestions || [])],
        scores: { ...savedGame.scores }, // استرجاع النقاط السابقة
        statistics: JSON.parse(JSON.stringify(savedGame.statistics || {
          totalQuestions: savedGame.statistics?.totalQuestions || 0,
          answeredQuestions: savedGame.statistics?.answeredQuestions || 0,
          correctAnswers: savedGame.statistics?.correctAnswers || 0,
          doublePointsUsed: 0,
          categoryStats: savedGame.statistics?.categoryStats || {}
        })),
        questions: JSON.parse(JSON.stringify(savedGame.questions || {})), // نسخة عميقة
        currentTeamIndex: savedGame.currentTeamIndex || 0,
        currentCategoryIndex: savedGame.currentCategoryIndex || 0,
        isContinuing: true, // علم للاستكمال ✓ مهم جداً
        savedGameId: savedGame.id, // ✓ مهم جداً: معرف اللعبة الأصلية
        isReplaying: false
      };
    } catch (error) {
      console.error('Error continuing game:', error);
      throw error;
    }
  },

  // تحويل لعبة محفوظة إلى لعبة جديدة (بدون خصم كريديت)
  replayGame: async (savedGame) => {
    try {
      if (!savedGame) {
        throw new Error('Missing saved game');
      }

      // إعادة تعيين جميع الأسئلة (إزالة علم isUsed)
      const resetQuestions = {};
      if (savedGame.questions) {
        Object.keys(savedGame.questions).forEach(category => {
          resetQuestions[category] = {};
          Object.keys(savedGame.questions[category]).forEach(difficulty => {
            resetQuestions[category][difficulty] = savedGame.questions[category][difficulty].map(q => ({
              ...q,
              isUsed: false // إعادة تعيين حالة الاستخدام
            }));
          });
        });
      }

      return {
        roundName: savedGame.roundName,
        teams: [...savedGame.teams],
        categories: [...savedGame.categories],
        selectedQuestions: [...(savedGame.selectedQuestions || [])],
        scores: {}, // نقاط جديدة من الصفر
        statistics: {
          totalQuestions: savedGame.statistics?.totalQuestions || 0,
          answeredQuestions: 0,
          correctAnswers: 0,
          doublePointsUsed: 0,
          categoryStats: {}
        },
        questions: resetQuestions, // جميع الأسئلة معاد تعيينها
        currentTeamIndex: 0,
        currentCategoryIndex: 0,
        isReplaying: true, // علم لمنع الحفظ
        replayFromGameId: savedGame.id
      };
    } catch (error) {
      console.error('Error replaying game:', error);
      throw error;
    }
  }
};

export default SavedGamesService;
