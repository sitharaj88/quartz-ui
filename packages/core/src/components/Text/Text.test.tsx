import React from 'react';
import { Text as RNText } from 'react-native';
import { render } from '@testing-library/react-native';

import { Text, DisplayLarge, BodySmall, LabelLarge } from './Text';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('Text', () => {
  it('renders children', () => {
    const { getByText } = render(wrap(<Text>Hello world</Text>));
    expect(getByText('Hello world')).toBeTruthy();
  });

  it('applies the variant typography', () => {
    const { getByText } = render(wrap(<Text variant="headlineLarge">Big</Text>));
    const node = getByText('Big');
    const flat = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style)
      : node.props.style;
    expect(flat.fontSize).toBeGreaterThan(20);
  });

  it('applies custom color', () => {
    const { getByText } = render(wrap(<Text color="#FF0000">Red</Text>));
    const node = getByText('Red');
    const flat = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style)
      : node.props.style;
    expect(flat.color).toBe('#FF0000');
  });

  it('uppercase transform', () => {
    const { getByText } = render(wrap(<Text uppercase>shout</Text>));
    const node = getByText('shout');
    const flat = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style)
      : node.props.style;
    expect(flat.textTransform).toBe('uppercase');
  });

  it('has text role', () => {
    const { getByText } = render(wrap(<Text>X</Text>));
    expect(getByText('X').props.accessibilityRole).toBe('text');
  });

  it('forwards ref to RN Text', () => {
    const ref = React.createRef<RNText>();
    render(wrap(<Text ref={ref}>X</Text>));
    expect(ref.current).not.toBeNull();
  });

  it('exposes typography convenience components', () => {
    const { getByText } = render(
      wrap(
        <>
          <DisplayLarge>D</DisplayLarge>
          <BodySmall>B</BodySmall>
          <LabelLarge>L</LabelLarge>
        </>
      )
    );
    expect(getByText('D')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
    expect(getByText('L')).toBeTruthy();
  });
});
