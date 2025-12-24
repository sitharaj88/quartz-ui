import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Dimensions, StatusBar, TextInput } from 'react-native';
import { Text, Surface, useTheme } from 'quartz-ui';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeIn,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 280;
const CARD_COLUMNS = 2;

type IconName = keyof typeof Ionicons.glyphMap;

interface ComponentItem {
  title: string;
  description: string;
  route: string;
  icon: IconName;
  gradient: [string, string];
  count: number;
}

const components: ComponentItem[] = [
  {
    title: 'Buttons',
    description: 'Filled, outlined, tonal & text variants',
    route: '/buttons',
    icon: 'radio-button-on',
    gradient: ['#667eea', '#764ba2'],
    count: 8,
  },
  {
    title: 'Cards',
    description: 'Elevated, filled & outlined styles',
    route: '/cards',
    icon: 'albums',
    gradient: ['#f093fb', '#f5576c'],
    count: 6,
  },
  {
    title: 'Inputs',
    description: 'Text fields with validation states',
    route: '/inputs',
    icon: 'create',
    gradient: ['#4facfe', '#00f2fe'],
    count: 5,
  },
  {
    title: 'Selection',
    description: 'Checkboxes, radios, switches & chips',
    route: '/selection',
    icon: 'checkbox',
    gradient: ['#43e97b', '#38f9d7'],
    count: 12,
  },
  {
    title: 'Avatar',
    description: 'Images, initials, badges & groups',
    route: '/avatars',
    icon: 'person-circle',
    gradient: ['#6366f1', '#8b5cf6'],
    count: 6,
  },
  {
    title: 'Skeleton',
    description: 'Loading placeholders with shimmer',
    route: '/skeleton',
    icon: 'scan',
    gradient: ['#64748b', '#94a3b8'],
    count: 4,
  },
  {
    title: 'Toast',
    description: 'Notifications with swipe dismiss',
    route: '/toasts',
    icon: 'notifications',
    gradient: ['#22c55e', '#16a34a'],
    count: 4,
  },
  {
    title: 'Animation',
    description: 'Entry animations & transitions',
    route: '/animations',
    icon: 'sparkles',
    gradient: ['#f59e0b', '#d97706'],
    count: 14,
  },
  {
    title: 'Gradient',
    description: 'Linear gradients with presets',
    route: '/gradients',
    icon: 'color-fill',
    gradient: ['#ec4899', '#f43f5e'],
    count: 12,
  },
  {
    title: 'FAB',
    description: 'Floating action buttons',
    route: '/fab',
    icon: 'add-circle',
    gradient: ['#fa709a', '#fee140'],
    count: 4,
  },
  {
    title: 'Dialogs',
    description: 'Alerts, modals & snackbars',
    route: '/dialogs',
    icon: 'chatbox-ellipses',
    gradient: ['#a18cd1', '#fbc2eb'],
    count: 5,
  },
  {
    title: 'Progress',
    description: 'Linear & circular indicators',
    route: '/progress',
    icon: 'sync',
    gradient: ['#ff9a9e', '#fecfef'],
    count: 4,
  },
  {
    title: 'Lists',
    description: 'List items & dividers',
    route: '/lists',
    icon: 'list',
    gradient: ['#a1c4fd', '#c2e9fb'],
    count: 6,
  },
  {
    title: 'Navigation',
    description: 'App bars, tabs & nav bars',
    route: '/navigation',
    icon: 'navigate',
    gradient: ['#d4fc79', '#96e6a1'],
    count: 5,
  },
  {
    title: 'Surfaces',
    description: 'Cards, menus & tooltips',
    route: '/surfaces',
    icon: 'layers',
    gradient: ['#84fab0', '#8fd3f4'],
    count: 6,
  },
  {
    title: 'Typography',
    description: 'Type scale & text styles',
    route: '/typography',
    icon: 'text',
    gradient: ['#a8edea', '#fed6e3'],
    count: 15,
  },
  {
    title: 'Theming',
    description: 'Colors, shapes & dark mode',
    route: '/theming',
    icon: 'color-palette',
    gradient: ['#d299c2', '#fef9d7'],
    count: 3,
  },
  {
    title: 'Banners',
    description: 'Prominent messages with actions',
    route: '/banners',
    icon: 'megaphone',
    gradient: ['#ff6b6b', '#feca57'],
    count: 3,
  },
  {
    title: 'Pickers',
    description: 'Date & time selection',
    route: '/pickers',
    icon: 'calendar',
    gradient: ['#5f27cd', '#c44569'],
    count: 2,
  },
  {
    title: 'Drawers',
    description: 'Navigation drawer & side sheet',
    route: '/drawers',
    icon: 'menu',
    gradient: ['#00d2d3', '#54a0ff'],
    count: 2,
  },
  {
    title: 'Navigation Rail',
    description: 'Compact side navigation',
    route: '/navigation-rail',
    icon: 'train',
    gradient: ['#10ac84', '#1dd1a1'],
    count: 1,
  },
  {
    title: 'Carousel',
    description: 'Scrollable content gallery',
    route: '/carousel',
    icon: 'images',
    gradient: ['#ee5a24', '#f79f1f'],
    count: 4,
  },
  {
    title: 'Tooltips',
    description: 'Plain & rich tooltip overlays',
    route: '/tooltips',
    icon: 'chatbubble-ellipses',
    gradient: ['#6c5ce7', '#a29bfe'],
    count: 5,
  },
];

