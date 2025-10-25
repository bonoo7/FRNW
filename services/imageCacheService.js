import cacheService from './cacheService';
import { Image } from 'react-native';

/**
 * خدمة إدارة الصور مع التخزين المؤقت
 * تحسّن من سرعة تحميل الصور وتقلل استهلاك النطاق الترددي
 */

class ImageCacheService {
  constructor() {
    this.loadingMap = new Map();
    this.imageUriCache = new Map();
  }

  /**
   * تحميل صورة مع التخزين المؤقت
   * @param {string} uri - رابط الصورة
   * @param {object} options - خيارات التحميل
   */
  async loadImage(uri, options = {}) {
    if (!uri) return null;

    const cacheKey = `cache_images_${uri}`;
    
    // فحص الذاكرة أولاً
    if (this.imageUriCache.has(uri)) {
      console.log(`⚡ صورة من الذاكرة: ${uri}`);
      return this.imageUriCache.get(uri);
    }

    // فحص التخزين المؤقت
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      console.log(`📂 صورة من التخزين: ${uri}`);
      this.imageUriCache.set(uri, cached);
      return cached;
    }

    // تحميل جديد
    try {
      // تحميل الصورة مسبقاً
      await this.preloadImage(uri, options);
      
      // حفظ في التخزين المؤقت
      await cacheService.set(cacheKey, uri, 7 * 24 * 60 * 60 * 1000); // 7 أيام
      this.imageUriCache.set(uri, uri);
      
      console.log(`✓ تم تحميل وحفظ الصورة: ${uri}`);
      return uri;
    } catch (error) {
      console.error(`❌ خطأ في تحميل الصورة ${uri}:`, error);
      return null;
    }
  }

  /**
   * تحميل صورة مسبقاً (prefetch)
   */
  preloadImage(uri, options = {}) {
    return new Promise((resolve, reject) => {
      Image.prefetch(uri)
        .then(() => resolve(uri))
        .catch(error => {
          // محاولة تحميل الصورة بطريقة بديلة
          Image.getSize(
            uri,
            () => resolve(uri),
            () => reject(error)
          );
        });
    });
  }

  /**
   * تحميل مجموعة من الصور
   */
  async preloadImages(uris, onProgress) {
    const promises = uris.map((uri, index) => 
      this.loadImage(uri).then(() => {
        if (onProgress) {
          onProgress((index + 1) / uris.length);
        }
      })
    );

    await Promise.allSettled(promises);
    console.log(`✓ تم تحميل ${uris.length} صورة`);
  }

  /**
   * الحصول على معلومات الصورة
   */
  async getImageInfo(uri) {
    return new Promise((resolve) => {
      Image.getSize(
        uri,
        (width, height) => {
          resolve({ uri, width, height });
        },
        (error) => {
          console.error(`❌ خطأ في الحصول على حجم الصورة ${uri}:`, error);
          resolve(null);
        }
      );
    });
  }

  /**
   * مسح التخزين المؤقت للصور
   */
  async clearImageCache() {
    try {
      this.imageUriCache.clear();
      const keys = await AsyncStorage.getAllKeys();
      const imageKeys = keys.filter(k => k.startsWith('cache_images_'));
      
      if (imageKeys.length > 0) {
        await AsyncStorage.multiRemove(imageKeys);
        console.log(`🧹 تم مسح تخزين الصور (${imageKeys.length} صورة)`);
      }
    } catch (error) {
      console.error('❌ خطأ في مسح تخزين الصور:', error);
    }
  }

  /**
   * حساب حجم التخزين المؤقت للصور
   */
  async getImageCacheSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const imageKeys = keys.filter(k => k.startsWith('cache_images_'));
      let totalSize = 0;

      for (const key of imageKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      }

      const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      console.log(`📊 حجم تخزين الصور: ${sizeMB} MB`);
      return totalSize;
    } catch (error) {
      console.error('❌ خطأ في حساب حجم التخزين:', error);
      return 0;
    }
  }
}

export default new ImageCacheService();
