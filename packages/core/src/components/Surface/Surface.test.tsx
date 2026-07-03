/**
 * Surface — behavioral tests.
 *
 * Covers: children rendering, background presets and custom colors, radius
 * presets and numeric radius, padding presets, ViewProps forwarding, ref.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

import { Surface } from './Surface';
import { QuartzProvider, useTheme } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

const flatStyle = (node: { props: { style: unknown } }) =>
  StyleSheet.flatten(node.props.style as any) as Record<string, unknown>;

/** Capture the resolved theme so token-driven styles can be asserted. */
function captureTheme() {
  let theme: ReturnType<typeof useTheme> | null = null;
  function Probe() {
    theme = useTheme();
    return null;
  }
  render(wrap(<Probe />));
  return theme!;
}

describe('Surface', () => {
  it('renders children', () => {
    const { getByText } = render(
      wrap(
        <Surface>
          <Text>Content</Text>
        </Surface>
      )
    );
    expect(getByText('Content')).toBeTruthy();
  });

  describe('background', () => {
    it('defaults to the surface color', () => {
      const theme = captureTheme();
      const { getByTestId } = render(wrap(<Surface testID="s" />));
      expect(flatStyle(getByTestId('s')).backgroundColor).toBe(theme.colors.surface);
    });

    it.each([
      'surface',
      'surfaceVariant',
      'surfaceContainer',
      'surfaceContainerLow',
      'surfaceContainerHigh',
      'surfaceContainerHighest',
    ] as const)('maps the %s preset to its theme color', (background) => {
      const theme = captureTheme();
      const { getByTestId } = render(wrap(<Surface testID="s" background={background} />));
      expect(flatStyle(getByTestId('s')).backgroundColor).toBe(theme.colors[background]);
    });

    it('accepts a raw hex color', () => {
      const { getByTestId } = render(wrap(<Surface testID="s" background="#FF00AA" />));
      expect(flatStyle(getByTestId('s')).backgroundColor).toBe('#FF00AA');
    });

    it('accepts a raw rgb() color', () => {
      const { getByTestId } = render(
        wrap(<Surface testID="s" background="rgba(0, 0, 0, 0.5)" />)
      );
      expect(flatStyle(getByTestId('s')).backgroundColor).toBe('rgba(0, 0, 0, 0.5)');
    });

    it('falls back to the surface color for unknown preset names', () => {
      const theme = captureTheme();
      const { getByTestId } = render(wrap(<Surface testID="s" background="bogus" />));
      expect(flatStyle(getByTestId('s')).backgroundColor).toBe(theme.colors.surface);
    });
  });

  describe('radius', () => {
    it('defaults to no radius', () => {
      const { getByTestId } = render(wrap(<Surface testID="s" />));
      expect(flatStyle(getByTestId('s')).borderRadius).toBe(0);
    });

    it.each(['extraSmall', 'small', 'medium', 'large', 'extraLarge', 'full'] as const)(
      'maps the %s radius preset to its shape token',
      (radius) => {
        const theme = captureTheme();
        const { getByTestId } = render(wrap(<Surface testID="s" radius={radius} />));
        expect(flatStyle(getByTestId('s')).borderRadius).toBe(theme.shape[radius]);
      }
    );

    it('accepts a numeric radius', () => {
      const { getByTestId } = render(wrap(<Surface testID="s" radius={13} />));
      expect(flatStyle(getByTestId('s')).borderRadius).toBe(13);
    });
  });

  describe('padding', () => {
    it('defaults to no padding', () => {
      const { getByTestId } = render(wrap(<Surface testID="s" />));
      expect(flatStyle(getByTestId('s')).padding).toBe(0);
    });

    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
      'maps the %s padding preset to its spacing token',
      (padding) => {
        const theme = captureTheme();
        const { getByTestId } = render(wrap(<Surface testID="s" padding={padding} />));
        expect(flatStyle(getByTestId('s')).padding).toBe(theme.spacing[padding]);
      }
    );
  });

  describe('style & props forwarding', () => {
    it('merges a caller style over the computed style', () => {
      const { getByTestId } = render(
        wrap(<Surface testID="s" radius={8} style={{ borderRadius: 99, margin: 5 }} />)
      );
      const flat = flatStyle(getByTestId('s'));
      expect(flat.borderRadius).toBe(99);
      expect(flat.margin).toBe(5);
    });

    it('forwards arbitrary ViewProps', () => {
      const { getByLabelText } = render(
        wrap(<Surface testID="s" accessibilityLabel="Panel" />)
      );
      expect(getByLabelText('Panel')).toBeTruthy();
    });

    it('forwards a ref to the underlying View', () => {
      const ref = React.createRef<View>();
      render(wrap(<Surface ref={ref} testID="s" />));
      expect(ref.current).toBeTruthy();
    });
  });
});
