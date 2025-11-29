import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const cardProps: PropDefinition[] = [
  {
    name: 'variant',
    type: "'elevated' | 'filled' | 'outlined'",
    default: "'elevated'",
    description: 'Visual style variant of the card',
  },
  {
    name: 'onPress',
    type: '(event: GestureResponderEvent) => void',
    description: 'Makes card pressable and handles press events',
  },
  {
    name: 'onLongPress',
    type: '(event: GestureResponderEvent) => void',
    description: 'Handles long press events on the card',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables card interaction if pressable',
  },
  {
    name: 'elevation',
    type: '0 | 1 | 2 | 3 | 4 | 5',
    description: 'Custom elevation level (overrides variant default)',
  },
  {
    name: 'radius',
    type: "'small' | 'medium' | 'large' | number",
    default: "'medium'",
    description: 'Border radius size or custom pixel value',
  },
  {
    name: 'padding',
    type: "'none' | 'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Internal padding of the card',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Card content',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Additional style overrides',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label for screen readers',
  },
  {
    name: 'accessibilityHint',
    type: 'string',
    description: 'Accessibility hint describing card action',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier for automated testing',
  },
];

export default function CardsDocPage() {
  const theme = useTheme();

  return (
    <DocLayout
      title="Card"
      description="Containers for organizing and displaying content with three Material Design 3 variants"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Cards contain content and actions about a single subject. They're easy to scan for relevant and
          actionable information. Elements, like text and images, should be placed on them in a way that
          clearly indicates hierarchy.
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
            {`import { Card } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 20 }}>
          Card Variants
        </Text>

        {/* All Variants Showcase */}
        <CodePlayground
          title="All Variants"
          description="Three card variants for different emphasis levels and layouts"
          code={`<View style={{ gap: 16 }}>
  <Card variant="elevated">
    <Text variant="titleMedium">Elevated Card</Text>
    <Text variant="bodyMedium">With subtle shadow elevation</Text>
  </Card>

  <Card variant="filled">
    <Text variant="titleMedium">Filled Card</Text>
    <Text variant="bodyMedium">With container color background</Text>
  </Card>

  <Card variant="outlined">
    <Text variant="titleMedium">Outlined Card</Text>
    <Text variant="bodyMedium">With border outline</Text>
  </Card>
</View>`}
          preview={
            <View style={{ gap: 16, width: '100%' }}>
              <Card variant="elevated">
                <Text variant="titleMedium">Elevated Card</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  With subtle shadow elevation
                </Text>
              </Card>
              <Card variant="filled">
                <Text variant="titleMedium">Filled Card</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  With container color background
                </Text>
              </Card>
              <Card variant="outlined">
                <Text variant="titleMedium">Outlined Card</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  With border outline
                </Text>
              </Card>
            </View>
          }
        />

        {/* Elevated Card */}
        <CodePlayground
          title="Elevated Card"
          description="Default card with subtle shadow elevation"
          code={`<Card variant="elevated">
  <Text variant="titleMedium">Card Title</Text>
  <Text variant="bodyMedium" style={{ marginTop: 8 }}>
    This is an elevated card with shadow. Perfect for
    content that needs to stand out from the background.
  </Text>
</Card>`}
          preview={
            <Card variant="elevated">
              <Text variant="titleMedium">Card Title</Text>
              <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                This is an elevated card with shadow. Perfect for content that needs to stand out from the background.
              </Text>
            </Card>
          }
        />

        {/* Filled Card */}
        <CodePlayground
          title="Filled Card"
          description="Card with filled container color"
          code={`<Card variant="filled">
  <Text variant="titleMedium">Filled Card</Text>
  <Text variant="bodyMedium" style={{ marginTop: 8 }}>
    Filled cards have a container color from the theme.
    They provide subtle visual distinction without shadows.
  </Text>
</Card>`}
          preview={
            <Card variant="filled">
              <Text variant="titleMedium">Filled Card</Text>
              <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                Filled cards have a container color from the theme. They provide subtle visual distinction without shadows.
              </Text>
            </Card>
          }
        />

        {/* Outlined Card */}
        <CodePlayground
          title="Outlined Card"
          description="Card with border outline"
          code={`<Card variant="outlined">
  <Text variant="titleMedium">Outlined Card</Text>
  <Text variant="bodyMedium" style={{ marginTop: 8 }}>
    Outlined cards have a border with no elevation.
    Use for low-emphasis content or dense layouts.
  </Text>
</Card>`}
          preview={
            <Card variant="outlined">
              <Text variant="titleMedium">Outlined Card</Text>
              <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                Outlined cards have a border with no elevation. Use for low-emphasis content or dense layouts.
              </Text>
            </Card>
          }
        />

        {/* Interactive Card */}
        <CodePlayground
          title="Interactive Card"
          description="Card with press interaction and haptic feedback"
          code={`<Card
  variant="elevated"
  onPress={() => console.log('Card pressed!')}
>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <Ionicons name="rocket" size={32} color={theme.colors.primary} />
    <View style={{ flex: 1 }}>
      <Text variant="titleMedium">Pressable Card</Text>
      <Text variant="bodyMedium">
        Tap me to trigger an action
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} />
  </View>
</Card>`}
          preview={
            <Card
              variant="elevated"
              onPress={() => console.log('Card pressed!')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="rocket" size={32} color={theme.colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium">Pressable Card</Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Tap me to trigger an action
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
              </View>
            </Card>
          }
        />

        {/* Card with Actions */}
        <CodePlayground
          title="Card with Actions"
          description="Card containing action buttons"
          code={`<Card variant="elevated">
  <View>
    <Text variant="titleLarge">Update Available</Text>
    <Text variant="bodyMedium" style={{ marginTop: 8 }}>
      A new version is ready to install. Update now to get
      the latest features and improvements.
    </Text>
    <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
      <Button variant="filled">Update Now</Button>
      <Button variant="text">Later</Button>
    </View>
  </View>
</Card>`}
          preview={
            <Card variant="elevated">
              <View>
                <Text variant="titleLarge">Update Available</Text>
                <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                  A new version is ready to install. Update now to get the latest features and improvements.
                </Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                  <Button variant="filled" onPress={() => {}}>Update Now</Button>
                  <Button variant="text" onPress={() => {}}>Later</Button>
                </View>
              </View>
            </Card>
          }
        />

        {/* Border Radius Options */}
        <CodePlayground
          title="Border Radius"
          description="Cards support small, medium, large, or custom radius"
          code={`<View style={{ gap: 12 }}>
  <Card variant="filled" radius="small">
    <Text variant="bodyMedium">Small Radius (8dp)</Text>
  </Card>
  <Card variant="filled" radius="medium">
    <Text variant="bodyMedium">Medium Radius (12dp)</Text>
  </Card>
  <Card variant="filled" radius="large">
    <Text variant="bodyMedium">Large Radius (16dp)</Text>
  </Card>
</View>`}
          preview={
            <View style={{ gap: 12 }}>
              <Card variant="filled" radius="small">
                <Text variant="bodyMedium">Small Radius (8dp)</Text>
              </Card>
              <Card variant="filled" radius="medium">
                <Text variant="bodyMedium">Medium Radius (12dp)</Text>
              </Card>
              <Card variant="filled" radius="large">
                <Text variant="bodyMedium">Large Radius (16dp)</Text>
              </Card>
            </View>
          }
        />

        {/* Padding Options */}
        <CodePlayground
          title="Padding Options"
          description="Control internal spacing with padding prop"
          code={`<View style={{ gap: 12 }}>
  <Card variant="outlined" padding="sm">
    <Text variant="bodyMedium">Small Padding</Text>
  </Card>
  <Card variant="outlined" padding="md">
    <Text variant="bodyMedium">Medium Padding</Text>
  </Card>
  <Card variant="outlined" padding="lg">
    <Text variant="bodyMedium">Large Padding</Text>
  </Card>
  <Card variant="outlined" padding="none">
    <View style={{ padding: 16 }}>
      <Text variant="bodyMedium">Custom Padding</Text>
    </View>
  </Card>
</View>`}
          preview={
            <View style={{ gap: 12 }}>
              <Card variant="outlined" padding="sm">
                <Text variant="bodyMedium">Small Padding</Text>
              </Card>
              <Card variant="outlined" padding="md">
                <Text variant="bodyMedium">Medium Padding</Text>
              </Card>
              <Card variant="outlined" padding="lg">
                <Text variant="bodyMedium">Large Padding</Text>
              </Card>
              <Card variant="outlined" padding="none">
                <View style={{ padding: 16 }}>
                  <Text variant="bodyMedium">Custom Padding</Text>
                </View>
              </Card>
            </View>
          }
        />
      </View>

      {/* Props API */}
      <PropsTable props={cardProps} title="API Reference" />

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
                Interactive Feedback
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Pressable cards provide haptic feedback and visual press states
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Screen Reader Support
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Interactive cards are announced as "button" with proper labels
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Scale Animation
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Smooth spring animation (0.98 scale) provides press feedback
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
              Use <Text style={{ fontWeight: '600' }}>elevated</Text> for primary content that needs emphasis
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>filled</Text> for less prominent cards in complex layouts
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>outlined</Text> for subtle separation or when many cards are present
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Keep card content concise and scannable with clear hierarchy
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Place primary actions at the bottom of the card for easy access
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
