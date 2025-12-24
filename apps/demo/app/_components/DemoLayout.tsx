import React, { ReactNode } from 'react';
import { View, StyleSheet, StatusBar, Pressable, Platform } from 'react-native';
import { Text, Surface, useTheme } from 'quartz-ui';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const HERO_HEIGHT = 220;

type IconName = keyof typeof Ionicons.glyphMap;

interface DemoLayoutProps {
  title: string;
  subtitle: string;
  icon: IconName;
  gradient: [string, string];
  children: ReactNode;
}

export function DemoLayout({ title, subtitle, icon, gradient, children }: DemoLayoutProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Parallax hero animation
  const heroAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT],
      [0, HERO_HEIGHT * 0.35],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.25, 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  // Header background for scroll
  const headerBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HERO_HEIGHT * 0.3, HERO_HEIGHT * 0.7],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Compact header title
  const headerTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HERO_HEIGHT * 0.5, HERO_HEIGHT * 0.8],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [HERO_HEIGHT * 0.5, HERO_HEIGHT * 0.8],
      [10, 0],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top }]}>
        <Animated.View style={[styles.headerBg, headerBgStyle]}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <View style={styles.headerContent}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
            ]}
          >
            <View style={styles.backButtonInner}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </View>
          </Pressable>

          <Animated.Text style={[styles.headerTitle, headerTitleStyle]}>
            {title}
          </Animated.Text>

          <View style={styles.headerSpacer} />
        </View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 56 }]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.hero, heroAnimatedStyle]}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Decorative Elements */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
            <View style={styles.decorCircle3} />

            <View style={styles.heroContent}>
              {/* Icon with glow effect */}
              <View style={styles.iconGlow}>
                <View style={styles.iconContainer}>
                  <Ionicons name={icon} size={40} color="#fff" />
                </View>
              </View>

              <Text variant="headlineLarge" style={styles.heroTitle}>
                {title}
              </Text>
              <Text variant="bodyLarge" style={styles.heroSubtitle}>
                {subtitle}
              </Text>

              {/* Badge */}
              <View style={styles.badge}>
                <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.9)" />
                <Text style={styles.badgeText}>Material Design 3</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <View style={[styles.footerCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Ionicons name="code-slash" size={16} color={theme.colors.onSurfaceVariant} />
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginStart: 8 }}>
              Quartz UI • React Native
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  index?: number;
}

export function Section({ title, subtitle, children, index = 0 }: SectionProps) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(80 + index * 40).springify().damping(15)}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionDot, { backgroundColor: theme.colors.primary }]} />
          <Text variant="titleLarge" style={{ color: theme.colors.onBackground, fontWeight: '700' }}>
            {title}
          </Text>
        </View>
        {subtitle && (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, marginStart: 20 }}>
            {subtitle}
          </Text>
        )}
      </View>

      <Surface
        style={[
          styles.sectionContent,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          }
        ]}
        elevation={0}
      >
        {children}
      </Surface>
    </Animated.View>
  );
}

// Compact variant for tighter layouts
interface CompactSectionProps {
  title: string;
  children: ReactNode;
  index?: number;
}

export function CompactSection({ title, children, index = 0 }: CompactSectionProps) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeIn.delay(50 + index * 30)}
      style={styles.compactSection}
    >
      <Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600', marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  backButton: {
    padding: 8,
  },
  backButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginEnd: 52,
  },
  headerSpacer: {
    width: 52,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  hero: {
    marginHorizontal: 16,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 8,
  },
  heroGradient: {
    paddingVertical: 36,
    paddingHorizontal: 24,
    position: 'relative',
  },
  decorCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorCircle3: {
    position: 'absolute',
    top: 40,
    left: 60,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroContent: {
    alignItems: 'center',
  },
  iconGlow: {
    padding: 8,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 16,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  badge: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    paddingTop: 20,
  },
  footer: {
    marginTop: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginEnd: 12,
  },
  sectionContent: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  compactSection: {
    marginBottom: 16,
  },
});
