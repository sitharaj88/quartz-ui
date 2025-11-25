/**
 * Quartz UI - Theme Creation Utilities
 * 
 * Functions to create and customize themes
 */

import { lightColorScheme, darkColorScheme, ColorScheme } from '../tokens/colors';
import { defaultTypeScale } from '../tokens/typography';
import { spacing, borderRadius } from '../tokens/spacing';
import { getElevationStyle, ElevationLevel } from '../tokens/elevation';
import { 
  QuartzTheme, 
  ThemeOptions, 
  ThemeMode, 
  ShapeConfig, 
  SpacingConfig,
  MotionConfig,
  AccessibilityConfig,
} from './types';

// Default shape configuration
const defaultShape: ShapeConfig = {
  extraSmall: borderRadius.xs,
  small: borderRadius.sm,
  medium: borderRadius.md,
  large: borderRadius.lg,
  extraLarge: borderRadius.xl,
  full: borderRadius.full,
};

// Default spacing configuration
const defaultSpacing: SpacingConfig = {
  none: spacing.none,
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
  '4xl': spacing['4xl'],
};

// Default motion configuration
const defaultMotion: MotionConfig = {
  reducedMotion: false,
  defaultDuration: 200,
};

// Default accessibility configuration
const defaultAccessibility: AccessibilityConfig = {
  minTouchTargetSize: 48,
  showFocusIndicator: true,
  hapticFeedback: true,
  fontScale: 1,
  highContrast: false,
  announceMessages: true,
};

/**
 * Create a complete theme from options
 */
export function createTheme(
  mode: ThemeMode = 'light',
  options: ThemeOptions = {}
): QuartzTheme {
  const isDark = mode === 'dark';
  const baseColors = isDark ? darkColorScheme : lightColorScheme;

  // Merge colors with overrides
  const colors: ColorScheme = {
    ...baseColors,
    ...options.colors,
  };

  // Create elevation helper function
  const elevation = (level: ElevationLevel) => getElevationStyle(level);

  return {
    name: `quartz-${mode}`,
    mode,
    colors,
    typography: {
      ...defaultTypeScale,
      ...options.typography,
    },
    spacing: {
      ...defaultSpacing,
      ...options.spacing,
    },
    shape: {
      ...defaultShape,
      ...options.shape,
    },
    motion: {
      ...defaultMotion,
      ...options.motion,
    },
    accessibility: {
      ...defaultAccessibility,
      ...options.accessibility,
    },
    direction: options.direction ?? 'ltr',
    elevation,
  };
}

/**
 * Create a light theme
 */
export function createLightTheme(options: ThemeOptions = {}): QuartzTheme {
  return createTheme('light', options);
}

/**
 * Create a dark theme
 */
export function createDarkTheme(options: ThemeOptions = {}): QuartzTheme {
  return createTheme('dark', options);
}

/**
 * Extend an existing theme with overrides
 */
export function extendTheme(
  baseTheme: QuartzTheme,
  overrides: ThemeOptions
): QuartzTheme {
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...overrides.colors,
    },
    typography: {
      ...baseTheme.typography,
      ...overrides.typography,
    },
    spacing: {
      ...baseTheme.spacing,
      ...overrides.spacing,
    },
    shape: {
      ...baseTheme.shape,
      ...overrides.shape,
    },
    motion: {
      ...baseTheme.motion,
      ...overrides.motion,
    },
    accessibility: {
      ...baseTheme.accessibility,
      ...overrides.accessibility,
    },
    direction: overrides.direction ?? baseTheme.direction,
  };
}

/**
 * Create a custom color scheme from a seed color
 * This is a simplified version - full implementation would use
 * color utilities for proper tonal palette generation
 */
export function createCustomColorScheme(
  seedColor: string,
  isDark: boolean = false
): Partial<ColorScheme> {
  // For now, return a simple override
  // In production, use a color utilities library
  return {
    primary: seedColor,
    // Other colors would be generated from the seed
  };
}

// Default themes
export const lightTheme = createLightTheme();
export const darkTheme = createDarkTheme();
