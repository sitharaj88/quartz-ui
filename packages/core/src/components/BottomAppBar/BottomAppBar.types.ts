/**
 * Quartz UI - Bottom App Bar Types
 *
 * Material 3 bottom app bar. A bottom-anchored container that holds up to
 * four leading icon-button actions and an optional trailing FAB slot.
 *
 * Specs: height 80dp, container color surfaceContainer, elevation level 2,
 * safe-area aware bottom inset.
 */

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface BottomAppBarAction {
  /** Icon to display inside the 48dp touch target. */
  icon: ReactNode;
  /** Callback when the action is pressed. */
  onPress?: () => void;
  /** Accessibility label announced for the action. */
  accessibilityLabel?: string;
  /** Disables interaction and exposes the disabled state to assistive tech. */
  disabled?: boolean;
  /** Test ID for the action's pressable. */
  testID?: string;
}

export interface BottomAppBarProps {
  /** Leading icon-button actions (up to 4 are rendered). */
  actions?: BottomAppBarAction[];
  /** Trailing floating action button slot (e.g. a `FAB` element). */
  fab?: ReactNode;
  /** Whether the bar casts elevation (level 2). Defaults to `true`. */
  elevated?: boolean;
  /** Custom background color. Defaults to `theme.colors.surfaceContainer`. */
  backgroundColor?: string;
  /** Style override for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the bar itself. */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}
