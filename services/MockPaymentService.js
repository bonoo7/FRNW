import { db } from '../firebase/config';
import { 
  doc, 
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import CreditsService from './creditsService';

const MockPaymentService = {
  /**
   * محاكاة معالجة الدفع
   * @param {string} userId - معرف المستخدم
   * @param {object} paymentData - بيانات الدفع
   * @returns {Promise<object>} - نتيجة المعاملة
   */
  processPayment: async (userId, paymentData) => {
    try {
      // محاكاة التأخير في معالجة الدفع (0.5-2 ثانية)
      const delay = Math.random() * 1500 + 500;
      
      return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          try {
            // محاكاة احتمالية فشل الدفع (5%)
            if (Math.random() < 0.05) {
              reject(new Error('محاكاة: فشل الدفع - رفع من البنك'));
            }

            // إنشاء معرف معاملة وهمي
            const transactionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // تسجيل المعاملة في Firestore
            const transaction = {
              userId,
              transactionId,
              status: 'pending',
              amount: paymentData.price,
              credits: paymentData.credits,
              currency: 'USD',
              paymentMethod: paymentData.paymentMethod,
              cardLast4: paymentData.cardLast4 || '****',
              platform: 'web',
              type: 'mock',
              createdAt: new Date().toISOString(),
              timestamp: serverTimestamp()
            };

            // حفظ في مجموعة MockTransactions
            const transactionsRef = collection(db, 'mockTransactions');
            await addDoc(transactionsRef, transaction);

            // محاكاة معالجة ناجحة
            resolve({
              success: true,
              transactionId,
              status: 'processing',
              message: 'جاري معالجة الدفع...'
            });

            // محاكاة Webhook بعد تأخير
            setTimeout(async () => {
              await MockPaymentService.simulateWebhook(userId, transactionId, paymentData);
            }, 1000);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    } catch (error) {
      console.error('Error processing mock payment:', error);
      throw error;
    }
  },

  /**
   * محاكاة Webhook من بوابة الدفع
   * @private
   */
  simulateWebhook: async (userId, transactionId, paymentData) => {
    try {
      // محاكاة التحقق من التوقيع الرقمي
      const isValid = MockPaymentService.verifyWebhookSignature(transactionId);
      
      if (!isValid) {
        console.error('Invalid webhook signature');
        return;
      }

      // شحن الرصيد تلقائياً
      const result = await CreditsService.addCredits(
        userId,
        paymentData.credits,
        {
          price: paymentData.price,
          currency: 'USD',
          packageId: paymentData.packageId,
          platform: 'web',
          paymentMethod: 'mock_payment',
          transactionId,
          cardLast4: paymentData.cardLast4,
          mockPayment: true
        }
      );

      // تحديث حالة المعاملة (لكن لا نرمي خطأ إذا فشل)
      if (result.success) {
        try {
          await MockPaymentService.updateTransactionStatus(
            transactionId,
            'completed'
          );
        } catch (updateError) {
          // تسجيل الخطأ لكن لا نرمي استثناء - العملية أساساً نجحت
          console.warn('Could not update transaction status, but credits were added:', updateError.message);
        }
      }

      return result;
    } catch (error) {
      console.error('Error in webhook simulation:', error);
      // حاول تحديث الحالة لكن لا تفشل العملية الأساسية
      try {
        await MockPaymentService.updateTransactionStatus(
          transactionId,
          'failed'
        );
      } catch (updateError) {
        console.warn('Could not update failed status:', updateError.message);
      }
    }
  },

  /**
   * تحديث حالة المعاملة (اختيارية - لا تفشل العملية الأساسية)
   * @private
   */
  updateTransactionStatus: async (transactionId, status) => {
    try {
      const transactionsRef = collection(db, 'mockTransactions');
      const q = query(
        transactionsRef,
        where('transactionId', '==', transactionId)
      );
      
      try {
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log('Transaction not found for status update:', transactionId);
          return false;
        }
        
        let updateCount = 0;
        querySnapshot.forEach(async (docSnapshot) => {
          try {
            await updateDoc(docSnapshot.ref, {
              status,
              updatedAt: new Date().toISOString(),
              timestamp: serverTimestamp()
            });
            updateCount++;
          } catch (error) {
            console.warn('Could not update individual transaction doc:', error.message);
          }
        });
        
        return updateCount > 0;
      } catch (queryError) {
        console.log('Query error (non-critical):', queryError.message);
        return false;
      }
    } catch (error) {
      console.warn('Non-critical error updating transaction status:', error.message);
      return false;
    }
  },

  /**
   * التحقق من توقيع Webhook (محاكاة)
   * @private
   */
  verifyWebhookSignature: (transactionId) => {
    // محاكاة التحقق من التوقيع
    // في الواقع، ستحقق من توقيع HMAC
    return transactionId && transactionId.startsWith('mock_');
  },

  /**
   * اختبار الدفع برسوم مختلفة
   */
  testPayment: async (userId, testAmount, testCredits) => {
    return MockPaymentService.processPayment(userId, {
      price: testAmount,
      credits: testCredits,
      packageId: 'test',
      paymentMethod: 'test_card',
      cardLast4: '4242'
    });
  },

  /**
   * الحصول على سجل المعاملات الوهمية
   */
  getMockTransactionHistory: async (userId, limit = 20) => {
    try {
      const transactionsRef = collection(db, 'mockTransactions');
      const q = query(
        transactionsRef,
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const transactions = [];
      
      querySnapshot.forEach((doc) => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return transactions.slice(0, limit);
    } catch (error) {
      console.error('Error getting mock transaction history:', error);
      return [];
    }
  }
};

export default MockPaymentService;
