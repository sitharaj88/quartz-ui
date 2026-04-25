import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { TextInput } from './TextInput';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('TextInput', () => {
  it('renders with label', () => {
    // Label is intentionally hidden from AT (input owns the a11y label) — query with includeHiddenElements.
    const { getByText } = render(wrap(<TextInput label="Email" />));
    expect(getByText('Email', { includeHiddenElements: true })).toBeTruthy();
  });

  it.each(['filled', 'outlined'] as const)('renders %s variant', (variant) => {
    const { getByLabelText } = render(wrap(<TextInput label="X" variant={variant} />));
    expect(getByLabelText('X')).toBeTruthy();
  });

  it('uses label as accessibilityLabel', () => {
    const { getByLabelText } = render(wrap(<TextInput label="Username" />));
    expect(getByLabelText('Username')).toBeTruthy();
  });

  it('honors explicit accessibilityLabel', () => {
    const { getByLabelText } = render(
      wrap(<TextInput label="X" accessibilityLabel="Search query" />)
    );
    expect(getByLabelText('Search query')).toBeTruthy();
  });

  it('fires onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = render(
      wrap(<TextInput label="Q" onChangeText={onChangeText} />)
    );
    fireEvent.changeText(getByLabelText('Q'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('does not edit when disabled', () => {
    const { getByLabelText } = render(wrap(<TextInput label="Q" disabled />));
    expect(getByLabelText('Q').props.editable).toBe(false);
  });

  it('reflects disabled in accessibilityState', () => {
    const { getByLabelText } = render(wrap(<TextInput label="Q" disabled />));
    expect(getByLabelText('Q').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('reflects invalid state on error', () => {
    const { getByLabelText } = render(wrap(<TextInput label="Q" error />));
    expect(getByLabelText('Q').props.accessibilityState).toMatchObject({ invalid: true });
  });

  it('renders error text with alert role', () => {
    const { getByRole } = render(
      wrap(<TextInput label="Q" errorText="Required field" />)
    );
    expect(getByRole('alert').props.children).toBe('Required field');
  });

  it('renders helper text without alert role', () => {
    const { queryByRole, getByText } = render(
      wrap(<TextInput label="Q" helperText="Type something" />)
    );
    expect(getByText('Type something', { includeHiddenElements: true })).toBeTruthy();
    expect(queryByRole('alert')).toBeNull();
  });

  it('shows counter when configured', () => {
    const { getByText } = render(
      wrap(<TextInput label="Q" maxLength={10} showCounter value="abc" />)
    );
    expect(getByText('3/10')).toBeTruthy();
  });

  it('forwards ref to underlying RN TextInput', () => {
    const ref = React.createRef<RNTextInput>();
    render(wrap(<TextInput ref={ref} label="Q" />));
    expect(typeof ref.current?.focus).toBe('function');
  });
});
