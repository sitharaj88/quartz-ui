/**
 * Quartz UI - Color Utilities
 *
 * Robust color manipulation. Replaces fragile hex+hex string concatenation
 * (e.g. `colors.primary + '1F'`) which breaks for shorthand hex, rgb(), rgba(),
 * and named colors.
 */

const HEX3 = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/;
const HEX4 = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/;
const HEX6 = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
const HEX8 = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
const RGB = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/;

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parse(input: string): RGBA | null {
  const value = input.trim();

  let m = value.match(HEX8);
  if (m) {
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
      a: parseInt(m[4], 16) / 255,
    };
  }

  m = value.match(HEX6);
  if (m) {
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
      a: 1,
    };
  }

  m = value.match(HEX4);
  if (m) {
    return {
      r: parseInt(m[1] + m[1], 16),
      g: parseInt(m[2] + m[2], 16),
      b: parseInt(m[3] + m[3], 16),
      a: parseInt(m[4] + m[4], 16) / 255,
    };
  }

  m = value.match(HEX3);
  if (m) {
    return {
      r: parseInt(m[1] + m[1], 16),
      g: parseInt(m[2] + m[2], 16),
      b: parseInt(m[3] + m[3], 16),
      a: 1,
    };
  }

  m = value.match(RGB);
  if (m) {
    return {
      r: Math.min(255, parseInt(m[1], 10)),
      g: Math.min(255, parseInt(m[2], 10)),
      b: Math.min(255, parseInt(m[3], 10)),
      a: m[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(m[4]))) : 1,
    };
  }

  return null;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/**
 * Apply an alpha channel to a color. Multiplies with any existing alpha.
 *
 * @example
 *   withAlpha('#1A73E8', 0.12)        // 'rgba(26,115,232,0.12)'
 *   withAlpha('rgba(0,0,0,0.5)', 0.5) // 'rgba(0,0,0,0.25)'
 *   withAlpha('transparent', 0.5)     // 'transparent'
 */
export function withAlpha(color: string, alpha: number): string {
  if (color === 'transparent' || color === 'none') return 'transparent';
  const a = clamp01(alpha);
  if (a === 0) return 'transparent';

  const parsed = parse(color);
  if (!parsed) return color;

  const finalAlpha = clamp01(parsed.a * a);
  return `rgba(${parsed.r},${parsed.g},${parsed.b},${finalAlpha})`;
}

/**
 * Compute relative luminance per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function luminance(color: string): number {
  const parsed = parse(color);
  if (!parsed) return 0;
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(parsed.r) + 0.7152 * channel(parsed.g) + 0.0722 * channel(parsed.b);
}

/**
 * Compute WCAG contrast ratio between two colors. Range 1–21.
 * AA requires ≥4.5 for normal text, ≥3 for large text. AAA requires ≥7 / ≥4.5.
 */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pick the foreground color (from `light`/`dark`) that has higher contrast against `bg`.
 */
export function pickForeground(bg: string, light = '#FFFFFF', dark = '#000000'): string {
  return contrastRatio(bg, light) >= contrastRatio(bg, dark) ? light : dark;
}
