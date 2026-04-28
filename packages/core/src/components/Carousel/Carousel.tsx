/**
 * Quartz UI - Carousel
 *
 * A carousel that works on touch *and* mouse. Web users get prev/next buttons
 * (with hover affordance), keyboard navigation (←/→/Home/End), and pause-on-hover
 * for auto-play. Sizes itself from its container width (not screen width), so it
 * works inside narrow columns and re-flows on browser resize.
 *
 * Layouts:
 *   - hero: large center item with peeked siblings
 *   - center: medium center item with larger peeks
 *   - multi-browse: fixed-width items, multiple visible
 *   - uncontained: full-width items with small peeks
 */

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Pressable,
  Platform,
  LayoutChangeEvent,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { springConfig } from '../../tokens/motion';
import { withAlpha } from '../../utils/color';

export type CarouselLayout = 'hero' | 'center' | 'multi-browse' | 'uncontained';

export interface CarouselItem {
  /** Unique key */
  key: string;
  /** Content to render */
  content: React.ReactNode;
  /** Optional label */
  label?: string;
  /** Optional supporting text */
  supportingText?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export interface CarouselProps {
  /** Items to display */
  items: CarouselItem[];
  /** Layout variant */
  layout?: CarouselLayout;
  /** Auto-play interval in ms (0 to disable) */
  autoPlayInterval?: number;
  /** Loop back to start when reaching the end */
  loop?: boolean;
  /** Item width (multi-browse only) */
  itemWidth?: number;
  /** Gap between items in px */
  gap?: number;
  /** Show pagination dots */
  showIndicators?: boolean;
  /** Indicator position */
  indicatorPosition?: 'inside' | 'outside';
  /**
   * Show prev/next arrow buttons. Defaults to `true` on web, `false` on native.
   * Useful even on touch surfaces if you want a fallback.
   */
  showArrows?: boolean;
  /**
   * Force an aspect ratio for slides (e.g. 16/10). Defaults to `0`, which
   * lets each slide size to its own content (recommended). Set this only if
   * your content has no intrinsic height.
   */
  aspectRatio?: number;
  /** Current index change callback */
  onIndexChange?: (index: number) => void;
  /** Item press callback */
  onItemPress?: (item: CarouselItem, index: number) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Required for screen readers — describes what the carousel contains. */
  accessibilityLabel?: string;
  /** Override the default chevron icon for the prev arrow. */
  prevIcon?: React.ReactNode;
  /** Override the default chevron icon for the next arrow. */
  nextIcon?: React.ReactNode;
}

/**
 * Lightweight chevron made from two rotated rectangles. Avoids pulling in an
 * icon library as a peer dep. Color and direction are customizable.
 */
function Chevron({ direction, color }: { direction: 'left' | 'right'; color: string }) {
  // Inner box is a top+right border ⌐ (corner at top-right). To rotate that
  // into a `>` the corner must end up on the right, so we rotate +45° CW; for
  // `<` the corner must end up on the left, so -135° CW. Earlier values
  // (-45° / +135°) sent the corner to the top/bottom and rendered as ^ / v.
  return (
    <View
      style={{
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: direction === 'left' ? '-135deg' : '45deg' }],
      }}
    >
      <View
        style={{
          width: 9,
          height: 9,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
        }}
      />
    </View>
  );
}

// ─── Indicator dot ─────────────────────────────────────────────────────────────

