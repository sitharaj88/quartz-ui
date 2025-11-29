import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable, StatusBar, ScrollView, Platform, NativeSyntheticEvent, NativeScrollEvent, useWindowDimensions, Linking, Share } from 'react-native';
import { Text, Surface, Button, useTheme } from 'quartz-ui';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  useAnimatedProps,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconName = keyof typeof Ionicons.glyphMap;

const DOCS_URL = 'https://sitharaj88.github.io/quartz-ui/';
const GITHUB_URL = 'https://github.com/sitharaj88/quartz-ui';

interface Feature {
  icon: IconName;
  title: string;
  description: string;
  gradient: readonly [string, string];
}

const features: Feature[] = [
  { icon: 'cube', title: '33 Components', description: 'Production-ready UI components built for React Native & Expo', gradient: ['#667eea', '#764ba2'] as const },
  { icon: 'color-palette', title: 'Material Design 3', description: 'Following the latest Material You design guidelines', gradient: ['#f093fb', '#f5576c'] as const },
  { icon: 'moon', title: 'Dark Mode Ready', description: 'Beautiful themes with automatic dark mode support', gradient: ['#4facfe', '#00f2fe'] as const },
  { icon: 'accessibility', title: 'Fully Accessible', description: 'WCAG compliant with full screen reader support', gradient: ['#43e97b', '#38f9d7'] as const },
  { icon: 'flash', title: '60fps Animations', description: 'Buttery smooth animations powered by Reanimated 3', gradient: ['#fa709a', '#fee140'] as const },
  { icon: 'code-slash', title: 'TypeScript First', description: 'Full type safety with excellent IntelliSense support', gradient: ['#a18cd1', '#fbc2eb'] as const },
];

const componentCategories = [
  { name: 'Core Components', icon: 'radio-button-on' as IconName, gradient: ['#667eea', '#764ba2'] as const, count: 8, items: ['Button', 'FAB', 'Icon Button', 'Card', 'Typography', 'Surface'], route: '/buttons' },
  { name: 'Inputs & Selection', icon: 'create' as IconName, gradient: ['#f093fb', '#f5576c'] as const, count: 9, items: ['Text Input', 'Checkbox', 'Switch', 'Radio', 'Chip', 'Picker'], route: '/inputs' },
  { name: 'Navigation', icon: 'navigate' as IconName, gradient: ['#4facfe', '#00f2fe'] as const, count: 8, items: ['App Bar', 'Nav Bar', 'Tabs', 'Drawer', 'Rail', 'Search'], route: '/navigation' },
  { name: 'Data Display', icon: 'albums' as IconName, gradient: ['#43e97b', '#38f9d7'] as const, count: 7, items: ['List', 'Badge', 'Divider', 'Carousel', 'Slider', 'Progress'], route: '/lists' },
  { name: 'Feedback', icon: 'chatbubbles' as IconName, gradient: ['#fa709a', '#fee140'] as const, count: 5, items: ['Dialog', 'Snackbar', 'Banner', 'Tooltip', 'Progress'], route: '/dialogs' },
  { name: 'Overlays', icon: 'layers' as IconName, gradient: ['#a18cd1', '#fbc2eb'] as const, count: 5, items: ['Menu', 'Bottom Sheet', 'Side Sheet', 'Modal'], route: '/overlays' },
];

// Stats data
const stats = [
  { value: '33', label: 'Components', icon: 'cube' as IconName },
  { value: '100%', label: 'TypeScript', icon: 'code-slash' as IconName },
  { value: '60fps', label: 'Animations', icon: 'flash' as IconName },
  { value: 'A11y', label: 'Accessible', icon: 'accessibility' as IconName },
];

const LICENSE_URL = 'https://github.com/sitharaj88/quartz-ui/blob/main/LICENSE';

// Code example for the developer experience section
const codeExample = `import { Button, Card, Text } from 'quartz-ui';

function MyComponent() {
  return (
    <Card>
      <Text variant="headlineSmall">
        Hello Quartz UI!
      </Text>
      <Button mode="filled" onPress={handlePress}>
        Get Started
      </Button>
    </Card>
  );
}`;

// Animated gradient orb
function GradientOrb({ delay, size, position, colors }: { delay: number; size: number; position: { top?: number | string; left?: number | string; right?: number | string; bottom?: number | string }; colors: readonly [string, string, ...string[]] }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const positionStyle = {
    position: 'absolute' as const,
    width: size,
    height: size,
    borderRadius: size / 2,
    ...(position.top !== undefined && { top: position.top }),
    ...(position.left !== undefined && { left: position.left }),
    ...(position.right !== undefined && { right: position.right }),
    ...(position.bottom !== undefined && { bottom: position.bottom }),
  };

  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(1500)}
      // @ts-ignore - Complex style typing issue with Animated.View
      style={[positionStyle, animatedStyle]}
    >
      <LinearGradient
        colors={colors}
        style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
}

// Floating badge component
function FloatingBadge({ children, delay }: { children: React.ReactNode; delay: number }) {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify().damping(12)} style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

// Scroll indicator with bounce animation
function ScrollIndicator() {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSpring(12, { damping: 3, stiffness: 80 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.scrollIndicator, animatedStyle]}>
      <View style={styles.scrollIndicatorInner}>
        <View style={styles.scrollIndicatorDot} />
      </View>
      <Text style={styles.scrollIndicatorText}>Scroll to explore</Text>
    </Animated.View>
  );
}

