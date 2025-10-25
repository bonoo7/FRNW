import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * خدمة التخزين المؤقت الشاملة
 * توفر caching متقدم للأسئلة والصور والبيانات
 */

const CACHE_KEYS = {
  QUESTIONS: 'cache_questions_',
  IMAGES: 'cache_images_',
  CATEGORIES: 'cache_categories',
  GAME_STATE: 'cache_game_state_',
  METADATA: 'cache_metadata_',
};

const CACHE_CONFIG = {
  MAX_SIZE: 50 * 1024 * 1024, // 50 MB
  TTL: 7 * 24 * 60 * 60 * 1000, // 7 أيام
  CLEANUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 ساعة
};

class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.initialized = false;
  }

  /**
   * تهيئة خدمة التخزين المؤقت
   */
  async init() {
    try {
      if (this.initialized) return;
      
      // تنظيف التخزين المؤقت القديم
      await this.cleanup();
      
      // إعادة تحميل البيانات المهمة من التخزين
      await this.preloadCriticalData();
      
      this.initialized = true;
      console.log('✓ خدمة التخزين المؤقت جاهزة');
    } catch (error) {
      console.error('❌ خطأ في تهيئة التخزين المؤقت:', error);
    }
  }

  /**
   * حفظ البيانات في التخزين المؤقت
   * @param {string} key - مفتاح التخزين
   * @param {any} value - القيمة المراد حفظها
   * @param {number} ttl - مدة الحياة بالميلي ثانية (اختياري)
   */
  async set(key, value, ttl = CACHE_CONFIG.TTL) {
    try {
      const cacheEntry = {
        value,
        timestamp: Date.now(),
        ttl,
        expiresAt: Date.now() + ttl,
      };

      // حفظ في الذاكرة أيضاً للوصول السريع
      this.memoryCache.set(key, cacheEntry);

      // حفظ في AsyncStorage
      const serialized = JSON.stringify(cacheEntry);
      await AsyncStorage.setItem(key, serialized);

      // تسجيل الحجم للمراقبة
      const size = new Blob([serialized]).size;
      console.log(`💾 تم حفظ: ${key} (${(size / 1024).toFixed(2)} KB)`);

      return true;
    } catch (error) {
      console.error(`❌ خطأ في حفظ ${key}:`, error);
      return false;
    }
  }

  /**
   * استرجاع البيانات من التخزين المؤقت
   * @param {string} key - مفتاح التخزين
   * @returns {any} القيمة المحفوظة أو null
   */
  async get(key) {
    try {
      // فحص الذاكرة أولاً (أسرع)
      const memoryEntry = this.memoryCache.get(key);
      if (memoryEntry && !this.isExpired(memoryEntry)) {
        console.log(`⚡ من الذاكرة: ${key}`);
        return memoryEntry.value;
      }

      // البحث في AsyncStorage
      const serialized = await AsyncStorage.getItem(key);
      if (!serialized) {
        console.log(`⚠️ غير موجود: ${key}`);
        return null;
      }

      const cacheEntry = JSON.parse(serialized);

      // فحص انتهاء الصلاحية
      if (this.isExpired(cacheEntry)) {
        await this.delete(key);
        console.log(`⏱️ انتهت صلاحية: ${key}`);
        return null;
      }

      // حفظ في الذاكرة
      this.memoryCache.set(key, cacheEntry);
      console.log(`📂 من التخزين: ${key}`);
      return cacheEntry.value;
    } catch (error) {
      console.error(`❌ خطأ في قراءة ${key}:`, error);
      return null;
    }
  }

  /**
   * حذف بيانات محددة
   */
  async delete(key) {
    try {
      this.memoryCache.delete(key);
      await AsyncStorage.removeItem(key);
      console.log(`🗑️ تم حذف: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ خطأ في حذف ${key}:`, error);
      return false;
    }
  }

  /**
   * فحص انتهاء صلاحية البيانات
   */
  isExpired(cacheEntry) {
    if (!cacheEntry.expiresAt) return false;
    return Date.now() > cacheEntry.expiresAt;
  }

  /**
   * تنظيف البيانات المنتهية الصلاحية
   */
  async cleanup() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const expiredKeys = [];

      for (const key of keys) {
        if (key.startsWith('cache_')) {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            try {
              const cacheEntry = JSON.parse(data);
              if (this.isExpired(cacheEntry)) {
                expiredKeys.push(key);
              }
            } catch (e) {
              // بيانات تالفة
              expiredKeys.push(key);
            }
          }
        }
      }

      if (expiredKeys.length > 0) {
        await AsyncStorage.multiRemove(expiredKeys);
        console.log(`🧹 تم حذف ${expiredKeys.length} بيانات منتهية الصلاحية`);
      }
    } catch (error) {
      console.error('❌ خطأ في التنظيف:', error);
    }
  }

  /**
   * إعادة تحميل البيانات المهمة
   */
  async preloadCriticalData() {
    try {
      // يمكن إضافة منطق لتحميل البيانات المهمة مسبقاً
      console.log('📥 تم تحميل البيانات المهمة مسبقاً');
    } catch (error) {
      console.error('❌ خطأ في التحميل المسبق:', error);
    }
  }

  /**
   * حساب حجم التخزين المستخدم
   */
  async getStorageInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        if (key.startsWith('cache_')) {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            totalSize += new Blob([data]).size;
          }
        }
      }

      const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
      const maxMB = (CACHE_CONFIG.MAX_SIZE / (1024 * 1024)).toFixed(2);
      const percentage = ((totalSize / CACHE_CONFIG.MAX_SIZE) * 100).toFixed(2);

      console.log(`📊 التخزين: ${usedMB}MB / ${maxMB}MB (${percentage}%)`);
      return {
        used: totalSize,
        max: CACHE_CONFIG.MAX_SIZE,
        percentage: parseFloat(percentage),
      };
    } catch (error) {
      console.error('❌ خطأ في حساب حجم التخزين:', error);
      return null;
    }
  }

  /**
   * مسح كل التخزين المؤقت
   */
  async clearAll() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('cache_'));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        this.memoryCache.clear();
        console.log(`🧹 تم مسح كل التخزين المؤقت (${cacheKeys.length} عنصر)`);
      }
    } catch (error) {
      console.error('❌ خطأ في مسح التخزين:', error);
    }
  }
}

export default new CacheService();
