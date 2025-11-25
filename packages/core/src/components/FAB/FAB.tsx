/**
 * Quartz UI - Floating Action Button (FAB)
 * 
 * FAB with three sizes:
 * - Small: 40x40
 * - Regular: 56x56
 * - Large: 96x96
 * 
 * And two variants:
 * - Primary: Primary container color
 * - Secondary: Secondary container color
 * - Tertiary: Tertiary container color
 * - Surface: Surface container high color
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

export type FABSize = 'small' | 'regular' | 'large';
export type FABColor = 'primary' | 'secondary' | 'tertiary' | 'surface';

export interface FABProps {
  // Icon to render
  icon: ReactNode;
  
  // Optional label for extended FAB
  label?: string;
  
  // Color variant
  color?: FABColor;
  
  // Size
  size?: FABSize;
  
  // Whether FAB is lowered (no elevation)
  lowered?: boolean;
  
  // Press handler
  onPress?: (event: GestureResponderEvent) => void;
  
  // Long press handler
  onLongPress?: (event: GestureResponderEvent) => void;
  
  // Disabled state
  disabled?: boolean;
  
  // Style override
  style?: StyleProp<ViewStyle>;
  
  // Accessibility
  accessibilityLabel: string;
  accessibilityHint?: string;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Size configurations
const sizeConfig = {
  small: { size: 40, iconSize: 24, radius: 12, labelSize: 0 },
  regular: { size: 56, iconSize: 24, radius: 16, labelSize: 14 },
  large: { size: 96, iconSize: 36, radius: 28, labelSize: 0 },
};

/**
 * FAB Component
 */
export function FAB({
  icon,
  label,
  color = 'primary',
  size = 'regular',
  lowered = false,
  onPress,
  onLongPress,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: FABProps): React.ReactElement {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  
  const sizeStyles = sizeConfig[size];
  const isExtended = !!label && size === 'regular';
  
  // Get colors based on color variant
  const getColors = () => {
    if (disabled) {
      return {
        container: theme.colors.onSurface + '1F',
        content: theme.colors.onSurface + '61',
      };
    }
    
    switch (color) {
      case 'primary':
        return {
          container: theme.colors.primaryContainer,
          content: theme.colors.onPrimaryContainer,
        };
      case 'secondary':
        return {
          container: theme.colors.secondaryContainer,
          content: theme.colors.onSecondaryContainer,
        };
      case 'tertiary':
        return {
          container: theme.colors.tertiaryContainer,
          content: theme.colors.onTertiaryContainer,
        };
      case 'surface':
        return {
          container: theme.colors.surfaceContainerHigh,
          content: theme.colors.primary,
        };
      default:
        return {
          container: theme.colors.primaryContainer,
          content: theme.colors.onPrimaryContainer,
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
    scale.value = withSpring(0.95, springConfig.stiff);
    if (theme.accessibility.hapticFeedback && !disabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [disabled, scale, theme.accessibility.hapticFeedback]);
  
  const handlePressOut = useCallback(() => {
    setIsPressed(false);
    scale.value = withSpring(1, springConfig.gentle);
  }, [scale]);
  
  // FAB styles
  const fabStyles: StyleProp<ViewStyle> = [
    {
      height: sizeStyles.size,
      minWidth: sizeStyles.size,
      borderRadius: sizeStyles.radius,
      backgroundColor: colors.container,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: isExtended ? 16 : 0,
      gap: isExtended ? 8 : 0,
      overflow: 'hidden',
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
    borderRadius: sizeStyles.radius,
    backgroundColor: isPressed
      ? colors.content + '1F' // 12% opacity
      : 'transparent',
  };

  return (
    <AnimatedPressable
      style={[fabStyles, animatedStyle]}
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
      
      {/* Icon */}
      <View style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}>
        {icon}
      </View>
      
      {/* Label (extended FAB) */}
      {isExtended && (
        <Text
          style={{
            ...theme.typography.labelLarge,
            color: colors.content,
          }}
        >
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

export default FAB;
