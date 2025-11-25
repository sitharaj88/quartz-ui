/**
 * Quartz UI - Card Component
 * 
 * Card with three variants:
 * - Elevated: Default card with elevation
 * - Filled: Card with filled container color
 * - Outlined: Card with border outline
 */

import React, { ReactNode, useState, useCallback, forwardRef } from 'react';
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
import { ElevationLevel } from '../../tokens/elevation';
import { springConfig } from '../../tokens/motion';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

export interface CardProps {
  // Variant type
  variant?: CardVariant;
  
  // Make card pressable
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  
  // Disabled state
  disabled?: boolean;
  
  // Custom elevation (for elevated variant)
  elevation?: ElevationLevel;
  
  // Border radius
  radius?: 'small' | 'medium' | 'large' | number;
  
  // Padding
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  // Content
  children?: ReactNode;
  
  // Style override
  style?: StyleProp<ViewStyle>;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Card Component
 */
export const Card = forwardRef<View, CardProps>(function Card({
  variant = 'elevated',
  onPress,
  onLongPress,
  disabled = false,
  elevation: customElevation,
  radius = 'medium',
  padding = 'md',
  children,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}, ref): React.ReactElement {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  
  const isInteractive = !!onPress || !!onLongPress;
  
  // Get elevation based on variant and state
  const getElevation = (): ElevationLevel => {
    if (customElevation !== undefined) {
      return customElevation;
    }
    
    switch (variant) {
      case 'elevated':
        return isPressed ? 2 : 1;
      case 'filled':
      case 'outlined':
        return isPressed ? 1 : 0;
      default:
        return 1;
    }
  };
  
  // Get background color based on variant
  const getBackgroundColor = (): string => {
    if (disabled) {
      return theme.colors.surfaceContainerHighest + '61'; // 38% opacity
    }
    
    switch (variant) {
      case 'elevated':
        return theme.colors.surface;
      case 'filled':
        return theme.colors.surfaceContainerHighest;
      case 'outlined':
        return theme.colors.surface;
      default:
        return theme.colors.surface;
    }
  };
  
  // Get border radius
  const getBorderRadius = (): number => {
    if (typeof radius === 'number') {
      return radius;
    }
    
    switch (radius) {
      case 'small':
        return theme.shape.small;
      case 'medium':
        return theme.shape.medium;
      case 'large':
        return theme.shape.large;
      default:
        return theme.shape.medium;
    }
  };
  
  // Get padding
  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };
  
  const currentElevation = getElevation();
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Handle press events
  const handlePressIn = useCallback(() => {
    setIsPressed(true);
    if (isInteractive) {
      scale.value = withSpring(0.98, springConfig.stiff);
      if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [isInteractive, scale, theme.accessibility.hapticFeedback]);
  
  const handlePressOut = useCallback(() => {
    setIsPressed(false);
    if (isInteractive) {
      scale.value = withSpring(1, springConfig.gentle);
    }
  }, [isInteractive, scale]);
  
  // Card styles
  const cardStyles: StyleProp<ViewStyle> = [
    {
      backgroundColor: getBackgroundColor(),
      borderRadius: getBorderRadius(),
      padding: getPadding(),
      overflow: 'hidden',
      ...(variant === 'outlined' && {
        borderWidth: 1,
        borderColor: disabled 
          ? theme.colors.outline + '1F' // 12% opacity
          : theme.colors.outlineVariant,
      }),
    },
    style,
  ];
  
  // State layer for interactive cards
  const stateLayerStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isPressed 
      ? theme.colors.onSurface + '1F' // 12% opacity
      : 'transparent',
    borderRadius: getBorderRadius(),
  };

  // Render interactive card
  if (isInteractive) {
    return (
      <AnimatedPressable
        style={[cardStyles, animatedStyle]}
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessible={true}
        accessibilityRole={'button' as AccessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        <View style={stateLayerStyle} pointerEvents="none" />
        {children}
      </AnimatedPressable>
    );
  }
  
  // Render static card
  return (
    <View
      ref={ref}
      style={cardStyles}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {children}
    </View>
  );
});

export default Card;
