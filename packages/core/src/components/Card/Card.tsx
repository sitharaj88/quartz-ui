/**
 * Quartz UI - Card
 *
 * Three Material 3 variants. Static or interactive (interactive when `onPress`/
 * `onLongPress` provided). Interactive cards get the full a11y/animation
 * treatment: state layer, focus-visible ring, reduce-motion respect, hover.
 */

import React, {
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
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
import { ElevationLevel } from '../../tokens/elevation';
import { duration, springConfig } from '../../tokens/motion';
import { withAlpha } from '../../utils/color';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

export interface CardHandle {
  focus(): void;
  blur(): void;
}

export interface CardProps {
  variant?: CardVariant;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  disabled?: boolean;
  /** Override elevation level (only honored by elevated variant). */
  elevation?: ElevationLevel;
  radius?: 'small' | 'medium' | 'large' | number;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  enableHaptics?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Override role. Defaults to `'button'` for interactive cards, none for static. */
  accessibilityRole?: 'button' | 'link' | 'summary' | 'none';
  testID?: string;
  ref?: React.Ref<CardHandle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CardImpl = forwardRef<CardHandle, CardProps>(function Card(
  {
    variant = 'elevated',
    onPress,
    onLongPress,
    onFocus,
    onBlur,
    disabled = false,
    elevation: customElevation,
    radius = 'medium',
    padding = 'md',
    enableHaptics,
    children,
    style,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    testID,
  },
  ref
): React.ReactElement {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const viewRef = useRef<View>(null);
  const isInteractive = !!(onPress || onLongPress);

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
    if (!isInteractive) return;
    const target = pressed || focused || hovered ? 1 : 0;
    stateLayerProgress.value = reduceMotion
      ? target
      : withTiming(target, { duration: duration.short3 });
  }, [pressed, focused, hovered, reduceMotion, stateLayerProgress, isInteractive]);

  const radiusValue =
    typeof radius === 'number'
      ? radius
      : radius === 'small'
        ? theme.shape.small
        : radius === 'large'
          ? theme.shape.large
          : theme.shape.medium;

  const paddingValue =
    padding === 'none'
      ? 0
      : padding === 'sm'
        ? theme.spacing.sm
        : padding === 'lg'
          ? theme.spacing.lg
          : theme.spacing.md;

  const backgroundColor = disabled
    ? withAlpha(theme.colors.surfaceContainerHighest, 0.38)
    : variant === 'filled'
      ? theme.colors.surfaceContainerHighest
      : theme.colors.surface;

  // MD3 elevation: elevated rests at 1, presses to 2; filled/outlined rest at 0, press to 1.
  const elevationLevel: ElevationLevel =
    customElevation !== undefined
      ? customElevation
      : variant === 'elevated'
        ? pressed || hovered || focused
          ? 2
          : 1
        : pressed
          ? 1
          : 0;

  const containerStyles: StyleProp<ViewStyle> = [
    {
      backgroundColor,
      borderRadius: radiusValue,
      padding: paddingValue,
      overflow: 'hidden',
      ...(variant === 'outlined' && {
        borderWidth: 1,
        borderColor: disabled
          ? withAlpha(theme.colors.outline, 0.12)
          : theme.colors.outlineVariant,
      }),
      ...(variant === 'elevated' || elevationLevel > 0
        ? theme.elevation(elevationLevel)
        : null),
    },
    style,
  ];

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const stateLayerOpacity = pressed || focused ? 0.12 : hovered ? 0.08 : 0;
  const stateLayerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: stateLayerProgress.value * stateLayerOpacity,
  }));

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      handlers.onPressIn(e);
      if (!reduceMotion) scale.value = withSpring(0.98, springConfig.stiff);
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
      if (!reduceMotion) scale.value = withSpring(1, springConfig.gentle);
      else scale.value = 1;
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

  const focusRingStyle: ViewStyle = {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: radiusValue + 3,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  };

  const stateLayerBaseStyle: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.onSurface,
    borderRadius: radiusValue,
  };

  const webHoverProps =
    Platform.OS === 'web' && isInteractive
      ? ({
          onMouseEnter: handlers.onHoverIn,
          onMouseLeave: handlers.onHoverOut,
        } as unknown as object)
      : {};

  // ─── Static (non-interactive) card ────────────────────────────────
  if (!isInteractive) {
    return (
      <View
        ref={viewRef}
        style={containerStyles}
        accessible={!!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        testID={testID}
      >
        {children}
      </View>
    );
  }

  // ─── Interactive card ─────────────────────────────────────────────
  return (
    <View>
      <AnimatedPressable
        ref={viewRef as React.Ref<View>}
        {...webHoverProps}
        style={[containerStyles, containerAnimatedStyle]}
        onPress={handlePress}
        onLongPress={disabled ? undefined : onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        disabled={disabled}
        accessible
        accessibilityRole={accessibilityRole ?? 'button'}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        focusable={!disabled}
        testID={testID}
      >
        <Animated.View style={[stateLayerBaseStyle, stateLayerAnimatedStyle]} pointerEvents="none" />
        {children}
      </AnimatedPressable>
      {focusVisible && <View style={focusRingStyle} pointerEvents="none" accessibilityElementsHidden />}
    </View>
  );
});

CardImpl.displayName = 'Card';

export const Card = memo(CardImpl);

export default Card;
