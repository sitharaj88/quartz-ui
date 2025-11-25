/**
 * Quartz UI - Checkbox Component
 * 
 * Checkbox with three states:
 * - Unchecked
 * - Checked
 * - Indeterminate
 */

import React, { useCallback, useEffect } from 'react';
import { Pressable, View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { springConfig } from '../../tokens/motion';

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Callback when checkbox is pressed */
  onValueChange?: (checked: boolean) => void;
  /** Custom color for checked state */
  color?: string;
  /** Size of the checkbox */
  size?: 'small' | 'medium' | 'large';
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}

const SIZES = {
  small: { box: 16, icon: 10, borderWidth: 1.5, borderRadius: 2 },
  medium: { box: 20, icon: 14, borderWidth: 2, borderRadius: 2 },
  large: { box: 24, icon: 16, borderWidth: 2, borderRadius: 3 },
};

const AnimatedView = Animated.createAnimatedComponent(View);

export function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  onValueChange,
  color,
  size = 'medium',
  style,
  accessibilityLabel,
  testID,
}: CheckboxProps) {
  const theme = useTheme();
  const sizeConfig = SIZES[size];
  
  const progress = useSharedValue(checked || indeterminate ? 1 : 0);
  const scale = useSharedValue(1);
  
  const activeColor = color ?? theme.colors.primary;
  const disabledColor = theme.colors.onSurface + '61'; // 38%
  
  useEffect(() => {
    progress.value = withSpring(checked || indeterminate ? 1 : 0, springConfig.gentle);
  }, [checked, indeterminate, progress]);
  
  const handlePress = useCallback(() => {
    if (disabled) return;
    
    scale.value = withSpring(0.9, springConfig.stiff);
    setTimeout(() => {
      scale.value = withSpring(1, springConfig.gentle);
    }, 100);
    
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onValueChange?.(!checked);
  }, [disabled, checked, onValueChange, scale, theme.accessibility.hapticFeedback]);
  
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const boxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', disabled ? disabledColor : activeColor]
    );
    
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [disabled ? disabledColor : theme.colors.onSurfaceVariant, disabled ? disabledColor : activeColor]
    );
    
    return {
      backgroundColor,
      borderColor,
    };
  });
  
  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.5, 1]) },
    ],
  }));
  
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[styles.pressable, style]}
    >
      <AnimatedView style={containerStyle}>
        <AnimatedView
          style={[
            styles.box,
            {
              width: sizeConfig.box,
              height: sizeConfig.box,
              borderRadius: sizeConfig.borderRadius,
              borderWidth: sizeConfig.borderWidth,
            },
            boxStyle,
          ]}
        >
          <AnimatedView style={[styles.checkmark, checkmarkStyle]}>
            {indeterminate ? (
              <View
                style={[
                  styles.indeterminateLine,
                  {
                    width: sizeConfig.icon,
                    height: 2,
                    backgroundColor: disabled ? theme.colors.surface : theme.colors.onPrimary,
                  },
                ]}
              />
            ) : (
              <View style={styles.checkIcon}>
                <View
                  style={[
                    styles.checkShort,
                    {
                      width: sizeConfig.icon * 0.35,
                      height: 2,
                      backgroundColor: disabled ? theme.colors.surface : theme.colors.onPrimary,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.checkLong,
                    {
                      width: sizeConfig.icon * 0.7,
                      height: 2,
                      backgroundColor: disabled ? theme.colors.surface : theme.colors.onPrimary,
                    },
                  ]}
                />
              </View>
            )}
          </AnimatedView>
        </AnimatedView>
      </AnimatedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    padding: 4,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkShort: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }, { translateX: -2 }, { translateY: 2 }],
  },
  checkLong: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }, { translateX: 1 }, { translateY: 0 }],
  },
  indeterminateLine: {
    borderRadius: 1,
  },
});

export default Checkbox;
