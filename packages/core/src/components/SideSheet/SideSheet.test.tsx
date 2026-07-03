import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SideSheet } from './SideSheet';
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

describe('SideSheet', () => {
  describe('modal variant', () => {
    it('renders nothing when closed', () => {
      const { queryByText, queryByTestId } = render(
        wrap(
          <SideSheet open={false} onClose={() => {}} title="Details" testID="sheet">
            <Text>Sheet content</Text>
          </SideSheet>
        )
      );
      expect(queryByTestId('sheet')).toBeNull();
      expect(queryByText('Sheet content')).toBeNull();
    });

    it('renders title and children when open', () => {
      const { getByText, getByTestId } = render(
        wrap(
          <SideSheet open onClose={() => {}} title="Details" testID="sheet">
            <Text>Sheet content</Text>
          </SideSheet>
        )
      );
      expect(getByTestId('sheet')).toBeTruthy();
      expect(getByText('Details')).toBeTruthy();
      expect(getByText('Sheet content')).toBeTruthy();
    });

    it('calls onClose when the scrim is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        wrap(
          <SideSheet open onClose={onClose} title="Details">
            <Text>Content</Text>
          </SideSheet>
        )
      );
      // The sheet surface sets accessibilityViewIsModal, which hides the
      // scrim from default accessibility queries.
      fireEvent.press(
        getByLabelText('Close side sheet', { includeHiddenElements: true })
      );
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on scrim press when dismissable is false', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        wrap(
          <SideSheet open onClose={onClose} dismissable={false} title="Details">
            <Text>Content</Text>
          </SideSheet>
        )
      );
      fireEvent.press(
        getByLabelText('Close side sheet', { includeHiddenElements: true })
      );
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when the header close button is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        wrap(
          <SideSheet open onClose={onClose} title="Details">
            <Text>Content</Text>
          </SideSheet>
        )
      );
      fireEvent.press(getByLabelText('Close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('hides the header when showHeader is false', () => {
      const { queryByText, queryByLabelText, getByText } = render(
        wrap(
          <SideSheet open onClose={() => {}} showHeader={false} title="Details">
            <Text>Content</Text>
          </SideSheet>
        )
      );
      expect(queryByText('Details')).toBeNull();
      expect(queryByLabelText('Close')).toBeNull();
      expect(getByText('Content')).toBeTruthy();
    });

    it('renders custom header instead of the default header', () => {
      const { getByText, queryByText } = render(
        wrap(
          <SideSheet
            open
            onClose={() => {}}
            title="Ignored title"
            header={<Text>Custom header</Text>}
          >
            <Text>Content</Text>
          </SideSheet>
        )
      );
      expect(getByText('Custom header')).toBeTruthy();
      expect(queryByText('Ignored title')).toBeNull();
    });

    it('renders footer content', () => {
      const { getByText } = render(
        wrap(
          <SideSheet open onClose={() => {}} footer={<Text>Footer actions</Text>}>
            <Text>Content</Text>
          </SideSheet>
        )
      );
      expect(getByText('Footer actions')).toBeTruthy();
    });
  });

  describe('standard variant', () => {
    it('renders content without requiring open', () => {
      const { getByText, getByTestId } = render(
        wrap(
          <SideSheet variant="standard" title="Docked" testID="standard-sheet">
            <Text>Docked content</Text>
          </SideSheet>
        )
      );
      expect(getByTestId('standard-sheet')).toBeTruthy();
      expect(getByText('Docked')).toBeTruthy();
      expect(getByText('Docked content')).toBeTruthy();
    });

    it('does not render a scrim or close button', () => {
      const { queryByLabelText } = render(
        wrap(
          <SideSheet variant="standard" onClose={() => {}} title="Docked">
            <Text>Docked content</Text>
          </SideSheet>
        )
      );
      expect(queryByLabelText('Close side sheet')).toBeNull();
      expect(queryByLabelText('Close')).toBeNull();
    });

    it('renders footer content', () => {
      const { getByText } = render(
        wrap(
          <SideSheet variant="standard" footer={<Text>Docked footer</Text>}>
            <Text>Docked content</Text>
          </SideSheet>
        )
      );
      expect(getByText('Docked footer')).toBeTruthy();
    });
  });
});
