/**
 * List — behavioral & a11y tests.
 *
 * Covers: ListItem rendering (headline/supporting/overline, leading/trailing),
 * interactive vs static roles, press/disabled behavior, selected state,
 * ListSection and ListDivider sub-components.
 */

import React from 'react';
import { Text as RNText, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { ListItem, ListSection, ListDivider } from './List';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('ListItem', () => {
  describe('rendering', () => {
    it('renders the headline', () => {
      const { getByText } = render(wrap(<ListItem headline="Inbox" />));
      expect(getByText('Inbox')).toBeTruthy();
    });

    it('renders supporting text', () => {
      const { getByText } = render(
        wrap(<ListItem headline="Inbox" supportingText="12 unread messages" />)
      );
      expect(getByText('12 unread messages')).toBeTruthy();
    });

    it('renders an overline', () => {
      const { getByText } = render(
        wrap(<ListItem headline="Inbox" overline="Mail" />)
      );
      expect(getByText('Mail')).toBeTruthy();
    });

    it('renders leading and trailing elements', () => {
      const { getByTestId } = render(
        wrap(
          <ListItem
            headline="Inbox"
            leading={<View testID="lead" />}
            trailing={<View testID="trail" />}
          />
        )
      );
      expect(getByTestId('lead')).toBeTruthy();
      expect(getByTestId('trail')).toBeTruthy();
    });

    it.each([1, 2, 3] as const)('renders with %s line(s)', (lines) => {
      const { getByText } = render(
        wrap(<ListItem headline="H" supportingText="S" lines={lines} />)
      );
      expect(getByText('H')).toBeTruthy();
    });

    it('forwards testID', () => {
      const { getByTestId } = render(wrap(<ListItem headline="H" testID="item" />));
      expect(getByTestId('item')).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('is not a button without onPress', () => {
      const { queryByRole } = render(wrap(<ListItem headline="Static" />));
      expect(queryByRole('button')).toBeNull();
    });

    it('becomes a button when onPress is provided', () => {
      const { getByRole } = render(
        wrap(<ListItem headline="Tap me" onPress={() => {}} />)
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('fires onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByRole } = render(wrap(<ListItem headline="Tap" onPress={onPress} />));
      fireEvent.press(getByRole('button'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not fire onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        wrap(<ListItem headline="Tap" onPress={onPress} disabled />)
      );
      fireEvent.press(getByRole('button'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('reflects disabled state', () => {
      const { getByRole } = render(
        wrap(<ListItem headline="H" onPress={() => {}} disabled />)
      );
      expect(getByRole('button').props.accessibilityState).toMatchObject({
        disabled: true,
      });
    });

    it('reflects selected state', () => {
      const { getByRole } = render(
        wrap(<ListItem headline="H" onPress={() => {}} selected />)
      );
      expect(getByRole('button').props.accessibilityState).toMatchObject({
        selected: true,
      });
    });

    it('is accessible when static', () => {
      const { getByTestId } = render(wrap(<ListItem headline="H" testID="item" />));
      const item = getByTestId('item');
      expect(item.props.accessible).toBe(true);
      expect(item.props.accessibilityRole).toBe('text');
    });
  });
});

describe('ListSection', () => {
  it('renders the section title', () => {
    const { getByText } = render(
      wrap(
        <ListSection title="Settings">
          <ListItem headline="Wi-Fi" />
        </ListSection>
      )
    );
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders its children', () => {
    const { getByText } = render(
      wrap(
        <ListSection title="Settings">
          <ListItem headline="Wi-Fi" />
          <ListItem headline="Bluetooth" />
        </ListSection>
      )
    );
    expect(getByText('Wi-Fi')).toBeTruthy();
    expect(getByText('Bluetooth')).toBeTruthy();
  });

  it('items inside a section stay interactive', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      wrap(
        <ListSection title="Settings">
          <ListItem headline="Wi-Fi" onPress={onPress} />
        </ListSection>
      )
    );
    fireEvent.press(getByText('Wi-Fi'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('ListDivider', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(wrap(<ListDivider />));
    expect(toJSON()).toBeTruthy();
  });

  it('renders between list items', () => {
    const { getByText } = render(
      wrap(
        <View>
          <ListItem headline="One" />
          <ListDivider />
          <RNText>after divider</RNText>
        </View>
      )
    );
    expect(getByText('One')).toBeTruthy();
    expect(getByText('after divider')).toBeTruthy();
  });
});
