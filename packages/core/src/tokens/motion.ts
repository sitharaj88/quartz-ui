/**
 * Quartz UI - Animation & Motion Tokens
 * 
 * Motion system for smooth animations
 */

// Easing curves
export const easing = {
  // Standard easing - for elements changing state
  standard: [0.2, 0, 0, 1] as const,
  standardAccelerate: [0.3, 0, 1, 1] as const,
  standardDecelerate: [0, 0, 0, 1] as const,
  
  // Emphasized easing - for large or expressive elements
  emphasized: [0.2, 0, 0, 1] as const,
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as const,
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as const,
  
  // Legacy (Bezier string format for some animation libraries)
  legacy: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  },
} as const;

// Duration tokens (in milliseconds)
export const duration = {
  // Short durations - for simple, small elements
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  
  // Medium durations - for more complex elements
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  
  // Long durations - for large or complex animations
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  
  // Extra long - for page transitions or complex sequences
  extraLong1: 700,
  extraLong2: 800,
  extraLong3: 900,
  extraLong4: 1000,
} as const;

export type DurationToken = keyof typeof duration;

// Common animation configurations
export const animationConfig = {
  // Fade animations
  fadeIn: {
    duration: duration.short4,
    easing: easing.standardDecelerate,
  },
  fadeOut: {
    duration: duration.short3,
    easing: easing.standardAccelerate,
  },
  
  // Scale animations
  scaleIn: {
    duration: duration.medium2,
    easing: easing.emphasizedDecelerate,
  },
  scaleOut: {
    duration: duration.short4,
    easing: easing.emphasizedAccelerate,
  },
  
  // Slide animations
  slideIn: {
    duration: duration.medium3,
    easing: easing.emphasizedDecelerate,
  },
  slideOut: {
    duration: duration.medium1,
    easing: easing.emphasizedAccelerate,
  },
  
  // State change animations
  stateChange: {
    duration: duration.short3,
    easing: easing.standard,
  },
  
  // Container transform (shared element transitions)
  containerTransform: {
    duration: duration.medium4,
    easing: easing.emphasized,
  },
  
  // Page transitions
  pageEnter: {
    duration: duration.medium4,
    easing: easing.emphasizedDecelerate,
  },
  pageExit: {
    duration: duration.medium1,
    easing: easing.emphasizedAccelerate,
  },
} as const;

// Spring configurations for react-native-reanimated
export const springConfig = {
  // Gentle spring
  gentle: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
  
  // Wobbly spring
  wobbly: {
    damping: 10,
    stiffness: 180,
    mass: 1,
  },
  
  // Stiff spring
  stiff: {
    damping: 30,
    stiffness: 300,
    mass: 1,
  },
  
  // Slow spring
  slow: {
    damping: 20,
    stiffness: 80,
    mass: 1,
  },
  
  // Default interactive spring
  interactive: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
} as const;

export type SpringConfigToken = keyof typeof springConfig;

// Reduced motion support
export const reducedMotion = {
  duration: duration.short1,
  shouldAnimate: false,
} as const;
