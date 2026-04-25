import React from 'react';
import { Pressable, Text } from 'react-native';
import { render } from '@testing-library/react-native';

import { Tooltip } from './Tooltip';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Tooltip', () => {
  it('renders the anchor child', () => {
    const { getByText } = render(
      wrap(
        <Tooltip message="Hint">
          <Pressable>
            <Text>Anchor</Text>
          </Pressable>
        </Tooltip>
      )
    );
    expect(getByText('Anchor')).toBeTruthy();
  });

  it('renders tooltip when controlled visible is true', () => {
    const { getByText } = render(
      wrap(
        <Tooltip message="Hint message" visible>
          <Pressable>
            <Text>Anchor</Text>
          </Pressable>
        </Tooltip>
      )
    );
    expect(getByText('Hint message')).toBeTruthy();
  });

  it('does not render tooltip content when visible is false', () => {
    const { queryByText } = render(
      wrap(
        <Tooltip message="Hidden" visible={false}>
          <Pressable>
            <Text>Anchor</Text>
          </Pressable>
        </Tooltip>
      )
    );
    expect(queryByText('Hidden')).toBeNull();
  });
});
