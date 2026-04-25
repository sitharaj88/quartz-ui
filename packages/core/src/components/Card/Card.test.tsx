import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { Card } from './Card';
import type { CardHandle } from './Card';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Card', () => {
  it('renders children', () => {
    const { getByText } = render(
      wrap(
        <Card>
          <Text>Hello</Text>
        </Card>
      )
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it.each(['elevated', 'filled', 'outlined'] as const)('renders %s variant', (variant) => {
    const { getByText } = render(
      wrap(
        <Card variant={variant}>
          <Text>X</Text>
        </Card>
      )
    );
    expect(getByText('X')).toBeTruthy();
  });

  it('is non-interactive without onPress', () => {
    const { queryByRole, getByText } = render(
      wrap(
        <Card>
          <Text>Static</Text>
        </Card>
      )
    );
    expect(getByText('Static')).toBeTruthy();
    expect(queryByRole('button')).toBeNull();
  });

  it('becomes a button when onPress is provided', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      wrap(
        <Card onPress={onPress} accessibilityLabel="Open">
          <Text>X</Text>
        </Card>
      )
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not press when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      wrap(
        <Card onPress={onPress} disabled accessibilityLabel="Open">
          <Text>X</Text>
        </Card>
      )
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('reflects disabled state', () => {
    const { getByRole } = render(
      wrap(
        <Card onPress={() => {}} disabled accessibilityLabel="Open">
          <Text>X</Text>
        </Card>
      )
    );
    expect(getByRole('button').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('honors a11y label on static cards', () => {
    const { getByLabelText } = render(
      wrap(
        <Card accessibilityLabel="Static card">
          <Text>X</Text>
        </Card>
      )
    );
    expect(getByLabelText('Static card')).toBeTruthy();
  });

  it('exposes ref handle', () => {
    const ref = React.createRef<CardHandle>();
    render(
      wrap(
        <Card ref={ref}>
          <Text>X</Text>
        </Card>
      )
    );
    expect(typeof ref.current?.focus).toBe('function');
  });
});