function IndicatorDot({
  active,
  onPress,
  index,
  total,
}: {
  active: boolean;
  onPress: () => void;
  index: number;
  total: number;
}) {
  const theme = useTheme();
  const scale = useSharedValue(active ? 1 : 0.6);
  const opacity = useSharedValue(active ? 1 : 0.4);

  useEffect(() => {
    scale.value = withSpring(active ? 1 : 0.6, springConfig.gentle);
    opacity.value = withSpring(active ? 1 : 0.4, springConfig.gentle);
  }, [active, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={`Go to slide ${index + 1} of ${total}`}
      accessibilityState={{ selected: active }}
    >
      <Animated.View
        style={[
          styles.indicatorDot,
          {
            backgroundColor: active ? theme.colors.primary : theme.colors.onSurfaceVariant,
            width: active ? 24 : 8,
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
}

// ─── Item — hooks live at the top level of a component, not in a loop ─────────

function CarouselSlide({
  item,
  index,
  layout,
  itemWidth,
  gap,
  snapInterval,
  scrollX,
  aspectRatio,
  onPress,
}: {
  item: CarouselItem;
  index: number;
  layout: CarouselLayout;
  itemWidth: number;
  gap: number;
  snapInterval: number;
  scrollX: SharedValue<number>;
  aspectRatio: number;
  onPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * snapInterval,
      index * snapInterval,
      (index + 1) * snapInterval,
    ];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      layout === 'hero' ? [0.9, 1, 0.9] : [0.95, 1, 0.95],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(scrollX.value, inputRange, [0.6, 1, 0.6], Extrapolation.CLAMP);
    return {
      transform: [{ scale }],
      opacity: layout === 'multi-browse' ? 1 : opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          width: itemWidth,
          marginHorizontal: gap / 2,
          ...(aspectRatio > 0 ? { aspectRatio } : {}),
        },
        animatedStyle,
      ]}
      accessible
      accessibilityLabel={item.accessibilityLabel || item.label || `Slide ${index + 1}`}
    >
      <Pressable onPress={onPress} style={styles.itemPressable}>
        <View style={[styles.itemContent, { borderRadius: 24 }]}>{item.content}</View>

        {(item.label || item.supportingText) && (
          <View style={[styles.labelContainer, { borderRadius: 24 }]}>
            <View style={styles.labelGradient}>
              {item.label && (
                <Text variant="titleMedium" style={{ color: '#FFFFFF' }} numberOfLines={1}>
                  {item.label}
                </Text>
              )}
              {item.supportingText && (
                <Text
                  variant="bodySmall"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  numberOfLines={2}
                >
                  {item.supportingText}
                </Text>
              )}
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const CarouselImpl = function Carousel({
  items,
  layout = 'hero',
  autoPlayInterval = 0,
  loop = false,
  itemWidth: customItemWidth,
  gap = 8,
  showIndicators = true,
  indicatorPosition = 'outside',
  showArrows = Platform.OS === 'web',
  aspectRatio = 0,
  onIndexChange,
  onItemPress,
  style,
  testID,
  accessibilityLabel,
  prevIcon,
  nextIcon,
}: CarouselProps): React.ReactElement {
  const theme = useTheme();
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollX = useSharedValue(0);
  // Browser timer is `number`; native is opaque. Use ReturnType<setInterval> for both.
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Measure the container — this is what makes the carousel work in narrow columns.
  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== containerWidth) setContainerWidth(w);
  }, [containerWidth]);

  // Compute item dimensions from the actual container width.
  const { itemWidth, peekWidth } = (() => {
    if (containerWidth === 0) {
      // First render — fall back to a sensible default. Real values come on next frame.
      return { itemWidth: 320, peekWidth: 0 };
    }
    switch (layout) {
      case 'hero':
        return { itemWidth: containerWidth * 0.85, peekWidth: containerWidth * 0.075 };
      case 'center':
        return { itemWidth: containerWidth * 0.7, peekWidth: containerWidth * 0.15 };
      case 'multi-browse':
        return { itemWidth: customItemWidth || containerWidth * 0.4, peekWidth: 0 };
      case 'uncontained':
        return { itemWidth: containerWidth - 32, peekWidth: 16 };
      default:
        return { itemWidth: containerWidth * 0.85, peekWidth: containerWidth * 0.075 };
    }
  })();

  const snapInterval = itemWidth + gap;

  // ─── Index management ────────────────────────────────────────────────────
  const updateCurrentIndex = useCallback(
    (index: number) => {
      if (index !== currentIndex) {
        setCurrentIndex(index);
        onIndexChange?.(index);
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync().catch(() => {});
        }
      }
    },
    [currentIndex, onIndexChange]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      if (snapInterval > 0) {
        const index = Math.round(event.contentOffset.x / snapInterval);
        runOnJS(updateCurrentIndex)(Math.max(0, Math.min(index, items.length - 1)));
      }
    },
  });

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = loop ? ((index % items.length) + items.length) % items.length : Math.max(0, Math.min(index, items.length - 1));
      scrollViewRef.current?.scrollTo({ x: clamped * snapInterval, animated: true });
    },
    [items.length, snapInterval, loop]
  );

  const goPrev = useCallback(() => scrollToIndex(currentIndex - 1), [currentIndex, scrollToIndex]);
  const goNext = useCallback(() => scrollToIndex(currentIndex + 1), [currentIndex, scrollToIndex]);

  // ─── Auto-play (pauses on hover, per WCAG 2.2.2) ────────────────────────
  useEffect(() => {
    if (autoPlayInterval <= 0 || isHovered) {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
      return;
    }
    autoPlayTimer.current = setInterval(() => {
      const nextIndex = loop
        ? (currentIndex + 1) % items.length
        : Math.min(currentIndex + 1, items.length - 1);
      scrollToIndex(nextIndex);
    }, autoPlayInterval);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [autoPlayInterval, currentIndex, items.length, loop, scrollToIndex, isHovered]);

  // ─── Keyboard nav (web) ─────────────────────────────────────────────────
  const onKeyDown = useCallback(
    (e: { key?: string; nativeEvent?: { key?: string } }) => {
      const key = e.key || e.nativeEvent?.key;
      if (!key) return;
      if (key === 'ArrowRight') goNext();
      else if (key === 'ArrowLeft') goPrev();
      else if (key === 'Home') scrollToIndex(0);
      else if (key === 'End') scrollToIndex(items.length - 1);
    },
    [goNext, goPrev, scrollToIndex, items.length]
  );

  const handleItemPress = useCallback(
    (item: CarouselItem, index: number) => {
      if (index !== currentIndex) scrollToIndex(index);
      onItemPress?.(item, index);
    },
    [currentIndex, scrollToIndex, onItemPress]
  );

  // ─── Mouse-drag-to-scroll on web ────────────────────────────────────────
  // Browsers don't natively support click-and-drag scrolling on overflow:auto
  // divs. We track pointer events ourselves and translate horizontal drag into
  // scrollTo calls. We attach move/up listeners to `window` (not the carousel
  // View) because child Pressables capture the pointer once they receive
  // mouseDown — without `window` listeners we'd never see mouseMove/mouseUp.
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const endDrag = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (snapInterval > 0) {
      const targetIndex = Math.round(scrollX.value / snapInterval);
      const clamped = Math.max(0, Math.min(targetIndex, items.length - 1));
      scrollViewRef.current?.scrollTo({ x: clamped * snapInterval, animated: true });
    }
    // Clear `moved` next tick so click-suppression doesn't carry over.
    setTimeout(() => {
      dragRef.current.moved = false;
    }, 0);
  }, [items.length, scrollX, snapInterval]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (Platform.OS !== 'web') return;
      if (e.button !== 0) return; // primary button only

      dragRef.current = {
        active: true,
        startX: e.clientX,
        startScroll: scrollX.value,
        moved: false,
      };

      // Window-level listeners so a captured pointer in a child Pressable
      // doesn't strand us mid-drag.
      const handleMove = (moveEvent: MouseEvent) => {
        if (!dragRef.current.active) return;
        const delta = dragRef.current.startX - moveEvent.clientX;
        if (Math.abs(delta) > 5) dragRef.current.moved = true;
        moveEvent.preventDefault?.();
        scrollViewRef.current?.scrollTo({
          x: dragRef.current.startScroll + delta,
          animated: false,
        });
      };
      const handleUp = () => {
        endDrag();
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [scrollX, endDrag]
  );

  // ─── Web event handlers (hover for autoplay pause + drag-to-scroll) ─────
  // NOTE: do NOT include `style` in this object — JSX spread would overwrite
  // the existing style array. Cursor hint is applied separately below.
  const webEventProps =
    Platform.OS === 'web'
      ? ({
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => {
            setIsHovered(false);
          },
          onMouseDown,
        } as unknown as object)
      : {};

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < items.length - 1;

  // ─── Render ─────────────────────────────────────────────────────────────
  // Cursor hint must live in the style array, not in the spread props (JSX
  // spread would overwrite the entire `style` prop).
  const webCursorStyle =
    Platform.OS === 'web' ? ({ cursor: 'grab' } as unknown as ViewStyle) : null;

  return (
    <View
      style={[styles.container, webCursorStyle, style]}
      onLayout={onContainerLayout}
      testID={testID}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel || 'Carousel'}
      accessibilityValue={{ min: 1, max: items.length, now: currentIndex + 1 }}
      // RN web: turn into an actionable region
      {...({ 'aria-roledescription': 'carousel' } as object)}
      {...webEventProps}
      {...(Platform.OS === 'web'
        ? ({ onKeyDown, tabIndex: 0 } as unknown as object)
        : {})}
    >
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Native uses ScrollView's built-in snap. Web does not — CSS
        // scroll-snap fights our programmatic scrollTo during drag, so on web
        // we let the user scroll freely and JS snaps on release (see endDrag
        // and onMomentumScrollEnd / onScrollEndDrag below).
        {...(Platform.OS !== 'web'
          ? {
              snapToInterval: snapInterval,
              snapToAlignment: 'start' as const,
              decelerationRate: 'fast' as const,
            }
          : {})}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: layout === 'uncontained' ? 16 : peekWidth },
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={
          Platform.OS === 'web' && snapInterval > 0
            ? (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                const x = e.nativeEvent.contentOffset.x;
                const targetIndex = Math.max(
                  0,
                  Math.min(Math.round(x / snapInterval), items.length - 1)
                );
                scrollViewRef.current?.scrollTo({
                  x: targetIndex * snapInterval,
                  animated: true,
                });
              }
            : undefined
        }
      >
        {items.map((item, index) => (
          <CarouselSlide
            key={item.key}
            item={item}
            index={index}
            layout={layout}
            itemWidth={itemWidth}
            gap={gap}
            snapInterval={snapInterval}
            scrollX={scrollX}
            aspectRatio={aspectRatio}
            onPress={() => handleItemPress(item, index)}
          />
        ))}
      </Animated.ScrollView>

      {/* Prev / next arrows (default on web) */}
      {showArrows && items.length > 1 && (
        <>
          <Pressable
            onPress={goPrev}
            disabled={!canGoPrev}
            accessibilityRole="button"
            accessibilityLabel="Previous slide"
            style={(state) => {
              const { pressed, hovered } = state as { pressed: boolean; hovered?: boolean };
              return [
                styles.arrow,
                styles.arrowLeft,
                {
                  backgroundColor: pressed
                    ? theme.colors.primary
                    : hovered
                      ? theme.colors.surface
                      : withAlpha(theme.colors.surface, 0.92),
                  opacity: canGoPrev ? 1 : 0.35,
                  borderColor: theme.colors.outlineVariant,
                },
              ];
            }}
          >
            {prevIcon ?? <Chevron direction="left" color={theme.colors.onSurface} />}
          </Pressable>
          <Pressable
            onPress={goNext}
            disabled={!canGoNext}
            accessibilityRole="button"
            accessibilityLabel="Next slide"
            style={(state) => {
              const { pressed, hovered } = state as { pressed: boolean; hovered?: boolean };
              return [
                styles.arrow,
                styles.arrowRight,
                {
                  backgroundColor: pressed
                    ? theme.colors.primary
                    : hovered
                      ? theme.colors.surface
                      : withAlpha(theme.colors.surface, 0.92),
                  opacity: canGoNext ? 1 : 0.35,
                  borderColor: theme.colors.outlineVariant,
                },
              ];
            }}
          >
            {nextIcon ?? <Chevron direction="right" color={theme.colors.onSurface} />}
          </Pressable>
        </>
      )}

      {/* Pagination dots */}
      {showIndicators && items.length > 1 && (
        <View
          style={[
            styles.indicatorContainer,
            indicatorPosition === 'inside' && styles.indicatorInside,
          ]}
          accessibilityRole="tablist"
        >
          {items.map((_, index) => (
            <IndicatorDot
              key={index}
              active={index === currentIndex}
              onPress={() => scrollToIndex(index)}
              index={index}
              total={items.length}
            />
          ))}
        </View>
      )}
    </View>
  );
};

