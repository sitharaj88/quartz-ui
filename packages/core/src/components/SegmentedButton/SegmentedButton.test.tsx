import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { SegmentedButton } from './SegmentedButton';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

const segments = [
  { value: 'a', label: 'Day' },
  { value: 'b', label: 'Week' },
  { value: 'c', label: 'Month' },
];

describe('SegmentedButton', () => {
  it('renders segments', () => {
    const { getByText } = render(
      wrap(<SegmentedButton segments={segments} value="a" onValueChange={() => {}} />)
    );
    expect(getByText('Day')).toBeTruthy();
    expect(getByText('Week')).toBeTruthy();
    expect(getByText('Month')).toBeTruthy();
  });

  it('marks selected segment via accessibilityState', () => {
    const { getAllByRole } = render(
      wrap(<SegmentedButton segments={segments} value="b" onValueChange={() => {}} />)
    );
    const tabs = getAllByRole('tab');
    expect(tabs[0].props.accessibilityState).toMatchObject({ selected: false });
    expect(tabs[1].props.accessibilityState).toMatchObject({ selected: true });
  });

  it('calls onValueChange with the pressed value (single-select)', () => {
    const onValueChange = jest.fn();
    const { getAllByRole } = render(
      wrap(<SegmentedButton segments={segments} value="a" onValueChange={onValueChange} />)
    );
    fireEvent.press(getAllByRole('tab')[2]);
    expect(onValueChange).toHaveBeenCalledWith('c');
  });

  it('toggles values in multi-select mode', () => {
    const onValueChange = jest.fn();
    const { getAllByRole } = render(
      wrap(
        <SegmentedButton
          segments={segments}
          value={['a']}
          multiSelect
          onValueChange={onValueChange}
        />
      )
    );
    fireEvent.press(getAllByRole('tab')[1]);
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('does not fire onValueChange when whole group is disabled', () => {
    const onValueChange = jest.fn();
    const { getAllByRole } = render(
      wrap(
        <SegmentedButton
          segments={segments}
          value="a"
          disabled
          onValueChange={onValueChange}
        />
      )
    );
    fireEvent.press(getAllByRole('tab')[1]);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
