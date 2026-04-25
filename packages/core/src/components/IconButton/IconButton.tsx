/**
 * Quartz UI - IconButton
 *
 * Material 3 icon button. Four variants × three sizes, plus toggle mode.
 * Same world-class checklist as Button: forwardRef, memo, animated state layer,
 * reduce-motion, focus-visible, hitSlop to maintain ≥48dp touch target on
 * compact sizes, and proper toggle a11y semantics.
 */

import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleProp,
  TargetedEvent,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
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

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
export type IconButtonSize = 'small' | 'medium' | 'large';

/** Imperative handle for programmatic focus. */
export interface IconButtonHandle {
  focus(): void;
  blur(): void;
}

export interface IconButtonProps {
  /** Icon node — sized by `size` (18/24/28dp). */
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /**
   * Toggle-button mode: when defined, the button represents an on/off state and
   * exposes `accessibilityState.selected`. Visual treatment changes when on.
   */
  selected?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  disabled?: boolean;
  /** Force-enable or disable haptic feedback (defaults to theme setting). */
  enableHaptics?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Required — icon-only buttons MUST have an a11y label. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  testID?: string;
  ref?: React.Ref<IconButtonHandle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const sizeConfig = {
  small: { size: 32, iconSize: 18, focusOffset: 2 },
  medium: { size: 40, iconSize: 24, focusOffset: 3 },
  large: { size: 48, iconSize: 28, focusOffset: 3 },
} as const;

// MIN_TOUCH_TARGET dp from WCAG 2.5.5 — buttons smaller than this need hitSlop.
const MIN_TOUCH_TARGET = 48;

const IconButtonImpl = forwardRef<IconButtonHandle, IconButtonProps>(function IconButton(
  {
    icon,
    variant = 'standard',
    size = 'medium',
    selected,
    onPress,
    onLongPress,
    onFocus,
    onBlur,
    disabled = false,
    enableHaptics,
    style,
    accessibilityLabel,
    accessibilityHint,
    testID,
  },
  ref
): React.ReactElement {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const viewRef = useRef<View>(null);
  const isToggle = selected !== undefined;
  const sizeStyles = sizeConfig[size];

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

  const interactive = useInteractiveState({
    disabled,
    onFocus,
    onBlur,
  });
  const { pressed, hovered, focused, focusVisible, handlers } = interactive;

  const scale = useSharedValue(1);
  const stateLayerProgress = useSharedValue(0);

  useEffect(() => {
    const target = pressed || focused || hovered ? 1 : 0;
    stateLayerProgress.value = reduceMotion
      ? target
      : withTiming(target, { duration: duration.short3 });
  }, [pressed, focused, hovered, reduceMotion, stateLayerProgress]);

  // Resolve colors per variant + selected + disabled state.
  const colors = useMemo(() => {
    if (disabled) {
      return {
        background:
          variant === 'standard' || variant === 'outlined'
            ? 'transparent'
            : withAlpha(theme.colors.onSurface, 0.12),
        icon: withAlpha(theme.colors.onSurface, 0.38),
        border: variant === 'outlined' ? withAlpha(theme.colors.onSurface, 0.12) : 'transparent',
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
    }
  }, [variant, selected, disabled, theme.colors]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const stateLayerOpacity =
    pressed || focused ? 0.1 : hovered ? 0.08 : 0;

  const stateLayerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: stateLayerProgress.value * stateLayerOpacity,
  }));

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      handlers.onPressIn(e);
      if (reduceMotion) {
        scale.value = 0.9;
      } else {
        scale.value = withSpring(0.9, springConfig.stiff);
      }
      const hapticsOn = enableHaptics ?? theme.accessibility.hapticFeedback;
      if (hapticsOn && !disabled && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
    },
    [handlers, reduceMotion, scale, enableHaptics, theme.accessibility.hapticFeedback, disabled]
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      handlers.onPressOut(e);
      if (reduceMotion) {
        scale.value = 1;
      } else {
        scale.value = withSpring(1, springConfig.gentle);
      }
    },
    [handlers, reduceMotion, scale]
  );

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled) return;
      onPress?.(e);
    },
    [disabled, onPress]
  );

  // Bring touch target up to WCAG 2.5.5 (44–48dp). hitSlop expands the
  // tappable area without affecting layout.
  const hitSlopExpand = Math.max(0, (MIN_TOUCH_TARGET - sizeStyles.size) / 2);
  const hitSlop =
    hitSlopExpand > 0
      ? { top: hitSlopExpand, bottom: hitSlopExpand, left: hitSlopExpand, right: hitSlopExpand }
      : undefined;

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

  const stateLayerBaseStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: sizeStyles.size / 2,
    backgroundColor: colors.icon,
  };

  const focusRingStyle: ViewStyle = {
    position: 'absolute',
    top: -sizeStyles.focusOffset,
    left: -sizeStyles.focusOffset,
    right: -sizeStyles.focusOffset,
    bottom: -sizeStyles.focusOffset,
    borderRadius: sizeStyles.size / 2 + sizeStyles.focusOffset,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  };

  const webHoverProps =
    Platform.OS === 'web'
      ? ({
          onMouseEnter: handlers.onHoverIn,
          onMouseLeave: handlers.onHoverOut,
        } as unknown as object)
      : {};

  return (
    <View>
      <AnimatedPressable
        ref={viewRef as React.Ref<View>}
        {...webHoverProps}
        style={[buttonStyles, containerAnimatedStyle]}
        onPress={handlePress}
        onLongPress={disabled ? undefined : onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        disabled={disabled}
        hitSlop={hitSlop}
        accessible
        accessibilityRole={isToggle ? 'togglebutton' : 'button'}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled,
          ...(isToggle ? { selected } : null),
        }}
        focusable={!disabled}
        testID={testID}
      >
        <Animated.View style={[stateLayerBaseStyle, stateLayerAnimatedStyle]} pointerEvents="none" />
        <View style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}>{icon}</View>
      </AnimatedPressable>
      {focusVisible && <View style={focusRingStyle} pointerEvents="none" accessibilityElementsHidden />}
    </View>
  );
});

IconButtonImpl.displayName = 'IconButton';

export const IconButton = memo(IconButtonImpl);

export default IconButton;
