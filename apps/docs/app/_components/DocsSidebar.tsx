import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, useWindowDimensions, TextInput } from 'react-native';
import { Text, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconName = keyof typeof Ionicons.glyphMap;

interface NavItem {
  title: string;
  route: string;
  icon?: IconName;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: "What's new in 1.0", route: '/docs/whats-new', icon: 'sparkles', badge: 'NEW' },
      { title: 'Introduction', route: '/docs/introduction', icon: 'book-outline' },
      { title: 'Installation', route: '/docs/installation', icon: 'download-outline' },
      { title: 'Quick Start', route: '/docs/quick-start', icon: 'flash-outline' },
      { title: 'Theming', route: '/docs/theming-guide', icon: 'color-palette-outline' },
    ],
  },
  {
    title: 'Foundations',
    items: [
      { title: 'Accessibility', route: '/docs/accessibility', icon: 'accessibility-outline' },
      { title: 'Hooks', route: '/docs/hooks', icon: 'fish-outline', badge: 'NEW' },
      { title: 'Utilities', route: '/docs/utilities', icon: 'construct-outline', badge: 'NEW' },
    ],
  },
  {
    title: 'Core Components',
    items: [
      { title: 'Buttons', route: '/buttons', icon: 'radio-button-on-outline' },
      { title: 'FAB & Icon Buttons', route: '/fab', icon: 'add-circle-outline' },
      { title: 'Cards', route: '/cards', icon: 'albums-outline' },
      { title: 'Typography', route: '/typography', icon: 'text-outline' },
      { title: 'Surfaces', route: '/surfaces', icon: 'layers-outline' },
    ],
  },
  {
    title: 'Inputs & Selection',
    items: [
      { title: 'Text Input', route: '/inputs', icon: 'create-outline' },
      { title: 'Selection Controls', route: '/selection', icon: 'checkbox-outline' },
      { title: 'Chips', route: '/chips', icon: 'pricetags-outline' },
      { title: 'Date & Time Pickers', route: '/pickers', icon: 'calendar-outline' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { title: 'App Bar & Nav Bar', route: '/navigation', icon: 'navigate-outline' },
      { title: 'Tabs & Search', route: '/tabs', icon: 'tablet-portrait-outline' },
      { title: 'Drawer & Rail', route: '/advanced-navigation', icon: 'menu-outline' },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { title: 'Lists & Badges', route: '/lists', icon: 'list-outline' },
      { title: 'Carousel & Slider', route: '/carousel', icon: 'images-outline' },
      { title: 'Progress Indicators', route: '/progress', icon: 'sync-outline' },
    ],
  },
  {
    title: 'Feedback & Overlays',
    items: [
      { title: 'Dialogs', route: '/dialogs', icon: 'chatbox-ellipses-outline' },
      { title: 'Snackbar & Tooltip', route: '/feedback', icon: 'alert-circle-outline' },
      { title: 'Sheets & Menus', route: '/overlays', icon: 'albums-outline' },
    ],
  },
];

interface DocsSidebarProps {
  onClose?: () => void;
}

/**
 * Quartz docs sidebar — restrained, modern aesthetic.
 *
 * No gradients on every item. No 3D shadows. No scale-on-press animations.
 * Active state: subtle filled background + colored accent bar on the leading edge.
 * Hover state: subtle surface tint (web only).
 * Type: 14pt items, 11pt all-caps section headers with letter-spacing.
 */
