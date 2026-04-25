import React from 'react';
import { render } from '@testing-library/react-native';

import { Avatar, AvatarBadge, AvatarGroup } from './Avatar';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Avatar', () => {
  it('renders initials', () => {
    const { getByText } = render(wrap(<Avatar initials="John Doe" />));
    expect(getByText('JD')).toBeTruthy();
  });

  it('uppercases single-name initials and trims to 2 chars', () => {
    const { getByText } = render(wrap(<Avatar initials="anna" />));
    expect(getByText('AN')).toBeTruthy();
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('renders %s size', (size) => {
    const { getByLabelText } = render(
      wrap(<Avatar initials="A" size={size} accessibilityLabel="X" />)
    );
    expect(getByLabelText('X')).toBeTruthy();
  });

  it('uses initials as accessibilityLabel fallback', () => {
    const { getByLabelText } = render(wrap(<Avatar initials="Jane Smith" />));
    expect(getByLabelText('Jane Smith')).toBeTruthy();
  });

  it('honors explicit accessibilityLabel', () => {
    const { getByLabelText } = render(
      wrap(<Avatar initials="X" accessibilityLabel="User profile" />)
    );
    expect(getByLabelText('User profile')).toBeTruthy();
  });

  it('has image accessibility role', () => {
    const { getByLabelText } = render(wrap(<Avatar initials="X" accessibilityLabel="Y" />));
    expect(getByLabelText('Y').props.accessibilityRole).toBe('image');
  });
});

describe('AvatarGroup', () => {
  it('renders up to max children and shows +N indicator', () => {
    const { getByText } = render(
      wrap(
        <AvatarGroup max={2}>
          <Avatar initials="A" />
          <Avatar initials="B" />
          <Avatar initials="C" />
          <Avatar initials="D" />
        </AvatarGroup>
      )
    );
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
    expect(getByText('+2')).toBeTruthy();
  });

  it('renders no overflow when count <= max', () => {
    const { queryByText } = render(
      wrap(
        <AvatarGroup max={4}>
          <Avatar initials="A" />
          <Avatar initials="B" />
        </AvatarGroup>
      )
    );
    expect(queryByText(/^\+/)).toBeNull();
  });
});

describe('AvatarBadge', () => {
  it('renders without throwing', () => {
    const { toJSON } = render(wrap(<AvatarBadge />));
    expect(toJSON()).not.toBeNull();
  });
});
