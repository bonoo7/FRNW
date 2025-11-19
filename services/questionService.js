import allQuestions from '../data/categories/index.js';

export const QuestionService = {
  // الحصول على أسئلة عشوائية حسب الفئة والمستوى
  getRandomQuestions: (category, difficulty, count = 1) => {
    try {
      // التأكد من وجود الأسئلة
      if (!allQuestions || !Array.isArray(allQuestions)) {
        console.error('خطأ: ملف الأسئلة غير موجود أو غير صالح');
        throw new Error('بيانات الأسئلة غير متوفرة');
      }

      // طباعة الأسئلة المتوفرة للفئة
      console.log(`البحث عن أسئلة في الفئة: ${category}`);
      
      const filteredQuestions = allQuestions.filter(q => 
        (!category || q.category === category) &&
        (!difficulty || q.difficulty === difficulty) &&
        !q.isDisabled // استبعاد الأسئلة المعطلة
      );
      
      // التحقق من وجود أسئلة كافية
      if (!filteredQuestions || filteredQuestions.length === 0) {
        console.error(`لا توجد أسئلة متوفرة للفئة: ${category} والمستوى: ${difficulty}`);
        throw new Error(`لا توجد أسئلة متوفرة للفئة: ${category}`);
      }

      if (filteredQuestions.length < count) {
        console.warn(`عدد الأسئلة المتوفرة (${filteredQuestions.length}) أقل من العدد المطلوب (${count})`);
      }
      
      // طباعة عدد الأسئلة المتوفرة
      console.log(`تم العثور على ${filteredQuestions.length} سؤال في الفئة ${category}`);
      
      // خلط الأسئلة بشكل عشوائي
      const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, shuffled.length));
    } catch (error) {
      console.error('خطأ في جلب الأسئلة:', error);
      throw error;
    }
  },

  // الحصول على جميع الفئات المتاحة من الأسئلة
  getCategories: () => {
    const uniqueCategories = [...new Set(allQuestions
      .filter(q => !q.isDisabled) // استبعاد الأسئلة المعطلة
      .map(q => q.category)
      .filter(category => category) // استبعاد القيم الفارغة
    )];
    return uniqueCategories.sort(); // ترتيب الفئات أبجدياً
  },

  // الحصول على عدد الأسئلة في كل فئة
  getCategoryCount: (category) => {
    return allQuestions.filter(q => 
      q.category === category && 
      !q.isDisabled
    ).length;
  },

  // الحصول على جميع مستويات الصعوبة المتوفرة
  getDifficultyLevels: () => {
    return [...new Set(allQuestions
      .filter(q => !q.isDisabled)
      .map(q => q.difficulty)
      .filter(difficulty => difficulty)
    )].sort();
  },

  getAllCategories: () => {
    const categories = new Set(allQuestions.map(q => q.category));
    return Array.from(categories);
  },

  // دالة للحصول على صورة الفئة
  getCategoryImage: (category) => {
    // البحث عن أول سؤال في الفئة له صورة
    const question = allQuestions.find(q => 
      q.category === category && 
      q.imgQ && 
      !q.isDisabled
    );
    return question ? question.imgQ : null;
  },

  // إضافة دالة للتحقق من توفر الأسئلة في الفئة
  hasQuestionsInCategory: (category) => {
    const categoryQuestions = allQuestions.filter(q => 
      q.category === category && 
      !q.isDisabled
    );
    return categoryQuestions.length > 0;
  }
};