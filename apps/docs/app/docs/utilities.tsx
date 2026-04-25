import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Surface, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from '../_components/DocLayout';
import { CodePlayground } from '../_components/CodePlayground';
import Animated, { FadeInDown } from 'react-native-reanimated';

const withAlphaExample = `import { withAlpha } from 'quartz-ui';

// Hex (3, 6, or 8 digits)
withAlpha('#1A73E8', 0.12);          // 'rgba(26,115,232,0.12)'
withAlpha('#fff', 0.5);              // 'rgba(255,255,255,0.5)'
withAlpha('#1A73E880', 0.5);         // multiplies existing 50% × 50% = 25%

// rgb / rgba
withAlpha('rgb(10, 20, 30)', 0.7);   // 'rgba(10,20,30,0.7)'
withAlpha('rgba(10,20,30,0.5)', 0.5);// 'rgba(10,20,30,0.25)'

// Edge cases
withAlpha('transparent', 0.5);       // 'transparent'
withAlpha('not-a-color', 0.5);       // returns input unchanged`;

const contrastExample = `import { contrastRatio, luminance } from 'quartz-ui';

// WCAG luminance (0–1)
luminance('#FFFFFF');          // 1
luminance('#000000');          // 0
luminance('#1A73E8');          // 0.18…

// WCAG contrast ratio (1–21)
contrastRatio('#FFFFFF', '#000000');  // 21
contrastRatio('#1A73E8', '#FFFFFF');  // 4.78 — passes AA for normal text

// Validate against WCAG thresholds:
//   AA  normal: ≥4.5,  large: ≥3
//   AAA normal: ≥7,    large: ≥4.5
const ratio = contrastRatio(theme.colors.primary, theme.colors.onPrimary);
if (ratio < 4.5) {
  console.warn('Primary/onPrimary fails AA contrast');
}`;

const pickForegroundExample = `import { pickForeground } from 'quartz-ui';

// Pick the higher-contrast foreground for a custom container.
// Default candidates: white and black.
pickForeground('#FFFFFF');           // '#000000'
pickForeground('#000000');           // '#FFFFFF'
pickForeground('#1A73E8');           // '#FFFFFF' (blue → white text)
pickForeground('#FFD700');           // '#000000' (yellow → black text)

// Custom candidates (e.g., your theme's neutral pair)
pickForeground('#262626', '#EEEEEE', '#222222'); // '#EEEEEE'

// This is what Button does when you pass a custom \`color\` prop:
//   <Button color="#FFD700" /> auto-picks black foreground for AA contrast.`;

const utilities = [
  {
    name: 'withAlpha',
    icon: 'color-filter',
    summary:
      'Apply an alpha channel to any color string. Replaces fragile hex+opacity concatenation that breaks on shorthand hex, rgb(), rgba(), and named colors.',
    signature: '(color: string, alpha: number) => string',
    notes: [
      'Multiplies with any existing alpha — `withAlpha("rgba(0,0,0,0.5)", 0.5) → 0.25`',
      'Clamps the alpha to [0, 1]',
      'Returns "transparent" for alpha=0 or for "transparent"/"none" inputs',
      'Returns the input unchanged if it can\'t parse it',
    ],
    example: withAlphaExample,
    gradient: ['#667eea', '#764ba2'] as const,
  },
  {
    name: 'luminance / contrastRatio',
    icon: 'contrast',
    summary:
      'WCAG-spec relative luminance and contrast ratio between two colors. Use to validate that custom theme colors hit AA / AAA targets.',
    signature: 'luminance(color) → 0..1\ncontrastRatio(a, b) → 1..21',
    notes: [
      'AA contrast minimums: 4.5 for normal text, 3 for large text (≥18pt or 14pt bold)',
      'AAA contrast minimums: 7 for normal text, 4.5 for large text',
      'Used internally by `pickForeground` and by Button\'s custom-color path',
    ],
    example: contrastExample,
    gradient: ['#43e97b', '#38f9d7'] as const,
  },
  {
    name: 'pickForeground',
    icon: 'eye',
    summary:
      'Pick the higher-contrast foreground color (default: black or white) for a given background. Used internally when consumers override container colors.',
    signature: '(bg, light?, dark?) => string',
    notes: [
      'Default candidates are #FFFFFF and #000000',
      'Pass custom candidates to match your theme\'s neutral pair',
      'Button automatically uses this when you pass a custom `color` prop',
      'Saves you from manual contrast calculations on every override',
    ],
    example: pickForegroundExample,
    gradient: ['#fa709a', '#fee140'] as const,
  },
];

