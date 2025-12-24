/**
 * Quartz UI - AnimatedView Component
 * 
 * Animation wrapper component with:
 * - Entry animations: fadeIn, slideIn, scaleIn, etc.
 * - Animation presets with spring and timing configs
 * - Stagger children animations
 * - Delay and duration controls
 */

import React, { forwardRef, useEffect, Children, isValidElement, cloneElement } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import {
    AnimatedViewProps,
    StaggerProps,
    AnimationPreset,
    AnimationEasing,
    animationPresets,
} from './AnimatedView.types';

// Easing functions
const easingFunctions = {
    spring: null, // Use withSpring instead
    ease: Easing.ease,
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),
    linear: Easing.linear,
    bounce: Easing.bounce,
};

// Spring configuration
const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 1,
};

/**
 * AnimatedView Component
 */
export const AnimatedView = forwardRef<View, AnimatedViewProps>(function AnimatedView(
    {
        animation = 'fadeIn',
        delay = 0,
        duration = 300,
        easing = 'spring',
        animate = true,
        animateOnMount = true,
        style,
        children,
        testID,
        onAnimationComplete,
    },
    ref
) {
    // Get animation preset
    const preset = animationPresets[animation];

    // Shared values for animation
    const progress = useSharedValue(animateOnMount ? 0 : 1);

    // Start animation on mount
    useEffect(() => {
        if (animate && animateOnMount) {
            const animationFn = easing === 'spring'
                ? withSpring(1, springConfig, (finished) => {
                    if (finished && onAnimationComplete) {
                        runOnJS(onAnimationComplete)();
                    }
                })
                : withTiming(1, {
                    duration,
                    easing: easingFunctions[easing] || Easing.ease,
                }, (finished) => {
                    if (finished && onAnimationComplete) {
                        runOnJS(onAnimationComplete)();
                    }
                });

            progress.value = delay > 0
                ? withDelay(delay, animationFn)
                : animationFn;
        }
    }, [animate, animateOnMount, delay, duration, easing, onAnimationComplete, progress]);

    // Animated style
    const animatedStyle = useAnimatedStyle(() => {
        const from = preset.from;
        const to = preset.to;

        // Interpolate values
        const opacity = from.opacity !== undefined && to.opacity !== undefined
            ? from.opacity + (to.opacity - from.opacity) * progress.value
            : 1;

        const translateX = from.translateX !== undefined && to.translateX !== undefined
            ? from.translateX + (to.translateX - from.translateX) * progress.value
            : 0;

        const translateY = from.translateY !== undefined && to.translateY !== undefined
            ? from.translateY + (to.translateY - from.translateY) * progress.value
            : 0;

        const scale = from.scale !== undefined && to.scale !== undefined
            ? from.scale + (to.scale - from.scale) * progress.value
            : 1;

        return {
            opacity,
            transform: [
                { translateX },
                { translateY },
                { scale },
            ],
        };
    });

    return (
        <Animated.View
            ref={ref}
            style={[animatedStyle, style]}
            testID={testID}
        >
            {children}
        </Animated.View>
    );
});

/**
 * Stagger Component
 * Animates children with staggered delays
 */
export const Stagger = forwardRef<View, StaggerProps>(function Stagger(
    {
        staggerDelay = 50,
        animation = 'fadeInUp',
        duration = 300,
        easing = 'spring',
        style,
        children,
        testID,
    },
    ref
) {
    // Process children with staggered delays
    const staggeredChildren = Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        return (
            <AnimatedView
                key={index}
                animation={animation}
                delay={index * staggerDelay}
                duration={duration}
                easing={easing}
            >
                {child}
            </AnimatedView>
        );
    });

    return (
        <View ref={ref} style={style} testID={testID}>
            {staggeredChildren}
        </View>
    );
});

/**
 * Utility hook for custom animations
 */
export function useAnimatedValue(initialValue: number = 0) {
    const value = useSharedValue(initialValue);

    const animate = (
        toValue: number,
        options?: {
            duration?: number;
            easing?: AnimationEasing;
            delay?: number;
        }
    ) => {
        const { duration = 300, easing = 'spring', delay = 0 } = options || {};

        const animationFn = easing === 'spring'
            ? withSpring(toValue, springConfig)
            : withTiming(toValue, {
                duration,
                easing: easingFunctions[easing] || Easing.ease,
            });

        value.value = delay > 0
            ? withDelay(delay, animationFn)
            : animationFn;
    };

    return { value, animate };
}

/**
 * Preset animation components for convenience
 */
export const FadeIn = forwardRef<View, Omit<AnimatedViewProps, 'animation'>>((props, ref) => (
    <AnimatedView ref={ref} animation="fadeIn" {...props} />
));

export const FadeInUp = forwardRef<View, Omit<AnimatedViewProps, 'animation'>>((props, ref) => (
    <AnimatedView ref={ref} animation="fadeInUp" {...props} />
));

export const FadeInDown = forwardRef<View, Omit<AnimatedViewProps, 'animation'>>((props, ref) => (
    <AnimatedView ref={ref} animation="fadeInDown" {...props} />
));

export const ScaleIn = forwardRef<View, Omit<AnimatedViewProps, 'animation'>>((props, ref) => (
    <AnimatedView ref={ref} animation="scaleIn" {...props} />
));

export const SlideInUp = forwardRef<View, Omit<AnimatedViewProps, 'animation'>>((props, ref) => (
    <AnimatedView ref={ref} animation="slideInUp" {...props} />
));

export const SlideInDown = forwardRef<View, Omit<AnimatedViewProps, 'animation'>>((props, ref) => (
    <AnimatedView ref={ref} animation="slideInDown" {...props} />
));

export const ZoomIn = forwardRef<View, Omit<AnimatedViewProps, 'animation'>>((props, ref) => (
    <AnimatedView ref={ref} animation="zoomIn" {...props} />
));

export const BounceIn = forwardRef<View, Omit<AnimatedViewProps, 'animation'>>((props, ref) => (
    <AnimatedView ref={ref} animation="bounceIn" {...props} />
));

export default AnimatedView;