export function DocsSidebar({ onClose }: DocsSidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const isMobile = width < 768;

  const onNavigate = useCallback(
    (route: string) => {
      router.push(route as never);
      onClose?.();
    },
    [router, onClose]
  );

  // Filter sections by query (matches title contains).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navigation;
    return navigation
      .map((section) => ({
        ...section,
        items: section.items.filter((i) => i.title.toLowerCase().includes(q)),
      }))
      .filter((section) => section.items.length > 0);
  }, [query]);

  const onSurface = theme.colors.onSurface;
  const onSurfaceVariant = theme.colors.onSurfaceVariant;
  const accent = theme.colors.primary;
  const subtleBorder = theme.colors.outlineVariant + '40';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, paddingTop: isMobile ? insets.top : 0 }]}>
      {/* Brand row */}
      <View style={[styles.brandRow, { borderBottomColor: subtleBorder, paddingHorizontal: 24 }]}>
        <Pressable
          onPress={() => onNavigate('/')}
          style={({ pressed }) => [styles.brandPressable, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityRole="link"
        >
          <View style={[styles.brandMark, { backgroundColor: accent }]}>
            <Ionicons name="layers" size={18} color={theme.colors.onPrimary} />
          </View>
          <View>
            <Text variant="titleMedium" style={{ color: onSurface, fontWeight: '700', fontSize: 17 }}>
              Quartz UI
            </Text>
            <Text variant="bodySmall" style={{ color: onSurfaceVariant, fontSize: 12, marginTop: 1 }}>
              v1.0.0-alpha.1
            </Text>
          </View>
        </Pressable>

        {onClose && isMobile && (
          <Pressable
            onPress={onClose}
            accessibilityLabel="Close menu"
            style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="close" size={20} color={onSurfaceVariant} />
          </Pressable>
        )}
      </View>

      {/* Search */}
      <View style={[styles.searchWrapper, { paddingHorizontal: 16, paddingTop: 16 }]}>
        <View
          style={[
            styles.searchInputWrap,
            { backgroundColor: theme.colors.surfaceVariant + '70', borderColor: subtleBorder },
          ]}
        >
          <Ionicons name="search" size={16} color={onSurfaceVariant} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search docs"
            placeholderTextColor={onSurfaceVariant}
            style={[styles.searchInput, { color: onSurface }]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={16} color={onSurfaceVariant} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Nav */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 18, paddingBottom: isMobile ? 120 : 32 }}
      >
        {filtered.length === 0 && (
          <View style={{ padding: 24 }}>
            <Text variant="bodySmall" style={{ color: onSurfaceVariant, textAlign: 'center' }}>
              Nothing matches "{query}"
            </Text>
          </View>
        )}
        {filtered.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text
              variant="labelSmall"
              style={{
                color: onSurfaceVariant,
                fontWeight: '600',
                fontSize: 11,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                paddingHorizontal: 12,
                marginBottom: 6,
              }}
            >
              {section.title}
            </Text>
            {section.items.map((item) => {
              const isActive = pathname === item.route;
              return (
                <Pressable
                  key={item.route}
                  onPress={() => onNavigate(item.route)}
                  accessibilityRole="link"
                  style={({ hovered, pressed }) => [
                    styles.navItem,
                    {
                      backgroundColor: isActive
                        ? theme.colors.primaryContainer
                        : (hovered as boolean)
                          ? theme.colors.surfaceVariant + '70'
                          : 'transparent',
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  {isActive && <View style={[styles.activeBar, { backgroundColor: accent }]} />}
                  {item.icon && (
                    <Ionicons
                      name={item.icon}
                      size={16}
                      color={isActive ? theme.colors.onPrimaryContainer : onSurfaceVariant}
                      style={{ marginEnd: 10 }}
                    />
                  )}
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: isActive ? theme.colors.onPrimaryContainer : onSurface,
                      fontWeight: isActive ? '600' : '500',
                      fontSize: 14,
                      flex: 1,
                    }}
                  >
                    {item.title}
                  </Text>
                  {item.badge && (
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor:
                            item.badge === 'NEW'
                              ? accent
                              : isActive
                                ? theme.colors.onPrimaryContainer + '22'
                                : theme.colors.surfaceVariant,
                        },
                      ]}
                    >
                      <Text
                        variant="labelSmall"
                        style={{
                          color:
                            item.badge === 'NEW'
                              ? theme.colors.onPrimary
                              : isActive
                                ? theme.colors.onPrimaryContainer
                                : onSurfaceVariant,
                          fontWeight: '700',
                          fontSize: 10,
                          letterSpacing: 0.4,
                        }}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Footer pill */}
      <View
        style={[
          styles.footer,
          {
            borderTopColor: subtleBorder,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <View style={[styles.footerPill, { backgroundColor: theme.colors.surfaceVariant + '70' }]}>
          <Ionicons name="cube-outline" size={14} color={onSurfaceVariant} />
          <Text variant="bodySmall" style={{ color: onSurfaceVariant, fontSize: 12, marginStart: 8 }}>
            38 components · 218 tests
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    borderBottomWidth: 1,
  },
  brandPressable: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: { padding: 8 },
  searchWrapper: {},
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    height: 36,
    paddingVertical: 0,
    outlineStyle: 'none' as never,
  },
  section: { marginBottom: 18 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 1,
    position: 'relative',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 26,
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
