// Simple event tracking via sendBeacon() — doesn't block page unload
// Events collected by src/app/api/analytics/route.ts

export interface AnalyticsEvent {
  name: string;
  timestamp: number;
  [key: string]: any;
}

// Event name constants for backwards compatibility
export const Events = {
  INSTRUMENT_PLAYED: 'instrument_played',
  PAD_HIT: 'pad_hit',
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  PHOTO_CAPTURED: 'photo_captured',
  INSTRUMENT_IDENTIFIED: 'instrument_identified',
  USER_CONFIRMED: 'user_confirmed',
  USER_CORRECTED: 'user_corrected',
  RECORDING_EXPORTED: 'recording_exported',
  KIT_SAVED: 'kit_saved',
  KIT_SHARED: 'kit_shared',
  COLLECTION_CREATED: 'collection_created',
} as const;

let eventCount = 0;

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') return; // SSR guard

  eventCount++;
  const event: AnalyticsEvent = {
    name: eventName,
    timestamp: Date.now(),
    ...data,
  };

  // Fire and forget — don't block user interaction
  try {
    // Use sendBeacon if available (doesn't block unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/analytics',
        JSON.stringify(event)
      );
    } else {
      // Fallback: fetch with keepalive
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(event),
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {}); // Silently fail if offline
    }
  } catch (err) {
    // Network errors, do nothing
  }
};

export const getEventCount = () => eventCount;
