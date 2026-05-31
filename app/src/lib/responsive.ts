/**
 * Responsive design utilities — mobile-first sizing & breakpoint detection
 * Breakpoints: 481px (tablet), 1025px (desktop), 1440px (large)
 */

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 481,
  desktop: 1025,
  large: 1440,
} as const;

/**
 * Get device category from viewport width
 */
export function getDeviceCategory(width: number): 'mobile' | 'tablet' | 'desktop' | 'large' {
  if (width >= BREAKPOINTS.large) return 'large';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

/**
 * Responsive value picker — returns appropriate value for viewport
 * Usage: responsiveValue(viewport.width, { mobile: 100, tablet: 200, desktop: 300 })
 */
export function responsiveValue<T>(
  width: number,
  values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    large?: T;
  }
): T | undefined {
  const category = getDeviceCategory(width);

  if (category === 'large' && values.large !== undefined) return values.large;
  if (category === 'desktop' && values.desktop !== undefined) return values.desktop;
  if (category === 'tablet' && values.tablet !== undefined) return values.tablet;
  if (values.mobile !== undefined) return values.mobile;

  // Fallback: return first available
  return values.desktop ?? values.tablet ?? values.mobile;
}

/**
 * Responsive padding calculator (8px baseline)
 */
export const SPACING = {
  mobile: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  tablet: {
    xs: 8,
    sm: 12,
    md: 20,
    lg: 28,
    xl: 36,
  },
  desktop: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
} as const;

/**
 * Responsive font sizes (px)
 */
export const FONT_SIZES = {
  mobile: {
    sm: 14,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
  },
  tablet: {
    sm: 14,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
  },
  desktop: {
    sm: 14,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
  },
} as const;

/**
 * Responsive touch targets (px minimum)
 * Mobile: 48px, Tablet/Desktop: 44px
 */
export const TOUCH_TARGET = {
  mobile: 48,
  tablet: 48,
  desktop: 44,
} as const;

/**
 * Responsive grid columns (number of columns)
 */
export const GRID_COLUMNS = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
} as const;

/**
 * Responsive component dimensions
 */
export const COMPONENT_SIZES = {
  // StringPlayer: number of strings displayed
  stringPlayer: {
    mobile: 6,      // 2×3 grid
    tablet: 8,      // 2×4 grid
    desktop: 8,     // horizontal layout
  },

  // PercussionGrid: grid size (NxN)
  percussionGrid: {
    mobile: 4,      // 4×4
    tablet: 6,      // 6×6
    desktop: 8,     // 8×8
  },

  // Modal width (px)
  modal: {
    mobile: '90vw',
    tablet: '70vw',
    desktop: '500px',
  },

  // Sidebar width (px)
  sidebar: {
    mobile: 'full',  // drawer on mobile
    tablet: 220,
    desktop: 220,
  },

  // Main content max width (px)
  contentMax: {
    mobile: '100vw',
    tablet: '800px',
    desktop: '1200px',
  },
} as const;

/**
 * Responsive navigation styles
 */
export const NAVIGATION = {
  mobile: {
    type: 'bottom-nav' as const,
    height: 56,
    position: 'fixed' as const,
  },
  tablet: {
    type: 'top-nav' as const,
    height: 64,
    position: 'sticky' as const,
  },
  desktop: {
    type: 'top-nav' as const,
    height: 64,
    position: 'sticky' as const,
  },
} as const;

/**
 * Safe area insets for notched devices
 */
export const SAFE_AREA = {
  top: 'max(0px, env(safe-area-inset-top))',
  right: 'max(0px, env(safe-area-inset-right))',
  bottom: 'max(0px, env(safe-area-inset-bottom))',
  left: 'max(0px, env(safe-area-inset-left))',
} as const;
