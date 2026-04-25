import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationBar } from './NavigationBar';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => (
  <SafeAreaProvider initialMetrics={{
    frame: { x: 0, y: 0, width: 320, height: 640 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  }}>
    <QuartzProvider>{ui}</QuartzProvider>
  </SafeAreaProvider>
);

const items = [
  { key: 'home', label: 'Home', icon: <View testID="home-icon" /> },
  { key: 'search', label: 'Search', icon: <View testID="search-icon" /> },
  { key: 'profile', label: 'Profile', icon: <View testID="profile-icon" /> },
];

describe('NavigationBar', () => {
  it('renders all items', () => {
    const { getByText } = render(
      wrap(<NavigationBar items={items} selectedKey="home" onSelect={() => {}} />)
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
  });

  it('calls onSelect with the key', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      wrap(<NavigationBar items={items} selectedKey="home" onSelect={onSelect} />)
    );
    fireEvent.press(getByText('Search'));
    expect(onSelect).toHaveBeenCalledWith('search');
  });
});
