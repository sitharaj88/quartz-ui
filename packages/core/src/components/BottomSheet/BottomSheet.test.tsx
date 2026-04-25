import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomSheet } from './BottomSheet';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => (
  <SafeAreaProvider initialMetrics={{
    frame: { x: 0, y: 0, width: 320, height: 640 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  }}>
    <QuartzProvider>
      <GestureHandlerRootView>{ui}</GestureHandlerRootView>
    </QuartzProvider>
  </SafeAreaProvider>
);

describe('BottomSheet', () => {
  it('renders children when visible', () => {
    const { getByText } = render(
      wrap(
        <BottomSheet visible onDismiss={() => {}} modal={false}>
          <Text>Content</Text>
        </BottomSheet>
      )
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('does not render content when not visible (non-modal)', () => {
    const { queryByText } = render(
      wrap(
        <BottomSheet visible={false} onDismiss={() => {}} modal={false}>
          <Text>Hidden</Text>
        </BottomSheet>
      )
    );
    expect(queryByText('Hidden')).toBeNull();
  });
});
