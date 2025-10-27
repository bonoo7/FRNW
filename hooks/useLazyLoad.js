/**
 * Hook لـ Lazy Loading للمكونات
 * تحميل المكونات عند الحاجة فقط
 */

import React, { Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';

// مكون تحميل fallback
const LoadingFallback = ({ size = 30, color = '#2E5DB8' }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

/**
 * دالة لـ Lazy Loading للمكونات
 * @param {() => Promise<any>} importFunction - دالة الاستيراد الديناميكي
 * @param {object} options - الخيارات
 * @returns {React.Component} - مكون معّد للـ Lazy Loading
 */
export function createLazyComponent(importFunction, options = {}) {
  const {
    loading: LoadingComponent = LoadingFallback,
    delay = 300,
  } = options;

  const Component = React.lazy(() =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(importFunction());
      }, delay);
    })
  );

  const LazyComponent = (props) => (
    <Suspense fallback={<LoadingComponent />}>
      <Component {...props} />
    </Suspense>
  );

  return LazyComponent;
}

/**
 * Hook لتحميل البيانات بشكل ديناميكي
 * @param {() => Promise<any>} importFunction
 * @returns {any} - البيانات المحملة
 */
export function useLazyLoad(importFunction) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const result = await importFunction();
        if (isMounted) {
          setData(result.default || result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [importFunction]);

  return { data, loading, error };
}

export default createLazyComponent;
