import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Surface, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from '../_components/DocLayout';
import { CodePlayground } from '../_components/CodePlayground';
import Animated, { FadeInDown } from 'react-native-reanimated';

const reduceMotionExample = `import { useReducedMotion } from 'quartz-ui';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

function FadingCard() {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Honor the OS preference: snap when reduce-motion is on.
    opacity.value = reduceMotion ? 1 : withTiming(1, { duration: 300 });
  }, [reduceMotion]);

  return <Animated.View style={{ opacity }}>...</Animated.View>;
}`;

const focusVisibleExample = `import { useFocusVisible } from 'quartz-ui';

function CustomPressable({ children }) {
  const { isFocusVisible, onFocus, onBlur } = useFocusVisible();

  return (
    <View>
      <Pressable onFocus={onFocus} onBlur={onBlur}>
        {children}
      </Pressable>
      {/* Render the ring only when focus arrived via keyboard. */}
      {isFocusVisible && <FocusRing />}
    </View>
  );
}`;

const interactiveStateExample = `import { useInteractiveState } from 'quartz-ui';

function MyChip({ disabled, label }) {
  const { pressed, hovered, focusVisible, handlers } = useInteractiveState({ disabled });

  // Compose press/hover/focus visuals — handlers are pre-wired.
  const opacity = pressed ? 0.12 : hovered ? 0.08 : 0;

  return (
    <Pressable
      onPressIn={handlers.onPressIn}
      onPressOut={handlers.onPressOut}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
      // ... etc
    >
      <View style={{ opacity }} />
      <Text>{label}</Text>
      {focusVisible && <FocusRing />}
    </Pressable>
  );
}`;

const hooks = [
  {
    name: 'useReducedMotion',
    icon: 'eye-off',
    summary:
      'Reactively subscribes to the OS "Reduce Motion" accessibility preference and the theme override. Returns `true` when either is on.',
    signature: '() => boolean',
    when: 'Wrap any animation that could trigger motion sickness — page transitions, parallax, large translate/scale tweens, looping background motion.',
    example: reduceMotionExample,
  },
  {
    name: 'useFocusVisible',
    icon: 'eye',
    summary:
      'Distinguishes keyboard focus from pointer / touch focus, mirroring CSS `:focus-visible`. Focus rings should only appear for keyboard users.',
    signature: '() => { isFocusVisible, isFocused, onFocus, onBlur }',
    when: 'Wire to any custom Pressable or Touchable that needs a focus ring. Native components inside Quartz already use this — you only need it for one-off custom controls.',
    example: focusVisibleExample,
  },
  {
    name: 'useInteractiveState',
    icon: 'hand-left',
    summary:
      'Consolidates pressed / hovered / focus-visible state and returns ready-to-spread handlers. Internally uses `useFocusVisible`.',
    signature: '(opts) => { pressed, hovered, focusVisible, handlers }',
    when: 'Building a custom component that mimics Button/Chip behavior. Saves ~30 lines of state plumbing per component.',
    example: interactiveStateExample,
  },
];

export default function HooksPage() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <DocLayout
      title="Hooks"
      description="Three composable hooks power the world-class checklist every Quartz UI component satisfies. Use them when you build your own."
    >
      {/* Intro */}
      <View style={styles.section}>
        <Surface style={[styles.calloutCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <Ionicons name="information-circle" size={28} color={theme.colors.onPrimaryContainer} />
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700', marginBottom: 4 }}>
                You usually don't need these
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, lineHeight: 22 }}>
                Every built-in Quartz component already uses these hooks correctly. Reach for them when you build a custom Pressable, an animated wrapper, or an interactive primitive that doesn't fit our component vocabulary.
              </Text>
            </View>
          </View>
        </Surface>
      </View>

      {/* Hooks */}
      {hooks.map((h, i) => (
        <Animated.View
          key={h.name}
          entering={FadeInDown.delay(i * 80).springify().damping(15)}
          style={styles.section}
        >
          {/* Header */}
          <View style={[styles.hookHeader, { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 16 }]}>
            <View style={[styles.hookIconBox, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name={h.icon as any} size={32} color={theme.colors.onPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
                <Text style={{ fontFamily: 'monospace' }}>{h.name}</Text>
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, fontFamily: 'monospace', fontSize: 14 }}>
                {h.signature}
              </Text>
            </View>
          </View>

          {/* Summary */}
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginTop: 16, lineHeight: 26 }}>
            {h.summary}
          </Text>

          {/* When to use */}
          <Surface
            style={[
              styles.whenCard,
              { backgroundColor: theme.colors.surfaceVariant, borderLeftColor: theme.colors.tertiary },
            ]}
            elevation={0}
          >
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <Ionicons name="bulb" size={18} color={theme.colors.tertiary} />
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                When to reach for it
              </Text>
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
              {h.when}
            </Text>
          </Surface>

          {/* Example */}
          <View style={{ marginTop: 16 }}>
            <CodePlayground code={h.example} title="Example" />
          </View>
        </Animated.View>
      ))}

      {/* Coda */}
      <View style={styles.section}>
        <Surface style={[styles.codaCard, { backgroundColor: theme.colors.surfaceContainerHighest }]} elevation={0}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            Theme hooks
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 22 }}>
            For accessing theme values inside components, use <Text style={{ fontFamily: 'monospace', color: theme.colors.primary, fontWeight: '600' }}>useTheme()</Text>,{' '}
            <Text style={{ fontFamily: 'monospace', color: theme.colors.primary, fontWeight: '600' }}>useColors()</Text>,{' '}
            <Text style={{ fontFamily: 'monospace', color: theme.colors.primary, fontWeight: '600' }}>useTypography()</Text>, or{' '}
            <Text style={{ fontFamily: 'monospace', color: theme.colors.primary, fontWeight: '600' }}>useIsRTL()</Text>. See the{' '}
            <Text style={{ fontWeight: '700' }}>Theming</Text> guide for the full surface.
          </Text>
        </Surface>
      </View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 48 },
  calloutCard: { padding: 20, borderRadius: 16 },
  hookHeader: { marginBottom: 8 },
  hookIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whenCard: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginTop: 16,
  },
  codaCard: { padding: 24, borderRadius: 16 },
});
