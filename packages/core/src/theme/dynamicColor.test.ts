/**
 * Dynamic color — tonal palette generation and scheme assembly.
 */

import {
  generateTonalPalette,
  generateTonalPalettes,
  createDynamicColorScheme,
  toneColor,
} from './dynamicColor';
import { createCustomColorScheme, createDynamicThemes } from './createTheme';
import { luminance, contrastRatio } from '../utils/color';

const SEEDS = ['#1A73E8', '#B3261E', '#0F9D58', '#6750A4', '#FF8800'];

describe('toneColor', () => {
  it('anchors tone 0 to black and tone 100 to white', () => {
    expect(toneColor(250, 0.15, 0)).toBe('#000000');
    expect(toneColor(250, 0.15, 100)).toBe('#FFFFFF');
  });

  it('produces monotonically lighter colors as tone increases', () => {
    const tones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99];
    for (const seedHue of [0, 90, 180, 270]) {
      let prev = -1;
      for (const tone of tones) {
        const lum = luminance(toneColor(seedHue, 0.12, tone));
        expect(lum).toBeGreaterThan(prev);
        prev = lum;
      }
    }
  });
});

describe('generateTonalPalette', () => {
  it('returns all 13 MD3 tone stops', () => {
    const palette = generateTonalPalette('#1A73E8');
    for (const stop of [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100]) {
      expect(palette[stop as keyof typeof palette]).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('throws on invalid seed colors', () => {
    expect(() => generateTonalPalette('not-a-color')).toThrow(/invalid seed color/);
    expect(() => generateTonalPalette('rgb(1,2,3)')).toThrow(/invalid seed color/);
  });

  it('accepts shorthand hex', () => {
    expect(generateTonalPalette('#17E')[40]).toMatch(/^#[0-9A-F]{6}$/);
  });
});

describe('generateTonalPalettes', () => {
  it('keeps the error palette fixed regardless of seed', () => {
    const a = generateTonalPalettes('#1A73E8');
    const b = generateTonalPalettes('#0F9D58');
    expect(a.error).toEqual(b.error);
  });

  it('desaturates neutrals relative to primary', () => {
    const p = generateTonalPalettes('#1A73E8');
    // At the same tone, neutral should be much closer to gray than primary.
    const spread = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return Math.max(r, g, b) - Math.min(r, g, b);
    };
    expect(spread(p.neutral[50])).toBeLessThan(spread(p.primary[50]) / 2);
  });
});

describe('createDynamicColorScheme', () => {
  it.each(SEEDS)('meets WCAG AA for core role pairs (seed %s, light)', (seed) => {
    const s = createDynamicColorScheme(seed, 'light');
    expect(contrastRatio(s.primary, s.onPrimary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(s.primaryContainer, s.onPrimaryContainer)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(s.secondaryContainer, s.onSecondaryContainer)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(s.surface, s.onSurface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(s.error, s.onError)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(SEEDS)('meets WCAG AA for core role pairs (seed %s, dark)', (seed) => {
    const s = createDynamicColorScheme(seed, 'dark');
    expect(contrastRatio(s.primary, s.onPrimary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(s.primaryContainer, s.onPrimaryContainer)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(s.surface, s.onSurface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(s.error, s.onError)).toBeGreaterThanOrEqual(4.5);
  });

  it('orders the light surface-container ramp from lightest to darkest', () => {
    const s = createDynamicColorScheme('#1A73E8', 'light');
    const ramp = [
      s.surfaceContainerLowest,
      s.surfaceContainerLow,
      s.surfaceContainer,
      s.surfaceContainerHigh,
      s.surfaceContainerHighest,
    ].map(luminance);
    for (let i = 1; i < ramp.length; i++) {
      expect(ramp[i]).toBeLessThan(ramp[i - 1]);
    }
  });

  it('orders the dark surface-container ramp from darkest to lightest', () => {
    const s = createDynamicColorScheme('#1A73E8', 'dark');
    const ramp = [
      s.surfaceContainerLowest,
      s.surfaceContainerLow,
      s.surfaceContainer,
      s.surfaceContainerHigh,
      s.surfaceContainerHighest,
    ].map(luminance);
    for (let i = 1; i < ramp.length; i++) {
      expect(ramp[i]).toBeGreaterThan(ramp[i - 1]);
    }
  });
});

describe('createCustomColorScheme', () => {
  it('returns a complete scheme, not just a primary override', () => {
    const s = createCustomColorScheme('#0F9D58');
    expect(s.primary).toBeDefined();
    expect(s.surfaceContainerHighest).toBeDefined();
    expect(s.outlineVariant).toBeDefined();
    expect(Object.keys(s).length).toBeGreaterThanOrEqual(36);
  });
});

describe('createDynamicThemes', () => {
  it('returns a matched light/dark pair honoring overrides', () => {
    const { light, dark } = createDynamicThemes('#1A73E8', {
      colors: { error: '#FF0000' },
    });
    expect(light.mode).toBe('light');
    expect(dark.mode).toBe('dark');
    expect(light.colors.primary).not.toBe(dark.colors.primary);
    expect(light.colors.error).toBe('#FF0000');
    expect(dark.colors.error).toBe('#FF0000');
  });
});
