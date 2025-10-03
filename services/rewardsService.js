import StorageService from './storageService';

const STORAGE_KEYS = {
  REWARD_HISTORY: 'rewardHistory'
};

const RewardsService = {
  calculateBonus: (streak) => {
    return Math.floor(streak * 1.5);
  },
  
  applyStreak: (currentScore, streak) => {
    const bonus = RewardsService.calculateBonus(streak);
    return currentScore + bonus;
  },

  calculateTimeBonus: (timeLeft, maxTime, basePoints) => {
    const timePercentage = timeLeft / maxTime;
    
    // زيادة المكافآت لتشجيع التثبيت السريع
    const maxBonus = Math.floor(basePoints * 0.2);  // 20% من النقاط الأساسية
    
    if (timePercentage >= 0.8) {  // باقي 80% من الوقت أو أكثر
      return {
        bonus: maxBonus,
        message: `تثبيت ممتاز! +${maxBonus} نقطة مكافأة 🌟`
      };
    }
    if (timePercentage >= 0.6) {  // باقي 60% من الوقت
      const bonus = Math.floor(basePoints * 0.15);  // 15% من النقاط الأساسية
      return {
        bonus,
        message: `تثبيت سريع جداً! +${bonus} نقطة مكافأة ⚡`
      };
    }
    if (timePercentage >= 0.4) {  // باقي 40% من الوقت
      const bonus = Math.floor(basePoints * 0.1);  // 10% من النقاط الأساسية
      return {
        bonus,
        message: `تثبيت سريع! +${bonus} نقطة مكافأة 🚀`
      };
    }
    if (timePercentage >= 0.2) {  // باقي 20% من الوقت
      const bonus = Math.floor(basePoints * 0.05);  // 5% من النقاط الأساسية
      return {
        bonus,
        message: `تثبيت جيد! +${bonus} نقاط مكافأة ✨`
      };
    }
    // لا مكافأة للتثبيت المتأخر
    return {
      bonus: 0,
      message: 'لا توجد مكافأة للتثبيت المتأخر ⏰'
    };
  },

  saveRewardHistory: async (teamName, rewardData) => {
    try {
      // الحصول على تاريخ اللعبة الحالي
      let history = await StorageService.getGameHistory();
      if (!history) {
        history = {
          rewards: {},
          timestamp: new Date().toISOString()
        };
      }

      // التأكد من وجود كائن المكافآت
      if (!history.rewards) {
        history.rewards = {};
      }

      // التأكد من وجود مصفوفة للفريق
      if (!history.rewards[teamName]) {
        history.rewards[teamName] = [];
      }

      // إضافة المكافأة الجديدة
      history.rewards[teamName].push({
        ...rewardData,
        timestamp: new Date().toISOString()
      });

      // حفظ التاريخ المحدث
      await StorageService.saveGameToHistory(history);
      
      return true;
    } catch (error) {
      console.error('خطأ في حفظ سجل المكافآت:', error);
      return false;
    }
  },

  getTeamTotalBonus: async (teamName) => {
    try {
      const history = await StorageService.getGameHistory();
      if (!history || !history.rewards || !history.rewards[teamName]) {
        return 0;
      }

      return history.rewards[teamName].reduce((total, reward) => {
        return total + (reward.bonus || 0);
      }, 0);
    } catch (error) {
      console.error('خطأ في حساب إجمالي المكافآت:', error);
      return 0;
    }
  }
};

export default RewardsService;