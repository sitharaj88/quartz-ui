/**
 * Quartz UI - Button Component
 *
 * Material 3 button, built for production:
 *   • forwardRef with imperative focus()/blur()
 *   • animated state layer (opacity transitions match MD3 motion spec)
 *   • respects OS reduce-motion (skips scale + state layer transitions)
 *   • keyboard focus ring via focus-visible (no ring for pointer users)
 *   • toggle mode via `selected` (sets accessibilityState + aria-pressed)
 *   • screen-reader announces loading state changes
 *   • RTL-aware (logical paddings, direction-driven flex)
 *   • zero re-renders during press/hover (reanimated shared values)
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
  AccessibilityInfo,
  ActivityIndicator,
  GestureResponderEvent,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useInteractiveState } from '../../hooks/useInteractiveState';
import { springConfig, duration } from '../../tokens/motion';
import { ButtonHandle, ButtonProps } from './Button.types';
import { createButtonStyles } from './Button.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ButtonImpl = forwardRef<ButtonHandle, ButtonProps>(function Button(
  {
    children,
    label,
    variant = 'filled',
    size = 'medium',
    icon,
    iconPosition = 'left',
    iconOnly: iconOnlyProp,
    loading = false,
    disabled = false,
    selected,
    fullWidth = false,
    color,
    textColor,
    style,
    labelStyle,
    contentStyle,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    onFocus,
    onBlur,
    enableHaptics,
    loadingAccessibilityLabel = 'Loading',
    accessibilityLabel,
    accessibilityHint,
    accessibilityState: accessibilityStateProp,
    testID,
    ...pressableProps
  },
  ref
): React.ReactElement {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const viewRef = useRef<View>(null);

  // Auto-detect icon-only when no label/children + an icon is provided.
  const buttonContent = label ?? children;
  const iconOnly = iconOnlyProp ?? (!buttonContent && !!icon);
  const isDisabled = disabled || loading;
  const isToggle = selected !== undefined;

  // ─── Imperative handle ──────────────────────────────────────────────
  useImperativeHandle(
    ref,
    () => ({
      focus() {
        // View exposes focus() on web (HTMLElement) and on native via the
        // host platform; missing on some renderers, so guard.
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

  // ─── Interactive state ──────────────────────────────────────────────
  const interactive = useInteractiveState({
    disabled: isDisabled,
    onPressIn,
    onPressOut,
    onFocus,
    onBlur,
  });
  const { pressed, hovered, focused, focusVisible, handlers } = interactive;

  // ─── Animated values (no re-render during press/hover) ──────────────
  const scale = useSharedValue(1);
  const stateLayerProgress = useSharedValue(0); // 0 = rest, 1 = active

  // Drive state-layer progress from interaction state.
  useEffect(() => {
    const target = pressed || focused || hovered ? 1 : 0;
    stateLayerProgress.value = reduceMotion
      ? target
      : withTiming(target, { duration: duration.short3 });
  }, [pressed, focused, hovered, reduceMotion, stateLayerProgress]);

  // ─── Static styles (the layer's animated opacity is applied via animatedStyle) ──
  const styles = useMemo(
    () =>
      createButtonStyles(variant, size, theme, {
        disabled: isDisabled,
        pressed,
        hovered,
        focused,
        fullWidth,
        hasIcon: !!icon || loading,
        iconPosition,
        iconOnly,
        containerOverride: color,
        textColorOverride: textColor,
      }),
    [
      variant,
      size,
      theme,
      isDisabled,
      pressed,
      hovered,
      focused,
      fullWidth,
      icon,
      loading,
      iconPosition,
      iconOnly,
      color,
      textColor,
    ]
  );

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const stateLayerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: stateLayerProgress.value * styles.stateLayerOpacity,
  }));

  // ─── Press handlers ─────────────────────────────────────────────────
  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      handlers.onPressIn(event);
      if (reduceMotion) {
        scale.value = 0.98;
      } else {
        scale.value = withSpring(0.98, springConfig.stiff);
      }
      const hapticsOn = enableHaptics ?? theme.accessibility.hapticFeedback;
      if (hapticsOn && !isDisabled && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
          // Haptics may fail on simulator — non-fatal.
        });
      }
    },
    [handlers, reduceMotion, scale, enableHaptics, theme.accessibility.hapticFeedback, isDisabled]
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      handlers.onPressOut(event);
      if (reduceMotion) {
        scale.value = 1;
      } else {
        scale.value = withSpring(1, springConfig.gentle);
      }
    },
    [handlers, reduceMotion, scale]
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (isDisabled) return;
      onPress?.(event);
    },
    [isDisabled, onPress]
  );

  // ─── Loading state announcements ───────────────────────────────────
  const wasLoading = useRef(loading);
  useEffect(() => {
    if (loading && !wasLoading.current && theme.accessibility.announceMessages) {
      AccessibilityInfo.announceForAccessibility(loadingAccessibilityLabel);
    }
    wasLoading.current = loading;
  }, [loading, loadingAccessibilityLabel, theme.accessibility.announceMessages]);

  // ─── Web mouse hover (typed; no @ts-ignore) ────────────────────────
  const webHoverProps =
    Platform.OS === 'web'
      ? ({
          onMouseEnter: handlers.onHoverIn,
          onMouseLeave: handlers.onHoverOut,
        } as unknown as object)
      : {};

  // ─── Accessibility ─────────────────────────────────────────────────
  const a11yLabel =
    accessibilityLabel ?? (typeof buttonContent === 'string' ? buttonContent : undefined);

  const finalAccessibilityState = {
    disabled: isDisabled,
    busy: loading,
    ...(isToggle ? { selected } : null),
    ...accessibilityStateProp,
  };

  // ─── Color resolution for in-button content ────────────────────────
  const finalTextColor = textColor ?? styles.label.color;
  const loadingColor =
    typeof finalTextColor === 'string' && finalTextColor !== ''
      ? finalTextColor
      : variant === 'filled'
        ? theme.colors.onPrimary
        : theme.colors.primary;

  return (
    <View style={fullWidth ? { alignSelf: 'stretch' } : undefined}>
      <AnimatedPressable
        ref={viewRef as React.Ref<View>}
        {...pressableProps}
        {...webHoverProps}
        style={[styles.container, style, containerAnimatedStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={onLongPress}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        disabled={isDisabled}
        accessible
        accessibilityRole={isToggle ? 'togglebutton' : 'button'}
        accessibilityLabel={a11yLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={finalAccessibilityState}
        accessibilityLiveRegion={loading ? 'polite' : 'none'}
        focusable={!isDisabled}
        testID={testID}
      >
        {/* Animated state layer (hover/focus/press) */}
        <Animated.View style={[styles.stateLayer, stateLayerAnimatedStyle]} pointerEvents="none" />

        <View style={[styles.content, contentStyle]}>
          {loading && (
            <ActivityIndicator size="small" color={loadingColor} style={styles.icon} />
          )}
          {!loading && icon && <View style={styles.icon}>{icon}</View>}
          {buttonContent && typeof buttonContent === 'string' ? (
            <Text
              style={[
                styles.label,
                finalTextColor ? { color: finalTextColor } : undefined,
                labelStyle,
              ]}
              numberOfLines={1}
            >
              {buttonContent}
            </Text>
          ) : (
            buttonContent
          )}
        </View>
      </AnimatedPressable>

      {/* Focus-visible ring — outside Pressable so it can extend past the radius. */}
      {focusVisible && (
        <View style={styles.focusRing} pointerEvents="none" accessibilityElementsHidden />
      )}
    </View>
  );
});

ButtonImpl.displayName = 'Button';

/**
 * Button — Material 3 button with five variants and full a11y/RTL/reduce-motion support.
 */
export const Button = memo(ButtonImpl);

export default Button;
