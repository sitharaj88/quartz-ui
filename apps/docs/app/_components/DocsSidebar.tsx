import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Text, Surface, Divider, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInLeft,
  FadeInDown,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type IconName = keyof typeof Ionicons.glyphMap;

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  title: string;
  route: string;
  icon?: IconName;
  badge?: string;
}

const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', route: '/docs/introduction', icon: 'book' },
      { title: 'Installation', route: '/docs/installation', icon: 'download' },
      { title: 'Quick Start', route: '/docs/quick-start', icon: 'flash' },
      { title: 'Theming', route: '/docs/theming-guide', icon: 'color-palette' },
    ],
  },
  {
    title: 'Core Components',
    items: [
      { title: 'Buttons', route: '/buttons', icon: 'radio-button-on', badge: '3' },
      { title: 'FAB & Icon Buttons', route: '/fab', icon: 'add-circle', badge: '3' },
      { title: 'Cards', route: '/cards', icon: 'albums', badge: '2' },
      { title: 'Typography', route: '/typography', icon: 'text', badge: '1' },
      { title: 'Surfaces', route: '/surfaces', icon: 'layers', badge: '2' },
    ],
  },
  {
    title: 'Inputs & Selection',
    items: [
      { title: 'Text Input', route: '/inputs', icon: 'create', badge: '2' },
      { title: 'Selection Controls', route: '/selection', icon: 'checkbox', badge: '3' },
      { title: 'Chips', route: '/chips', icon: 'pricetags', badge: '2' },
      { title: 'Date & Time Pickers', route: '/pickers', icon: 'calendar', badge: '2' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { title: 'App Bar & Nav Bar', route: '/navigation', icon: 'navigate', badge: '2' },
      { title: 'Tabs & Search', route: '/tabs', icon: 'tablet-portrait', badge: '2' },
      { title: 'Drawer & Rail', route: '/advanced-navigation', icon: 'menu', badge: '2' },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { title: 'Lists & Badges', route: '/lists', icon: 'list', badge: '3' },
      { title: 'Carousel & Slider', route: '/carousel', icon: 'images', badge: '2' },
      { title: 'Progress Indicators', route: '/progress', icon: 'sync', badge: '2' },
    ],
  },
  {
    title: 'Feedback & Overlays',
    items: [
      { title: 'Dialogs', route: '/dialogs', icon: 'chatbox-ellipses', badge: '1' },
      { title: 'Snackbar & Tooltip', route: '/feedback', icon: 'alert-circle', badge: '3' },
      { title: 'Sheets & Menus', route: '/overlays', icon: 'albums-outline', badge: '3' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Accessibility', route: '/docs/accessibility', icon: 'accessibility' },
    ],
  },
];

// Collapsible Section
function CollapsibleSection({
  section,
  sectionIndex,
  pathname,
  onNavigate,
  theme,
  isMobile,
}: {
  section: NavSection;
  sectionIndex: number;
  pathname: string;
  onNavigate: (route: string) => void;
  theme: any;
  isMobile: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const rotation = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          rotation.value,
          [0, 1],
          [0, 90],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
  }));

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      rotation.value = withSpring(prev ? 0 : 1, { damping: 15 });
      return !prev;
    });
  }, [rotation]);

  return (
    <Animated.View
      entering={FadeInLeft.delay(sectionIndex * 50).springify().damping(15)}
      style={styles.section}
    >
      {/* Section Header */}
      <Pressable
        onPress={toggleCollapse}
        style={({ pressed }) => [
          styles.sectionHeader,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text
          variant="labelLarge"
          style={{
            color: theme.colors.onSurfaceVariant,
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            flex: 1,
            fontSize: isMobile ? 13 : 12,
          }}
        >
          {section.title}
        </Text>
        <Animated.View style={animatedIconStyle}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </Animated.View>
      </Pressable>

      {/* Section Items */}
      {!collapsed &&
        section.items.map((item, itemIndex) => {
          const isActive = pathname === item.route;
          return (
            <NavItemComponent
              key={item.route}
              item={item}
              isActive={isActive}
              onPress={() => onNavigate(item.route)}
              theme={theme}
              delay={itemIndex * 30}
              isMobile={isMobile}
            />
          );
        })}
    </Animated.View>
  );
}

// Individual Nav Item with 3D effects
function NavItemComponent({
  item,
  isActive,
  onPress,
  theme,
  delay,
  isMobile,
}: {
  item: NavItem;
  isActive: boolean;
  onPress: () => void;
  theme: any;
  delay: number;
  isMobile: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify().damping(15)}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.navItem}
      >
        <Animated.View style={animatedStyle}>
          {/* Active State Gradient Background */}
          {isActive && (
            <LinearGradient
              colors={[
                theme.colors.primaryContainer + 'F0',
                theme.colors.secondaryContainer + 'E0',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}

          <View style={[styles.navItemContent, { minHeight: isMobile ? 60 : 52 }]}>
            {/* Icon with Gradient Box */}
            {item.icon && (
              <View style={styles.iconContainer}>
                {isActive ? (
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={[styles.iconBox, { width: isMobile ? 44 : 40, height: isMobile ? 44 : 40 }]}
                  >
                    <Ionicons name={item.icon} size={isMobile ? 24 : 22} color="#FFFFFF" />
                  </LinearGradient>
                ) : (
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: theme.colors.surfaceVariant,
                        width: isMobile ? 44 : 40,
                        height: isMobile ? 44 : 40,
                      },
                    ]}
                  >
                    <Ionicons name={item.icon} size={isMobile ? 24 : 22} color={theme.colors.onSurfaceVariant} />
                  </View>
                )}
              </View>
            )}

            <View style={styles.navItemText}>
              <Text
                variant="bodyLarge"
                style={{
                  color: isActive ? theme.colors.primary : theme.colors.onSurface,
                  fontWeight: isActive ? '800' : '600',
                  fontSize: isMobile ? 17 : 15,
                }}
              >
                {item.title}
              </Text>
            </View>

            {/* Badge */}
            {item.badge && (
              <LinearGradient
                colors={
                  isActive
                    ? ['#667eea', '#764ba2']
                    : [theme.colors.tertiaryContainer, theme.colors.tertiaryContainer]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.badge,
                  {
                    shadowColor: isActive ? theme.colors.primary : 'transparent',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                    elevation: isActive ? 4 : 0,
                    minWidth: isMobile ? 32 : 28,
                    paddingHorizontal: isMobile ? 10 : 8,
                    paddingVertical: isMobile ? 6 : 5,
                  },
                ]}
              >
                <Text
                  variant="labelSmall"
                  style={{
                    color: isActive ? '#FFFFFF' : theme.colors.onTertiaryContainer,
                    fontWeight: '900',
                    fontSize: isMobile ? 13 : 11,
                  }}
                >
                  {item.badge}
                </Text>
              </LinearGradient>
            )}

            {/* Active Indicator Line */}
            {isActive && (
              <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.activeBar, { width: isMobile ? 5 : 4 }]}
              />
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

