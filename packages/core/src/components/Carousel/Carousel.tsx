/**
 * Quartz UI - Carousel Component
 * 
 * Carousel for browsing through a collection of content
 * 
 * Carousel layouts:
 * - Hero: Large centered item with smaller side items
 * - Center-aligned: Centered items with visible adjacent items
 * - Multi-browse: Multiple items visible at once
 * - Uncontained: Items extend to screen edges
 */

import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ViewStyle,
  StyleProp,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { springConfig } from '../../tokens/motion';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  /** Whether to loop */
  loop?: boolean;
  /** Item width (for multi-browse) */
  itemWidth?: number;
  /** Gap between items */
  gap?: number;
  /** Show page indicators */
  showIndicators?: boolean;
  /** Indicator position */
  indicatorPosition?: 'inside' | 'outside';
  /** Current index change callback */
  onIndexChange?: (index: number) => void;
  /** Item press callback */
  onItemPress?: (item: CarouselItem, index: number) => void;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

/**
 * Carousel Indicator Dot
 */
function IndicatorDot({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const scale = useSharedValue(active ? 1 : 0.6);
  const opacity = useSharedValue(active ? 1 : 0.4);

  useEffect(() => {
    scale.value = withSpring(active ? 1 : 0.6, springConfig.gentle);
    opacity.value = withSpring(active ? 1 : 0.4, springConfig.gentle);
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Animated.View
        style={[
          styles.indicatorDot,
          { backgroundColor: theme.colors.primary },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
}

/**
 * Carousel Component
 */
export function Carousel({
  items,
  layout = 'hero',
  autoPlayInterval = 0,
  loop = false,
  itemWidth: customItemWidth,
  gap = 8,
  showIndicators = true,
  indicatorPosition = 'outside',
  onIndexChange,
  onItemPress,
  style,
  testID,
}: CarouselProps): React.ReactElement {
  const theme = useTheme();
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // Calculate item dimensions based on layout
  const getItemDimensions = () => {
    switch (layout) {
      case 'hero':
        return {
          itemWidth: SCREEN_WIDTH * 0.85,
          peekWidth: SCREEN_WIDTH * 0.075,
        };
      case 'center':
        return {
          itemWidth: SCREEN_WIDTH * 0.7,
          peekWidth: SCREEN_WIDTH * 0.15,
        };
      case 'multi-browse':
        return {
          itemWidth: customItemWidth || SCREEN_WIDTH * 0.4,
          peekWidth: 0,
        };
      case 'uncontained':
        return {
          itemWidth: SCREEN_WIDTH - 32,
          peekWidth: 16,
        };
      default:
        return {
          itemWidth: SCREEN_WIDTH * 0.85,
          peekWidth: SCREEN_WIDTH * 0.075,
        };
    }
  };

  const { itemWidth, peekWidth } = getItemDimensions();
  const snapInterval = itemWidth + gap;

  // Update current index from scroll position
  const updateCurrentIndex = useCallback((index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      onIndexChange?.(index);
      
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    }
  }, [currentIndex, onIndexChange]);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / snapInterval);
      runOnJS(updateCurrentIndex)(Math.max(0, Math.min(index, items.length - 1)));
    },
  });

  // Auto-play logic
  useEffect(() => {
    if (autoPlayInterval > 0) {
      autoPlayTimer.current = setInterval(() => {
        const nextIndex = loop 
          ? (currentIndex + 1) % items.length 
          : Math.min(currentIndex + 1, items.length - 1);
        
        scrollToIndex(nextIndex);
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [autoPlayInterval, currentIndex, items.length, loop]);

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * snapInterval,
      animated: true,
    });
  };

  // Handle item press
  const handleItemPress = (item: CarouselItem, index: number) => {
    if (index !== currentIndex) {
      scrollToIndex(index);
    }
    onItemPress?.(item, index);
  };

  // Get item scale based on scroll position
  const getItemAnimatedStyle = (index: number) => {
    const inputRange = [
      (index - 1) * snapInterval,
      index * snapInterval,
      (index + 1) * snapInterval,
    ];

    return useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value,
        inputRange,
        layout === 'hero' ? [0.9, 1, 0.9] : [0.95, 1, 0.95],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.6, 1, 0.6],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity: layout === 'multi-browse' ? 1 : opacity,
      };
    });
  };

  // Render carousel item
  const renderItem = (item: CarouselItem, index: number) => {
    const animatedStyle = getItemAnimatedStyle(index);

    return (
      <Animated.View
        key={item.key}
        style={[
          styles.itemContainer,
          {
            width: itemWidth,
            marginHorizontal: gap / 2,
          },
          animatedStyle,
        ]}
      >
        <Pressable
          onPress={() => handleItemPress(item, index)}
          style={styles.itemPressable}
          accessible
          accessibilityLabel={item.accessibilityLabel || item.label}
          accessibilityRole="button"
        >
          <View style={[styles.itemContent, { borderRadius: 28 }]}>
            {item.content}
          </View>
          
          {/* Label overlay */}
          {(item.label || item.supportingText) && (
            <View style={[styles.labelContainer, { borderRadius: 28 }]}>
              <View style={styles.labelGradient}>
                {item.label && (
                  <Text 
                    variant="titleMedium" 
                    style={{ color: '#FFFFFF' }}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                )}
                {item.supportingText && (
                  <Text 
                    variant="bodySmall" 
                    style={{ color: 'rgba(255,255,255,0.8)' }}
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
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: layout === 'uncontained' ? 16 : peekWidth,
          },
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {items.map(renderItem)}
      </Animated.ScrollView>

      {/* Page Indicators */}
      {showIndicators && items.length > 1 && (
        <View
          style={[
            styles.indicatorContainer,
            indicatorPosition === 'inside' && styles.indicatorInside,
          ]}
        >
          {items.map((_, index) => (
            <IndicatorDot
              key={index}
              active={index === currentIndex}
              onPress={() => scrollToIndex(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
  },
  itemContainer: {
    aspectRatio: 16 / 10,
  },
  itemPressable: {
    flex: 1,
    overflow: 'hidden',
  },
  itemContent: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  labelContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  labelGradient: {
    padding: 16,
    paddingTop: 32,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
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
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default Carousel;
