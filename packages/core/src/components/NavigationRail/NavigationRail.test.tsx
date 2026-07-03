import React from 'react';
import { Text, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationRail, RailDestination } from './NavigationRail';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => (
  <SafeAreaProvider initialMetrics={{
    frame: { x: 0, y: 0, width: 320, height: 640 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  }}>
    <QuartzProvider>{ui}</QuartzProvider>
  </SafeAreaProvider>
);

const destinations: RailDestination[] = [
  { key: 'home', label: 'Home', icon: <View testID="home-icon" />, badge: 3 },
  { key: 'search', label: 'Search', icon: <View testID="search-icon" /> },
  { key: 'settings', label: 'Settings', icon: <View testID="settings-icon" />, disabled: true },
];

describe('NavigationRail', () => {
  it('renders all destination labels by default (labelType "all")', () => {
    const { getByText } = render(
      wrap(
        <NavigationRail
          destinations={destinations}
          selectedKey="home"
          onSelect={() => {}}
        />
      )
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders destination icons', () => {
    const { getByTestId } = render(
      wrap(<NavigationRail destinations={destinations} selectedKey="home" />)
    );
    expect(getByTestId('home-icon')).toBeTruthy();
    expect(getByTestId('search-icon')).toBeTruthy();
    expect(getByTestId('settings-icon')).toBeTruthy();
  });

  it('shows the selected icon for the active destination', () => {
    const withSelectedIcon: RailDestination[] = [
      {
        key: 'home',
        label: 'Home',
        icon: <View testID="home-outline" />,
        selectedIcon: <View testID="home-filled" />,
      },
    ];
    const { getByTestId, queryByTestId } = render(
      wrap(<NavigationRail destinations={withSelectedIcon} selectedKey="home" />)
    );
    expect(getByTestId('home-filled')).toBeTruthy();
    expect(queryByTestId('home-outline')).toBeNull();
  });

  it('hides all labels when labelType is "none"', () => {
    const { queryByText, getByLabelText } = render(
      wrap(
        <NavigationRail
          destinations={destinations}
          selectedKey="home"
          labelType="none"
        />
      )
    );
    expect(queryByText('Home')).toBeNull();
    expect(queryByText('Search')).toBeNull();
    // Items remain accessible via accessibilityLabel.
    expect(getByLabelText('Home')).toBeTruthy();
  });

  it('shows only the selected label when labelType is "selected"', () => {
    const { getByText, queryByText } = render(
      wrap(
        <NavigationRail
          destinations={destinations}
          selectedKey="search"
          labelType="selected"
        />
      )
    );
    expect(getByText('Search')).toBeTruthy();
    expect(queryByText('Home')).toBeNull();
    expect(queryByText('Settings')).toBeNull();
  });

  it('calls onSelect with the destination key', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      wrap(
        <NavigationRail
          destinations={destinations}
          selectedKey="home"
          onSelect={onSelect}
        />
      )
    );
    fireEvent.press(getByLabelText('Search'));
    expect(onSelect).toHaveBeenCalledWith('search');
  });

  it('does not select disabled destinations', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      wrap(
        <NavigationRail
          destinations={destinations}
          selectedKey="home"
          onSelect={onSelect}
        />
      )
    );
    fireEvent.press(getByLabelText('Settings'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renders badges and truncates counts above 99', () => {
    const badgeDestinations: RailDestination[] = [
      { key: 'a', label: 'A', icon: <View />, badge: 3 },
      { key: 'b', label: 'B', icon: <View />, badge: 200 },
      { key: 'c', label: 'C', icon: <View />, badge: 'new' },
    ];
    const { getByText } = render(
      wrap(<NavigationRail destinations={badgeDestinations} selectedKey="a" />)
    );
    expect(getByText('3')).toBeTruthy();
    expect(getByText('99+')).toBeTruthy();
    expect(getByText('new')).toBeTruthy();
  });

  it('exposes tablist/tab roles with selected and disabled state', () => {
    const { getByTestId, getByLabelText } = render(
      wrap(
        <NavigationRail
          destinations={destinations}
          selectedKey="home"
          testID="rail"
        />
      )
    );
    expect(getByTestId('rail').props.accessibilityRole).toBe('tablist');

    const home = getByLabelText('Home');
    expect(home.props.accessibilityRole).toBe('tab');
    expect(home.props.accessibilityState.selected).toBe(true);

    const search = getByLabelText('Search');
    expect(search.props.accessibilityState.selected).toBe(false);

    const settings = getByLabelText('Settings');
    expect(settings.props.accessibilityState.disabled).toBe(true);
  });

  it('renders a FAB and forwards its onPress', () => {
    const onFabPress = jest.fn();
    const { getByLabelText } = render(
      wrap(
        <NavigationRail
          destinations={destinations}
          selectedKey="home"
          fab={{ icon: <View testID="fab-icon" />, onPress: onFabPress, label: 'Compose' }}
        />
      )
    );
    fireEvent.press(getByLabelText('Compose'));
    expect(onFabPress).toHaveBeenCalledTimes(1);
  });

  it('renders header content', () => {
    const { getByText } = render(
      wrap(
        <NavigationRail
          destinations={destinations}
          selectedKey="home"
          header={<Text>Menu</Text>}
        />
      )
    );
    expect(getByText('Menu')).toBeTruthy();
  });
});
