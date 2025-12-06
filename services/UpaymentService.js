import { db } from '../firebase/config';
import { 
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import CreditsService from './creditsService';

import { Platform } from 'react-native';

const API_URL = "https://uapi.upayments.com/api/v1/charge";
const API_TOKEN = "Bearer 57180016b4e75ac5b8c4a3c9046cb0397f1d91ca";

const UpaymentService = {
  /**
   * إنشاء رابط دفع جديد
   * @param {object} orderData - بيانات الطلب
   * @returns {Promise<object>} - نتيجة إنشاء الرابط
   */
  createPaymentLink: async (orderData) => {
    try {
      const orderId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const referenceId = `ref_${Date.now()}`;

      // تحديد رابط العودة بناءً على المنصة
      let baseUrl = "https://fakker.net";
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        baseUrl = window.location.origin;
      }

      // تجهيز البيانات حسب هيكلية Upayment
      const payload = {
        order: {
          id: orderId,
          reference: referenceId,
          description: orderData.description || "Game Credits",
          currency: orderData.currency || "KWD",// استخدام العملة المطلوبة
          amount: orderData.amount
        },
        language: "en",
        paymentGateway: {
          src: "knet" // يمكن تغييرها إلى "cc" للبطاقات الائتمانية إذا لزم الأمر
        },
        reference: {
          id: orderId
        },
        returnUrl: `${baseUrl}/payment/success`, 
        cancelUrl: `${baseUrl}/payment/cancel`,
        notificationUrl: "https://fakker.net/payment/notification"
      };

      console.log('Sending Upayment request:', JSON.stringify(payload));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_TOKEN
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log('Upayment response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid JSON response from Upayment');
      }

      if (data.status) {
        return {
          success: true,
          paymentLink: data.data.link,
          transactionId: orderId,
          message: data.message
        };
      } else {
        throw new Error(data.message || 'Failed to create payment link');
      }

    } catch (error) {
      console.error('Error creating Upayment link:', error);
      throw error;
    }
  },

  /**
   * معالجة نجاح الدفع (يتم استدعاؤها عند العودة من صفحة الدفع بنجاح)
   */
  handlePaymentSuccess: async (userId, packageData, transactionId) => {
    try {
      // تسجيل المعاملة في Firestore
      const transaction = {
        userId,
        transactionId,
        status: 'completed',
        amount: packageData.price,
        credits: packageData.credits,
        currency: 'KWD',
        paymentMethod: 'upayment',
        platform: 'web',
        type: 'real',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp()
      };

      const transactionsRef = collection(db, 'transactions');
      await addDoc(transactionsRef, transaction);

      // إضافة الرصيد للمستخدم
      const result = await CreditsService.addCredits(
        userId,
        packageData.credits,
        {
          price: packageData.price,
          currency: 'KWD',
          packageId: packageData.id,
          platform: 'web',
          paymentMethod: 'upayment',
          transactionId,
          mockPayment: false
        }
      );

      return result;
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }
};

export default UpaymentService;
