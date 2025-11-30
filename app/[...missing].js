import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

export default function NotFound() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // تجاهل عناوين الإدارة والويب
    const firstSegment = segments?.[0];
    
    // السماح بصفحات الإدارة والـ API
    if (firstSegment === 'admin' || firstSegment === 'api' || 
        firstSegment === 'public' || firstSegment === 'public') {
      return;
    }

    // Handle OAuth redirect from Google
    if (firstSegment === 'oauthredirection') {
      // The auth is being processed by AuthContext useEffect
      // Just navigate back to auth or home
      console.log('OAuth redirect detected, navigating away...');
      const timer = setTimeout(() => {
        router.replace('/');
      }, 100);
      return () => clearTimeout(timer);
    } else if (firstSegment) {
      // For other unmatched routes, go to home
      const timer = setTimeout(() => {
        router.replace('/');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [segments, router]);

  return null;
}
