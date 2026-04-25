/**
 * Jest setup — mocks for native modules.
 *
 * Loaded before each test file. Add mocks here, not in individual tests.
 */

/* eslint-disable no-undef, @typescript-eslint/no-var-requires */

// Eagerly install __ExpoImportMetaRegistry as a noop. Otherwise Expo's lazy
// global getter triggers a require() during teardown, which Jest 30 rejects
// with "outside the scope of the test code".
if (typeof globalThis !== 'undefined' && !('__ExpoImportMetaRegistry' in globalThis)) {
  Object.defineProperty(globalThis, '__ExpoImportMetaRegistry', {
    value: { register() {}, get() {} },
    configurable: true,
    writable: true,
  });
}

// Reanimated has a built-in mock that disables animations and turns shared
// values into plain JS objects. Required to avoid "Cannot read property
// 'value' of undefined" in tests.
require('react-native-reanimated/mock');

// Gesture handler — official jest setup mocks the native module + transforms.
require('react-native-gesture-handler/jestSetup');

// expo-haptics — fully mocked; tests that care assert these were called.
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

// expo-linear-gradient — render as a View so layout tests work.
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: View };
});

// AccessibilityInfo — patched on the public RN namespace because the deep
// import path moved across RN versions. Defaults: reduce-motion off, screen
// reader off; tests can spy on `announceForAccessibility`.
const RN = require('react-native');
RN.AccessibilityInfo = {
  ...(RN.AccessibilityInfo || {}),
  isReduceMotionEnabled: jest.fn().mockResolvedValue(false),
  isScreenReaderEnabled: jest.fn().mockResolvedValue(false),
  addEventListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  announceForAccessibility: jest.fn(),
  setAccessibilityFocus: jest.fn(),
};

