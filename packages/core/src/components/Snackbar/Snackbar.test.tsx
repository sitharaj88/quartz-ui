import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { Snackbar } from './Snackbar';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Snackbar', () => {
  it('renders message when visible', () => {
    const { getByText } = render(
      wrap(<Snackbar visible message="Saved" onDismiss={() => {}} />)
    );
    expect(getByText('Saved')).toBeTruthy();
  });

  it('renders nothing when not visible', () => {
    const { queryByText } = render(
      wrap(<Snackbar visible={false} message="Saved" onDismiss={() => {}} />)
    );
    expect(queryByText('Saved')).toBeNull();
  });

  it('uses alert role with polite live region', () => {
    const { getByRole } = render(
      wrap(<Snackbar visible message="X" onDismiss={() => {}} />)
    );
    expect(getByRole('alert').props.accessibilityLiveRegion).toBe('polite');
  });

  it('renders action button and fires onPress + onDismiss', () => {
    const onPress = jest.fn();
    const onDismiss = jest.fn();
    const { getByText } = render(
      wrap(
        <Snackbar
          visible
          message="X"
          duration={0}
          onDismiss={onDismiss}
          action={{ label: 'Undo', onPress }}
        />
      )
    );
    fireEvent.press(getByText('Undo'));
    expect(onPress).toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalled();
  });

  it('renders close icon and fires onDismiss when pressed', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = render(
      wrap(
        <Snackbar
          visible
          message="X"
          duration={0}
          onDismiss={onDismiss}
          showCloseIcon
        />
      )
    );
    fireEvent.press(getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('exposes DURATION constants', () => {
    expect(Snackbar.DURATION_SHORT).toBeGreaterThan(0);
    expect(Snackbar.DURATION_LONG).toBeGreaterThan(Snackbar.DURATION_SHORT);
  });
});
