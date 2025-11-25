/**
 * Quartz UI - Theme Types
 * 
 * Complete theme type definitions
 */

import { ColorScheme } from '../tokens/colors';
import { TypeScale } from '../tokens/typography';
import { ElevationLevel } from '../tokens/elevation';

// Theme mode
export type ThemeMode = 'light' | 'dark' | 'system';

// Direction for RTL support
export type TextDirection = 'ltr' | 'rtl';

// Component size variants
export type Size = 'small' | 'medium' | 'large';

// Component variants
export type Variant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';

// Shape configuration
export interface ShapeConfig {
  extraSmall: number;
  small: number;
  medium: number;
  large: number;
  extraLarge: number;
  full: number;
}

// Spacing configuration
export interface SpacingConfig {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

// Motion configuration
export interface MotionConfig {
  reducedMotion: boolean;
  defaultDuration: number;
}

// Accessibility configuration
export interface AccessibilityConfig {
  // Minimum touch target size (48dp recommended)
  minTouchTargetSize: number;
  // Whether to show focus indicators
  showFocusIndicator: boolean;
  // Whether haptic feedback is enabled
  hapticFeedback: boolean;
  // Font scale multiplier
  fontScale: number;
  // High contrast mode
  highContrast: boolean;
  // Screen reader announcements
  announceMessages: boolean;
}

// Complete theme configuration
export interface QuartzTheme {
  // Theme identification
  name: string;
  mode: ThemeMode;
  
  // Color scheme
  colors: ColorScheme;
  
  // Typography
  typography: TypeScale;
  
  // Spacing scale
  spacing: SpacingConfig;
  
  // Shape/border radius
  shape: ShapeConfig;
  
  // Motion settings
  motion: MotionConfig;
  
  // Accessibility settings
  accessibility: AccessibilityConfig;
  
  // Text direction
  direction: TextDirection;
  
  // Elevation helper
  elevation: (level: ElevationLevel) => object;
}

// Theme customization options
export interface ThemeOptions {
  // Custom color scheme (partial override)
  colors?: Partial<ColorScheme>;
  
  // Custom typography (partial override)
  typography?: Partial<TypeScale>;
  
  // Custom spacing
  spacing?: Partial<SpacingConfig>;
  
  // Custom shapes
  shape?: Partial<ShapeConfig>;
  
  // Motion preferences
  motion?: Partial<MotionConfig>;
  
  // Accessibility preferences
  accessibility?: Partial<AccessibilityConfig>;
  
  // Text direction
  direction?: TextDirection;
}

// Theme context value
export interface ThemeContextValue {
  theme: QuartzTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  direction: TextDirection;
  setDirection: (direction: TextDirection) => void;
  isRTL: boolean;
}

// Component style props that use theme
export interface ThemedStyleProps {
  theme: QuartzTheme;
}

// Common component props
export interface CommonComponentProps {
  // Test ID for testing
  testID?: string;
  // Accessibility label
  accessibilityLabel?: string;
  // Accessibility hint
  accessibilityHint?: string;
  // Accessibility role
  accessibilityRole?: string;
  // Whether the component is disabled
  disabled?: boolean;
}
