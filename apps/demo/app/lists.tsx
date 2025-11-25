/**
 * Quartz UI Demo - Lists Demo
 *
 * Demonstrates ListItem component with various layouts and styles
 */

import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Surface, ListItem, Divider, useTheme, Switch, Checkbox } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

function Avatar({ color, icon }: { color: string; icon: string }) {
  return (
    <View style={[styles.avatar, { backgroundColor: color }]}>
      <Ionicons name={icon as any} size={20} color="#fff" />
    </View>
  );
}

function Thumbnail({ uri }: { uri: string }) {
  return <Image source={{ uri }} style={styles.thumbnail} />;
}

export default function ListsScreen() {
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState('track1');
  const [checkedItems, setCheckedItems] = useState<string[]>(['item1']);

  const toggleCheckItem = (item: string) => {
    setCheckedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const contacts = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', icon: 'person', color: '#6366f1', status: 'online' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', icon: 'person', color: '#8b5cf6', status: 'away' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', icon: 'person', color: '#ec4899', status: 'offline' },
    { id: '4', name: 'David Lee', email: 'david@example.com', icon: 'person', color: '#f59e0b', status: 'online' },
  ];

  const settings = [
    { id: 'notif', title: 'Notifications', desc: 'Push, email, SMS', icon: 'notifications', color: '#6366f1' },
    { id: 'privacy', title: 'Privacy', desc: 'Control your data', icon: 'shield-checkmark', color: '#8b5cf6' },
    { id: 'storage', title: 'Storage', desc: '23.5 GB of 50 GB used', icon: 'cloud', color: '#ec4899' },
    { id: 'language', title: 'Language', desc: 'English (US)', icon: 'globe', color: '#f59e0b' },
    { id: 'security', title: 'Security', desc: '2FA enabled', icon: 'lock-closed', color: '#10b981' },
  ];

  const music = [
    { id: 'track1', title: 'Midnight Dreams', artist: 'Luna Symphony', duration: '3:42', img: 'https://picsum.photos/seed/music1/80/80' },
    { id: 'track2', title: 'Electric Pulse', artist: 'Neon Beats', duration: '4:15', img: 'https://picsum.photos/seed/music2/80/80' },
    { id: 'track3', title: 'Ocean Waves', artist: 'Nature Sounds', duration: '5:20', img: 'https://picsum.photos/seed/music3/80/80' },
    { id: 'track4', title: 'City Lights', artist: 'Urban Jazz', duration: '3:58', img: 'https://picsum.photos/seed/music4/80/80' },
  ];

  const notifications = [
    { id: '1', title: 'New message from Alice', time: '2m ago', icon: 'chatbubble', color: '#6366f1', unread: true },
    { id: '2', title: 'Update available', time: '1h ago', icon: 'download', color: '#10b981', unread: true },
    { id: '3', title: 'Backup completed', time: '3h ago', icon: 'checkmark-circle', color: '#8b5cf6', unread: false },
    { id: '4', title: 'Storage almost full', time: '1d ago', icon: 'warning', color: '#f59e0b', unread: false },
  ];

  const files = [
    { id: '1', name: 'Project Proposal.pdf', size: '2.4 MB', modified: 'Yesterday', icon: 'document-text', color: '#ef4444' },
    { id: '2', name: 'Design Assets.zip', size: '45.8 MB', modified: '2 days ago', icon: 'folder', color: '#f59e0b' },
    { id: '3', name: 'Meeting Notes.docx', size: '156 KB', modified: 'Last week', icon: 'document', color: '#3b82f6' },
  ];

  return (
    <DemoLayout
      title="Lists"
      subtitle="Organized content display"
      icon="list"
      gradient={['#a1c4fd', '#c2e9fb']}
    >
      {/* Simple One-Line List */}
      <Section title="Simple List" subtitle="One-line items with icons and badges" index={0}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <ListItem
            headline="Inbox"
            leading={<Ionicons name="mail" size={24} color={theme.colors.onSurfaceVariant} />}
            trailing={
              <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                <Text variant="labelSmall" style={{ color: '#fff', fontWeight: '600' }}>12</Text>
              </View>
            }
            onPress={() => {}}
          />
          <Divider />
          <ListItem
            headline="Starred"
            leading={<Ionicons name="star" size={24} color={theme.colors.tertiary} />}
            trailing={
              <View style={[styles.badge, { backgroundColor: theme.colors.tertiary }]}>
                <Text variant="labelSmall" style={{ color: '#fff', fontWeight: '600' }}>3</Text>
              </View>
            }
            onPress={() => {}}
          />
          <Divider />
          <ListItem
            headline="Sent"
            leading={<Ionicons name="send" size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={() => {}}
          />
          <Divider />
          <ListItem
            headline="Drafts"
            leading={<Ionicons name="create" size={24} color={theme.colors.onSurfaceVariant} />}
            trailing={
              <View style={[styles.badge, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}>7</Text>
              </View>
            }
            onPress={() => {}}
          />
          <Divider />
          <ListItem
            headline="Trash"
            leading={<Ionicons name="trash" size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={() => {}}
          />
        </Surface>
      </Section>

      {/* Contact List with Avatars */}
      <Section title="Contact List" subtitle="Two-line with avatars and status" index={1}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          {contacts.map((contact, index) => (
            <React.Fragment key={contact.id}>
              {index > 0 && <Divider />}
              <ListItem
                headline={contact.name}
                supportingText={contact.email}
                leading={
                  <View>
                    <Avatar color={contact.color} icon={contact.icon} />
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: contact.status === 'online' ? '#10b981' : contact.status === 'away' ? '#f59e0b' : '#9ca3af' }
                    ]} />
                  </View>
                }
                trailing={<Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
              />
            </React.Fragment>
          ))}
        </Surface>
      </Section>

      {/* Settings List with Colored Icons */}
      <Section title="Settings List" subtitle="Two-line with colored icon badges" index={2}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          {settings.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <Divider />}
              <ListItem
                headline={item.title}
                supportingText={item.desc}
                leading={
                  <View style={[styles.iconCircle, { backgroundColor: `${item.color}20` }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                }
                trailing={<Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
              />
            </React.Fragment>
          ))}
        </Surface>
      </Section>

      {/* Music List with Thumbnails */}
      <Section title="Music List" subtitle="Media items with thumbnails and duration" index={3}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          {music.map((track, index) => (
            <React.Fragment key={track.id}>
              {index > 0 && <Divider />}
              <ListItem
                headline={track.title}
                supportingText={`${track.artist} • ${track.duration}`}
                leading={<Thumbnail uri={track.img} />}
                trailing={
                  <Ionicons
                    name={selectedMusic === track.id ? "pause-circle" : "play-circle"}
                    size={32}
                    color={selectedMusic === track.id ? theme.colors.primary : theme.colors.onSurfaceVariant}
                  />
                }
                selected={selectedMusic === track.id}
                onPress={() => setSelectedMusic(track.id)}
              />
            </React.Fragment>
          ))}
        </Surface>
      </Section>

      {/* Notifications List */}
      <Section title="Notifications" subtitle="Time-based items with unread indicators" index={4}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          {notifications.map((notif, index) => (
            <React.Fragment key={notif.id}>
              {index > 0 && <Divider />}
              <ListItem
                headline={notif.title}
                supportingText={notif.time}
                leading={
                  <View style={[styles.iconCircle, { backgroundColor: `${notif.color}20` }]}>
                    <Ionicons name={notif.icon as any} size={20} color={notif.color} />
                  </View>
                }
                trailing={
                  notif.unread ? (
                    <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
                  ) : null
                }
                onPress={() => {}}
              />
            </React.Fragment>
          ))}
        </Surface>
      </Section>

      {/* File List */}
      <Section title="File Browser" subtitle="Documents with size and date" index={5}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          {files.map((file, index) => (
            <React.Fragment key={file.id}>
              {index > 0 && <Divider />}
              <ListItem
                headline={file.name}
                supportingText={`${file.size} • Modified ${file.modified}`}
                leading={
                  <View style={[styles.fileIcon, { backgroundColor: `${file.color}20` }]}>
                    <Ionicons name={file.icon as any} size={24} color={file.color} />
                  </View>
                }
                trailing={<Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
              />
            </React.Fragment>
          ))}
        </Surface>
      </Section>

      {/* Interactive List with Switches */}
      <Section title="Toggle Controls" subtitle="Lists with interactive switches" index={6}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <ListItem
            headline="Enable Notifications"
            supportingText="Receive push notifications and alerts"
            leading={
              <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="notifications" size={20} color={theme.colors.primary} />
              </View>
            }
            trailing={<Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          <Divider />
          <ListItem
            headline="Dark Mode"
            supportingText="Switch to dark theme appearance"
            leading={
              <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.secondary}20` }]}>
                <Ionicons name="moon" size={20} color={theme.colors.secondary} />
              </View>
            }
            trailing={<Switch value={darkModeEnabled} onValueChange={setDarkModeEnabled} />}
            onPress={() => setDarkModeEnabled(!darkModeEnabled)}
          />
        </Surface>
      </Section>

      {/* Checklist */}
      <Section title="Checklist" subtitle="Multi-select items with checkboxes" index={7}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <ListItem
            headline="Complete project proposal"
            supportingText="Due tomorrow"
            leading={<Checkbox checked={checkedItems.includes('item1')} onCheckedChange={() => toggleCheckItem('item1')} />}
            onPress={() => toggleCheckItem('item1')}
          />
          <Divider />
          <ListItem
            headline="Review design mockups"
            supportingText="High priority"
            leading={<Checkbox checked={checkedItems.includes('item2')} onCheckedChange={() => toggleCheckItem('item2')} />}
            onPress={() => toggleCheckItem('item2')}
          />
          <Divider />
          <ListItem
            headline="Update documentation"
            supportingText="Low priority"
            leading={<Checkbox checked={checkedItems.includes('item3')} onCheckedChange={() => toggleCheckItem('item3')} />}
            onPress={() => toggleCheckItem('item3')}
          />
          <Divider />
          <ListItem
            headline="Team sync meeting"
            supportingText="Friday 2:00 PM"
            leading={<Checkbox checked={checkedItems.includes('item4')} onCheckedChange={() => toggleCheckItem('item4')} />}
            onPress={() => toggleCheckItem('item4')}
          />
        </Surface>
      </Section>

      {/* Interactive States */}
      <Section title="List States" subtitle="Selected, disabled, and normal states" index={8}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <ListItem
            headline="Normal Item"
            supportingText="Tap to interact with this item"
            leading={<Ionicons name="ellipse-outline" size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={() => {}}
          />
          <Divider />
          <ListItem
            headline="Selected Item"
            supportingText="Currently active and highlighted"
            selected
            leading={<Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />}
            onPress={() => {}}
          />
          <Divider />
          <ListItem
            headline="Disabled Item"
            supportingText="Cannot interact with this item"
            disabled
            leading={<Ionicons name="ban" size={24} color={theme.colors.onSurfaceVariant} />}
          />
        </Surface>
      </Section>

      {/* Best Practices */}
      <Section title="Design Guidelines" subtitle="List best practices" index={9}>
        <View style={[styles.guideCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons name="information-circle" size={32} color={theme.colors.onPrimaryContainer} />
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 16, fontWeight: '600' }}>
            List Best Practices
          </Text>
          <View style={styles.guideList}>
            {[
              'Use consistent icon sizes (24px for leading icons)',
              'Provide clear visual hierarchy with headlines and supporting text',
              'Add dividers between items for better separation',
              'Use avatars for people, icons for objects and actions',
              'Keep list items tappable with minimum 48px height',
              'Show badges or indicators for counts and status',
            ].map((tip, index) => (
              <View key={index} style={styles.guideItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.onPrimaryContainer} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Section>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  guideCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  guideList: {
    width: '100%',
    gap: 16,
    marginTop: 16,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
