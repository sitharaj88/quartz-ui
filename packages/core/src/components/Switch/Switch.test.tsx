import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { Switch } from './Switch';
import type { SwitchHandle } from './Switch';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Switch', () => {
  it('renders off by default (uncontrolled)', () => {
    const { getByRole } = render(wrap(<Switch accessibilityLabel="X" />));
    expect(getByRole('switch').props.accessibilityState).toMatchObject({ checked: false });
  });

  it('renders on when controlled value is true', () => {
    const { getByRole } = render(wrap(<Switch value accessibilityLabel="X" />));
    expect(getByRole('switch').props.accessibilityState).toMatchObject({ checked: true });
  });

  it('toggles uncontrolled state on press', () => {
    const { getByRole } = render(wrap(<Switch accessibilityLabel="X" />));
    const sw = getByRole('switch');
    fireEvent.press(sw);
    expect(sw.props.accessibilityState).toMatchObject({ checked: true });
  });

  it('fires onValueChange with toggled value', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      wrap(<Switch value={false} onValueChange={onValueChange} accessibilityLabel="X" />)
    );
    fireEvent.press(getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('does not fire onValueChange when disabled', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      wrap(<Switch disabled onValueChange={onValueChange} accessibilityLabel="X" />)
    );
    fireEvent.press(getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('reflects disabled state', () => {
    const { getByRole } = render(wrap(<Switch disabled accessibilityLabel="X" />));
    expect(getByRole('switch').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('uses defaultValue for initial uncontrolled state', () => {
    const { getByRole } = render(wrap(<Switch defaultValue accessibilityLabel="X" />));
    expect(getByRole('switch').props.accessibilityState).toMatchObject({ checked: true });
  });

  it('exposes ref handle', () => {
    const ref = React.createRef<SwitchHandle>();
    render(wrap(<Switch ref={ref} accessibilityLabel="X" />));
    expect(typeof ref.current?.focus).toBe('function');
  });
});
