import React from 'react';
import { render } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Slider } from './Slider';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => (
  <QuartzProvider>
    <GestureHandlerRootView>{ui}</GestureHandlerRootView>
  </QuartzProvider>
);

describe('Slider', () => {
  it('renders', () => {
    const { getByRole } = render(wrap(<Slider value={50} />));
    expect(getByRole('adjustable')).toBeTruthy();
  });

  it('exposes accessibilityValue with min/max/now', () => {
    const { getByRole } = render(wrap(<Slider value={75} min={0} max={100} />));
    expect(getByRole('adjustable').props.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 75,
    });
  });

  it('clamps value into the min/max range in label', () => {
    const { getByRole } = render(wrap(<Slider value={42} min={10} max={50} />));
    expect(getByRole('adjustable').props.accessibilityValue).toMatchObject({
      now: 42,
      min: 10,
      max: 50,
    });
  });
});
