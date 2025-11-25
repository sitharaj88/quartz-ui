/**
 * Quartz UI Demo - Drawers Demo
 * 
 * Demonstrates Navigation Drawer, Side Sheet components
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Button, 
  Surface, 
  NavigationDrawer, 
  SideSheet,
  useTheme,
  Divider,
} from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function DrawersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Navigation Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDrawerItem, setSelectedDrawerItem] = useState('inbox');

  // Side Sheet states
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [sideSheetEndOpen, setSideSheetEndOpen] = useState(false);

  // Drawer sections
  const drawerSections = [
    {
      items: [
        { key: 'inbox', label: 'Inbox', icon: <Ionicons name="mail" size={24} color={theme.colors.onSurfaceVariant} />, badge: 24 },
        { key: 'outbox', label: 'Outbox', icon: <Ionicons name="send" size={24} color={theme.colors.onSurfaceVariant} /> },
        { key: 'favorites', label: 'Favorites', icon: <Ionicons name="heart" size={24} color={theme.colors.onSurfaceVariant} /> },
        { key: 'trash', label: 'Trash', icon: <Ionicons name="trash" size={24} color={theme.colors.onSurfaceVariant} /> },
      ],
      showDivider: true,
    },
    {
      title: 'Labels',
      items: [
        { key: 'family', label: 'Family', icon: <Ionicons name="people" size={24} color={theme.colors.onSurfaceVariant} /> },
        { key: 'friends', label: 'Friends', icon: <Ionicons name="person" size={24} color={theme.colors.onSurfaceVariant} />, badge: 5 },
        { key: 'work', label: 'Work', icon: <Ionicons name="briefcase" size={24} color={theme.colors.onSurfaceVariant} /> },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Surface style={[styles.header, { paddingTop: insets.top }]} elevation={0}>
        <View style={styles.headerContent}>
          <Button
            variant="text"
            onPress={() => router.back()}
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />}
          >
            Back
          </Button>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
            Drawers & Sheets
          </Text>
          <View style={{ width: 80 }} />
        </View>
      </Surface>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Drawer Section */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Navigation Drawer
        </Text>
        <Text variant="bodySmall" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Modal drawer for app navigation with sections and badges
        </Text>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.demoRow}>
            <View style={styles.demoInfo}>
              <Ionicons name="menu" size={24} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginStart: 12 }}>
                Modal Navigation Drawer
              </Text>
            </View>
            <Button variant="filled" onPress={() => setDrawerOpen(true)}>
              Open
            </Button>
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            Selected: {selectedDrawerItem}
          </Text>
        </Surface>

        <Divider style={styles.divider} />

        {/* Side Sheet Section */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Side Sheet
        </Text>
        <Text variant="bodySmall" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Supplementary content panels from the side
        </Text>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.demoRow}>
            <View style={styles.demoInfo}>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.secondary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginStart: 12 }}>
                Side Sheet (Start)
              </Text>
            </View>
            <Button variant="tonal" onPress={() => setSideSheetOpen(true)}>
              Open
            </Button>
          </View>
        </Surface>

        <Surface style={[styles.card, { marginTop: 12 }]} elevation={1}>
          <View style={styles.demoRow}>
            <View style={styles.demoInfo}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.tertiary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginStart: 12 }}>
                Side Sheet (End)
              </Text>
            </View>
            <Button variant="tonal" onPress={() => setSideSheetEndOpen(true)}>
              Open
            </Button>
          </View>
        </Surface>

        {/* Features List */}
        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Features
        </Text>
        
        <Surface style={styles.featureCard} elevation={1}>
          {[
            { icon: 'layers-outline', text: 'Modal and standard variants' },
            { icon: 'swap-horizontal', text: 'Swipe to close gesture' },
            { icon: 'pricetag-outline', text: 'Section titles and badges' },
            { icon: 'resize-outline', text: 'RTL layout support' },
            { icon: 'color-palette-outline', text: 'Theme-aware styling' },
            { icon: 'hand-left-outline', text: 'Touch-friendly navigation' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name={feature.icon as any} size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginStart: 12 }}>
                {feature.text}
              </Text>
            </View>
          ))}
        </Surface>
      </ScrollView>

      {/* Navigation Drawer */}
      <NavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedKey={selectedDrawerItem}
        onSelect={(key) => {
          setSelectedDrawerItem(key);
          setDrawerOpen(false);
        }}
        sections={drawerSections}
        header={
          <View style={styles.drawerHeader}>
            <View style={[styles.drawerAvatar, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="person" size={32} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 12 }}>
              John Doe
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              john.doe@example.com
            </Text>
          </View>
        }
      />

      {/* Side Sheet (Start) */}
      <SideSheet
        open={sideSheetOpen}
        onClose={() => setSideSheetOpen(false)}
        title="Filters"
        position="start"
      >
        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          Filter Options
        </Text>
        {['Price Range', 'Category', 'Brand', 'Rating', 'Availability'].map((filter, index) => (
          <Surface key={index} style={styles.filterItem} elevation={0}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {filter}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
          </Surface>
        ))}
      </SideSheet>

      {/* Side Sheet (End) */}
      <SideSheet
        open={sideSheetEndOpen}
        onClose={() => setSideSheetEndOpen(false)}
        title="Details"
        position="end"
        footer={
          <View style={styles.sheetFooter}>
            <Button variant="outlined" onPress={() => setSideSheetEndOpen(false)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button variant="filled" onPress={() => setSideSheetEndOpen(false)} style={{ flex: 1, marginStart: 12 }}>
              Apply
            </Button>
          </View>
        }
      >
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          This side sheet appears from the end (right in LTR, left in RTL) of the screen.
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          It supports swipe gestures to close and can contain any content including forms, lists, or detailed information.
        </Text>
        
        <Divider style={{ marginVertical: 24 }} />
        
        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
          Example Content
        </Text>
        {[1, 2, 3].map((item) => (
          <Surface key={item} style={[styles.filterItem, { marginBottom: 8 }]} elevation={0}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              Item {item}
            </Text>
          </Surface>
        ))}
      </SideSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  demoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    marginVertical: 24,
  },
  featureCard: {
    padding: 16,
    borderRadius: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  drawerHeader: {
    paddingVertical: 16,
  },
  drawerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  sheetFooter: {
    flexDirection: 'row',
  },
});
