/**
 * Analytics tracking via Vercel Web Analytics.
 * Captures: instrument identified, kit saved, shared, recorded.
 * No sensitive data. Anonymous unless authenticated.
 */

import { useEffect } from 'react';

// Track custom event
export function trackEvent(name: string, properties?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;

  // Vercel Web Analytics
  if (window.va) {
    window.va.track(name, properties);
  }

  // Fallback: log locally (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[analytics]', name, properties);
  }
}

// Core events
export const Events = {
  // Photo flow
  PHOTO_UPLOADED: 'photo_uploaded',
  INSTRUMENT_IDENTIFIED: 'instrument_identified',
  INSTRUMENT_CONFIRMED: 'instrument_confirmed',
  INSTRUMENT_PLAYED: 'instrument_played',

  // Text flow
  PROMPT_ENTERED: 'prompt_entered',
  KIT_GENERATED: 'kit_generated',
  PAD_HIT: 'pad_hit',

  // Actions
  KIT_SAVED: 'kit_saved',
  KIT_SHARED: 'kit_shared',
  RECORDING_STARTED: 'recording_started',
  RECORDING_STOPPED: 'recording_stopped',
  MIDI_EXPORTED: 'midi_exported',
  WAV_EXPORTED: 'wav_exported',

  // Auth
  LOGIN_ATTEMPTED: 'login_attempted',
  LOGIN_SUCCEEDED: 'login_succeeded',
  LOGOUT: 'logout',

  // Library
  LIBRARY_OPENED: 'library_opened',
  KIT_LOADED_FROM_LIBRARY: 'kit_loaded_from_library',
};

// Hook for page views (automatically tracked by Vercel, but useful for custom logic)
export function usePageView(name: string) {
  useEffect(() => {
    trackEvent('page_view', { page: name });
  }, [name]);
}

// Declare global va object
declare global {
  interface Window {
    va?: {
      track: (name: string, properties?: Record<string, string | number | boolean>) => void;
    };
  }
}
