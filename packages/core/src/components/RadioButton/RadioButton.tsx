/**
 * Quartz UI - Radio Button Component
 * 
 * Radio Button for single selection within a group
 */

import React, { useCallback, useEffect } from 'react';
import { Pressable, View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
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

export interface RadioButtonProps {
  /** Whether the radio button is selected */
  selected?: boolean;
  /** Whether the radio button is disabled */
  disabled?: boolean;
  /** Callback when radio button is pressed */
  onPress?: () => void;
  /** Value associated with this radio button */
  value?: string;
  /** Custom color for selected state */
  color?: string;
  /** Size of the radio button */
  size?: 'small' | 'medium' | 'large';
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}

const SIZES = {
  small: { outer: 16, inner: 8, borderWidth: 1.5 },
  medium: { outer: 20, inner: 10, borderWidth: 2 },
  large: { outer: 24, inner: 12, borderWidth: 2 },
};

const AnimatedView = Animated.createAnimatedComponent(View);

export function RadioButton({
  selected = false,
  disabled = false,
  onPress,
  value,
  color,
  size = 'medium',
  style,
  accessibilityLabel,
  testID,
}: RadioButtonProps) {
  const theme = useTheme();
  const sizeConfig = SIZES[size];
  
  const progress = useSharedValue(selected ? 1 : 0);
  const scale = useSharedValue(1);
  
  const activeColor = color ?? theme.colors.primary;
  const disabledColor = theme.colors.onSurface + '61'; // 38%
  
  useEffect(() => {
    progress.value = withSpring(selected ? 1 : 0, springConfig.gentle);
  }, [selected, progress]);
  
  const handlePress = useCallback(() => {
    if (disabled || selected) return;
    
    scale.value = withSpring(0.9, springConfig.stiff);
    setTimeout(() => {
      scale.value = withSpring(1, springConfig.gentle);
    }, 100);
    
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress?.();
  }, [disabled, selected, onPress, scale, theme.accessibility.hapticFeedback]);
  
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const outerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [disabled ? disabledColor : theme.colors.onSurfaceVariant, disabled ? disabledColor : activeColor]
    );
    
    return { borderColor };
  });
  
  const innerStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0, 1]) }],
    backgroundColor: disabled ? disabledColor : activeColor,
  }));
  
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: value }}
      testID={testID}
      style={[styles.pressable, style]}
    >
      <AnimatedView style={containerStyle}>
        <AnimatedView
          style={[
            styles.outer,
            {
              width: sizeConfig.outer,
              height: sizeConfig.outer,
              borderRadius: sizeConfig.outer / 2,
              borderWidth: sizeConfig.borderWidth,
            },
            outerStyle,
          ]}
        >
          <AnimatedView
            style={[
              styles.inner,
              {
                width: sizeConfig.inner,
                height: sizeConfig.inner,
                borderRadius: sizeConfig.inner / 2,
              },
              innerStyle,
            ]}
          />
        </AnimatedView>
      </AnimatedView>
    </Pressable>
  );
}

/** Radio Group for managing multiple radio buttons */
export interface RadioGroupProps {
  /** Currently selected value */
  value?: string;
  /** Callback when selection changes */
  onValueChange?: (value: string) => void;
  /** Children radio buttons */
  children: React.ReactNode;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** Style override */
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup({
  value,
  onValueChange,
  children,
  direction = 'vertical',
  style,
}: RadioGroupProps) {
  return (
    <View
      style={[
        styles.group,
        direction === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
      accessibilityRole="radiogroup"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioButtonProps>(child)) {
          return React.cloneElement(child, {
            selected: child.props.value === value,
            onPress: () => {
              if (child.props.value) {
                onValueChange?.(child.props.value);
              }
              child.props.onPress?.();
            },
          });
        }
        return child;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    padding: 4,
  },
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {},
  group: {
    gap: 8,
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vertical: {
    flexDirection: 'column',
  },
});

export default RadioButton;
