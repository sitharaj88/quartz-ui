import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Surface, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from '../_components/DocLayout';
import { CodePlayground } from '../_components/CodePlayground';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function QuickStartPage() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <DocLayout
      title="Quick Start"
      description="Build your first app with Quartz UI in minutes"
    >
      {/* Introduction */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          This guide will walk you through creating a simple app with Quartz UI. You'll learn how to
          set up the provider, use components, and customize themes.
        </Text>
      </Animated.View>

      {/* Step 1: Setup Provider */}
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.section}>
        <View style={[styles.stepHeader, { backgroundColor: theme.colors.primaryContainer }]}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onPrimary, fontWeight: '700' }}>1</Text>
          </View>
          <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}>
            Setup QuartzProvider
          </Text>
        </View>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16, lineHeight: 26 }}>
          Wrap your app with <Text style={{ fontFamily: 'monospace', fontWeight: '600' }}>QuartzProvider</Text> to
          enable theming and context throughout your application.
        </Text>

        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant, marginTop: 16 }]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', lineHeight: 20 }}>
{`import { QuartzProvider } from 'quartz-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QuartzProvider initialMode="system">
        <YourApp />
      </QuartzProvider>
    </GestureHandlerRootView>
  );
}`}
          </Text>
        </View>

        <Surface style={[styles.tipCard, { backgroundColor: theme.colors.tertiaryContainer, marginTop: 16 }]} elevation={0}>
          <Ionicons name="bulb" size={24} color={theme.colors.onTertiaryContainer} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
              Tip
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
              Set initialMode to 'system' for automatic dark mode, 'light' or 'dark' for fixed themes
            </Text>
          </View>
        </Surface>
      </Animated.View>

      {/* Step 2: Use Components */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.section}>
        <View style={[styles.stepHeader, { backgroundColor: theme.colors.secondaryContainer }]}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.secondary }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSecondary, fontWeight: '700' }}>2</Text>
          </View>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>
            Use Components
          </Text>
        </View>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16, lineHeight: 26 }}>
          Import and use Quartz UI components in your screens. All components are fully typed and include
          comprehensive props for customization.
        </Text>

        <CodePlayground
          title="Simple Example"
          description="A basic screen with buttons and text"
          code={`import { View } from 'react-native';
import { Text, Button, Card, Surface, useTheme } from 'quartz-ui';

function HomeScreen() {
  const theme = useTheme();

  return (
    <Surface
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.background
      }}
    >
      <Text variant="displaySmall" style={{ marginBottom: 16 }}>
        Welcome to Quartz UI
      </Text>

      <Card variant="elevated" style={{ marginBottom: 16 }}>
        <Text variant="titleMedium">Getting Started</Text>
        <Text variant="bodyMedium" style={{ marginTop: 8 }}>
          Build beautiful apps with ease
        </Text>
      </Card>

      <Button
        variant="filled"
        onPress={() => console.log('Pressed!')}
      >
        Get Started
      </Button>
    </Surface>
  );
}`}
          preview={
            <View style={{ gap: 16, width: '100%' }}>
              <Text variant="headlineSmall">Welcome to Quartz UI</Text>
              <Surface style={{ padding: 16, borderRadius: 12, backgroundColor: theme.colors.surfaceVariant }}>
                <Text variant="titleMedium">Getting Started</Text>
                <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                  Build beautiful apps with ease
                </Text>
              </Surface>
              <Button variant="filled" onPress={() => {}}>
                Get Started
              </Button>
            </View>
          }
        />
      </Animated.View>

      {/* Step 3: Access Theme */}
      <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.section}>
        <View style={[styles.stepHeader, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.tertiary }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onTertiary, fontWeight: '700' }}>3</Text>
          </View>
          <Text variant="headlineSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '700' }}>
            Access Theme
          </Text>
        </View>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16, lineHeight: 26 }}>
          Use the <Text style={{ fontFamily: 'monospace', fontWeight: '600' }}>useTheme</Text> hook to access
          theme colors and the <Text style={{ fontFamily: 'monospace', fontWeight: '600' }}>useQuartzTheme</Text> hook
          to control theme mode.
        </Text>

        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant, marginTop: 16 }]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', lineHeight: 20 }}>
{`import { useTheme, useQuartzTheme } from 'quartz-ui';

function MyComponent() {
  const theme = useTheme();
  const { mode, toggleMode } = useQuartzTheme();

  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>
        Current mode: {mode}
      </Text>
      <Button onPress={toggleMode}>
        Toggle Dark Mode
      </Button>
    </View>
  );
}`}
          </Text>
        </View>
      </Animated.View>

      {/* Step 4: Explore Components */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
        <View style={[styles.stepHeader, { backgroundColor: theme.colors.primaryContainer }]}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onPrimary, fontWeight: '700' }}>4</Text>
          </View>
          <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}>
            Explore Components
          </Text>
        </View>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16, lineHeight: 26 }}>
          Quartz UI includes 33 components across different categories. Explore them all in the documentation.
        </Text>

        <View style={styles.componentGrid}>
          {[
            { title: 'Buttons', route: '/buttons', icon: 'radio-button-on', color: '#667eea' },
            { title: 'Cards', route: '/cards', icon: 'albums', color: '#f093fb' },
            { title: 'Inputs', route: '/inputs', icon: 'create', color: '#4facfe' },
            { title: 'Dialogs', route: '/dialogs', icon: 'chatbox-ellipses', color: '#43e97b' },
          ].map((item, index) => (
            <Animated.View
              key={item.title}
              entering={FadeInDown.delay(250 + index * 30).springify()}
              style={[
                styles.componentCard,
                {
                  flexBasis: isMobile ? '47%' : '48%',
                  maxWidth: isMobile ? '47%' : '48%',
                  width: isMobile ? '47%' : '48%',
                }
              ]}
            >
              <Surface
                style={[styles.componentSurface, { backgroundColor: theme.colors.surface }]}
                elevation={1}
              >
                <View style={[styles.componentIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 12 }}>
                  {item.title}
                </Text>
              </Surface>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Next Steps */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
        <Surface style={[styles.nextStepsCard, { backgroundColor: theme.colors.secondaryContainer }]} elevation={0}>
          <Ionicons name="compass" size={48} color={theme.colors.onSecondaryContainer} />
          <Text variant="headlineSmall" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700', marginTop: 16 }}>
            What's Next?
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSecondaryContainer, marginTop: 8, opacity: 0.9, textAlign: 'center' }}>
            Continue learning about Quartz UI
          </Text>

          <View style={styles.nextStepsList}>
            <View style={styles.nextStepItem}>
              <Ionicons name="color-palette" size={20} color={theme.colors.onSecondaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, marginLeft: 12, flex: 1 }}>
                Learn about theming and customization
              </Text>
            </View>
            <View style={styles.nextStepItem}>
              <Ionicons name="book" size={20} color={theme.colors.onSecondaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, marginLeft: 12, flex: 1 }}>
                Explore all 33 components
              </Text>
            </View>
            <View style={styles.nextStepItem}>
              <Ionicons name="accessibility" size={20} color={theme.colors.onSecondaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, marginLeft: 12, flex: 1 }}>
                Read about accessibility features
              </Text>
            </View>
          </View>

          <View style={styles.nextStepsButtons}>
            <Button variant="filled" onPress={() => router.push('/docs/theming-guide' as any)}>
              Theming Guide
            </Button>
            <Button variant="outlined" onPress={() => router.push('/buttons' as any)}>
              View Components
            </Button>
          </View>
        </Surface>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeBlock: {
    padding: 20,
    borderRadius: 12,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
  },
  componentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  componentCard: {
    minWidth: 140,
    marginBottom: 12,
    flexShrink: 0,
  },
  componentSurface: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 120,
  },
  componentIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextStepsCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  nextStepsList: {
    marginTop: 24,
    gap: 16,
    alignSelf: 'stretch',
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextStepsButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
