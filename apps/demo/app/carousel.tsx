/**
 * Quartz UI Demo - Carousel Demo
 *
 * Demonstrates Carousel component layouts with interactive controls
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  Text,
  Button,
  Surface,
  Carousel,
  useTheme,
  Switch,
} from 'quartz-ui';
import type { CarouselItem, CarouselLayout } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DemoLayout, Section } from './_components/DemoLayout';

// Inner content style for carousel items
const itemInnerStyle = {
  flex: 1,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

// Text style for carousel item labels
const carouselItemTextStyle = {
  color: '#fff',
  fontSize: 20,
  fontWeight: '700' as const,
  marginTop: 16,
  textShadowColor: 'rgba(0,0,0,0.3)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 4,
};

// Enhanced carousel items with gradients and icons
const sampleItems: CarouselItem[] = [
  {
    key: '1',
    label: 'Mountain View',
    supportingText: 'Breathtaking alpine scenery',
    content: (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={StyleSheet.absoluteFill}
      >
        <View style={itemInnerStyle}>
          <Ionicons name="mountain" size={64} color="rgba(255,255,255,0.9)" />
          <Text style={carouselItemTextStyle}>Mountain View</Text>
        </View>
      </LinearGradient>
    ),
    accessibilityLabel: 'Mountain landscape image',
  },
  {
    key: '2',
    label: 'Ocean Sunset',
    supportingText: 'Golden hour by the sea',
    content: (
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        style={StyleSheet.absoluteFill}
      >
        <View style={itemInnerStyle}>
          <Ionicons name="water" size={64} color="rgba(255,255,255,0.9)" />
          <Text style={carouselItemTextStyle}>Ocean Sunset</Text>
        </View>
      </LinearGradient>
    ),
    accessibilityLabel: 'Ocean sunset image',
  },
  {
    key: '3',
    label: 'Forest Trail',
    supportingText: 'Peaceful woodland paths',
    content: (
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={StyleSheet.absoluteFill}
      >
        <View style={itemInnerStyle}>
          <Ionicons name="leaf" size={64} color="rgba(255,255,255,0.9)" />
          <Text style={carouselItemTextStyle}>Forest Trail</Text>
        </View>
      </LinearGradient>
    ),
    accessibilityLabel: 'Forest trail image',
  },
  {
    key: '4',
    label: 'Desert Dunes',
    supportingText: 'Endless golden sands',
    content: (
      <LinearGradient
        colors={['#fa709a', '#fee140']}
        style={StyleSheet.absoluteFill}
      >
        <View style={itemInnerStyle}>
          <Ionicons name="sunny" size={64} color="rgba(255,255,255,0.9)" />
          <Text style={carouselItemTextStyle}>Desert Dunes</Text>
        </View>
      </LinearGradient>
    ),
    accessibilityLabel: 'Desert dunes image',
  },
  {
    key: '5',
    label: 'City Lights',
    supportingText: 'Urban nightscape',
    content: (
      <LinearGradient
        colors={['#a18cd1', '#fbc2eb']}
        style={StyleSheet.absoluteFill}
      >
        <View style={itemInnerStyle}>
          <Ionicons name="business" size={64} color="rgba(255,255,255,0.9)" />
          <Text style={carouselItemTextStyle}>City Lights</Text>
        </View>
      </LinearGradient>
    ),
    accessibilityLabel: 'City lights image',
  },
];

export default function CarouselScreen() {
  const theme = useTheme();

  const [selectedLayout, setSelectedLayout] = useState<CarouselLayout>('hero');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIndicators, setShowIndicators] = useState(true);

  const layouts: { value: CarouselLayout; label: string; description: string; icon: string }[] = [
    { value: 'hero', label: 'Hero', description: 'Large centered item', icon: 'star' },
    { value: 'center', label: 'Center', description: 'Centered with preview', icon: 'albums' },
    { value: 'multi-browse', label: 'Multi-browse', description: 'Multiple visible', icon: 'grid' },
    { value: 'uncontained', label: 'Uncontained', description: 'Edge-to-edge', icon: 'expand' },
  ];

  return (
    <DemoLayout
      title="Carousel"
      subtitle="Scrollable content gallery"
      icon="images"
      gradient={['#ee5a24', '#f79f1f']}
    >
      {/* Live Carousel Demo */}
      <Section title="Interactive Demo" subtitle={`${layouts.find(l => l.value === selectedLayout)?.label} Layout`} index={0}>
        <View style={styles.carouselWrapper}>
          <Carousel
            items={sampleItems}
            layout={selectedLayout}
            showIndicators={showIndicators}
            onIndexChange={setCurrentIndex}
            onItemPress={(item, index) => {
              console.log('Pressed item:', item.label, 'at index:', index);
            }}
          />
        </View>

        {/* Current Item Indicator */}
        <View style={[styles.currentIndicator, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons name="image" size={24} color={theme.colors.onPrimaryContainer} />
          <View style={styles.currentIndicatorText}>
            <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}>
              Current Item
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}>
              {currentIndex + 1} of {sampleItems.length}
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600', flex: 1, textAlign: 'right' }}>
            {sampleItems[currentIndex]?.label}
          </Text>
        </View>
      </Section>

      {/* Layout Selection */}
      <Section title="Layout Variants" subtitle="Choose carousel display style" index={1}>
        <View style={styles.layoutGrid}>
          {layouts.map((layout) => (
            <Pressable
              key={layout.value}
              onPress={() => setSelectedLayout(layout.value)}
              style={({ pressed }) => [
                styles.layoutCard,
                {
                  backgroundColor: selectedLayout === layout.value
                    ? theme.colors.primaryContainer
                    : theme.colors.surfaceVariant,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <View style={[
                styles.layoutIcon,
                {
                  backgroundColor: selectedLayout === layout.value
                    ? theme.colors.primary
                    : theme.colors.outline,
                }
              ]}>
                <Ionicons
                  name={layout.icon as any}
                  size={24}
                  color={selectedLayout === layout.value ? '#fff' : theme.colors.onSurface}
                />
              </View>
              <Text
                variant="titleSmall"
                style={{
                  color: selectedLayout === layout.value
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSurface,
                  fontWeight: '600',
                  marginTop: 12,
                }}
              >
                {layout.label}
              </Text>
              <Text
                variant="bodySmall"
                style={{
                  color: selectedLayout === layout.value
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSurfaceVariant,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                {layout.description}
              </Text>
            </Pressable>
          ))}
        </View>
      </Section>

      {/* Options */}
      <Section title="Display Options" subtitle="Customize carousel appearance" index={2}>
        <View style={styles.optionRow}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Page Indicators
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Show dots below carousel
            </Text>
          </View>
          <Switch value={showIndicators} onValueChange={setShowIndicators} />
        </View>
      </Section>

      {/* Features */}
      <Section title="Key Features" subtitle="What makes carousel powerful" index={3}>
        <View style={styles.featureList}>
          {[
            { icon: 'layers', text: 'Four layout variants', color: theme.colors.primary },
            { icon: 'hand-left', text: 'Swipe gesture navigation', color: theme.colors.secondary },
            { icon: 'resize', text: 'Animated scale & opacity', color: theme.colors.tertiary },
            { icon: 'play', text: 'Auto-play support', color: theme.colors.primary },
            { icon: 'repeat', text: 'Infinite loop mode', color: theme.colors.secondary },
            { icon: 'ellipsis-horizontal', text: 'Page indicators', color: theme.colors.tertiary },
            { icon: 'accessibility', text: 'Full a11y support', color: theme.colors.primary },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                <Ionicons name={feature.icon as any} size={20} color={feature.color} />
              </View>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginLeft: 16, flex: 1 }}>
                {feature.text}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      {/* Usage Guidelines */}
      <Section title="Best Use Cases" subtitle="When to use carousel" index={4}>
        <View style={[styles.usageCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <Ionicons name="bulb" size={32} color={theme.colors.onTertiaryContainer} />
          <Text variant="titleMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 16, fontWeight: '600' }}>
            Perfect For
          </Text>
          <View style={styles.usageList}>
            {[
              'Image galleries and media collections',
              'Featured content highlights',
              'Onboarding flows and tutorials',
              'Product showcases and catalogs',
              'Story-style content presentations',
            ].map((item, index) => (
              <View key={index} style={styles.usageItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.onTertiaryContainer} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Section>

      {/* Best Practices */}
      <Section title="Design Tips" subtitle="Carousel best practices" index={5}>
        <View style={[styles.tipsCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <View style={styles.tipHeader}>
            <Ionicons name="information-circle" size={28} color={theme.colors.onSecondaryContainer} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSecondaryContainer, marginLeft: 12, fontWeight: '600' }}>
              Best Practices
            </Text>
          </View>
          <View style={styles.tipsList}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, lineHeight: 22 }}>
              • Keep carousel items consistent in size and style
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, lineHeight: 22 }}>
              • Limit to 5-7 items for optimal user experience
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, lineHeight: 22 }}>
              • Always provide clear navigation indicators
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, lineHeight: 22 }}>
              • Consider auto-play only for promotional content
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, lineHeight: 22 }}>
              • Ensure touch targets are at least 44x44 pixels
            </Text>
          </View>
        </View>
      </Section>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  carouselWrapper: {
    marginVertical: 8,
    marginHorizontal: -20,
  },
  currentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    gap: 12,
  },
  currentIndicatorText: {
    gap: 2,
  },
  layoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  layoutCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  layoutIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usageCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  usageList: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipsCard: {
    padding: 24,
    borderRadius: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
});
