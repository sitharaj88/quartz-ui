import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { AlertDialog, Dialog } from './Dialog';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Dialog', () => {
  it('renders title and content when visible', () => {
    const { getByText } = render(
      wrap(
        <Dialog visible onDismiss={() => {}} title="Confirm">
          <Text>Are you sure?</Text>
        </Dialog>
      )
    );
    expect(getByText('Confirm')).toBeTruthy();
    expect(getByText('Are you sure?')).toBeTruthy();
  });

  it('does not render content when visible is false', () => {
    const { queryByText } = render(
      wrap(
        <Dialog visible={false} onDismiss={() => {}} title="Hidden">
          <Text>Content</Text>
        </Dialog>
      )
    );
    expect(queryByText('Hidden')).toBeNull();
  });

  it('uses alert role and is modal', () => {
    const { getByRole } = render(
      wrap(<Dialog visible onDismiss={() => {}} title="X" />)
    );
    expect(getByRole('alert').props.accessibilityViewIsModal).toBe(true);
  });

  it('renders action buttons and forwards onPress', () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      wrap(
        <Dialog
          visible
          onDismiss={() => {}}
          title="X"
          actions={[{ label: 'Confirm', onPress: onConfirm }]}
        />
      )
    );
    fireEvent.press(getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });
});

describe('AlertDialog', () => {
  it('renders title, message and confirm button', () => {
    const { getByText } = render(
      wrap(
        <AlertDialog
          visible
          onDismiss={() => {}}
          title="Delete?"
          message="This cannot be undone."
        />
      )
    );
    expect(getByText('Delete?')).toBeTruthy();
    expect(getByText('This cannot be undone.')).toBeTruthy();
    expect(getByText('OK')).toBeTruthy();
  });

  it('fires onConfirm + onDismiss when confirm pressed', () => {
    const onConfirm = jest.fn();
    const onDismiss = jest.fn();
    const { getByText } = render(
      wrap(
        <AlertDialog
          visible
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          title="X"
          message="Y"
          confirmLabel="Yes"
        />
      )
    );
    fireEvent.press(getByText('Yes'));
    expect(onConfirm).toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalled();
  });
});
