/**
 * Type helpers for react-native-web-only features that React Native's
 * type definitions don't know about.
 */

import type { PressableStateCallbackType, ViewStyle } from 'react-native';

/** react-native-web adds `hovered` to Pressable's state callback. */
export type WebPressableState = PressableStateCallbackType & { hovered?: boolean };

/** Cast web-only CSS (position:'fixed', backdropFilter, …) to a ViewStyle. */
export const webStyle = (style: Record<string, unknown>): ViewStyle => style as ViewStyle;
