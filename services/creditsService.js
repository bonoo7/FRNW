import { 
  doc, 
  getDoc, 
  runTransaction,
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * خدمة إدارة رصيد المستخدم (Credits System)
 * تطبيق نظام Freemium مع حماية كاملة
 */
const CreditsService = {
  
  // ====== الإعدادات الثابتة ======
  FREE_CREDITS: 2, // عدد الألعاب المجانية للمستخدم الجديد
  CREDIT_COST_PER_GAME: 1, // تكلفة اللعبة الواحدة
  
  /**
   * ✅ الحصول على رصيد المستخدم الحالي
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<number>} - الرصيد الحالي
   */
  getUserCredits: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('المستخدم غير موجود');
      }
      
      const userData = userSnap.data();
      return userData.credits?.remaining || 0;
    } catch (error) {
      console.error('Error getting user credits:', error);
      throw error;
    }
  },

  /**
   * ✅ التحقق من توفر رصيد كافي للعب
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<{hasCredits: boolean, remaining: number, message: string}>}
   */
  checkCreditsAvailability: async (userId) => {
    try {
      const remaining = await CreditsService.getUserCredits(userId);
      
      if (remaining >= CreditsService.CREDIT_COST_PER_GAME) {
        return {
          hasCredits: true,
          remaining,
          message: `لديك ${remaining} ${remaining === 1 ? 'لعبة متبقية' : 'ألعاب متبقية'}`
        };
      } else {
        return {
          hasCredits: false,
          remaining: 0,
          message: 'لقد نفذ رصيدك. قم بشراء المزيد من الألعاب للمتابعة!'
        };
      }
    } catch (error) {
      console.error('Error checking credits availability:', error);
      throw error;
    }
  },

  /**
   * 🎮 محاولة بدء لعبة جديدة (مع خصم الرصيد)
   * يستخدم Transaction لضمان عدم حدوث تضارب في البيانات
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<{success: boolean, remaining: number, message: string}>}
   */
  consumeCreditForGame: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      // استخدام Transaction لضمان الأمان
      const result = await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) {
          throw new Error('المستخدم غير موجود');
        }
        
        const userData = userDoc.data();
        const currentCredits = userData.credits?.remaining || 0;
        
        // التحقق من توفر الرصيد
        if (currentCredits < CreditsService.CREDIT_COST_PER_GAME) {
          return {
            success: false,
            remaining: currentCredits,
            message: 'رصيدك غير كافٍ. قم بشراء المزيد من الألعاب!',
            needsPurchase: true
          };
        }
        
        // خصم الرصيد
        const newCredits = currentCredits - CreditsService.CREDIT_COST_PER_GAME;
        const totalUsed = (userData.credits?.totalUsed || 0) + CreditsService.CREDIT_COST_PER_GAME;
        
        transaction.update(userRef, {
          'credits.remaining': newCredits,
          'credits.totalUsed': totalUsed,
          'credits.lastUsedAt': serverTimestamp()
        });
        
        return {
          success: true,
          remaining: newCredits,
          message: `تم بدء اللعبة! الرصيد المتبقي: ${newCredits}`,
          needsPurchase: false
        };
      });
      
      // تسجيل العملية في سجل الاستهلاك
      if (result.success) {
        await CreditsService.logCreditUsage(userId, {
          type: 'game_start',
          amount: -CreditsService.CREDIT_COST_PER_GAME,
          remainingAfter: result.remaining,
          reason: 'بدء لعبة جديدة'
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error consuming credit:', error);
      throw error;
    }
  },

  /**
   * 💰 إضافة رصيد للمستخدم (بعد الشراء)
   * @param {string} userId - معرف المستخدم
   * @param {number} amount - عدد الألعاب المشتراة
   * @param {object} purchaseData - بيانات الشراء
   * @returns {Promise<{success: boolean, newBalance: number}>}
   */
  addCredits: async (userId, amount, purchaseData = {}) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      const result = await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) {
          throw new Error('المستخدم غير موجود');
        }
        
        const userData = userDoc.data();
        const currentCredits = userData.credits?.remaining || 0;
        const newCredits = currentCredits + amount;
        const totalPurchased = (userData.credits?.totalPurchased || 0) + amount;
        
        transaction.update(userRef, {
          'credits.remaining': newCredits,
          'credits.totalPurchased': totalPurchased,
          'credits.lastPurchaseAt': serverTimestamp()
        });
        
        return {
          success: true,
          newBalance: newCredits,
          added: amount
        };
      });
      
      // تسجيل عملية الشراء
      await CreditsService.logCreditUsage(userId, {
        type: 'purchase',
        amount: amount,
        remainingAfter: result.newBalance,
        reason: 'شراء ألعاب جديدة',
        purchaseData
      });
      
      // تسجيل معاملة الشراء
      await CreditsService.recordPurchaseTransaction(userId, amount, purchaseData);
      
      return result;
    } catch (error) {
      console.error('Error adding credits:', error);
      throw error;
    }
  },

  /**
   * 📝 تسجيل استخدام الرصيد في السجل
   * @param {string} userId - معرف المستخدم
   * @param {object} logData - بيانات السجل
   */
  logCreditUsage: async (userId, logData) => {
    try {
      const logsRef = collection(db, 'creditLogs');
      
      await addDoc(logsRef, {
        userId,
        type: logData.type,
        amount: logData.amount,
        remainingAfter: logData.remainingAfter,
        reason: logData.reason,
        metadata: logData.purchaseData || {},
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging credit usage:', error);
      // لا نرمي الخطأ هنا لأن التسجيل ليس حرجاً
    }
  },

  /**
   * 🧾 تسجيل معاملة شراء
   * @param {string} userId - معرف المستخدم
   * @param {number} amount - عدد الألعاب المشتراة
   * @param {object} purchaseData - بيانات الشراء
   */
  recordPurchaseTransaction: async (userId, amount, purchaseData) => {
    try {
      const transactionsRef = collection(db, 'purchaseTransactions');
      
      await addDoc(transactionsRef, {
        userId,
        creditsAmount: amount,
        price: purchaseData.price || 0,
        currency: purchaseData.currency || 'USD',
        platform: purchaseData.platform || 'web',
        paymentMethod: purchaseData.paymentMethod || 'unknown',
        transactionId: purchaseData.transactionId || null,
        status: 'completed',
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error recording purchase transaction:', error);
    }
  },

  /**
   * 📊 الحصول على سجل استخدام الرصيد
   * @param {string} userId - معرف المستخدم
   * @param {number} limitCount - عدد السجلات
   * @returns {Promise<Array>} - سجل الاستخدام
   */
  getCreditHistory: async (userId, limitCount = 50) => {
    try {
      const logsRef = collection(db, 'creditLogs');
      const q = query(
        logsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        firestoreLimit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const logs = [];
      
      querySnapshot.forEach((doc) => {
        logs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return logs;
    } catch (error) {
      console.error('Error getting credit history:', error);
      return [];
    }
  },

  /**
   * 🎁 منح رصيد مجاني (للعروض الترويجية أو المكافآت)
   * @param {string} userId - معرف المستخدم
   * @param {number} amount - عدد الألعاب المجانية
   * @param {string} reason - سبب المنح
   */
  grantFreeCredits: async (userId, amount, reason = 'مكافأة') => {
    try {
      const userRef = doc(db, 'users', userId);
      
      const result = await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) {
          throw new Error('المستخدم غير موجود');
        }
        
        const userData = userDoc.data();
        const currentCredits = userData.credits?.remaining || 0;
        const newCredits = currentCredits + amount;
        const totalGranted = (userData.credits?.totalGranted || 0) + amount;
        
        transaction.update(userRef, {
          'credits.remaining': newCredits,
          'credits.totalGranted': totalGranted
        });
        
        return {
          success: true,
          newBalance: newCredits
        };
      });
      
      // تسجيل المنح
      await CreditsService.logCreditUsage(userId, {
        type: 'grant',
        amount: amount,
        remainingAfter: result.newBalance,
        reason: reason
      });
      
      return result;
    } catch (error) {
      console.error('Error granting free credits:', error);
      throw error;
    }
  },

  /**
   * 📈 الحصول على إحصائيات الرصيد
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<object>} - إحصائيات الرصيد
   */
  getCreditStatistics: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('المستخدم غير موجود');
      }
      
      const userData = userSnap.data();
      const credits = userData.credits || {};
      
      return {
        remaining: credits.remaining || 0,
        totalPurchased: credits.totalPurchased || 0,
        totalUsed: credits.totalUsed || 0,
        totalGranted: credits.totalGranted || 0,
        initialFree: credits.initialFree || 0,
        lastUsedAt: credits.lastUsedAt || null,
        lastPurchaseAt: credits.lastPurchaseAt || null
      };
    } catch (error) {
      console.error('Error getting credit statistics:', error);
      throw error;
    }
  }
};

export default CreditsService;
