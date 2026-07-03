/**
 * Banner — behavioral & a11y tests.
 *
 * Covers: visibility (mount/unmount transitions), message rendering, icon,
 * primary/secondary actions, dismiss behavior, alert role + live region.
 *
 * The hide transition is animation-driven, so tests await the exit animation
 * via waitFor (same pattern as Accordion.test.tsx).
 */

import React from 'react';
import { View } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';

import { Banner } from './Banner';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Banner', () => {
  describe('visibility', () => {
    it('renders the message when visible', () => {
      const { getByText } = render(
        wrap(<Banner visible message="Storage almost full" />)
      );
      expect(getByText('Storage almost full')).toBeTruthy();
    });

    it('renders nothing when not visible', () => {
      const { queryByText } = render(
        wrap(<Banner visible={false} message="Hidden message" />)
      );
      expect(queryByText('Hidden message')).toBeNull();
    });

    it('hides after visible flips to false', async () => {
      const { queryByText, rerender } = render(
        wrap(<Banner visible message="Bye" />)
      );
      expect(queryByText('Bye')).toBeTruthy();

      rerender(wrap(<Banner visible={false} message="Bye" />));
      // The banner unmounts once the 250ms exit animation completes; let it
      // finish inside act so the resulting state update is flushed.
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });
      expect(queryByText('Bye')).toBeNull();
    });

    it('shows after visible flips to true', () => {
      const { queryByText, rerender } = render(
        wrap(<Banner visible={false} message="Hello" />)
      );
      expect(queryByText('Hello')).toBeNull();

      rerender(wrap(<Banner visible message="Hello" />));
      expect(queryByText('Hello')).toBeTruthy();
    });
  });

  describe('content', () => {
    it('renders an icon when provided', () => {
      const { getByTestId } = render(
        wrap(
          <Banner
            visible
            message="With icon"
            icon={<View testID="banner-icon" />}
          />
        )
      );
      expect(getByTestId('banner-icon')).toBeTruthy();
    });

    it('forwards testID to the container', () => {
      const { getByTestId } = render(
        wrap(<Banner visible message="X" testID="my-banner" />)
      );
      expect(getByTestId('my-banner')).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('renders the primary action and fires its onPress', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        wrap(
          <Banner
            visible
            message="X"
            action={{ label: 'Fix it', onPress }}
          />
        )
      );
      fireEvent.press(getByText('Fix it'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders both actions and fires the secondary onPress', () => {
      const onPrimary = jest.fn();
      const onSecondary = jest.fn();
      const { getByText } = render(
        wrap(
          <Banner
            visible
            message="X"
            action={{ label: 'Accept', onPress: onPrimary }}
            secondaryAction={{ label: 'Later', onPress: onSecondary }}
          />
        )
      );
      expect(getByText('Accept')).toBeTruthy();
      fireEvent.press(getByText('Later'));
      expect(onSecondary).toHaveBeenCalledTimes(1);
      expect(onPrimary).not.toHaveBeenCalled();
    });

    it('renders no action buttons when none are provided', () => {
      const { queryByRole } = render(wrap(<Banner visible message="X" />));
      expect(queryByRole('button')).toBeNull();
    });
  });

  describe('dismiss', () => {
    it('shows a dismiss button and fires onDismiss', () => {
      const onDismiss = jest.fn();
      const { getByLabelText } = render(
        wrap(<Banner visible message="X" dismissable onDismiss={onDismiss} />)
      );
      fireEvent.press(getByLabelText('Dismiss banner'));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not show a dismiss button when dismissable is false', () => {
      const { queryByLabelText } = render(
        wrap(<Banner visible message="X" onDismiss={jest.fn()} />)
      );
      expect(queryByLabelText('Dismiss banner')).toBeNull();
    });

    it('does not show a dismiss button when onDismiss is missing', () => {
      const { queryByLabelText } = render(
        wrap(<Banner visible message="X" dismissable />)
      );
      expect(queryByLabelText('Dismiss banner')).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('uses the alert role', () => {
      // RNTL's getByRole only matches accessible elements; query by prop
      // instead (same approach as AppBar's header-role test).
      const { UNSAFE_getByProps } = render(wrap(<Banner visible message="Alert!" />));
      expect(UNSAFE_getByProps({ accessibilityRole: 'alert' })).toBeTruthy();
    });

    it('announces politely via a live region', () => {
      const { UNSAFE_getByProps } = render(wrap(<Banner visible message="X" />));
      expect(
        UNSAFE_getByProps({ accessibilityRole: 'alert' }).props.accessibilityLiveRegion
      ).toBe('polite');
    });
  });
});
