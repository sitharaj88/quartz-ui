import React from 'react';
import { View, StyleSheet, useWindowDimensions, Linking } from 'react-native';
import { Text, Surface, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from '../_components/DocLayout';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const highlights = [
  {
    icon: 'sparkles',
    title: 'Animated state layers',
    description:
      'Hover, focus, and press transitions run on the UI thread via Reanimated shared values. No React re-renders during interaction.',
    gradient: ['#667eea', '#764ba2'] as const,
  },
  {
    icon: 'eye',
    title: 'Focus-visible rings',
    description:
      'New `useFocusVisible()` hook distinguishes keyboard focus from pointer focus. Rings render only for keyboard users — no UI noise on tap.',
    gradient: ['#43e97b', '#38f9d7'] as const,
  },
  {
    icon: 'eye-off',
    title: 'Reduce-motion respect',
    description:
      'New `useReducedMotion()` hook reactively subscribes to OS preference + theme override. Every animated component honors it.',
    gradient: ['#fa709a', '#fee140'] as const,
  },
  {
    icon: 'language',
    title: 'Real RTL support',
    description:
      'Logical paddings (`paddingStart`/`paddingEnd`) throughout. Direction-aware chevrons, sliders, switches.',
    gradient: ['#4facfe', '#00f2fe'] as const,
  },
  {
    icon: 'color-filter',
    title: 'WCAG AA contrast',
    description:
      'New `pickForeground()` utility auto-picks the higher-contrast text color when you override container colors. AA ratio guaranteed.',
    gradient: ['#f093fb', '#f5576c'] as const,
  },
  {
    icon: 'finger-print',
    title: 'Imperative refs',
    description:
      'Every interactive component exposes a typed `Handle` (focus/blur/clear) via forwardRef. Drive focus from parent components.',
    gradient: ['#a18cd1', '#fbc2eb'] as const,
  },
  {
    icon: 'megaphone',
    title: 'Live-region announcements',
    description:
      'Loading states, error text, snackbars, badges, and toasts announce to screen readers via `accessibilityLiveRegion="polite"`.',
    gradient: ['#ff9a9e', '#fad0c4'] as const,
  },
  {
    icon: 'resize',
    title: '≥48dp touch targets',
    description:
      'Compact controls (small Checkbox/Radio/IconButton) automatically expand their tappable area via `hitSlop` to satisfy WCAG 2.5.5.',
    gradient: ['#84fab0', '#8fd3f4'] as const,
  },
];

const breaking = [
  {
    title: 'Some components renamed exports',
    body:
      "Internal `*Impl` symbols replaced with `memo()`-wrapped exports. Public API names (`Button`, `IconButton`, …) are unchanged. Only affects consumers reaching into internals.",
  },
  {
    title: 'Hex+opacity strings replaced with `withAlpha`',
    body:
      "If you copy-pasted internal style code that did `color + '1F'`, switch to `withAlpha(color, 0.12)` from `quartz-ui`. Theme tokens are unaffected.",
  },
  {
    title: 'Version string is now valid semver',
    body:
      'The previous `1.0.0-dev.2025-02.1` is replaced with `1.0.0-alpha.1`. Subsequent alphas bump the trailing number.',
  },
];

export default function WhatsNewPage() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <DocLayout
      title="What's new in 1.0"
      description="Quartz UI 1.0.0-alpha.1 is a ground-up overhaul. Every component now satisfies the same world-class checklist."
    >
      {/* Stats banner */}
      <View style={styles.section}>
        <Surface style={styles.statsCard} elevation={2}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsGradient}
          >
            <View style={[styles.statsRow, { flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 24 : 0 }]}>
              {[
                { value: '38', label: 'Components' },
                { value: '218', label: 'Tests' },
                { value: '31 KB', label: 'Bundle (brotli)' },
                { value: '100%', label: 'TypeScript' },
              ].map((s) => (
                <View key={s.label} style={styles.stat}>
                  <Text variant="displaySmall" style={{ color: '#FFF', fontWeight: '900' }}>
                    {s.value}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Surface>
      </View>

      {/* Highlights grid */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Headline upgrades
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24, lineHeight: 26 }}>
          Every component was rebuilt to a shared rubric: API consistency, animated interaction, full a11y, RTL, reduce-motion respect, and zero re-renders during press.
        </Text>
        <View style={styles.grid}>
          {highlights.map((h, i) => (
            <Animated.View
              key={h.title}
              entering={FadeInDown.delay(i * 60).springify().damping(15)}
              style={[styles.gridItem, isMobile ? styles.gridItemMobile : styles.gridItemDesktop]}
            >
              <Surface style={[styles.featureCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                <LinearGradient
                  colors={h.gradient}
                  style={styles.featureIcon}
                >
                  <Ionicons name={h.icon as any} size={28} color="#FFF" />
                </LinearGradient>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: 16 }}>
                  {h.title}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 22 }}>
                  {h.description}
                </Text>
              </Surface>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Infrastructure */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Infrastructure
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 26 }}>
          The library is now production-ready end-to-end, not just at the component layer.
        </Text>
        <Surface style={[styles.infoCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
          {[
            ['CI', 'GitHub Actions: lint + typecheck + 218 tests + build + bundle-size on every PR'],
            ['Releases', 'Changesets-driven version bumps + automated npm publish with provenance'],
            ['Bundle', '31.06 KB brotli (40 KB budget) for the full library; 2.28 KB for tokens-only'],
            ['Tests', 'jest-expo + @testing-library/react-native, with reanimated/gesture-handler/AccessibilityInfo mocks'],
            ['Source maps', 'tsup now emits sourcemaps for production debugging'],
            ['Governance', 'CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, PR + issue templates'],
          ].map(([k, v]) => (
            <View key={k} style={styles.infoRow}>
              <View style={[styles.infoKeyPill, { backgroundColor: theme.colors.primary }]}>
                <Text variant="labelMedium" style={{ color: theme.colors.onPrimary, fontWeight: '800' }}>
                  {k}
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
                {v}
              </Text>
            </View>
          ))}
        </Surface>
      </View>

      {/* Migration */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Migration notes
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 26 }}>
          Public component APIs are largely backwards-compatible. A few items to know about:
        </Text>
        {breaking.map((b, i) => (
          <Animated.View key={b.title} entering={FadeInDown.delay(i * 60).springify().damping(15)}>
            <Surface
              style={[
                styles.breakingCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderLeftColor: theme.colors.tertiary,
                },
              ]}
              elevation={1}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Ionicons name="alert-circle" size={20} color={theme.colors.tertiary} />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                  {b.title}
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
                {b.body}
              </Text>
            </Surface>
          </Animated.View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.section}>
        <Surface style={[styles.ctaCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={1}>
          <Ionicons name="rocket" size={48} color={theme.colors.onPrimaryContainer} />
          <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '800', marginTop: 16, textAlign: 'center' }}>
            Ready to upgrade?
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onPrimaryContainer, marginTop: 8, textAlign: 'center', opacity: 0.9 }}>
            Install 1.0.0-alpha.1 and read the migration notes if you depended on internal helpers.
          </Text>
          <View style={styles.ctaButtons}>
            <Button variant="filled" onPress={() => router.push('/docs/installation' as any)}>
              Install
            </Button>
            <Button
              variant="outlined"
              onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui/blob/master/packages/core/CHANGELOG.md')}
            >
              Read full changelog
            </Button>
          </View>
        </Surface>
      </View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 48 },
  statsCard: { borderRadius: 24, overflow: 'hidden' },
  statsGradient: { padding: 32 },
  statsRow: { justifyContent: 'space-around', alignItems: 'center' },
  stat: { alignItems: 'center', flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginHorizontal: -8 },
  gridItem: { width: '100%', padding: 8 },
  gridItemMobile: { flexBasis: '100%', maxWidth: '100%' },
  gridItemDesktop: { flexBasis: '48%', maxWidth: '48%' },
  featureCard: { padding: 24, borderRadius: 20, minHeight: 200 },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: { padding: 24, borderRadius: 16, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoKeyPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    minWidth: 96,
    alignItems: 'center',
  },
  breakingCard: {
    padding: 20,
    borderRadius: 14,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  ctaCard: {
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
