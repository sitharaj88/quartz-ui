/**
 * Color utility tests.
 */

import { contrastRatio, luminance, pickForeground, withAlpha } from './color';

describe('withAlpha', () => {
  it('handles 6-digit hex', () => {
    expect(withAlpha('#1A73E8', 0.5)).toBe('rgba(26,115,232,0.5)');
  });

  it('handles 3-digit hex', () => {
    expect(withAlpha('#fff', 0.25)).toBe('rgba(255,255,255,0.25)');
  });

  it('multiplies existing alpha for 8-digit hex', () => {
    // 8-digit hex with FF alpha → still 1.0; multiplied by 0.5 → 0.5
    expect(withAlpha('#1A73E8FF', 0.5)).toBe('rgba(26,115,232,0.5)');
    // 8-digit hex with 80 alpha (~0.5) × 0.5 → 0.25
    const result = withAlpha('#1A73E880', 0.5);
    expect(result).toMatch(/^rgba\(26,115,232,0\.2/);
  });

  it('handles rgb()', () => {
    expect(withAlpha('rgb(10, 20, 30)', 0.7)).toBe('rgba(10,20,30,0.7)');
  });

  it('multiplies alpha for rgba()', () => {
    expect(withAlpha('rgba(10,20,30,0.5)', 0.5)).toBe('rgba(10,20,30,0.25)');
  });

  it('passes transparent through', () => {
    expect(withAlpha('transparent', 0.5)).toBe('transparent');
  });

  it('clamps alpha to [0, 1]', () => {
    expect(withAlpha('#000', -1)).toBe('transparent');
    expect(withAlpha('#000', 2)).toBe('rgba(0,0,0,1)');
  });

  it('returns input unchanged for unparseable colors', () => {
    expect(withAlpha('not-a-color', 0.5)).toBe('not-a-color');
  });
});

describe('luminance & contrastRatio', () => {
  it('white has luminance 1', () => {
    expect(luminance('#FFFFFF')).toBeCloseTo(1, 4);
  });

  it('black has luminance 0', () => {
    expect(luminance('#000000')).toBe(0);
  });

  it('contrast(white, black) = 21', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 1);
  });
});

describe('pickForeground', () => {
  it('returns black on white background', () => {
    expect(pickForeground('#FFFFFF')).toBe('#000000');
  });

  it('returns white on black background', () => {
    expect(pickForeground('#000000')).toBe('#FFFFFF');
  });

  it('respects custom foreground choices', () => {
    expect(pickForeground('#000000', '#EEEEEE', '#222222')).toBe('#EEEEEE');
  });
});
