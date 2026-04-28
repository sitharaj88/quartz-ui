import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  Text,
  NavigationDrawer,
  useTheme,
  Button,
  Surface,
} from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const navigationDrawerProps: PropDefinition[] = [
  {
    name: 'sections',
    type: 'DrawerSection[]',
    required: true,
    description: 'Sections of navigation items. Each section can have a title and items array',
  },
  {
    name: 'selectedKey',
    type: 'string',
    description: 'Currently selected item key',
  },
  {
    name: 'onSelect',
    type: '(key: string) => void',
    description: 'Callback when an item is selected',
  },
  {
    name: 'open',
    type: 'boolean',
    default: 'false',
    description: 'Whether the drawer is open (for modal variant)',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Callback when drawer should close (for modal variant)',
  },
  {
    name: 'variant',
    type: "'standard' | 'modal'",
    default: "'modal'",
    description: 'Drawer variant - standard is always visible, modal overlays content',
  },
  {
    name: 'header',
    type: 'React.ReactNode',
    description: 'Custom header content rendered at the top of the drawer',
  },
  {
    name: 'footer',
    type: 'React.ReactNode',
    description: 'Custom footer content rendered at the bottom of the drawer',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override for drawer container',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier for automated testing',
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

// ─── Drawer & Rail demos — self-contained, fit nicely in a phone frame ──

function buildDrawerSections(theme: ReturnType<typeof useTheme>) {
  return [
    {
      items: [
        {
          key: 'inbox',
          label: 'Inbox',
          icon: <Ionicons name="mail-outline" size={22} color={theme.colors.onSurfaceVariant} />,
          selectedIcon: <Ionicons name="mail" size={22} color={theme.colors.onSecondaryContainer} />,
          badge: 12,
        },
        {
          key: 'outbox',
          label: 'Outbox',
          icon: <Ionicons name="send-outline" size={22} color={theme.colors.onSurfaceVariant} />,
          selectedIcon: <Ionicons name="send" size={22} color={theme.colors.onSecondaryContainer} />,
        },
        {
          key: 'favorites',
          label: 'Favorites',
          icon: <Ionicons name="heart-outline" size={22} color={theme.colors.onSurfaceVariant} />,
          selectedIcon: <Ionicons name="heart" size={22} color={theme.colors.onSecondaryContainer} />,
        },
        {
          key: 'trash',
          label: 'Trash',
          icon: <Ionicons name="trash-outline" size={22} color={theme.colors.onSurfaceVariant} />,
          selectedIcon: <Ionicons name="trash" size={22} color={theme.colors.onSecondaryContainer} />,
        },
      ],
      showDivider: true,
    },
    {
      title: 'Labels',
      items: [
        {
          key: 'work',
          label: 'Work',
          icon: <Ionicons name="briefcase-outline" size={22} color={theme.colors.onSurfaceVariant} />,
          selectedIcon: <Ionicons name="briefcase" size={22} color={theme.colors.onSecondaryContainer} />,
        },
        {
          key: 'personal',
          label: 'Personal',
          icon: <Ionicons name="person-outline" size={22} color={theme.colors.onSurfaceVariant} />,
          selectedIcon: <Ionicons name="person" size={22} color={theme.colors.onSecondaryContainer} />,
        },
      ],
    },
  ];
}

function StandardDrawerDemo() {
  const theme = useTheme();
  const [active, setActive] = useState('inbox');
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.background }}>
      <NavigationDrawer
        variant="standard"
        sections={buildDrawerSections(theme)}
        selectedKey={active}
        onSelect={setActive}
        header={
          <View style={{ padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: theme.colors.primaryContainer,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  variant="titleSmall"
                  style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}
                >
                  JD
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  variant="titleSmall"
                  style={{ color: theme.colors.onSurface, fontWeight: '600' }}
                >
                  John Doe
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                  numberOfLines={1}
                >
                  john@example.com
                </Text>
              </View>
            </View>
          </View>
        }
        style={{ width: 220 }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          gap: 6,
        }}
      >
        <Ionicons
          name={(active === 'inbox' ? 'mail' : 'document-text') as any}
          size={36}
          color={theme.colors.primary}
        />
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurface, fontWeight: '600' }}
        >
          {active.charAt(0).toUpperCase() + active.slice(1)}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
        >
          {active} content goes here
        </Text>
      </View>
    </View>
  );
}