function ComponentCard({ item, index }: { item: ComponentItem; index: number }) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 30).springify()}
      style={styles.cardWrapper}
    >
      <Pressable
        onPress={() => router.push(item.route as any)}
        style={({ pressed }) => [
          styles.cardPressable,
          pressed && styles.cardPressed,
        ]}
      >
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Ionicons name={item.icon} size={28} color="#fff" />
          </LinearGradient>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {item.title}
              </Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}>
                  {item.count}
                </Text>
              </View>
            </View>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, lineHeight: 18 }}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>
        </Surface>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Parallax effect for hero section
  const heroAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT],
      [0, HERO_HEIGHT * 0.4],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.3, 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT * 0.8],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  // Status bar background opacity
  const statusBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Filter components based on search
  const filteredComponents = components.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Status Bar Background */}
      <Animated.View
        style={[
          styles.statusBarBackground,
          {
            height: insets.top,
            backgroundColor: theme.colors.primary
          },
          statusBarStyle
        ]}
      />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Hero Section with Parallax */}
        <Animated.View style={[styles.heroSection, { marginTop: insets.top + 8 }, heroAnimatedStyle]}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.tertiary || '#7c4dff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.logoContainer}>
                <View style={styles.logoInner}>
                  <Ionicons name="layers" size={48} color="#fff" />
                </View>
              </View>
              <Text variant="headlineLarge" style={styles.heroTitle}>
                Quartz UI
              </Text>
              <Text variant="titleMedium" style={styles.heroSubtitle}>
                Modern UI for React Native
              </Text>
              <View style={styles.versionBadge}>
                <Ionicons name="sparkles" size={12} color="#fff" style={{ marginRight: 4 }} />
                <Text variant="labelMedium" style={styles.versionText}>
                  v1.0.0-dev.2025-02 • Expo SDK 54
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View entering={FadeInRight.delay(150).springify()} style={styles.statsSection}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Ionicons name="apps" size={24} color={theme.colors.onPrimaryContainer} style={{ marginBottom: 4 }} />
            <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}>
              {components.length}
            </Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}>
              Components
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Ionicons name="rocket" size={24} color={theme.colors.onSecondaryContainer} style={{ marginBottom: 4 }} />
            <Text variant="headlineSmall" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>
              MD3
            </Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer, opacity: 0.8 }}>
              Design
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Ionicons name="accessibility" size={24} color={theme.colors.onTertiaryContainer} style={{ marginBottom: 4 }} />
            <Text variant="headlineSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '700' }}>
              A11y
            </Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onTertiaryContainer, opacity: 0.8 }}>
              Ready
            </Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.searchContainer}>
          <Surface style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
            <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.onSurface }]}
              placeholder="Search components..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.onSurfaceVariant} />
              </Pressable>
            )}
          </Surface>
        </Animated.View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={{ color: theme.colors.onBackground, fontWeight: '700' }}>
            {searchQuery ? `Found ${filteredComponents.length}` : 'Explore Components'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {searchQuery ? 'matching your search' : 'Browse our component library'}
          </Text>
        </View>

        {/* Component Cards */}
        <View style={styles.cardsContainer}>
          {filteredComponents.length > 0 ? (
            filteredComponents.map((item, index) => (
              <ComponentCard key={item.route} item={item} index={index} />
            ))
          ) : (
            <Animated.View entering={FadeIn} style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.3 }} />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 16, fontWeight: '600' }}>
                No components found
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, textAlign: 'center' }}>
                Try adjusting your search query
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.footerCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Ionicons name="code-slash" size={20} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8, fontWeight: '500' }}>
              Built with React Native
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
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
  heroSection: {
    marginHorizontal: 20,
    borderRadius: 28,
    overflow: 'hidden',
  },
  heroGradient: {
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoInner: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    marginTop: 8,
    fontWeight: '500',
  },
  versionBadge: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  searchContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    marginHorizontal: 24,
    marginTop: 28,
    marginBottom: 16,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  cardPressable: {
    borderRadius: 20,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  card: {
    flexDirection: 'column',
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  cardContent: {
    flex: 1,
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    minWidth: 28,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
});
