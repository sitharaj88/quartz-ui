/**
 * Quartz UI - Chip Component
 * 
 * Chips:
 * - Assist: Help initiate actions
 * - Filter: Select options
 * - Input: User input tags
 * - Suggestion: Dynamic suggestions
 */

import React, { useState, useCallback, ReactNode } from 'react';
import {
  View,
  Pressable,
  Text,
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

export type ChipVariant = 'assist' | 'filter' | 'input' | 'suggestion';

export interface ChipProps {
  // Chip label
  label: string;
  
  // Variant
  variant?: ChipVariant;
  
  // Selected state (for filter chips)
  selected?: boolean;
  
  // Leading icon
  leadingIcon?: ReactNode;
  
  // Trailing icon (or close button)
  trailingIcon?: ReactNode;
  
  // Avatar (for input chips)
  avatar?: ReactNode;
  
  // Elevated style
  elevated?: boolean;
  
  // Press handler
  onPress?: (event: GestureResponderEvent) => void;
  
  // Close handler (for input chips)
  onClose?: () => void;
  
  // Disabled state
  disabled?: boolean;
  
  // Style override
  style?: StyleProp<ViewStyle>;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Chip Component
 */
export function Chip({
  label,
  variant = 'assist',
  selected = false,
  leadingIcon,
  trailingIcon,
  avatar,
  elevated = false,
  onPress,
  onClose,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ChipProps): React.ReactElement {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  
  // Get colors based on variant and state
  const getColors = () => {
    if (disabled) {
      return {
        container: theme.colors.onSurface + '1F', // 12%
        outline: theme.colors.onSurface + '1F',
        label: theme.colors.onSurface + '61', // 38%
        icon: theme.colors.onSurface + '61',
      };
    }
    
    if (selected) {
      return {
        container: theme.colors.secondaryContainer,
        outline: 'transparent',
        label: theme.colors.onSecondaryContainer,
        icon: theme.colors.onSecondaryContainer,
      };
    }
    
    return {
      container: elevated ? theme.colors.surfaceContainerLow : 'transparent',
      outline: theme.colors.outline,
      label: theme.colors.onSurfaceVariant,
      icon: theme.colors.primary,
    };
  };
  
  const colors = getColors();
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Handle press events
  const handlePressIn = useCallback(() => {
    setIsPressed(true);
    scale.value = withSpring(0.95, springConfig.stiff);
    if (theme.accessibility.hapticFeedback && !disabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [disabled, scale, theme.accessibility.hapticFeedback]);
  
  const handlePressOut = useCallback(() => {
    setIsPressed(false);
    scale.value = withSpring(1, springConfig.gentle);
  }, [scale]);
  
  // Handle close
  const handleClose = useCallback((e: GestureResponderEvent) => {
    e.stopPropagation?.();
    if (!disabled) {
      onClose?.();
    }
  }, [disabled, onClose]);
  
  // Chip styles - RTL aware using Start/End
  const paddingStart = avatar ? 4 : leadingIcon ? 8 : 16;
  const paddingEnd = trailingIcon || onClose ? 8 : 16;
  
  const chipStyles: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      height: 32,
      paddingStart,
      paddingEnd,
      borderRadius: 8,
      backgroundColor: colors.container,
      borderWidth: selected || elevated ? 0 : 1,
      borderColor: colors.outline,
      gap: 8,
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
    borderRadius: 8,
    backgroundColor: isPressed
      ? theme.colors.onSecondaryContainer + '1F'
      : 'transparent',
  };

  return (
    <AnimatedPressable
      style={[chipStyles, animatedStyle]}
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible={true}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, selected }}
      testID={testID}
    >
      <View style={stateLayerStyle} pointerEvents="none" />
      
      {/* Avatar */}
      {avatar && (
        <View style={{ 
          width: 24, 
          height: 24, 
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {avatar}
        </View>
      )}
      
      {/* Leading icon */}
      {!avatar && leadingIcon && (
        <View style={{ width: 18, height: 18 }}>
          {leadingIcon}
        </View>
      )}
      
      {/* Label */}
      <Text
        style={{
          ...theme.typography.labelLarge,
          color: colors.label,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
      
      {/* Trailing icon or close button */}
      {(trailingIcon || (variant === 'input' && onClose)) && (
        <Pressable
          onPress={onClose ? handleClose : undefined}
          style={{ width: 18, height: 18 }}
          accessible={!!onClose}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
        >
          {trailingIcon || (
            // Default close icon (X)
            <View style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: theme.colors.onSurfaceVariant,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ color: theme.colors.surface, fontSize: 12 }}>×</Text>
            </View>
          )}
        </Pressable>
      )}
    </AnimatedPressable>
  );
}

export default Chip;
