'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Track session start
    trackEvent('session_start', {
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      source: document.referrer || 'direct',
      userAgent: navigator.userAgent,
    });

    // Track session end on unload
    const handleUnload = () => {
      trackEvent('session_end', {
        duration_sec: Math.round((Date.now() - sessionStartTime) / 1000),
      });
    };

    const sessionStartTime = Date.now();
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return <>{children}</>;
}
