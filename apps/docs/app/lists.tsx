import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, ListItem, Divider, Badge, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const listItemProps: PropDefinition[] = [
  {
    name: 'headline',
    type: 'string',
    description: 'Primary text content (headline)',
  },
  {
    name: 'supportingText',
    type: 'string',
    description: 'Secondary supporting text',
  },
  {
    name: 'leading',
    type: 'ReactNode',
    description: 'Leading element (icon, avatar, image)',
  },
  {
    name: 'trailing',
    type: 'ReactNode',
    description: 'Trailing element (icon, text, control)',
  },
  {
    name: 'onPress',
    type: '() => void',
    description: 'Callback when item is pressed',
  },
  {
    name: 'onLongPress',
    type: '() => void',
    description: 'Callback when item is long pressed',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether item is disabled',
  },
  {
    name: 'selected',
    type: 'boolean',
    default: 'false',
    description: 'Whether item is selected',
  },
  {
    name: 'lines',
    type: "'one' | 'two' | 'three'",
    default: "'two'",
    description: 'Number of text lines to display',
  },
  {
    name: 'leadingType',
    type: "'icon' | 'avatar' | 'image' | 'checkbox' | 'radio'",
    description: 'Type of leading element for proper sizing',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

const dividerProps: PropDefinition[] = [
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Divider orientation',
  },
  {
    name: 'inset',
    type: "'none' | 'start' | 'end' | 'both'",
    default: "'none'",
    description: 'Inset from edges for horizontal dividers',
  },
  {
    name: 'insetValue',
    type: 'number',
    default: '16',
    description: 'Custom inset value in pixels',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

const badgeProps: PropDefinition[] = [
  {
    name: 'content',
    type: 'number | string',
    description: 'Badge content (number or text)',
  },
  {
    name: 'size',
    type: "'small' | 'large'",
    default: "'large'",
    description: 'Badge size (small = dot, large = content)',
  },
  {
    name: 'max',
    type: 'number',
    default: '999',
    description: 'Maximum number before showing "max+"',
  },
  {
    name: 'visible',
    type: 'boolean',
    default: 'true',
    description: 'Whether badge is visible',
  },
  {
    name: 'color',
    type: 'string',
    description: 'Custom badge background color',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

export default function ListsDocPage() {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <DocLayout
      title="Lists, Dividers & Badges"
      description="Components for displaying collections and metadata"
    >
      {/* List Section */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          List
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Lists are continuous, vertical indexes of text and images, ideal for displaying homogeneous data.
        </Text>
      </Animated.View>

      {/* Single Line List */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <CodePlayground
          title="Single Line"
          description="Simple list with one line of text"
          code={`<ListItem
  headline="List item"
  leading={<Ionicons name="folder" />}
  onPress={() => {}}
/>`}
          preview={
          <View style={[styles.listContainer, { backgroundColor: theme.colors.surface }]}>
            <ListItem
              headline="Documents"
              leading={<Ionicons name="folder" size={24} color={theme.colors.onSurfaceVariant} />}
              trailing={<Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />}
              onPress={() => {}}
            />
            <Divider inset="start" />
            <ListItem
              headline="Photos"
              leading={<Ionicons name="images" size={24} color={theme.colors.onSurfaceVariant} />}
              trailing={<Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />}
              onPress={() => {}}
            />
            <Divider inset="start" />
            <ListItem
              headline="Downloads"
              leading={<Ionicons name="download" size={24} color={theme.colors.onSurfaceVariant} />}
              trailing={<Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />}
              onPress={() => {}}
            />
          </View>
          }
        />
      </Animated.View>

      {/* Two Line List */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <CodePlayground
          title="Two Lines"
          description="List with headline and supporting text"
          code={`<ListItem
  headline="Item headline"
  supportingText="Supporting text"
  leading={<Avatar />}
  onPress={() => {}}
/>`}
          preview={
          <View style={[styles.listContainer, { backgroundColor: theme.colors.surface }]}>
            <ListItem
              headline="John Doe"
              supportingText="Hey, are you available for a call?"
              leading={
                <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Text style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}>JD</Text>
                </View>
              }
              trailing={<Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>2m ago</Text>}
              onPress={() => {}}
            />
            <Divider inset="start" />
            <ListItem
              headline="Jane Smith"
              supportingText="The project files have been updated"
              leading={
                <View style={[styles.avatar, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Text style={{ color: theme.colors.onSecondaryContainer, fontWeight: '600' }}>JS</Text>
                </View>
              }
              trailing={<Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>1h ago</Text>}
              onPress={() => {}}
            />
            <Divider inset="start" />
            <ListItem
              headline="Team Updates"
              supportingText="Weekly standup notes are available"
              leading={
                <View style={[styles.avatar, { backgroundColor: theme.colors.tertiaryContainer }]}>
                  <Text style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>TU</Text>
                </View>
              }
              trailing={<Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>3h ago</Text>}
              onPress={() => {}}
            />
          </View>
          }
        />
      </Animated.View>

      {/* Selectable List */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <CodePlayground
          title="Selectable Items"
          description="List items with selection state"
          code={`<ListItem
  headline="Option"
  selected={selected === 'option'}
  onPress={() => setSelected('option')}
/>`}
          preview={
          <View style={[styles.listContainer, { backgroundColor: theme.colors.surface }]}>
            {['inbox', 'starred', 'sent', 'drafts'].map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 && <Divider />}
                <ListItem
                  headline={item.charAt(0).toUpperCase() + item.slice(1)}
                  leading={
                    <Ionicons
                      name={item === 'inbox' ? 'mail' : item === 'starred' ? 'star' : item === 'sent' ? 'send' : 'document-text'}
                      size={24}
                      color={selectedItem === item ? theme.colors.primary : theme.colors.onSurfaceVariant}
                    />
                  }
                  selected={selectedItem === item}
                  onPress={() => setSelectedItem(item)}
                />
              </React.Fragment>
            ))}
          </View>
          }
        />
      </Animated.View>

      {/* List Props */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <PropsTable title="ListItem" props={listItemProps} />
      </Animated.View>

      {/* Divider Section */}
      <Animated.View entering={FadeInDown.delay(600).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Divider
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Dividers separate content into clear groups, helping users understand relationships between items.
        </Text>
      </Animated.View>

      {/* Divider Variants */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
        <CodePlayground
          title="Divider Insets"
          description="No inset, start inset, and both sides inset"
          code={`<Divider />
<Divider inset="start" />
<Divider inset="both" />`}
          preview={
          <View style={[styles.dividerDemo, { backgroundColor: theme.colors.surface }]}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, padding: 16 }}>Full width divider below</Text>
            <Divider />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, padding: 16 }}>Start inset divider below (for lists)</Text>
            <Divider inset="start" />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, padding: 16 }}>Both sides inset divider below</Text>
            <Divider inset="both" />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, padding: 16 }}>End of demo</Text>
          </View>
          }
        />
      </Animated.View>

      {/* Divider Props */}
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <PropsTable title="Divider" props={dividerProps} />
      </Animated.View>

      {/* Badge Section */}
      <Animated.View entering={FadeInDown.delay(900).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Badge
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Badges convey dynamic information, like counts or status, attached to other elements.
        </Text>
      </Animated.View>

      {/* Badge Examples */}
      <Animated.View entering={FadeInDown.delay(1000).springify()}>
        <CodePlayground
          title="Badge Variants"
          description="Small dot and large numbered badges"
          code={`// Large badge with number
<Badge content={5} />

// Small dot badge
<Badge size="small" />

// Badge with max limit
<Badge content={150} max={99} />`}
          preview={
          <View style={styles.badgeRow}>
            <View style={styles.badgeItem}>
              <View style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Ionicons name="notifications-outline" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
              <Badge content={3} style={styles.badgeOverlay} />
            </View>

            <View style={styles.badgeItem}>
              <View style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Ionicons name="mail-outline" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
              <Badge content={12} style={styles.badgeOverlay} />
            </View>

            <View style={styles.badgeItem}>
              <View style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Ionicons name="chatbubble-outline" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
              <Badge content={150} max={99} style={styles.badgeOverlay} />
            </View>

            <View style={styles.badgeItem}>
              <View style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Ionicons name="person-outline" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
              <Badge size="small" style={styles.badgeOverlay} />
            </View>
          </View>
          }
        />
      </Animated.View>

      {/* Badge Props */}
      <Animated.View entering={FadeInDown.delay(1100).springify()}>
        <PropsTable title="Badge" props={badgeProps} />
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
  listContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerDemo: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    alignItems: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeItem: {
    position: 'relative',
  },
  badgeOverlay: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});
