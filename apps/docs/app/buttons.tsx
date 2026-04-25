import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const buttonProps: PropDefinition[] = [
  // Content
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Button content. Takes precedence over `label`.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Convenience prop for the common "string label" case.',
  },
  // Variants
  {
    name: 'variant',
    type: "'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'",
    default: "'filled'",
    description: 'Material 3 visual treatment.',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    default: "'medium'",
    description: 'Vertical density: 34dp / 40dp / 48dp.',
  },
  // Icons
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Leading or trailing icon (sized to 16/18/20dp by `size`).',
  },
  {
    name: 'iconPosition',
    type: "'left' | 'right'",
    default: "'left'",
    description: 'RTL is handled automatically via logical paddings.',
  },
  {
    name: 'iconOnly',
    type: 'boolean',
    description: 'Square icon-only mode. Auto-detected when `icon` is set without label/children.',
  },
  // State
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Shows spinner, blocks press, sets `accessibilityState.busy`, announces to screen readers.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disabled visually and for interaction.',
  },
  {
    name: 'selected',
    type: 'boolean',
    description:
      'Toggle-button mode. When defined, role becomes `togglebutton` and `accessibilityState.selected` is set.',
  },
  // Layout
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    description: 'Stretches to container width instead of hugging content.',
  },
  // Custom colors
  {
    name: 'color',
    type: 'string',
    description:
      'Override container background. Foreground auto-picks for AA contrast unless `textColor` is also set.',
  },
  {
    name: 'textColor',
    type: 'string',
    description: 'Override label / icon color.',
  },
  // Behavior
  {
    name: 'enableHaptics',
    type: 'boolean',
    description: 'Force-enable or disable haptic feedback. Defaults to `theme.accessibility.hapticFeedback`.',
  },
  {
    name: 'loadingAccessibilityLabel',
    type: 'string',
    default: "'Loading'",
    description: 'Custom message announced to screen readers when `loading` flips to true.',
  },
  // Style overrides
  {
    name: 'style',
    type: 'ViewStyle',
    description: 'Style override for the outer Pressable.',
  },
  {
    name: 'labelStyle',
    type: 'TextStyle',
    description: 'Style override for the label text.',
  },
  {
    name: 'contentStyle',
    type: 'ViewStyle',
    description: 'Style override for the inner content row.',
  },
  // Events
  {
    name: 'onPress',
    type: '(e: GestureResponderEvent) => void',
    description: 'Fired when the button is pressed (no-op when disabled or loading).',
  },
  {
    name: 'onLongPress',
    type: '(e: GestureResponderEvent) => void',
    description: 'Fired on long press.',
  },
  {
    name: 'onFocus',
    type: '(e: TargetedEvent) => void',
    description: 'Fired when the button gains focus.',
  },
  {
    name: 'onBlur',
    type: '(e: TargetedEvent) => void',
    description: 'Fired when the button loses focus.',
  },
  // Accessibility
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Defaults to the label/children text if it\'s a string.',
  },
  {
    name: 'accessibilityHint',
    type: 'string',
    description: 'Describes the action that will occur on activation.',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Forwarded to the underlying Pressable.',
  },
  // Ref
  {
    name: 'ref',
    type: 'Ref<ButtonHandle>',
    description: 'Imperative handle. See "Imperative ref" section below.',
  },
];

