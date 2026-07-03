/**
 * DatePicker — behavioral & a11y tests.
 *
 * Covers: visibility, header formatting, calendar day selection, min/max
 * disabling, month navigation, year mode, keyboard-input mode, and the
 * cancel/confirm action bar.
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { DatePicker } from './DatePicker';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

// Mon, Jan 15 2024 — deterministic fixture.
const JAN_15_2024 = new Date(2024, 0, 15);

describe('DatePicker', () => {
  describe('visibility', () => {
    it('renders nothing when not visible', () => {
      const { queryByText } = render(wrap(<DatePicker visible={false} />));
      expect(queryByText('Select date')).toBeNull();
    });

    it('renders when visible', () => {
      const { getByText } = render(wrap(<DatePicker visible />));
      expect(getByText('Select date')).toBeTruthy();
    });

    it('renders a custom headline', () => {
      const { getByText } = render(
        wrap(<DatePicker visible headline="Pick a delivery date" />)
      );
      expect(getByText('Pick a delivery date')).toBeTruthy();
    });
  });

  describe('header', () => {
    it('shows "No date selected" when there is no value', () => {
      const { getByText } = render(wrap(<DatePicker visible />));
      expect(getByText('No date selected')).toBeTruthy();
    });

    it('formats the selected date in the header', () => {
      const { getByText } = render(wrap(<DatePicker visible value={JAN_15_2024} />));
      expect(getByText('Mon, Jan 15')).toBeTruthy();
    });

    it('shows the month and year of the viewed date', () => {
      const { getByText } = render(wrap(<DatePicker visible value={JAN_15_2024} />));
      expect(getByText('January 2024')).toBeTruthy();
    });
  });

  describe('day selection', () => {
    it('calls onChange with the pressed day', () => {
      const onChange = jest.fn();
      const { getByLabelText } = render(
        wrap(<DatePicker visible value={JAN_15_2024} onChange={onChange} />)
      );
      fireEvent.press(getByLabelText(/^Day 20,/));
      expect(onChange).toHaveBeenCalledTimes(1);
      const picked: Date = onChange.mock.calls[0][0];
      expect(picked.getFullYear()).toBe(2024);
      expect(picked.getMonth()).toBe(0);
      expect(picked.getDate()).toBe(20);
    });

    it('marks the current value as selected for accessibility', () => {
      const { getByLabelText } = render(wrap(<DatePicker visible value={JAN_15_2024} />));
      expect(getByLabelText(/^Day 15,/).props.accessibilityState).toMatchObject({
        selected: true,
      });
      expect(getByLabelText(/^Day 16,/).props.accessibilityState).toMatchObject({
        selected: false,
      });
    });

    it('updates the header after selecting a day', () => {
      const { getByLabelText, getByText } = render(
        wrap(<DatePicker visible value={JAN_15_2024} />)
      );
      fireEvent.press(getByLabelText(/^Day 20,/));
      expect(getByText('Sat, Jan 20')).toBeTruthy();
    });
  });

  describe('min/max dates', () => {
    it('disables days before minDate and does not select them', () => {
      const onChange = jest.fn();
      const { getByLabelText } = render(
        wrap(
          <DatePicker
            visible
            value={JAN_15_2024}
            minDate={new Date(2024, 0, 10)}
            onChange={onChange}
          />
        )
      );
      const day5 = getByLabelText(/^Day 5,/);
      expect(day5.props.accessibilityState).toMatchObject({ disabled: true });
      // Pressing a disabled day bubbles to the dialog surface, whose handler
      // stops propagation — provide a stub event so it can.
      fireEvent.press(day5, { stopPropagation: jest.fn() });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('disables days after maxDate', () => {
      const { getByLabelText } = render(
        wrap(
          <DatePicker visible value={JAN_15_2024} maxDate={new Date(2024, 0, 20)} />
        )
      );
      expect(getByLabelText(/^Day 25,/).props.accessibilityState).toMatchObject({
        disabled: true,
      });
      expect(getByLabelText(/^Day 20,/).props.accessibilityState).toMatchObject({
        disabled: false,
      });
    });
  });

  describe('month navigation', () => {
    it('moves to the next month', () => {
      const { getByLabelText, getByText } = render(
        wrap(<DatePicker visible value={JAN_15_2024} />)
      );
      fireEvent.press(getByLabelText('Next month'));
      expect(getByText('February 2024')).toBeTruthy();
    });

    it('moves to the previous month', () => {
      const { getByLabelText, getByText } = render(
        wrap(<DatePicker visible value={JAN_15_2024} />)
      );
      fireEvent.press(getByLabelText('Previous month'));
      expect(getByText('December 2023')).toBeTruthy();
    });
  });

  describe('year mode', () => {
    it('selects a year and returns to the calendar', () => {
      const { getByText } = render(wrap(<DatePicker visible value={JAN_15_2024} />));
      fireEvent.press(getByText('January 2024'));
      fireEvent.press(getByText('2030'));
      expect(getByText('January 2030')).toBeTruthy();
    });
  });

  describe('input mode', () => {
    it('toggles to keyboard input', () => {
      const { getByLabelText, getByPlaceholderText } = render(
        wrap(<DatePicker visible value={JAN_15_2024} />)
      );
      fireEvent.press(getByLabelText('Switch to keyboard input'));
      expect(getByPlaceholderText('MM/DD/YYYY')).toBeTruthy();
      // Toggle button now offers the way back.
      expect(getByLabelText('Switch to calendar')).toBeTruthy();
    });

    it('parses a valid typed date and calls onChange', () => {
      const onChange = jest.fn();
      const { getByLabelText, getByPlaceholderText, getByText } = render(
        wrap(<DatePicker visible value={JAN_15_2024} onChange={onChange} />)
      );
      fireEvent.press(getByLabelText('Switch to keyboard input'));
      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '01/20/2024');
      expect(onChange).toHaveBeenCalledTimes(1);
      const typed: Date = onChange.mock.calls[0][0];
      expect(typed.getMonth()).toBe(0);
      expect(typed.getDate()).toBe(20);
      expect(typed.getFullYear()).toBe(2024);
      expect(getByText('Sat, Jan 20')).toBeTruthy();
    });

    it('shows an error for an impossible date and does not call onChange', () => {
      const onChange = jest.fn();
      const { getByLabelText, getByPlaceholderText, getByText } = render(
        wrap(<DatePicker visible value={JAN_15_2024} onChange={onChange} />)
      );
      fireEvent.press(getByLabelText('Switch to keyboard input'));
      fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '02/30/2024');
      expect(getByText('Invalid date')).toBeTruthy();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('actions', () => {
    it('renders default action labels', () => {
      const { getByText } = render(wrap(<DatePicker visible />));
      expect(getByText('Cancel')).toBeTruthy();
      expect(getByText('OK')).toBeTruthy();
    });

    it('renders custom action labels', () => {
      const { getByText } = render(
        wrap(<DatePicker visible cancelLabel="Never mind" confirmLabel="Done" />)
      );
      expect(getByText('Never mind')).toBeTruthy();
      expect(getByText('Done')).toBeTruthy();
    });

    it('cancel dismisses without confirming', () => {
      const onDismiss = jest.fn();
      const onConfirm = jest.fn();
      const { getByText } = render(
        wrap(
          <DatePicker
            visible
            value={JAN_15_2024}
            onDismiss={onDismiss}
            onConfirm={onConfirm}
          />
        )
      );
      fireEvent.press(getByText('Cancel'));
      expect(onDismiss).toHaveBeenCalledTimes(1);
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('confirm reports the selected date and dismisses', () => {
      const onDismiss = jest.fn();
      const onConfirm = jest.fn();
      const { getByLabelText, getByText } = render(
        wrap(
          <DatePicker
            visible
            value={JAN_15_2024}
            onDismiss={onDismiss}
            onConfirm={onConfirm}
          />
        )
      );
      fireEvent.press(getByLabelText(/^Day 20,/));
      fireEvent.press(getByText('OK'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
      const confirmed: Date = onConfirm.mock.calls[0][0];
      expect(confirmed.getDate()).toBe(20);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('confirm is disabled while no date is selected', () => {
      const onDismiss = jest.fn();
      const onConfirm = jest.fn();
      const { getByText } = render(
        wrap(<DatePicker visible onDismiss={onDismiss} onConfirm={onConfirm} />)
      );
      // The disabled button lets the press bubble to the dialog surface,
      // whose handler stops propagation — provide a stub event so it can.
      fireEvent.press(getByText('OK'), { stopPropagation: jest.fn() });
      expect(onConfirm).not.toHaveBeenCalled();
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });
});
