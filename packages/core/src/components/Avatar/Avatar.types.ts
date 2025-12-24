/**
 * Quartz UI - Avatar Component Types
 */

import { ImageSourcePropType, ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'circular' | 'rounded' | 'square';

export interface AvatarProps {
    /** Image source for the avatar */
    source?: ImageSourcePropType;
    /** Text initials to display when no image */
    initials?: string;
    /** Icon element to display when no image or initials */
    icon?: React.ReactNode;
    /** Size of the avatar */
    size?: AvatarSize;
    /** Shape variant */
    variant?: AvatarVariant;
    /** Background color for initials/icon */
    backgroundColor?: string;
    /** Text color for initials */
    color?: string;
    /** Whether to show loading skeleton */
    loading?: boolean;
    /** Custom style for the container */
    style?: ViewStyle;
    /** Custom style for the image */
    imageStyle?: ImageStyle;
    /** Custom style for the initials text */
    textStyle?: TextStyle;
    /** Accessibility label */
    accessibilityLabel?: string;
    /** Test ID */
    testID?: string;
    /** Called when image fails to load */
    onError?: () => void;
    /** Called when image loads successfully */
    onLoad?: () => void;
}

export interface AvatarBadgeProps {
    /** Badge content */
    children?: React.ReactNode;
    /** Badge position */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    /** Badge size */
    size?: number;
    /** Badge background color */
    backgroundColor?: string;
    /** Badge border color */
    borderColor?: string;
    /** Badge border width */
    borderWidth?: number;
    /** Custom style */
    style?: ViewStyle;
}

export interface AvatarGroupProps {
    /** Maximum number of avatars to display */
    max?: number;
    /** Overlap spacing (negative value) */
    spacing?: number;
    /** Size of avatars */
    size?: AvatarSize;
    /** Custom style */
    style?: ViewStyle;
    /** Children avatars */
    children: React.ReactNode;
}

// Size configuration
export const avatarSizes: Record<AvatarSize, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
};

export const avatarFontSizes: Record<AvatarSize, number> = {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 22,
    xl: 32,
};
