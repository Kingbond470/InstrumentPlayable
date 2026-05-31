'use client';

import { useState, useEffect } from 'react';
import { BREAKPOINTS, getDeviceCategory } from '@/lib/responsive';

interface ViewportSize {
  width: number;
  height: number;
  device: 'mobile' | 'tablet' | 'desktop' | 'large';
  isTablet: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  isLarge: boolean;
}

/**
 * Hook to detect viewport size and device category
 * Returns undefined on SSR, then updates on client
 */
export function useViewport(): ViewportSize | undefined {
  const [viewport, setViewport] = useState<ViewportSize | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const device = getDeviceCategory(width);

      setViewport({
        width,
        height,
        device,
        isMobile: device === 'mobile',
        isTablet: device === 'tablet',
        isDesktop: device === 'desktop',
        isLarge: device === 'large',
      });
    };

    // Set initial size
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

/**
 * Hook to check if viewport is at least a certain size
 */
export function useMinViewport(minBreakpoint: keyof typeof BREAKPOINTS): boolean {
  const viewport = useViewport();
  if (!viewport) return false;
  return viewport.width >= BREAKPOINTS[minBreakpoint];
}

/**
 * Hook to check if viewport is at most a certain size
 */
export function useMaxViewport(maxBreakpoint: keyof typeof BREAKPOINTS): boolean {
  const viewport = useViewport();
  if (!viewport) return true; // Assume true on SSR
  return viewport.width < BREAKPOINTS[maxBreakpoint];
}
