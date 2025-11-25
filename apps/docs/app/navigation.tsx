import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, AppBar, NavigationBar, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const appBarProps: PropDefinition[] = [
  {
    name: 'title',
    type: 'string',
    description: 'App bar title',
  },
  {
    name: 'variant',
    type: "'center-aligned' | 'small' | 'medium' | 'large'",
    default: "'small'",
    description: 'App bar variant',
  },
  {
    name: 'navigationIcon',
    type: 'React.ReactNode',
    description: 'Navigation icon (back/menu)',
  },
  {
    name: 'onNavigationPress',
    type: '() => void',
    description: 'Callback when navigation icon is pressed',
  },
  {
    name: 'actions',
    type: 'AppBarAction[]',
    description: 'Action icons on the right (icon, onPress, accessibilityLabel)',
  },
  {
    name: 'elevated',
    type: 'boolean',
    default: 'false',
    description: 'Whether the app bar is elevated (scrolled)',
  },
  {
    name: 'backgroundColor',
    type: 'string',
    description: 'Custom background color',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

const navigationBarProps: PropDefinition[] = [
  {
    name: 'items',
    type: 'NavigationBarItem[]',
    description: 'Navigation items (3-5 items with key, icon, activeIcon, label, badge)',
  },
  {
    name: 'selectedKey',
    type: 'string',
    description: 'Currently selected item key',
  },
  {
    name: 'onSelect',
    type: '(key: string) => void',
    description: 'Callback when item is selected',
  },
  {
    name: 'labelVisibility',
    type: "'always' | 'active-only'",
    default: "'always'",
    description: 'Whether to show labels only on active item',
  },
  {
    name: 'showIndicator',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show indicator pill',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

export default function NavigationDocPage() {
  const theme = useTheme();
  const [selectedNav, setSelectedNav] = useState('home');
  const [elevated, setElevated] = useState(false);

  const navItems = [
    {
      key: 'home',
      icon: <Ionicons name="home-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      activeIcon: <Ionicons name="home" size={24} color={theme.colors.onSurface} />,
      label: 'Home',
    },
    {
      key: 'search',
      icon: <Ionicons name="search-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      activeIcon: <Ionicons name="search" size={24} color={theme.colors.onSurface} />,
      label: 'Search',
    },
    {
      key: 'notifications',
      icon: <Ionicons name="notifications-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      activeIcon: <Ionicons name="notifications" size={24} color={theme.colors.onSurface} />,
      label: 'Notifications',
      badge: 5,
    },
    {
      key: 'profile',
      icon: <Ionicons name="person-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      activeIcon: <Ionicons name="person" size={24} color={theme.colors.onSurface} />,
      label: 'Profile',
    },
  ];

  return (
    <DocLayout
      title="Navigation"
      description="App Bar and Navigation Bar components for app navigation and hierarchy"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Navigation components help users navigate through your app. App bars provide context and actions for the
          current screen, while navigation bars enable quick switching between top-level destinations.
        </Text>
      </Animated.View>

      {/* Import */}
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.section}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Import
        </Text>
        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace' }}
          >
            {`import { AppBar, NavigationBar } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* App Bar Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          App Bar
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          Top app bars display information and actions at the top of a screen. They come in four variants with different sizes.
        </Text>

        {/* Small App Bar */}
        <CodePlayground
          title="Small App Bar"
          description="Compact app bar for standard screens"
          code={`<AppBar
  variant="small"
  title="Page Title"
  navigationIcon={<Ionicons name="arrow-back" size={24} />}
  onNavigationPress={() => {}}
  actions={[
    {
      icon: <Ionicons name="search" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'Search'
    },
    {
      icon: <Ionicons name="ellipsis-vertical" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'More options'
    }
  ]}
/>`}
          preview={
            <View style={styles.appBarPreview}>
              <AppBar
                variant="small"
                title="Page Title"
                navigationIcon={<Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />}
                onNavigationPress={() => { }}
                actions={[
                  {
                    icon: <Ionicons name="search" size={24} color={theme.colors.onSurfaceVariant} />,
                    onPress: () => { },
                    accessibilityLabel: 'Search'
                  },
                  {
                    icon: <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.onSurfaceVariant} />,
                    onPress: () => { },
                    accessibilityLabel: 'More options'
                  }
                ]}
              />
            </View>
          }
        />

        {/* Center-Aligned App Bar */}
        <CodePlayground
          title="Center-Aligned App Bar"
          description="App bar with centered title"
          code={`<AppBar
  variant="center-aligned"
  title="Centered Title"
  navigationIcon={<Ionicons name="menu" size={24} />}
  onNavigationPress={() => {}}
  actions={[
    {
      icon: <Ionicons name="heart-outline" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'Favorite'
    }
  ]}
/>`}
          preview={
            <View style={styles.appBarPreview}>
              <AppBar
                variant="center-aligned"
                title="Centered Title"
                navigationIcon={<Ionicons name="menu" size={24} color={theme.colors.onSurface} />}
                onNavigationPress={() => { }}
                actions={[
                  {
                    icon: <Ionicons name="heart-outline" size={24} color={theme.colors.onSurfaceVariant} />,
                    onPress: () => { },
                    accessibilityLabel: 'Favorite'
                  }
                ]}
              />
            </View>
          }
        />

        {/* Medium App Bar */}
        <CodePlayground
          title="Medium App Bar"
          description="App bar with expanded title area"
          code={`<AppBar
  variant="medium"
  title="Medium App Bar"
  navigationIcon={<Ionicons name="arrow-back" size={24} />}
  onNavigationPress={() => {}}
  actions={[
    {
      icon: <Ionicons name="bookmark-outline" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'Bookmark'
    }
  ]}
/>`}
          preview={
            <View style={styles.appBarPreview}>
              <AppBar
                variant="medium"
                title="Medium App Bar"
                navigationIcon={<Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />}
                onNavigationPress={() => { }}
                actions={[
                  {
                    icon: <Ionicons name="bookmark-outline" size={24} color={theme.colors.onSurfaceVariant} />,
                    onPress: () => { },
                    accessibilityLabel: 'Bookmark'
                  }
                ]}
              />
            </View>
          }
        />

        {/* Large App Bar */}
        <CodePlayground
          title="Large App Bar"
          description="App bar with large title for emphasis"
          code={`<AppBar
  variant="large"
  title="Large App Bar Title"
  navigationIcon={<Ionicons name="menu" size={24} />}
  onNavigationPress={() => {}}
  actions={[
    {
      icon: <Ionicons name="share-outline" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'Share'
    }
  ]}
/>`}
          preview={
            <View style={styles.appBarPreview}>
              <AppBar
                variant="large"
                title="Large App Bar Title"
                navigationIcon={<Ionicons name="menu" size={24} color={theme.colors.onSurface} />}
                onNavigationPress={() => { }}
                actions={[
                  {
                    icon: <Ionicons name="share-outline" size={24} color={theme.colors.onSurfaceVariant} />,
                    onPress: () => { },
                    accessibilityLabel: 'Share'
                  }
                ]}
              />
            </View>
          }
        />

        {/* Elevated App Bar */}
        <CodePlayground
          title="Elevated App Bar"
          description="App bar with elevation (scrolled state)"
          code={`<AppBar
  variant="small"
  title="Elevated App Bar"
  elevated={true}
  navigationIcon={<Ionicons name="arrow-back" size={24} />}
  onNavigationPress={() => {}}
/>`}
          preview={
            <View style={styles.appBarPreview}>
              <AppBar
                variant="small"
                title="Elevated App Bar"
                elevated={true}
                navigationIcon={<Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />}
                onNavigationPress={() => { }}
              />
            </View>
          }
        />
      </View>

      {/* Navigation Bar Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Navigation Bar
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          Bottom navigation bars allow movement between primary destinations in an app. They should contain 3-5 destinations.
        </Text>

        {/* Basic Navigation Bar */}
        <CodePlayground
          title="Basic Navigation Bar"
          description="Navigation bar with icons and labels"
          code={`const [selected, setSelected] = useState('home');

const items = [
  {
    key: 'home',
    icon: <Ionicons name="home-outline" size={24} />,
    activeIcon: <Ionicons name="home" size={24} />,
    label: 'Home',
  },
  {
    key: 'search',
    icon: <Ionicons name="search-outline" size={24} />,
    activeIcon: <Ionicons name="search" size={24} />,
    label: 'Search',
  },
  {
    key: 'profile',
    icon: <Ionicons name="person-outline" size={24} />,
    activeIcon: <Ionicons name="person" size={24} />,
    label: 'Profile',
  }
];

<NavigationBar
  items={items}
  selectedKey={selected}
  onSelect={setSelected}
/>`}
          preview={
            <View style={styles.navBarPreview}>
              <NavigationBar
                items={navItems}
                selectedKey={selectedNav}
                onSelect={setSelectedNav}
              />
            </View>
          }
        />

        {/* Navigation Bar with Badges */}
        <CodePlayground
          title="Navigation Bar with Badges"
          description="Show notification counts with badges"
          code={`const items = [
  {
    key: 'home',
    icon: <Ionicons name="home-outline" size={24} />,
    activeIcon: <Ionicons name="home" size={24} />,
    label: 'Home',
  },
  {
    key: 'notifications',
    icon: <Ionicons name="notifications-outline" size={24} />,
    activeIcon: <Ionicons name="notifications" size={24} />,
    label: 'Notifications',
    badge: 5,
  },
  {
    key: 'messages',
    icon: <Ionicons name="chatbubble-outline" size={24} />,
    activeIcon: <Ionicons name="chatbubble" size={24} />,
    label: 'Messages',
    badge: true, // Shows dot badge
  }
];`}
          preview={
            <View style={styles.navBarPreview}>
              <NavigationBar
                items={navItems}
                selectedKey={selectedNav}
                onSelect={setSelectedNav}
              />
            </View>
          }
        />

        {/* Active Only Labels */}
        <CodePlayground
          title="Active-Only Labels"
          description="Show labels only for selected item"
          code={`<NavigationBar
  items={items}
  selectedKey={selected}
  onSelect={setSelected}
  labelVisibility="active-only"
/>`}
          preview={
            <View style={styles.navBarPreview}>
              <NavigationBar
                items={navItems}
                selectedKey={selectedNav}
                onSelect={setSelectedNav}
                labelVisibility="active-only"
              />
            </View>
          }
        />
      </View>

      {/* App Bar Props API */}
      <PropsTable props={appBarProps} title="AppBar API Reference" />

      {/* Navigation Bar Props API */}
      <PropsTable props={navigationBarProps} title="NavigationBar API Reference" />

      {/* Accessibility */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Accessibility
        </Text>
        <View style={[styles.accessibilityCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Semantic Roles
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Proper accessibility roles (button, tablist, tab) for screen readers
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Safe Area Support
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Automatically handles safe area insets for notched devices
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Haptic Feedback
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Light haptic feedback on navigation interactions
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                State Indication
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Clear visual indicators for active navigation items with animations
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Best Practices */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Best Practices
        </Text>
        <View style={styles.bestPracticesList}>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>small</Text> app bar for most screens, <Text style={{ fontWeight: '600' }}>medium/large</Text> for content-heavy pages
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Limit app bar actions to 2-3 most important functions to avoid clutter
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Keep navigation bar items between 3-5 top-level destinations
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use distinct icons for each navigation item that clearly represent their function
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Set elevated prop on app bar when content scrolls underneath for better visual hierarchy
            </Text>
          </View>
        </View>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 12,
  },
  appBarPreview: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  navBarPreview: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  accessibilityCard: {
    padding: 24,
    borderRadius: 16,
    gap: 20,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bestPracticesList: {
    gap: 16,
  },
  bestPracticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bestPracticeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});
