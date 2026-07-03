/**
 * Divider — behavioral & a11y tests.
 *
 * Covers: orientation dimensions, inset variants (including custom values and
 * that vertical dividers ignore insets), style overrides, testID forwarding,
 * and that the divider is hidden from assistive technology.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';

import { Divider } from './Divider';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

const renderDivider = (props: React.ComponentProps<typeof Divider> = {}) => {
  const { getByTestId } = render(wrap(<Divider testID="divider" {...props} />));
  const divider = getByTestId('divider');
  return { divider, style: StyleSheet.flatten(divider.props.style) };
};

describe('Divider', () => {
  describe('orientation', () => {
    it('renders a horizontal hairline by default', () => {
      const { style } = renderDivider();
      expect(style.height).toBe(1);
      expect(style.width).toBe('100%');
    });

    it('renders a vertical hairline', () => {
      const { style } = renderDivider({ orientation: 'vertical' });
      expect(style.width).toBe(1);
      expect(style.height).toBe('100%');
    });
  });

  describe('insets', () => {
    it('applies no margin by default', () => {
      const { style } = renderDivider();
      expect(style.marginStart).toBeUndefined();
      expect(style.marginEnd).toBeUndefined();
      expect(style.marginHorizontal).toBeUndefined();
    });

    it('applies a start inset with the default value', () => {
      const { style } = renderDivider({ inset: 'start' });
      expect(style.marginStart).toBe(16);
    });

    it('applies an end inset with the default value', () => {
      const { style } = renderDivider({ inset: 'end' });
      expect(style.marginEnd).toBe(16);
    });

    it('applies a horizontal inset on both sides', () => {
      const { style } = renderDivider({ inset: 'both' });
      expect(style.marginHorizontal).toBe(16);
    });

    it('honors a custom insetValue', () => {
      const { style } = renderDivider({ inset: 'both', insetValue: 24 });
      expect(style.marginHorizontal).toBe(24);
    });

    it('ignores insets for vertical dividers', () => {
      const { style } = renderDivider({ orientation: 'vertical', inset: 'both' });
      expect(style.marginHorizontal).toBeUndefined();
      expect(style.marginStart).toBeUndefined();
    });
  });

  describe('theming & style', () => {
    it('uses a theme color for the hairline', () => {
      const { style } = renderDivider();
      expect(typeof style.backgroundColor).toBe('string');
      expect(style.backgroundColor).not.toBe('');
    });

    it('merges custom styles after the base style', () => {
      const { style } = renderDivider({ style: { marginVertical: 8, height: 2 } });
      expect(style.marginVertical).toBe(8);
      // Custom style wins over the base hairline height.
      expect(style.height).toBe(2);
    });
  });

  describe('accessibility', () => {
    it('is hidden from assistive technology', () => {
      const { divider } = renderDivider();
      expect(divider.props.accessible).toBe(false);
      expect(divider.props.importantForAccessibility).toBe('no');
    });
  });

  describe('testID forwarding', () => {
    it('forwards testID to the view', () => {
      const { getByTestId } = render(wrap(<Divider testID="my-divider" />));
      expect(getByTestId('my-divider')).toBeTruthy();
    });
  });
});
