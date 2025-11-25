import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from '../_components/DocLayout';
import { CodePlayground } from '../_components/CodePlayground';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AccessibilityPage() {
  const theme = useTheme();

  const features = [
    {
      icon: 'eye',
      title: 'Screen Readers',
      description: 'Full VoiceOver and TalkBack support with proper ARIA labels',
      color: '#667eea',
    },
    {
      icon: 'hand-left',
      title: 'Touch Targets',
      description: 'Minimum 48dp touch targets following WCAG guidelines',
      color: '#f093fb',
    },
    {
      icon: 'contrast',
      title: 'High Contrast',
      description: 'WCAG AA compliant color contrast ratios',
      color: '#4facfe',
    },
    {
      icon: 'resize',
      title: 'Focus Management',
      description: 'Keyboard navigation and focus indicators',
      color: '#43e97b',
    },
    {
      icon: 'phone-portrait',
      title: 'Haptic Feedback',
      description: 'Tactile feedback for user actions',
      color: '#fa709a',
    },
    {
      icon: 'pulse',
      title: 'Reduced Motion',
      description: 'Respects user motion preferences',
      color: '#a18cd1',
    },
  ];

  return (
    <DocLayout
      title="Accessibility"
      description="Build inclusive apps that work for everyone with Quartz UI's accessibility features"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Quartz UI is built with accessibility at its core. All components follow WCAG 2.1 Level AA
          guidelines and work seamlessly with screen readers, keyboard navigation, and other assistive
          technologies.
        </Text>
      </Animated.View>

      {/* Features Grid */}
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 24 }}>
          Accessibility Features
        </Text>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.delay(100 + index * 30).springify()}
              style={styles.featureCard}
            >
              <Surface style={[styles.featureSurface, { backgroundColor: theme.colors.surface }]} elevation={1}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <Ionicons name={feature.icon as any} size={28} color={feature.color} />
                </View>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 16 }}>
                  {feature.title}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 22 }}>
                  {feature.description}
                </Text>
              </Surface>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Screen Readers */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Screen Reader Support
        </Text>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, lineHeight: 26 }}>
          All components include proper accessibility labels and hints for screen readers:
        </Text>

        <CodePlayground
          title="Accessibility Labels"
          description="Provide context for screen reader users"
          code={`<Button
  variant="filled"
  onPress={handleSubmit}
  accessibilityLabel="Submit registration form"
  accessibilityHint="Double tap to submit your information"
  accessibilityRole="button"
>
  Submit
</Button>`}
          preview={
            <Button
              variant="filled"
              onPress={() => {}}
              accessibilityLabel="Submit registration form"
              accessibilityHint="Double tap to submit your information"
            >
              Submit
            </Button>
          }
        />

        <Surface style={[styles.infoCard, { backgroundColor: theme.colors.primaryContainer, marginTop: 16 }]} elevation={0}>
          <Ionicons name="information-circle" size={24} color={theme.colors.onPrimaryContainer} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text variant="titleSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}>
              Auto-Generated Labels
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 4, opacity: 0.9 }}>
              Quartz UI automatically generates accessibility labels from button text when not explicitly provided
            </Text>
          </View>
        </Surface>
      </Animated.View>

      {/* Keyboard Navigation */}
      <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Keyboard Navigation
        </Text>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, lineHeight: 26 }}>
          All interactive components are keyboard accessible:
        </Text>

        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', lineHeight: 20 }}>
{`<Button
  variant="filled"
  onPress={() => {}}
  focusable={true}  // Allows keyboard focus (default)
  onFocus={() => console.log('Focused')}
  onBlur={() => console.log('Blurred')}
>
  Focusable Button
</Button>`}
          </Text>
        </View>

        <View style={styles.keyboardTable}>
          {[
            { key: 'Tab', action: 'Move focus to next element' },
            { key: 'Shift + Tab', action: 'Move focus to previous element' },
            { key: 'Enter/Space', action: 'Activate focused button' },
            { key: 'Escape', action: 'Close dialogs and menus' },
          ].map((item, index) => (
            <View key={index} style={[styles.keyboardRow, { borderBottomColor: theme.colors.outlineVariant }]}>
              <View style={[styles.keyBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', fontWeight: '600' }}>
                  {item.key}
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>
                {item.action}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Color Contrast */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Color Contrast
        </Text>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24, lineHeight: 26 }}>
          All color combinations meet WCAG AA standards with a minimum 4.5:1 contrast ratio:
        </Text>

        <View style={styles.contrastExamples}>
          <Surface style={[styles.contrastCard, { backgroundColor: theme.colors.primary }]} elevation={1}>
            <Text variant="titleMedium" style={{ color: theme.colors.onPrimary, fontWeight: '600' }}>
              Primary Text
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary, marginTop: 4, opacity: 0.9 }}>
              Meets WCAG AA standard
            </Text>
          </Surface>

          <Surface style={[styles.contrastCard, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outline }]} elevation={0}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Surface Text
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Meets WCAG AA standard
            </Text>
          </Surface>
        </View>
      </Animated.View>

      {/* Touch Targets */}
      <Animated.View entering={FadeInDown.delay(350).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Touch Target Sizes
        </Text>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24, lineHeight: 26 }}>
          All interactive elements have a minimum touch target size of 48x48dp:
        </Text>

        <Surface style={[styles.touchDemo, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
          <View style={styles.touchGrid}>
            <View style={styles.touchExample}>
              <View style={[styles.touchTarget, { backgroundColor: theme.colors.primary }]}>
                <View style={[styles.touchVisible, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Ionicons name="add" size={20} color={theme.colors.onPrimaryContainer} />
                </View>
              </View>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                48x48dp touch target
              </Text>
            </View>
          </View>
        </Surface>
      </Animated.View>

      {/* Best Practices */}
      <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
        <Surface style={[styles.bestPracticesCard, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={0}>
          <Ionicons name="star" size={32} color={theme.colors.onTertiaryContainer} />
          <Text variant="headlineSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '700', marginTop: 16, marginBottom: 20 }}>
            Accessibility Best Practices
          </Text>

          <View style={styles.practicesList}>
            {[
              {
                icon: 'checkmark-circle',
                text: 'Always provide descriptive accessibility labels',
              },
              {
                icon: 'checkmark-circle',
                text: 'Test your app with VoiceOver (iOS) and TalkBack (Android)',
              },
              {
                icon: 'checkmark-circle',
                text: 'Ensure sufficient color contrast for all text',
              },
              {
                icon: 'checkmark-circle',
                text: 'Make all interactive elements keyboard accessible',
              },
              {
                icon: 'checkmark-circle',
                text: 'Use semantic HTML elements on web',
              },
              {
                icon: 'checkmark-circle',
                text: 'Provide alternative text for images',
              },
              {
                icon: 'checkmark-circle',
                text: 'Test with different font sizes and zoom levels',
              },
              {
                icon: 'checkmark-circle',
                text: 'Respect reduced motion preferences',
              },
            ].map((practice, index) => (
              <View key={index} style={styles.practiceItem}>
                <Ionicons name={practice.icon as any} size={20} color={theme.colors.onTertiaryContainer} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginLeft: 12, flex: 1, opacity: 0.95 }}>
                  {practice.text}
                </Text>
              </View>
            ))}
          </View>
        </Surface>
      </Animated.View>

      {/* Resources */}
      <Animated.View entering={FadeInDown.delay(450).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Resources
        </Text>

        <View style={styles.resourcesList}>
          <Surface style={[styles.resourceCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Ionicons name="book" size={24} color={theme.colors.primary} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                WCAG 2.1 Guidelines
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                Web Content Accessibility Guidelines
              </Text>
            </View>
          </Surface>

          <Surface style={[styles.resourceCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Ionicons name="phone-portrait" size={24} color={theme.colors.primary} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                React Native Accessibility
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                Official React Native accessibility docs
              </Text>
            </View>
          </Surface>
        </View>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: '48%',
    minWidth: 280,
  },
  featureSurface: {
    padding: 24,
    borderRadius: 16,
    minHeight: 180,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeBlock: {
    padding: 20,
    borderRadius: 12,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
  },
  keyboardTable: {
    marginTop: 16,
  },
  keyboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
  },
  keyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 100,
  },
  contrastExamples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  contrastCard: {
    flex: 1,
    minWidth: 200,
    padding: 24,
    borderRadius: 16,
  },
  touchDemo: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  touchGrid: {
    alignItems: 'center',
  },
  touchExample: {
    alignItems: 'center',
  },
  touchTarget: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
  },
  touchVisible: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bestPracticesCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  practicesList: {
    gap: 16,
    alignSelf: 'stretch',
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  resourcesList: {
    gap: 12,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
});
