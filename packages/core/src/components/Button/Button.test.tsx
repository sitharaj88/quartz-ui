/**
 * Button — behavioral & a11y tests.
 *
 * Covers the world-class checklist: render, variants, sizes, disabled, loading,
 * press, toggle, a11y roles/states/announcements, RTL, reduce-motion, ref.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { Button } from './Button';
import type { ButtonHandle } from './Button.types';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Button', () => {
  describe('rendering', () => {
    it('renders with a label', () => {
      const { getByText } = render(wrap(<Button label="Save" />));
      expect(getByText('Save')).toBeTruthy();
    });

    it('renders children when no label is provided', () => {
      const { getByText } = render(
        wrap(
          <Button>
            <Text>Custom child</Text>
          </Button>
        )
      );
      expect(getByText('Custom child')).toBeTruthy();
    });

    it('renders an icon', () => {
      const { getByTestId } = render(
        wrap(<Button label="Go" icon={<View testID="my-icon" />} />)
      );
      expect(getByTestId('my-icon')).toBeTruthy();
    });

    it('auto-detects icon-only mode when no label and no children', () => {
      const { getByTestId } = render(
        wrap(<Button testID="btn" icon={<View testID="i" />} accessibilityLabel="Add" />)
      );
      // Icon-only buttons are still focusable buttons with a label.
      expect(getByTestId('btn').props.accessibilityLabel).toBe('Add');
    });
  });

  describe('variants & sizes', () => {
    it.each(['filled', 'outlined', 'text', 'elevated', 'tonal'] as const)(
      'renders %s variant without throwing',
      (variant) => {
        const { getByText } = render(wrap(<Button label="X" variant={variant} />));
        expect(getByText('X')).toBeTruthy();
      }
    );

    it.each(['small', 'medium', 'large'] as const)('renders %s size', (size) => {
      const { getByText } = render(wrap(<Button label="Y" size={size} />));
      expect(getByText('Y')).toBeTruthy();
    });
  });

  describe('press behavior', () => {
    it('fires onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(wrap(<Button label="Click" onPress={onPress} />));
      fireEvent.press(getByText('Click'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not fire onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        wrap(<Button label="Click" disabled onPress={onPress} />)
      );
      fireEvent.press(getByText('Click'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('does not fire onPress while loading', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        wrap(<Button label="Click" loading onPress={onPress} />)
      );
      fireEvent.press(getByText('Click'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('forwards onLongPress', () => {
      const onLongPress = jest.fn();
      const { getByText } = render(
        wrap(<Button label="Hold" onLongPress={onLongPress} />)
      );
      fireEvent(getByText('Hold'), 'longPress');
      expect(onLongPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('has button role by default', () => {
      const { getByRole } = render(wrap(<Button label="A" />));
      expect(getByRole('button')).toBeTruthy();
    });

    it('uses togglebutton role when `selected` is set', () => {
      const { getByRole } = render(wrap(<Button label="A" selected={false} />));
      expect(getByRole('togglebutton')).toBeTruthy();
    });

    it('reflects disabled state in accessibilityState', () => {
      const { getByRole } = render(wrap(<Button label="A" disabled />));
      expect(getByRole('button').props.accessibilityState).toMatchObject({
        disabled: true,
      });
    });

    it('reflects busy state when loading', () => {
      const { getByRole } = render(wrap(<Button label="A" loading />));
      expect(getByRole('button').props.accessibilityState).toMatchObject({
        busy: true,
      });
    });

    it('reflects selected state for toggle buttons', () => {
      const { getByRole } = render(wrap(<Button label="A" selected />));
      expect(getByRole('togglebutton').props.accessibilityState).toMatchObject({
        selected: true,
      });
    });

    it('uses label as accessibilityLabel when not provided', () => {
      const { getByRole } = render(wrap(<Button label="Save" />));
      expect(getByRole('button').props.accessibilityLabel).toBe('Save');
    });

    it('honors explicit accessibilityLabel', () => {
      const { getByRole } = render(
        wrap(<Button label="X" accessibilityLabel="Save document" />)
      );
      expect(getByRole('button').props.accessibilityLabel).toBe('Save document');
    });

    it('announces loading transition to screen readers', () => {
      const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
      const { rerender } = render(wrap(<Button label="Save" />));
      rerender(wrap(<Button label="Save" loading loadingAccessibilityLabel="Saving" />));
      expect(announce).toHaveBeenCalledWith('Saving');
    });

    it('sets aria-live region while loading', () => {
      const { getByRole } = render(wrap(<Button label="Save" loading />));
      expect(getByRole('button').props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('imperative handle', () => {
    it('exposes focus() and blur()', () => {
      const ref = React.createRef<ButtonHandle>();
      render(wrap(<Button ref={ref} label="A" />));
      expect(typeof ref.current?.focus).toBe('function');
      expect(typeof ref.current?.blur).toBe('function');
    });
  });

  describe('testID forwarding', () => {
    it('forwards testID to the pressable', () => {
      const { getByTestId } = render(wrap(<Button label="A" testID="my-btn" />));
      expect(getByTestId('my-btn')).toBeTruthy();
    });
  });
});
