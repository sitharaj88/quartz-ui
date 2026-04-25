import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent, render, act } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider, useToast } from './Toast';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => (
  <SafeAreaProvider initialMetrics={{
    frame: { x: 0, y: 0, width: 320, height: 640 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  }}>
    <QuartzProvider>
      <GestureHandlerRootView>
        <ToastProvider>{ui}</ToastProvider>
      </GestureHandlerRootView>
    </QuartzProvider>
  </SafeAreaProvider>
);

function Trigger({ message = 'Saved', type }: { message?: string; type?: 'info' | 'success' | 'warning' | 'error' }) {
  const toast = useToast();
  return (
    <Pressable
      onPress={() => toast.show({ message, type, duration: 0 })}
      testID="trigger"
    >
      <Text>Trigger</Text>
    </Pressable>
  );
}

describe('Toast', () => {
  it('shows a toast via useToast().show', () => {
    const { getByTestId, getByText } = render(wrap(<Trigger message="Hello" />));
    fireEvent.press(getByTestId('trigger'));
    expect(getByText('Hello')).toBeTruthy();
  });

  it('uses alert role with polite live region', () => {
    const { getByTestId, getByRole } = render(wrap(<Trigger message="X" />));
    fireEvent.press(getByTestId('trigger'));
    expect(getByRole('alert').props.accessibilityLiveRegion).toBe('polite');
  });

  it('throws useful error when useToast is used outside provider', () => {
    function Outside() {
      try {
        useToast();
        return <Text>OK</Text>;
      } catch (e) {
        return <Text>{(e as Error).message}</Text>;
      }
    }
    const { getByText } = render(
      <SafeAreaProvider initialMetrics={{
        frame: { x: 0, y: 0, width: 320, height: 640 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
        <QuartzProvider>
          <Outside />
        </QuartzProvider>
      </SafeAreaProvider>
    );
    expect(getByText(/useToast must be used within a ToastProvider/)).toBeTruthy();
  });
});
