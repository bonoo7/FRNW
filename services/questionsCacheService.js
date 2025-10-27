import cacheService from './cacheService';

/**
 * خدمة إدارة الأسئلة مع التخزين المؤقت
 * توفر تخزين ذكي للأسئلة والفئات لتحسين الأداء
 */

class QuestionsCacheService {
  constructor() {
    this.questionsCache = new Map();
    this.categoriesCache = null;
  }

  /**
   * الحصول على أسئلة الفئة مع التخزين المؤقت
   * @param {string} categoryId - معرف الفئة
   * @param {boolean} forceRefresh - فرض تحديث البيانات
   */
  async getCategoryQuestions(categoryId, forceRefresh = false) {
    if (!categoryId) return [];

    const cacheKey = `cache_questions_${categoryId}`;

    // فحص الذاكرة أولاً
    if (!forceRefresh && this.questionsCache.has(categoryId)) {
      console.log(`⚡ أسئلة من الذاكرة: ${categoryId}`);
      return this.questionsCache.get(categoryId);
    }

    // فحص التخزين المؤقت
    if (!forceRefresh) {
      const cached = await cacheService.get(cacheKey);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        console.log(`📂 أسئلة من التخزين: ${categoryId} (${cached.length} سؤال)`);
        this.questionsCache.set(categoryId, cached);
        return cached;
      }
    }

    // تحميل من المصدر الأساسي
    try {
      const questions = await this.fetchCategoryQuestions(categoryId);
      
      if (questions && questions.length > 0) {
        // حفظ في التخزين المؤقت
        await cacheService.set(cacheKey, questions);
        this.questionsCache.set(categoryId, questions);
        console.log(`✓ تم تحميل وحفظ أسئلة الفئة: ${categoryId}`);
      }

      return questions;
    } catch (error) {
      console.error(`❌ خطأ في تحميل أسئلة الفئة ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * الحصول على جميع الفئات مع التخزين المؤقت
   */
  async getAllCategories(forceRefresh = false) {
    const cacheKey = 'cache_categories';

    // فحص الذاكرة أولاً
    if (!forceRefresh && this.categoriesCache) {
      console.log(`⚡ الفئات من الذاكرة`);
      return this.categoriesCache;
    }

    // فحص التخزين المؤقت
    if (!forceRefresh) {
      const cached = await cacheService.get(cacheKey);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        console.log(`📂 الفئات من التخزين (${cached.length} فئة)`);
        this.categoriesCache = cached;
        return cached;
      }
    }

    // تحميل من المصدر الأساسي
    try {
      const categories = await this.fetchAllCategories();
      
      if (categories && categories.length > 0) {
        // حفظ في التخزين المؤقت لمدة 30 يوم
        await cacheService.set(cacheKey, categories, 30 * 24 * 60 * 60 * 1000);
        this.categoriesCache = categories;
        console.log(`✓ تم تحميل وحفظ جميع الفئات`);
      }

      return categories;
    } catch (error) {
      console.error('❌ خطأ في تحميل الفئات:', error);
      return [];
    }
  }

  /**
   * الحصول على سؤال عشوائي من الفئة
   */
  async getRandomQuestion(categoryId) {
    const questions = await this.getCategoryQuestions(categoryId);
    if (!questions || questions.length === 0) return null;
    return questions[Math.floor(Math.random() * questions.length)];
  }

  /**
   * الحصول على عدة أسئلة عشوائية
   */
  async getRandomQuestions(categoryId, count = 10) {
    const questions = await this.getCategoryQuestions(categoryId);
    if (!questions || questions.length === 0) return [];

    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * الحصول على إحصائيات التخزين المؤقت
   */
  async getCacheStats() {
    try {
      const storageInfo = await cacheService.getStorageInfo();
      const memorySize = this.questionsCache.size;

      return {
        storage: storageInfo,
        memoryQuestions: memorySize,
        memoryCategories: this.categoriesCache ? 1 : 0,
      };
    } catch (error) {
      console.error('❌ خطأ في الحصول على إحصائيات التخزين:', error);
      return null;
    }
  }

  /**
   * مسح التخزين المؤقت للأسئلة
   */
  async clearQuestionsCache(categoryId = null) {
    try {
      if (categoryId) {
        // مسح فئة محددة
        const cacheKey = `cache_questions_${categoryId}`;
        await cacheService.delete(cacheKey);
        this.questionsCache.delete(categoryId);
        console.log(`🧹 تم مسح تخزين الفئة: ${categoryId}`);
      } else {
        // مسح كل الأسئلة
        this.questionsCache.clear();
        const keys = await AsyncStorage.getAllKeys();
        const questionKeys = keys.filter(k => k.startsWith('cache_questions_'));
        
        if (questionKeys.length > 0) {
          await AsyncStorage.multiRemove(questionKeys);
          console.log(`🧹 تم مسح تخزين جميع الأسئلة (${questionKeys.length})`);
        }
      }
    } catch (error) {
      console.error('❌ خطأ في مسح التخزين:', error);
    }
  }

  /**
   * مسح التخزين المؤقت للفئات
   */
  async clearCategoriesCache() {
    try {
      await cacheService.delete('cache_categories');
      this.categoriesCache = null;
      console.log('🧹 تم مسح تخزين الفئات');
    } catch (error) {
      console.error('❌ خطأ في مسح التخزين:', error);
    }
  }

  /**
   * تحديث البيانات (يجب تطبيقها حسب مصدر البيانات الفعلي)
   */
  async fetchCategoryQuestions(categoryId) {
    // هذا يجب أن يتم استبداله بالتنفيذ الفعلي
    // على سبيل المثال: جلب من API أو من ملف بيانات محلي
    console.log(`📥 جلب أسئلة الفئة: ${categoryId}`);
    return [];
  }

  async fetchAllCategories() {
    // هذا يجب أن يتم استبداله بالتنفيذ الفعلي
    console.log('📥 جلب جميع الفئات');
    return [];
  }
}

export default new QuestionsCacheService();
