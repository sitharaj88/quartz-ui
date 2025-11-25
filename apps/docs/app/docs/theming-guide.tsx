import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, Button, useTheme, useQuartzTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from '../_components/DocLayout';
import { CodePlayground } from '../_components/CodePlayground';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function ThemingGuidePage() {
  const theme = useTheme();
  const { mode, toggleMode } = useQuartzTheme();

  return (
    <DocLayout
      title="Theming Guide"
      description="Customize colors, create custom themes, and control dark mode in your app"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Quartz UI uses a powerful theming system based on Material Design 3. You can use the default
          themes, customize colors, or create completely custom themes.
        </Text>
      </Animated.View>

      {/* Theme Modes */}
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Theme Modes
        </Text>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, lineHeight: 26 }}>
          Quartz UI supports three theme modes:
        </Text>

        <View style={styles.modeCards}>
          <Surface style={[styles.modeCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <View style={[styles.modeIcon, { backgroundColor: '#fbbf24' + '20' }]}>
              <Ionicons name="sunny" size={28} color="#fbbf24" />
            </View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 12 }}>
              Light Mode
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 22 }}>
              Bright, clean interface for daytime use
            </Text>
          </Surface>

          <Surface style={[styles.modeCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <View style={[styles.modeIcon, { backgroundColor: '#6366f1' + '20' }]}>
              <Ionicons name="moon" size={28} color="#6366f1" />
            </View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 12 }}>
              Dark Mode
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 22 }}>
              Easy on the eyes for low-light environments
            </Text>
          </Surface>

          <Surface style={[styles.modeCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <View style={[styles.modeIcon, { backgroundColor: '#8b5cf6' + '20' }]}>
              <Ionicons name="contrast" size={28} color="#8b5cf6" />
            </View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 12 }}>
              System
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 22 }}>
              Automatically matches device settings
            </Text>
          </Surface>
        </View>

        {/* Live Demo */}
        <Surface style={[styles.liveDemo, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600', marginBottom: 12 }}>
            Current Theme: {mode === 'dark' ? 'Dark' : 'Light'}
          </Text>
          <Button variant="filled" onPress={toggleMode}>
            Toggle Theme
          </Button>
        </Surface>
      </Animated.View>

      {/* Using Default Themes */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Using Default Themes
        </Text>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, lineHeight: 26 }}>
          The simplest way to use Quartz UI is with the default themes:
        </Text>

        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', lineHeight: 20 }}>
{`import { QuartzProvider } from 'quartz-ui';

export default function App() {
  return (
    <QuartzProvider initialMode="system">
      <YourApp />
    </QuartzProvider>
  );
}`}
          </Text>
        </View>
      </Animated.View>

      {/* Custom Colors */}
      <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Custom Colors
        </Text>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, lineHeight: 26 }}>
          Customize the color scheme while keeping the MD3 design system:
        </Text>

        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', lineHeight: 20 }}>
{`import { QuartzProvider, createLightTheme, createDarkTheme } from 'quartz-ui';

const lightTheme = createLightTheme({
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
  },
});

const darkTheme = createDarkTheme({
  colors: {
    primary: '#90CAF9',
    secondary: '#757575',
  },
});

export default function App() {
  return (
    <QuartzProvider
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      initialMode="system"
    >
      <YourApp />
    </QuartzProvider>
  );
}`}
          </Text>
        </View>
      </Animated.View>

      {/* Color System */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Color System
        </Text>

        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24, lineHeight: 26 }}>
          Quartz UI uses the Material Design 3 color system with tonal palettes:
        </Text>

        <View style={styles.colorPalettes}>
          {[
            { name: 'Primary', color: theme.colors.primary, onColor: theme.colors.onPrimary, container: theme.colors.primaryContainer },
            { name: 'Secondary', color: theme.colors.secondary, onColor: theme.colors.onSecondary, container: theme.colors.secondaryContainer },
            { name: 'Tertiary', color: theme.colors.tertiary || theme.colors.primary, onColor: theme.colors.onTertiary || theme.colors.onPrimary, container: theme.colors.tertiaryContainer },
          ].map((palette, index) => (
            <Animated.View key={palette.name} entering={FadeInDown.delay(250 + index * 30).springify()}>
              <Surface style={[styles.paletteCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 16 }}>
                  {palette.name}
                </Text>

                <View style={styles.paletteRow}>
                  <View style={styles.colorSwatch}>
                    <View style={[styles.swatchColor, { backgroundColor: palette.color }]}>
                      <Text variant="labelSmall" style={{ color: palette.onColor, fontWeight: '600' }}>Main</Text>
                    </View>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, fontFamily: 'monospace' }}>
                      {palette.name.toLowerCase()}
                    </Text>
                  </View>

                  <View style={styles.colorSwatch}>
                    <View style={[styles.swatchColor, { backgroundColor: palette.container }]}>
                      <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}>Container</Text>
                    </View>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, fontFamily: 'monospace' }}>
                      {palette.name.toLowerCase()}Container
                    </Text>
                  </View>
                </View>
              </Surface>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Accessing Theme */}
      <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Accessing Theme in Components
        </Text>

        <CodePlayground
          title="useTheme Hook"
          description="Access theme colors and values in any component"
          code={`import { View } from 'react-native';
import { Text, useTheme } from 'quartz-ui';

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md
    }}>
      <Text style={{ color: theme.colors.onSurface }}>
        Themed Component
      </Text>
    </View>
  );
}`}
          preview={
            <View style={{ backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12 }}>
              <Text style={{ color: theme.colors.onSurface }}>
                Themed Component
              </Text>
            </View>
          }
        />
      </Animated.View>

      {/* Controlling Theme */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
          Controlling Theme Mode
        </Text>

        <CodePlayground
          title="useQuartzTheme Hook"
          description="Toggle between light and dark modes"
          code={`import { View } from 'react-native';
import { Button, Text, useQuartzTheme } from 'quartz-ui';

function ThemeToggle() {
  const { mode, toggleMode, setMode } = useQuartzTheme();

  return (
    <View>
      <Text>Current mode: {mode}</Text>
      <Button onPress={toggleMode}>
        Toggle Theme
      </Button>
      <Button onPress={() => setMode('dark')}>
        Force Dark
      </Button>
    </View>
  );
}`}
          preview={
            <View style={{ gap: 12 }}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                Current mode: {mode}
              </Text>
              <Button variant="filled" onPress={toggleMode}>
                Toggle Theme
              </Button>
            </View>
          }
        />
      </Animated.View>

      {/* Best Practices */}
      <Animated.View entering={FadeInDown.delay(350).springify()} style={styles.section}>
        <Surface style={[styles.tipsCard, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={0}>
          <Ionicons name="star" size={32} color={theme.colors.onTertiaryContainer} />
          <Text variant="headlineSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '700', marginTop: 16, marginBottom: 20 }}>
            Best Practices
          </Text>

          <View style={styles.tipsList}>
            {[
              'Always use theme colors instead of hardcoded values',
              'Test your app in both light and dark modes',
              'Use semantic colors (primary, surface, etc.) over raw colors',
              'Leverage container colors for backgrounds and surfaces',
              'Consider accessibility when customizing colors',
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.onTertiaryContainer} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginLeft: 12, flex: 1, opacity: 0.95 }}>
                  {tip}
                </Text>
              </View>
            ))}
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
  modeCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  modeCard: {
    flex: 1,
    minWidth: 200,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modeIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveDemo: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  codeBlock: {
    padding: 20,
    borderRadius: 12,
  },
  colorPalettes: {
    gap: 16,
  },
  paletteCard: {
    padding: 20,
    borderRadius: 16,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 16,
  },
  colorSwatch: {
    flex: 1,
  },
  swatchColor: {
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  tipsList: {
    gap: 16,
    alignSelf: 'stretch',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
