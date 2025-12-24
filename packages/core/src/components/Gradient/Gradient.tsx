/**
 * Quartz UI - Gradient Component
 * 
 * Gradient background component with:
 * - Linear gradient support
 * - Preset gradient themes
 * - Direction control
 * - Background or overlay modes
 * 
 * Note: Requires expo-linear-gradient as a peer dependency
 */

import React, { forwardRef, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import {
    GradientProps,
    GradientDirection,
    directionMap,
    gradientPresets,
} from './Gradient.types';

// Attempt to import expo-linear-gradient
let LinearGradientComponent: any = null;
try {
    // Dynamic import for optional dependency
    LinearGradientComponent = require('expo-linear-gradient').LinearGradient;
} catch (e) {
    // expo-linear-gradient not available
}

/**
 * Gradient Component
 */
export const Gradient = forwardRef<View, GradientProps>(function Gradient(
    {
        colors,
        preset,
        direction = 'vertical',
        locations,
        start,
        end,
        style,
        children,
        testID,
    },
    ref
) {
    const theme = useTheme();

    // Get gradient colors
    const gradientColors = useMemo(() => {
        if (colors && colors.length >= 2) {
            return colors;
        }
        if (preset && gradientPresets[preset]) {
            return gradientPresets[preset];
        }
        // Default to theme primary colors
        return [theme.colors.primary, theme.colors.primaryContainer];
    }, [colors, preset, theme.colors.primary, theme.colors.primaryContainer]);

    // Get start/end points
    const { start: dirStart, end: dirEnd } = directionMap[direction];
    const startPoint = start ?? dirStart;
    const endPoint = end ?? dirEnd;

    // If expo-linear-gradient is not available, use fallback
    if (!LinearGradientComponent) {
        return (
            <View
                ref={ref}
                style={StyleSheet.flatten([
                    {
                        backgroundColor: gradientColors[0],
                    },
                    style,
                ])}
                testID={testID}
            >
                {children}
            </View>
        );
    }

    return (
        <LinearGradientComponent
            ref={ref}
            colors={gradientColors}
            locations={locations}
            start={startPoint}
            end={endPoint}
            style={style}
            testID={testID}
        >
            {children}
        </LinearGradientComponent>
    );
});

/**
 * GradientCard Component
 * A card with gradient background
 */
export const GradientCard = forwardRef<View, GradientProps & { borderRadius?: number }>(
    function GradientCard(
        {
            colors,
            preset = 'purple',
            direction = 'diagonal',
            borderRadius = 16,
            style,
            children,
            testID,
            ...props
        },
        ref
    ) {
        const mergedStyle = StyleSheet.flatten([
            {
                borderRadius,
                padding: 16,
                overflow: 'hidden' as const,
            },
            style,
        ]);

        return (
            <Gradient
                ref={ref}
                colors={colors}
                preset={preset}
                direction={direction}
                style={mergedStyle}
                testID={testID}
                {...props}
            >
                {children}
            </Gradient>
        );
    }
);

/**
 * GradientButton Component
 * A button with gradient background
 */
export const GradientButton = forwardRef<View, GradientProps & {
    onPress?: () => void;
    label?: string;
    borderRadius?: number;
}>(
    function GradientButton(
        {
            colors,
            preset = 'primary',
            direction = 'horizontal',
            onPress,
            label,
            borderRadius = 24,
            style,
            children,
            testID,
            ...props
        },
        ref
    ) {
        const mergedStyle = StyleSheet.flatten([
            {
                borderRadius,
                paddingVertical: 12,
                paddingHorizontal: 24,
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
            },
            style,
        ]);

        return (
            <Pressable onPress={onPress}>
                <Gradient
                    ref={ref}
                    colors={colors}
                    preset={preset}
                    direction={direction}
                    style={mergedStyle}
                    testID={testID}
                    {...props}
                >
                    {label ? (
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: 16,
                                fontWeight: '600',
                            }}
                        >
                            {label}
                        </Text>
                    ) : (
                        children
                    )}
                </Gradient>
            </Pressable>
        );
    }
);

/**
 * GradientBorder Component
 * A component with gradient border
 */
export const GradientBorder = forwardRef<View, GradientProps & {
    borderWidth?: number;
    borderRadius?: number;
    backgroundColor?: string;
}>(
    function GradientBorder(
        {
            colors,
            preset = 'purple',
            direction = 'diagonal',
            borderWidth = 2,
            borderRadius = 16,
            backgroundColor,
            style,
            children,
            testID,
            ...props
        },
        ref
    ) {
        const theme = useTheme();
        const bgColor = backgroundColor ?? theme.colors.surface;

        const mergedStyle = StyleSheet.flatten([
            {
                borderRadius,
                padding: borderWidth,
            },
            style,
        ]);

        return (
            <Gradient
                ref={ref}
                colors={colors}
                preset={preset}
                direction={direction}
                style={mergedStyle}
                testID={testID}
                {...props}
            >
                <View
                    style={{
                        backgroundColor: bgColor,
                        borderRadius: borderRadius - borderWidth,
                        flex: 1,
                    }}
                >
                    {children}
                </View>
            </Gradient>
        );
    }
);

export default Gradient;