// Feature card component
function FeatureCard({ feature, index, isMobile }: { feature: Feature; index: number; isMobile: boolean }) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(100 + index * 80).springify().damping(14)}
      style={[styles.featureCard, { width: isMobile ? '100%' : 340 }]}
    >
      <Pressable style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.9 : 1 }]}>
        <Surface style={[styles.featureSurface, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <LinearGradient
            colors={feature.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featureIconBox}
          >
            <Ionicons name={feature.icon} size={28} color="#fff" />
          </LinearGradient>
          <Text variant="titleLarge" style={[styles.featureTitle, { color: theme.colors.onSurface }]}>
            {feature.title}
          </Text>
          <Text variant="bodyMedium" style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
            {feature.description}
          </Text>
          <LinearGradient
            colors={feature.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.featureAccent}
          />
        </Surface>
      </Pressable>
    </Animated.View>
  );
}

// Category card component
function CategoryCard({ category, index, cardWidth, theme }: { category: typeof componentCategories[0]; index: number; cardWidth: number; theme: any }) {
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeInRight.delay(100 + index * 100).springify().damping(14)}
      style={[styles.categoryCard, { width: cardWidth }]}
    >
      <Pressable
        onPress={() => router.push(category.route as any)}
        style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }], opacity: pressed ? 0.95 : 1 }]}
      >
        <Surface style={[styles.categorySurface, { backgroundColor: theme.colors.surface }]} elevation={3}>
          <View style={styles.categoryHeader}>
            <LinearGradient colors={category.gradient} style={styles.categoryIconBox}>
              <Ionicons name={category.icon} size={28} color="#fff" />
            </LinearGradient>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{category.count}</Text>
            </View>
          </View>
          <Text variant="titleLarge" style={[styles.categoryTitle, { color: theme.colors.onSurface }]}>
            {category.name}
          </Text>
          <View style={styles.categoryItems}>
            {category.items.slice(0, 4).map((item, i) => (
              <View key={item} style={styles.categoryItem}>
                <View style={[styles.categoryDot, { backgroundColor: category.gradient[0] }]} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.categoryFooter}>
            <Text variant="labelLarge" style={{ color: category.gradient[0], fontWeight: '700' }}>
              View all
            </Text>
            <Ionicons name="arrow-forward" size={18} color={category.gradient[0]} />
          </View>
        </Surface>
      </Pressable>
    </Animated.View>
  );
}

