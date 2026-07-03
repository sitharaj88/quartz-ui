/**
 * Quartz UI - Dynamic Color
 *
 * Material-You-style dynamic color: derive complete light/dark color schemes
 * from a single seed color. Implemented with Oklab/Oklch (perceptually uniform,
 * self-contained math — no dependencies):
 *
 *   seed → Oklch hue+chroma → tonal palettes (tone = CIE L*, per MD3) → scheme
 *
 * Palette roles follow the Material 3 recipe: primary keeps the seed hue at
 * full chroma, secondary is a muted companion, tertiary rotates the hue +60°,
 * neutrals carry a whisper of the seed so surfaces feel tinted, and error is
 * a fixed red family. Out-of-gamut colors are resolved by reducing chroma at
 * constant lightness, so tones stay true.
 */

import { ColorPalette, TonalPalette, ColorScheme, defaultErrorPalette } from '../tokens/colors';

// ─── sRGB ↔ Oklab conversion ─────────────────────────────────────────

interface Oklch {
  /** Perceptual lightness 0–1 */
  l: number;
  /** Chroma (0 ≈ gray, ~0.3 = maximally vivid in sRGB) */
  c: number;
  /** Hue angle in degrees 0–360 */
  h: number;
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(channel: number): number {
  const c = channel <= 0.0031308 ? channel * 12.92 : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, c)) * 255);
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(hex.trim());
  if (short) {
    return {
      r: parseInt(short[1] + short[1], 16),
      g: parseInt(short[2] + short[2], 16),
      b: parseInt(short[3] + short[3], 16),
    };
  }
  const full = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex.trim());
  if (full) {
    return {
      r: parseInt(full[1], 16),
      g: parseInt(full[2], 16),
      b: parseInt(full[3], 16),
    };
  }
  return null;
}

