import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { RadioButton, RadioGroup } from './RadioButton';
import type { RadioButtonHandle } from './RadioButton';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('RadioButton', () => {
  it('renders unselected by default', () => {
    const { getByRole } = render(wrap(<RadioButton accessibilityLabel="A" />));
    expect(getByRole('radio').props.accessibilityState).toMatchObject({ checked: false });
  });

  it('renders selected when prop is true', () => {
    const { getByRole } = render(wrap(<RadioButton selected accessibilityLabel="A" />));
    expect(getByRole('radio').props.accessibilityState).toMatchObject({ checked: true });
  });

  it('fires onPress when not selected', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      wrap(<RadioButton accessibilityLabel="A" onPress={onPress} />)
    );
    fireEvent.press(getByRole('radio'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire onPress when already selected', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      wrap(<RadioButton selected accessibilityLabel="A" onPress={onPress} />)
    );
    fireEvent.press(getByRole('radio'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      wrap(<RadioButton disabled accessibilityLabel="A" onPress={onPress} />)
    );
    fireEvent.press(getByRole('radio'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes ref handle', () => {
    const ref = React.createRef<RadioButtonHandle>();
    render(wrap(<RadioButton ref={ref} accessibilityLabel="A" />));
    expect(typeof ref.current?.focus).toBe('function');
  });
});

describe('RadioGroup', () => {
  it('marks the matching child as selected', () => {
    const { getAllByRole } = render(
      wrap(
        <RadioGroup value="b">
          <RadioButton value="a" accessibilityLabel="A" />
          <RadioButton value="b" accessibilityLabel="B" />
          <RadioButton value="c" accessibilityLabel="C" />
        </RadioGroup>
      )
    );
    const radios = getAllByRole('radio');
    expect(radios[0].props.accessibilityState).toMatchObject({ checked: false });
    expect(radios[1].props.accessibilityState).toMatchObject({ checked: true });
    expect(radios[2].props.accessibilityState).toMatchObject({ checked: false });
  });

  it('calls onValueChange with the pressed value', () => {
    const onValueChange = jest.fn();
    const { getAllByRole } = render(
      wrap(
        <RadioGroup value="a" onValueChange={onValueChange}>
          <RadioButton value="a" accessibilityLabel="A" />
          <RadioButton value="b" accessibilityLabel="B" />
        </RadioGroup>
      )
    );
    fireEvent.press(getAllByRole('radio')[1]);
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('exposes radiogroup role', () => {
    const { getByLabelText } = render(
      wrap(
        <RadioGroup value="a" accessibilityLabel="Choose">
          <RadioButton value="a" accessibilityLabel="A" />
        </RadioGroup>
      )
    );
    // RNTL's getByRole doesn't map "radiogroup"; assert via the labeled container.
    const group = getByLabelText('Choose');
    expect(group.props.accessibilityRole).toBe('radiogroup');
  });
});
