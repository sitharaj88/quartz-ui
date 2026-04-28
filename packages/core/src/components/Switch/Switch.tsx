/**
 * Quartz UI - Switch
 *
 * Material 3 toggle. Track + animated thumb (16dp off → 24dp on), proper RTL,
 * focus-visible ring, reduce-motion respect, controlled or uncontrolled.
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
  I18nManager,
  Platform,
  Pressable,
  StyleProp,
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
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { useInteractiveState } from '../../hooks/useInteractiveState';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { springConfig } from '../../tokens/motion';
import { withAlpha } from '../../utils/color';

export interface SwitchHandle {
  focus(): void;
  blur(): void;
}

export interface SwitchProps {
  /** Controlled value. If omitted, the switch is uncontrolled — use `defaultValue`. */
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  thumbIcon?: React.ReactNode;
  thumbIconOff?: React.ReactNode;
  disabled?: boolean;
  enableHaptics?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  ref?: React.Ref<SwitchHandle>;
}

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 32;
const THUMB_SIZE_OFF = 16;
const THUMB_SIZE_ON = 24;
const THUMB_OFFSET = 4;

const SwitchImpl = forwardRef<SwitchHandle, SwitchProps>(function Switch(
  {
    value,
    defaultValue = false,
    onValueChange,
    thumbIcon,
    thumbIconOff,
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

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const isOn = isControlled ? value! : internal;

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

  const progress = useSharedValue(isOn ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const target = isOn ? 1 : 0;
    progress.value = reduceMotion
      ? target
      : withSpring(target, springConfig.stiff);
  }, [isOn, progress, reduceMotion]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    const hapticsOn = enableHaptics ?? theme.accessibility.hapticFeedback;
    if (hapticsOn && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  }, [
    disabled,
    enableHaptics,
    theme.accessibility.hapticFeedback,
    isOn,
    isControlled,
    onValueChange,
  ]);

  const handlePressIn = useCallback(
    (e: any) => {
      handlers.onPressIn(e);
      if (!reduceMotion) scale.value = withSpring(0.95, springConfig.stiff);
    },
    [handlers, reduceMotion, scale]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      handlers.onPressOut(e);
      if (!reduceMotion) scale.value = withSpring(1, springConfig.gentle);
      else scale.value = 1;
    },
    [handlers, reduceMotion, scale]
  );

  const colors = disabled
    ? {
        trackOn: withAlpha(theme.colors.onSurface, 0.12),
        trackOff: withAlpha(theme.colors.surfaceContainerHighest, 0.12),
        thumbOn: theme.colors.surface,
        thumbOff: withAlpha(theme.colors.onSurface, 0.38),
        outline: withAlpha(theme.colors.onSurface, 0.12),
      }
    : {
        trackOn: theme.colors.primary,
        trackOff: theme.colors.surfaceContainerHighest,
        thumbOn: theme.colors.onPrimary,
        thumbOff: theme.colors.outline,
        outline: theme.colors.outline,
      };

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.trackOff, colors.trackOn]
    );
    const borderWidth = interpolate(progress.value, [0, 1], [2, 0]);
    return {
      backgroundColor,
      borderWidth,
      borderColor: colors.outline,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    const size = interpolate(progress.value, [0, 1], [THUMB_SIZE_OFF, THUMB_SIZE_ON]);
    const baseTranslateX = interpolate(
      progress.value,
      [0, 1],
      [
        THUMB_OFFSET + (THUMB_SIZE_ON - THUMB_SIZE_OFF) / 2,
        TRACK_WIDTH - THUMB_SIZE_ON - THUMB_OFFSET,
      ]
    );
    const translateX = I18nManager.isRTL ? -baseTranslateX : baseTranslateX;
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.thumbOff, colors.thumbOn]
    );
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      transform: [{ translateX }],
    };
  });

  const focusRingStyle: ViewStyle = {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: TRACK_HEIGHT / 2 + 3,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  };

  return (
    <View>
      <Pressable
        ref={viewRef as React.Ref<View>}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        disabled={disabled}
        accessible
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ checked: isOn, disabled }}
        focusable={!disabled}
        testID={testID}
        style={style}
      >
        <Animated.View
          style={[
            {
              width: TRACK_WIDTH,
              height: TRACK_HEIGHT,
              borderRadius: TRACK_HEIGHT / 2,
              justifyContent: 'center',
            },
            animatedTrackStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                [I18nManager.isRTL ? 'end' : 'start']: 0,
                alignItems: 'center',
                justifyContent: 'center',
              },
              animatedThumbStyle,
            ]}
          >
            {isOn && thumbIcon && <View style={{ width: 16, height: 16 }}>{thumbIcon}</View>}
            {!isOn && thumbIconOff && (
              <View style={{ width: 16, height: 16 }}>{thumbIconOff}</View>
            )}
          </Animated.View>
        </Animated.View>
      </Pressable>
      {focusVisible && <View style={focusRingStyle} pointerEvents="none" accessibilityElementsHidden />}
    </View>
  );
});

SwitchImpl.displayName = 'Switch';

export const Switch = memo(SwitchImpl);

export default Switch;
