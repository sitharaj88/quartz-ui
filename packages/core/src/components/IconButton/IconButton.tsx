/**
 * Quartz UI - Icon Button Component
 * 
 * Icon Button with four variants:
 * - Standard: No background
 * - Filled: Primary background
 * - Tonal: Secondary container background
 * - Outlined: Border outline
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Pressable,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
  AccessibilityRole,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { springConfig } from '../../tokens/motion';

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
export type IconButtonSize = 'small' | 'medium' | 'large';

export interface IconButtonProps {
  // Icon to render
  icon: React.ReactNode;
  
  // Variant
  variant?: IconButtonVariant;
  
  // Size
  size?: IconButtonSize;
  
  // Toggle state (for toggleable icon buttons)
  selected?: boolean;
  
  // Press handler
  onPress?: (event: GestureResponderEvent) => void;
  
  // Long press handler
  onLongPress?: (event: GestureResponderEvent) => void;
  
  // Disabled state
  disabled?: boolean;
  
  // Style override
  style?: StyleProp<ViewStyle>;
  
  // Accessibility
  accessibilityLabel: string; // Required for icon buttons
  accessibilityHint?: string;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Size configurations
const sizeConfig = {
  small: { size: 32, iconSize: 18 },
  medium: { size: 40, iconSize: 24 },
  large: { size: 48, iconSize: 28 },
};

/**
 * IconButton Component
 */
export function IconButton({
  icon,
  variant = 'standard',
  size = 'medium',
  selected = false,
  onPress,
  onLongPress,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: IconButtonProps): React.ReactElement {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  
  const sizeStyles = sizeConfig[size];
  
  // Get colors based on variant and state
  const getColors = () => {
    if (disabled) {
      return {
        background: variant === 'standard' ? 'transparent' : theme.colors.onSurface + '1F',
        icon: theme.colors.onSurface + '61',
        border: theme.colors.onSurface + '1F',
      };
    }
    
    if (selected) {
      switch (variant) {
        case 'standard':
          return {
            background: 'transparent',
            icon: theme.colors.primary,
            border: 'transparent',
          };
        case 'filled':
          return {
            background: theme.colors.primary,
            icon: theme.colors.onPrimary,
            border: 'transparent',
          };
        case 'tonal':
          return {
            background: theme.colors.secondaryContainer,
            icon: theme.colors.onSecondaryContainer,
            border: 'transparent',
          };
        case 'outlined':
          return {
            background: theme.colors.inverseSurface,
            icon: theme.colors.inverseOnSurface,
            border: 'transparent',
          };
      }
    }
    
    switch (variant) {
      case 'standard':
        return {
          background: 'transparent',
          icon: theme.colors.onSurfaceVariant,
          border: 'transparent',
        };
      case 'filled':
        return {
          background: theme.colors.surfaceContainerHighest,
          icon: theme.colors.primary,
          border: 'transparent',
        };
      case 'tonal':
        return {
          background: theme.colors.surfaceContainerHighest,
          icon: theme.colors.onSurfaceVariant,
          border: 'transparent',
        };
      case 'outlined':
        return {
          background: 'transparent',
          icon: theme.colors.onSurfaceVariant,
          border: theme.colors.outline,
        };
      default:
        return {
          background: 'transparent',
          icon: theme.colors.onSurfaceVariant,
          border: 'transparent',
        };
    }
  };
  
  const colors = getColors();
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Handle press events
  const handlePressIn = useCallback(() => {
    setIsPressed(true);
    scale.value = withSpring(0.9, springConfig.stiff);
    if (theme.accessibility.hapticFeedback && !disabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [disabled, scale, theme.accessibility.hapticFeedback]);
  
  const handlePressOut = useCallback(() => {
    setIsPressed(false);
    scale.value = withSpring(1, springConfig.gentle);
  }, [scale]);
  
  // Button styles
  const buttonStyles: StyleProp<ViewStyle> = [
    {
      width: sizeStyles.size,
      height: sizeStyles.size,
      borderRadius: sizeStyles.size / 2,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      ...(variant === 'outlined' && {
        borderWidth: 1,
        borderColor: colors.border,
      }),
    },
    style,
  ];
  
  // State layer
  const stateLayerStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: sizeStyles.size / 2,
    backgroundColor: isPressed
      ? colors.icon + '1F' // 12% opacity
      : 'transparent',
  };

  return (
    <AnimatedPressable
      style={[buttonStyles, animatedStyle]}
      onPress={disabled ? undefined : onPress}
      onLongPress={disabled ? undefined : onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible={true}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, selected }}
      testID={testID}
    >
      <View style={stateLayerStyle} pointerEvents="none" />
      <View style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}>
        {icon}
      </View>
    </AnimatedPressable>
  );
}

export default IconButton;
