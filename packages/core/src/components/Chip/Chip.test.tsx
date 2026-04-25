import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { Chip } from './Chip';
import type { ChipHandle } from './Chip';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Chip', () => {
  it('renders label', () => {
    const { getByText } = render(wrap(<Chip label="Tag" />));
    expect(getByText('Tag')).toBeTruthy();
  });

  it.each(['assist', 'filter', 'input', 'suggestion'] as const)(
    'renders %s variant',
    (variant) => {
      const { getByText } = render(wrap(<Chip label="X" variant={variant} />));
      expect(getByText('X')).toBeTruthy();
    }
  );

  it('fires onPress', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(wrap(<Chip label="X" onPress={onPress} />));
    fireEvent.press(getByLabelText('X'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not press when disabled', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      wrap(<Chip label="X" disabled onPress={onPress} />)
    );
    fireEvent.press(getByLabelText('X'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('uses togglebutton role for filter chips with selected', () => {
    const { getByRole } = render(wrap(<Chip label="X" variant="filter" selected={false} />));
    expect(getByRole('togglebutton')).toBeTruthy();
  });

  it('input chip shows close button when onClose provided', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      wrap(<Chip label="Tag" variant="input" onClose={onClose} />)
    );
    fireEvent.press(getByLabelText('Remove Tag'));
    expect(onClose).toHaveBeenCalled();
  });

  it('exposes ref handle', () => {
    const ref = React.createRef<ChipHandle>();
    render(wrap(<Chip ref={ref} label="X" />));
    expect(typeof ref.current?.focus).toBe('function');
  });
});
