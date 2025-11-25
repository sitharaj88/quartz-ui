import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Surface, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from '../_components/DocLayout';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function IntroductionPage() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const features = [
    {
      icon: 'color-palette',
      title: 'Modern Design',
      description: 'Built with Material Design 3 principles for a beautiful, consistent look.',
    },
    {
      icon: 'phone-portrait',
      title: 'Expo Ready',
      description: 'Seamlessly integrates with Expo and React Native applications.',
    },
    {
      icon: 'moon',
      title: 'Dark Mode',
      description: 'Automatic theme switching with system detection built-in.',
    },
    {
      icon: 'accessibility',
      title: 'Accessible',
      description: 'WCAG compliant with screen reader support out of the box.',
    },
    {
      icon: 'flash',
      title: 'Animated',
      description: 'Smooth, performant animations powered by Reanimated.',
    },
    {
      icon: 'shield-checkmark',
      title: 'Type Safe',
      description: 'Full TypeScript support with complete type definitions.',
    },
  ];

  return (
    <DocLayout
      title="Introduction"
      description="Welcome to Quartz UI - A modern, accessible component library for React Native and Expo"
    >
      {/* Overview Section */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
          What is Quartz UI?
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12, lineHeight: 26 }}>
          Quartz UI is a comprehensive component library built specifically for React Native and Expo
          applications. It follows Material Design 3 guidelines while providing the flexibility to
          customize every aspect of your app's appearance.
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16, lineHeight: 26 }}>
          Whether you're building a mobile app, web app, or both, Quartz UI provides all the
          components you need with a consistent, beautiful design system.
        </Text>
      </View>

      {/* Features Grid */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 20 }}>
          Key Features
        </Text>
        <View style={styles.grid}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.delay(index * 50).springify()}
              style={[styles.gridItem, isMobile ? styles.gridItemMobile : styles.gridItemDesktop]}
            >
              <Surface
                style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}
                elevation={1}
              >
                <View style={[styles.featureIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Ionicons name={feature.icon as any} size={28} color={theme.colors.onPrimaryContainer} />
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
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Surface
          style={[styles.statsCard, { backgroundColor: theme.colors.tertiaryContainer }]}
          elevation={0}
        >
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="displayMedium" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '800', fontSize: isMobile ? 28 : undefined, lineHeight: isMobile ? 32 : undefined }}>
                33
              </Text>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4 }}>
                Components
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text variant="displayMedium" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '800', fontSize: isMobile ? 28 : undefined, lineHeight: isMobile ? 32 : undefined }}>
                100%
              </Text>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4 }}>
                TypeScript
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text variant="displayMedium" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '800', fontSize: isMobile ? 28 : undefined, lineHeight: isMobile ? 32 : undefined }}>
                A11y
              </Text>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4 }}>
                Ready
              </Text>
            </View>
          </View>
        </Surface>
      </View>

      {/* Getting Started CTA */}
      <View style={styles.section}>
        <Surface
          style={[styles.ctaCard, { backgroundColor: theme.colors.primaryContainer }]}
          elevation={0}
        >
          <Ionicons name="rocket" size={48} color={theme.colors.onPrimaryContainer} />
          <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700', marginTop: 16 }}>
            Ready to get started?
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onPrimaryContainer, marginTop: 8, textAlign: 'center', opacity: 0.9 }}>
            Install Quartz UI and start building beautiful apps in minutes
          </Text>
          <View style={styles.ctaButtons}>
            <Button
              variant="filled"
              onPress={() => router.push('/docs/installation' as any)}
            >
              Installation Guide
            </Button>
            <Button
              variant="outlined"
              onPress={() => router.push('/docs/quick-start' as any)}
            >
              Quick Start
            </Button>
          </View>
        </Surface>
      </View>

    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginHorizontal: -8,
  },
  gridItem: {
    width: '100%',
    padding: 8,
  },
  gridItemMobile: {
    flexBasis: '100%',
    maxWidth: '100%',
  },
  gridItemDesktop: {
    flexBasis: '48%',
    maxWidth: '48%',
  },
  featureCard: {
    padding: 24,
    borderRadius: 16,
    minHeight: 180,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    padding: 32,
    borderRadius: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  ctaCard: {
    padding: 40,
    borderRadius: 20,
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
