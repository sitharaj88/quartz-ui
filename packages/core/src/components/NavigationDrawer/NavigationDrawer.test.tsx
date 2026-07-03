import React from 'react';
import { Text, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationDrawer, DrawerSection } from './NavigationDrawer';
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

const sections: DrawerSection[] = [
  {
    title: 'Mail',
    items: [
      { key: 'inbox', label: 'Inbox', icon: <View testID="inbox-icon" />, badge: 24 },
      { key: 'outbox', label: 'Outbox', icon: <View testID="outbox-icon" /> },
      { key: 'drafts', label: 'Drafts', icon: <View testID="drafts-icon" />, disabled: true },
    ],
    showDivider: true,
  },
  {
    title: 'Labels',
    items: [
      { key: 'work', label: 'Work' },
      { key: 'personal', label: 'Personal' },
    ],
  },
];

describe('NavigationDrawer', () => {
  describe('modal variant', () => {
    it('renders nothing when closed', () => {
      const { queryByText, queryByTestId } = render(
        wrap(
          <NavigationDrawer
            open={false}
            onClose={() => {}}
            sections={sections}
            testID="drawer"
          />
        )
      );
      expect(queryByTestId('drawer')).toBeNull();
      expect(queryByText('Inbox')).toBeNull();
    });

    it('renders items and section titles when open', () => {
      const { getByText, getByTestId } = render(
        wrap(
          <NavigationDrawer
            open
            onClose={() => {}}
            sections={sections}
            testID="drawer"
          />
        )
      );
      expect(getByTestId('drawer')).toBeTruthy();
      expect(getByText('Mail')).toBeTruthy();
      expect(getByText('Labels')).toBeTruthy();
      expect(getByText('Inbox')).toBeTruthy();
      expect(getByText('Outbox')).toBeTruthy();
      expect(getByText('Drafts')).toBeTruthy();
      expect(getByText('Work')).toBeTruthy();
      expect(getByText('Personal')).toBeTruthy();
    });

    it('renders header and footer content', () => {
      const { getByText } = render(
        wrap(
          <NavigationDrawer
            open
            onClose={() => {}}
            sections={sections}
            header={<Text>Drawer Header</Text>}
            footer={<Text>Drawer Footer</Text>}
          />
        )
      );
      expect(getByText('Drawer Header')).toBeTruthy();
      expect(getByText('Drawer Footer')).toBeTruthy();
    });

    it('calls onSelect with the item key and closes the drawer on press', () => {
      const onSelect = jest.fn();
      const onClose = jest.fn();
      const { getByLabelText } = render(
        wrap(
          <NavigationDrawer
            open
            onClose={onClose}
            onSelect={onSelect}
            selectedKey="inbox"
            sections={sections}
          />
        )
      );
      fireEvent.press(getByLabelText('Outbox'));
      expect(onSelect).toHaveBeenCalledWith('outbox');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('prefers a custom item onPress over onSelect', () => {
      const onSelect = jest.fn();
      const itemPress = jest.fn();
      const customSections: DrawerSection[] = [
        { items: [{ key: 'custom', label: 'Custom', onPress: itemPress }] },
      ];
      const { getByLabelText } = render(
        wrap(
          <NavigationDrawer
            open
            onClose={() => {}}
            onSelect={onSelect}
            sections={customSections}
          />
        )
      );
      fireEvent.press(getByLabelText('Custom'));
      expect(itemPress).toHaveBeenCalledTimes(1);
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('does not select disabled items', () => {
      const onSelect = jest.fn();
      const { getByLabelText } = render(
        wrap(
          <NavigationDrawer
            open
            onClose={() => {}}
            onSelect={onSelect}
            sections={sections}
          />
        )
      );
      fireEvent.press(getByLabelText('Drafts'));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('calls onClose when the scrim is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        wrap(
          <NavigationDrawer open onClose={onClose} sections={sections} />
        )
      );
      // The drawer surface sets accessibilityViewIsModal, which hides the
      // scrim from default accessibility queries.
      fireEvent.press(
        getByLabelText('Close navigation drawer', { includeHiddenElements: true })
      );
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders badges and truncates counts above 99', () => {
      const badgeSections: DrawerSection[] = [
        {
          items: [
            { key: 'a', label: 'A', badge: 24 },
            { key: 'b', label: 'B', badge: 150 },
            { key: 'c', label: 'C', badge: 'new' },
          ],
        },
      ];
      const { getByText } = render(
        wrap(
          <NavigationDrawer open onClose={() => {}} sections={badgeSections} />
        )
      );
      expect(getByText('24')).toBeTruthy();
      expect(getByText('99+')).toBeTruthy();
      expect(getByText('new')).toBeTruthy();
    });

    it('exposes menuitem role with selected and disabled accessibility state', () => {
      const { getByLabelText } = render(
        wrap(
          <NavigationDrawer
            open
            onClose={() => {}}
            selectedKey="inbox"
            sections={sections}
          />
        )
      );
      const inbox = getByLabelText('Inbox');
      expect(inbox.props.accessibilityRole).toBe('menuitem');
      expect(inbox.props.accessibilityState.selected).toBe(true);

      const outbox = getByLabelText('Outbox');
      expect(outbox.props.accessibilityState.selected).toBe(false);

      const drafts = getByLabelText('Drafts');
      expect(drafts.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('standard variant', () => {
    it('renders items without requiring open', () => {
      const { getByText, getByTestId } = render(
        wrap(
          <NavigationDrawer
            variant="standard"
            sections={sections}
            testID="standard-drawer"
          />
        )
      );
      expect(getByTestId('standard-drawer')).toBeTruthy();
      expect(getByText('Inbox')).toBeTruthy();
      expect(getByText('Personal')).toBeTruthy();
    });

    it('does not render a scrim', () => {
      const { queryByLabelText } = render(
        wrap(<NavigationDrawer variant="standard" sections={sections} />)
      );
      expect(queryByLabelText('Close navigation drawer')).toBeNull();
    });

    it('selects items without closing', () => {
      const onSelect = jest.fn();
      const onClose = jest.fn();
      const { getByLabelText } = render(
        wrap(
          <NavigationDrawer
            variant="standard"
            onSelect={onSelect}
            onClose={onClose}
            sections={sections}
          />
        )
      );
      fireEvent.press(getByLabelText('Work'));
      expect(onSelect).toHaveBeenCalledWith('work');
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
