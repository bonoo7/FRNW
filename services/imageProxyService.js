/**
 * خدمة معالجة الصور الخارجية والبروكسي
 * تحل مشاكل CORS والصور التي لا تحمل
 */

class ImageProxyService {
  /**
   * قائمة الخوادم الوكيلة (Proxies) للصور
   */
  static proxyServices = [
    // استخدام طلب مباشر بدون وكيل أولاً
    (url) => url,
    // وكيل img.shields.io
    (url) => `https://img.shields.io/endpoint?url=${encodeURIComponent(url)}`,
    // وكيل بسيط
    (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}`,
  ];

  /**
   * الحصول على رابط الصورة مع التعامل مع CORS
   * @param {string} imageUrl - رابط الصورة
   * @returns {object} - كائن صورة React Native
   */
  static getImageSource(imageUrl) {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return null;
    }

    // إذا كانت صورة محلية، أرجعها مباشرة
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      return null;
    }

    // حاول الرابط المباشر أولاً
    return {
      uri: imageUrl,
      cache: 'force-cache',
      headers: {
        'Accept': 'image/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
  }

  /**
   * معالجة خطأ تحميل الصورة برابط بديل
   * @param {string} imageUrl - رابط الصورة الأصلي
   * @returns {object} - رابط بديل
   */
  static getAlternativeImageUrl(imageUrl) {
    if (!imageUrl) return null;

    // محاولة استخدام وكيل صور عام
    // هذا يعمل مع معظم الصور
    return {
      uri: `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl.replace(/^https?:\/\//, ''))}`,
      cache: 'force-cache'
    };
  }

  /**
   * التحقق من صحة رابط الصورة
   * @param {string} imageUrl - رابط الصورة
   * @returns {boolean} - هل الرابط صحيح
   */
  static isValidImageUrl(imageUrl) {
    if (!imageUrl || typeof imageUrl !== 'string') return false;
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(imageUrl) ||
           imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
  }

  /**
   * تحويل رابط Wikimedia إلى صورة قابلة للتحميل
   * بعض روابط Wikimedia تحتاج معالجة خاصة
   */
  static convertWikimediaUrl(url) {
    if (!url || !url.includes('wikimedia') && !url.includes('wikipedia')) {
      return url;
    }

    // إزالة الحجم والإصدار من الرابط
    const baseUrl = url.split('?')[0];
    
    // إضافة جزء من الرابط الأصلي مع معالجة CORS
    return baseUrl;
  }

  /**
   * الحصول على أفضل صيغة صورة مدعومة
   */
  static getOptimizedImageUrl(imageUrl) {
    if (!imageUrl) return null;

    // إذا كانت صورة Wikimedia، قد نحتاج لمعالجة خاصة
    if (imageUrl.includes('wikimedia') || imageUrl.includes('wikipedia')) {
      // استخدام الرابط المباشر بدون معالجة إضافية
      return {
        uri: imageUrl,
        cache: 'force-cache',
        headers: {
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Fetch-Dest': 'image',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'cross-site'
        }
      };
    }

    return this.getImageSource(imageUrl);
  }
}

export default ImageProxyService;
