import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { TimePicker } from './TimePicker';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => (
  <QuartzProvider>
    <GestureHandlerRootView>{ui}</GestureHandlerRootView>
  </QuartzProvider>
);

describe('TimePicker', () => {
  it('renders headline and formatted time when visible', () => {
    const { getByText } = render(
      wrap(
        <TimePicker
          visible
          value={{ hours: 14, minutes: 5 }}
          onDismiss={() => {}}
        />
      )
    );
    expect(getByText('Select time')).toBeTruthy();
    expect(getByText('02')).toBeTruthy(); // 14h shown as 02 in 12-hour mode
    expect(getByText('05')).toBeTruthy();
    expect(getByText('AM')).toBeTruthy();
    expect(getByText('PM')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      wrap(
        <TimePicker visible={false} onDismiss={() => {}} />
      )
    );
    expect(queryByText('Select time')).toBeNull();
  });

  it('renders clock dial numbers for hour selection', () => {
    const { getByText } = render(
      wrap(
        <TimePicker
          visible
          value={{ hours: 10, minutes: 0 }}
          onDismiss={() => {}}
        />
      )
    );
    // Outer ring hour numbers 1-12
    expect(getByText('12')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('6')).toBeTruthy();
    expect(getByText('9')).toBeTruthy();
  });

  it('renders inner ring numbers in 24-hour mode', () => {
    const { getAllByText, getByText } = render(
      wrap(
        <TimePicker
          visible
          use24Hour
          value={{ hours: 13, minutes: 0 }}
          onDismiss={() => {}}
        />
      )
    );
    // '00' and '13' appear in both the time display and the inner ring
    expect(getAllByText('00').length).toBeGreaterThanOrEqual(2);
    expect(getAllByText('13').length).toBeGreaterThanOrEqual(2);
    expect(getByText('23')).toBeTruthy();
  });

  it('calls onChange when the period is toggled', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      wrap(
        <TimePicker
          visible
          value={{ hours: 14, minutes: 30 }}
          onChange={onChange}
          onDismiss={() => {}}
        />
      )
    );
    fireEvent.press(getByText('AM'));
    expect(onChange).toHaveBeenCalledWith({ hours: 2, minutes: 30 });
  });

  it('calls onConfirm and onDismiss when confirmed', () => {
    const onConfirm = jest.fn();
    const onDismiss = jest.fn();
    const { getByText } = render(
      wrap(
        <TimePicker
          visible
          value={{ hours: 14, minutes: 30 }}
          onConfirm={onConfirm}
          onDismiss={onDismiss}
        />
      )
    );
    fireEvent.press(getByText('OK'));
    expect(onConfirm).toHaveBeenCalledWith({ hours: 14, minutes: 30 });
    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss when cancelled', () => {
    const onDismiss = jest.fn();
    const { getByText } = render(
      wrap(
        <TimePicker
          visible
          value={{ hours: 9, minutes: 15 }}
          onDismiss={onDismiss}
        />
      )
    );
    fireEvent.press(getByText('Cancel'));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('exposes an accessible toggle between dial and keyboard input', () => {
    const { getByLabelText } = render(
      wrap(
        <TimePicker
          visible
          value={{ hours: 9, minutes: 15 }}
          onDismiss={() => {}}
        />
      )
    );
    const toggle = getByLabelText('Switch to keyboard input');
    expect(toggle).toBeTruthy();
    fireEvent.press(toggle);
    expect(getByLabelText('Switch to dial')).toBeTruthy();
  });

  it('supports custom action labels', () => {
    const { getByText } = render(
      wrap(
        <TimePicker
          visible
          onDismiss={() => {}}
          cancelLabel="Nope"
          confirmLabel="Yep"
        />
      )
    );
    expect(getByText('Nope')).toBeTruthy();
    expect(getByText('Yep')).toBeTruthy();
  });
});
