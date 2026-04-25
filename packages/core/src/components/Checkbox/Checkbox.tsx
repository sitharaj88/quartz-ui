/**
 * Quartz UI - Checkbox
 *
 * Three states (unchecked / checked / indeterminate). Animated state transitions
 * respect reduce-motion. Accessibility: role=checkbox with `mixed` for
 * indeterminate, focus-visible ring, hitSlop expands touch target to ≥48dp,
 * controlled or uncontrolled via `defaultChecked`.
 */

import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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

export type CheckboxSize = 'small' | 'medium' | 'large';

export interface CheckboxHandle {
  focus(): void;
  blur(): void;
}

export interface CheckboxProps {
  /** Controlled checked state. Pair with `onValueChange` for two-way binding. */
  checked?: boolean;
  /** Initial state for uncontrolled mode. */
  defaultChecked?: boolean;
  /** Three-state mixed indicator (e.g. "select all" reflecting partial selection). */
  indeterminate?: boolean;
  disabled?: boolean;
  onValueChange?: (checked: boolean) => void;
  /** Override the active color. Defaults to theme.colors.primary. */
  color?: string;
  size?: CheckboxSize;
  enableHaptics?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  ref?: React.Ref<CheckboxHandle>;
}

const SIZES = {
  small: { box: 16, icon: 10, borderWidth: 1.5, borderRadius: 2 },
  medium: { box: 20, icon: 14, borderWidth: 2, borderRadius: 2 },
  large: { box: 24, icon: 16, borderWidth: 2, borderRadius: 3 },
} as const;

const MIN_TOUCH_TARGET = 48;

const AnimatedView = Animated.createAnimatedComponent(View);

const CheckboxImpl = forwardRef<CheckboxHandle, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    indeterminate = false,
    disabled = false,
    onValueChange,
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

  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = isControlled ? checked! : internal;

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

  const progress = useSharedValue(isChecked || indeterminate ? 1 : 0);
  const scale = useSharedValue(1);

  const activeColor = color ?? theme.colors.primary;
  const disabledColor = withAlpha(theme.colors.onSurface, 0.38);

  // Animate to next state when checked or indeterminate changes.
  useEffect(() => {
    const target = isChecked || indeterminate ? 1 : 0;
    progress.value = reduceMotion
      ? target
      : withTiming(target, { duration: duration.short3 });
  }, [isChecked, indeterminate, progress, reduceMotion]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    if (!reduceMotion) {
      scale.value = withSpring(0.9, springConfig.stiff, () => {
        scale.value = withSpring(1, springConfig.gentle);
      });
    }
    const hapticsOn = enableHaptics ?? theme.accessibility.hapticFeedback;
    if (hapticsOn && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  }, [
    disabled,
    reduceMotion,
    scale,
    enableHaptics,
    theme.accessibility.hapticFeedback,
    isChecked,
    isControlled,
    onValueChange,
  ]);

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
      [
        disabled ? disabledColor : theme.colors.onSurfaceVariant,
        disabled ? disabledColor : activeColor,
      ]
    );
    return { backgroundColor, borderColor };
  });

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.5, 1]) }],
  }));

  // Bring touch target up to WCAG 2.5.5.
  const padded = sizeConfig.box + 8; // 4dp padding × 2 from styles.pressable
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
    borderRadius: sizeConfig.borderRadius + 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  };

  const checkmarkColor = disabled ? theme.colors.surface : theme.colors.onPrimary;

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
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: indeterminate ? 'mixed' : isChecked,
          disabled,
        }}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        focusable={!disabled}
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
                      backgroundColor: checkmarkColor,
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
                        backgroundColor: checkmarkColor,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.checkLong,
                      {
                        width: sizeConfig.icon * 0.7,
                        height: 2,
                        backgroundColor: checkmarkColor,
                      },
                    ]}
                  />
                </View>
              )}
            </AnimatedView>
          </AnimatedView>
        </AnimatedView>
      </Pressable>
      {focusVisible && <View style={focusRingStyle} pointerEvents="none" accessibilityElementsHidden />}
    </View>
  );
});

CheckboxImpl.displayName = 'Checkbox';

export const Checkbox = memo(CheckboxImpl);

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
