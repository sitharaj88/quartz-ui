/**
 * Quartz UI - Chip
 *
 * Material 3 chip with four flavors: assist, filter, input, suggestion.
 * Filter chips behave as toggle buttons (role=togglebutton + selected state).
 * Input chips can have an avatar/leading + a close button.
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

export type ChipVariant = 'assist' | 'filter' | 'input' | 'suggestion';

export interface ChipHandle {
  focus(): void;
  blur(): void;
}

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  /** Selected state. For `filter` chips this also makes role=togglebutton. */
  selected?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  avatar?: ReactNode;
  /** Render as elevated (filled background) instead of outlined. */
  elevated?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  /** Show a close button (input chips). */
  onClose?: () => void;
  disabled?: boolean;
  enableHaptics?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  ref?: React.Ref<ChipHandle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ChipImpl = forwardRef<ChipHandle, ChipProps>(function Chip(
  {
    label,
    variant = 'assist',
    selected,
    leadingIcon,
    trailingIcon,
    avatar,
    elevated = false,
    onPress,
    onClose,
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
  const isToggle = variant === 'filter' && selected !== undefined;

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
        outline: withAlpha(theme.colors.onSurface, 0.12),
        label: withAlpha(theme.colors.onSurface, 0.38),
        stateLayer: theme.colors.onSurface,
      }
    : selected
      ? {
          container: theme.colors.secondaryContainer,
          outline: 'transparent',
          label: theme.colors.onSecondaryContainer,
          stateLayer: theme.colors.onSecondaryContainer,
        }
      : {
          container: elevated ? theme.colors.surfaceContainerLow : 'transparent',
          outline: theme.colors.outline,
          label: theme.colors.onSurfaceVariant,
          stateLayer: theme.colors.onSurfaceVariant,
        };

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

  const handleClose = useCallback(
    (e: GestureResponderEvent) => {
      e?.stopPropagation?.();
      if (!disabled) onClose?.();
    },
    [disabled, onClose]
  );

  // RTL-aware paddings.
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

  const stateLayerBaseStyle: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    backgroundColor: colors.stateLayer,
  };

  const focusRingStyle: ViewStyle = {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 11,
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
        style={[chipStyles, containerAnimatedStyle]}
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        disabled={disabled}
        accessible
        accessibilityRole={isToggle ? 'togglebutton' : 'button'}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled, ...(selected !== undefined ? { selected } : null) }}
        focusable={!disabled}
        testID={testID}
      >
        <Animated.View style={[stateLayerBaseStyle, stateLayerAnimatedStyle]} pointerEvents="none" />

        {avatar && (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {avatar}
          </View>
        )}

        {!avatar && leadingIcon && <View style={{ width: 18, height: 18 }}>{leadingIcon}</View>}

        <Text
          style={{ ...theme.typography.labelLarge, color: colors.label }}
          numberOfLines={1}
        >
          {label}
        </Text>

        {(trailingIcon || (variant === 'input' && onClose)) && (
          <Pressable
            onPress={onClose ? handleClose : undefined}
            style={{ width: 18, height: 18 }}
            accessible={!!onClose}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${label}`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {trailingIcon || (
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: theme.colors.onSurfaceVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: theme.colors.surface, fontSize: 12 }}>×</Text>
              </View>
            )}
          </Pressable>
        )}
      </AnimatedPressable>
      {focusVisible && <View style={focusRingStyle} pointerEvents="none" accessibilityElementsHidden />}
    </View>
  );
});

ChipImpl.displayName = 'Chip';

export const Chip = memo(ChipImpl);

export default Chip;
