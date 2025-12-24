/**
 * Quartz UI - Skeleton Component Types
 */

import { ViewStyle } from 'react-native';

export type SkeletonShape = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface SkeletonProps {
    /** Width of the skeleton */
    width?: number | string;
    /** Height of the skeleton */
    height?: number | string;
    /** Border radius (or use shape preset) */
    borderRadius?: number;
    /** Shape preset */
    shape?: SkeletonShape;
    /** Whether animation is enabled */
    animated?: boolean;
    /** Animation duration in milliseconds */
    duration?: number;
    /** Custom style */
    style?: ViewStyle;
    /** Test ID */
    testID?: string;
}

export interface SkeletonTextProps {
    /** Number of lines */
    lines?: number;
    /** Line height */
    lineHeight?: number;
    /** Gap between lines */
    gap?: number;
    /** Whether the last line should be shorter */
    lastLineWidth?: number | string;
    /** Custom style */
    style?: ViewStyle;
    /** Animation duration */
    duration?: number;
    /** Test ID */
    testID?: string;
}

export interface SkeletonAvatarProps {
    /** Size of the avatar skeleton */
    size?: number;
    /** Whether it's circular or rounded */
    shape?: 'circular' | 'rounded';
    /** Custom style */
    style?: ViewStyle;
    /** Animation duration */
    duration?: number;
    /** Test ID */
    testID?: string;
}
