/**
 * AnimatedView — behavioral tests.
 *
 * Covers: rendering children, the full animation-preset matrix, completion
 * callbacks (spring + timing + delayed), animate/animateOnMount gating,
 * preset convenience components (FadeIn, ScaleIn, ...), Stagger, and refs.
 *
 * Animations are driven by real frame callbacks in the test environment, so
 * completion assertions await via waitFor (same pattern as Accordion.test.tsx).
 */

import React from 'react';
import { Text, View } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

import {
  AnimatedView,
  Stagger,
  FadeIn,
  FadeInUp,
  ScaleIn,
  ZoomIn,
  BounceIn,
} from './AnimatedView';
import { animationPresets } from './AnimatedView.types';
import type { AnimationPreset } from './AnimatedView.types';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

describe('AnimatedView', () => {
  describe('rendering', () => {
    it('renders its children', () => {
      const { getByText } = render(
        wrap(
          <AnimatedView>
            <Text>Animated content</Text>
          </AnimatedView>
        )
      );
      expect(getByText('Animated content')).toBeTruthy();
    });

    it('forwards testID to the animated container', () => {
      const { getByTestId } = render(
        wrap(
          <AnimatedView testID="animated-view">
            <Text>X</Text>
          </AnimatedView>
        )
      );
      expect(getByTestId('animated-view')).toBeTruthy();
    });

    it('forwards ref to the underlying view', () => {
      const ref = React.createRef<View>();
      render(
        wrap(
          <AnimatedView ref={ref}>
            <Text>X</Text>
          </AnimatedView>
        )
      );
      expect(ref.current).toBeTruthy();
    });
  });

  describe('animation presets', () => {
    it.each(Object.keys(animationPresets) as AnimationPreset[])(
      'renders children with the %s preset',
      (animation) => {
        const { getByText } = render(
          wrap(
            <AnimatedView animation={animation}>
              <Text>Preset child</Text>
            </AnimatedView>
          )
        );
        expect(getByText('Preset child')).toBeTruthy();
      }
    );
  });

  describe('completion callback', () => {
    it('fires onAnimationComplete after the spring animation (default easing)', async () => {
      const onAnimationComplete = jest.fn();
      render(
        wrap(
          <AnimatedView onAnimationComplete={onAnimationComplete}>
            <Text>X</Text>
          </AnimatedView>
        )
      );
      await waitFor(() => expect(onAnimationComplete).toHaveBeenCalledTimes(1), {
        timeout: 5000,
      });
    });

    it('fires onAnimationComplete with a timing easing', async () => {
      const onAnimationComplete = jest.fn();
      render(
        wrap(
          <AnimatedView easing="linear" duration={100} onAnimationComplete={onAnimationComplete}>
            <Text>X</Text>
          </AnimatedView>
        )
      );
      await waitFor(() => expect(onAnimationComplete).toHaveBeenCalledTimes(1), {
        timeout: 5000,
      });
    });

    it('still completes when a delay is set', async () => {
      const onAnimationComplete = jest.fn();
      render(
        wrap(
          <AnimatedView delay={50} easing="linear" duration={100} onAnimationComplete={onAnimationComplete}>
            <Text>X</Text>
          </AnimatedView>
        )
      );
      await waitFor(() => expect(onAnimationComplete).toHaveBeenCalledTimes(1), {
        timeout: 5000,
      });
    });

    it('does not animate when animate={false}', async () => {
      const onAnimationComplete = jest.fn();
      render(
        wrap(
          <AnimatedView
            animate={false}
            easing="linear"
            duration={50}
            onAnimationComplete={onAnimationComplete}
          >
            <Text>X</Text>
          </AnimatedView>
        )
      );
      // Give a would-be animation ample time to finish before asserting.
      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(onAnimationComplete).not.toHaveBeenCalled();
    });

    it('does not animate when animateOnMount={false}', async () => {
      const onAnimationComplete = jest.fn();
      render(
        wrap(
          <AnimatedView
            animateOnMount={false}
            easing="linear"
            duration={50}
            onAnimationComplete={onAnimationComplete}
          >
            <Text>X</Text>
          </AnimatedView>
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(onAnimationComplete).not.toHaveBeenCalled();
    });
  });

  describe('preset convenience components', () => {
    it.each([
      ['FadeIn', FadeIn],
      ['FadeInUp', FadeInUp],
      ['ScaleIn', ScaleIn],
      ['ZoomIn', ZoomIn],
      ['BounceIn', BounceIn],
    ] as const)('%s renders children', (_name, Preset) => {
      const { getByText } = render(
        wrap(
          <Preset>
            <Text>Preset component child</Text>
          </Preset>
        )
      );
      expect(getByText('Preset component child')).toBeTruthy();
    });

    it('preset components fire onAnimationComplete', async () => {
      const onAnimationComplete = jest.fn();
      render(
        wrap(
          <FadeIn easing="linear" duration={100} onAnimationComplete={onAnimationComplete}>
            <Text>X</Text>
          </FadeIn>
        )
      );
      await waitFor(() => expect(onAnimationComplete).toHaveBeenCalledTimes(1), {
        timeout: 5000,
      });
    });
  });

  describe('Stagger', () => {
    it('renders all children', () => {
      const { getByText } = render(
        wrap(
          <Stagger>
            <Text>First</Text>
            <Text>Second</Text>
            <Text>Third</Text>
          </Stagger>
        )
      );
      expect(getByText('First')).toBeTruthy();
      expect(getByText('Second')).toBeTruthy();
      expect(getByText('Third')).toBeTruthy();
    });

    it('forwards testID to the container', () => {
      const { getByTestId } = render(
        wrap(
          <Stagger testID="stagger">
            <Text>One</Text>
          </Stagger>
        )
      );
      expect(getByTestId('stagger')).toBeTruthy();
    });

    it('accepts a custom animation and stagger delay', () => {
      const { getByText } = render(
        wrap(
          <Stagger animation="scaleIn" staggerDelay={100}>
            <Text>A</Text>
            <Text>B</Text>
          </Stagger>
        )
      );
      expect(getByText('A')).toBeTruthy();
      expect(getByText('B')).toBeTruthy();
    });
  });
});
