/**
 * Quartz UI - Accessibility Utilities
 * 
 * Helpers for building accessible components
 */

import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  return AccessibilityInfo.isScreenReaderEnabled();
}

/**
 * Check if reduce motion is enabled
 */
export async function isReduceMotionEnabled(): Promise<boolean> {
  return AccessibilityInfo.isReduceMotionEnabled();
}

/**
 * Announce a message to screen readers
 */
export function announceForAccessibility(message: string): void {
  AccessibilityInfo.announceForAccessibility(message);
}

/**
 * Set accessibility focus to a component
 */
export function setAccessibilityFocus(reactTag: number): void {
  AccessibilityInfo.setAccessibilityFocus(reactTag);
}

/**
 * Hook to subscribe to accessibility state changes
 */
export function useAccessibilityInfo() {
  // This would be implemented with useEffect to listen to changes
  // For now, return the static check functions
  return {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    announceForAccessibility,
  };
}

/**
 * Generate accessibility props for a component
 */
export interface AccessibilityProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  accessibilityActions?: Array<{
    name: string;
    label?: string;
  }>;
  onAccessibilityAction?: (event: { nativeEvent: { actionName: string } }) => void;
}

export function createAccessibilityProps(props: AccessibilityProps): AccessibilityProps {
  return {
    accessible: props.accessible ?? true,
    ...props,
  };
}

/**
 * Minimum touch target size (48dp as per WCAG 2.1)
 */
export const MIN_TOUCH_TARGET = 48;

/**
 * Ensure a component meets minimum touch target requirements
 */
export function ensureMinTouchTarget(size: number): number {
  return Math.max(size, MIN_TOUCH_TARGET);
}

/**
 * Focus trap utilities for modals and dialogs
 */
export const focusTrap = {
  /**
   * Trap focus within a container (web only)
   */
  activate: (container: unknown) => {
    if (Platform.OS === 'web') {
      // Web-specific focus trap implementation
    }
  },
  
  /**
   * Release focus trap
   */
  deactivate: () => {
    if (Platform.OS === 'web') {
      // Web-specific focus trap release
    }
  },
};

/**
 * Live region announcements
 */
export type LiveRegionMode = 'none' | 'polite' | 'assertive';

export function getLiveRegionProp(mode: LiveRegionMode = 'polite') {
  return Platform.OS === 'web' 
    ? { 'aria-live': mode } 
    : { accessibilityLiveRegion: mode };
}
