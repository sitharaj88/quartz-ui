import React from 'react';
import { Text, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppBar } from './AppBar';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => (
  <SafeAreaProvider initialMetrics={{
    frame: { x: 0, y: 0, width: 320, height: 640 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  }}>
    <QuartzProvider>{ui}</QuartzProvider>
  </SafeAreaProvider>
);

describe('AppBar', () => {
  it('renders title', () => {
    const { getByText } = render(wrap(<AppBar title="Inbox" />));
    expect(getByText('Inbox')).toBeTruthy();
  });

  it.each(['center-aligned', 'small', 'medium', 'large'] as const)(
    'renders %s variant',
    (variant) => {
      const { getByText } = render(wrap(<AppBar title="X" variant={variant} />));
      expect(getByText('X')).toBeTruthy();
    }
  );

  it('uses header role', () => {
    const { UNSAFE_getByProps } = render(wrap(<AppBar title="X" />));
    // RNTL's getByRole doesn't map "header"; use prop query.
    expect(UNSAFE_getByProps({ accessibilityRole: 'header' })).toBeTruthy();
  });

  it('fires onNavigationPress', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      wrap(
        <AppBar
          title="X"
          navigationIcon={<View />}
          onNavigationPress={onPress}
        />
      )
    );
    fireEvent.press(getByLabelText('Navigate back'));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders action buttons', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      wrap(
        <AppBar
          title="X"
          actions={[{
            icon: <View />,
            onPress,
            accessibilityLabel: 'Search',
          }]}
        />
      )
    );
    fireEvent.press(getByLabelText('Search'));
    expect(onPress).toHaveBeenCalled();
  });
});
