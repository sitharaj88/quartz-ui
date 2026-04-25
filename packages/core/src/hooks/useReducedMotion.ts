/**
 * Quartz UI - useReducedMotion Hook
 *
 * Reactive subscription to the OS-level "reduce motion" accessibility preference.
 * Respects the theme override too (theme.motion.reducedMotion forces it on).
 *
 * Use this in animated components to skip / shorten animations for users who
 * have requested reduced motion.
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Returns `true` if either:
 *   - the OS has Reduce Motion enabled, or
 *   - `theme.motion.reducedMotion` is true.
 *
 * Subscribes to changes and re-renders the consumer when the OS setting flips.
 */
export function useReducedMotion(): boolean {
  const theme = useTheme();
  const [osReduced, setOsReduced] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) {
          setOsReduced((prev) => (prev === value ? prev : value));
        }
      })
      .catch(() => {
        // Some platforms (older RN web) may not implement this — treat as off.
      });

    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
      setOsReduced(value);
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return osReduced || theme.motion.reducedMotion;
}
