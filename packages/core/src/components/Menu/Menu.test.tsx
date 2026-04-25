import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { Menu } from './Menu';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

const items = [
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete', destructive: true },
  { key: 'archive', label: 'Archive', disabled: true },
];

const Anchor = () => (
  <Pressable testID="anchor">
    <Text>Open</Text>
  </Pressable>
);

describe('Menu', () => {
  it('renders anchor', () => {
    const { getByTestId } = render(
      wrap(
        <Menu visible={false} onDismiss={() => {}} anchor={<Anchor />} items={items} onSelect={() => {}} />
      )
    );
    expect(getByTestId('anchor')).toBeTruthy();
  });

  it('renders menu items when visible', () => {
    const { getByText } = render(
      wrap(
        <Menu visible onDismiss={() => {}} anchor={<Anchor />} items={items} onSelect={() => {}} />
      )
    );
    expect(getByText('Edit')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
    expect(getByText('Archive')).toBeTruthy();
  });

  it('selects an item and dismisses', () => {
    const onSelect = jest.fn();
    const onDismiss = jest.fn();
    const { getByText } = render(
      wrap(
        <Menu visible onDismiss={onDismiss} anchor={<Anchor />} items={items} onSelect={onSelect} />
      )
    );
    fireEvent.press(getByText('Edit'));
    expect(onSelect).toHaveBeenCalledWith('edit');
    expect(onDismiss).toHaveBeenCalled();
  });

  it('does not select disabled items', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      wrap(
        <Menu visible onDismiss={() => {}} anchor={<Anchor />} items={items} onSelect={onSelect} />
      )
    );
    fireEvent.press(getByText('Archive'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('exposes menuitem role on each item', () => {
    const { getAllByRole } = render(
      wrap(
        <Menu visible onDismiss={() => {}} anchor={<Anchor />} items={items} onSelect={() => {}} />
      )
    );
    expect(getAllByRole('menuitem')).toHaveLength(3);
  });
});
