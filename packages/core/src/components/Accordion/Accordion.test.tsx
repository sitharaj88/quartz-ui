/**
 * Accordion — behavioral & a11y tests.
 *
 * Covers: render (title/subtitle/leading), expand/collapse on press, single
 * vs multiple mode, controlled mode + onChange, default-expanded, disabled
 * items, accessibilityState.expanded, haptics, and context misuse.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { Accordion, AccordionItem } from './Accordion';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

interface TwoItemsProps {
  multiple?: boolean;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onChange?: (ids: string[]) => void;
  disabledB?: boolean;
}

const TwoItems = ({ disabledB, ...accordionProps }: TwoItemsProps) => (
  <Accordion {...accordionProps}>
    <AccordionItem id="a" title="First" testID="item-a">
      <Text>Content A</Text>
    </AccordionItem>
    <AccordionItem id="b" title="Second" testID="item-b" disabled={disabledB}>
      <Text>Content B</Text>
    </AccordionItem>
  </Accordion>
);

describe('Accordion', () => {
  describe('rendering', () => {
    it('renders all item titles', () => {
      const { getByText } = render(wrap(<TwoItems />));
      expect(getByText('First')).toBeTruthy();
      expect(getByText('Second')).toBeTruthy();
    });

    it('renders subtitle and leading slot', () => {
      const { getByText, getByTestId } = render(
        wrap(
          <Accordion>
            <AccordionItem
              id="a"
              title="Settings"
              subtitle="Notifications, privacy"
              leading={<View testID="leading-icon" />}
            >
              <Text>Panel</Text>
            </AccordionItem>
          </Accordion>
        )
      );
      expect(getByText('Settings')).toBeTruthy();
      expect(getByText('Notifications, privacy')).toBeTruthy();
      expect(getByTestId('leading-icon')).toBeTruthy();
    });

    it('renders a custom ReactNode title', () => {
      const { getByText } = render(
        wrap(
          <Accordion>
            <AccordionItem id="a" title={<Text>Custom title node</Text>}>
              <Text>Panel</Text>
            </AccordionItem>
          </Accordion>
        )
      );
      expect(getByText('Custom title node')).toBeTruthy();
    });

    it('keeps panels collapsed by default', () => {
      const { queryByText } = render(wrap(<TwoItems />));
      expect(queryByText('Content A')).toBeNull();
      expect(queryByText('Content B')).toBeNull();
    });
  });

  describe('expand / collapse', () => {
    it('expands an item when its header is pressed', () => {
      const { getByText, queryByText } = render(wrap(<TwoItems />));
      fireEvent.press(getByText('First'));
      expect(queryByText('Content A')).toBeTruthy();
    });

    it('collapses an expanded item when pressed again', () => {
      jest.useFakeTimers();
      try {
        const { getByText, queryByText } = render(wrap(<TwoItems />));
        fireEvent.press(getByText('First'));
        expect(queryByText('Content A')).toBeTruthy();
        fireEvent.press(getByText('First'));
        // Panel unmounts once the collapse animation window elapses.
        act(() => {
          jest.advanceTimersByTime(500);
        });
        expect(queryByText('Content A')).toBeNull();
      } finally {
        jest.useRealTimers();
      }
    });
  });

  describe('single vs multiple mode', () => {
    it('collapses the previously open item in single mode (default)', () => {
      jest.useFakeTimers();
      try {
        const { getByText, queryByText } = render(wrap(<TwoItems />));
        fireEvent.press(getByText('First'));
        fireEvent.press(getByText('Second'));
        expect(queryByText('Content B')).toBeTruthy();
        // Panel A unmounts once its collapse animation window elapses.
        act(() => {
          jest.advanceTimersByTime(500);
        });
        expect(queryByText('Content A')).toBeNull();
        expect(queryByText('Content B')).toBeTruthy();
      } finally {
        jest.useRealTimers();
      }
    });

    it('keeps multiple items open when `multiple` is set', () => {
      const { getByText, queryByText } = render(wrap(<TwoItems multiple />));
      fireEvent.press(getByText('First'));
      fireEvent.press(getByText('Second'));
      expect(queryByText('Content A')).toBeTruthy();
      expect(queryByText('Content B')).toBeTruthy();
    });

    it('reports accumulated ids through onChange in multiple mode', () => {
      const onChange = jest.fn();
      const { getByText } = render(wrap(<TwoItems multiple onChange={onChange} />));
      fireEvent.press(getByText('First'));
      fireEvent.press(getByText('Second'));
      expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
    });
  });

  describe('controlled mode', () => {
    it('fires onChange with the next expanded ids', () => {
      const onChange = jest.fn();
      const { getByText } = render(
        wrap(<TwoItems expandedIds={[]} onChange={onChange} />)
      );
      fireEvent.press(getByText('First'));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(['a']);
    });

    it('does not expand until the expandedIds prop changes', () => {
      const onChange = jest.fn();
      const { getByText, queryByText, rerender } = render(
        wrap(<TwoItems expandedIds={[]} onChange={onChange} />)
      );
      fireEvent.press(getByText('First'));
      expect(queryByText('Content A')).toBeNull();
      rerender(wrap(<TwoItems expandedIds={['a']} onChange={onChange} />));
      expect(queryByText('Content A')).toBeTruthy();
    });

    it('requests collapse of a controlled-open item', () => {
      const onChange = jest.fn();
      const { getByText } = render(
        wrap(<TwoItems expandedIds={['a']} onChange={onChange} />)
      );
      fireEvent.press(getByText('First'));
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('default-expanded (uncontrolled)', () => {
    it('renders defaultExpandedIds panels open on first render', () => {
      const { queryByText } = render(wrap(<TwoItems defaultExpandedIds={['b']} />));
      expect(queryByText('Content A')).toBeNull();
      expect(queryByText('Content B')).toBeTruthy();
    });
  });

  describe('disabled items', () => {
    it('ignores presses on a disabled item', () => {
      const onChange = jest.fn();
      const { getByText, queryByText } = render(
        wrap(<TwoItems disabledB onChange={onChange} />)
      );
      fireEvent.press(getByText('Second'));
      expect(queryByText('Content B')).toBeNull();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('exposes disabled in accessibilityState', () => {
      const { getByTestId } = render(wrap(<TwoItems disabledB />));
      expect(getByTestId('item-b-header').props.accessibilityState).toMatchObject({
        disabled: true,
      });
    });
  });

  describe('accessibility', () => {
    it('headers are buttons with accessibilityState.expanded', () => {
      const { getByTestId, getByText } = render(wrap(<TwoItems />));
      const header = getByTestId('item-a-header');
      expect(header.props.accessibilityRole).toBe('button');
      expect(header.props.accessibilityState).toMatchObject({ expanded: false });

      fireEvent.press(getByText('First'));
      expect(getByTestId('item-a-header').props.accessibilityState).toMatchObject({
        expanded: true,
      });
    });

    it('uses the string title as the accessibility label', () => {
      const { getByTestId } = render(wrap(<TwoItems />));
      expect(getByTestId('item-a-header').props.accessibilityLabel).toBe('First');
    });

    it('links the panel to its header', () => {
      const { getByTestId } = render(wrap(<TwoItems defaultExpandedIds={['a']} />));
      const panel = getByTestId('item-a-panel');
      expect(panel.props.accessibilityLabelledBy).toBe('quartz-accordion-a-header');
    });
  });

  describe('haptics', () => {
    it('fires light impact haptics on toggle by default', () => {
      const { getByText } = render(wrap(<TwoItems />));
      fireEvent.press(getByText('First'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it('skips haptics when enableHaptics is false', () => {
      const { getByText } = render(
        wrap(
          <Accordion>
            <AccordionItem id="a" title="Quiet" enableHaptics={false}>
              <Text>Panel</Text>
            </AccordionItem>
          </Accordion>
        )
      );
      fireEvent.press(getByText('Quiet'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('misuse', () => {
    it('throws when an AccordionItem is rendered outside an Accordion', () => {
      const error = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() =>
        render(
          wrap(
            <AccordionItem id="orphan" title="Orphan">
              <Text>Panel</Text>
            </AccordionItem>
          )
        )
      ).toThrow('<AccordionItem> must be rendered inside an <Accordion>');
      error.mockRestore();
    });
  });
});
