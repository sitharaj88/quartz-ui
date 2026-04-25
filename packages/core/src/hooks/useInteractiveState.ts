/**
 * Quartz UI - useInteractiveState Hook
 *
 * Consolidates the four interactive states every pressable surface needs:
 * pressed, hovered, focused (focus-visible), and disabled. Returns ready-to-spread
 * handlers that compose with user-supplied callbacks.
 *
 * Used by Button, IconButton, Card (interactive), Chip, FAB, ListItem, etc.
 */

import { useCallback, useState } from 'react';
import type { GestureResponderEvent, NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { useFocusVisible } from './useFocusVisible';

export interface InteractiveStateOptions {
  disabled?: boolean;
  onPressIn?: ((e: GestureResponderEvent) => void) | null;
  onPressOut?: ((e: GestureResponderEvent) => void) | null;
  onHoverIn?: (() => void) | null;
  onHoverOut?: (() => void) | null;
  onFocus?: ((e: NativeSyntheticEvent<TargetedEvent>) => void) | null;
  onBlur?: ((e: NativeSyntheticEvent<TargetedEvent>) => void) | null;
}

export interface InteractiveState {
  /** Currently pressed (touch/mouse held). */
  pressed: boolean;
  /** Currently hovered (web only — always false on native). */
  hovered: boolean;
  /** Currently focused. */
  focused: boolean;
  /** Focus arrived via keyboard (focus-visible). Drives focus ring rendering. */
  focusVisible: boolean;
  /** Composed handlers — spread onto Pressable. */
  handlers: {
    onPressIn: (e: GestureResponderEvent) => void;
    onPressOut: (e: GestureResponderEvent) => void;
    onHoverIn: () => void;
    onHoverOut: () => void;
    onFocus: (e: NativeSyntheticEvent<TargetedEvent>) => void;
    onBlur: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  };
}

export function useInteractiveState(opts: InteractiveStateOptions = {}): InteractiveState {
  const { disabled, onPressIn, onPressOut, onHoverIn, onHoverOut, onFocus, onBlur } = opts;

  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fv = useFocusVisible();

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled) return;
      setPressed(true);
      onPressIn?.(e);
    },
    [disabled, onPressIn]
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      setPressed(false);
      onPressOut?.(e);
    },
    [onPressOut]
  );

  const handleHoverIn = useCallback(() => {
    if (disabled) return;
    setHovered(true);
    onHoverIn?.();
  }, [disabled, onHoverIn]);

  const handleHoverOut = useCallback(() => {
    setHovered(false);
    onHoverOut?.();
  }, [onHoverOut]);

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      fv.onFocus();
      onFocus?.(e);
    },
    [fv, onFocus]
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      fv.onBlur();
      onBlur?.(e);
    },
    [fv, onBlur]
  );

  return {
    pressed: pressed && !disabled,
    hovered: hovered && !disabled,
    focused: fv.isFocused,
    focusVisible: fv.isFocusVisible && !disabled,
    handlers: {
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      onHoverIn: handleHoverIn,
      onHoverOut: handleHoverOut,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
}