function ModalDrawerDemo() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('inbox');
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 16, gap: 10 }}>
        <Button
          variant="filled"
          onPress={() => setOpen(true)}
          icon={<Ionicons name="menu" size={18} color={theme.colors.onPrimary} />}
        >
          Open Drawer
        </Button>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 18 }}>
          Tap the button to open the modal drawer. Tap the scrim or pick an item to dismiss.
        </Text>
      </View>
      <NavigationDrawer
        variant="modal"
        open={open}
        onClose={() => setOpen(false)}
        sections={buildDrawerSections(theme)}
        selectedKey={active}
        onSelect={(key) => {
          setActive(key);
          setOpen(false);
        }}
        header={
          <View style={{ padding: 16, paddingBottom: 8 }}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              Navigation
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
              Choose a destination
            </Text>
          </View>
        }
      />
    </View>
  );
}

function BasicRailDemo() {
  const theme = useTheme();
  const [active, setActive] = useState('home');
  const items = [
    { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
    {
      key: 'notifications',
      label: 'Alerts',
      icon: 'notifications-outline',
      activeIcon: 'notifications',
      badge: 3,
    },
    { key: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
  ];
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.background }}>
      <View
        style={{
          width: 80,
          paddingVertical: 16,
          alignItems: 'center',
          gap: 6,
          backgroundColor: theme.colors.surface,
          borderRightWidth: StyleSheet.hairlineWidth,
          borderRightColor: theme.colors.outlineVariant,
        }}
      >
        {items.map((item) => {
          const selected = active === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setActive(item.key)}
              style={{
                width: 64,
                paddingVertical: 8,
                borderRadius: 14,
                alignItems: 'center',
                gap: 4,
                backgroundColor: selected ? theme.colors.secondaryContainer : 'transparent',
              }}
            >
              <View>
                <Ionicons
                  name={(selected ? item.activeIcon : item.icon) as any}
                  size={22}
                  color={
                    selected ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant
                  }
                />
                {item.badge ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -8,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                      paddingHorizontal: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.colors.error,
                    }}
                  >
                    <Text
                      variant="labelSmall"
                      style={{ color: theme.colors.onError, fontSize: 10, fontWeight: '700' }}
                    >
                      {item.badge}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                variant="labelSmall"
                style={{
                  color: selected
                    ? theme.colors.onSecondaryContainer
                    : theme.colors.onSurfaceVariant,
                  fontWeight: selected ? '700' : '500',
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
          {items.find((i) => i.key === active)?.label}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: 6, textAlign: 'center' }}
        >
          Content for {active}
        </Text>
      </View>
    </View>
  );
}