export default function UtilitiesPage() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <DocLayout
      title="Utilities"
      description="Color helpers used internally across every Quartz UI component. Exported for your own theming and contrast work."
    >
      {/* Why */}
      <View style={styles.section}>
        <Surface style={[styles.calloutCard, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={0}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <Ionicons name="bulb" size={28} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '700', marginBottom: 4 }}>
                Why these exist
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, lineHeight: 22 }}>
                The codebase used to do <Text style={{ fontFamily: 'monospace' }}>color + '1F'</Text> for opacity. That breaks for 3-digit hex (<Text style={{ fontFamily: 'monospace' }}>#fff1F</Text> isn't valid), rgb()/rgba() inputs, and named colors. <Text style={{ fontFamily: 'monospace' }}>withAlpha</Text> handles them all correctly and the rest of these utilities follow the same robustness bar.
              </Text>
            </View>
          </View>
        </Surface>
      </View>

      {/* Utilities */}
      {utilities.map((u, i) => (
        <Animated.View
          key={u.name}
          entering={FadeInDown.delay(i * 80).springify().damping(15)}
          style={styles.section}
        >
          {/* Header */}
          <View style={[styles.utilHeader, { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 16 }]}>
            <View style={[styles.utilIconBox]}>
              <View style={[styles.utilIconInner, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name={u.icon as any} size={32} color={theme.colors.onPrimary} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '800', fontFamily: 'monospace' }}>
                {u.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  marginTop: 6,
                  fontFamily: 'monospace',
                  fontSize: 13,
                }}
              >
                {u.signature}
              </Text>
            </View>
          </View>

          {/* Summary */}
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginTop: 16, lineHeight: 26 }}>
            {u.summary}
          </Text>

          {/* Notes */}
          <Surface
            style={[
              styles.notesCard,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            elevation={0}
          >
            {u.notes.map((n) => (
              <View key={n} style={styles.noteRow}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} style={{ marginTop: 2 }} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
                  {n}
                </Text>
              </View>
            ))}
          </Surface>

          {/* Example */}
          <View style={{ marginTop: 16 }}>
            <CodePlayground code={u.example} title="Example" />
          </View>
        </Animated.View>
      ))}

      {/* Coda — token subpath */}
      <View style={styles.section}>
        <Surface style={[styles.codaCard, { backgroundColor: theme.colors.surfaceContainerHighest }]} elevation={0}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Ionicons name="code-slash" size={22} color={theme.colors.primary} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              Tree-shake-friendly tokens
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22, marginBottom: 12 }}>
            If you only need design tokens (colors, spacing, typography, motion, elevation) without pulling in any components, import from the <Text style={{ fontFamily: 'monospace', fontWeight: '700' }}>quartz-ui/tokens</Text> subpath:
          </Text>
          <CodePlayground
            title=""
            code={`import { colors, spacing, typography } from 'quartz-ui/tokens';

// Just 2.28 KB brotli — no components included.`}
          />
        </Surface>
      </View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 48 },
  calloutCard: { padding: 20, borderRadius: 16 },
  utilHeader: { marginBottom: 8 },
  utilIconBox: { padding: 4 },
  utilIconInner: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesCard: {
    padding: 20,
    borderRadius: 14,
    marginTop: 16,
    gap: 12,
  },
  noteRow: { flexDirection: 'row', gap: 10 },
  codaCard: { padding: 24, borderRadius: 16 },
});