// Code preview component
function CodePreview({ theme, isMobile }: { theme: any; isMobile: boolean }) {
  return (
    <Animated.View entering={FadeInUp.delay(400).springify().damping(14)} style={styles.codePreview}>
      <Surface style={[styles.codeSurface, { backgroundColor: '#1e1e1e' }]} elevation={4}>
        <View style={styles.codeHeader}>
          <View style={styles.codeHeaderDots}>
            <View style={[styles.codeDot, { backgroundColor: '#ff5f57' }]} />
            <View style={[styles.codeDot, { backgroundColor: '#ffbd2e' }]} />
            <View style={[styles.codeDot, { backgroundColor: '#28ca42' }]} />
          </View>
          <Text style={styles.codeFileName}>App.tsx</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.codeContent, { paddingHorizontal: isMobile ? 16 : 24 }]}>
            {codeExample.split('\n').map((line, i) => (
              <View key={i} style={styles.codeLine}>
                <Text style={styles.codeLineNumber}>{(i + 1).toString().padStart(2, ' ')}</Text>
                <Text style={styles.codeText}>{line}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </Surface>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselScrollRef = useRef<ScrollView>(null);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Wrap scroll handler for web compatibility
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS === 'web') {
      scrollY.value = event.nativeEvent.contentOffset.y;
    } else if (typeof scrollHandler === 'function') {
      scrollHandler(event);
    }
  }, [scrollHandler, scrollY]);

  // Carousel scroll handler
  const handleCarouselScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = isMobile ? width * 0.8 + 20 : isTablet ? 340 : 360;
    const newIndex = Math.round(offsetX / cardWidth);
    setActiveCarouselIndex(newIndex);
  }, [isMobile, isTablet, width]);

  // Scroll to specific carousel index
  const scrollToCarouselIndex = useCallback((index: number) => {
    const cardWidth = isMobile ? width * 0.8 + 20 : isTablet ? 340 : 360;
    carouselScrollRef.current?.scrollTo({
      x: index * cardWidth,
      animated: true,
    });
  }, [isMobile, isTablet, width]);

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      backgroundColor: theme.mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    };
  });

  const heroParallax = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 400], [0, 150], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, 300], [1, 0], Extrapolation.CLAMP);
    return { transform: [{ translateY }], opacity };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Floating Header */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top + 8 },
          headerStyle,
        ]}
      >
        <View style={[styles.headerContent, { maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.headerLogo}>
              <Ionicons name="layers" size={isMobile ? 20 : 24} color="#fff" />
            </LinearGradient>
            <Text variant="titleMedium" style={[styles.headerTitle, { color: theme.colors.onSurface, fontSize: isMobile ? 16 : 18 }]}>
              Quartz UI
            </Text>
          </View>
          <View style={styles.headerRight}>
            {!isMobile && (
              <>
                <Pressable onPress={() => router.push('/docs/introduction' as any)} style={styles.headerLink}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>Docs</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/buttons' as any)} style={styles.headerLink}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>Components</Text>
                </Pressable>
              </>
            )}
            <Pressable style={styles.headerIcon} onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui')}>
              <Ionicons name="logo-github" size={24} color={theme.colors.onSurface} />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isMobile ? insets.bottom + 100 : insets.bottom + 60 }}
      >
        {/* Dev build note */}
        <Animated.View entering={FadeIn.delay(150)} style={{ paddingHorizontal: isMobile ? 20 : 32, paddingTop: isMobile ? 16 : 24 }}>
          <Surface
            style={[
              styles.noteCard,
              {
                backgroundColor: theme.colors.surfaceVariant,
                borderColor: theme.colors.outlineVariant + '60',
              },
            ]}
            elevation={0}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Ionicons name="information-circle" size={isMobile ? 18 : 20} color={theme.colors.primary} />
              <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                Note
              </Text>
            </View>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                lineHeight: 22,
              }}
            >
              This is a dev build targeting release in Feb 2025. Focus areas: like interactions, TODO follow-ups, RTL support validation, and other in-progress items stabilizing for launch.
            </Text>
          </Surface>
        </Animated.View>

        {/* Hero Section */}
        <View style={[styles.hero, { minHeight: height * 0.95 }]}>
          <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460', '#1a1a2e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Animated background orbs */}
          <GradientOrb delay={0} size={isMobile ? 300 : 500} position={{ top: -100, right: isMobile ? -150 : -100 }} colors={['#667eea', '#764ba2']} />
          <GradientOrb delay={200} size={isMobile ? 250 : 400} position={{ bottom: isMobile ? 100 : 50, left: isMobile ? -125 : -100 }} colors={['#f093fb', '#f5576c']} />
          <GradientOrb delay={400} size={isMobile ? 150 : 250} position={{ top: '40%', left: '60%' }} colors={['#4facfe', '#00f2fe']} />

          <Animated.View style={[styles.heroContent, heroParallax, { paddingTop: insets.top + 100, paddingHorizontal: isMobile ? 0 : 40 }]}>
            {/* Version badge */}
            <FloatingBadge delay={100}>
              <View style={styles.versionBadge}>
                <View style={styles.versionDot} />
                <Text style={styles.versionText}>Dev build — Target Feb 2025</Text>
              </View>
            </FloatingBadge>

            {/* Hero title */}
            <Animated.View entering={FadeInUp.delay(200).springify().damping(12)} style={{ width: '100%', alignItems: 'center', paddingHorizontal: isMobile ? 16 : 0 }}>
              <Text style={[styles.heroTitle, { fontSize: isMobile ? 40 : isTablet ? 52 : 68, lineHeight: isMobile ? 46 : isTablet ? 60 : 78 }]}>
                Ready to build
              </Text>
              <Text style={[styles.heroTitleHighlight, styles.heroTitleLine2, { fontSize: isMobile ? 40 : isTablet ? 54 : 72, lineHeight: isMobile ? 48 : isTablet ? 64 : 84 }]}>
                something amazing?
              </Text>
            </Animated.View>

            {/* Hero subtitle */}
            <Animated.View entering={FadeInUp.delay(300).springify().damping(12)} style={{ width: '100%', alignItems: 'center', paddingHorizontal: isMobile ? 20 : 0 }}>
              <Text style={[styles.heroSubtitle, { fontSize: isMobile ? 15 : 19, lineHeight: isMobile ? 24 : 30 }]}>
                Create stunning mobile apps with{' '}
                <Text style={styles.heroSubtitleHighlight}>Material Design 3</Text>
                {'\n'}Beautiful • Accessible • Blazing Fast
              </Text>
            </Animated.View>

            {/* CTA buttons */}
            <Animated.View entering={FadeInUp.delay(400).springify().damping(12)} style={[styles.ctaRow, { flexDirection: isMobile ? 'column' : 'row', paddingHorizontal: isMobile ? 20 : 0, maxWidth: isMobile ? '100%' : 400 }]}>
              <Pressable
                onPress={() => router.push('/docs/installation' as any)}
                style={({ pressed }) => [
                  styles.ctaPrimary,
                  {
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    width: isMobile ? '100%' : 'auto',
                    minWidth: isMobile ? undefined : 180,
                    shadowColor: theme.colors.primary,
                  }
                ]}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary, theme.colors.primaryContainer]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
                />
                <Text style={[styles.ctaPrimaryText, { color: theme.colors.onPrimary }]}>Get Started</Text>
                <Ionicons name="arrow-forward" size={18} color={theme.colors.onPrimary} />
              </Pressable>

              <Pressable
                onPress={() => router.push('/buttons' as any)}
                style={({ pressed }) => [
                  styles.ctaSecondary,
                  {
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    width: isMobile ? '100%' : 'auto',
                    minWidth: isMobile ? undefined : 180,
                    borderColor: theme.colors.primary + '55',
                    backgroundColor: theme.colors.surfaceVariant + '33',
                  }
                ]}
              >
                <Text style={[styles.ctaSecondaryText, { color: '#fff' }]}>View Components</Text>
              </Pressable>
            </Animated.View>

            {/* Quick stats - horizontal on all sizes */}
            <Animated.View entering={FadeInUp.delay(500).springify().damping(12)} style={[styles.statsRow, { gap: isMobile ? 0 : 0 }]}>
              {stats.map((stat, i) => (
                <View key={stat.label} style={[styles.statItem, i === stats.length - 1 && { borderRightWidth: 0 }]}>
                  <Text style={[styles.statItemValue, { fontSize: isMobile ? 16 : 20 }]}>{stat.value}</Text>
                  <Text style={[styles.statItemLabel, { fontSize: isMobile ? 9 : 10 }]}>{stat.label}</Text>
                </View>
              ))}
            </Animated.View>

            {/* Scroll indicator */}
            <ScrollIndicator />
          </Animated.View>
        </View>

        {/* Features Section */}
        <View style={[styles.section, { paddingHorizontal: isMobile ? 20 : 40, maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
          <Animated.View entering={FadeInUp.delay(100).springify().damping(14)} style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: theme.colors.primary }]}>FEATURES</Text>
            <Text variant="displaySmall" style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: isMobile ? 32 : 48 }]}>
              Everything you need to build beautiful apps
            </Text>
            <Text variant="bodyLarge" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Quartz UI provides a complete set of components, theming, and utilities to create stunning mobile experiences.
            </Text>
          </Animated.View>

          <View style={[styles.featuresGrid, { gap: isMobile ? 16 : 24 }]}>
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} isMobile={isMobile} />
            ))}
          </View>
        </View>

        {/* Code Preview Section */}
        <View style={[styles.section, { paddingHorizontal: isMobile ? 20 : 40, maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
          <Animated.View entering={FadeInUp.delay(100).springify().damping(14)} style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: theme.colors.primary }]}>DEVELOPER EXPERIENCE</Text>
            <Text variant="displaySmall" style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: isMobile ? 32 : 48 }]}>
              Simple, intuitive API
            </Text>
            <Text variant="bodyLarge" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Import components and start building. Full TypeScript support with excellent documentation.
            </Text>
          </Animated.View>

          <CodePreview theme={theme} isMobile={isMobile} />
        </View>

        {/* Components Section - Grid Design */}
        <View style={[styles.section, { paddingHorizontal: isMobile ? 20 : 40, maxWidth: 1400, alignSelf: 'center', width: '100%' }]}>
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(100).springify().damping(14)} style={styles.componentsGridHeader}>
            {/* Badge */}
            <LinearGradient
              colors={['rgba(102, 126, 234, 0.12)', 'rgba(118, 75, 162, 0.12)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.componentsGridBadge, { paddingHorizontal: isMobile ? 18 : 16, paddingVertical: isMobile ? 9 : 8 }]}
            >
              <View style={[styles.componentsGridBadgeDot, { backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.componentsGridBadgeText, { color: theme.colors.primary, fontSize: isMobile ? 13 : 12 }]}>
                COMPONENT LIBRARY
              </Text>
            </LinearGradient>

            {/* Title */}
            <Text style={[styles.componentsGridTitle, { color: theme.colors.onSurface, fontSize: isMobile ? 32 : 48, marginTop: 20 }]}>
              33 Production-Ready{'\n'}
              <Text style={{ color: theme.colors.primary }}>Components</Text>
            </Text>

            {/* Subtitle */}
            <Text variant="bodyLarge" style={[styles.componentsGridSubtitle, { color: theme.colors.onSurfaceVariant, fontSize: isMobile ? 16 : 18, marginTop: 16 }]}>
              Everything you need to build beautiful, accessible mobile apps. From simple buttons to complex navigation patterns.
            </Text>
          </Animated.View>

          {/* Grid */}
          <View style={[styles.componentsGrid, { marginTop: isMobile ? 40 : 56 }]}>
            {componentCategories.map((category, index) => (
              <Animated.View
                key={category.name}
                entering={FadeInUp.delay(100 + index * 80).springify().damping(14)}
                style={[
                  styles.componentsGridCard,
                  {
                    width: isMobile ? '100%' : isTablet ? (width - 80 - 24) / 2 : (width > 1400 ? 1400 - 80 - 48 : width - 80 - 48) / 3,
                  }
                ]}
              >
                <Pressable
                  onPress={() => router.push(category.route as any)}
                  style={({ pressed }) => [
                    { transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.95 : 1 }
                  ]}
                >
                  <Surface
                    style={[
                      styles.componentsGridCardInner,
                      {
                        backgroundColor: theme.colors.surface,
                        borderWidth: 1,
                        borderColor: theme.colors.outlineVariant + '30',
                      }
                    ]}
                    elevation={1}
                  >
                    {/* Gradient overlay */}
                    <LinearGradient
                      colors={[category.gradient[0] + '08', category.gradient[1] + '08', category.gradient[0] + '00', category.gradient[1] + '00'] as const}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />

                    {/* Icon */}
                    <LinearGradient
                      colors={category.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.componentsGridIcon, { width: isMobile ? 56 : 64, height: isMobile ? 56 : 64 }]}
                    >
                      <Ionicons name={category.icon} size={isMobile ? 28 : 32} color="#fff" />
                    </LinearGradient>

                    {/* Content */}
                    <View style={styles.componentsGridCardContent}>
                      {/* Title & Badge */}
                      <View style={styles.componentsGridCardHeader}>
                        <Text variant="titleLarge" style={[styles.componentsGridCardTitle, { color: theme.colors.onSurface, fontSize: isMobile ? 18 : 20 }]}>
                          {category.name}
                        </Text>
                        <View style={[styles.componentsGridCardBadge, { backgroundColor: category.gradient[0] + '20' }]}>
                          <Text style={[styles.componentsGridCardBadgeText, { color: category.gradient[0], fontSize: isMobile ? 12 : 13 }]}>
                            {category.count}
                          </Text>
                        </View>
                      </View>

                      {/* Items List */}
                      <View style={[styles.componentsGridCardItems, { marginTop: isMobile ? 12 : 16 }]}>
                        {category.items.slice(0, 3).map((item) => (
                          <View key={item} style={styles.componentsGridCardItem}>
                            <View style={[styles.componentsGridCardItemDot, { backgroundColor: category.gradient[0] }]} />
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontSize: isMobile ? 14 : 15 }}>
                              {item}
                            </Text>
                          </View>
                        ))}
                        {category.items.length > 3 && (
                          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7, marginTop: 8, fontSize: isMobile ? 13 : 14 }}>
                            +{category.items.length - 3} more
                          </Text>
                        )}
                      </View>

                      {/* Footer */}
                      <View style={[styles.componentsGridCardFooter, { marginTop: isMobile ? 16 : 20 }]}>
                        <Text variant="labelLarge" style={{ color: category.gradient[0], fontWeight: '700', fontSize: isMobile ? 14 : 15 }}>
                          Explore
                        </Text>
                        <Ionicons name="arrow-forward" size={isMobile ? 18 : 20} color={category.gradient[0]} />
                      </View>
                    </View>

                    {/* Accent Line */}
                    <LinearGradient
                      colors={category.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.componentsGridCardAccent}
                    />
                  </Surface>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* CTA Section - Ultra Modern */}
        <View style={[styles.section, { paddingHorizontal: isMobile ? 0 : 40, maxWidth: isMobile ? undefined : 1200, alignSelf: isMobile ? 'stretch' : 'center', width: '100%', marginTop: 120 }]}>
          <Animated.View entering={FadeInUp.delay(100).springify().damping(14)} style={styles.ctaSection}>
            {/* Light Material Background */}
            <View style={StyleSheet.absoluteFill}>
              <LinearGradient
                colors={[
                  theme.colors.primaryContainer + '20',
                  theme.colors.secondaryContainer + '15',
                  theme.colors.tertiaryContainer + '10',
                  theme.colors.primaryContainer + '20'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {/* Subtle floating orbs */}
              <Animated.View style={[styles.ctaOrb1, { opacity: 0.3 }]}>
                <LinearGradient
                  colors={[theme.colors.primary + '40', theme.colors.primary + '20']}
                  style={styles.ctaOrbGradient}
                />
              </Animated.View>
              <Animated.View style={[styles.ctaOrb2, { opacity: 0.2 }]}>
                <LinearGradient
                  colors={[theme.colors.secondary + '40', theme.colors.secondary + '20']}
                  style={styles.ctaOrbGradient}
                />
              </Animated.View>
              <Animated.View style={[styles.ctaOrb3, { opacity: 0.25 }]}>
                <LinearGradient
                  colors={[theme.colors.tertiary + '40', theme.colors.tertiary + '20']}
                  style={styles.ctaOrbGradient}
                />
              </Animated.View>
            </View>

            {/* Light Material Card */}
            <View style={[styles.ctaGlassCard, {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outlineVariant + '40',
              shadowColor: theme.colors.shadow,
              shadowOpacity: 0.1,
              elevation: 4,
              margin: isMobile ? 0 : 16,
              borderRadius: isMobile ? 0 : 24,
              padding: isMobile ? 24 : 32
            }]}>
              {/* Subtle inner gradient */}
              <LinearGradient
                colors={[
                  theme.colors.surface,
                  theme.colors.surfaceContainerLowest + '80',
                  theme.colors.surface
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {/* Icon with glow effect */}
              <Animated.View entering={FadeInUp.delay(200).springify().damping(12)} style={styles.ctaIconContainer}>
                <View style={[styles.ctaIconGlow, { shadowColor: theme.colors.primary }]}>
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary, theme.colors.tertiary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ctaIconBadge}
                  >
                    <Ionicons name="sparkles" size={isMobile ? 28 : 36} color={theme.colors.onPrimary} />
                  </LinearGradient>
                </View>
              </Animated.View>

              {/* Title with modern typography */}
              <Animated.View entering={FadeInUp.delay(300).springify().damping(12)}>
                <Text style={[styles.ctaTitle, {
                  fontSize: isMobile ? 32 : 48,
                  lineHeight: isMobile ? 40 : 56,
                  color: theme.colors.onSurface
                }]}>
                  Ready to build{'\n'}something{' '}
                  <Text style={[styles.ctaTitleHighlight, {
                    backgroundColor: theme.colors.primaryContainer,
                    color: theme.colors.onPrimaryContainer
                  }]}>
                    amazing
                  </Text>?
                </Text>
              </Animated.View>

              {/* Enhanced subtitle */}
              <Animated.View entering={FadeInUp.delay(400).springify().damping(12)}>
                <Text style={[styles.ctaSubtitle, {
                  fontSize: isMobile ? 16 : 18,
                  lineHeight: isMobile ? 24 : 28,
                  color: theme.colors.onSurfaceVariant
                }]}>
                  Join thousands of developers creating beautiful, accessible apps with Quartz UI.{'\n'}
                  Start your journey today.
                </Text>
              </Animated.View>

              {/* Modern button group */}
              <Animated.View entering={FadeInUp.delay(500).springify().damping(12)} style={[styles.ctaButtonGroup, {
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 12 : 16,
                marginBottom: isMobile ? 40 : 64,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: isMobile ? 440 : undefined,
                alignSelf: 'center'
              }]}>
                <Pressable
                  onPress={() => router.push('/docs/installation' as any)}
                  style={({ pressed }) => [styles.ctaPrimaryBtn, {
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    shadowColor: theme.colors.primary,
                    shadowOpacity: pressed ? 0.2 : 0.15,
                    alignSelf: 'center',
                    width: isMobile ? '100%' : 'auto'
                  }]}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryContainer]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaPrimaryGradient}
                  >
                    <Ionicons name="rocket" size={isMobile ? 18 : 20} color={theme.colors.onPrimary} />
                    <Text style={[styles.ctaPrimaryText, { color: theme.colors.onPrimary, fontSize: isMobile ? 16 : 18 }]}>
                      Get Started Free
                    </Text>
                    <Ionicons name="arrow-forward" size={isMobile ? 16 : 18} color={theme.colors.onPrimary} />
                  </LinearGradient>
                </Pressable>

                <Pressable
                  onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui')}
                  style={({ pressed }) => [styles.ctaSecondaryBtn, {
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.outline,
                    alignSelf: 'center',
                    width: isMobile ? '100%' : 'auto'
                  }]}
                >
                  <View style={styles.ctaSecondaryContent}>
                    <Ionicons name="logo-github" size={isMobile ? 18 : 20} color={theme.colors.onSurfaceVariant} />
                    <Text style={[styles.ctaSecondaryText, {
                      color: theme.colors.onSurfaceVariant,
                      fontSize: isMobile ? 14 : 16
                    }]}>
                      View Source
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>

              {/* Enhanced stats with icons */}
              <Animated.View entering={FadeInUp.delay(600).springify().damping(12)} style={[styles.ctaStatsGrid, {
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 24 : 40,
                alignItems: 'center'
              }]}>
                <View style={styles.ctaStatItem}>
                  <View style={[styles.ctaStatIcon, {
                    backgroundColor: theme.colors.primaryContainer,
                    shadowColor: theme.colors.primary
                  }]}>
                    <Ionicons name="cube" size={isMobile ? 18 : 20} color={theme.colors.onPrimaryContainer} />
                  </View>
                  <View>
                    <Text style={[styles.ctaStatValue, {
                      color: theme.colors.onSurface,
                      fontSize: isMobile ? 20 : 24
                    }]}>33</Text>
                    <Text style={[styles.ctaStatLabel, {
                      color: theme.colors.onSurfaceVariant,
                      fontSize: isMobile ? 12 : 14
                    }]}>Components</Text>
                  </View>
                </View>

                <View style={styles.ctaStatItem}>
                  <View style={[styles.ctaStatIcon, {
                    backgroundColor: theme.colors.secondaryContainer,
                    shadowColor: theme.colors.secondary
                  }]}>
                    <Ionicons name="color-palette" size={isMobile ? 18 : 20} color={theme.colors.onSecondaryContainer} />
                  </View>
                  <View>
                    <Text style={[styles.ctaStatValue, {
                      color: theme.colors.onSurface,
                      fontSize: isMobile ? 20 : 24
                    }]}>100%</Text>
                    <Text style={[styles.ctaStatLabel, {
                      color: theme.colors.onSurfaceVariant,
                      fontSize: isMobile ? 12 : 14
                    }]}>Customizable</Text>
                  </View>
                </View>

                <View style={styles.ctaStatItem}>
                  <View style={[styles.ctaStatIcon, {
                    backgroundColor: theme.colors.tertiaryContainer,
                    shadowColor: theme.colors.tertiary
                  }]}>
                    <Ionicons name="shield-checkmark" size={isMobile ? 18 : 20} color={theme.colors.onTertiaryContainer} />
                  </View>
                  <View>
                    <Text style={[styles.ctaStatValue, {
                      color: theme.colors.onSurface,
                      fontSize: isMobile ? 20 : 24
                    }]}>MD3</Text>
                    <Text style={[styles.ctaStatLabel, {
                      color: theme.colors.onSurfaceVariant,
                      fontSize: isMobile ? 12 : 14
                    }]}>Material Design</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          </Animated.View>
        </View>

        {/* Footer - Modern & Clean */}
        <View style={[styles.footer, { backgroundColor: theme.mode === 'dark' ? '#0a0a0f' : '#fafafa' }]}>
          {/* Top gradient accent */}
          <LinearGradient
            colors={['#667eea', '#764ba2', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 3, width: '100%' }}
          />

          <View style={[styles.footerContent, { paddingHorizontal: isMobile ? 24 : 48, paddingVertical: isMobile ? 48 : 64, maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
            {/* Main Footer Content */}
            <View style={[styles.footerTop, { flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 48 : 64 }]}>
              {/* Brand Section */}
              <View style={[styles.footerBrand, { flex: isMobile ? undefined : 1.2, alignItems: isMobile ? 'center' : 'flex-start' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={[styles.footerLogo, { width: 48, height: 48, borderRadius: 14 }]}
                  >
                    <Ionicons name="layers" size={24} color="#fff" />
                  </LinearGradient>
                  <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '800', fontSize: 22 }}>
                    Quartz UI
                  </Text>
                </View>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 16,
                    lineHeight: 24,
                    opacity: 0.8,
                    fontSize: 14,
                    textAlign: isMobile ? 'center' : 'left',
                    maxWidth: 280
                  }}
                >
                  Beautiful Material Design 3 components for React Native & Expo applications.
                </Text>

                {/* Social Icons */}
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                  <Pressable
                    onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui')}
                    style={({ pressed }) => [
                      styles.footerSocialIcon,
                      {
                        backgroundColor: theme.colors.surfaceContainerHigh,
                        width: 40,
                        height: 40,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Ionicons name="logo-github" size={20} color={theme.colors.onSurfaceVariant} />
                  </Pressable>
                  <Pressable
                    onPress={() => Linking.openURL('https://x.com/sitharaj08/')}
                    style={({ pressed }) => [
                      styles.footerSocialIcon,
                      {
                        backgroundColor: theme.colors.surfaceContainerHigh,
                        width: 40,
                        height: 40,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Ionicons name="logo-twitter" size={20} color={theme.colors.onSurfaceVariant} />
                  </Pressable>
                </View>
              </View>

              {/* Links Grid */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                  gap: isMobile ? 20 : 56,
                  flex: isMobile ? undefined : 2,
                  justifyContent: isMobile ? 'space-between' : 'flex-start',
                  width: '100%',
                }}
              >
                {/* Docs Column */}
                <View style={{ alignItems: 'flex-start', minWidth: isMobile ? '48%' : 120 }}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '700', fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Docs
                  </Text>
                  {[
                    { label: 'Introduction', route: '/docs/introduction' },
                    { label: 'Installation', route: '/docs/installation' },
                    { label: 'Quick Start', route: '/docs/quick-start' },
                    { label: 'Theming', route: '/docs/theming-guide' },
                  ].map((item) => (
                    <Pressable key={item.label} onPress={() => router.push(item.route as any)} style={({ pressed }) => ({ marginBottom: 10, opacity: pressed ? 0.6 : 1 })}>
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Components Column */}
                <View style={{ alignItems: 'flex-start', minWidth: isMobile ? '48%' : 120 }}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '700', fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Components
                  </Text>
                  {[
                    { label: 'Buttons', route: '/buttons' },
                    { label: 'Inputs', route: '/inputs' },
                    { label: 'Cards', route: '/cards' },
                    { label: 'Navigation', route: '/navigation' },
                  ].map((item) => (
                    <Pressable key={item.label} onPress={() => router.push(item.route as any)} style={({ pressed }) => ({ marginBottom: 10, opacity: pressed ? 0.6 : 1 })}>
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Resources Column */}
                <View style={{ alignItems: 'flex-start', minWidth: isMobile ? '48%' : 120 }}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '700', fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Resources
                  </Text>
                  {[
                    { label: 'GitHub', url: 'https://github.com/sitharaj88/quartz-ui', icon: 'logo-github' as IconName },
                    { label: 'Changelog', url: 'https://github.com/sitharaj88/quartz-ui/releases' },
                    { label: 'License', url: LICENSE_URL },
                    { label: 'Material Design', url: 'https://m3.material.io' },
                  ].map((item) => (
                    <Pressable key={item.label} onPress={() => Linking.openURL(item.url)} style={({ pressed }) => ({ marginBottom: 10, opacity: pressed ? 0.6 : 1 })}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {item.icon && <Ionicons name={item.icon} size={16} color={theme.colors.onSurfaceVariant} />}
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>
                          {item.label}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Bottom Bar */}
            <View
              style={[
                styles.footerBottom,
                {
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.outlineVariant + '20',
                  marginTop: isMobile ? 40 : 48,
                  paddingTop: isMobile ? 24 : 28,
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 12 : 0,
                },
              ]}
            >
              <View style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start', gap: 6 }}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, opacity: 0.7, textAlign: isMobile ? 'center' : 'left' }}>
                  © 2025 Quartz UI •
                </Text>
                <Pressable onPress={() => Linking.openURL(LICENSE_URL)}>
                  <Text variant="bodySmall" style={{ color: theme.colors.primary, fontSize: 13, fontWeight: '700', textAlign: isMobile ? 'center' : 'left' }}>
                    Apache 2.0 License
                  </Text>
                </Pressable>
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, opacity: 0.5, textAlign: isMobile ? 'center' : 'right' }}>
                Made with ❤️ for React Native
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <View
          style={[
            styles.mobileBottomNav,
            {
              backgroundColor: theme.mode === 'dark' ? 'rgba(18, 18, 18, 0.98)' : 'rgba(255, 255, 255, 0.98)',
              borderTopColor: theme.colors.outlineVariant + '30',
              paddingBottom: insets.bottom + 8,
            },
          ]}
        >
          <Pressable
            style={styles.mobileNavItem}
            onPress={() => {}}
          >
            <Ionicons name="home" size={22} color={theme.colors.primary} />
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontSize: 10, marginTop: 2 }}>
              Home
            </Text>
          </Pressable>
          <Pressable
            style={styles.mobileNavItem}
            onPress={() => router.push('/docs/introduction' as any)}
          >
            <Ionicons name="book-outline" size={22} color={theme.colors.onSurfaceVariant} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginTop: 2 }}>
              Docs
            </Text>
          </Pressable>
          <Pressable
            style={styles.mobileNavItem}
            onPress={() => Linking.openURL(GITHUB_URL)}
          >
            <Ionicons name="logo-github" size={22} color={theme.colors.onSurfaceVariant} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginTop: 2 }}>
              GitHub
            </Text>
          </Pressable>
          <Pressable
            style={styles.mobileNavItem}
            onPress={async () => {
              try {
                await Share.share({
                  message: '🎨 Check out Quartz UI - A modern, accessible component library for React Native & Expo with 33+ Material Design 3 components!\n\n' + DOCS_URL,
                  url: DOCS_URL,
                  title: 'Quartz UI - React Native Component Library',
                });
              } catch (error) {
                console.log('Error sharing:', error);
              }
            }}
          >
            <Ionicons name="share-outline" size={22} color={theme.colors.onSurfaceVariant} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginTop: 2 }}>
              Share
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontWeight: '800',
    marginLeft: 12,
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  headerLink: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexShrink: 0,
  },
  headerIcon: {
    padding: 8,
    flexShrink: 0,
  },

  // Hero
  hero: {
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 32,
  },
  versionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 8,
  },
  versionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
  },
  heroTitle: {
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroTitleHighlight: {
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -1,
    color: '#c084fc',
  },
  heroTitleLine2: {
    marginBottom: 32,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 40,
    alignSelf: 'center',
  },
  heroSubtitleHighlight: {
    color: '#4ade80',
    fontWeight: '700',
  },
  ctaRow: {
    gap: 14,
    marginBottom: 56,
    width: '100%',
    maxWidth: 400,
  },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    gap: 8,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    gap: 8,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  ctaSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.15)',
  },
  statItemValue: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statItemLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 32,
  },
  scrollIndicatorInner: {
    width: 24,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    paddingTop: 8,
  },
  scrollIndicatorDot: {
    width: 4,
    height: 8,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  scrollIndicatorText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 12,
  },

  // Sections
  section: {
    marginTop: 80,
  },
  sectionHeader: {
    marginBottom: 48,
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 600,
  },

  // Features
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureCard: {
    marginBottom: 16,
  },
  noteCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  featureSurface: {
    padding: 28,
    borderRadius: 24,
  },
  featureIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontWeight: '700',
    marginTop: 20,
  },
  featureDescription: {
    marginTop: 8,
    lineHeight: 22,
  },
  featureAccent: {
    height: 3,
    width: 48,
    borderRadius: 2,
    marginTop: 20,
  },

  // Code Preview
  codePreview: {
    marginBottom: 32,
  },
  codeSurface: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  codeHeaderDots: {
    flexDirection: 'row',
    gap: 8,
  },
  codeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  codeFileName: {
    color: '#888',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  codeContent: {
    paddingVertical: 20,
  },
  codeLine: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  codeLineNumber: {
    color: '#555',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    width: 32,
    textAlign: 'right',
    marginRight: 16,
  },
  codeText: {
    color: '#d4d4d4',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  installCommand: {
    alignItems: 'center',
  },
  installSurface: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  installLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  installRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  installText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  installCopy: {
    padding: 8,
    borderRadius: 8,
  },

  // Categories
  categoriesScroll: {
    gap: 20,
    paddingVertical: 8,
  },
  categoryCard: {},
  categorySurface: {
    padding: 24,
    borderRadius: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  categoryIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryTitle: {
    fontWeight: '700',
    marginTop: 20,
  },
  categoryItems: {
    marginTop: 16,
    gap: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  // Components Grid Section
  componentsGridHeader: {
    alignItems: 'center',
    marginBottom: 0,
  },
  componentsGridBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  componentsGridBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  componentsGridBadgeText: {
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  componentsGridTitle: {
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 56,
  },
  componentsGridSubtitle: {
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 700,
    opacity: 0.9,
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  componentsGridCard: {
    marginBottom: 0,
  },
  componentsGridCardInner: {
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    height: 320,
  },
  componentsGridIcon: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  componentsGridCardContent: {
    flex: 1,
  },
  componentsGridCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  componentsGridCardTitle: {
    fontWeight: '800',
    flex: 1,
    lineHeight: 28,
  },
  componentsGridCardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
  },
  componentsGridCardBadgeText: {
    fontWeight: '900',
  },
  componentsGridCardItems: {
    gap: 10,
  },
  componentsGridCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  componentsGridCardItemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  componentsGridCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  componentsGridCardAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  // CTA Section
  // CTA Section - Modern & Light
  ctaSection: {
    overflow: 'hidden',
  },
  ctaSectionCard: {
    overflow: 'hidden',
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaIconBadge: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  ctaSectionTitle: {
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 52,
  },
  ctaSectionSubtitle: {
    textAlign: 'center',
    maxWidth: 600,
    opacity: 0.9,
  },
  ctaButtons: {
    alignItems: 'center',
    width: '100%',
  },
  ctaPrimaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 200,
  },
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 16,
  },
  ctaPrimaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ctaSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 16,
    minWidth: 200,
  },
  ctaSecondaryButtonText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ctaStats: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaStat: {
    alignItems: 'center',
  },
  ctaStatValue: {
    fontWeight: '900',
    lineHeight: 48,
  },
  ctaStatLabel: {
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Ultra Modern CTA Styles
  ctaGlassCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    margin: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  ctaOrb1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  ctaOrb2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  ctaOrb3: {
    position: 'absolute',
    top: '50%',
    left: '70%',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  ctaOrbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  ctaIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaIconGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaTitle: {
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaTitleHighlight: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '900',
  },
  ctaSubtitle: {
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 500,
    alignSelf: 'center',
  },
  ctaButtonGroup: {
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
  },
  ctaPrimaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    minWidth: 200,
    alignSelf: 'center',
  },
  ctaPrimaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ctaPrimaryTextBold: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ctaSecondaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    minWidth: 160,
    alignSelf: 'center',
  },
  ctaSecondaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  ctaSecondaryTextBold: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ctaStatsGrid: {
    justifyContent: 'center',
  },
  ctaStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 120,
  },
  ctaStatIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaStatValueBold: {
    fontWeight: '900',
    lineHeight: 24,
  },
  ctaStatLabelBold: {
    fontWeight: '600',
    marginTop: 2,
  },

  // Footer - Modern & Clean
  footer: {
    marginTop: 80,
    overflow: 'hidden',
  },
  footerContent: {
    width: '100%',
  },
  footerTop: {
    width: '100%',
  },
  footerBrand: {
    width: '100%',
  },
  footerBrandContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  footerTitle: {
    fontWeight: '800',
  },
  footerLinks: {
    width: '100%',
  },
  footerLinkGroup: {
    gap: 10,
  },
  footerBottom: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerSocial: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  footerSocialIcon: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Mobile Bottom Navigation
  mobileBottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    zIndex: 99,
  },
  mobileNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
});
