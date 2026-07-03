/**
 * Accessibility utility tests.
 */

import { act, renderHook } from '@testing-library/react-native';
import { AccessibilityInfo, Platform } from 'react-native';

import {
  createAccessibilityProps,
  ensureMinTouchTarget,
  focusTrap,
  getLiveRegionProp,
  MIN_TOUCH_TARGET,
  useAccessibilityInfo,
} from './accessibility';

describe('ensureMinTouchTarget', () => {
  it('bumps sizes below the minimum up to 48', () => {
    expect(ensureMinTouchTarget(20)).toBe(MIN_TOUCH_TARGET);
  });

  it('leaves sizes above the minimum untouched', () => {
    expect(ensureMinTouchTarget(64)).toBe(64);
  });
});

describe('createAccessibilityProps', () => {
  it('defaults accessible to true', () => {
    expect(createAccessibilityProps({}).accessible).toBe(true);
  });

  it('respects an explicit accessible=false', () => {
    expect(createAccessibilityProps({ accessible: false }).accessible).toBe(false);
  });
});

describe('getLiveRegionProp', () => {
  it('returns the native prop off web', () => {
    // jest-expo runs with a native Platform.OS
    expect(getLiveRegionProp('assertive')).toEqual({
      accessibilityLiveRegion: 'assertive',
    });
  });

  it('defaults to polite', () => {
    expect(getLiveRegionProp()).toEqual({ accessibilityLiveRegion: 'polite' });
  });
});

describe('useAccessibilityInfo', () => {
  beforeEach(() => {
    (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(false);
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(false);
    (AccessibilityInfo.addEventListener as jest.Mock).mockReturnValue({
      remove: jest.fn(),
    });
    if (Platform.OS === 'ios') {
      (AccessibilityInfo as unknown as Record<string, unknown>).isBoldTextEnabled =
        jest.fn().mockResolvedValue(false);
    }
  });

  it('fetches initial values on mount', async () => {
    const { result } = renderHook(() => useAccessibilityInfo());

    await act(async () => {});

    expect(AccessibilityInfo.isScreenReaderEnabled).toHaveBeenCalled();
    expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalled();
    expect(result.current.screenReaderEnabled).toBe(false);
    expect(result.current.reduceMotionEnabled).toBe(false);
    expect(result.current.boldTextEnabled).toBe(false);
  });

  it('reflects an initially-enabled screen reader', async () => {
    (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useAccessibilityInfo());
    await act(async () => {});

    expect(result.current.screenReaderEnabled).toBe(true);
  });

  it('subscribes to change events and updates state', async () => {
    const { result } = renderHook(() => useAccessibilityInfo());
    await act(async () => {});

    const calls = (AccessibilityInfo.addEventListener as jest.Mock).mock.calls;
    const events = calls.map(([event]) => event);
    expect(events).toContain('screenReaderChanged');
    expect(events).toContain('reduceMotionChanged');

    const screenReaderListener = calls.find(
      ([event]) => event === 'screenReaderChanged'
    )?.[1];
    act(() => {
      screenReaderListener(true);
    });
    expect(result.current.screenReaderEnabled).toBe(true);

    const reduceMotionListener = calls.find(
      ([event]) => event === 'reduceMotionChanged'
    )?.[1];
    act(() => {
      reduceMotionListener(true);
    });
    expect(result.current.reduceMotionEnabled).toBe(true);
  });

  it('removes subscriptions on unmount', async () => {
    const remove = jest.fn();
    (AccessibilityInfo.addEventListener as jest.Mock).mockReturnValue({ remove });

    const { unmount } = renderHook(() => useAccessibilityInfo());
    await act(async () => {});
    unmount();

    const subscriptionCount = (AccessibilityInfo.addEventListener as jest.Mock).mock
      .calls.length;
    expect(remove).toHaveBeenCalledTimes(subscriptionCount);
  });
});

describe('focusTrap', () => {
  it('returns a no-op cleanup on native platforms', () => {
    const cleanup = focusTrap.activate({ current: null });
    expect(typeof cleanup).toBe('function');
    expect(() => cleanup()).not.toThrow();
  });

  it('deactivate is safe to call with no active traps', () => {
    expect(() => focusTrap.deactivate()).not.toThrow();
  });
});
