import React from 'react';
import { StyleSheet, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomAppBar } from './BottomAppBar';
import type { BottomAppBarAction } from './BottomAppBar.types';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => (
  <SafeAreaProvider initialMetrics={{
    frame: { x: 0, y: 0, width: 320, height: 640 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  }}>
    <QuartzProvider>{ui}</QuartzProvider>
  </SafeAreaProvider>
);

const makeActions = (count: number, overrides: Partial<BottomAppBarAction> = {}): BottomAppBarAction[] =>
  Array.from({ length: count }, (_, i) => ({
    icon: <View testID={`action-icon-${i}`} />,
    accessibilityLabel: `Action ${i}`,
    testID: `action-${i}`,
    onPress: () => {},
    ...overrides,
  }));

describe('BottomAppBar', () => {
  describe('rendering', () => {
    it('renders action icons', () => {
      const { getByTestId } = render(wrap(<BottomAppBar actions={makeActions(3)} />));
      expect(getByTestId('action-icon-0')).toBeTruthy();
      expect(getByTestId('action-icon-1')).toBeTruthy();
      expect(getByTestId('action-icon-2')).toBeTruthy();
    });

    it('renders at most 4 actions', () => {
      const actions = Array.from({ length: 6 }, (_, i) => ({
        icon: <View testID={`action-icon-${i}`} />,
        onPress: () => {},
      }));
      const { queryByTestId } = render(wrap(<BottomAppBar actions={actions} />));
      expect(queryByTestId('action-icon-3')).toBeTruthy();
      expect(queryByTestId('action-icon-4')).toBeNull();
      expect(queryByTestId('action-icon-5')).toBeNull();
    });

    it('renders the FAB slot', () => {
      const { getByTestId } = render(
        wrap(<BottomAppBar actions={makeActions(2)} fab={<View testID="my-fab" />} />)
      );
      expect(getByTestId('my-fab')).toBeTruthy();
    });

    it('renders without actions or FAB', () => {
      const { getByTestId } = render(wrap(<BottomAppBar testID="bar" />));
      expect(getByTestId('bar')).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('calls onPress when an action is pressed', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        wrap(<BottomAppBar actions={makeActions(2, { onPress })} />)
      );
      fireEvent.press(getByTestId('action-0'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when the action is disabled', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        wrap(<BottomAppBar actions={makeActions(1, { onPress, disabled: true })} />)
      );
      fireEvent.press(getByTestId('action-0'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('exposes a toolbar role and accessibility label on the bar', () => {
      const { getByTestId } = render(
        wrap(<BottomAppBar testID="bar" accessibilityLabel="Bottom actions" />)
      );
      const bar = getByTestId('bar');
      expect(bar.props.accessibilityRole).toBe('toolbar');
      expect(bar.props.accessibilityLabel).toBe('Bottom actions');
    });

    it('exposes button roles and labels on actions', () => {
      const { getByLabelText } = render(wrap(<BottomAppBar actions={makeActions(2)} />));
      const action = getByLabelText('Action 1');
      expect(action.props.accessibilityRole).toBe('button');
    });

    it('exposes disabled state on disabled actions', () => {
      const { getByTestId } = render(
        wrap(<BottomAppBar actions={makeActions(1, { disabled: true })} />)
      );
      expect(getByTestId('action-0').props.accessibilityState).toEqual({ disabled: true });
    });
  });

  describe('styling', () => {
    it('merges custom styles', () => {
      const { getByTestId } = render(
        wrap(<BottomAppBar testID="bar" style={{ marginTop: 5 }} />)
      );
      const flat = StyleSheet.flatten(getByTestId('bar').props.style);
      expect(flat.marginTop).toBe(5);
    });

    it('applies a custom background color', () => {
      const { getByTestId } = render(
        wrap(<BottomAppBar testID="bar" backgroundColor="#123456" />)
      );
      const flat = StyleSheet.flatten(getByTestId('bar').props.style);
      expect(flat.backgroundColor).toBe('#123456');
    });
  });
});
