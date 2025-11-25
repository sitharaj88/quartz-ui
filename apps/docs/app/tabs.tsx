import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Tabs, SearchBar, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const tabsProps: PropDefinition[] = [
  {
    name: 'tabs',
    type: 'TabItem[]',
    required: true,
    description: 'Array of tab items with key, label, icon, and badge',
  },
  {
    name: 'selectedKey',
    type: 'string',
    required: true,
    description: 'Currently selected tab key',
  },
  {
    name: 'onSelect',
    type: '(key: string) => void',
    required: true,
    description: 'Callback when tab is selected',
  },
  {
    name: 'variant',
    type: "'primary' | 'secondary'",
    default: "'primary'",
    description: 'Tab variant style',
  },
  {
    name: 'scrollable',
    type: 'boolean',
    default: 'false',
    description: 'Whether tabs are scrollable',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

const searchBarProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'string',
    required: true,
    description: 'Current search value',
  },
  {
    name: 'onChangeText',
    type: '(text: string) => void',
    required: true,
    description: 'Callback when value changes',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'Search'",
    description: 'Placeholder text',
  },
  {
    name: 'leadingIcon',
    type: 'React.ReactNode',
    description: 'Leading icon (search icon)',
  },
  {
    name: 'trailingIcon',
    type: 'React.ReactNode',
    description: 'Trailing icon (avatar, etc.)',
  },
  {
    name: 'onSubmit',
    type: '(value: string) => void',
    description: 'Callback when search is submitted',
  },
  {
    name: 'onFocus',
    type: '() => void',
    description: 'Callback when search bar is focused',
  },
  {
    name: 'onBlur',
    type: '() => void',
    description: 'Callback when search bar is blurred',
  },
  {
    name: 'expanded',
    type: 'boolean',
    description: 'Whether the search bar is focused/expanded',
  },
  {
    name: 'showClearButton',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show clear button when there is text',
  },
  {
    name: 'editable',
    type: 'boolean',
    default: 'true',
    description: 'Whether the input is editable',
  },
  {
    name: 'autoFocus',
    type: 'boolean',
    default: 'false',
    description: 'Auto focus on mount',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

export default function TabsDocPage() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [activeSecondary, setActiveSecondary] = useState('all');
  const [scrollableTab, setScrollableTab] = useState('mon');
  const [searchValue, setSearchValue] = useState('');

  return (
    <DocLayout
      title="Tabs & Search"
      description="Components for navigation within content and searching"
    >
      {/* Tabs Section */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Tabs
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Tabs organize content across different screens, data sets, and other interactions. 
          They support primary and secondary variants.
        </Text>
      </Animated.View>

      {/* Primary Tabs */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <CodePlayground
          title="Primary Tabs"
          description="Tabs with icons for top-level navigation"
          code={`const [selected, setSelected] = useState('home');

<Tabs
  variant="primary"
  tabs={[
    { key: 'home', label: 'Home', icon: <Icon name="home" /> },
    { key: 'explore', label: 'Explore', icon: <Icon name="compass" /> },
    { key: 'library', label: 'Library', icon: <Icon name="library" /> },
  ]}
  selectedKey={selected}
  onSelect={setSelected}
/>`}
          preview={
            <View>
              <Tabs
                variant="primary"
                tabs={[
                  { key: 'home', label: 'Home', icon: <Ionicons name="home-outline" size={20} color={activeTab === 'home' ? theme.colors.primary : theme.colors.onSurfaceVariant} /> },
                  { key: 'explore', label: 'Explore', icon: <Ionicons name="compass-outline" size={20} color={activeTab === 'explore' ? theme.colors.primary : theme.colors.onSurfaceVariant} /> },
                  { key: 'library', label: 'Library', icon: <Ionicons name="library-outline" size={20} color={activeTab === 'library' ? theme.colors.primary : theme.colors.onSurfaceVariant} /> },
                ]}
                selectedKey={activeTab}
                onSelect={setActiveTab}
              />
              <View style={[styles.tabContent, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {activeTab === 'home' && '🏠 Home content goes here'}
                  {activeTab === 'explore' && '🧭 Explore content goes here'}
                  {activeTab === 'library' && '📚 Library content goes here'}
                </Text>
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Secondary Tabs */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <CodePlayground
          title="Secondary Tabs"
          description="Text-only tabs for sub-navigation"
          code={`<Tabs
  variant="secondary"
  tabs={[
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread', badge: 3 },
    { key: 'starred', label: 'Starred' },
  ]}
  selectedKey={selected}
  onSelect={setSelected}
/>`}
          preview={
            <View>
              <Tabs
                variant="secondary"
                tabs={[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread', badge: 3 },
                  { key: 'starred', label: 'Starred' },
                  { key: 'archived', label: 'Archived' },
                ]}
                selectedKey={activeSecondary}
                onSelect={setActiveSecondary}
              />
              <View style={[styles.tabContent, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  Showing: {activeSecondary} items
                </Text>
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Scrollable Tabs */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <CodePlayground
          title="Scrollable Tabs"
          description="Horizontally scrollable for many tabs"
          code={`<Tabs
  scrollable
  tabs={[
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    // ... more days
  ]}
  selectedKey={selected}
  onSelect={setSelected}
/>`}
          preview={
            <View>
              <Tabs
                scrollable
                variant="secondary"
                tabs={[
                  { key: 'mon', label: 'Monday' },
                  { key: 'tue', label: 'Tuesday' },
                  { key: 'wed', label: 'Wednesday' },
                  { key: 'thu', label: 'Thursday' },
                  { key: 'fri', label: 'Friday' },
                  { key: 'sat', label: 'Saturday' },
                  { key: 'sun', label: 'Sunday' },
                ]}
                selectedKey={scrollableTab}
                onSelect={setScrollableTab}
              />
              <View style={[styles.tabContent, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  Selected day: {scrollableTab}
                </Text>
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Tabs Props */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <PropsTable
          title="Tabs"
          props={tabsProps}
        />
      </Animated.View>

      {/* Search Bar Section */}
      <Animated.View entering={FadeInDown.delay(600).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 48 }]}>
          Search Bar
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Search bars allow users to enter a keyword and search for content. 
          They support clear buttons, trailing icons, and focus states.
        </Text>
      </Animated.View>

      {/* Basic Search */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
        <CodePlayground
          title="Basic Search Bar"
          description="Simple search with clear button"
          code={`const [query, setQuery] = useState('');

<SearchBar
  value={query}
  onChangeText={setQuery}
  placeholder="Search..."
  onSubmit={(value) => console.log('Search:', value)}
/>`}
          preview={
            <View style={styles.searchDemo}>
              <SearchBar
                value={searchValue}
                onChangeText={setSearchValue}
                placeholder="Search..."
                onSubmit={(value) => console.log('Search:', value)}
              />
            </View>
          }
        />
      </Animated.View>

      {/* Search with Trailing Icon */}
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <CodePlayground
          title="With Trailing Icon"
          description="Search bar with avatar or action icon"
          code={`<SearchBar
  value={query}
  onChangeText={setQuery}
  placeholder="Search..."
  trailingIcon={<Avatar source={userImage} size={28} />}
/>`}
          preview={
            <View style={styles.searchDemo}>
              <SearchBar
                value={searchValue}
                onChangeText={setSearchValue}
                placeholder="Search..."
                trailingIcon={
                  <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>JD</Text>
                  </View>
                }
              />
            </View>
          }
        />
      </Animated.View>

      {/* Search Bar Props */}
      <Animated.View entering={FadeInDown.delay(900).springify()}>
        <PropsTable
          title="SearchBar"
          props={searchBarProps}
        />
      </Animated.View>

      {/* Guidelines */}
      <Animated.View entering={FadeInDown.delay(1000).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 48 }]}>
          Usage Guidelines
        </Text>
        
        <View style={[styles.guidelineCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
            Tabs Best Practices
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
            • Use primary tabs for top-level navigation with icons
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
            • Use secondary tabs for sub-navigation within a screen
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            • Use scrollable tabs when you have more than 5 tabs
          </Text>
        </View>

        <View style={[styles.guidelineCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
            Search Best Practices
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
            • Place search prominently at the top of content
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
            • Always show clear button when there is text
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            • Provide helpful placeholder text to guide users
          </Text>
        </View>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 8,
    marginTop: 24,
  },
  sectionDescription: {
    marginBottom: 24,
  },
  tabContent: {
    padding: 24,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  searchDemo: {
    padding: 16,
    width: '100%',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelineCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
});
