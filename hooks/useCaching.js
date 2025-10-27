import { useState, useEffect, useCallback } from 'react';
import cacheService from '@/services/cacheService';
import questionsCacheService from '@/services/questionsCacheService';
import imageCacheService from '@/services/imageCacheService';

/**
 * Hook لاستخدام البيانات المخزنة مؤقتاً
 * @param {string} key - مفتاح التخزين
 * @param {function} fetcher - دالة لجلب البيانات
 * @param {object} options - خيارات إضافية
 */
export function useCachedData(key, fetcher, options = {}) {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(!options.initialData);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (forceRefresh) {
        result = await fetcher();
        await cacheService.set(key, result);
      } else {
        result = await cacheService.get(key);
        if (!result) {
          result = await fetcher();
          await cacheService.set(key, result);
        }
      }

      setData(result);
      return result;
    } catch (err) {
      console.error(`❌ خطأ في جلب ${key}:`, err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: () => fetchData(true) };
}

/**
 * Hook لتحميل صور مع التخزين المؤقت
 */
export function useCachedImage(uri, options = {}) {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadImage();
  }, [uri]);

  const loadImage = async () => {
    if (!uri) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cachedUri = await imageCacheService.loadImage(uri);
      setImageUri(cachedUri);
    } catch (err) {
      console.error('❌ خطأ في تحميل الصورة:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { imageUri, loading, error };
}

/**
 * Hook للحصول على أسئلة الفئة
 */
export function useCategoryQuestions(categoryId, options = {}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionsCacheService.getCategoryQuestions(
        categoryId,
        forceRefresh
      );
      setQuestions(data);
      return data;
    } catch (err) {
      console.error(`❌ خطأ في جلب أسئلة الفئة:`, err);
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchQuestions();
    }
  }, [categoryId, fetchQuestions]);

  return {
    questions,
    loading,
    error,
    refetch: () => fetchQuestions(true),
  };
}

/**
 * Hook لتحميل جميع الفئات
 */
export function useAllCategories(options = {}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionsCacheService.getAllCategories(forceRefresh);
      setCategories(data);
      return data;
    } catch (err) {
      console.error('❌ خطأ في جلب الفئات:', err);
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: () => fetchCategories(true),
  };
}

/**
 * Hook لحساب مساحة التخزين
 */
export function useCacheStorage() {
  const [storageInfo, setStorageInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStorageInfo = useCallback(async () => {
    try {
      setLoading(true);
      const info = await cacheService.getStorageInfo();
      setStorageInfo(info);
      return info;
    } catch (err) {
      console.error('❌ خطأ في جلب معلومات التخزين:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getStorageInfo();
    // تحديث كل 30 ثانية
    const interval = setInterval(getStorageInfo, 30000);
    return () => clearInterval(interval);
  }, [getStorageInfo]);

  return { storageInfo, loading, refresh: getStorageInfo };
}

/**
 * Hook لتحميل مجموعة صور
 */
export function usePreloadImages(imageUris, options = {}) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    preloadImages();
  }, [imageUris]);

  const preloadImages = async () => {
    if (!imageUris || imageUris.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      await imageCacheService.preloadImages(imageUris, (p) => {
        setProgress(Math.round(p * 100));
      });
    } catch (err) {
      console.error('❌ خطأ في تحميل الصور:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { progress, loading, error };
}

/**
 * Hook لإدارة عمليات التخزين
 */
export function useCacheManager() {
  const clearAll = useCallback(async () => {
    try {
      await cacheService.clearAll();
      console.log('✓ تم مسح كل التخزين');
    } catch (err) {
      console.error('❌ خطأ في مسح التخزين:', err);
    }
  }, []);

  const clearQuestions = useCallback(async (categoryId) => {
    try {
      await questionsCacheService.clearQuestionsCache(categoryId);
      console.log(`✓ تم مسح تخزين الأسئلة${categoryId ? ': ' + categoryId : ''}`);
    } catch (err) {
      console.error('❌ خطأ في مسح التخزين:', err);
    }
  }, []);

  const clearImages = useCallback(async () => {
    try {
      await imageCacheService.clearImageCache();
      console.log('✓ تم مسح تخزين الصور');
    } catch (err) {
      console.error('❌ خطأ في مسح التخزين:', err);
    }
  }, []);

  const cleanup = useCallback(async () => {
    try {
      await cacheService.cleanup();
      console.log('✓ تم تنظيف البيانات المنتهية الصلاحية');
    } catch (err) {
      console.error('❌ خطأ في التنظيف:', err);
    }
  }, []);

  return {
    clearAll,
    clearQuestions,
    clearImages,
    cleanup,
  };
}

export default {
  useCachedData,
  useCachedImage,
  useCategoryQuestions,
  useAllCategories,
  useCacheStorage,
  usePreloadImages,
  useCacheManager,
};
