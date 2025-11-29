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

  // Round slider values to avoid long decimals
  const handleVolumeChange = (value: number) => setVolume(Math.round(value));
  const handleBrightnessChange = (value: number) => setBrightness(Math.round(value));
  const handleTemperatureChange = (value: number) => setTemperature(Math.round(value));
  const handleRatingChange = (value: number) => setRating(Math.round(value));

  // Create carousel items with content
  const heroItems = [
    {
      key: '1',
      content: (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name="triangle-outline" size={48} color="rgba(255,255,255,0.9)" style={{ marginBottom: 12 }} />
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
          <Ionicons name="water-outline" size={48} color="rgba(255,255,255,0.9)" style={{ marginBottom: 12 }} />
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
          <Ionicons name="sunny-outline" size={48} color="rgba(255,255,255,0.9)" style={{ marginBottom: 12 }} />
          <Text variant="displaySmall" style={styles.heroTitle}>Desert Dreams</Text>
          <Text variant="titleMedium" style={styles.heroSubtitle}>Golden horizons</Text>
        </LinearGradient>
      ),
      label: 'Desert',
    },
    {
      key: '4',
      content: (
        <LinearGradient colors={['#c33764', '#1d2671']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name="snow-outline" size={48} color="rgba(255,255,255,0.9)" style={{ marginBottom: 12 }} />
          <Text variant="displaySmall" style={styles.heroTitle}>Arctic Expedition</Text>
          <Text variant="titleMedium" style={styles.heroSubtitle}>Frozen wonderland</Text>
        </LinearGradient>
      ),
      label: 'Arctic',
    },
  ];

  const productItems = [
    {
      key: 'p1',
      content: (
        <Surface elevation={2} style={[styles.productCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.productImage, { backgroundColor: theme.colors.primaryContainer }]}>
            <Ionicons name="headset" size={48} color={theme.colors.onPrimaryContainer} />
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 12 }}>Wireless Headphones</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Premium sound quality</Text>
          <Text variant="titleLarge" style={{ color: theme.colors.primary, marginTop: 8, fontWeight: '700' }}>$199</Text>
        </Surface>
      ),
    },
    {
      key: 'p2',
      content: (
        <Surface elevation={2} style={[styles.productCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.productImage, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Ionicons name="watch" size={48} color={theme.colors.onSecondaryContainer} />
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 12 }}>Smart Watch</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Track your fitness</Text>
          <Text variant="titleLarge" style={{ color: theme.colors.primary, marginTop: 8, fontWeight: '700' }}>$299</Text>
        </Surface>
      ),
    },
    {
      key: 'p3',
      content: (
        <Surface elevation={2} style={[styles.productCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.productImage, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Ionicons name="camera" size={48} color={theme.colors.onTertiaryContainer} />
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 12 }}>Digital Camera</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Capture moments</Text>
          <Text variant="titleLarge" style={{ color: theme.colors.primary, marginTop: 8, fontWeight: '700' }}>$899</Text>
        </Surface>
      ),
    },
    {
      key: 'p4',
      content: (
        <Surface elevation={2} style={[styles.productCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.productImage, { backgroundColor: theme.colors.errorContainer }]}>
            <Ionicons name="laptop" size={48} color={theme.colors.onErrorContainer} />
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 12 }}>Laptop Pro</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Power and portability</Text>
          <Text variant="titleLarge" style={{ color: theme.colors.primary, marginTop: 8, fontWeight: '700' }}>$1,499</Text>
        </Surface>
      ),
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
          description="Full-width hero carousel with auto-play and loop"
          code={`<Carousel
  layout="hero"
  items={[
    { key: '1', content: <Card>...</Card>, label: 'First' },
    { key: '2', content: <Card>...</Card>, label: 'Second' },
  ]}
  showIndicators
  autoPlayInterval={3000}
  loop
  onIndexChange={setCurrentIndex}
/>`}
          preview={
            <View style={styles.carouselContainer}>
              <Carousel
                layout="hero"
                items={heroItems}
                onIndexChange={setCurrentIndex}
                showIndicators
                autoPlayInterval={3000}
                loop
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Slide {currentIndex + 1} of {heroItems.length}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Ionicons name="infinite" size={14} color={theme.colors.onPrimaryContainer} />
                    <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 4 }}>Loop</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: theme.colors.secondaryContainer }]}>
                    <Ionicons name="play" size={14} color={theme.colors.onSecondaryContainer} />
                    <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer, marginLeft: 4 }}>Auto</Text>
                  </View>
                </View>
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Multi-browse Carousel */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <CodePlayground
          title="Multi-browse Carousel"
          description="Browse multiple items at once - perfect for product catalogs"
          code={`<Carousel
  layout="multi-browse"
  items={productItems}
  itemWidth={180}
  gap={12}
  showIndicators={false}
/>`}
          preview={
            <View style={{ width: '100%' }}>
              <Carousel
                layout="multi-browse"
                items={productItems}
                itemWidth={180}
                gap={12}
                showIndicators={false}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8 }}>
                <Ionicons name="chevron-back" size={16} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Swipe to browse {productItems.length} products
                </Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.onSurfaceVariant} />
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Center Carousel */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <CodePlayground
          title="Center Carousel"
          description="Centered item with preview of adjacent items"
          code={`<Carousel
  layout="center"
  items={items}
  showIndicators
  indicatorPosition="outside"
/>`}
          preview={
            <View style={styles.carouselContainer}>
              <Carousel
                layout="center"
                items={heroItems.slice(0, 3)}
                showIndicators
                indicatorPosition="outside"
              />
            </View>
          }
        />
      </Animated.View>

      {/* Carousel Props */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <PropsTable title="Carousel" props={carouselProps} />
      </Animated.View>

      {/* Slider Section */}
      <Animated.View entering={FadeInDown.delay(600).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Slider
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Sliders allow users to select a value from a continuous or discrete range by moving a thumb control along a track.
        </Text>
      </Animated.View>

      {/* All Slider Examples */}
      <Animated.View entering={FadeInDown.delay(650).springify()}>
        <CodePlayground
          title="Common Use Cases"
          description="Real-world slider applications for settings and controls"
          code={`// Volume Control
<Slider value={volume} onValueChange={setVolume} min={0} max={100} />

// Brightness Control
<Slider value={brightness} onValueChange={setBrightness} min={0} max={100} showLabel />

// Temperature Control
<Slider value={temp} onValueChange={setTemp} min={16} max={30} step={1} />

// Star Rating
<Slider value={rating} onValueChange={setRating} min={1} max={5} step={1} />`}
          preview={
            <Surface elevation={1} style={[{ backgroundColor: theme.colors.surfaceContainerLow, padding: 24, borderRadius: 16, gap: 24, maxWidth: 600, alignSelf: 'center', width: '100%' }]}>
              {/* Volume */}
              <View>
                <View style={styles.sliderHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="volume-high" size={20} color={theme.colors.primary} />
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Volume</Text>
                  </View>
                  <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>{volume}%</Text>
                </View>
                <Slider value={volume} onValueChange={handleVolumeChange} min={0} max={100} />
              </View>

              {/* Brightness */}
              <View>
                <View style={styles.sliderHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="sunny" size={20} color={theme.colors.secondary} />
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Brightness</Text>
                  </View>
                  <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>{brightness}%</Text>
                </View>
                <Slider value={brightness} onValueChange={handleBrightnessChange} min={0} max={100} showLabel />
              </View>

              {/* Temperature */}
              <View>
                <View style={styles.sliderHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="thermometer" size={20} color={theme.colors.tertiary} />
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Temperature</Text>
                  </View>
                  <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>{temperature}°C</Text>
                </View>
                <Slider value={temperature} onValueChange={handleTemperatureChange} min={16} max={30} step={1} />
              </View>

              {/* Rating */}
              <View>
                <View style={styles.sliderHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="star" size={20} color={theme.colors.primary} />
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Rating</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={18}
                        color={star <= rating ? theme.colors.primary : theme.colors.onSurfaceVariant}
                      />
                    ))}
                  </View>
                </View>
                <Slider value={rating} onValueChange={handleRatingChange} min={1} max={5} step={1} />
              </View>
            </Surface>
          }
        />
      </Animated.View>

      {/* Continuous Slider */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
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
            <View style={[styles.sliderDemo, { maxWidth: 500, alignSelf: 'center', width: '100%' }]}>
              <View style={styles.sliderHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Volume</Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>{volume}%</Text>
              </View>
              <View style={styles.sliderRow}>
                <Ionicons name="volume-low" size={20} color={theme.colors.onSurfaceVariant} />
                <View style={styles.sliderContainer}>
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
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
      <Animated.View entering={FadeInDown.delay(750).springify()}>
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
            <View style={[styles.sliderDemo, { maxWidth: 500, alignSelf: 'center', width: '100%' }]}>
              <View style={styles.sliderHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Brightness</Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>{brightness}%</Text>
              </View>
              <View style={styles.sliderRow}>
                <Ionicons name="sunny-outline" size={20} color={theme.colors.onSurfaceVariant} />
                <View style={styles.sliderContainer}>
                  <Slider
                    value={brightness}
                    onValueChange={handleBrightnessChange}
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
      <Animated.View entering={FadeInDown.delay(800).springify()}>
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
            <View style={[styles.sliderDemo, { maxWidth: 500, alignSelf: 'center', width: '100%' }]}>
              <View style={styles.sliderHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Temperature</Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>{temperature}°C</Text>
              </View>
              <View style={styles.sliderRow}>
                <Ionicons name="snow" size={20} color={theme.colors.onSurfaceVariant} />
                <View style={styles.sliderContainer}>
                  <Slider
                    value={temperature}
                    onValueChange={handleTemperatureChange}
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
      <Animated.View entering={FadeInDown.delay(850).springify()}>
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
            <View style={[styles.sliderDemo, { maxWidth: 500, alignSelf: 'center', width: '100%' }]}>
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
                  onValueChange={handleRatingChange}
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

      {/* Best Practices */}
      <Animated.View entering={FadeInDown.delay(1000).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Usage Guidelines
        </Text>

        <Surface elevation={1} style={[{ backgroundColor: theme.colors.surfaceContainerLow, padding: 20, borderRadius: 16, marginTop: 16 }]}>
          <View style={{ gap: 20 }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Ionicons name="images" size={18} color={theme.colors.onPrimaryContainer} />
                </View>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>Carousel Best Practices</Text>
              </View>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
                • Use <Text style={{ fontWeight: '600' }}>hero layout</Text> for featured content and main promotions{'\n'}
                • Use <Text style={{ fontWeight: '600' }}>multi-browse layout</Text> for product catalogs and galleries{'\n'}
                • Enable <Text style={{ fontWeight: '600' }}>auto-play</Text> sparingly - only for non-critical content{'\n'}
                • Always provide <Text style={{ fontWeight: '600' }}>indicators</Text> so users know their position{'\n'}
                • Keep carousel items to 3-7 for optimal user experience
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: theme.colors.outlineVariant }} />

            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <View style={[styles.badge, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Ionicons name="options" size={18} color={theme.colors.onSecondaryContainer} />
                </View>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>Slider Best Practices</Text>
              </View>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
                • Use <Text style={{ fontWeight: '600' }}>continuous sliders</Text> for volume, brightness, and percentages{'\n'}
                • Use <Text style={{ fontWeight: '600' }}>discrete sliders</Text> (with steps) for ratings and temperature{'\n'}
                • Show the current value alongside the slider for clarity{'\n'}
                • Use <Text style={{ fontWeight: '600' }}>showLabel</Text> for precise value selection{'\n'}
                • Provide visual feedback with icons (e.g., volume-low/high)
              </Text>
            </View>
          </View>
        </Surface>
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
    marginHorizontal: -20,
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 180,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
