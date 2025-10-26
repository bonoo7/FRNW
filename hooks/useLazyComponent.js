import { lazy, Suspense } from 'react';

/**
 * Hook لتحميل المكونات بشكل كسول (Lazy Loading)
 * يساعد في تقليل حجم الـ bundle الأولي
 */
export const useLazyComponent = (componentPath, fallback = null) => {
  const LazyComponent = lazy(() => import(componentPath));

  return (props) => (
    <Suspense fallback={fallback || null}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default useLazyComponent;
