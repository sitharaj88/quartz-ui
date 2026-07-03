/**
 * Gradient — behavioral tests.
 *
 * expo-linear-gradient is mocked globally (jest.setup.js) as a plain View, so
 * gradient colors/start/end props are asserted directly on the rendered node.
 * Covers: Gradient, GradientCard, GradientButton, GradientBorder.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { Gradient, GradientCard, GradientButton, GradientBorder } from './Gradient';
import { directionMap, gradientPresets } from './Gradient.types';
import type { GradientDirection, GradientPreset } from './Gradient.types';
import { QuartzProvider, useTheme } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

/** Capture the resolved theme so preset fallbacks can be asserted. */
function captureTheme() {
  let theme: ReturnType<typeof useTheme> | null = null;
  function Probe() {
    theme = useTheme();
    return null;
  }
  render(wrap(<Probe />));
  return theme!;
}

describe('Gradient', () => {
  it('renders children', () => {
    const { getByText } = render(
      wrap(
        <Gradient testID="g">
          <Text>Inside</Text>
        </Gradient>
      )
    );
    expect(getByText('Inside')).toBeTruthy();
  });

  it('defaults to theme primary colors when no colors or preset given', () => {
    const theme = captureTheme();
    const { getByTestId } = render(wrap(<Gradient testID="g" />));
    expect(getByTestId('g').props.colors).toEqual([
      theme.colors.primary,
      theme.colors.primaryContainer,
    ]);
  });

  it('passes explicit colors through', () => {
    const { getByTestId } = render(
      wrap(<Gradient testID="g" colors={['#111111', '#222222', '#333333']} />)
    );
    expect(getByTestId('g').props.colors).toEqual(['#111111', '#222222', '#333333']);
  });

  it('ignores a colors array with fewer than two entries', () => {
    const theme = captureTheme();
    const { getByTestId } = render(wrap(<Gradient testID="g" colors={['#111111']} />));
    expect(getByTestId('g').props.colors).toEqual([
      theme.colors.primary,
      theme.colors.primaryContainer,
    ]);
  });

  it.each(Object.keys(gradientPresets) as GradientPreset[])(
    'resolves the %s preset colors',
    (preset) => {
      const { getByTestId } = render(wrap(<Gradient testID="g" preset={preset} />));
      expect(getByTestId('g').props.colors).toEqual(gradientPresets[preset]);
    }
  );

  it('prefers explicit colors over a preset', () => {
    const { getByTestId } = render(
      wrap(<Gradient testID="g" preset="sunset" colors={['#000000', '#ffffff']} />)
    );
    expect(getByTestId('g').props.colors).toEqual(['#000000', '#ffffff']);
  });

  it.each(Object.keys(directionMap) as GradientDirection[])(
    'maps the %s direction to start/end points',
    (direction) => {
      const { getByTestId } = render(wrap(<Gradient testID="g" direction={direction} />));
      const node = getByTestId('g');
      expect(node.props.start).toEqual(directionMap[direction].start);
      expect(node.props.end).toEqual(directionMap[direction].end);
    }
  );

  it('lets explicit start/end override the direction mapping', () => {
    const start = { x: 0.25, y: 0.75 };
    const end = { x: 0.75, y: 0.25 };
    const { getByTestId } = render(
      wrap(<Gradient testID="g" direction="horizontal" start={start} end={end} />)
    );
    const node = getByTestId('g');
    expect(node.props.start).toEqual(start);
    expect(node.props.end).toEqual(end);
  });

  it('forwards locations', () => {
    const { getByTestId } = render(
      wrap(<Gradient testID="g" locations={[0, 0.3, 1]} colors={['#1', '#2', '#3']} />)
    );
    expect(getByTestId('g').props.locations).toEqual([0, 0.3, 1]);
  });
});

describe('GradientCard', () => {
  it('renders children', () => {
    const { getByText } = render(
      wrap(
        <GradientCard testID="card">
          <Text>Card content</Text>
        </GradientCard>
      )
    );
    expect(getByText('Card content')).toBeTruthy();
  });

  it('defaults to the purple preset', () => {
    const { getByTestId } = render(wrap(<GradientCard testID="card" />));
    expect(getByTestId('card').props.colors).toEqual(gradientPresets.purple);
  });

  it('applies the default border radius and padding', () => {
    const { getByTestId } = render(wrap(<GradientCard testID="card" />));
    const flat = StyleSheet.flatten(getByTestId('card').props.style);
    expect(flat.borderRadius).toBe(16);
    expect(flat.padding).toBe(16);
  });

  it('honors a custom borderRadius', () => {
    const { getByTestId } = render(wrap(<GradientCard testID="card" borderRadius={4} />));
    const flat = StyleSheet.flatten(getByTestId('card').props.style);
    expect(flat.borderRadius).toBe(4);
  });
});

describe('GradientButton', () => {
  it('renders its label', () => {
    const { getByText } = render(wrap(<GradientButton label="Go" testID="btn" />));
    expect(getByText('Go')).toBeTruthy();
  });

  it('renders children when no label is given', () => {
    const { getByTestId } = render(
      wrap(
        <GradientButton testID="btn">
          <View testID="custom-child" />
        </GradientButton>
      )
    );
    expect(getByTestId('custom-child')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      wrap(<GradientButton label="Tap" onPress={onPress} />)
    );
    fireEvent.press(getByText('Tap'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('defaults to the primary preset', () => {
    const { getByTestId } = render(wrap(<GradientButton testID="btn" label="X" />));
    expect(getByTestId('btn').props.colors).toEqual(gradientPresets.primary);
  });
});

describe('GradientBorder', () => {
  it('renders children inside the inner surface', () => {
    const { getByText } = render(
      wrap(
        <GradientBorder testID="border">
          <Text>Bordered</Text>
        </GradientBorder>
      )
    );
    expect(getByText('Bordered')).toBeTruthy();
  });

  it('defaults to the purple preset', () => {
    const { getByTestId } = render(wrap(<GradientBorder testID="border" />));
    expect(getByTestId('border').props.colors).toEqual(gradientPresets.purple);
  });

  it('uses borderWidth as padding for the gradient ring', () => {
    const { getByTestId } = render(
      wrap(<GradientBorder testID="border" borderWidth={5} />)
    );
    const flat = StyleSheet.flatten(getByTestId('border').props.style);
    expect(flat.padding).toBe(5);
  });
});
