/**
 * Quartz UI - Button Component
 * 
 * Button with multiple variants:
 * - Filled: Primary action buttons
 * - Outlined: Secondary actions
 * - Text: Low-emphasis actions
 * - Elevated: Floating action buttons style
 * - Tonal: Medium-emphasis filled buttons
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  GestureResponderEvent,
  AccessibilityRole,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { springConfig } from '../../tokens/motion';
import { ButtonProps } from './Button.types';
import { createButtonStyles } from './Button.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Button Component
 */
export function Button({
  // Content
  children,
  label,
  
  // Variants
  variant = 'filled',
  size = 'medium',
  
  // Icons
  icon,
  iconPosition = 'left',
  
  // State
  loading = false,
  disabled = false,
  
  // Layout
  fullWidth = false,
  
  // Custom colors
  color,
  textColor,
  
  // Style overrides
  style,
  labelStyle,
  contentStyle,
  
  // Events
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  onFocus,
  onBlur,
  
  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  testID,
  
  ...pressableProps
}: ButtonProps): React.ReactElement {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation values
  const scale = useSharedValue(1);
  
  // Compute if button is effectively disabled
  const isDisabled = disabled || loading;
  
  // Get button styles
  const styles = useMemo(() => {
    return createButtonStyles(variant, size, theme, {
      disabled: isDisabled,
      pressed: isPressed,
      hovered: isHovered,
      focused: isFocused,
      fullWidth,
      hasIcon: !!icon || loading, // Consider loading as having an icon for spacing
      iconPosition,
    });
  }, [variant, size, theme, isDisabled, isPressed, isHovered, isFocused, fullWidth, icon, iconPosition, loading]);
  
  // Animated styles for scale
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // Handle press in
  const handlePressIn = useCallback((event: GestureResponderEvent) => {
    setIsPressed(true);
    scale.value = withSpring(0.98, springConfig.stiff);
    
    // Haptic feedback
    if (theme.accessibility.hapticFeedback && !isDisabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPressIn?.(event);
  }, [theme.accessibility.hapticFeedback, isDisabled, onPressIn, scale]);
  
  // Handle press out
  const handlePressOut = useCallback((event: GestureResponderEvent) => {
    setIsPressed(false);
    scale.value = withSpring(1, springConfig.gentle);
    onPressOut?.(event);
  }, [onPressOut, scale]);
  
  // Handle press
  const handlePress = useCallback((event: GestureResponderEvent) => {
    if (!isDisabled) {
      onPress?.(event);
    }
  }, [isDisabled, onPress]);
  
  // Handle hover (web)
  const handleHoverIn = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handleHoverOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Handle focus
  const handleFocus = useCallback((event: any) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);

  const handleBlur = useCallback((event: any) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);
  
  // Get button content
  const buttonContent = label ?? children;
  
  // Determine text color (with custom override)
  const finalTextColor = textColor ?? styles.label.color;
  
  // Loading indicator color
  const loadingColor = variant === 'filled' 
    ? theme.colors.onPrimary 
    : theme.colors.primary;

  return (
    <AnimatedPressable
      {...pressableProps}
      style={[styles.container, color ? { backgroundColor: color } : undefined, style, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onLongPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // @ts-ignore - Web-specific props
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
      disabled={isDisabled}
      accessible={true}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel ?? (typeof buttonContent === 'string' ? buttonContent : undefined)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      // MD3: Buttons should be focusable
      focusable={!isDisabled}
      testID={testID}
    >
      {/* State layer for ripple effect */}
      <View style={styles.stateLayer} />
      
      {/* Content container */}
      <View style={[styles.content, contentStyle]}>
        {/* Loading indicator */}
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={loadingColor}
            style={[styles.icon, { marginRight: 4 }]}
          />
        )}
        
        {/* Icon (if not loading) */}
        {!loading && icon && (
          <View style={styles.icon}>
            {icon}
          </View>
        )}
        
        {/* Label text */}
        {buttonContent && typeof buttonContent === 'string' ? (
          <Text 
            style={[
              styles.label, 
              finalTextColor ? { color: finalTextColor } : undefined,
              labelStyle,
            ]}
            numberOfLines={1}
          >
            {buttonContent}
          </Text>
        ) : (
          buttonContent
        )}
      </View>
    </AnimatedPressable>
  );
}

// Export as default for convenience
export default Button;
