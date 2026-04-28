// Type augmentations for properties that exist at runtime in
// react-native-web / Expo Web but aren't in the upstream React Native typings.
// Keeping this small and targeted — only what the apps actually use.

import 'react-native';

declare module 'react-native' {
  // `hovered` is provided by react-native-web's Pressable but missing from
  // the core RN type. Apps in this repo destructure it for hover styling.
  interface PressableStateCallbackType {
    hovered?: boolean;
    focused?: boolean;
  }

  // Web-only style properties that show up in our Expo Web bundles but aren't
  // in RN's ViewStyle. Cast site-by-site got tedious; we widen the type here.
  interface ViewStyle {
    backdropFilter?: string;
    position?: 'absolute' | 'relative' | 'static' | 'fixed' | 'sticky';
  }
}
