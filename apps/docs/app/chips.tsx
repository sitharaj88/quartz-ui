import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, SegmentedButton, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const chipProps: PropDefinition[] = [
  {
    name: 'variant',
    type: "'assist' | 'filter' | 'input' | 'suggestion'",
    default: "'assist'",
    description: 'Visual style variant of the chip',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Text label displayed in the chip',
  },
  {
    name: 'selected',
    type: 'boolean',
    default: 'false',
    description: 'Whether the chip is selected (filter chips)',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the chip is disabled',
  },
  {
    name: 'leadingIcon',
    type: 'ReactNode',
    description: 'Leading icon element',
  },
  {
    name: 'trailingIcon',
    type: 'ReactNode',
    description: 'Trailing icon element',
  },
  {
    name: 'avatar',
    type: 'ReactNode',
    description: 'Avatar element (input chips)',
  },
  {
    name: 'onPress',
    type: '() => void',
    description: 'Callback when chip is pressed',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Callback when close button is pressed (input chips)',
  },
  {
    name: 'elevated',
    type: 'boolean',
    default: 'false',
    description: 'Whether chip has elevation',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override for chip container',
  },
];

const segmentedButtonProps: PropDefinition[] = [
  {
    name: 'segments',
    type: 'Segment[]',
    description: 'Array of segment objects with value, label, icon',
  },
  {
    name: 'value',
    type: 'string | string[]',
    description: 'Selected segment value(s)',
  },
  {
    name: 'onValueChange',
    type: '(value: string | string[]) => void',
    description: 'Callback when selection changes',
  },
  {
    name: 'multiSelect',
    type: 'boolean',
    default: 'false',
    description: 'Allow multiple segment selection',
  },
  {
    name: 'density',
    type: "'default' | 'comfortable' | 'compact'",
    default: "'default'",
    description: 'Button density/height',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable all segments',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

export default function ChipsDocPage() {
  const theme = useTheme();
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['react']);
  const [segmentValue, setSegmentValue] = useState('day');
  const [multiSegments, setMultiSegments] = useState<string[]>(['bold']);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <DocLayout
      title="Chips & Segmented Buttons"
      description="Compact elements for filtering, selection, and input"
    >
      {/* Chip Section */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Chip Variants
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Chips help people enter information, make selections, filter content, or trigger actions.
        </Text>
      </Animated.View>

      {/* All Chip Variants */}
      <Animated.View entering={FadeInDown.delay(150).springify()}>
        <CodePlayground
          title="All Chip Variants"
          description="Four chip types for different use cases"
          code={`<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
  <Chip variant="assist" label="Assist Chip"
    leadingIcon={<Ionicons name="sparkles" />} />
  <Chip variant="filter" label="Filter Chip" selected />
  <Chip variant="input" label="Input Chip"
    onClose={() => {}} />
  <Chip variant="suggestion" label="Suggestion" />
</View>`}
          preview={
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Chip
                variant="assist"
                label="Assist Chip"
                leadingIcon={<Ionicons name="sparkles-outline" size={18} color={theme.colors.primary} />}
                onPress={() => {}}
              />
              <Chip
                variant="filter"
                label="Filter Chip"
                selected
                onPress={() => {}}
              />
              <Chip
                variant="input"
                label="Input Chip"
                onClose={() => {}}
              />
              <Chip
                variant="suggestion"
                label="Suggestion"
                onPress={() => {}}
              />
            </View>
          }
        />
      </Animated.View>

      {/* Assist Chips */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <CodePlayground
          title="Assist Chips"
          description="Smart action suggestions related to content"
          code={`<Chip
  variant="assist"
  label="Add to calendar"
  leadingIcon={<Ionicons name="calendar" />}
  onPress={() => {}}
/>`}
          preview={
          <View style={styles.chipRow}>
            <Chip
              variant="assist"
              label="Add to calendar"
              leadingIcon={<Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />}
              onPress={() => {}}
            />
            <Chip
              variant="assist"
              label="Set reminder"
              leadingIcon={<Ionicons name="alarm-outline" size={18} color={theme.colors.primary} />}
              onPress={() => {}}
            />
            <Chip
              variant="assist"
              label="Share"
              leadingIcon={<Ionicons name="share-outline" size={18} color={theme.colors.primary} />}
              elevated
              onPress={() => {}}
            />
          </View>
          }
        />
      </Animated.View>

      {/* Filter Chips */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <CodePlayground
          title="Filter Chips"
          description="Filter content with selectable options"
          code={`<Chip
  variant="filter"
  label="React Native"
  selected={selected}
  onPress={() => toggleFilter('react')}
/>`}
          preview={
          <View style={styles.chipRow}>
            <Chip
              variant="filter"
              label="React Native"
              selected={selectedFilters.includes('react')}
              onPress={() => toggleFilter('react')}
            />
            <Chip
              variant="filter"
              label="TypeScript"
              selected={selectedFilters.includes('typescript')}
              onPress={() => toggleFilter('typescript')}
            />
            <Chip
              variant="filter"
              label="Expo"
              selected={selectedFilters.includes('expo')}
              onPress={() => toggleFilter('expo')}
            />
            <Chip
              variant="filter"
              label="Material Design"
              selected={selectedFilters.includes('material')}
              onPress={() => toggleFilter('material')}
            />
          </View>
          }
        />
      </Animated.View>

      {/* Input Chips */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <CodePlayground
          title="Input Chips"
          description="Represent user input as discrete elements"
          code={`<Chip
  variant="input"
  label="john@example.com"
  onClose={() => handleRemove()}
/>`}
          preview={
          <View style={styles.chipRow}>
            <Chip
              variant="input"
              label="john@example.com"
              onClose={() => {}}
            />
            <Chip
              variant="input"
              label="jane@example.com"
              onClose={() => {}}
            />
            <Chip
              variant="input"
              label="+1 more"
              disabled
            />
          </View>
          }
        />
      </Animated.View>

      {/* Suggestion Chips */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <CodePlayground
          title="Suggestion Chips"
          description="Dynamic suggestions based on context"
          code={`<Chip
  variant="suggestion"
  label="Quick reply"
  onPress={() => {}}
/>`}
          preview={
          <View style={styles.chipRow}>
            <Chip variant="suggestion" label="Sounds good!" onPress={() => {}} />
            <Chip variant="suggestion" label="Thanks!" onPress={() => {}} />
            <Chip variant="suggestion" label="See you soon" onPress={() => {}} />
          </View>
          }
        />
      </Animated.View>

      {/* Chip Props */}
      <Animated.View entering={FadeInDown.delay(600).springify()}>
        <PropsTable title="Chip" props={chipProps} />
      </Animated.View>

      {/* Segmented Button Section */}
      <Animated.View entering={FadeInDown.delay(700).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Segmented Button
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Allow users to toggle between related views or make single/multiple selections.
        </Text>
      </Animated.View>

      {/* Single Select */}
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <CodePlayground
          title="Single Select"
          description="Toggle between mutually exclusive options"
          code={`<SegmentedButton
  segments={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
  value={value}
  onValueChange={setValue}
/>`}
          preview={
          <SegmentedButton
            segments={[
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
            ]}
            value={segmentValue}
            onValueChange={(v) => setSegmentValue(v as string)}
          />
          }
        />
      </Animated.View>

      {/* With Icons */}
      <Animated.View entering={FadeInDown.delay(900).springify()}>
        <CodePlayground
          title="With Icons"
          description="Segments with leading icons"
          code={`<SegmentedButton
  segments={[
    { value: 'list', icon: <Ionicons name="list" /> },
    { value: 'grid', icon: <Ionicons name="grid" /> },
  ]}
  value={value}
  onValueChange={setValue}
/>`}
          preview={
          <SegmentedButton
            segments={[
              { value: 'list', label: 'List', icon: <Ionicons name="list" size={18} color={theme.colors.onSurface} /> },
              { value: 'grid', label: 'Grid', icon: <Ionicons name="grid" size={18} color={theme.colors.onSurface} /> },
              { value: 'map', label: 'Map', icon: <Ionicons name="map" size={18} color={theme.colors.onSurface} /> },
            ]}
            value={segmentValue}
            onValueChange={(v) => setSegmentValue(v as string)}
          />
          }
        />
      </Animated.View>

      {/* Multi Select */}
      <Animated.View entering={FadeInDown.delay(1000).springify()}>
        <CodePlayground
          title="Multi Select"
          description="Select multiple options simultaneously"
          code={`<SegmentedButton
  multiSelect
  segments={[
    { value: 'bold', label: 'B' },
    { value: 'italic', label: 'I' },
    { value: 'underline', label: 'U' },
  ]}
  value={values}
  onValueChange={setValues}
/>`}
          preview={
          <SegmentedButton
            multiSelect
            segments={[
              { value: 'bold', label: 'B' },
              { value: 'italic', label: 'I' },
              { value: 'underline', label: 'U' },
              { value: 'strike', label: 'S' },
            ]}
            value={multiSegments}
            onValueChange={(v) => setMultiSegments(v as string[])}
          />
          }
        />
      </Animated.View>

      {/* Segmented Button Props */}
      <Animated.View entering={FadeInDown.delay(1100).springify()}>
        <PropsTable title="SegmentedButton" props={segmentedButtonProps} />
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