function RailWithFabDemo() {
  const theme = useTheme();
  const [active, setActive] = useState('home');
  const items = [
    { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
    { key: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
  ];
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.background }}>
      <View
        style={{
          width: 80,
          paddingTop: 16,
          paddingBottom: 12,
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderRightWidth: StyleSheet.hairlineWidth,
          borderRightColor: theme.colors.outlineVariant,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: theme.colors.primaryContainer,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Ionicons name="add" size={24} color={theme.colors.onPrimaryContainer} />
        </View>
        <View style={{ gap: 6, alignItems: 'center' }}>
          {items.map((item) => {
            const selected = active === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setActive(item.key)}
                style={{
                  width: 64,
                  paddingVertical: 8,
                  borderRadius: 14,
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: selected ? theme.colors.secondaryContainer : 'transparent',
                }}
              >
                <Ionicons
                  name={(selected ? item.activeIcon : item.icon) as any}
                  size={22}
                  color={
                    selected ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant
                  }
                />
                <Text
                  variant="labelSmall"
                  style={{
                    color: selected
                      ? theme.colors.onSecondaryContainer
                      : theme.colors.onSurfaceVariant,
                    fontWeight: selected ? '700' : '500',
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 }}
        >
          The FAB at the top of the rail provides quick access to the primary action.
        </Text>
      </View>
    </View>
  );
}

export default function AdvancedNavigationDocPage() {
  const theme = useTheme();

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

      {/* Standard Drawer - Using Real Component */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <CodePlayground frameContentLayout="full"
          title="Standard Drawer (Always Visible)"
          description="Persistent side navigation for desktop/tablet layouts"
          code={`const drawerSections = [
  {
    items: [
      {
        key: 'inbox',
        label: 'Inbox',
        icon: <Ionicons name="mail-outline" size={24} />,
        selectedIcon: <Ionicons name="mail" size={24} />,
        badge: 12
      },
      {
        key: 'outbox',
        label: 'Outbox',
        icon: <Ionicons name="send-outline" size={24} />,
        selectedIcon: <Ionicons name="send" size={24} />
      },
      {
        key: 'favorites',
        label: 'Favorites',
        icon: <Ionicons name="heart-outline" size={24} />,
        selectedIcon: <Ionicons name="heart" size={24} />
      },
      {
        key: 'trash',
        label: 'Trash',
        icon: <Ionicons name="trash-outline" size={24} />,
        selectedIcon: <Ionicons name="trash" size={24} />
      },
    ],
    showDivider: true
  },
  {
    title: 'Labels',
    items: [
      {
        key: 'work',
        label: 'Work',
        icon: <Ionicons name="briefcase-outline" size={24} />,
        selectedIcon: <Ionicons name="briefcase" size={24} />
      },
      {
        key: 'personal',
        label: 'Personal',
        icon: <Ionicons name="person-outline" size={24} />,
        selectedIcon: <Ionicons name="person" size={24} />
      },
    ]
  }
];

<NavigationDrawer
  variant="standard"
  sections={drawerSections}
  selectedKey={selectedKey}
  onSelect={setSelectedKey}
  header={
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: '#667eea',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>JD</Text>
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text variant="titleSmall">John Doe</Text>
          <Text variant="bodySmall">john@example.com</Text>
        </View>
      </View>
    </View>
  }
/>`}
          preview={<StandardDrawerDemo />}
        />
      </Animated.View>

      {/* Modal Drawer - Using Real Component */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <CodePlayground frameContentLayout="full"
          title="Modal Drawer (Overlay)"
          description="Overlay navigation for mobile devices - swipe or tap scrim to close"
          code={`const [drawerOpen, setDrawerOpen] = useState(false);

<Button
  variant="filled"
  onPress={() => setDrawerOpen(true)}
  icon={<Ionicons name="menu" size={18} />}
>
  Open Drawer
</Button>

<NavigationDrawer
  variant="modal"
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  sections={drawerSections}
  selectedKey={selectedKey}
  onSelect={(key) => {
    setSelectedKey(key);
    setDrawerOpen(false);
  }}
  header={
    <View style={{ padding: 16 }}>
      <Text variant="titleLarge">Navigation</Text>
      <Text variant="bodySmall">Choose a destination</Text>
    </View>
  }
  footer={
    <View style={{ padding: 16 }}>
      <Button variant="outlined" onPress={() => {}}>
        Settings
      </Button>
    </View>
  }
/>`}
          preview={<ModalDrawerDemo />}
        />
      </Animated.View>

      {/* Advanced Features */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 48 }]}>
          Advanced Features
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          The NavigationDrawer supports additional features like badges, disabled items, and custom icons for selected state.
        </Text>
      </Animated.View>

      {/* Type Definitions */}
      <Animated.View entering={FadeInDown.delay(450).springify()}>
        <Surface elevation={1} style={[styles.typeDefinitionCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12, fontWeight: '700' }}>
            Type Definitions
          </Text>

          <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant, marginBottom: 12 }]}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', lineHeight: 20 }}>
              {`interface DrawerSection {
  title?: string;
  items: DrawerItem[];
  showDivider?: boolean;
}

interface DrawerItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
  onPress?: () => void;
}`}
            </Text>
          </View>

          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
            • <Text style={{ fontWeight: '600' }}>badge</Text>: Display a number or text badge on the item
            {'\n'}• <Text style={{ fontWeight: '600' }}>selectedIcon</Text>: Different icon to show when item is selected
            {'\n'}• <Text style={{ fontWeight: '600' }}>disabled</Text>: Prevent interaction with the item
            {'\n'}• <Text style={{ fontWeight: '600' }}>onPress</Text>: Custom handler overriding the onSelect callback
          </Text>
        </Surface>
      </Animated.View>

      {/* Drawer Props */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <PropsTable title="NavigationDrawer API" props={navigationDrawerProps} />
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
        <CodePlayground frameContentLayout="full"
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
          preview={<BasicRailDemo />}
        />
      </Animated.View>

      {/* Rail with FAB */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
        <CodePlayground frameContentLayout="full"
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
          preview={<RailWithFabDemo />}
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
  drawerPreviewContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    height: 400,
    width: '100%',
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
  typeDefinitionCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 12,
  },
});
