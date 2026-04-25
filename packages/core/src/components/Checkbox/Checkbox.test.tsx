import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { Checkbox } from './Checkbox';
import type { CheckboxHandle } from './Checkbox';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    const { getByRole } = render(wrap(<Checkbox accessibilityLabel="Agree" />));
    expect(getByRole('checkbox').props.accessibilityState).toMatchObject({ checked: false });
  });

  it('renders checked when prop is true', () => {
    const { getByRole } = render(wrap(<Checkbox checked accessibilityLabel="X" />));
    expect(getByRole('checkbox').props.accessibilityState).toMatchObject({ checked: true });
  });

  it('renders mixed when indeterminate', () => {
    const { getByRole } = render(wrap(<Checkbox indeterminate accessibilityLabel="X" />));
    expect(getByRole('checkbox').props.accessibilityState).toMatchObject({ checked: 'mixed' });
  });

  it.each(['small', 'medium', 'large'] as const)('renders %s size', (size) => {
    const { getByRole } = render(wrap(<Checkbox size={size} accessibilityLabel="X" />));
    expect(getByRole('checkbox')).toBeTruthy();
  });

  it('fires onValueChange with toggled value (controlled)', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      wrap(<Checkbox checked={false} onValueChange={onValueChange} accessibilityLabel="X" />)
    );
    fireEvent.press(getByRole('checkbox'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('toggles internal state when uncontrolled', () => {
    const { getByRole } = render(wrap(<Checkbox accessibilityLabel="X" />));
    const cb = getByRole('checkbox');
    fireEvent.press(cb);
    expect(cb.props.accessibilityState).toMatchObject({ checked: true });
  });

  it('does not fire onValueChange when disabled', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      wrap(<Checkbox disabled onValueChange={onValueChange} accessibilityLabel="X" />)
    );
    fireEvent.press(getByRole('checkbox'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('reflects disabled state', () => {
    const { getByRole } = render(wrap(<Checkbox disabled accessibilityLabel="X" />));
    expect(getByRole('checkbox').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('expands hitSlop for small size', () => {
    const { getByRole } = render(wrap(<Checkbox size="small" accessibilityLabel="X" />));
    // small box=16, padded=24, target=48 → expand by 12 each side.
    expect(getByRole('checkbox').props.hitSlop).toEqual({
      top: 12,
      bottom: 12,
      left: 12,
      right: 12,
    });
  });

  it('exposes ref handle', () => {
    const ref = React.createRef<CheckboxHandle>();
    render(wrap(<Checkbox ref={ref} accessibilityLabel="X" />));
    expect(typeof ref.current?.focus).toBe('function');
  });
});
