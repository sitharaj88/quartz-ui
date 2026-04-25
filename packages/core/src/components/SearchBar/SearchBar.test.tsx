import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { SearchBar, SearchSuggestion } from './SearchBar';
import type { SearchBarHandle } from './SearchBar';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('SearchBar', () => {
  it('renders with placeholder as a11y label', () => {
    const { getByLabelText } = render(
      wrap(<SearchBar value="" onChangeText={() => {}} placeholder="Search files" />)
    );
    expect(getByLabelText('Search files')).toBeTruthy();
  });

  it('fires onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = render(
      wrap(<SearchBar value="" onChangeText={onChangeText} />)
    );
    fireEvent.changeText(getByLabelText('Search'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('shows clear button when there is text', () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = render(
      wrap(<SearchBar value="abc" onChangeText={onChangeText} />)
    );
    fireEvent.press(getByLabelText('Clear search'));
    expect(onChangeText).toHaveBeenCalledWith('');
  });

  it('hides clear button when empty', () => {
    const { queryByLabelText } = render(
      wrap(<SearchBar value="" onChangeText={() => {}} />)
    );
    expect(queryByLabelText('Clear search')).toBeNull();
  });

  it('exposes ref handle with focus/blur/clear', () => {
    const ref = React.createRef<SearchBarHandle>();
    const onChangeText = jest.fn();
    render(wrap(<SearchBar ref={ref} value="x" onChangeText={onChangeText} />));
    expect(typeof ref.current?.focus).toBe('function');
    expect(typeof ref.current?.clear).toBe('function');
    ref.current?.clear();
    expect(onChangeText).toHaveBeenCalledWith('');
  });

  it('uses search role on the input', () => {
    const { getByLabelText } = render(
      wrap(<SearchBar value="" onChangeText={() => {}} placeholder="X" />)
    );
    expect(getByLabelText('X').props.accessibilityRole).toBe('search');
  });
});

describe('SearchSuggestion', () => {
  it('renders text and fires onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      wrap(<SearchSuggestion text="Recent search" onPress={onPress} />)
    );
    fireEvent.press(getByText('Recent search'));
    expect(onPress).toHaveBeenCalled();
  });
});
