/**
 * Quartz UI - Skeleton Component
 * 
 * Loading placeholder component with:
 * - Shimmer animation effect
 * - Shape presets: text, circular, rectangular, rounded
 * - Customizable dimensions
 * - Animation speed control
 */

import React, { forwardRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';
import {
    SkeletonProps,
    SkeletonTextProps,
    SkeletonAvatarProps,
    SkeletonShape,
} from './Skeleton.types';

// Shimmer gradient width ratio
const SHIMMER_WIDTH_RATIO = 0.5;

/**
 * Get border radius for shape
 */
function getShapeBorderRadius(
    shape: SkeletonShape,
    width: number | string | undefined,
    height: number | string | undefined
): number {
    switch (shape) {
        case 'circular':
            return 1000; // Large enough to be circular
        case 'rounded':
            return 8;
        case 'text':
            return 4;
        case 'rectangular':
        default:
            return 0;
    }
}

/**
 * Skeleton Component
 */
export const Skeleton = forwardRef<View, SkeletonProps>(function Skeleton(
    {
        width = '100%',
        height = 16,
        borderRadius,
        shape = 'rectangular',
        animated = true,
        duration = 1500,
        style,
        testID,
    },
    ref
) {
    const theme = useTheme();
    const [containerWidth, setContainerWidth] = React.useState(0);

    // Animation value
    const translateX = useSharedValue(-1);

    // Start shimmer animation
    useEffect(() => {
        if (animated && containerWidth > 0) {
            translateX.value = withRepeat(
                withTiming(1, {
                    duration,
                    easing: Easing.inOut(Easing.ease),
                }),
                -1, // Infinite repeat
                false // Don't reverse
            );
        }
    }, [animated, containerWidth, duration, translateX]);

    // Handle layout to get width
    const handleLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    // Computed border radius
    const computedBorderRadius = borderRadius ?? getShapeBorderRadius(shape, width, height);

    // Shimmer animated style
    const shimmerStyle = useAnimatedStyle(() => {
        const shimmerWidth = containerWidth * SHIMMER_WIDTH_RATIO;
        const translateValue = interpolate(
            translateX.value,
            [-1, 1],
            [-shimmerWidth, containerWidth + shimmerWidth]
        );

        return {
            transform: [{ translateX: translateValue }],
        };
    });

    // Container style
    const containerStyle: ViewStyle = {
        width: width as ViewStyle['width'],
        height: height as ViewStyle['height'],
        borderRadius: computedBorderRadius,
        backgroundColor: theme.colors.surfaceContainerHigh,
        overflow: 'hidden',
    };

    // Shimmer highlight style
    const highlightColor = theme.colors.surfaceContainerHighest;

    return (
        <View
            ref={ref}
            style={[containerStyle, style]}
            onLayout={handleLayout}
            testID={testID}
            accessible={true}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading"
        >
            {animated && containerWidth > 0 && (
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            width: containerWidth * SHIMMER_WIDTH_RATIO,
                            backgroundColor: highlightColor,
                            opacity: 0.6,
                        },
                        shimmerStyle,
                    ]}
                />
            )}
        </View>
    );
});

/**
 * Skeleton Text Component
 * Multiple lines with configurable gaps
 */
export const SkeletonText = forwardRef<View, SkeletonTextProps>(function SkeletonText(
    {
        lines = 3,
        lineHeight = 16,
        gap = 8,
        lastLineWidth = '70%',
        style,
        duration = 1500,
        testID,
    },
    ref
) {
    const lineElements = useMemo(() => {
        return Array.from({ length: lines }, (_, index) => {
            const isLastLine = index === lines - 1;
            return (
                <Skeleton
                    key={index}
                    width={isLastLine ? lastLineWidth : '100%'}
                    height={lineHeight}
                    shape="text"
                    duration={duration + index * 100} // Slight delay for each line
                    style={index > 0 ? { marginTop: gap } : undefined}
                />
            );
        });
    }, [lines, lineHeight, gap, lastLineWidth, duration]);

    return (
        <View ref={ref} style={style} testID={testID}>
            {lineElements}
        </View>
    );
});

/**
 * Skeleton Avatar Component
 * Circular or rounded avatar placeholder
 */
export const SkeletonAvatar = forwardRef<View, SkeletonAvatarProps>(function SkeletonAvatar(
    {
        size = 40,
        shape = 'circular',
        style,
        duration = 1500,
        testID,
    },
    ref
) {
    return (
        <Skeleton
            ref={ref}
            width={size}
            height={size}
            shape={shape}
            duration={duration}
            style={style}
            testID={testID}
        />
    );
});

/**
 * Skeleton Card Component
 * Common card loading pattern
 */
export const SkeletonCard = forwardRef<View, { style?: ViewStyle; testID?: string }>(
    function SkeletonCard({ style, testID }, ref) {
        const theme = useTheme();

        return (
            <View
                ref={ref}
                style={[
                    {
                        padding: 16,
                        backgroundColor: theme.colors.surface,
                        borderRadius: 12,
                        gap: 12,
                    },
                    style,
                ]}
                testID={testID}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <SkeletonAvatar size={48} />
                    <View style={{ flex: 1, gap: 8 }}>
                        <Skeleton width="60%" height={16} shape="text" />
                        <Skeleton width="40%" height={12} shape="text" />
                    </View>
                </View>
                <SkeletonText lines={3} />
                <Skeleton width="100%" height={200} shape="rounded" />
            </View>
        );
    }
);

export default Skeleton;
