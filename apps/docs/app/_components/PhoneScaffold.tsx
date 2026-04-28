/**
 * PhoneScaffold — mock screen content used inside MobileFrame previews so
 * navigation/chrome components (AppBar, NavigationBar, Tabs, SearchBar,
 * Drawer, NavigationRail, Carousel) read as part of a real app screen
 * rather than floating on a blank canvas.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Surface, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';

interface PhoneScaffoldProps {
  /** Pinned to the top of the screen (typically AppBar / Tabs / SearchBar). */
  topSlot?: React.ReactNode;
  /** Pinned to the bottom (typically NavigationBar). */
  bottomSlot?: React.ReactNode;
  /** Pinned to the left edge (typically NavigationRail / Drawer). */
  sideSlot?: React.ReactNode;
  /** Override mock content. Defaults to a list of placeholder cards. */
  body?: React.ReactNode;
  /** Vertical padding for the body when using the default content. */
  bodyPadding?: number;
}

const MOCK_ITEMS: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string }[] = [
  { icon: 'mail-outline', title: 'New mail', subtitle: 'You have 3 unread messages' },
  { icon: 'calendar-outline', title: 'Today', subtitle: 'Design review at 2:30 PM' },
  { icon: 'document-text-outline', title: 'Report', subtitle: 'Q2 retrospective draft' },
  { icon: 'people-outline', title: 'Team', subtitle: '8 active members' },
  { icon: 'cloud-outline', title: 'Backups', subtitle: 'Synced 2 minutes ago' },
];

function MockBody({ padding = 12 }: { padding?: number }) {
  const theme = useTheme();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding, gap: 8 }}
    >
      {MOCK_ITEMS.map((item) => (
        <Surface
          key={item.title}
          elevation={0}
          style={[
            styles.row,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        >
          <View
            style={[styles.rowIcon, { backgroundColor: theme.colors.primaryContainer }]}
          >
            <Ionicons name={item.icon} size={18} color={theme.colors.onPrimaryContainer} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.onSurface, fontWeight: '600' }}
            >
              {item.title}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
              numberOfLines={1}
            >
              {item.subtitle}
            </Text>
          </View>
        </Surface>
      ))}
    </ScrollView>
  );
}

export function PhoneScaffold({
  topSlot,
  bottomSlot,
  sideSlot,
  body,
  bodyPadding,
}: PhoneScaffoldProps) {
  const theme = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {topSlot}
      <View style={styles.middleRow}>
        {sideSlot}
        <View style={{ flex: 1 }}>{body ?? <MockBody padding={bodyPadding} />}</View>
      </View>
      {bottomSlot}
    </View>
  );
}

export { MockBody };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  middleRow: {
    flex: 1,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
