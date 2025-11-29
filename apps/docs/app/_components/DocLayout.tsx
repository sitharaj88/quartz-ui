import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, useWindowDimensions, Platform, NativeSyntheticEvent, NativeScrollEvent, Linking, Share } from 'react-native';
import { Text, Surface, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeInDown,
  FadeOut,
  SlideInLeft,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  useAnimatedScrollHandler,
  Extrapolation,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { DocsSidebar } from './DocsSidebar';
import { LinearGradient } from 'expo-linear-gradient';

interface DocLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showSidebar?: boolean;
}

const LICENSE_URL = 'https://github.com/sitharaj88/quartz-ui/blob/main/LICENSE';

// Bottom navigation bar for mobile - matches main page design
function MobileBottomNav({ router, theme, onShare }: { router: any; theme: any; onShare: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomNav,
        {
          backgroundColor: theme.mode === 'dark' ? 'rgba(18, 18, 18, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderTopColor: theme.colors.outlineVariant + '30',
          paddingBottom: insets.bottom + 8,
        },
      ]}
    >
      <Pressable
        style={styles.bottomNavItem}
        onPress={() => router.push('/' as any)}
      >
        <Ionicons name="home-outline" size={22} color={theme.colors.onSurfaceVariant} />
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginTop: 2 }}>
          Home
        </Text>
      </Pressable>
      <Pressable
        style={styles.bottomNavItem}
        onPress={() => router.push('/docs/introduction' as any)}
      >
        <Ionicons name="book" size={22} color={theme.colors.primary} />
        <Text variant="labelSmall" style={{ color: theme.colors.primary, fontSize: 10, marginTop: 2 }}>
          Docs
        </Text>
      </Pressable>
      <Pressable
        style={styles.bottomNavItem}
        onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui')}
      >
        <Ionicons name="logo-github" size={22} color={theme.colors.onSurfaceVariant} />
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginTop: 2 }}>
          GitHub
        </Text>
      </Pressable>
      <Pressable
        style={styles.bottomNavItem}
        onPress={onShare}
      >
        <Ionicons name="share-outline" size={22} color={theme.colors.onSurfaceVariant} />
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginTop: 2 }}>
          Share
        </Text>
      </Pressable>
    </View>
  );
}

