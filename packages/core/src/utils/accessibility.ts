/**
 * Quartz UI - Accessibility Utilities
 *
 * Helpers for building accessible components
 */

import { useEffect, useState } from 'react';
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

export interface AccessibilityInfoState {
  /** True while a screen reader (VoiceOver / TalkBack / web SR bridge) is active. */
  screenReaderEnabled: boolean;
  /** True when the OS-level "reduce motion" preference is on. */
  reduceMotionEnabled: boolean;
  /** True when the iOS "Bold Text" setting is on. Always false on other platforms. */
  boldTextEnabled: boolean;
  /** Convenience passthrough to announce a message to screen readers. */
  announceForAccessibility: (message: string) => void;
}

/**
 * Hook to subscribe to accessibility state changes.
 *
 * Fetches the current values on mount and subscribes to
 * 'screenReaderChanged', 'reduceMotionChanged' and (iOS only)
 * 'boldTextChanged' events, cleaning up all subscriptions on unmount.
 *
 * Platforms that do not implement a given query/event (e.g. boldText on
 * Android/web) are guarded so the hook degrades gracefully to `false`.
 */
export function useAccessibilityInfo(): AccessibilityInfoState {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const [boldTextEnabled, setBoldTextEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    const safeSet = (setter: (value: boolean) => void) => (value: boolean) => {
      if (mounted) setter(value);
    };

    AccessibilityInfo.isScreenReaderEnabled()
      .then(safeSet(setScreenReaderEnabled))
      .catch(() => {
        // Not implemented on this platform — treat as off.
      });

    AccessibilityInfo.isReduceMotionEnabled()
      .then(safeSet(setReduceMotionEnabled))
      .catch(() => {
        // Some platforms (older RN web) may not implement this — treat as off.
      });

    const screenReaderSub = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      safeSet(setScreenReaderEnabled)
    );
    const reduceMotionSub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      safeSet(setReduceMotionEnabled)
    );

    // Bold text is iOS-only; guard so Android/web don't warn or throw.
    let boldTextSub: { remove: () => void } | undefined;
    if (Platform.OS === 'ios') {
      try {
        AccessibilityInfo.isBoldTextEnabled()
          .then(safeSet(setBoldTextEnabled))
          .catch(() => {
            // Treat as off if unavailable.
          });
        boldTextSub = AccessibilityInfo.addEventListener(
          'boldTextChanged',
          safeSet(setBoldTextEnabled)
        );
      } catch {
        // Older RN versions may not expose the bold-text API at all.
      }
    }

    return () => {
      mounted = false;
      screenReaderSub.remove();
      reduceMotionSub.remove();
      boldTextSub?.remove();
    };
  }, []);

  return {
    screenReaderEnabled,
    reduceMotionEnabled,
    boldTextEnabled,
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

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** Cleanup function returned by {@link focusTrap.activate}. */
export type FocusTrapCleanup = () => void;

/** Resolve a ref object or a raw element to an HTMLElement (web only). */
function resolveElement(container: unknown): HTMLElement | null {
  const candidate =
    container && typeof container === 'object' && 'current' in container
      ? (container as { current: unknown }).current
      : container;
  return typeof HTMLElement !== 'undefined' && candidate instanceof HTMLElement
    ? candidate
    : null;
}

function getFocusableDescendants(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

/** Registry of active trap cleanups so `deactivate()` can release them. */
const activeTraps = new Set<FocusTrapCleanup>();

/**
 * Focus trap utilities for modals and dialogs.
 *
 * Web only: traps Tab / Shift+Tab cycling within the focusable descendants
 * of a container. On native platforms this is a no-op — focus order for
 * modal views is handled by the OS (e.g. `accessibilityViewIsModal`).
 */
export const focusTrap = {
  /**
   * Trap focus within a container (web only).
   *
   * @param container - The container element, or a React ref to it
   *   (`{ current: HTMLElement }`).
   * @returns A cleanup function that releases the trap. On native (or if the
   *   container cannot be resolved) it returns a no-op cleanup.
   */
  activate: (container: unknown): FocusTrapCleanup => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return () => {};
    }

    const element = resolveElement(container);
    if (!element) {
      return () => {};
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusable = getFocusableDescendants(element);
      if (focusable.length === 0) {
        // Nothing focusable inside — keep focus on the container itself.
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !element.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !element.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    const cleanup: FocusTrapCleanup = () => {
      element.removeEventListener('keydown', handleKeyDown);
      activeTraps.delete(cleanup);
    };
    activeTraps.add(cleanup);
    return cleanup;
  },

  /**
   * Release all active focus traps (web only).
   *
   * Kept for backward compatibility — prefer calling the cleanup function
   * returned by {@link focusTrap.activate}.
   */
  deactivate: (): void => {
    for (const cleanup of Array.from(activeTraps)) {
      cleanup();
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
