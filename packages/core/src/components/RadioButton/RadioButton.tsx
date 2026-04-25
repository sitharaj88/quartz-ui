/**
 * Quartz UI - RadioButton + RadioGroup
 *
 * Single-selection within a group. Pressing a selected radio is a no-op
 * (selection is exclusive). RadioGroup manages selection across children.
 */

import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { useInteractiveState } from '../../hooks/useInteractiveState';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { duration, springConfig } from '../../tokens/motion';
import { withAlpha } from '../../utils/color';

export type RadioButtonSize = 'small' | 'medium' | 'large';

export interface RadioButtonHandle {
  focus(): void;
  blur(): void;
}

export interface RadioButtonProps {
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  /** Identifier used by RadioGroup to track selection. */
  value?: string;
  color?: string;
  size?: RadioButtonSize;
  enableHaptics?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  ref?: React.Ref<RadioButtonHandle>;
}

const SIZES = {
  small: { outer: 16, inner: 8, borderWidth: 1.5 },
  medium: { outer: 20, inner: 10, borderWidth: 2 },
  large: { outer: 24, inner: 12, borderWidth: 2 },
} as const;

const MIN_TOUCH_TARGET = 48;

const AnimatedView = Animated.createAnimatedComponent(View);

const RadioButtonImpl = forwardRef<RadioButtonHandle, RadioButtonProps>(function RadioButton(
  {
    selected = false,
    disabled = false,
    onPress,
    value,
    color,
    size = 'medium',
    enableHaptics,
    style,
    accessibilityLabel,
    accessibilityHint,
    testID,
  },
  ref
) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const sizeConfig = SIZES[size];
  const viewRef = useRef<View>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        const node = viewRef.current as (View & { focus?: () => void }) | null;
        node?.focus?.();
      },
      blur() {
        const node = viewRef.current as (View & { blur?: () => void }) | null;
        node?.blur?.();
      },
    }),
    []
  );

  const interactive = useInteractiveState({ disabled });
  const { focusVisible, handlers } = interactive;

  const progress = useSharedValue(selected ? 1 : 0);
  const scale = useSharedValue(1);

  const activeColor = color ?? theme.colors.primary;
  const disabledColor = withAlpha(theme.colors.onSurface, 0.38);

  useEffect(() => {
    const target = selected ? 1 : 0;
    progress.value = reduceMotion
      ? target
      : withTiming(target, { duration: duration.short3 });
  }, [selected, progress, reduceMotion]);

  const handlePress = useCallback(() => {
    if (disabled || selected) return;
    if (!reduceMotion) {
      scale.value = withSpring(0.9, springConfig.stiff, () => {
        scale.value = withSpring(1, springConfig.gentle);
      });
    }
    const hapticsOn = enableHaptics ?? theme.accessibility.hapticFeedback;
    if (hapticsOn && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress?.();
  }, [
    disabled,
    selected,
    reduceMotion,
    scale,
    enableHaptics,
    theme.accessibility.hapticFeedback,
    onPress,
  ]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const outerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        disabled ? disabledColor : theme.colors.onSurfaceVariant,
        disabled ? disabledColor : activeColor,
      ]
    );
    return { borderColor };
  });

  const innerStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0, 1]) }],
    backgroundColor: disabled ? disabledColor : activeColor,
  }));

  const padded = sizeConfig.outer + 8;
  const hitSlopExpand = Math.max(0, (MIN_TOUCH_TARGET - padded) / 2);
  const hitSlop =
    hitSlopExpand > 0
      ? { top: hitSlopExpand, bottom: hitSlopExpand, left: hitSlopExpand, right: hitSlopExpand }
      : undefined;

  const focusRingStyle: ViewStyle = {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: sizeConfig.outer / 2 + 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  };

  return (
    <View>
      <Pressable
        ref={viewRef as React.Ref<View>}
        onPress={handlePress}
        onPressIn={handlers.onPressIn}
        onPressOut={handlers.onPressOut}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        disabled={disabled}
        hitSlop={hitSlop}
        accessible
        accessibilityRole="radio"
        accessibilityState={{ checked: selected, disabled }}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityValue={value ? { text: value } : undefined}
        focusable={!disabled}
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
      {focusVisible && <View style={focusRingStyle} pointerEvents="none" accessibilityElementsHidden />}
    </View>
  );
});

RadioButtonImpl.displayName = 'RadioButton';

export const RadioButton = memo(RadioButtonImpl);

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export interface RadioGroupProps {
  /** Currently selected value (controlled). */
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  children,
  direction = 'vertical',
  style,
  accessibilityLabel,
}: RadioGroupProps) {
  return (
    <View
      style={[
        styles.group,
        direction === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioButtonProps>(child)) {
          return React.cloneElement(child, {
            selected: child.props.value === value,
            onPress: () => {
              if (child.props.value) onValueChange?.(child.props.value);
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
