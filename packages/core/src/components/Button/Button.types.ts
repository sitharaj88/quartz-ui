/**
 * Quartz UI - Button Types
 *
 * Material 3 button. Five variants × three sizes, with full a11y, RTL,
 * focus-visible, reduce-motion, and toggle-button support.
 *
 * Specs (medium): height 40dp, radius height/2 (stadium), padding 24dp,
 * 16dp/24dp asymmetric with icon, icon 18dp, typography labelLarge.
 */

import type { ReactNode, Ref } from 'react';
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  PressableProps,
  TargetedEvent,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import type { Size, Variant } from '../../theme/types';

export type ButtonVariant = Extract<Variant, 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'>;

/**
 * Imperative handle exposed via `ref`. Lets parents drive focus programmatically
 * (e.g. focus the primary action when a dialog opens).
 */
export interface ButtonHandle {
  /** Move keyboard / accessibility focus to the button. */
  focus(): void;
  /** Remove focus from the button. */
  blur(): void;
}

export interface ButtonProps
  extends Omit<PressableProps, 'style' | 'children' | 'onPress' | 'onLongPress'> {
  // ─── Content ──────────────────────────────────────────────────────────
  /** Children take precedence over `label`. Use a string for the standard look. */
  children?: ReactNode;
  /** Convenience prop for the common "string label" case. */
  label?: string;

  // ─── Variants ─────────────────────────────────────────────────────────
  /** Visual treatment. Defaults to `'filled'` (primary action). */
  variant?: ButtonVariant;
  /** Vertical density. Defaults to `'medium'`. */
  size?: Size;

  // ─── Icons ────────────────────────────────────────────────────────────
  /** Leading or trailing icon. Sized to match the button (16/18/20dp). */
  icon?: ReactNode;
  /** Defaults to `'left'`. RTL is handled automatically via logical paddings. */
  iconPosition?: 'left' | 'right';
  /**
   * Square, icon-only button. When `true`, padding becomes symmetric and the
   * touch target stays ≥48dp. Auto-enabled when `icon` is set and there is
   * no label/children.
   */
  iconOnly?: boolean;

  // ─── State ────────────────────────────────────────────────────────────
  /** Show a spinner and announce "loading" to screen readers. Blocks press. */
  loading?: boolean;
  /** Disabled visually and for interaction. */
  disabled?: boolean;
  /**
   * Toggle-button mode: when defined, the button represents an on/off state and
   * exposes `accessibilityState.selected` (+ `aria-pressed` on web).
   */
  selected?: boolean;

  // ─── Layout ───────────────────────────────────────────────────────────
  /** Stretch to container width instead of hugging content. */
  fullWidth?: boolean;

  // ─── Custom colors (overrides theme) ──────────────────────────────────
  /** Override container background. Foreground auto-picks for AA contrast unless `textColor` is also set. */
  color?: string;
  /** Override label/icon color. */
  textColor?: string;

  // ─── Style overrides ──────────────────────────────────────────────────
  style?: ViewStyle;
  labelStyle?: TextStyle;
  contentStyle?: ViewStyle;

  // ─── Events ───────────────────────────────────────────────────────────
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;

  // ─── Behavior ─────────────────────────────────────────────────────────
  /** Force-enable or force-disable haptic feedback (defaults to theme setting). */
  enableHaptics?: boolean;
  /** Custom message announced when `loading` flips to true. Defaults to "Loading". */
  loadingAccessibilityLabel?: string;

  // ─── Accessibility ────────────────────────────────────────────────────
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;

  // ─── Ref ──────────────────────────────────────────────────────────────
  /** Imperative handle. See `ButtonHandle`. */
  ref?: Ref<ButtonHandle>;
}

export interface ButtonStyleConfig {
  container: ViewStyle;
  content: ViewStyle;
  label: TextStyle;
  icon: ViewStyle;
  stateLayer: ViewStyle;
  focusRing: ViewStyle;
}

/** Internal — re-exported for tests. */
export type _ButtonViewRef = View;