interface DocsSidebarProps {
  onClose?: () => void;
}

export function DocsSidebar({ onClose }: DocsSidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const handleNavigation = useCallback(
    (route: string) => {
      router.push(route as any);
      onClose?.();
    },
    [router, onClose]
  );

  return (
    <Surface
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          paddingTop: isMobile ? insets.top + 16 : 0,
        },
      ]}
      elevation={0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: isMobile ? 20 : 24,
            paddingBottom: isMobile ? 120 : 40,
          }
        ]}
      >
        {/* HEADER - Mobile optimized */}
        <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.header}>
          <View style={styles.headerTop}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={[styles.logoBox, { width: isMobile ? 64 : 60, height: isMobile ? 64 : 60 }]}
            >
              <Ionicons name="layers" size={isMobile ? 32 : 30} color="#FFFFFF" />
            </LinearGradient>

            {onClose && isMobile && (
              <Pressable onPress={onClose} style={styles.closeButton}>
                <View style={[styles.closeIconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Ionicons name="close" size={24} color={theme.colors.onSurfaceVariant} />
                </View>
              </Pressable>
            )}
          </View>

          <View style={styles.headerText}>
            <View style={styles.headerTitleRow}>
              <Text
                variant="headlineSmall"
                style={{
                  color: theme.colors.onSurface,
                  fontWeight: '900',
                  fontSize: isMobile ? 26 : 24,
                }}
              >
                Quartz UI
              </Text>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={[styles.versionBadge, { paddingHorizontal: isMobile ? 10 : 8, paddingVertical: isMobile ? 5 : 4 }]}
              >
                <Text
                  variant="labelSmall"
                  style={{
                    color: '#FFFFFF',
                    fontWeight: '900',
                    fontSize: isMobile ? 12 : 10,
                  }}
                >
                  v1.0.0-dev
                </Text>
              </LinearGradient>
            </View>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                fontSize: isMobile ? 15 : 14,
                marginTop: 4,
              }}
            >
              Documentation
            </Text>
          </View>
        </Animated.View>

        <Divider style={{ marginVertical: isMobile ? 28 : 24, opacity: 0.5 }} />

        {/* NAVIGATION SECTIONS */}
        {navigation.map((section, sectionIndex) => (
          <CollapsibleSection
            key={section.title}
            section={section}
            sectionIndex={sectionIndex}
            pathname={pathname}
            onNavigate={handleNavigation}
            theme={theme}
            isMobile={isMobile}
          />
        ))}

        {/* FOOTER - Mobile optimized */}
        <Animated.View
          entering={FadeInDown.delay(400).springify().damping(15)}
          style={[styles.footerContainer, { marginTop: isMobile ? 32 : 28 }]}
        >
          {/* Version Info */}
          <Surface
            style={[
              styles.footer,
              {
                backgroundColor: theme.colors.surfaceVariant + '60',
                borderWidth: 1.5,
                borderColor: theme.colors.outlineVariant + '40',
                minHeight: isMobile ? 56 : 48,
              },
            ]}
            elevation={1}
          >
            <LinearGradient
              colors={[theme.colors.primaryContainer, theme.colors.tertiaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.footerGradient}
            >
              <Ionicons
                name="information-circle"
                size={isMobile ? 22 : 20}
                color={theme.colors.primary}
              />
              <Text
                variant="labelMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  marginLeft: 10,
                  fontWeight: '700',
                  fontSize: isMobile ? 15 : 13,
                }}
              >
                Dev build • Target Feb 2025
              </Text>
            </LinearGradient>
          </Surface>
        </Animated.View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 24 },
  header: { marginBottom: 24 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBox: {
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: { padding: 4 },
  closeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {},
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  versionBadge: {
    borderRadius: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  searchContainer: { marginBottom: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontWeight: '600' },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  navItem: {
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 14,
    position: 'relative',
  },
  iconContainer: {},
  iconBox: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  navItemText: { flex: 1 },
  badge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  footerContainer: { gap: 12 },
  footer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  footerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
