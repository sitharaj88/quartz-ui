import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { 
  Text, 
  NavigationDrawer, 
  NavigationRail, 
  useTheme, 
  Button,
  Surface,
  IconButton,
  Badge 
} from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const navigationDrawerProps: PropDefinition[] = [
  {
    name: 'open',
    type: 'boolean',
    description: 'Whether the drawer is open',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Callback when drawer should close',
  },
  {
    name: 'items',
    type: 'NavItem[]',
    description: 'Array of navigation items',
  },
  {
    name: 'activeKey',
    type: 'string',
    description: 'Currently selected item key',
  },
  {
    name: 'onItemPress',
    type: '(key: string) => void',
    description: 'Callback when item is pressed',
  },
  {
    name: 'variant',
    type: "'standard' | 'modal'",
    default: "'standard'",
    description: 'Drawer variant (standard = persistent, modal = overlay)',
  },
  {
    name: 'position',
    type: "'left' | 'right'",
    default: "'left'",
    description: 'Side from which drawer appears',
  },
  {
    name: 'header',
    type: 'ReactNode',
    description: 'Custom header content',
  },
  {
    name: 'footer',
    type: 'ReactNode',
    description: 'Custom footer content',
  },
  {
    name: 'width',
    type: 'number',
    default: '360',
    description: 'Drawer width in pixels',
  },
  {
    name: 'showDividers',
    type: 'boolean',
    default: 'false',
    description: 'Show dividers between sections',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

const navigationRailProps: PropDefinition[] = [
  {
    name: 'items',
    type: 'NavItem[]',
    description: 'Array of navigation items',
  },
  {
    name: 'activeKey',
    type: 'string',
    description: 'Currently selected item key',
  },
  {
    name: 'onItemPress',
    type: '(key: string) => void',
    description: 'Callback when item is pressed',
  },
  {
    name: 'alignment',
    type: "'top' | 'center' | 'bottom'",
    default: "'top'",
    description: 'Vertical alignment of items',
  },
  {
    name: 'showLabels',
    type: "boolean | 'selected'",
    default: 'true',
    description: 'Show labels (always, never, or only selected)',
  },
  {
    name: 'fabAction',
    type: '{ icon: ReactNode, onPress: () => void }',
    description: 'Floating action button at top',
  },
  {
    name: 'menuAction',
    type: '() => void',
    description: 'Menu button action (shows hamburger icon)',
  },
  {
    name: 'expanded',
    type: 'boolean',
    default: 'false',
    description: 'Expand rail to show full labels',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

const navItems = [
  { key: 'inbox', label: 'Inbox', icon: 'mail-outline', badge: 12 },
  { key: 'outbox', label: 'Outbox', icon: 'send-outline' },
  { key: 'favorites', label: 'Favorites', icon: 'heart-outline' },
  { key: 'trash', label: 'Trash', icon: 'trash-outline' },
];

const railItems = [
  { key: 'home', label: 'Home', icon: 'home-outline' },
  { key: 'search', label: 'Search', icon: 'search-outline' },
  { key: 'notifications', label: 'Alerts', icon: 'notifications-outline', badge: 3 },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' },
];

export default function AdvancedNavigationDocPage() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalDrawerOpen, setModalDrawerOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('inbox');
  const [activeRailItem, setActiveRailItem] = useState('home');
  const [railExpanded, setRailExpanded] = useState(false);

  return (
    <DocLayout
      title="Advanced Navigation"
      description="Navigation drawer and rail components for complex app navigation"
    >
      {/* Navigation Drawer Section */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Navigation Drawer
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Navigation drawers provide access to destinations and app functionality like switching accounts. 
          They can either be permanently on-screen or controlled by a menu icon.
        </Text>
      </Animated.View>

      {/* Standard Drawer */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <CodePlayground
          title="Standard Drawer"
          description="Persistent side navigation"
          code={`<NavigationDrawer
  variant="standard"
  open={isOpen}
  items={[
    { key: 'inbox', label: 'Inbox', icon: <Ionicons name="mail" />, badge: 12 },
    { key: 'outbox', label: 'Outbox', icon: <Ionicons name="send" /> },
  ]}
  activeKey={activeKey}
  onItemPress={setActiveKey}
/>`}
          preview={
          <View style={styles.drawerDemo}>
            <Surface elevation={1} style={[styles.drawerPreview, { backgroundColor: theme.colors.surfaceContainerLow }]}>
              <View style={[styles.miniDrawer, { backgroundColor: theme.colors.surface, borderRightColor: theme.colors.outlineVariant }]}>
                <View style={[styles.drawerHeader, { borderBottomColor: theme.colors.outlineVariant }]}>
                  <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>JD</Text>
                  </View>
                  <View style={styles.headerText}>
                    <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>John Doe</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>john@example.com</Text>
                  </View>
                </View>
                {navItems.map((item) => (
                  <View
                    key={item.key}
                    style={[
                      styles.drawerItem,
                      activeNavItem === item.key && { backgroundColor: theme.colors.secondaryContainer }
                    ]}
                    onTouchEnd={() => setActiveNavItem(item.key)}
                  >
                    <Ionicons 
                      name={item.icon as any} 
                      size={20} 
                      color={activeNavItem === item.key ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant} 
                    />
                    <Text 
                      variant="bodyMedium" 
                      style={{ 
                        color: activeNavItem === item.key ? theme.colors.onSecondaryContainer : theme.colors.onSurface,
                        flex: 1,
                        marginLeft: 12
                      }}
                    >
                      {item.label}
                    </Text>
                    {item.badge && (
                      <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                        <Text variant="labelSmall" style={{ color: theme.colors.onPrimary }}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
              <View style={styles.contentArea}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                  {activeNavItem.charAt(0).toUpperCase() + activeNavItem.slice(1)} Content
                </Text>
              </View>
            </Surface>
          </View>
          }
        />
      </Animated.View>

      {/* Modal Drawer */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <CodePlayground
          title="Modal Drawer"
          description="Overlay navigation for mobile"
          code={`<NavigationDrawer
  variant="modal"
  open={isOpen}
  onClose={() => setIsOpen(false)}
  items={navItems}
  header={<ProfileHeader />}
/>`}
          preview={
          <View style={styles.modalDemo}>
            <Button 
              variant="filled"
              onPress={() => setModalDrawerOpen(true)}
              icon={<Ionicons name="menu" size={18} color="white" />}
            >
              Open Modal Drawer
            </Button>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Modal drawers overlay the content and are typically used on mobile devices
            </Text>
            
            {modalDrawerOpen && (
              <View style={[styles.modalOverlay]}>
                <View 
                  style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                  onTouchEnd={() => setModalDrawerOpen(false)}
                />
                <Animated.View 
                  entering={FadeInDown.springify()}
                  style={[styles.modalDrawer, { backgroundColor: theme.colors.surface }]}
                >
                  <View style={[styles.drawerHeader, { borderBottomColor: theme.colors.outlineVariant }]}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Menu</Text>
                    <IconButton 
                      icon={<Ionicons name="close" size={20} />}
                      onPress={() => setModalDrawerOpen(false)}
                      accessibilityLabel="Close menu"
                    />
                  </View>
                  {navItems.map((item) => (
                    <View
                      key={item.key}
                      style={[
                        styles.drawerItem,
                        activeNavItem === item.key && { backgroundColor: theme.colors.secondaryContainer }
                      ]}
                      onTouchEnd={() => {
                        setActiveNavItem(item.key);
                        setModalDrawerOpen(false);
                      }}
                    >
                      <Ionicons 
                        name={item.icon as any} 
                        size={20} 
                        color={activeNavItem === item.key ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant} 
                      />
                      <Text 
                        variant="bodyMedium" 
                        style={{ 
                          color: activeNavItem === item.key ? theme.colors.onSecondaryContainer : theme.colors.onSurface,
                          marginLeft: 12
                        }}
                      >
                        {item.label}
                      </Text>
                    </View>
                  ))}
                </Animated.View>
              </View>
            )}
          </View>
          }
        />
      </Animated.View>

      {/* Drawer Props */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <PropsTable title="NavigationDrawer" props={navigationDrawerProps} />
      </Animated.View>

      {/* Navigation Rail Section */}
      <Animated.View entering={FadeInDown.delay(500).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Navigation Rail
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Navigation rails provide access to primary destinations in apps when using tablet or desktop layouts. 
          They can show icons with optional labels and support a FAB action.
        </Text>
      </Animated.View>

      {/* Basic Rail */}
      <Animated.View entering={FadeInDown.delay(600).springify()}>
        <CodePlayground
          title="Basic Navigation Rail"
          description="Compact vertical navigation"
          code={`<NavigationRail
  items={[
    { key: 'home', label: 'Home', icon: <Ionicons name="home" /> },
    { key: 'search', label: 'Search', icon: <Ionicons name="search" /> },
  ]}
  activeKey={activeKey}
  onItemPress={setActiveKey}
/>`}
          preview={
          <Surface elevation={1} style={[styles.railDemo, { backgroundColor: theme.colors.surfaceContainerLow }]}>
            <View style={[styles.miniRail, { backgroundColor: theme.colors.surface }]}>
              <IconButton
                icon={<Ionicons name="menu" size={24} color={theme.colors.onSurface} />}
                onPress={() => setRailExpanded(!railExpanded)}
                accessibilityLabel="Toggle menu"
                style={{ marginBottom: 16 }}
              />
              {railItems.map((item) => (
                <View
                  key={item.key}
                  style={[
                    styles.railItem,
                    activeRailItem === item.key && { backgroundColor: theme.colors.secondaryContainer }
                  ]}
                  onTouchEnd={() => setActiveRailItem(item.key)}
                >
                  <View>
                    <Ionicons 
                      name={(activeRailItem === item.key ? item.icon.replace('-outline', '') : item.icon) as any} 
                      size={24} 
                      color={activeRailItem === item.key ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant} 
                    />
                    {item.badge && (
                      <View style={[styles.railBadge, { backgroundColor: theme.colors.error }]}>
                        <Text variant="labelSmall" style={{ color: theme.colors.onError, fontSize: 10 }}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text 
                    variant="labelSmall" 
                    style={{ 
                      color: activeRailItem === item.key ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant,
                      marginTop: 4,
                      textAlign: 'center'
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.railContent}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                {railItems.find(i => i.key === activeRailItem)?.label}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                Content for {activeRailItem} section
              </Text>
            </View>
          </Surface>
          }
        />
      </Animated.View>

      {/* Rail with FAB */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
        <CodePlayground
          title="With FAB Action"
          description="Navigation rail with floating action button"
          code={`<NavigationRail
  items={navItems}
  activeKey={activeKey}
  onItemPress={setActiveKey}
  fabAction={{
    icon: <Ionicons name="add" />,
    onPress: handleCompose
  }}
/>`}
          preview={
          <Surface elevation={1} style={[styles.railDemo, { backgroundColor: theme.colors.surfaceContainerLow }]}>
            <View style={[styles.miniRail, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}>
                <Ionicons name="add" size={24} color={theme.colors.onPrimaryContainer} />
              </View>
              <View style={{ marginTop: 24 }}>
                {railItems.slice(0, 3).map((item) => (
                  <View
                    key={item.key}
                    style={[
                      styles.railItem,
                      activeRailItem === item.key && { backgroundColor: theme.colors.secondaryContainer }
                    ]}
                    onTouchEnd={() => setActiveRailItem(item.key)}
                  >
                    <Ionicons 
                      name={(activeRailItem === item.key ? item.icon.replace('-outline', '') : item.icon) as any} 
                      size={24} 
                      color={activeRailItem === item.key ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant} 
                    />
                    <Text 
                      variant="labelSmall" 
                      style={{ 
                        color: activeRailItem === item.key ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant,
                        marginTop: 4,
                        textAlign: 'center'
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.railContent}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                FAB provides quick access to primary action
              </Text>
            </View>
          </Surface>
          }
        />
      </Animated.View>

      {/* Rail Props */}
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <PropsTable title="NavigationRail" props={navigationRailProps} />
      </Animated.View>

      {/* Usage Guidelines */}
      <Animated.View entering={FadeInDown.delay(900).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          When to Use
        </Text>
        <View style={styles.guidelinesGrid}>
          <Surface elevation={1} style={[styles.guidelineCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
            <View style={[styles.guidelineIcon, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="phone-portrait" size={24} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 12 }}>
              Mobile
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Use Modal Drawer for primary navigation, triggered by hamburger menu
            </Text>
          </Surface>
          
          <Surface elevation={1} style={[styles.guidelineCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
            <View style={[styles.guidelineIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Ionicons name="tablet-portrait" size={24} color={theme.colors.onSecondaryContainer} />
            </View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 12 }}>
              Tablet
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Use Navigation Rail for compact, persistent navigation on medium screens
            </Text>
          </Surface>
          
          <Surface elevation={1} style={[styles.guidelineCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
            <View style={[styles.guidelineIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
              <Ionicons name="desktop" size={24} color={theme.colors.onTertiaryContainer} />
            </View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 12 }}>
              Desktop
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Use Standard Drawer for full navigation with labels visible
            </Text>
          </Surface>
        </View>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '700',
  },
  sectionDescription: {
    marginBottom: 24,
    lineHeight: 24,
  },
  drawerDemo: {
    width: '100%',
  },
  drawerPreview: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    height: 300,
  },
  miniDrawer: {
    width: 200,
    borderRightWidth: 1,
    padding: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 28,
    marginVertical: 2,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDemo: {
    width: '100%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    padding: 8,
  },
  railDemo: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    height: 320,
  },
  miniRail: {
    width: 80,
    alignItems: 'center',
    paddingTop: 16,
  },
  railItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginVertical: 4,
    minWidth: 56,
  },
  railBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  railContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidelinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  guidelineCard: {
    flex: 1,
    minWidth: 200,
    padding: 20,
    borderRadius: 16,
  },
  guidelineIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
