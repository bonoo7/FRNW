import StorageService from './storageService';
import categoryImages from '../assets/categories';
import allQuestions from '../data/categories/index.js';

export const validateGameData = (data) => {
  if (!data) {
    throw new Error('لا توجد بيانات للعبة');
  }

  if (!data.teams || !Array.isArray(data.teams)) {
    throw new Error('بيانات الفرق غير صحيحة');
  }

  // تصحيح عدد الفرق إذا كان غير متطابق
  if (data.teamCount !== data.teams.length) {
    data.teamCount = data.teams.length;
  }

  // التأكد من وجود الحقول الأساسية
  data.categories = data.categories || [];
  data.questions = data.questions || {};
  data.scores = data.scores || {};
  data.currentTeamIndex = data.currentTeamIndex || 0;

  return data;
};

export const GameService = {
  // إدارة الأسئلة
  questions: {
    getForCategory: async (category) => {
      try {
        if (!category) {
          throw new Error('الفئة غير محددة');
        }

        const currentCycle = await StorageService.getQuestionCycle();
        const usedQuestions = await StorageService.getUsedQuestions();

        // التأكد من وجود الأسئلة للفئة
        const categoryQuestions = allQuestions.filter(q => q.category === category);
        if (!categoryQuestions || categoryQuestions.length === 0) {
          console.error(`لا توجد أسئلة للفئة: ${category}`);
          throw new Error(`لا توجد أسئلة متوفرة للفئة: ${category}`);
        }

        // تنظيم الأسئلة حسب الصعوبة
        const getQuestionsForDifficulty = (difficulty, count = 2) => {
          // فلترة الأسئلة حسب المستوى
          const difficultyQuestions = categoryQuestions.filter(q => 
            q.difficulty === difficulty && 
            !q.isDisabled
          );

          if (!difficultyQuestions || difficultyQuestions.length === 0) {
            console.error(`لا توجد أسئلة كافية لمستوى ${difficulty} في فئة ${category}`);
            throw new Error(`لا توجد أسئلة كافية لمستوى ${difficulty} في فئة ${category}`);
          }

          // الأسئلة غير المستخدمة في الدورة الحالية
          const unusedQuestions = difficultyQuestions.filter(q => 
            !usedQuestions.some(used => 
              used.question === q.question && 
              used.cycle === currentCycle
            )
          );

          // إذا كان عدد الأسئلة غير المستخدمة أقل من العدد المطلوب
          // يجب التفكير في إعادة تدوير الأسئلة (زيادة الدورة)
          let questionsToUse = unusedQuestions;
          let shouldIncrement = false;

          // إذا لم يكن هناك أسئلة متاحة غير مستخدمة كافية
          if (unusedQuestions.length < count) {
            console.warn(`تم استخدام معظم الأسئلة في مستوى ${difficulty} للفئة ${category}. باقي: ${unusedQuestions.length}`);
            
            // إذا لم تكن هناك أسئلة غير مستخدمة على الإطلاق، قم بزيادة الدورة واستخدام جميع الأسئلة
            if (unusedQuestions.length === 0) {
              shouldIncrement = true;
              questionsToUse = difficultyQuestions;
            }
          }

          // خلط الأسئلة المتاحة بشكل عشوائي
          const shuffled = [...questionsToUse].sort(() => 0.5 - Math.random());
          
          // اختيار العدد المطلوب من الأسئلة
          const selected = shuffled.slice(0, Math.min(count, shuffled.length))
            .map(q => ({
              ...q,
              isUsed: false,
              points: difficulty === 'سهل' ? 50 : 
                     difficulty === 'متوسط' ? 100 : 200
            }));

          // إذا كان يجب زيادة الدورة (نفدت جميع الأسئلة)
          if (shouldIncrement) {
            // سيتم زيادة الدورة بعد تجهيز كل الأسئلة للجولة، وليس هنا
            console.warn('سيتم زيادة دورة الأسئلة لأن جميع الأسئلة قد تم استخدامها');
          }

          return {
            questions: selected,
            shouldIncrementCycle: shouldIncrement
          };
        };

        // جمع الأسئلة من جميع مستويات الصعوبة
        const easy = getQuestionsForDifficulty('سهل', 2);
        const medium = getQuestionsForDifficulty('متوسط', 2);
        const hard = getQuestionsForDifficulty('صعب', 2);

        // زيادة دورة الأسئلة إذا نفدت الأسئلة في أي مستوى
        if (easy.shouldIncrementCycle || medium.shouldIncrementCycle || hard.shouldIncrementCycle) {
          await StorageService.incrementQuestionCycle();
        }

        const result = {
          'سهل': easy.questions,
          'متوسط': medium.questions,
          'صعب': hard.questions
        };

        // التحقق من وجود أسئلة في جميع المستويات
        const totalQuestions = Object.values(result).reduce((sum, questions) => sum + questions.length, 0);
        if (totalQuestions === 0) {
          throw new Error(`لا توجد أسئلة كافية في الفئة ${category}`);
        }

        return result;
      } catch (error) {
        console.error(`خطأ في جلب أسئلة الفئة ${category}:`, error);
        throw error;
      }
    },

    markAsUsed: async (questionId, category, difficulty) => {
      try {
        const currentCycle = await StorageService.getQuestionCycle();
        await StorageService.saveUsedQuestion({
          question: questionId,
          category,
          difficulty,
          cycle: currentCycle,
          timestamp: new Date().toISOString()
        });
        return true;
      } catch (error) {
        console.error('خطأ في تحديث حالة السؤال:', error);
        return false;
      }
    },

    checkAvailability: async (category) => {
      try {
        const currentCycle = await StorageService.getQuestionCycle();
        const usedQuestions = await StorageService.getUsedQuestions() || [];
        
        // فلترة الأسئلة المتاحة في الفئة
        const categoryQuestions = allQuestions.filter(q => q.category === category);
        
        // حساب الأسئلة المستخدمة في الدورة الحالية
        const usedInCurrentCycle = usedQuestions.filter(q => 
          q.category === category && 
          q.cycle === currentCycle
        ).length;

        return {
          total: categoryQuestions.length,
          available: categoryQuestions.filter(q => !q.isDisabled).length - usedInCurrentCycle,
          needsNewCycle: usedInCurrentCycle >= categoryQuestions.length
        };
      } catch (error) {
        console.error('خطأ في فحص توفر الأسئلة:', error);
        return { total: 0, available: 0, needsNewCycle: false };
      }
    }
  },

  // إدارة النقاط
  scoring: {
    calculatePoints: (difficulty, isBonus) => {
      const basePoints = {
        easy: 1,
        medium: 2,
        hard: 3
      }[difficulty] || 1;

      return isBonus ? basePoints * 2 : basePoints;
    },

    updateTeamScore: async (team, points) => {
      try {
        const gameData = await StorageService.getCurrentGame();
        if (!gameData) {
          throw new Error('لا يمكن العثور على بيانات اللعبة الحالية');
        }

        // التأكد من وجود كائن النقاط
        if (!gameData.scores) {
          gameData.scores = {};
        }

        // تحديث نقاط الفريق
        gameData.scores[team] = (gameData.scores[team] || 0) + points;

        // حفظ كل بيانات اللعبة
        await StorageService.saveCurrentGame(gameData);
        return gameData.scores;
      } catch (error) {
        console.error('خطأ في تحديث النقاط:', error);
        throw error; // رمي الخطأ للتعامل معه في المستوى الأعلى
      }
    },

    getWinners: (scores) => {
      const maxScore = Math.max(...Object.values(scores));
      return Object.entries(scores)
        .filter(([_, score]) => score === maxScore)
        .map(([team]) => team);
    }
  },

  // إدارة دور الفرق
  teams: {
    getNextTeam: (teams, currentIndex) => {
      return teams[(currentIndex + 1) % teams.length];
    },

    canUseBonus: (team, usedBonuses) => {
      return !usedBonuses[team];
    }
  },

  // إدارة حالة اللعبة
  gameState: {
    save: async (state) => {
      try {
        await StorageService.saveCurrentGame(state);
        return true;
      } catch (error) {
        console.error('خطأ في حفظ حالة اللعبة:', error);
        return false;
      }
    },

    end: async (gameData) => {
      try {
        await StorageService.saveGameResults(gameData);
        return true;
      } catch (error) {
        console.error('خطأ في إنهاء اللعبة:', error);
        return false;
      }
    },

    initialize: async (gameData) => {
      try {
        const { teams, categories, roundName } = gameData;
        
        // تحميل الأسئلة لكل فئة
        const roundQuestions = {};
        let hasErrors = false;
        let errorMessages = [];

        for (const category of categories) {
          try {
            roundQuestions[category] = await GameService.questions.getForCategory(category);
          } catch (error) {
            console.error(`خطأ في تحميل أسئلة الفئة ${category}:`, error);
            hasErrors = true;
            errorMessages.push(`${category}`);
            // نستمر في المحاولة مع باقي الفئات
            continue;
          }
        }

        // إذا كان هناك أخطاء في تحميل بعض الفئات
        if (hasErrors) {
          throw new Error(`فشل في تحميل أسئلة الفئات التالية: ${errorMessages.join('، ')}`);
        }

        const initialState = {
          roundName,
          teams,
          categories,
          currentTeamIndex: 0,
          scores: teams.reduce((acc, team) => ({
            ...acc,
            [team]: 0
          }), {}),
          doublePoints: teams.reduce((acc, team) => ({
            ...acc,
            [team]: false
          }), {}),
          questions: roundQuestions,
          startTime: new Date().toISOString()
        };

        await GameService.gameState.save(initialState);
        return initialState;
      } catch (error) {
        console.error('خطأ في تهيئة اللعبة:', error);
        throw new Error(error.message || 'حدث خطأ في تحميل بيانات اللعبة');
      }
    },

    load: async () => {
      try {
        const currentGame = await StorageService.getCurrentGame();
        const usedQuestions = await StorageService.getUsedQuestions();
        return {
          ...currentGame,
          usedQuestions: usedQuestions || []
        };
      } catch (error) {
        console.error('خطأ في تحميل حالة اللعبة:', error);
        return null;
      }
    }
  },

  getCategories: () => {
    return Promise.resolve(Object.keys(categoryImages));
  },

  initializeGame: async (gameData) => {
    try {
      gameData = validateGameData(gameData);
      const existingData = await StorageService.getCurrentGame();
      
      if (existingData) {
        gameData = {
          ...existingData,
          ...gameData,
          timestamp: new Date().toISOString()
        };
        gameData = validateGameData(gameData);
      }
      
      return gameData;
    } catch (error) {
      console.error('Error initializing game:', error);
      throw error;
    }
  }
}; 