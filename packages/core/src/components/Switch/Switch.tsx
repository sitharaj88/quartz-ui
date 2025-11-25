/**
 * Quartz UI - Switch Component
 * 
 * Switch for toggling settings
 */

import React, { useCallback } from 'react';
import {
  View,
  Pressable,
  ViewStyle,
  StyleProp,
  AccessibilityRole,
  Platform,
  I18nManager,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { springConfig } from '../../tokens/motion';

export interface SwitchProps {
  // Controlled value
  value: boolean;
  
  // Change handler
  onValueChange?: (value: boolean) => void;
  
  // Icons inside the thumb
  thumbIcon?: React.ReactNode;
  thumbIconOff?: React.ReactNode;
  
  // Disabled state
  disabled?: boolean;
  
  // Style override
  style?: StyleProp<ViewStyle>;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// Switch dimensions (MD3 specs)
const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 32;
const THUMB_SIZE_OFF = 16;
const THUMB_SIZE_ON = 24;
const THUMB_OFFSET = 4;

/**
 * Switch Component
 */
export function Switch({
  value,
  onValueChange,
  thumbIcon,
  thumbIconOff,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: SwitchProps): React.ReactElement {
  const theme = useTheme();
  const progress = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);
  
  // Update animation when value changes
  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, springConfig.stiff);
  }, [value, progress]);
  
  // Handle toggle
  const handlePress = useCallback(() => {
    if (!disabled && onValueChange) {
      if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onValueChange(!value);
    }
  }, [disabled, onValueChange, value, theme.accessibility.hapticFeedback]);
  
  // Handle press in/out for scale animation
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, springConfig.stiff);
  }, [scale]);
  
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, springConfig.gentle);
  }, [scale]);
  
  // Get colors
  const getColors = () => {
    if (disabled) {
      return {
        trackOn: theme.colors.onSurface + '1F', // 12%
        trackOff: theme.colors.surfaceContainerHighest + '1F',
        thumbOn: theme.colors.surface,
        thumbOff: theme.colors.onSurface + '61', // 38%
        iconOn: theme.colors.onSurfaceVariant + '61',
        iconOff: theme.colors.surfaceContainerHighest + '61',
        outline: theme.colors.onSurface + '1F',
      };
    }
    
    return {
      trackOn: theme.colors.primary,
      trackOff: theme.colors.surfaceContainerHighest,
      thumbOn: theme.colors.onPrimary,
      thumbOff: theme.colors.outline,
      iconOn: theme.colors.onPrimaryContainer,
      iconOff: theme.colors.surfaceContainerHighest,
      outline: theme.colors.outline,
    };
  };
  
  const colors = getColors();
  
  // Animated track styles
  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.trackOff, colors.trackOn]
    );
    
    const borderWidth = interpolate(progress.value, [0, 1], [2, 0]);
    
    return {
      backgroundColor,
      borderWidth,
      borderColor: colors.outline,
      transform: [{ scale: scale.value }],
    };
  });
  
  // Animated thumb styles
  const animatedThumbStyle = useAnimatedStyle(() => {
    const size = interpolate(
      progress.value, 
      [0, 1], 
      [THUMB_SIZE_OFF, THUMB_SIZE_ON]
    );
    
    // Calculate base translateX
    const baseTranslateX = interpolate(
      progress.value,
      [0, 1],
      [THUMB_OFFSET + (THUMB_SIZE_ON - THUMB_SIZE_OFF) / 2, TRACK_WIDTH - THUMB_SIZE_ON - THUMB_OFFSET]
    );
    
    // Mirror for RTL: In RTL, OFF is on the right, ON is on the left
    const translateX = I18nManager.isRTL ? -baseTranslateX : baseTranslateX;
    
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.thumbOff, colors.thumbOn]
    );
    
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      transform: [{ translateX }],
    };
  });

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible={true}
      accessibilityRole={'switch' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ checked: value, disabled }}
      testID={testID}
      style={style}
    >
      {/* Track */}
      <Animated.View
        style={[
          {
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            justifyContent: 'center',
          },
          animatedTrackStyle,
        ]}
      >
        {/* Thumb */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              [I18nManager.isRTL ? 'end' : 'start']: 0,
              alignItems: 'center',
              justifyContent: 'center',
            },
            animatedThumbStyle,
          ]}
        >
          {/* Thumb icon */}
          {value && thumbIcon && (
            <View style={{ width: 16, height: 16 }}>
              {thumbIcon}
            </View>
          )}
          {!value && thumbIconOff && (
            <View style={{ width: 16, height: 16 }}>
              {thumbIconOff}
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export default Switch;
