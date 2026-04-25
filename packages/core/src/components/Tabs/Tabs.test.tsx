import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { Tabs } from './Tabs';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

const tabs = [
  { key: 'home', label: 'Home' },
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings' },
];

describe('Tabs', () => {
  it('renders all tab labels', () => {
    const { getByText } = render(
      wrap(<Tabs tabs={tabs} selectedKey="home" onSelect={() => {}} />)
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('marks the selected tab', () => {
    const { getAllByRole } = render(
      wrap(<Tabs tabs={tabs} selectedKey="profile" onSelect={() => {}} />)
    );
    const list = getAllByRole('tab');
    expect(list[1].props.accessibilityState).toMatchObject({ selected: true });
    expect(list[0].props.accessibilityState).toMatchObject({ selected: false });
  });

  it('calls onSelect with the pressed tab key', () => {
    const onSelect = jest.fn();
    const { getAllByRole } = render(
      wrap(<Tabs tabs={tabs} selectedKey="home" onSelect={onSelect} />)
    );
    fireEvent.press(getAllByRole('tab')[2]);
    expect(onSelect).toHaveBeenCalledWith('settings');
  });

  it('renders inside scrollable tablist', () => {
    const { getByText } = render(
      wrap(<Tabs tabs={tabs} selectedKey="home" onSelect={() => {}} scrollable />)
    );
    expect(getByText('Home')).toBeTruthy();
  });
});
