import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const buttonProps: PropDefinition[] = [
  {
    name: 'variant',
    type: "'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'",
    default: "'filled'",
    description: 'Visual style variant of the button',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    default: "'medium'",
    description: 'Size of the button (height: 34dp, 40dp, 48dp)',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Button content (alternative to label prop)',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Button text label',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Icon element to display in the button',
  },
  {
    name: 'iconPosition',
    type: "'left' | 'right'",
    default: "'left'",
    description: 'Position of the icon relative to label',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Shows loading spinner and disables interaction',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the button interaction',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    description: 'Makes button expand to full width of container',
  },
  {
    name: 'color',
    type: 'string',
    description: 'Custom background color (overrides theme)',
  },
  {
    name: 'textColor',
    type: 'string',
    description: 'Custom text color (overrides theme)',
  },
  {
    name: 'onPress',
    type: '(event: GestureResponderEvent) => void',
    description: 'Callback fired when button is pressed',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label for screen readers',
  },
  {
    name: 'accessibilityHint',
    type: 'string',
    description: 'Accessibility hint describing button action',
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
});