export default function ButtonsDocPage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <DocLayout
      title="Button"
      description="Interactive button component with multiple variants and Material Design 3 styling"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Buttons communicate actions that users can take. They are typically placed throughout your
          UI, in places like dialogs, modal windows, forms, cards, and toolbars.
        </Text>
      </Animated.View>

      {/* Import */}
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.section}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Import
        </Text>
        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace' }}
          >
            {`import { Button } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 20 }}>
          Button Variants
        </Text>

        {/* All Variants Showcase */}
        <CodePlayground
          title="All Variants"
          description="Five button variants for different emphasis levels"
          code={`<View style={{ gap: 12 }}>
  <Button variant="filled">Filled Button</Button>
  <Button variant="elevated">Elevated Button</Button>
  <Button variant="tonal">Tonal Button</Button>
  <Button variant="outlined">Outlined Button</Button>
  <Button variant="text">Text Button</Button>
</View>`}
          preview={
            <View style={{ gap: 12, alignItems: 'flex-start', width: '100%' }}>
              <Button variant="filled" onPress={() => {}} style={{ minWidth: 200 }}>
                Filled Button
              </Button>
              <Button variant="elevated" onPress={() => {}} style={{ minWidth: 200 }}>
                Elevated Button
              </Button>
              <Button variant="tonal" onPress={() => {}} style={{ minWidth: 200 }}>
                Tonal Button
              </Button>
              <Button variant="outlined" onPress={() => {}} style={{ minWidth: 200 }}>
                Outlined Button
              </Button>
              <Button variant="text" onPress={() => {}} style={{ minWidth: 200 }}>
                Text Button
              </Button>
            </View>
          }
        />

        {/* Filled Button */}
        <CodePlayground
          title="Filled Button"
          description="High emphasis buttons for primary actions"
          code={`<Button variant="filled" onPress={() => {}}>
  Primary Action
</Button>`}
          preview={
            <Button variant="filled" onPress={() => {}}>
              Primary Action
            </Button>
          }
        />

        {/* Outlined Button */}
        <CodePlayground
          title="Outlined Button"
          description="Medium emphasis buttons for secondary actions"
          code={`<Button variant="outlined" onPress={() => {}}>
  Secondary Action
</Button>`}
          preview={
            <Button variant="outlined" onPress={() => {}}>
              Secondary Action
            </Button>
          }
        />

        {/* Text Button */}
        <CodePlayground
          title="Text Button"
          description="Low emphasis buttons for tertiary actions"
          code={`<Button variant="text" onPress={() => {}}>
  Tertiary Action
</Button>`}
          preview={
            <Button variant="text" onPress={() => {}}>
              Tertiary Action
            </Button>
          }
        />

        {/* Tonal Button */}
        <CodePlayground
          title="Tonal Button"
          description="Balanced emphasis with subtle background"
          code={`<Button variant="tonal" onPress={() => {}}>
  Tonal Action
</Button>`}
          preview={
            <Button variant="tonal" onPress={() => {}}>
              Tonal Action
            </Button>
          }
        />

        {/* With Icon */}
        <CodePlayground
          title="With Icon"
          description="Buttons can display icons alongside text"
          code={`<Button
  variant="filled"
  icon={<Ionicons name="heart" size={18} color="#fff" />}
  onPress={() => {}}
>
  Favorite
</Button>`}
          preview={
            <Button
              variant="filled"
              icon={<Ionicons name="heart" size={18} color="#fff" />}
              onPress={() => {}}
            >
              Favorite
            </Button>
          }
        />

        {/* Loading State */}
        <CodePlayground
          title="Loading State"
          description="Display loading spinner during async operations"
          code={`const [loading, setLoading] = useState(false);

<Button
  variant="filled"
  loading={loading}
  onPress={() => {
    setLoading(true);
    // Async operation
  }}
>
  {loading ? 'Processing...' : 'Submit'}
</Button>`}
          preview={
            <Button variant="filled" loading={loading} onPress={handleLoadingDemo}>
              {loading ? 'Processing...' : 'Click Me'}
            </Button>
          }
        />

        {/* Sizes */}
        <CodePlayground
          title="Button Sizes"
          description="Three size options: small (34dp), medium (40dp), large (48dp)"
          code={`<View style={{ gap: 12 }}>
  <Button variant="filled" size="small">Small</Button>
  <Button variant="filled" size="medium">Medium</Button>
  <Button variant="filled" size="large">Large</Button>
</View>`}
          preview={
            <View style={{ gap: 12, alignItems: 'flex-start' }}>
              <Button variant="filled" size="small" onPress={() => {}}>
                Small
              </Button>
              <Button variant="filled" size="medium" onPress={() => {}}>
                Medium
              </Button>
              <Button variant="filled" size="large" onPress={() => {}}>
                Large
              </Button>
            </View>
          }
        />

        {/* Disabled */}
        <CodePlayground
          title="Disabled State"
          description="Disabled buttons prevent user interaction"
          code={`<Button variant="filled" disabled onPress={() => {}}>
  Disabled Button
</Button>`}
          preview={
            <Button variant="filled" disabled onPress={() => {}}>
              Disabled Button
            </Button>
          }
        />
      </View>

      {/* Props API */}
      <PropsTable props={buttonProps} title="API Reference" />

      {/* Imperative ref */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Imperative ref
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, lineHeight: 26 }}>
          Pass a <Text style={{ fontFamily: 'monospace', color: theme.colors.primary, fontWeight: '700' }}>ref</Text> to drive focus programmatically — handy for the primary action of a Dialog or Snackbar so screen readers and keyboard users land on it when the surface opens.
        </Text>
        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', lineHeight: 20 }}>
{`import { Button } from 'quartz-ui';
import type { ButtonHandle } from 'quartz-ui';
import { useRef, useEffect } from 'react';

function Dialog() {
  const ref = useRef<ButtonHandle>(null);

  useEffect(() => {
    // Focus the primary action when the dialog mounts.
    ref.current?.focus();
  }, []);

  return <Button ref={ref} variant="filled">Confirm</Button>;
}`}
          </Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '700', marginBottom: 8 }}>
            ButtonHandle
          </Text>
          <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', lineHeight: 20 }}>
{`interface ButtonHandle {
  focus(): void;
  blur(): void;
}`}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* World-class guarantees */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          What you get for free
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 26 }}>
          Every Button instance ships with these behaviors. You don't have to wire them up.
        </Text>
        <View style={{ gap: 12 }}>
          {[
            { icon: 'flash', title: 'Animated state layer', body: 'MD3 hover/focus/press opacity transitions on the UI thread (no React re-renders).' },
            { icon: 'eye', title: 'Focus-visible ring', body: 'Outline appears only on keyboard focus — never on tap.' },
            { icon: 'eye-off', title: 'Reduce-motion respect', body: 'Spring scale and state-layer transitions skip when the OS asks.' },
            { icon: 'volume-medium', title: 'Loading announcements', body: 'Screen readers hear "Loading" when `loading` flips on (configurable via `loadingAccessibilityLabel`).' },
            { icon: 'language', title: 'RTL paddings', body: 'Asymmetric icon padding flips correctly in right-to-left layouts.' },
            { icon: 'color-palette', title: 'AA contrast for custom colors', body: 'Pass `color="#FFD700"` and the foreground auto-picks black for AA contrast.' },
            { icon: 'finger-print', title: 'Haptics', body: 'Light impact on press (configurable via `enableHaptics` or theme setting).' },
            { icon: 'resize', title: '≥48dp touch target', body: 'Met by all sizes; large size is 48dp tall.' },
          ].map((g) => (
            <Surface
              key={g.title}
              style={[styles.guaranteeCard, { backgroundColor: theme.colors.surface, borderLeftColor: theme.colors.primary }]}
              elevation={1}
            >
              <Ionicons name={g.icon as any} size={22} color={theme.colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                  {g.title}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2, lineHeight: 20 }}>
                  {g.body}
                </Text>
              </View>
            </Surface>
          ))}
        </View>
      </Animated.View>

      {/* Accessibility */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Accessibility
        </Text>
        <View style={[styles.accessibilityCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Keyboard Navigation
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Buttons are focusable and can be activated with Enter/Space
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Screen Readers
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Announced as "button" with proper labels and states
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Touch Targets
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Minimum 48dp touch target size (Material Design guidelines)
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Haptic Feedback
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Light haptic feedback on press (iOS/Android only)
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Best Practices */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Best Practices
        </Text>
        <View style={styles.bestPracticesList}>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>filled</Text> variant for the primary action on a screen
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>outlined</Text> or <Text style={{ fontWeight: '600' }}>tonal</Text> for secondary actions
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>text</Text> variant for low-priority actions like "Cancel"
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Provide clear, action-oriented labels (e.g., "Save" instead of "OK")
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use loading state during async operations to provide feedback
            </Text>
          </View>
        </View>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 12,
  },
  accessibilityCard: {
    padding: 24,
    borderRadius: 16,
    gap: 20,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bestPracticesList: {
    gap: 16,
  },
  bestPracticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bestPracticeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
});
