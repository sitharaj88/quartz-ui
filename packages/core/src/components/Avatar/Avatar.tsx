/**
 * Quartz UI - Avatar Component
 * 
 * Modern avatar component with:
 * - Image, initials, or icon display
 * - Multiple sizes: xs, sm, md, lg, xl
 * - Shape variants: circular, rounded, square
 * - Badge support for status indicators
 * - Fallback handling
 * - Group stacking with overlap
 */

import React, { forwardRef, useState, useMemo, Children, isValidElement, cloneElement } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    ViewStyle,
    Animated,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import {
    AvatarProps,
    AvatarBadgeProps,
    AvatarGroupProps,
    AvatarSize,
    avatarSizes,
    avatarFontSizes,
} from './Avatar.types';

/**
 * Avatar Component
 */
export const Avatar = forwardRef<View, AvatarProps>(function Avatar(
    {
        source,
        initials,
        icon,
        size = 'md',
        variant = 'circular',
        backgroundColor,
        color,
        loading = false,
        style,
        imageStyle,
        textStyle,
        accessibilityLabel,
        testID,
        onError,
        onLoad,
    },
    ref
) {
    const theme = useTheme();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(!!source);

    // Get size value
    const sizeValue = avatarSizes[size];
    const fontSize = avatarFontSizes[size];

    // Compute border radius based on variant
    const borderRadius = useMemo(() => {
        switch (variant) {
            case 'circular':
                return sizeValue / 2;
            case 'rounded':
                return sizeValue / 4;
            case 'square':
                return 0;
            default:
                return sizeValue / 2;
        }
    }, [variant, sizeValue]);

    // Compute background color
    const bgColor = backgroundColor ?? theme.colors.primaryContainer;
    const textColor = color ?? theme.colors.onPrimaryContainer;

    // Handle image error
    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
        onError?.();
    };

    // Handle image load
    const handleImageLoad = () => {
        setImageLoading(false);
        onLoad?.();
    };

    // Extract initials from string (up to 2 characters)
    const displayInitials = useMemo(() => {
        if (!initials) return '';
        const parts = initials.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }, [initials]);

    // Show image only if source is provided and no error occurred
    const showImage = source && !imageError;

    // Container style
    const containerStyle: ViewStyle = {
        width: sizeValue,
        height: sizeValue,
        borderRadius,
        backgroundColor: showImage ? 'transparent' : bgColor,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    };

    // Loading skeleton style
    const skeletonStyle: ViewStyle = {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.surfaceContainerHigh,
    };

    return (
        <View
            ref={ref}
            style={[containerStyle, style]}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={accessibilityLabel ?? initials}
            testID={testID}
        >
            {/* Loading skeleton */}
            {(loading || imageLoading) && (
                <Animated.View style={skeletonStyle} />
            )}

            {/* Image */}
            {showImage && (
                <Image
                    source={source}
                    style={[
                        {
                            width: sizeValue,
                            height: sizeValue,
                            borderRadius,
                        },
                        imageStyle,
                    ]}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    resizeMode="cover"
                />
            )}

            {/* Initials or Icon fallback */}
            {!showImage && !loading && (
                <>
                    {displayInitials ? (
                        <Text
                            style={[
                                {
                                    fontSize,
                                    fontWeight: '600',
                                    color: textColor,
                                },
                                textStyle,
                            ]}
                            numberOfLines={1}
                        >
                            {displayInitials}
                        </Text>
                    ) : icon ? (
                        <View>{icon}</View>
                    ) : (
                        // Default user icon placeholder
                        <View
                            style={{
                                width: sizeValue * 0.5,
                                height: sizeValue * 0.5,
                                borderRadius: sizeValue * 0.25,
                                backgroundColor: textColor,
                                opacity: 0.5,
                            }}
                        />
                    )}
                </>
            )}
        </View>
    );
});

/**
 * Avatar Badge Component
 */
export const AvatarBadge = forwardRef<View, AvatarBadgeProps>(function AvatarBadge(
    {
        children,
        position = 'bottom-right',
        size = 12,
        backgroundColor,
        borderColor,
        borderWidth = 2,
        style,
    },
    ref
) {
    const theme = useTheme();

    // Position styles
    const positionStyles: Record<string, ViewStyle> = {
        'top-right': { top: 0, right: 0 },
        'top-left': { top: 0, left: 0 },
        'bottom-right': { bottom: 0, right: 0 },
        'bottom-left': { bottom: 0, left: 0 },
    };

    return (
        <View
            ref={ref}
            style={[
                {
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: backgroundColor ?? theme.colors.primary,
                    borderWidth,
                    borderColor: borderColor ?? theme.colors.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                positionStyles[position],
                style,
            ]}
        >
            {children}
        </View>
    );
});

/**
 * Avatar Group Component
 */
export const AvatarGroup = forwardRef<View, AvatarGroupProps>(function AvatarGroup(
    {
        max = 4,
        spacing = -8,
        size = 'md',
        style,
        children,
    },
    ref
) {
    const theme = useTheme();
    const sizeValue = avatarSizes[size];

    // Process children
    const childArray = Children.toArray(children);
    const visibleChildren = childArray.slice(0, max);
    const hiddenCount = childArray.length - max;

    return (
        <View
            ref={ref}
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                },
                style,
            ]}
        >
            {visibleChildren.map((child, index) => {
                if (!isValidElement(child)) return null;

                return (
                    <View
                        key={index}
                        style={{
                            marginLeft: index === 0 ? 0 : spacing,
                            zIndex: visibleChildren.length - index,
                            borderWidth: 2,
                            borderColor: theme.colors.surface,
                            borderRadius: sizeValue / 2,
                        }}
                    >
                        {cloneElement(child as React.ReactElement<AvatarProps>, { size })}
                    </View>
                );
            })}

            {/* Overflow indicator */}
            {hiddenCount > 0 && (
                <View
                    style={{
                        marginLeft: spacing,
                        width: sizeValue,
                        height: sizeValue,
                        borderRadius: sizeValue / 2,
                        backgroundColor: theme.colors.surfaceContainerHigh,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: theme.colors.surface,
                    }}
                >
                    <Text
                        style={{
                            fontSize: avatarFontSizes[size],
                            fontWeight: '600',
                            color: theme.colors.onSurface,
                        }}
                    >
                        +{hiddenCount}
                    </Text>
                </View>
            )}
        </View>
    );
});

export default Avatar;
