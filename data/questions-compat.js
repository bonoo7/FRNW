/**
 * 📚 ملف التوافقية - يحافظ على التوافق مع الكود القديم
 * 
 * هذا الملف يستيراد جميع الأسئلة من الملفات المقسمة
 * بنفس الطريقة التي كانت تعمل من قبل
 * 
 * لا تحتاج لتغيير أي شيء في التطبيق!
 */

import allQuestions from './categories/index.js';

// الحفاظ على نفس الواجهة (interface) القديمة
export const questions = allQuestions;

export default allQuestions;
