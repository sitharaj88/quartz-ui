/**
 * Quartz UI - Typography Tokens
 * 
 * Typography scale with support for dynamic type and accessibility
 */

import { Platform, TextStyle } from 'react-native';

export interface TypeScaleToken {
  fontFamily: string;
  fontWeight: TextStyle['fontWeight'];
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface TypeScale {
  // Display styles - Large headlines for hero sections
  displayLarge: TypeScaleToken;
  displayMedium: TypeScaleToken;
  displaySmall: TypeScaleToken;

  // Headline styles - Section headings
  headlineLarge: TypeScaleToken;
  headlineMedium: TypeScaleToken;
  headlineSmall: TypeScaleToken;

  // Title styles - Smaller headings and prominent text
  titleLarge: TypeScaleToken;
  titleMedium: TypeScaleToken;
  titleSmall: TypeScaleToken;

  // Body styles - Main content text
  bodyLarge: TypeScaleToken;
  bodyMedium: TypeScaleToken;
  bodySmall: TypeScaleToken;

  // Label styles - Buttons, tabs, and other UI elements
  labelLarge: TypeScaleToken;
  labelMedium: TypeScaleToken;
  labelSmall: TypeScaleToken;
}

// Font family tokens
export const fontFamilies = {
  // System fonts that work across platforms
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }) as string,
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }) as string,
  brand: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }) as string,
};

// Font weight tokens
export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

// Default type scale
export const defaultTypeScale: TypeScale = {
  // Display
  displayLarge: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
  },

  // Headline
  headlineLarge: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },

  // Title
  titleLarge: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  // Body
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // Label
  labelLarge: {
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

// Helper to convert type scale token to React Native TextStyle
export function toTextStyle(token: TypeScaleToken): TextStyle {
  return {
    fontFamily: token.fontFamily,
    fontWeight: token.fontWeight,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    letterSpacing: token.letterSpacing,
  };
}

// Accessibility scaling multipliers
export const fontScaleMultipliers = {
  small: 0.85,
  default: 1.0,
  large: 1.15,
  extraLarge: 1.3,
} as const;

export type FontScaleSize = keyof typeof fontScaleMultipliers;

// Apply font scaling for accessibility
export function scaleFontSize(baseSize: number, scale: FontScaleSize = 'default'): number {
  return Math.round(baseSize * fontScaleMultipliers[scale]);
}
