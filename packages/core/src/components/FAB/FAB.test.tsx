import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { FAB } from './FAB';
import type { FABHandle } from './FAB';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;
const Icon = () => <View testID="icon" />;

describe('FAB', () => {
  it('renders with required accessibilityLabel', () => {
    const { getByLabelText } = render(wrap(<FAB icon={<Icon />} accessibilityLabel="Add" />));
    expect(getByLabelText('Add')).toBeTruthy();
  });

  it.each(['small', 'regular', 'large'] as const)('renders %s size', (size) => {
    const { getByLabelText } = render(
      wrap(<FAB icon={<Icon />} size={size} accessibilityLabel="X" />)
    );
    expect(getByLabelText('X')).toBeTruthy();
  });

  it.each(['primary', 'secondary', 'tertiary', 'surface'] as const)(
    'renders %s color',
    (color) => {
      const { getByLabelText } = render(
        wrap(<FAB icon={<Icon />} color={color} accessibilityLabel="X" />)
      );
      expect(getByLabelText('X')).toBeTruthy();
    }
  );

  it('extended FAB shows label when size=regular', () => {
    const { getByText } = render(
      wrap(<FAB icon={<Icon />} label="Compose" accessibilityLabel="Compose" />)
    );
    expect(getByText('Compose')).toBeTruthy();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      wrap(<FAB icon={<Icon />} accessibilityLabel="X" onPress={onPress} />)
    );
    fireEvent.press(getByLabelText('X'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      wrap(<FAB icon={<Icon />} accessibilityLabel="X" disabled onPress={onPress} />)
    );
    fireEvent.press(getByLabelText('X'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes ref handle', () => {
    const ref = React.createRef<FABHandle>();
    render(wrap(<FAB ref={ref} icon={<Icon />} accessibilityLabel="X" />));
    expect(typeof ref.current?.focus).toBe('function');
  });
});
