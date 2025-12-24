/**
 * Quartz UI - AnimatedView Component Types
 */

import { ViewStyle } from 'react-native';

export type AnimationPreset =
    | 'fadeIn'
    | 'fadeInUp'
    | 'fadeInDown'
    | 'fadeInLeft'
    | 'fadeInRight'
    | 'scaleIn'
    | 'slideInUp'
    | 'slideInDown'
    | 'slideInLeft'
    | 'slideInRight'
    | 'zoomIn'
    | 'bounceIn'
    | 'flipInX'
    | 'flipInY';

export type AnimationEasing =
    | 'spring'
    | 'ease'
    | 'easeIn'
    | 'easeOut'
    | 'easeInOut'
    | 'linear'
    | 'bounce';

export interface AnimatedViewProps {
    /** Animation preset to use */
    animation?: AnimationPreset;
    /** Animation delay in milliseconds */
    delay?: number;
    /** Animation duration in milliseconds */
    duration?: number;
    /** Easing function */
    easing?: AnimationEasing;
    /** Whether animation should play */
    animate?: boolean;
    /** Whether to animate on mount */
    animateOnMount?: boolean;
    /** Custom style */
    style?: ViewStyle;
    /** Children */
    children: React.ReactNode;
    /** Test ID */
    testID?: string;
    /** Callback when animation completes */
    onAnimationComplete?: () => void;
}

export interface StaggerProps {
    /** Delay between each child animation in milliseconds */
    staggerDelay?: number;
    /** Base animation preset */
    animation?: AnimationPreset;
    /** Animation duration */
    duration?: number;
    /** Easing function */
    easing?: AnimationEasing;
    /** Custom style */
    style?: ViewStyle;
    /** Children */
    children: React.ReactNode;
    /** Test ID */
    testID?: string;
}

// Animation presets configuration
export interface AnimationConfig {
    from: {
        opacity?: number;
        translateX?: number;
        translateY?: number;
        scale?: number;
        rotateX?: string;
        rotateY?: string;
    };
    to: {
        opacity?: number;
        translateX?: number;
        translateY?: number;
        scale?: number;
        rotateX?: string;
        rotateY?: string;
    };
}

export const animationPresets: Record<AnimationPreset, AnimationConfig> = {
    fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
    },
    fadeInUp: {
        from: { opacity: 0, translateY: 20 },
        to: { opacity: 1, translateY: 0 },
    },
    fadeInDown: {
        from: { opacity: 0, translateY: -20 },
        to: { opacity: 1, translateY: 0 },
    },
    fadeInLeft: {
        from: { opacity: 0, translateX: -20 },
        to: { opacity: 1, translateX: 0 },
    },
    fadeInRight: {
        from: { opacity: 0, translateX: 20 },
        to: { opacity: 1, translateX: 0 },
    },
    scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
    },
    slideInUp: {
        from: { translateY: 100 },
        to: { translateY: 0 },
    },
    slideInDown: {
        from: { translateY: -100 },
        to: { translateY: 0 },
    },
    slideInLeft: {
        from: { translateX: -100 },
        to: { translateX: 0 },
    },
    slideInRight: {
        from: { translateX: 100 },
        to: { translateX: 0 },
    },
    zoomIn: {
        from: { opacity: 0, scale: 0 },
        to: { opacity: 1, scale: 1 },
    },
    bounceIn: {
        from: { opacity: 0, scale: 0.3 },
        to: { opacity: 1, scale: 1 },
    },
    flipInX: {
        from: { opacity: 0, rotateX: '90deg' },
        to: { opacity: 1, rotateX: '0deg' },
    },
    flipInY: {
        from: { opacity: 0, rotateY: '90deg' },
        to: { opacity: 1, rotateY: '0deg' },
    },
};
