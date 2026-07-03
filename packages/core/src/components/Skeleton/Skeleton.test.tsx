/**
 * Skeleton — behavioral & a11y tests.
 *
 * Covers: progressbar role/label, shape border-radius presets, custom
 * dimensions, shimmer on/off, and the SkeletonText / SkeletonAvatar /
 * SkeletonCard sub-components.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from './Skeleton';
import type { SkeletonShape } from './Skeleton.types';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

const flatStyle = (node: { props: { style: unknown } }) =>
  StyleSheet.flatten(node.props.style as any) as Record<string, unknown>;

const layout = (width: number) => ({
  nativeEvent: { layout: { x: 0, y: 0, width, height: 16 } },
});

describe('Skeleton', () => {
  describe('accessibility', () => {
    it('exposes a progressbar role with a loading label', () => {
      const { getByRole } = render(wrap(<Skeleton testID="sk" />));
      const node = getByRole('progressbar');
      expect(node).toBeTruthy();
      expect(node.props.accessibilityLabel).toBe('Loading');
    });

    it('forwards testID', () => {
      const { getByTestId } = render(wrap(<Skeleton testID="sk" />));
      expect(getByTestId('sk')).toBeTruthy();
    });
  });

  describe('shapes', () => {
    const expectedRadius: Record<SkeletonShape, number> = {
      circular: 1000,
      rounded: 8,
      text: 4,
      rectangular: 0,
    };

    it.each(Object.keys(expectedRadius) as SkeletonShape[])(
      'applies the %s shape border radius',
      (shape) => {
        const { getByTestId } = render(wrap(<Skeleton testID="sk" shape={shape} />));
        expect(flatStyle(getByTestId('sk')).borderRadius).toBe(expectedRadius[shape]);
      }
    );

    it('lets an explicit borderRadius override the shape', () => {
      const { getByTestId } = render(
        wrap(<Skeleton testID="sk" shape="circular" borderRadius={2} />)
      );
      expect(flatStyle(getByTestId('sk')).borderRadius).toBe(2);
    });
  });

  describe('dimensions', () => {
    it('defaults to full width and 16 height', () => {
      const { getByTestId } = render(wrap(<Skeleton testID="sk" />));
      const flat = flatStyle(getByTestId('sk'));
      expect(flat.width).toBe('100%');
      expect(flat.height).toBe(16);
    });

    it('applies custom width and height', () => {
      const { getByTestId } = render(wrap(<Skeleton testID="sk" width={120} height={24} />));
      const flat = flatStyle(getByTestId('sk'));
      expect(flat.width).toBe(120);
      expect(flat.height).toBe(24);
    });
  });

  describe('shimmer', () => {
    it('renders the shimmer overlay after layout when animated', () => {
      const { getByTestId, toJSON } = render(wrap(<Skeleton testID="sk" />));
      fireEvent(getByTestId('sk'), 'layout', layout(200));
      const tree = toJSON() as any;
      expect(tree.children).toHaveLength(1);
    });

    it('renders no shimmer when animated is false', () => {
      const { getByTestId, toJSON } = render(wrap(<Skeleton testID="sk" animated={false} />));
      fireEvent(getByTestId('sk'), 'layout', layout(200));
      const tree = toJSON() as any;
      expect(tree.children).toBeNull();
    });
  });
});

describe('SkeletonText', () => {
  it('renders three lines by default', () => {
    const { getAllByRole } = render(wrap(<SkeletonText />));
    expect(getAllByRole('progressbar')).toHaveLength(3);
  });

  it('renders a custom number of lines', () => {
    const { getAllByRole } = render(wrap(<SkeletonText lines={5} />));
    expect(getAllByRole('progressbar')).toHaveLength(5);
  });

  it('shortens the last line', () => {
    const { getAllByRole } = render(wrap(<SkeletonText lines={2} lastLineWidth="50%" />));
    const linesRendered = getAllByRole('progressbar');
    expect(flatStyle(linesRendered[0]).width).toBe('100%');
    expect(flatStyle(linesRendered[1]).width).toBe('50%');
  });

  it('applies line height to each line', () => {
    const { getAllByRole } = render(wrap(<SkeletonText lines={2} lineHeight={20} />));
    expect(flatStyle(getAllByRole('progressbar')[0]).height).toBe(20);
  });

  it('forwards testID to the container', () => {
    const { getByTestId } = render(wrap(<SkeletonText testID="text-skeleton" />));
    expect(getByTestId('text-skeleton')).toBeTruthy();
  });
});

describe('SkeletonAvatar', () => {
  it('is circular by default with a 40px size', () => {
    const { getByTestId } = render(wrap(<SkeletonAvatar testID="avatar" />));
    const flat = flatStyle(getByTestId('avatar'));
    expect(flat.width).toBe(40);
    expect(flat.height).toBe(40);
    expect(flat.borderRadius).toBe(1000);
  });

  it('honors a custom size', () => {
    const { getByTestId } = render(wrap(<SkeletonAvatar testID="avatar" size={64} />));
    const flat = flatStyle(getByTestId('avatar'));
    expect(flat.width).toBe(64);
    expect(flat.height).toBe(64);
  });

  it('supports the rounded shape', () => {
    const { getByTestId } = render(
      wrap(<SkeletonAvatar testID="avatar" shape="rounded" />)
    );
    expect(flatStyle(getByTestId('avatar')).borderRadius).toBe(8);
  });
});

describe('SkeletonCard', () => {
  it('forwards testID', () => {
    const { getByTestId } = render(wrap(<SkeletonCard testID="card" />));
    expect(getByTestId('card')).toBeTruthy();
  });

  it('composes avatar, text lines and an image placeholder', () => {
    // 1 avatar + 2 header lines + 3 body lines + 1 image block = 7 skeletons.
    const { getAllByRole } = render(wrap(<SkeletonCard />));
    expect(getAllByRole('progressbar')).toHaveLength(7);
  });
});
