import React from 'react';
import { render } from '@testing-library/react-native';

import { Badge } from './Badge';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Badge', () => {
  it('renders dot when no content', () => {
    const { getByLabelText } = render(wrap(<Badge testID="b" />));
    expect(getByLabelText('New notification')).toBeTruthy();
  });

  it('renders content', () => {
    const { getByText } = render(wrap(<Badge content={5} />));
    expect(getByText('5')).toBeTruthy();
  });

  it('clamps to max+ when content exceeds max', () => {
    const { getByText } = render(wrap(<Badge content={1000} max={99} />));
    expect(getByText('99+')).toBeTruthy();
  });

  it('returns null when not visible', () => {
    const { toJSON } = render(wrap(<Badge content={1} visible={false} />));
    expect(toJSON()).toBeNull();
  });

  it('exposes count in a11y label', () => {
    const { getByLabelText } = render(wrap(<Badge content={3} />));
    expect(getByLabelText('3 notifications')).toBeTruthy();
  });

  it('uses polite live region', () => {
    const { getByLabelText } = render(wrap(<Badge content={3} />));
    expect(getByLabelText('3 notifications').props.accessibilityLiveRegion).toBe('polite');
  });
});
