import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Text, Surface, NavigationBar, Tabs, AppBar, useTheme } from 'quartz-ui';
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

const HERO_HEIGHT = 160;

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>{title}</Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>{subtitle}</Text>
      {children}
    </View>
  );
}

export default function NavigationScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedNav, setSelectedNav] = useState('home');
  const [selectedTab, setSelectedTab] = useState('photos');
  const [selectedSecondary, setSelectedSecondary] = useState('all');

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

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

  const statusBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const navItems = [
    { 
      key: 'home', 
      label: 'Home', 
      icon: <Ionicons name="home-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      activeIcon: <Ionicons name="home" size={24} color={theme.colors.onSecondaryContainer} />
    },
    { 
      key: 'search', 
      label: 'Search', 
      icon: <Ionicons name="search-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      activeIcon: <Ionicons name="search" size={24} color={theme.colors.onSecondaryContainer} />
    },
    { 
      key: 'favorites', 
      label: 'Favorites', 
      icon: <Ionicons name="heart-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      activeIcon: <Ionicons name="heart" size={24} color={theme.colors.onSecondaryContainer} />,
      badge: 3
    },
    { 
      key: 'profile', 
      label: 'Profile', 
      icon: <Ionicons name="person-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      activeIcon: <Ionicons name="person" size={24} color={theme.colors.onSecondaryContainer} />
    },
  ];

  const primaryTabs = [
    { key: 'photos', label: 'Photos', icon: <Ionicons name="images" size={20} color={theme.colors.primary} /> },
    { key: 'videos', label: 'Videos', icon: <Ionicons name="videocam" size={20} color={theme.colors.primary} /> },
    { key: 'albums', label: 'Albums', icon: <Ionicons name="albums" size={20} color={theme.colors.primary} /> },
  ];

  const secondaryTabs = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread', badge: 5 },
    { key: 'starred', label: 'Starred' },
    { key: 'archived', label: 'Archived' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      <Animated.View 
        style={[
          styles.statusBarBackground, 
          { height: insets.top, backgroundColor: '#d4fc79' },
          statusBarStyle
        ]} 
      />
      <Animated.ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={scrollHandler} scrollEventThrottle={16}>
        {/* Header */}
        <Animated.View style={[styles.header, { marginTop: insets.top + 12 }, heroAnimatedStyle]}>
          <LinearGradient
            colors={['#d4fc79', '#96e6a1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.headerGradient, { paddingTop: insets.top + 32 }]}
          >
            <Ionicons name="navigate" size={32} color="#333" />
            <Text variant="headlineSmall" style={[styles.headerTitle, { color: '#333' }]}>Navigation</Text>
            <Text variant="bodyMedium" style={[styles.headerSubtitle, { color: 'rgba(0,0,0,0.7)' }]}>
              App bars, tabs & nav bars
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* App Bar Examples */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Section title="App Bars" subtitle="Top app bar variations">
            <View style={styles.appBarStack}>
              {/* Small App Bar */}
              <Surface style={[styles.appBarPreview, { backgroundColor: theme.colors.surface }]} elevation={1}>
                <AppBar
                  title="Small App Bar"
                  navigationIcon={<Ionicons name="menu" size={24} color={theme.colors.onSurface} />}
                  actions={[
                    { icon: <Ionicons name="search" size={24} color={theme.colors.onSurfaceVariant} />, onPress: () => {} },
                    { icon: <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.onSurfaceVariant} />, onPress: () => {} },
                  ]}
                />
              </Surface>

              {/* Center-aligned App Bar */}
              <Surface style={[styles.appBarPreview, { backgroundColor: theme.colors.primaryContainer }]} elevation={1}>
                <View style={styles.centeredAppBar}>
                  <Ionicons name="arrow-back" size={24} color={theme.colors.onPrimaryContainer} />
                  <Text variant="titleLarge" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}>
                    Center Aligned
                  </Text>
                  <View style={{ width: 24 }} />
                </View>
              </Surface>
            </View>
          </Section>
        </Animated.View>

        {/* Primary Tabs */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Section title="Primary Tabs" subtitle="With icons">
            <Surface style={[styles.tabsCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <Tabs
                tabs={primaryTabs}
                selectedKey={selectedTab}
                onSelect={setSelectedTab}
                variant="primary"
              />
              <View style={[styles.tabContent, { borderTopColor: theme.colors.outlineVariant }]}>
                <View style={[styles.contentPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Ionicons 
                    name={selectedTab === 'photos' ? 'images' : selectedTab === 'videos' ? 'videocam' : 'albums'} 
                    size={48} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                    {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} content
                  </Text>
                </View>
              </View>
            </Surface>
          </Section>
        </Animated.View>

        {/* Secondary Tabs */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Section title="Secondary Tabs" subtitle="Text only with badges">
            <Surface style={[styles.tabsCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <Tabs
                tabs={secondaryTabs}
                selectedKey={selectedSecondary}
                onSelect={setSelectedSecondary}
                variant="secondary"
              />
              <View style={[styles.tabContent, { borderTopColor: theme.colors.outlineVariant }]}>
                <View style={[styles.contentPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Showing {selectedSecondary} items
                  </Text>
                </View>
              </View>
            </Surface>
          </Section>
        </Animated.View>

        {/* Navigation Bar */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Section title="Navigation Bar" subtitle="Bottom navigation with badges">
            <Surface style={[styles.navBarCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={styles.navBarPreview}>
                <View style={[styles.screenMock, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Ionicons 
                    name={navItems.find(i => i.key === selectedNav)?.key === 'home' ? 'home' : 
                          navItems.find(i => i.key === selectedNav)?.key === 'search' ? 'search' :
                          navItems.find(i => i.key === selectedNav)?.key === 'favorites' ? 'heart' : 'person'} 
                    size={48} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                    {selectedNav.charAt(0).toUpperCase() + selectedNav.slice(1)}
                  </Text>
                </View>
              </View>
              <NavigationBar
                items={navItems}
                selectedKey={selectedNav}
                onSelect={setSelectedNav}
              />
            </Surface>
          </Section>
        </Animated.View>

        {/* Design Tips */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Section title="Best Practices" subtitle="Navigation guidelines">
            <View style={styles.tipsRow}>
              <Surface style={[styles.tipCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
                <Ionicons name="navigate" size={24} color={theme.colors.onPrimaryContainer} />
                <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 8, textAlign: 'center' }}>
                  3-5 nav items max
                </Text>
              </Surface>
              <Surface style={[styles.tipCard, { backgroundColor: theme.colors.secondaryContainer }]} elevation={0}>
                <Ionicons name="hand-left" size={24} color={theme.colors.onSecondaryContainer} />
                <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer, marginTop: 8, textAlign: 'center' }}>
                  Clear labels
                </Text>
              </Surface>
              <Surface style={[styles.tipCard, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={0}>
                <Ionicons name="notifications" size={24} color={theme.colors.onTertiaryContainer} />
                <Text variant="labelMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 8, textAlign: 'center' }}>
                  Use badges wisely
                </Text>
              </Surface>
            </View>
          </Section>
        </Animated.View>

        <View style={{ height: 100 }} />
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
  header: {
    marginBottom: 24,
  },
  headerGradient: {
    padding: 32,
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 12,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  appBarStack: {
    gap: 12,
  },
  appBarPreview: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  centeredAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  tabsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  tabContent: {
    borderTopWidth: 1,
    padding: 16,
  },
  contentPlaceholder: {
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBarCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  navBarPreview: {
    padding: 16,
    paddingBottom: 0,
  },
  screenMock: {
    height: 150,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tipsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tipCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
