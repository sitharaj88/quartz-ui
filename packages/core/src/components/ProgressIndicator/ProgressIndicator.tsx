/**
 * Quartz UI - Progress Indicator Component
 * 
 * Progress Indicators:
 * - Linear (determinate & indeterminate)
 * - Circular (determinate & indeterminate)
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';

const AnimatedView = Animated.createAnimatedComponent(View);

export interface ProgressIndicatorProps {
  /** Type of progress indicator */
  variant?: 'linear' | 'circular';
  /** Progress value (0-100) for determinate mode */
  progress?: number;
  /** Whether to show indeterminate animation */
  indeterminate?: boolean;
  /** Size (for circular) or height (for linear) */
  size?: 'small' | 'medium' | 'large' | number;
  /** Custom color */
  color?: string;
  /** Track color */
  trackColor?: string;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const LINEAR_SIZES = { small: 2, medium: 4, large: 6 };
const CIRCULAR_SIZES = { small: 24, medium: 40, large: 56 };
const STROKE_WIDTHS = { small: 2, medium: 3, large: 4 };

export function ProgressIndicator({
  variant = 'linear',
  progress = 0,
  indeterminate = false,
  size = 'medium',
  color,
  trackColor,
  style,
  testID,
}: ProgressIndicatorProps) {
  const theme = useTheme();
  const activeColor = color ?? theme.colors.primary;
  const track = trackColor ?? theme.colors.primaryContainer;
  
  if (variant === 'circular') {
    return (
      <CircularProgress
        progress={progress}
        indeterminate={indeterminate}
        size={size}
        color={activeColor}
        trackColor={track}
        style={style}
        testID={testID}
      />
    );
  }
  
  return (
    <LinearProgress
      progress={progress}
      indeterminate={indeterminate}
      size={size}
      color={activeColor}
      trackColor={track}
      style={style}
      testID={testID}
    />
  );
}

// Linear Progress
interface LinearProgressProps {
  progress: number;
  indeterminate: boolean;
  size: 'small' | 'medium' | 'large' | number;
  color: string;
  trackColor: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function LinearProgress({
  progress,
  indeterminate,
  size,
  color,
  trackColor,
  style,
  testID,
}: LinearProgressProps) {
  const height = typeof size === 'number' ? size : LINEAR_SIZES[size];
  const progressValue = useSharedValue(0);
  const indeterminatePosition = useSharedValue(0);
  
  useEffect(() => {
    if (indeterminate) {
      indeterminatePosition.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(indeterminatePosition);
      progressValue.value = withTiming(Math.min(100, Math.max(0, progress)) / 100, {
        duration: 300,
      });
    }
    
    return () => {
      cancelAnimation(indeterminatePosition);
    };
  }, [indeterminate, progress, progressValue, indeterminatePosition]);
  
  const determinateStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));
  
  const indeterminateStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      indeterminatePosition.value,
      [0, 0.5, 1],
      [-100, 0, 100]
    );
    const scaleX = interpolate(
      indeterminatePosition.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0.2, 0.5, 0.8, 0.5, 0.2]
    );
    
    return {
      transform: [{ translateX: `${translateX}%` }, { scaleX }],
      width: '50%',
    };
  });
  
  return (
    <View
      style={[
        styles.linearTrack,
        { height, backgroundColor: trackColor, borderRadius: height / 2 },
        style,
      ]}
      testID={testID}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: indeterminate ? undefined : progress }}
    >
      <AnimatedView
        style={[
          styles.linearProgress,
          { backgroundColor: color, borderRadius: height / 2 },
          indeterminate ? indeterminateStyle : determinateStyle,
        ]}
      />
    </View>
  );
}

// Circular Progress - Using View-based approach for broader compatibility
interface CircularProgressProps {
  progress: number;
  indeterminate: boolean;
  size: 'small' | 'medium' | 'large' | number;
  color: string;
  trackColor: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function CircularProgress({
  progress,
  indeterminate,
  size,
  color,
  trackColor,
  style,
  testID,
}: CircularProgressProps) {
  const dimension = typeof size === 'number' ? size : CIRCULAR_SIZES[size];
  const strokeWidth = typeof size === 'number' ? 3 : STROKE_WIDTHS[size];
  
  const rotation = useSharedValue(0);
  const progressValue = useSharedValue(0);
  
  useEffect(() => {
    if (indeterminate) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
      progressValue.value = withTiming(Math.min(100, Math.max(0, progress)) / 100, {
        duration: 300,
      });
    }
    
    return () => {
      cancelAnimation(rotation);
    };
  }, [indeterminate, progress, rotation, progressValue]);
  
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  
  // Using borders to create circular progress
  const progressStyle = useAnimatedStyle(() => {
    const angle = indeterminate ? 270 : progressValue.value * 360;
    return {
      borderTopColor: color,
      borderRightColor: angle > 90 ? color : trackColor,
      borderBottomColor: angle > 180 ? color : trackColor,
      borderLeftColor: angle > 270 ? color : trackColor,
    };
  });
  
  return (
    <AnimatedView
      style={[
        styles.circularContainer,
        { width: dimension, height: dimension },
        containerStyle,
        style,
      ]}
      testID={testID}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: indeterminate ? undefined : progress }}
    >
      <AnimatedView
        style={[
          styles.circularTrack,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            borderWidth: strokeWidth,
            borderColor: trackColor,
          },
        ]}
      />
      <AnimatedView
        style={[
          styles.circularProgress,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            borderWidth: strokeWidth,
          },
          progressStyle,
        ]}
      />
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  linearTrack: {
    width: '100%',
    overflow: 'hidden',
  },
  linearProgress: {
    height: '100%',
  },
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularTrack: {
    position: 'absolute',
  },
  circularProgress: {
    position: 'absolute',
  },
});

export default ProgressIndicator;
