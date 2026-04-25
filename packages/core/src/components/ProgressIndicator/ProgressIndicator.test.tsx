import React from 'react';
import { render } from '@testing-library/react-native';

import { ProgressIndicator } from './ProgressIndicator';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('ProgressIndicator', () => {
  it('renders linear progress with progressbar role', () => {
    const { getByRole } = render(wrap(<ProgressIndicator progress={50} />));
    expect(getByRole('progressbar')).toBeTruthy();
  });

  it('renders circular variant', () => {
    const { getByRole } = render(wrap(<ProgressIndicator variant="circular" progress={25} />));
    expect(getByRole('progressbar')).toBeTruthy();
  });

  it('exposes accessibilityValue with min/max/now', () => {
    const { getByRole } = render(wrap(<ProgressIndicator progress={73} />));
    expect(getByRole('progressbar').props.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 73,
    });
  });

  it('omits `now` when indeterminate', () => {
    const { getByRole } = render(wrap(<ProgressIndicator indeterminate />));
    const v = getByRole('progressbar').props.accessibilityValue;
    expect(v.min).toBe(0);
    expect(v.max).toBe(100);
    expect(v.now).toBeUndefined();
  });

  it.each(['small', 'medium', 'large'] as const)('renders %s linear size', (size) => {
    const { getByRole } = render(wrap(<ProgressIndicator size={size} progress={10} />));
    expect(getByRole('progressbar')).toBeTruthy();
  });
});