export function DocLayout({ children, title, description, showSidebar = true }: DocLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useSharedValue(0);

  const isWide = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isMobile = width < 768;
  const shouldShowSidebar = showSidebar && isWide;
  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: '🎨 Check out Quartz UI - A modern, accessible component library for React Native & Expo with 33+ Material Design 3 components!\n\nhttps://sitharaj88.github.io/quartz-ui/',
        url: 'https://sitharaj88.github.io/quartz-ui/',
        title: 'Quartz UI - React Native Component Library',
      });
    } catch (err) {
      // no-op if share fails
    }
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: theme.mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    };
  });

  // Wrap scroll handler for web compatibility
  const handleAnimatedScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS === 'web') {
      const offsetY = event.nativeEvent.contentOffset.y;
      scrollY.value = offsetY;
    } else if (typeof scrollHandler === 'function') {
      scrollHandler(event as any);
    }
  }, [scrollHandler, scrollY]);



  // Gesture for swipe to close sidebar
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < -50) {
        setSidebarOpen(false);
      }
    });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Navigation Bar - MOBILE FIRST */}
      <Animated.View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 12,
            borderBottomColor: theme.colors.outlineVariant + '20',
          },
          headerStyle,
        ]}
      >
        <View style={[styles.topBarContent, { paddingHorizontal: isMobile ? 16 : 24 }]}>
          {/* Left Side - Mobile optimized */}
          <View style={styles.topBarLeft}>
            {!shouldShowSidebar && isMobile && (
              <Pressable
                onPress={() => setSidebarOpen(!sidebarOpen)}
                style={({ pressed }) => [
                  styles.iconButton,
                  {
                    backgroundColor: pressed
                      ? theme.colors.primaryContainer
                      : theme.colors.surfaceVariant + '80',
                  },
                ]}
              >
                <Ionicons name="menu" size={24} color={theme.colors.primary} />
              </Pressable>
            )}

            {!isMobile && (
              <Pressable
                onPress={() => router.push('/' as any)}
                style={({ pressed }) => [
                  { flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.logoBox}
                >
                  <Ionicons name="layers" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text
                  variant="titleLarge"
                  style={{
                    color: theme.colors.onSurface,
                    fontWeight: '800',
                    fontSize: 20,
                  }}
                >
                  Quartz UI
                </Text>
              </Pressable>
            )}
          </View>

          {/* Right Side - Quick actions */}
          <View style={styles.topBarRight}>
            <Pressable
              onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui')}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: pressed
                    ? theme.colors.primaryContainer
                    : theme.colors.surfaceVariant + '80',
                },
              ]}
            >
              <Ionicons name="logo-github" size={22} color={theme.colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <View style={styles.content}>
        {/* Desktop Sidebar */}
        {shouldShowSidebar && (
          <View
            style={[
              styles.sidebar,
              {
                borderRightColor: theme.colors.outlineVariant + '40',
              },
            ]}
          >
            <DocsSidebar />
          </View>
        )}

        {/* Mobile Sidebar with Gesture */}
        {isMobile && sidebarOpen && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={styles.sidebarOverlay}
          >
            <Pressable
              style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
              onPress={() => setSidebarOpen(false)}
            />
            <GestureDetector gesture={panGesture}>
              <Animated.View
                entering={SlideInLeft.springify().damping(15)}
                style={[
                  styles.sidebarDrawer,
                  {
                    backgroundColor: theme.colors.surface,
                    width: width * 0.85,
                    maxWidth: 360,
                  },
                ]}
              >
                <DocsSidebar onClose={() => setSidebarOpen(false)} />
              </Animated.View>
            </GestureDetector>
          </Animated.View>
        )}

        {/* Main Content Area - MOBILE FIRST LAYOUT */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.main}
          contentContainerStyle={[
            styles.mainContent,
            {
              paddingBottom: isMobile ? insets.bottom + 100 : insets.bottom + 60,
              paddingHorizontal: isMobile ? 20 : isTablet ? 32 : 40,
            },
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={handleAnimatedScroll}
          scrollEventThrottle={16}
        >
          {/* DRAMATIC PAGE HEADER - Mobile optimized */}
          <Animated.View
            entering={FadeInDown.springify().damping(15)}
            style={[styles.pageHeader, { marginTop: isMobile ? 24 : 40 }]}
          >
            <Surface
              style={[
                styles.headerSurface,
                {
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.25,
                  shadowRadius: 50,
                },
              ]}
              elevation={5}
            >
              <LinearGradient
                colors={[
                  theme.colors.primaryContainer + 'F5',
                  theme.colors.secondaryContainer + 'E6',
                  theme.colors.tertiaryContainer + 'CC',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.headerGradient, { padding: isMobile ? 32 : 56 }]}
              >
                {/* Decorative elements */}
                <View style={[styles.cornerAccent, { backgroundColor: theme.colors.primary + '15' }]} />
                <View style={[styles.decorativeCircle, { backgroundColor: theme.colors.tertiary + '10' }]} />

                <View style={styles.headerContent}>
                  {/* GIANT Title - Mobile optimized */}
                  <Text
                    variant="displaySmall"
                    style={{
                      color: theme.colors.onSurface,
                      fontWeight: '900',
                      fontSize: isMobile ? 40 : 56,
                      letterSpacing: -1,
                      textShadowColor: 'rgba(0,0,0,0.05)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                      lineHeight: isMobile ? 48 : 64,
                    }}
                  >
                    {title}
                  </Text>

                  {description && (
                    <Text
                      variant="titleLarge"
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        marginTop: 16,
                        lineHeight: isMobile ? 28 : 36,
                        fontSize: isMobile ? 18 : 22,
                        fontWeight: '500',
                        opacity: 0.9,
                      }}
                    >
                      {description}
                    </Text>
                  )}

                  {/* Gradient accent line */}
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.tertiary, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerAccentLine}
                  />
                </View>
              </LinearGradient>
            </Surface>
          </Animated.View>

          {/* Page Content - Enhanced spacing */}
          <Animated.View
            entering={FadeInDown.delay(150).springify().damping(15)}
            style={[styles.contentBody, { marginTop: isMobile ? 32 : 48 }]}
          >
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
                This is a dev build targeting release in Feb 2025. Focus areas: like interactions, TODO
                follow-ups, RTL support validation, and other in-progress items stabilizing for launch.
              </Text>
            </Surface>

            {children}
          </Animated.View>

          {/* Footer - Modern & Clean */}
          <View style={[styles.footer, { backgroundColor: theme.mode === 'dark' ? '#0a0a0f' : '#fafafa', marginTop: 64 }]}>
            {/* Top gradient accent */}
            <LinearGradient
              colors={['#667eea', '#764ba2', '#a855f7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 3, width: '100%' }}
            />

            <View style={[styles.footerContent, { paddingHorizontal: isMobile ? 24 : 48, paddingVertical: isMobile ? 48 : 64 }]}>
              {/* Main Footer Content */}
              <View style={[styles.footerTop, { flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 48 : 64 }]}>
                {/* Brand Section */}
                <View style={[styles.footerBrand, { flex: isMobile ? undefined : 1.2, alignItems: isMobile ? 'center' : 'flex-start' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.footerLogo}
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
                          backgroundColor: theme.colors.surfaceContainerHigh || theme.colors.surfaceVariant,
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
                          backgroundColor: theme.colors.surfaceContainerHigh || theme.colors.surfaceVariant,
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
                      { label: 'GitHub', url: 'https://github.com/sitharaj88/quartz-ui', icon: 'logo-github' as const },
                      { label: 'Changelog', url: 'https://github.com/sitharaj88/quartz-ui/releases', icon: undefined },
                      { label: 'License', url: LICENSE_URL, icon: undefined },
                      { label: 'Material Design', url: 'https://m3.material.io', icon: undefined },
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
        </ScrollView>
      </View>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav router={router} theme={theme} onShare={handleShare} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    paddingBottom: 16,
    zIndex: 100,
    position: 'relative',
    borderBottomWidth: 1,
    backdropFilter: 'blur(20px)',
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    padding: 12,
    borderRadius: 14,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 300,
    borderRightWidth: 1,
  },
  sidebarOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
  sidebarDrawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 24,
  },
  main: {
    flex: 1,
  },
  mainContent: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  pageHeader: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  headerSurface: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'relative',
    overflow: 'hidden',
  },
  cornerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 160,
    height: 160,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 160,
  },
  decorativeCircle: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  headerContent: {
    zIndex: 1,
  },
  headerAccentLine: {
    height: 6,
    width: 120,
    borderRadius: 3,
    marginTop: 28,
  },
  contentBody: {
    flex: 1,
    gap: 24,
  },
  noteCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  // Footer - Modern & Clean
  footer: {
    overflow: 'hidden',
    marginHorizontal: -20,
  },
  footerContent: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  footerTop: {
    width: '100%',
  },
  footerBrand: {
    width: '100%',
  },
  footerLogo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  footerBottom: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerSocialIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
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
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
});
