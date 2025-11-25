import React, { ReactNode, useCallback } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Platform, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Text, Surface, useTheme } from 'quartz-ui';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HERO_HEIGHT = 200;

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
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Wrap scroll handler for web compatibility
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS === 'web') {
      scrollY.value = event.nativeEvent.contentOffset.y;
    } else if (typeof scrollHandler === 'function') {
      scrollHandler(event);
    }
  }, [scrollHandler, scrollY]);

  const heroAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT],
      [0, HERO_HEIGHT * 0.3],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.2, 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT * 0.7],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  const statusBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 80],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[
          styles.statusBarBackground,
          { height: insets.top, backgroundColor: gradient[0] },
          statusBarStyle
        ]}
      />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Modern Header */}
        <Animated.View style={[styles.header, { marginTop: insets.top + 8 }, heroAnimatedStyle]}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Ionicons name={icon} size={36} color="#fff" />
              </View>
              <Text variant="headlineMedium" style={styles.headerTitle}>
                {title}
              </Text>
              <Text variant="bodyLarge" style={styles.headerSubtitle}>
                {subtitle}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {children}
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
      entering={FadeInDown.delay(100 + index * 50).springify()}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <Text variant="titleLarge" style={{ color: theme.colors.onBackground, fontWeight: '700' }}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {subtitle}
          </Text>
        )}
      </View>
      <Surface style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]} elevation={1}>
        {children}
      </Surface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 20,
    padding: 20,
  },
});
