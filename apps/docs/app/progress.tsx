import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressIndicator, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const progressProps: PropDefinition[] = [
  {
    name: 'variant',
    type: "'linear' | 'circular'",
    default: "'linear'",
    description: 'Type of progress indicator',
  },
  {
    name: 'progress',
    type: 'number',
    default: '0',
    description: 'Progress value (0-100) for determinate mode',
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    default: 'false',
    description: 'Whether to show indeterminate animation',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large' | number",
    default: "'medium'",
    description: 'Size (for circular) or height (for linear)',
  },
  {
    name: 'color',
    type: 'string',
    description: 'Custom color for the progress indicator',
  },
  {
    name: 'trackColor',
    type: 'string',
    description: 'Custom track color',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

export default function ProgressDocPage() {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate progress
  useEffect(() => {
    if (isLoading && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 10, 100));
      }, 500);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [isLoading, progress]);

  const startProgress = () => {
    setProgress(0);
    setIsLoading(true);
  };

  return (
    <DocLayout
      title="Progress Indicators"
      description="Linear and circular progress indicators for displaying loading states and progress"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Progress indicators inform users about the status of ongoing processes, such as loading an app, submitting
          a form, or saving updates. They can show determinate progress or indeterminate activity.
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
            {`import { ProgressIndicator } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* Linear Progress Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Linear Progress
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          Linear progress indicators display progress along a horizontal track. They're ideal for showing progress of tasks with known duration.
        </Text>

        {/* Indeterminate Linear */}
        <CodePlayground
          title="Indeterminate Linear"
          description="Continuous animation for unknown duration"
          code={`<ProgressIndicator
  variant="linear"
  indeterminate
/>`}
          preview={
            <ProgressIndicator
              variant="linear"
              indeterminate
            />
          }
        />

        {/* Determinate Linear */}
        <CodePlayground
          title="Determinate Linear"
          description="Shows specific progress from 0-100%"
          code={`const [progress, setProgress] = useState(0);

// Simulate progress
useEffect(() => {
  const timer = setInterval(() => {
    setProgress(prev => (prev >= 100 ? 0 : prev + 10));
  }, 500);
  return () => clearInterval(timer);
}, []);

<ProgressIndicator
  variant="linear"
  progress={progress}
/>`}
          preview={
            <View style={{ width: '100%', gap: 12 }}>
              <ProgressIndicator
                variant="linear"
                progress={progress}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {progress}% Complete
                </Text>
                <Button variant="text" onPress={startProgress} disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Start'}
                </Button>
              </View>
            </View>
          }
        />

        {/* Linear Sizes */}
        <CodePlayground
          title="Linear Sizes"
          description="Three size options: small (2dp), medium (4dp), large (6dp)"
          code={`<View style={{ gap: 16 }}>
  <ProgressIndicator variant="linear" size="small" progress={70} />
  <ProgressIndicator variant="linear" size="medium" progress={70} />
  <ProgressIndicator variant="linear" size="large" progress={70} />
</View>`}
          preview={
            <View style={{ width: '100%', gap: 16 }}>
              <ProgressIndicator variant="linear" size="small" progress={70} />
              <ProgressIndicator variant="linear" size="medium" progress={70} />
              <ProgressIndicator variant="linear" size="large" progress={70} />
            </View>
          }
        />

        {/* Custom Colors */}
        <CodePlayground
          title="Custom Colors"
          description="Customize progress and track colors"
          code={`<View style={{ gap: 16 }}>
  <ProgressIndicator
    variant="linear"
    progress={60}
    color={theme.colors.secondary}
    trackColor={theme.colors.secondaryContainer}
  />
  <ProgressIndicator
    variant="linear"
    progress={80}
    color={theme.colors.tertiary}
    trackColor={theme.colors.tertiaryContainer}
  />
</View>`}
          preview={
            <View style={{ width: '100%', gap: 16 }}>
              <ProgressIndicator
                variant="linear"
                progress={60}
                color={theme.colors.secondary}
                trackColor={theme.colors.secondaryContainer}
              />
              <ProgressIndicator
                variant="linear"
                progress={80}
                color={theme.colors.tertiary}
                trackColor={theme.colors.tertiaryContainer}
              />
            </View>
          }
        />
      </View>

      {/* Circular Progress Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Circular Progress
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          Circular progress indicators display progress in a circular shape. They're useful for compact spaces and loading states.
        </Text>

        {/* Indeterminate Circular */}
        <CodePlayground
          title="Indeterminate Circular"
          description="Spinning animation for unknown duration"
          code={`<ProgressIndicator
  variant="circular"
  indeterminate
/>`}
          preview={
            <ProgressIndicator
              variant="circular"
              indeterminate
            />
          }
        />

        {/* Determinate Circular */}
        <CodePlayground
          title="Determinate Circular"
          description="Shows specific progress from 0-100%"
          code={`const [progress, setProgress] = useState(0);

<ProgressIndicator
  variant="circular"
  progress={progress}
/>`}
          preview={
            <View style={{ gap: 12, alignItems: 'center' }}>
              <ProgressIndicator
                variant="circular"
                progress={progress}
              />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {progress}%
              </Text>
            </View>
          }
        />

        {/* Circular Sizes */}
        <CodePlayground
          title="Circular Sizes"
          description="Three size options: small (24dp), medium (40dp), large (56dp)"
          code={`<View style={{ gap: 16, flexDirection: 'row', alignItems: 'center' }}>
  <ProgressIndicator variant="circular" size="small" indeterminate />
  <ProgressIndicator variant="circular" size="medium" indeterminate />
  <ProgressIndicator variant="circular" size="large" indeterminate />
</View>`}
          preview={
            <View style={{ gap: 16, flexDirection: 'row', alignItems: 'center' }}>
              <ProgressIndicator variant="circular" size="small" indeterminate />
              <ProgressIndicator variant="circular" size="medium" indeterminate />
              <ProgressIndicator variant="circular" size="large" indeterminate />
            </View>
          }
        />

        {/* Custom Size */}
        <CodePlayground
          title="Custom Size"
          description="Use custom numeric value for size"
          code={`<ProgressIndicator
  variant="circular"
  size={64}
  progress={75}
  color={theme.colors.secondary}
/>`}
          preview={
            <ProgressIndicator
              variant="circular"
              size={64}
              progress={75}
              color={theme.colors.secondary}
            />
          }
        />

        {/* Loading State Example */}
        <CodePlayground
          title="Loading State"
          description="Circular progress with loading text"
          code={`<View style={{ alignItems: 'center', gap: 16 }}>
  <ProgressIndicator
    variant="circular"
    indeterminate
    size="large"
  />
  <Text variant="bodyLarge">Loading...</Text>
</View>`}
          preview={
            <View style={{ alignItems: 'center', gap: 16 }}>
              <ProgressIndicator
                variant="circular"
                indeterminate
                size="large"
              />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Loading...
              </Text>
            </View>
          }
        />
      </View>

      {/* Props API */}
      <PropsTable props={progressProps} title="API Reference" />

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
                Progress Role
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Announced as "progressbar" with current value for screen readers
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Value Indication
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Determinate indicators announce min, max, and current values
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Smooth Animations
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Uses Reanimated for smooth, performant animations
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Reduced Motion
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Respects system preferences for reduced motion
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
              Use <Text style={{ fontWeight: '600' }}>indeterminate</Text> when duration is unknown or unpredictable
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>determinate</Text> when you can calculate progress percentage
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>linear</Text> indicators for full-width contexts like page loading
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>circular</Text> indicators for compact spaces or loading states
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Pair determinate indicators with percentage text for clarity
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