function toHex(r: number, g: number, b: number): string {
  const part = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** sRGB (0–255 channels) → Oklch. */
function rgbToOklch(r: number, g: number, b: number): Oklch {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const c = Math.sqrt(a * a + bb * bb);
  let h = (Math.atan2(bb, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return { l: L, c, h };
}

/** Oklch → linear sRGB (unclamped — used for gamut checking). */
function oklchToLinearRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const bb = c * Math.sin(hr);

  const l_ = Math.pow(l + 0.3963377774 * a + 0.2158037573 * bb, 3);
  const m_ = Math.pow(l - 0.1055613458 * a - 0.0638541728 * bb, 3);
  const s_ = Math.pow(l - 0.0894841775 * a - 1.291485548 * bb, 3);

  return {
    r: 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    g: -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    b: -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  };
}

function inGamut(rgb: { r: number; g: number; b: number }): boolean {
  const eps = 1e-4;
  return (
    rgb.r >= -eps && rgb.r <= 1 + eps &&
    rgb.g >= -eps && rgb.g <= 1 + eps &&
    rgb.b >= -eps && rgb.b <= 1 + eps
  );
}

// ─── Tone mapping (MD3 tone = CIE L*) ────────────────────────────────

/** CIE L* (0–100) → relative luminance Y (0–1). */
function lstarToY(lstar: number): number {
  return lstar > 8 ? Math.pow((lstar + 16) / 116, 3) : lstar / 903.2962962;
}

/** Oklab lightness of an achromatic color with luminance Y is cbrt(Y). */
function toneToOklabL(tone: number): number {
  return Math.cbrt(lstarToY(tone));
}

/**
 * Produce the sRGB hex for a given hue/chroma at an MD3 tone (0 = black,
 * 100 = white). Chroma is reduced at constant lightness until the color
 * fits the sRGB gamut, so light and dark tones never shift hue.
 */
export function toneColor(hue: number, chroma: number, tone: number): string {
  if (tone <= 0) return '#000000';
  if (tone >= 100) return '#FFFFFF';

  const l = toneToOklabL(tone);

  let c = chroma;
  let rgb = oklchToLinearRgb(l, c, hue);
  if (!inGamut(rgb)) {
    // Binary-search the largest in-gamut chroma at this lightness.
    let lo = 0;
    let hi = c;
    for (let i = 0; i < 20; i++) {
      c = (lo + hi) / 2;
      rgb = oklchToLinearRgb(l, c, hue);
      if (inGamut(rgb)) lo = c;
      else hi = c;
    }
    rgb = oklchToLinearRgb(l, lo, hue);
  }

  return toHex(linearToSrgb(rgb.r), linearToSrgb(rgb.g), linearToSrgb(rgb.b));
}

// ─── Palette generation ──────────────────────────────────────────────

const PALETTE_TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const;

/** Generate a 13-stop MD3 tonal palette for a hue/chroma pair. */
export function paletteFromHueChroma(hue: number, chroma: number): ColorPalette {
  const palette = {} as Record<number, string>;
  for (const tone of PALETTE_TONES) {
    palette[tone] = toneColor(hue, chroma, tone);
  }
  return palette as unknown as ColorPalette;
}

/** Generate a tonal palette from a seed color, keeping its hue and chroma. */
export function generateTonalPalette(seedColor: string): ColorPalette {
  const rgb = parseHex(seedColor);
  if (!rgb) {
    throw new Error(`Quartz UI: invalid seed color "${seedColor}" — expected a hex color.`);
  }
  const { c, h } = rgbToOklch(rgb.r, rgb.g, rgb.b);
  return paletteFromHueChroma(h, c);
}

// Role chromas, in Oklch units (sRGB max ≈ 0.3). Tuned to sit close to the
// MD3 HCT recipe: primary = max(seed, vivid), secondary muted, tertiary
// rotated +60°, neutrals faintly tinted.
const CHROMA = {
  primaryFloor: 0.11,
  secondary: 0.04,
  tertiary: 0.06,
  neutral: 0.01,
  neutralVariant: 0.02,
} as const;

/** Generate the full set of MD3 tonal palettes from one seed color. */
export function generateTonalPalettes(seedColor: string): TonalPalette {
  const rgb = parseHex(seedColor);
  if (!rgb) {
    throw new Error(`Quartz UI: invalid seed color "${seedColor}" — expected a hex color.`);
  }
  const { c, h } = rgbToOklch(rgb.r, rgb.g, rgb.b);
  const primaryChroma = Math.max(CHROMA.primaryFloor, c);

  return {
    primary: paletteFromHueChroma(h, primaryChroma),
    secondary: paletteFromHueChroma(h, CHROMA.secondary),
    tertiary: paletteFromHueChroma((h + 60) % 360, CHROMA.tertiary),
    neutral: paletteFromHueChroma(h, CHROMA.neutral),
    neutralVariant: paletteFromHueChroma(h, CHROMA.neutralVariant),
    error: defaultErrorPalette,
  };
}

// ─── Scheme assembly ─────────────────────────────────────────────────

/**
 * Build a complete MD3 color scheme (all 36 roles, including the tonal
 * surface-container ramp) from a seed color.
 *
 * @example
 *   const scheme = createDynamicColorScheme('#1A73E8', 'dark');
 */
export function createDynamicColorScheme(seedColor: string, mode: 'light' | 'dark'): ColorScheme {
  const rgb = parseHex(seedColor);
  if (!rgb) {
    throw new Error(`Quartz UI: invalid seed color "${seedColor}" — expected a hex color.`);
  }
  const { h } = rgbToOklch(rgb.r, rgb.g, rgb.b);
  const p = generateTonalPalettes(seedColor);

  // Surfaces use arbitrary tones (98, 96, 94…) not present in the 13-stop
  // palette, so compute them directly at neutral chroma.
  const neutral = (tone: number) => toneColor(h, CHROMA.neutral, tone);
  const neutralVariant = (tone: number) => toneColor(h, CHROMA.neutralVariant, tone);

  if (mode === 'light') {
    return {
      primary: p.primary[40],
      onPrimary: p.primary[100],
      primaryContainer: p.primary[90],
      onPrimaryContainer: p.primary[10],
      inversePrimary: p.primary[80],

      secondary: p.secondary[40],
      onSecondary: p.secondary[100],
      secondaryContainer: p.secondary[90],
      onSecondaryContainer: p.secondary[10],

      tertiary: p.tertiary[40],
      onTertiary: p.tertiary[100],
      tertiaryContainer: p.tertiary[90],
      onTertiaryContainer: p.tertiary[10],

      error: p.error[40],
      onError: p.error[100],
      errorContainer: p.error[90],
      onErrorContainer: p.error[10],

      surface: neutral(98),
      onSurface: p.neutral[10],
      surfaceVariant: neutralVariant(90),
      onSurfaceVariant: neutralVariant(30),
      surfaceDim: neutral(87),
      surfaceBright: neutral(98),
      surfaceContainerLowest: neutral(100),
      surfaceContainerLow: neutral(96),
      surfaceContainer: neutral(94),
      surfaceContainerHigh: neutral(92),
      surfaceContainerHighest: neutral(90),
      inverseSurface: p.neutral[20],
      inverseOnSurface: p.neutral[95],

      background: neutral(98),
      onBackground: p.neutral[10],

      outline: neutralVariant(50),
      outlineVariant: neutralVariant(80),

      shadow: p.neutral[0],
      scrim: p.neutral[0],
    };
  }

  return {
    primary: p.primary[80],
    onPrimary: p.primary[20],
    primaryContainer: p.primary[30],
    onPrimaryContainer: p.primary[90],
    inversePrimary: p.primary[40],

    secondary: p.secondary[80],
    onSecondary: p.secondary[20],
    secondaryContainer: p.secondary[30],
    onSecondaryContainer: p.secondary[90],

    tertiary: p.tertiary[80],
    onTertiary: p.tertiary[20],
    tertiaryContainer: p.tertiary[30],
    onTertiaryContainer: p.tertiary[90],

    error: p.error[80],
    onError: p.error[20],
    errorContainer: p.error[30],
    onErrorContainer: p.error[90],

    surface: neutral(6),
    onSurface: p.neutral[90],
    surfaceVariant: neutralVariant(30),
    onSurfaceVariant: neutralVariant(80),
    surfaceDim: neutral(6),
    surfaceBright: neutral(24),
    surfaceContainerLowest: neutral(4),
    surfaceContainerLow: neutral(10),
    surfaceContainer: neutral(12),
    surfaceContainerHigh: neutral(17),
    surfaceContainerHighest: neutral(22),
    inverseSurface: p.neutral[90],
    inverseOnSurface: p.neutral[20],

    background: neutral(6),
    onBackground: p.neutral[90],

    outline: neutralVariant(60),
    outlineVariant: neutralVariant(30),

    shadow: p.neutral[0],
    scrim: p.neutral[0],
  };
}
