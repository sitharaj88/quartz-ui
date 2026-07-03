/**
 * Color token utility tests (legacy helpers).
 */

import { withAlpha } from '../utils/color';
import { hexToRgb, rgbToHex, withOpacity } from './colors';

describe('withOpacity (deprecated)', () => {
  it('delegates to withAlpha for 6-digit hex', () => {
    expect(withOpacity('#1A73E8', 0.5)).toBe(withAlpha('#1A73E8', 0.5));
  });

  it('now supports shorthand hex via withAlpha', () => {
    expect(withOpacity('#fff', 0.25)).toBe('rgba(255,255,255,0.25)');
  });

  it('passes unparseable colors through unchanged', () => {
    expect(withOpacity('not-a-color', 0.5)).toBe('not-a-color');
  });
});

describe('hexToRgb / rgbToHex (deprecated)', () => {
  it('round-trips a 6-digit hex color', () => {
    const rgb = hexToRgb('#1A73E8');
    expect(rgb).toEqual({ r: 26, g: 115, b: 232 });
    expect(rgbToHex(26, 115, 232).toUpperCase()).toBe('#1A73E8');
  });

  it('returns null for invalid hex', () => {
    expect(hexToRgb('nope')).toBeNull();
  });
});
