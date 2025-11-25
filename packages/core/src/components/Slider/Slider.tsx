/**
 * Quartz UI - Slider Component
 * 
 * Sliders:
 * - Continuous
 * - Discrete (with step marks)
 * - Smooth animations
 */

import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
  Platform,
  I18nManager,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';

export interface SliderProps {
  /** Current value */
  value: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment (for discrete slider) */
  step?: number;
  /** Callback when value changes */
  onValueChange?: (value: number) => void;
  /** Callback when sliding ends */
  onSlidingComplete?: (value: number) => void;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Whether to show value label while sliding */
  showLabel?: boolean;
  /** Custom color */
  color?: string;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

// Slider dimensions
const THUMB_SIZE = 20;
const THUMB_TOUCH_SIZE = 40;
const TRACK_HEIGHT = 4;
const STATE_LAYER_SIZE = 40;

export function Slider({
  value,
  min = 0,
  max = 100,
  step,
  onValueChange,
  onSlidingComplete,
  disabled = false,
  showLabel = true,
  color,
  style,
  testID,
}: SliderProps) {
  const theme = useTheme();
  const trackWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastStepValue = useRef(value);
  
  const activeColor = color ?? theme.colors.primary;
  const disabledColor = theme.colors.onSurface + '38'; // 22% opacity
  const trackColor = disabled ? disabledColor : theme.colors.surfaceContainerHighest;
  
  // Animated values
  const thumbPosition = useSharedValue((value - min) / (max - min));
  const thumbScale = useSharedValue(1);
  const stateLayerOpacity = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const labelScale = useSharedValue(0.6);
  const trackWidth = useSharedValue(0);
  
  // Clamp value to valid range
  const clampValue = useCallback((val: number) => {
    let clamped = Math.max(min, Math.min(max, val));
    if (step) {
      clamped = Math.round(clamped / step) * step;
    }
    return clamped;
  }, [min, max, step]);
  
  // Update thumb position when value changes externally
  useEffect(() => {
    if (!isDraggingRef.current) {
      const normalized = (value - min) / (max - min);
      thumbPosition.value = withTiming(normalized, {
        duration: 150,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [value, min, max, thumbPosition]);
  
  // Haptic feedback helper
  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web' && theme.accessibility.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [theme.accessibility.hapticFeedback]);
  
  // Handle value change with step detection for haptics
  const handleValueChange = useCallback((newValue: number) => {
    const clampedValue = clampValue(newValue);
    
    // Trigger haptic on step change for discrete sliders
    if (step) {
      const currentStep = Math.round(clampedValue / step);
      const lastStep = Math.round(lastStepValue.current / step);
      if (currentStep !== lastStep) {
        triggerHaptic();
      }
    }
    
    lastStepValue.current = clampedValue;
    onValueChange?.(clampedValue);
  }, [clampValue, step, triggerHaptic, onValueChange]);
  
  // Track layout handler
  const handleTrackLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidthRef.current = width;
    trackWidth.value = width;
  }, [trackWidth]);
  
  // Start drag animation
  const startDrag = useCallback(() => {
    isDraggingRef.current = true;
  }, []);
  
  // End drag animation
  const endDrag = useCallback(() => {
    isDraggingRef.current = false;
  }, []);
  
  // Pan gesture for dragging
  const isRTL = I18nManager.isRTL;
  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .minDistance(0)
    .onBegin((event) => {
      'worklet';
      runOnJS(startDrag)();
      thumbScale.value = withSpring(1.15, { damping: 15, stiffness: 400 });
      stateLayerOpacity.value = withTiming(0.12, { duration: 100 });
      labelOpacity.value = withTiming(1, { duration: 100 });
      labelScale.value = withSpring(1, { damping: 15, stiffness: 400 });
      
      // Set initial position from touch
      if (trackWidth.value > 0) {
        const touchX = event.x;
        // In RTL, invert the touch position
        const adjustedX = isRTL ? trackWidth.value - touchX : touchX;
        const normalized = Math.max(0, Math.min(1, adjustedX / trackWidth.value));
        thumbPosition.value = normalized;
        const newValue = normalized * (max - min) + min;
        runOnJS(handleValueChange)(newValue);
      }
    })
    .onUpdate((event) => {
      'worklet';
      if (trackWidth.value > 0) {
        const touchX = event.x;
        // In RTL, invert the touch position
        const adjustedX = isRTL ? trackWidth.value - touchX : touchX;
        const normalized = Math.max(0, Math.min(1, adjustedX / trackWidth.value));
        thumbPosition.value = normalized;
        const newValue = normalized * (max - min) + min;
        runOnJS(handleValueChange)(newValue);
      }
    })
    .onEnd(() => {
      'worklet';
      runOnJS(endDrag)();
      thumbScale.value = withSpring(1, { damping: 15, stiffness: 400 });
      stateLayerOpacity.value = withTiming(0, { duration: 150 });
      labelOpacity.value = withTiming(0, { duration: 200 });
      labelScale.value = withTiming(0.6, { duration: 200 });
      
      if (onSlidingComplete) {
        const finalValue = thumbPosition.value * (max - min) + min;
        runOnJS(onSlidingComplete)(finalValue);
      }
    });
  
  // Tap gesture for quick positioning
  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onEnd((event) => {
      'worklet';
      if (trackWidth.value > 0) {
        const touchX = event.x;
        // In RTL, invert the touch position
        const adjustedX = isRTL ? trackWidth.value - touchX : touchX;
        const normalized = Math.max(0, Math.min(1, adjustedX / trackWidth.value));
        thumbPosition.value = withSpring(normalized, { damping: 20, stiffness: 400 });
        const newValue = normalized * (max - min) + min;
        runOnJS(handleValueChange)(newValue);
        runOnJS(triggerHaptic)();
        
        if (onSlidingComplete) {
          runOnJS(onSlidingComplete)(newValue);
        }
      }
    });
  
  // Combine gestures - pan takes priority
  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);
  
  // Animated styles
  const activeTrackStyle = useAnimatedStyle(() => {
    // Use pixel width instead of percentage (not supported in reanimated)
    const width = thumbPosition.value * trackWidth.value;
    // In RTL, position from end instead of start
    if (I18nManager.isRTL) {
      return {
        width,
        start: undefined,
        end: THUMB_SIZE / 2,
      };
    }
    return {
      width,
    };
  });
  
  const thumbContainerStyle = useAnimatedStyle(() => {
    const position = thumbPosition.value * trackWidth.value;
    // In RTL, we need to mirror the position from the right side
    const translateX = I18nManager.isRTL 
      ? trackWidth.value - position - THUMB_TOUCH_SIZE / 2
      : position - THUMB_TOUCH_SIZE / 2;
    return {
      transform: [
        { translateX },
      ],
    };
  });
  
  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: thumbScale.value },
      ],
    };
  });
  
  const stateLayerStyle = useAnimatedStyle(() => {
    return {
      opacity: stateLayerOpacity.value,
      transform: [
        { scale: thumbScale.value },
      ],
    };
  });
  
  const labelStyle = useAnimatedStyle(() => {
    const position = thumbPosition.value * trackWidth.value;
    // In RTL, mirror the label position
    const translateX = I18nManager.isRTL
      ? trackWidth.value - position - 20
      : position - 20;
    return {
      opacity: labelOpacity.value,
      transform: [
        { translateX },
        { translateY: -48 },
        { scale: labelScale.value },
      ],
    };
  });
  
  // Calculate step marks for discrete slider
  const stepMarks = step ? Array.from(
    { length: Math.floor((max - min) / step) + 1 },
    (_, i) => min + i * step
  ) : [];
  
  // Convert value to normalized position
  const valueToNormalized = (val: number) => (val - min) / (max - min);
  
  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Value Label */}
      {showLabel && (
        <AnimatedView
          style={[
            styles.label,
            { backgroundColor: activeColor },
            labelStyle,
          ]}
          pointerEvents="none"
        >
          <View style={styles.labelBubble}>
            <Text style={[styles.labelText, { color: theme.colors.onPrimary }]}>
              {step ? Math.round(value) : value.toFixed(0)}
            </Text>
          </View>
          <View style={[styles.labelArrow, { borderTopColor: activeColor }]} />
        </AnimatedView>
      )}
      
      <GestureDetector gesture={composedGesture}>
        <View
          style={styles.trackContainer}
          accessible={true}
          accessibilityRole="adjustable"
          accessibilityValue={{ min, max, now: value }}
          accessibilityLabel={`Slider, value ${Math.round(value)}`}
        >
          {/* Inactive Track */}
          <View
            style={[
              styles.track,
              { backgroundColor: trackColor },
            ]}
            onLayout={handleTrackLayout}
          />
          
          {/* Active Track */}
          <AnimatedView
            style={[
              styles.activeTrack,
              { backgroundColor: disabled ? disabledColor : activeColor },
              activeTrackStyle,
            ]}
          />
          
          {/* Step Marks for Discrete Slider */}
          {step && stepMarks.map((markValue, index) => {
            const markNormalized = valueToNormalized(markValue);
            const isActive = markValue <= value;
            return (
              <View
                key={index}
                style={[
                  styles.stepMark,
                  {
                    [I18nManager.isRTL ? 'right' : 'left']: `${markNormalized * 100}%`,
                    backgroundColor: isActive
                      ? (disabled ? disabledColor : theme.colors.onPrimary)
                      : (disabled ? disabledColor : theme.colors.primary),
                    opacity: isActive ? 1 : 0.38,
                  },
                ]}
              />
            );
          })}
          
          {/* Thumb Container (larger touch target) */}
          <AnimatedView style={[styles.thumbContainer, thumbContainerStyle]}>
            {/* State Layer (hover/press effect) */}
            <AnimatedView
              style={[
                styles.stateLayer,
                { backgroundColor: activeColor },
                stateLayerStyle,
              ]}
            />
            
            {/* Thumb */}
            <AnimatedView
              style={[
                styles.thumb,
                {
                  backgroundColor: disabled ? disabledColor : activeColor,
                },
                thumbStyle,
              ]}
            />
          </AnimatedView>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: 'center',
  },
  trackContainer: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: THUMB_SIZE / 2,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  activeTrack: {
    position: 'absolute',
    start: THUMB_SIZE / 2,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  stepMark: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    marginStart: -2 + THUMB_SIZE / 2,
    top: '50%',
    marginTop: -2,
  },
  thumbContainer: {
    position: 'absolute',
    width: THUMB_TOUCH_SIZE,
    height: THUMB_TOUCH_SIZE,
    start: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateLayer: {
    position: 'absolute',
    width: STATE_LAYER_SIZE,
    height: STATE_LAYER_SIZE,
    borderRadius: STATE_LAYER_SIZE / 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  label: {
    position: 'absolute',
    alignItems: 'center',
    start: THUMB_SIZE / 2,
    zIndex: 10,
  },
  labelBubble: {
    width: 40,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Slider;
