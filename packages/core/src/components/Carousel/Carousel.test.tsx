/**
 * Carousel — behavioral & a11y tests.
 *
 * Covers: slide rendering, container-driven sizing per layout, pagination
 * indicators (roles/labels/selected state), prev/next arrows and their
 * disabled logic, item press callbacks, and the adjustable a11y contract.
 *
 * Note: reanimated is mocked (jest.setup.js) — useAnimatedScrollHandler is a
 * noop, so scroll-driven index changes are not simulatable here; we test the
 * observable API surface instead.
 */

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { Carousel, CarouselItem } from './Carousel';
import { QuartzProvider } from '../../theme/ThemeProvider';

const wrap = (ui: React.ReactElement) => <QuartzProvider>{ui}</QuartzProvider>;

const makeItems = (count: number): CarouselItem[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `item-${i + 1}`,
    content: <Text>{`Content ${i + 1}`}</Text>,
    label: `Label ${i + 1}`,
  }));

const layoutCarousel = (getByTestId: (id: string) => any, width = 320) => {
  fireEvent(getByTestId('carousel'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width, height: 200 } },
  });
};

describe('Carousel', () => {
  describe('rendering', () => {
    it('renders every slide content', () => {
      const { getByText } = render(
        wrap(<Carousel items={makeItems(3)} testID="carousel" />)
      );
      expect(getByText('Content 1')).toBeTruthy();
      expect(getByText('Content 2')).toBeTruthy();
      expect(getByText('Content 3')).toBeTruthy();
    });

    it('renders slide labels and supporting text', () => {
      const items: CarouselItem[] = [
        {
          key: 'a',
          content: <Text>A</Text>,
          label: 'Slide title',
          supportingText: 'More details',
        },
      ];
      const { getByText } = render(wrap(<Carousel items={items} />));
      expect(getByText('Slide title')).toBeTruthy();
      expect(getByText('More details')).toBeTruthy();
    });

    it.each(['hero', 'center', 'multi-browse', 'uncontained'] as const)(
      'renders the %s layout',
      (layout) => {
        const { getByText, getByTestId } = render(
          wrap(<Carousel items={makeItems(2)} layout={layout} testID="carousel" />)
        );
        layoutCarousel(getByTestId);
        expect(getByText('Content 1')).toBeTruthy();
      }
    );

    it('forwards testID to the container', () => {
      const { getByTestId } = render(
        wrap(<Carousel items={makeItems(2)} testID="my-carousel" />)
      );
      expect(getByTestId('my-carousel')).toBeTruthy();
    });
  });

  describe('sizing from container width', () => {
    it('sizes hero slides to 85% of the measured container', () => {
      const { getByTestId, getByLabelText } = render(
        wrap(<Carousel items={makeItems(2)} layout="hero" testID="carousel" />)
      );
      layoutCarousel(getByTestId, 320);
      const slide = getByLabelText('Label 1');
      expect(StyleSheet.flatten(slide.props.style).width).toBe(320 * 0.85);
    });

    it('uses the custom itemWidth for multi-browse layouts', () => {
      const { getByTestId, getByLabelText } = render(
        wrap(
          <Carousel
            items={makeItems(3)}
            layout="multi-browse"
            itemWidth={120}
            testID="carousel"
          />
        )
      );
      layoutCarousel(getByTestId, 320);
      const slide = getByLabelText('Label 1');
      expect(StyleSheet.flatten(slide.props.style).width).toBe(120);
    });
  });

  describe('accessibility', () => {
    it('exposes an adjustable role with a default label', () => {
      const { getByRole } = render(wrap(<Carousel items={makeItems(2)} />));
      const carousel = getByRole('adjustable');
      expect(carousel.props.accessibilityLabel).toBe('Carousel');
    });

    it('honors a custom accessibilityLabel', () => {
      const { getByRole } = render(
        wrap(<Carousel items={makeItems(2)} accessibilityLabel="Featured photos" />)
      );
      expect(getByRole('adjustable').props.accessibilityLabel).toBe('Featured photos');
    });

    it('reports position via accessibilityValue', () => {
      const { getByRole } = render(wrap(<Carousel items={makeItems(4)} />));
      expect(getByRole('adjustable').props.accessibilityValue).toEqual({
        min: 1,
        max: 4,
        now: 1,
      });
    });

    it('labels each slide, falling back to its label prop', () => {
      const items: CarouselItem[] = [
        { key: 'a', content: <Text>A</Text>, accessibilityLabel: 'Custom a11y' },
        { key: 'b', content: <Text>B</Text>, label: 'B label' },
      ];
      const { getByLabelText } = render(wrap(<Carousel items={items} />));
      expect(getByLabelText('Custom a11y')).toBeTruthy();
      expect(getByLabelText('B label')).toBeTruthy();
    });
  });

  describe('indicators', () => {
    it('renders one dot per item with positional labels', () => {
      const { getAllByLabelText } = render(wrap(<Carousel items={makeItems(3)} />));
      expect(getAllByLabelText(/Go to slide \d of 3/)).toHaveLength(3);
    });

    it('marks only the active dot as selected', () => {
      const { getByLabelText } = render(wrap(<Carousel items={makeItems(3)} />));
      expect(
        getByLabelText('Go to slide 1 of 3').props.accessibilityState.selected
      ).toBe(true);
      expect(
        getByLabelText('Go to slide 2 of 3').props.accessibilityState.selected
      ).toBe(false);
    });

    it('hides indicators when showIndicators is false', () => {
      const { queryByLabelText } = render(
        wrap(<Carousel items={makeItems(3)} showIndicators={false} />)
      );
      expect(queryByLabelText(/Go to slide/)).toBeNull();
    });

    it('hides indicators for a single item', () => {
      const { queryByLabelText } = render(wrap(<Carousel items={makeItems(1)} />));
      expect(queryByLabelText(/Go to slide/)).toBeNull();
    });

    it('dots can be pressed without throwing', () => {
      const { getByTestId, getByLabelText } = render(
        wrap(<Carousel items={makeItems(3)} testID="carousel" />)
      );
      layoutCarousel(getByTestId);
      expect(() =>
        fireEvent.press(getByLabelText('Go to slide 3 of 3'))
      ).not.toThrow();
    });
  });

  describe('arrows', () => {
    it('renders prev/next arrows when showArrows is set', () => {
      const { getByLabelText } = render(
        wrap(<Carousel items={makeItems(3)} showArrows />)
      );
      expect(getByLabelText('Previous slide')).toBeTruthy();
      expect(getByLabelText('Next slide')).toBeTruthy();
    });

    it('does not render arrows by default on native', () => {
      const { queryByLabelText } = render(wrap(<Carousel items={makeItems(3)} />));
      expect(queryByLabelText('Previous slide')).toBeNull();
      expect(queryByLabelText('Next slide')).toBeNull();
    });

    it('hides arrows for a single item even when showArrows is set', () => {
      const { queryByLabelText } = render(
        wrap(<Carousel items={makeItems(1)} showArrows />)
      );
      expect(queryByLabelText('Next slide')).toBeNull();
    });

    it('disables the prev arrow on the first slide when not looping', () => {
      const { getByLabelText } = render(
        wrap(<Carousel items={makeItems(3)} showArrows />)
      );
      expect(
        getByLabelText('Previous slide').props.accessibilityState.disabled
      ).toBe(true);
      expect(
        getByLabelText('Next slide').props.accessibilityState.disabled
      ).toBe(false);
    });

    it('keeps the prev arrow enabled when looping', () => {
      const { getByLabelText } = render(
        wrap(<Carousel items={makeItems(3)} showArrows loop />)
      );
      expect(
        getByLabelText('Previous slide').props.accessibilityState.disabled
      ).toBe(false);
    });

    it('renders custom prev/next icons', () => {
      const { getByTestId } = render(
        wrap(
          <Carousel
            items={makeItems(3)}
            showArrows
            prevIcon={<Text testID="prev-icon">{'<'}</Text>}
            nextIcon={<Text testID="next-icon">{'>'}</Text>}
          />
        )
      );
      expect(getByTestId('prev-icon')).toBeTruthy();
      expect(getByTestId('next-icon')).toBeTruthy();
    });

    it('next arrow can be pressed without throwing', () => {
      const { getByTestId, getByLabelText } = render(
        wrap(<Carousel items={makeItems(3)} showArrows testID="carousel" />)
      );
      layoutCarousel(getByTestId);
      expect(() => fireEvent.press(getByLabelText('Next slide'))).not.toThrow();
    });
  });

  describe('item press', () => {
    it('fires onItemPress with the item and index for the current slide', () => {
      const onItemPress = jest.fn();
      const items = makeItems(3);
      const { getByText } = render(
        wrap(<Carousel items={items} onItemPress={onItemPress} />)
      );
      fireEvent.press(getByText('Content 1'));
      expect(onItemPress).toHaveBeenCalledWith(items[0], 0);
    });

    it('fires onItemPress for a non-current slide (and scrolls to it)', () => {
      const onItemPress = jest.fn();
      const items = makeItems(3);
      const { getByTestId, getByText } = render(
        wrap(<Carousel items={items} onItemPress={onItemPress} testID="carousel" />)
      );
      layoutCarousel(getByTestId);
      fireEvent.press(getByText('Content 2'));
      expect(onItemPress).toHaveBeenCalledWith(items[1], 1);
    });
  });
});
