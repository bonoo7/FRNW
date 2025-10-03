import StorageService from './storageService';

const STORAGE_KEYS = {
  PENTA_POINTS_HISTORY: 'pentaPointsHistory'
};

/**
 * خدمة نظام "علي وعلى أعدائي" (مضاعفة النقاط ×5)
 * تدير هذه الخدمة منطق مضاعفة النقاط بمقدار 5 مرات لجميع الفرق
 */
const PentaPointsService = {
  /**
   * التحقق من حالة تفعيل نظام "علي وعلى أعدائي"
   * @returns {Promise<boolean>} - حالة التفعيل
   */
  isEnabled: async () => {
    try {
      const settings = await StorageService.getSettings();
      return settings?.pentaPointsEnabled ?? true;
    } catch (error) {
      console.error('خطأ في التحقق من حالة تفعيل نظام علي وعلى أعدائي:', error);
      return true; // القيمة الافتراضية هي التفعيل
    }
  },

  /**
   * تغيير حالة تفعيل نظام "علي وعلى أعدائي"
   * @param {boolean} value - حالة التفعيل الجديدة
   * @returns {Promise<void>}
   */
  toggleEnabled: async (value) => {
    try {
      const settings = await StorageService.getSettings() || {};
      settings.pentaPointsEnabled = value;
      await StorageService.saveSettings(settings);
    } catch (error) {
      console.error('خطأ في تغيير حالة تفعيل نظام علي وعلى أعدائي:', error);
    }
  },

  /**
   * التحقق مما إذا كان الفريق هو صاحب أقل نقاط
   * @param {string} teamName - اسم الفريق
   * @param {Array<string>} validTeams - قائمة الفرق الصالحة
   * @param {Object} validScores - نقاط الفرق
   * @returns {boolean} - ما إذا كان الفريق هو صاحب أقل نقاط
   */
  isLowestScoringTeam: (teamName, validTeams, validScores) => {
    if (!validTeams.length || !validScores) return false;
    
    const currentTeamScore = validScores[teamName] || 0;
    
    for (const team of validTeams) {
      if (team !== teamName) {
        const teamScore = validScores[team] || 0;
        if (teamScore < currentTeamScore) {
          return false;
        }
      }
    }
    
    const lowestScore = Math.min(...validTeams.map(team => validScores[team] || 0));
    return currentTeamScore === lowestScore;
  },

  /**
   * حساب قيمة المضاعف لمضاعفة النقاط ×5
   * @returns {number} - قيمة المضاعف (5)
   */
  calculateMultiplier: () => {
    return 5;
  },

  /**
   * تطبيق مضاعفة النقاط ×5 على النقاط المعطاة
   * @param {number} points - النقاط الأصلية
   * @returns {number} - النقاط بعد المضاعفة
   */
  applyPentaPoints: (points) => {
    return points * PentaPointsService.calculateMultiplier();
  },

  /**
   * التحقق من حالة مضاعفة النقاط ×5 وتطبيقها إذا كانت مفعلة
   * @param {number} points - النقاط الأصلية
   * @param {boolean} isPentaPoints - ما إذا كانت مضاعفة النقاط ×5 مفعلة
   * @returns {number} - النقاط النهائية بعد تطبيق المضاعفة إذا كانت مفعلة
   */
  calculatePoints: (points, isPentaPoints) => {
    if (isPentaPoints) {
      return PentaPointsService.applyPentaPoints(points);
    }
    return points;
  },

  /**
   * تحديث حالة استخدام مضاعفة النقاط ×5 للفريق
   * @param {Object} gameData - بيانات اللعبة الحالية
   * @param {string} teamName - اسم الفريق
   * @returns {Object} - بيانات اللعبة المحدثة
   */
  updateUsedPentaPoints: (gameData, teamName) => {
    const updatedGameData = { ...gameData };
    
    if (!updatedGameData.usedPentaPoints) {
      updatedGameData.usedPentaPoints = {};
    }
    
    updatedGameData.usedPentaPoints = {
      ...updatedGameData.usedPentaPoints,
      [teamName]: true
    };
    
    return updatedGameData;
  },

  /**
   * حفظ سجل استخدام مضاعفة النقاط ×5
   * @param {string} teamName - اسم الفريق
   * @param {Object} pentaPointsData - بيانات استخدام مضاعفة النقاط ×5
   * @returns {Promise<void>}
   */
  savePentaPointsHistory: async (teamName, pentaPointsData) => {
    try {
      // الحصول على السجل الحالي
      const historyString = await StorageService.getData(STORAGE_KEYS.PENTA_POINTS_HISTORY) || '{}';
      const history = JSON.parse(historyString);
      
      // إضافة سجل جديد للفريق
      if (!history[teamName]) {
        history[teamName] = [];
      }
      
      history[teamName].push({
        ...pentaPointsData,
        timestamp: new Date().toISOString()
      });
      
      // حفظ السجل المحدث
      await StorageService.storeData(STORAGE_KEYS.PENTA_POINTS_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('خطأ في حفظ سجل مضاعفة النقاط ×5:', error);
    }
  },

  /**
   * الحصول على سجل استخدام مضاعفة النقاط ×5 للفريق
   * @param {string} teamName - اسم الفريق
   * @returns {Promise<Array>} - سجل استخدام مضاعفة النقاط ×5 للفريق
   */
  getPentaPointsHistory: async (teamName) => {
    try {
      const historyString = await StorageService.getData(STORAGE_KEYS.PENTA_POINTS_HISTORY) || '{}';
      const history = JSON.parse(historyString);
      
      return history[teamName] || [];
    } catch (error) {
      console.error('خطأ في الحصول على سجل مضاعفة النقاط ×5:', error);
      return [];
    }
  }
};

export default PentaPointsService;
