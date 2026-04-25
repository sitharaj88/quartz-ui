import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { IconButton } from './IconButton';
import type { IconButtonHandle } from './IconButton';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;
const Icon = () => <View testID="icon" />;

describe('IconButton', () => {
  it('renders with required accessibilityLabel', () => {
    const { getByLabelText } = render(
      wrap(<IconButton icon={<Icon />} accessibilityLabel="Open menu" />)
    );
    expect(getByLabelText('Open menu')).toBeTruthy();
  });

  it.each(['standard', 'filled', 'tonal', 'outlined'] as const)(
    'renders %s variant',
    (variant) => {
      const { getByLabelText } = render(
        wrap(<IconButton icon={<Icon />} variant={variant} accessibilityLabel="X" />)
      );
      expect(getByLabelText('X')).toBeTruthy();
    }
  );

  it.each(['small', 'medium', 'large'] as const)('renders %s size', (size) => {
    const { getByLabelText } = render(
      wrap(<IconButton icon={<Icon />} size={size} accessibilityLabel="X" />)
    );
    expect(getByLabelText('X')).toBeTruthy();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      wrap(<IconButton icon={<Icon />} accessibilityLabel="X" onPress={onPress} />)
    );
    fireEvent.press(getByLabelText('X'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      wrap(<IconButton icon={<Icon />} accessibilityLabel="X" disabled onPress={onPress} />)
    );
    fireEvent.press(getByLabelText('X'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('uses togglebutton role when `selected` is set', () => {
    const { getByRole } = render(
      wrap(<IconButton icon={<Icon />} accessibilityLabel="Like" selected={false} />)
    );
    expect(getByRole('togglebutton')).toBeTruthy();
  });

  it('uses button role when `selected` is undefined', () => {
    const { getByRole } = render(
      wrap(<IconButton icon={<Icon />} accessibilityLabel="X" />)
    );
    expect(getByRole('button')).toBeTruthy();
  });

  it('reflects selected state', () => {
    const { getByRole } = render(
      wrap(<IconButton icon={<Icon />} accessibilityLabel="Like" selected />)
    );
    expect(getByRole('togglebutton').props.accessibilityState).toMatchObject({ selected: true });
  });

  it('reflects disabled state', () => {
    const { getByRole } = render(
      wrap(<IconButton icon={<Icon />} accessibilityLabel="X" disabled />)
    );
    expect(getByRole('button').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('expands hitSlop for small size to meet WCAG touch target', () => {
    const { getByLabelText } = render(
      wrap(<IconButton icon={<Icon />} accessibilityLabel="X" size="small" />)
    );
    // small=32, MIN_TOUCH_TARGET=48 → expand by (48-32)/2 = 8 each side.
    expect(getByLabelText('X').props.hitSlop).toEqual({ top: 8, bottom: 8, left: 8, right: 8 });
  });

  it('exposes ref handle with focus/blur', () => {
    const ref = React.createRef<IconButtonHandle>();
    render(wrap(<IconButton ref={ref} icon={<Icon />} accessibilityLabel="X" />));
    expect(typeof ref.current?.focus).toBe('function');
    expect(typeof ref.current?.blur).toBe('function');
  });
});
