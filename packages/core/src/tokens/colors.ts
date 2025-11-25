/**
 * Quartz UI - Color Tokens
 * 
 * Color system with support for:
 * - Dynamic color generation
 * - Light and dark color schemes
 * - Custom brand colors
 * - Semantic color mapping
 */

// Base color palette types
export interface ColorPalette {
  0: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
  95: string;
  99: string;
  100: string;
}

export interface TonalPalette {
  primary: ColorPalette;
  secondary: ColorPalette;
  tertiary: ColorPalette;
  neutral: ColorPalette;
  neutralVariant: ColorPalette;
  error: ColorPalette;
}

// Semantic color tokens for light/dark schemes
export interface ColorScheme {
  // Primary colors
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  inversePrimary: string;

  // Secondary colors
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  // Tertiary colors
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  // Error colors
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Surface colors
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  inverseSurface: string;
  inverseOnSurface: string;

  // Background colors
  background: string;
  onBackground: string;

  // Outline colors
  outline: string;
  outlineVariant: string;

  // Shadow and scrim
  shadow: string;
  scrim: string;
}

// Default primary palettes
export const defaultPrimaryPalette: ColorPalette = {
  0: '#000000',
  10: '#21005D',
  20: '#381E72',
  30: '#4F378B',
  40: '#6750A4',
  50: '#7F67BE',
  60: '#9A82DB',
  70: '#B69DF8',
  80: '#D0BCFF',
  90: '#EADDFF',
  95: '#F6EDFF',
  99: '#FFFBFE',
  100: '#FFFFFF',
};

export const defaultSecondaryPalette: ColorPalette = {
  0: '#000000',
  10: '#1D192B',
  20: '#332D41',
  30: '#4A4458',
  40: '#625B71',
  50: '#7A7289',
  60: '#958DA5',
  70: '#B0A7C0',
  80: '#CCC2DC',
  90: '#E8DEF8',
  95: '#F6EDFF',
  99: '#FFFBFE',
  100: '#FFFFFF',
};

export const defaultTertiaryPalette: ColorPalette = {
  0: '#000000',
  10: '#31111D',
  20: '#492532',
  30: '#633B48',
  40: '#7D5260',
  50: '#986977',
  60: '#B58392',
  70: '#D29DAC',
  80: '#EFB8C8',
  90: '#FFD8E4',
  95: '#FFECF1',
  99: '#FFFBFA',
  100: '#FFFFFF',
};

export const defaultNeutralPalette: ColorPalette = {
  0: '#000000',
  10: '#1D1B20',
  20: '#322F35',
  30: '#48464C',
  40: '#605D64',
  50: '#79767D',
  60: '#938F96',
  70: '#AEA9B1',
  80: '#CAC5CD',
  90: '#E6E0E9',
  95: '#F5EFF7',
  99: '#FFFBFE',
  100: '#FFFFFF',
};

export const defaultNeutralVariantPalette: ColorPalette = {
  0: '#000000',
  10: '#1D1A22',
  20: '#322F37',
  30: '#49454F',
  40: '#605D66',
  50: '#79747E',
  60: '#938F99',
  70: '#AEA9B4',
  80: '#CAC4D0',
  90: '#E7E0EC',
  95: '#F5EEFA',
  99: '#FFFBFE',
  100: '#FFFFFF',
};

export const defaultErrorPalette: ColorPalette = {
  0: '#000000',
  10: '#410E0B',
  20: '#601410',
  30: '#8C1D18',
  40: '#B3261E',
  50: '#DC362E',
  60: '#E46962',
  70: '#EC928E',
  80: '#F2B8B5',
  90: '#F9DEDC',
  95: '#FCEEEE',
  99: '#FFFBF9',
  100: '#FFFFFF',
};