CarouselImpl.displayName = 'Carousel';

export const Carousel = memo(CarouselImpl);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // `stretch` overrides any parent `alignItems: center` so the carousel
    // always fills the parent's cross-axis width (important inside flex
    // containers like the docs site's CodePlayground preview).
    alignSelf: 'stretch',
    position: 'relative',
  },
  scrollContent: {
    alignItems: 'center',
  },
  itemContainer: {},
  // `width: 100%` stretches the inner views to fill the slide's allocated
  // `itemWidth`. We deliberately omit `flex: 1` — that would force a height
  // and cause the infinite-height bug we hit before. Slides get their height
  // from the consumer's content (e.g. `<View style={{ height: 200 }}>`).
  itemPressable: {
    width: '100%',
    overflow: 'hidden',
  },
  itemContent: {
    width: '100%',
    overflow: 'hidden',
  },
  labelContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  labelGradient: {
    padding: 16,
    paddingTop: 32,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  arrow: {
    position: 'absolute',
    // Vertically centered via top: 50% + marginTop: -22 (classic CSS pattern).
    // Works as long as parent height resolves; we removed the aspectRatio that
    // was forcing the parent to expand uncontrollably.
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 5,
  },
  arrowLeft: { left: 8 },
  arrowRight: { right: 8 },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  indicatorInside: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    paddingVertical: 0,
  },
  indicatorDot: {
    height: 8,
    borderRadius: 4,
  },
});

export default Carousel;
