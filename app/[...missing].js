import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

export default function NotFound() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Handle OAuth redirect from Google
    if (segments[0] === 'oauthredirection') {
      // The auth is being processed by AuthContext useEffect
      // Just navigate back to auth or home
      console.log('OAuth redirect detected, navigating away...');
      setTimeout(() => {
        router.replace('/');
      }, 100);
    } else {
      // For other unmatched routes, go to home
      router.replace('/');
    }
  }, []);

  return null;
}
