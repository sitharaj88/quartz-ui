import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Text, Surface, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from '../_components/DocLayout';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function InstallationPage() {
  const theme = useTheme();
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (index: number, code: string) => {
    try {
      await Clipboard.setStringAsync(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      // silently ignore clipboard errors
    }
  };

  const CodeBlock = ({ code, index }: { code: string; index: number }) => (
    <Surface
      style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}
      elevation={0}
    >
      <Text
        variant="bodyMedium"
        style={{
          color: theme.colors.onSurfaceVariant,
          fontFamily: 'monospace',
          flex: 1,
        }}
      >
        {code}
      </Text>
      <Pressable
        onPress={() => handleCopy(index, code)}
        style={[styles.copyButton, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Ionicons
          name={copiedIndex === index ? 'checkmark' : 'copy'}
          size={16}
          color={theme.colors.onPrimaryContainer}
        />
      </Pressable>
    </Surface>
  );

  return (
    <DocLayout
      title="Installation"
      description="Get started with Quartz UI by installing the package and its dependencies"
    >
      {/* Prerequisites */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
          Prerequisites
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12, lineHeight: 26 }}>
          Before installing Quartz UI, make sure you have an Expo or React Native project set up. If
          you don't have one yet, you can create a new Expo project:
        </Text>
        <CodeBlock code="npx create-expo-app@latest my-app" index={0} />
      </Animated.View>

      {/* Installation Steps */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
          Installation
        </Text>

        {/* Step 1 */}
        <View style={styles.step}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}>
              1
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Install Quartz UI
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 24 }}>
              Install the core package using your preferred package manager:
            </Text>
            <View style={styles.codeGroup}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8, fontWeight: '600' }}>
                NPM
              </Text>
              <CodeBlock code="npm install quartz-ui" index={1} />
            </View>
            <View style={styles.codeGroup}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8, fontWeight: '600' }}>
                YARN
              </Text>
              <CodeBlock code="yarn add quartz-ui" index={2} />
            </View>
            <View style={styles.codeGroup}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8, fontWeight: '600' }}>
                PNPM
              </Text>
              <CodeBlock code="pnpm add quartz-ui" index={3} />
            </View>
          </View>
        </View>

        {/* Step 2 */}
        <View style={styles.step}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>
              2
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Install Peer Dependencies
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 24 }}>
              Quartz UI requires several Expo packages. Install them using:
            </Text>
            <CodeBlock
              code="npx expo install expo-haptics react-native-reanimated react-native-gesture-handler react-native-safe-area-context"
              index={4}
            />
          </View>
        </View>

        {/* Step 3 */}
        <View style={styles.step}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '700' }}>
              3
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Configure Babel (Reanimated)
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 24 }}>
              Add the Reanimated plugin to your babel.config.js:
            </Text>
            <Surface
              style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}
              elevation={0}
            >
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: 'monospace',
                  lineHeight: 20,
                }}
              >
{`module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};`}
              </Text>
            </Surface>
          </View>
        </View>
      </Animated.View>

      {/* Verification */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
          Verify Installation
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12, lineHeight: 26 }}>
          To verify that Quartz UI is installed correctly, try importing a component:
        </Text>
        <Surface
          style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}
          elevation={0}
        >
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              fontFamily: 'monospace',
              lineHeight: 20,
            }}
          >
{`import { QuartzProvider, Button } from 'quartz-ui';

export default function App() {
  return (
    <QuartzProvider>
      <Button variant="filled" onPress={() => {}}>
        Hello Quartz UI!
      </Button>
    </QuartzProvider>
  );
}`}
          </Text>
        </Surface>
      </Animated.View>

      {/* Next Steps */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
        <Surface
          style={[styles.nextStepsCard, { backgroundColor: theme.colors.primaryContainer }]}
          elevation={0}
        >
          <Ionicons name="arrow-forward-circle" size={40} color={theme.colors.onPrimaryContainer} />
          <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700', marginTop: 16 }}>
            Next Steps
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onPrimaryContainer, marginTop: 8, opacity: 0.9, textAlign: 'center' }}>
            Now that you've installed Quartz UI, check out the Quick Start guide to learn how to use it
          </Text>
          <View style={styles.nextStepsList}>
            <View style={styles.nextStepItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.onPrimaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8 }}>
                Read the Quick Start guide
              </Text>
            </View>
            <View style={styles.nextStepItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.onPrimaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8 }}>
                Explore component examples
              </Text>
            </View>
            <View style={styles.nextStepItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.onPrimaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8 }}>
                Customize your theme
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/docs/quick-start' as any)}
              style={({ pressed }) => [
                styles.nextStepButton,
                {
                  backgroundColor: pressed ? theme.colors.primary + 'DD' : theme.colors.primary,
                },
              ]}
            >
              <Text variant="titleSmall" style={{ color: theme.colors.onPrimary, fontWeight: '700' }}>
                Go to Quick Start
              </Text>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.onPrimary} />
            </Pressable>
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
  step: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 20,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  codeGroup: {
    marginTop: 16,
  },
  codeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 12,
  },
  copyButton: {
    padding: 8,
    borderRadius: 6,
  },
  nextStepsCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  nextStepsList: {
    marginTop: 24,
    gap: 12,
    alignSelf: 'stretch',
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextStepButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
});
