import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Carousel, Slider, useTheme, Surface } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const carouselProps: PropDefinition[] = [
  {
    name: 'items',
    type: 'CarouselItem[]',
    description: 'Array of items to display in the carousel',
  },
  {
    name: 'layout',
    type: "'hero' | 'center' | 'multi-browse' | 'uncontained'",
    default: "'hero'",
    description: 'Carousel layout variant',
  },
  {
    name: 'autoPlayInterval',
    type: 'number',
    default: '0',
    description: 'Auto-play interval in ms (0 to disable)',
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'Enable infinite looping',
  },
  {
    name: 'itemWidth',
    type: 'number',
    description: 'Item width (for multi-browse layout)',
  },
  {
    name: 'gap',
    type: 'number',
    description: 'Gap between items',
  },
  {
    name: 'showIndicators',
    type: 'boolean',
    default: 'true',
    description: 'Show pagination indicators',
  },
  {
    name: 'indicatorPosition',
    type: "'inside' | 'outside'",
    default: "'inside'",
    description: 'Position of pagination indicators',
  },
  {
    name: 'onIndexChange',
    type: '(index: number) => void',
    description: 'Callback when active index changes',
  },
  {
    name: 'onItemPress',
    type: '(item: CarouselItem, index: number) => void',
    description: 'Callback when item is pressed',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

const sliderProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'number',
    description: 'Current slider value',
  },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Callback when value changes',
  },
  {
    name: 'min',
    type: 'number',
    default: '0',
    description: 'Minimum slider value',
  },
  {
    name: 'max',
    type: 'number',
    default: '100',
    description: 'Maximum slider value',
  },
  {
    name: 'step',
    type: 'number',
    description: 'Step increment for discrete slider',
  },
  {
    name: 'onSlidingComplete',
    type: '(value: number) => void',
    description: 'Callback when sliding ends',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the slider',
  },
  {
    name: 'showLabel',
    type: 'boolean',
    default: 'true',
    description: 'Show value label above thumb while sliding',
  },
  {
    name: 'color',
    type: 'string',
    description: 'Custom color for the slider track',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

export default function CarouselSliderDocPage() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(70);
  const [temperature, setTemperature] = useState(22);
  const [rating, setRating] = useState(3);

  // Create carousel items with content
  const heroItems = [
    {
      key: '1',
      content: (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text variant="displaySmall" style={styles.heroTitle}>Mountain Adventure</Text>
          <Text variant="titleMedium" style={styles.heroSubtitle}>Explore the peaks</Text>
        </LinearGradient>
      ),
      label: 'Mountain',
    },
    {
      key: '2',
      content: (
        <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text variant="displaySmall" style={styles.heroTitle}>Ocean Paradise</Text>
          <Text variant="titleMedium" style={styles.heroSubtitle}>Dive into beauty</Text>
        </LinearGradient>
      ),
      label: 'Ocean',
    },
    {
      key: '3',
      content: (
        <LinearGradient colors={['#F2994A', '#F2C94C']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text variant="displaySmall" style={styles.heroTitle}>Desert Dreams</Text>
          <Text variant="titleMedium" style={styles.heroSubtitle}>Golden horizons</Text>
        </LinearGradient>
      ),
      label: 'Desert',
    },
  ];

  return (
    <DocLayout
      title="Carousel & Slider"
      description="Components for displaying content sequences and selecting values from ranges"
    >
      {/* Carousel Section */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Carousel
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Carousels display a sequence of content items that users can browse horizontally with swipe gestures or navigation controls.
        </Text>
      </Animated.View>

      {/* Hero Carousel */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <CodePlayground
          title="Hero Carousel"
          description="Full-width single item carousel"
          code={`<Carousel
  layout="hero"
  items={[
    { key: '1', content: <Card>...</Card>, label: 'First' },
    { key: '2', content: <Card>...</Card>, label: 'Second' },
  ]}
  showIndicators
  onIndexChange={setCurrentIndex}
/>`}
          preview={
            <View style={styles.carouselContainer}>
              <Carousel
                layout="hero"
                items={heroItems}
                onIndexChange={setCurrentIndex}
                showIndicators
              />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                Current slide: {currentIndex + 1} of {heroItems.length}
              </Text>
            </View>
          }
        />
      </Animated.View>

      {/* Carousel Props */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <PropsTable title="Carousel" props={carouselProps} />
      </Animated.View>

      {/* Slider Section */}
      <Animated.View entering={FadeInDown.delay(400).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Slider
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Sliders allow users to select a value from a continuous or discrete range by moving a thumb control along a track.
        </Text>
      </Animated.View>

      {/* Continuous Slider */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <CodePlayground
          title="Continuous Slider"
          description="Smooth value selection"
          code={`<Slider
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
/>`}
          preview={
            <View style={styles.sliderDemo}>
              <View style={styles.sliderHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Volume</Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>{volume}%</Text>
              </View>
              <View style={styles.sliderRow}>
                <Ionicons name="volume-low" size={20} color={theme.colors.onSurfaceVariant} />
                <View style={styles.sliderContainer}>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    min={0}
                    max={100}
                  />
                </View>
                <Ionicons name="volume-high" size={20} color={theme.colors.onSurfaceVariant} />
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Slider with Label */}
      <Animated.View entering={FadeInDown.delay(600).springify()}>
        <CodePlayground
          title="With Value Label"
          description="Show current value above thumb"
          code={`<Slider
  value={brightness}
  onValueChange={setBrightness}
  min={0}
  max={100}
  showLabel
/>`}
          preview={
            <View style={styles.sliderDemo}>
              <View style={styles.sliderHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Brightness</Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>{brightness}%</Text>
              </View>
              <View style={styles.sliderRow}>
                <Ionicons name="sunny-outline" size={20} color={theme.colors.onSurfaceVariant} />
                <View style={styles.sliderContainer}>
                  <Slider
                    value={brightness}
                    onValueChange={setBrightness}
                    min={0}
                    max={100}
                    showLabel
                  />
                </View>
                <Ionicons name="sunny" size={20} color={theme.colors.onSurfaceVariant} />
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Discrete Slider */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
        <CodePlayground
          title="Discrete Slider"
          description="Slider with step marks"
          code={`<Slider
  value={temperature}
  onValueChange={setTemperature}
  min={16}
  max={30}
  step={1}
/>`}
          preview={
            <View style={styles.sliderDemo}>
              <View style={styles.sliderHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Temperature</Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>{temperature}°C</Text>
              </View>
              <View style={styles.sliderRow}>
                <Ionicons name="snow" size={20} color={theme.colors.onSurfaceVariant} />
                <View style={styles.sliderContainer}>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    min={16}
                    max={30}
                    step={1}
                  />
                </View>
                <Ionicons name="flame" size={20} color={theme.colors.onSurfaceVariant} />
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Rating Slider */}
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <CodePlayground
          title="Rating Slider"
          description="Discrete slider for ratings"
          code={`<Slider
  value={rating}
  onValueChange={setRating}
  min={1}
  max={5}
  step={1}
/>`}
          preview={
            <View style={styles.sliderDemo}>
              <View style={styles.sliderHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Rating</Text>
                <View style={{ flexDirection: 'row' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={20}
                      color={star <= rating ? theme.colors.primary : theme.colors.onSurfaceVariant}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.sliderContainer}>
                <Slider
                  value={rating}
                  onValueChange={setRating}
                  min={1}
                  max={5}
                  step={1}
                />
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Slider Props */}
      <Animated.View entering={FadeInDown.delay(900).springify()}>
        <PropsTable title="Slider" props={sliderProps} />
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
  carouselContainer: {
    marginVertical: 8,
  },
  heroCard: {
    height: 200,
    borderRadius: 16,
    justifyContent: 'flex-end',
    padding: 24,
  },
  heroTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  sliderDemo: {
    paddingVertical: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderContainer: {
    flex: 1,
  },
});