// Light color scheme
export const lightColorScheme: ColorScheme = {
  // Primary
  primary: defaultPrimaryPalette[40],
  onPrimary: defaultPrimaryPalette[100],
  primaryContainer: defaultPrimaryPalette[90],
  onPrimaryContainer: defaultPrimaryPalette[10],
  inversePrimary: defaultPrimaryPalette[80],

  // Secondary
  secondary: defaultSecondaryPalette[40],
  onSecondary: defaultSecondaryPalette[100],
  secondaryContainer: defaultSecondaryPalette[90],
  onSecondaryContainer: defaultSecondaryPalette[10],

  // Tertiary
  tertiary: defaultTertiaryPalette[40],
  onTertiary: defaultTertiaryPalette[100],
  tertiaryContainer: defaultTertiaryPalette[90],
  onTertiaryContainer: defaultTertiaryPalette[10],

  // Error
  error: defaultErrorPalette[40],
  onError: defaultErrorPalette[100],
  errorContainer: defaultErrorPalette[90],
  onErrorContainer: defaultErrorPalette[10],

  // Surface
  surface: '#FFFFFF',
  onSurface: defaultNeutralPalette[10],
  surfaceVariant: defaultNeutralVariantPalette[90],
  onSurfaceVariant: defaultNeutralVariantPalette[30],
  surfaceDim: '#DED8E1',
  surfaceBright: '#FFFFFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F7F2FA',
  surfaceContainer: '#F3EDF7',
  surfaceContainerHigh: '#ECE6F0',
  surfaceContainerHighest: defaultNeutralPalette[90],
  inverseSurface: defaultNeutralPalette[20],
  inverseOnSurface: defaultNeutralPalette[95],

  // Background
  background: '#F5F1F8',
  onBackground: defaultNeutralPalette[10],

  // Outline
  outline: defaultNeutralVariantPalette[50],
  outlineVariant: defaultNeutralVariantPalette[80],

  // Shadow and scrim
  shadow: defaultNeutralPalette[0],
  scrim: defaultNeutralPalette[0],
};

// Dark color scheme
export const darkColorScheme: ColorScheme = {
  // Primary
  primary: defaultPrimaryPalette[80],
  onPrimary: defaultPrimaryPalette[20],
  primaryContainer: defaultPrimaryPalette[30],
  onPrimaryContainer: defaultPrimaryPalette[90],
  inversePrimary: defaultPrimaryPalette[40],

  // Secondary
  secondary: defaultSecondaryPalette[80],
  onSecondary: defaultSecondaryPalette[20],
  secondaryContainer: defaultSecondaryPalette[30],
  onSecondaryContainer: defaultSecondaryPalette[90],

  // Tertiary
  tertiary: defaultTertiaryPalette[80],
  onTertiary: defaultTertiaryPalette[20],
  tertiaryContainer: defaultTertiaryPalette[30],
  onTertiaryContainer: defaultTertiaryPalette[90],

  // Error
  error: defaultErrorPalette[80],
  onError: defaultErrorPalette[20],
  errorContainer: defaultErrorPalette[30],
  onErrorContainer: defaultErrorPalette[90],

  // Surface
  surface: defaultNeutralPalette[10],
  onSurface: defaultNeutralPalette[90],
  surfaceVariant: defaultNeutralVariantPalette[30],
  onSurfaceVariant: defaultNeutralVariantPalette[80],
  surfaceDim: defaultNeutralPalette[10],
  surfaceBright: '#3B383E',
  surfaceContainerLowest: '#0D0E11',
  surfaceContainerLow: defaultNeutralPalette[10],
  surfaceContainer: '#211F26',
  surfaceContainerHigh: '#2B2930',
  surfaceContainerHighest: '#36343B',
  inverseSurface: defaultNeutralPalette[90],
  inverseOnSurface: defaultNeutralPalette[20],

  // Background
  background: defaultNeutralPalette[10],
  onBackground: defaultNeutralPalette[90],

  // Outline
  outline: defaultNeutralVariantPalette[60],
  outlineVariant: defaultNeutralVariantPalette[30],

  // Shadow and scrim
  shadow: defaultNeutralPalette[0],
  scrim: defaultNeutralPalette[0],
};

// Color utility functions
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function withOpacity(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

// State layer opacities
export const stateLayerOpacity = {
  hover: 0.08,
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
} as const;
