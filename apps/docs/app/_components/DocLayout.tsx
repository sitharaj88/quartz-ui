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

// Floating scroll-to-top button
function ScrollToTopButton({ onPress, visible, theme }: { onPress: () => void; visible: boolean; theme: any }) {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0, { damping: 15 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.scrollToTopContainer, animatedStyle]}>
      <Pressable onPress={onPress} style={styles.scrollToTopButton}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scrollToTopGradient}
        >
          <Ionicons name="arrow-up" size={28} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

// Bottom navigation bar for mobile
function MobileBottomNav({ router, theme, onShare }: { router: any; theme: any; onShare: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      style={[
        styles.bottomNav,
        {
          paddingBottom: insets.bottom + 8,
          backgroundColor: theme.colors.surface + 'F5',
          borderTopColor: theme.colors.outlineVariant + '40',
        },
      ]}
    >
      <LinearGradient
        colors={[theme.colors.surface + 'E6', theme.colors.surface + 'F5']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.bottomNavContent}>
        <Pressable
          onPress={() => router.push('/' as any)}
          style={({ pressed }) => [
            styles.bottomNavItem,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.bottomNavIconBox}
          >
            <Ionicons name="home" size={24} color="#FFFFFF" />
          </LinearGradient>
          <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700', marginTop: 4 }}>
            Home
          </Text>
        </Pressable>

        <Pressable
          onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui')}
          style={({ pressed }) => [
            styles.bottomNavItem,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <View style={[styles.bottomNavIconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Ionicons name="logo-github" size={24} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600', marginTop: 4 }}>
            GitHub
          </Text>
        </Pressable>

        <Pressable
          onPress={() => Linking.openURL('https://linkedin.com/in/sitharaj08')}
          style={({ pressed }) => [
            styles.bottomNavItem,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <View style={[styles.bottomNavIconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Ionicons name="logo-linkedin" size={24} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600', marginTop: 4 }}>
            LinkedIn
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.bottomNavItem,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={onShare}
        >
          <View style={[styles.bottomNavIconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Ionicons name="share-social" size={24} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600', marginTop: 4 }}>
            Share
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export function DocLayout({ children, title, description, showSidebar = true }: DocLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useSharedValue(0);

  const isWide = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isMobile = width < 768;
  const shouldShowSidebar = showSidebar && isWide;
  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: 'Check out Quartz UI – Material Design 3 for React Native: https://github.com/sitharaj88/quartz-ui',
        url: 'https://github.com/sitharaj88/quartz-ui',
        title: 'Quartz UI',
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

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 400);
  }, []);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

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
          onScroll={(e) => {
            handleAnimatedScroll(e);
            handleScroll(e);
          }}
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
        </ScrollView>

        {/* Scroll to Top Button */}
        <ScrollToTopButton onPress={scrollToTop} visible={showScrollTop} theme={theme} />
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
  scrollToTopContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    zIndex: 100,
  },
  scrollToTopButton: {
    borderRadius: 64,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  scrollToTopGradient: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    borderTopWidth: 1,
    zIndex: 99,
    backdropFilter: 'blur(20px)',
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bottomNavItem: {
    alignItems: 'center',
    minWidth: 72,
    paddingVertical: 8,
  },
  bottomNavIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
