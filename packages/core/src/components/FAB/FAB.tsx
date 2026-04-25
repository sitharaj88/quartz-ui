/**
 * Quartz UI - Floating Action Button (FAB)
 *
 * Three sizes (40 / 56 / 96), four color variants. Extended FAB when a `label`
 * is provided alongside the regular size. Same world-class checklist as Button.
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
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
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

export type FABSize = 'small' | 'regular' | 'large';
export type FABColor = 'primary' | 'secondary' | 'tertiary' | 'surface';

export interface FABHandle {
  focus(): void;
  blur(): void;
}

export interface FABProps {
  icon: ReactNode;
  /** Optional label — when set with `size='regular'` produces the extended FAB. */
  label?: string;
  color?: FABColor;
  size?: FABSize;
  lowered?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  enableHaptics?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Required — FABs are icon-only by default and need an a11y label. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  testID?: string;
  ref?: React.Ref<FABHandle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const sizeConfig = {
  small: { size: 40, iconSize: 24, radius: 12 },
  regular: { size: 56, iconSize: 24, radius: 16 },
  large: { size: 96, iconSize: 36, radius: 28 },
} as const;

const FABImpl = forwardRef<FABHandle, FABProps>(function FAB(
  {
    icon,
    label,
    color = 'primary',
    size = 'regular',
    lowered = false,
    onPress,
    onLongPress,
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
  const sizeStyles = sizeConfig[size];
  const isExtended = !!label && size === 'regular';

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
  const { pressed, hovered, focused, focusVisible, handlers } = interactive;

  const scale = useSharedValue(1);
  const stateLayerProgress = useSharedValue(0);

  useEffect(() => {
    const target = pressed || focused || hovered ? 1 : 0;
    stateLayerProgress.value = reduceMotion
      ? target
      : withTiming(target, { duration: duration.short3 });
  }, [pressed, focused, hovered, reduceMotion, stateLayerProgress]);

  const colors = disabled
    ? {
        container: withAlpha(theme.colors.onSurface, 0.12),
        content: withAlpha(theme.colors.onSurface, 0.38),
      }
    : color === 'primary'
      ? { container: theme.colors.primaryContainer, content: theme.colors.onPrimaryContainer }
      : color === 'secondary'
        ? { container: theme.colors.secondaryContainer, content: theme.colors.onSecondaryContainer }
        : color === 'tertiary'
          ? { container: theme.colors.tertiaryContainer, content: theme.colors.onTertiaryContainer }
          : { container: theme.colors.surfaceContainerHigh, content: theme.colors.primary };

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
      if (!reduceMotion) scale.value = withSpring(0.95, springConfig.stiff);
      const hapticsOn = enableHaptics ?? theme.accessibility.hapticFeedback;
      if (hapticsOn && !disabled && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
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

  const elevationLevel = lowered ? 0 : 3;

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
      ...theme.elevation(elevationLevel as 0 | 1 | 2 | 3 | 4 | 5),
    },
    style,
  ];

  const stateLayerBaseStyle: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    borderRadius: sizeStyles.radius,
    backgroundColor: colors.content,
  };

  const focusRingStyle: ViewStyle = {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: sizeStyles.radius + 3,
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
        style={[fabStyles, containerAnimatedStyle]}
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        focusable={!disabled}
        testID={testID}
      >
        <Animated.View style={[stateLayerBaseStyle, stateLayerAnimatedStyle]} pointerEvents="none" />
        <View style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}>{icon}</View>
        {isExtended && (
          <Text style={{ ...theme.typography.labelLarge, color: colors.content }}>{label}</Text>
        )}
      </AnimatedPressable>
      {focusVisible && <View style={focusRingStyle} pointerEvents="none" accessibilityElementsHidden />}
    </View>
  );
});

FABImpl.displayName = 'FAB';

export const FAB = memo(FABImpl);

export default FAB;
