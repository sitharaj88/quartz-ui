import React, { useMemo, useState } from 'react';
import { View, StyleSheet, StatusBar, Pressable } from 'react-native';
import {
  Text,
  Surface,
  Button,
  Card,
  Chip,
  QuartzProvider,
  useTheme,
  useQuartzTheme,
  createDynamicThemes,
  createDynamicColorScheme,
  generateTonalPalette,
} from 'quartz-ui';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HERO_HEIGHT = 160;

const SEED_PRESETS = [
  { name: 'Quartz Violet', color: '#6750A4' },
  { name: 'Ocean Blue', color: '#1A73E8' },
  { name: 'Evergreen', color: '#0F9D58' },
  { name: 'Sunset Coral', color: '#F4511E' },
  { name: 'Raspberry', color: '#D81B60' },
  { name: 'Deep Teal', color: '#00897B' },
];

const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const;

const colorGroups = [
  {
    name: 'Primary',
    colors: ['primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer'],
  },
  {
    name: 'Secondary',
    colors: ['secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer'],
  },
  {
    name: 'Tertiary',
    colors: ['tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer'],
  },
  {
    name: 'Error',
    colors: ['error', 'onError', 'errorContainer', 'onErrorContainer'],
  },
  {
    name: 'Surface',
    colors: ['surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant'],
  },
];

export default function ThemingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { toggleMode, mode } = useQuartzTheme();
  const isDark = mode === 'dark';
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const heroAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT],
      [0, HERO_HEIGHT * 0.4],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.3, 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT * 0.8],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  const statusBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.View 
        style={[
          styles.statusBarBackground, 
          { height: insets.top, backgroundColor: '#d299c2' },
          statusBarStyle
        ]} 
      />
      
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { marginTop: insets.top + 12 }, heroAnimatedStyle]}>
          <LinearGradient
            colors={['#d299c2', '#fef9d7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Ionicons name="color-palette" size={32} color="#333" />
            <Text variant="headlineSmall" style={[styles.headerTitle, { color: '#333' }]}>Theming</Text>
            <Text variant="bodyMedium" style={[styles.headerSubtitle, { color: 'rgba(0,0,0,0.7)' }]}>
              Colors, dark mode & customization
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Theme Toggle */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Section title="Theme Mode" subtitle="Switch between light and dark">
            <Surface style={[styles.themeCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={styles.themeRow}>
                <View style={styles.themeInfo}>
                  <Ionicons 
                    name={isDark ? 'moon' : 'sunny'} 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                  <View style={styles.themeText}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {isDark ? 'Easier on the eyes' : 'Classic appearance'}
                    </Text>
                  </View>
                </View>
                <Button variant="tonal" onPress={toggleMode}>
                  Toggle
                </Button>
              </View>
            </Surface>
          </Section>
        </Animated.View>

        {/* Dynamic Color (Material You) */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Section title="Dynamic Color" subtitle="A complete Material You theme from one seed">
            <DynamicColorShowcase isDark={isDark} />
          </Section>
        </Animated.View>

        {/* Color Palette */}
        {colorGroups.map((group, groupIndex) => (
          <Animated.View 
            key={group.name} 
            entering={FadeInDown.delay(200 + groupIndex * 100).springify()}
          >
            <Section title={group.name} subtitle={`${group.name} color tokens`}>
              <Surface style={[styles.colorCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                <View style={styles.colorGrid}>
                  {group.colors.map((colorKey) => {
                    const color = theme.colors[colorKey as keyof typeof theme.colors];
                    const isLight = isLightColor(color);
                    return (
                      <View key={colorKey} style={styles.colorItem}>
                        <View 
                          style={[
                            styles.colorSwatch, 
                            { backgroundColor: color, borderColor: theme.colors.outline }
                          ]}
                        >
                          <Text 
                            variant="labelSmall" 
                            style={{ color: isLight ? '#000' : '#fff' }}
                          >
                            Aa
                          </Text>
                        </View>
                        <Text 
                          variant="labelSmall" 
                          style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                          numberOfLines={1}
                        >
                          {formatColorName(colorKey)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </Surface>
            </Section>
          </Animated.View>
        ))}

        {/* Elevation */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <Section title="Elevation" subtitle="Surface elevation levels">
            <View style={styles.elevationRow}>
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <Surface 
                  key={level}
                  style={[styles.elevationItem, { backgroundColor: theme.colors.surface }]} 
                  elevation={level as any}
                >
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurface }}>
                    {level}
                  </Text>
                </Surface>
              ))}
            </View>
          </Section>
        </Animated.View>

        {/* Shape */}
        <Animated.View entering={FadeInDown.delay(800).springify()}>
          <Section title="Shape" subtitle="Corner radius tokens">
            <Surface style={[styles.shapeCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={styles.shapeRow}>
                <View style={[styles.shapeItem, { borderRadius: 0, backgroundColor: theme.colors.primaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>None</Text>
                </View>
                <View style={[styles.shapeItem, { borderRadius: 4, backgroundColor: theme.colors.primaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>XS</Text>
                </View>
                <View style={[styles.shapeItem, { borderRadius: 8, backgroundColor: theme.colors.primaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>SM</Text>
                </View>
                <View style={[styles.shapeItem, { borderRadius: 12, backgroundColor: theme.colors.primaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>MD</Text>
                </View>
                <View style={[styles.shapeItem, { borderRadius: 16, backgroundColor: theme.colors.primaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>LG</Text>
                </View>
                <View style={[styles.shapeItem, { borderRadius: 28, backgroundColor: theme.colors.primaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>XL</Text>
                </View>
              </View>
            </Surface>
          </Section>
        </Animated.View>

        {/* Dynamic Color */}
        <Animated.View entering={FadeInDown.delay(900).springify()}>
          <Surface style={[styles.infoCard, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={0}>
            <Ionicons name="sparkles" size={24} color={theme.colors.onTertiaryContainer} />
            <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, marginTop: 8 }}>
              Dynamic Color Built In
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onTertiaryContainer, textAlign: 'center', marginTop: 4 }}>
              createDynamicThemes(seed) generates WCAG-AA verified light and dark themes — all 36 MD3 color roles from a single hex value
            </Text>
          </Surface>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={{ color: theme.colors.onBackground, fontWeight: '600' }}>
        {title}
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
        {subtitle}
      </Text>
      {children}
    </View>
  );
}

/**
 * Interactive Material You showcase: pick a seed color and watch a complete
 * MD3 scheme — tonal palette, color roles, and live components — regenerate.
 * The mini component preview nests a QuartzProvider so real Quartz components
 * render with the generated theme.
 */
function DynamicColorShowcase({ isDark }: { isDark: boolean }) {
  const theme = useTheme();
  const [seed, setSeed] = useState(SEED_PRESETS[0].color);

  const mode = isDark ? 'dark' : 'light';
  const scheme = useMemo(() => createDynamicColorScheme(seed, mode), [seed, mode]);
  const dynamicThemes = useMemo(() => createDynamicThemes(seed), [seed]);
  const tonalPalette = useMemo(() => generateTonalPalette(seed), [seed]);

  const activePreset = SEED_PRESETS.find((p) => p.color === seed) ?? SEED_PRESETS[0];

  const roleSwatches = [
    { label: 'Primary', bg: scheme.primary, fg: scheme.onPrimary },
    { label: 'Primary Container', bg: scheme.primaryContainer, fg: scheme.onPrimaryContainer },
    { label: 'Secondary', bg: scheme.secondary, fg: scheme.onSecondary },
    { label: 'Secondary Container', bg: scheme.secondaryContainer, fg: scheme.onSecondaryContainer },
    { label: 'Tertiary', bg: scheme.tertiary, fg: scheme.onTertiary },
    { label: 'Tertiary Container', bg: scheme.tertiaryContainer, fg: scheme.onTertiaryContainer },
  ];

  return (
    <Surface style={[styles.dynamicCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
      {/* Seed picker */}
      <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
        Seed Color
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
        Tap a swatch to regenerate the entire scheme
      </Text>
      <View style={styles.seedRow}>
        {SEED_PRESETS.map((preset) => {
          const selected = preset.color === seed;
          return (
            <Pressable
              key={preset.color}
              onPress={() => setSeed(preset.color)}
              accessibilityRole="button"
              accessibilityLabel={`Use ${preset.name} as seed color`}
              accessibilityState={{ selected }}
              style={({ pressed }) => [
                styles.seedRing,
                { borderColor: selected ? preset.color : 'transparent' },
                pressed && { transform: [{ scale: 0.92 }] },
              ]}
            >
              <View style={[styles.seedSwatch, { backgroundColor: preset.color }]}>
                {selected && <Ionicons name="checkmark" size={18} color="#fff" />}
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.seedInfo, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={[styles.seedDot, { backgroundColor: seed }]} />
        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {activePreset.name} • {seed.toUpperCase()}
        </Text>
      </View>

      {/* Tonal palette strip */}
      <Animated.View key={`tonal-${seed}`} entering={FadeIn.duration(350)}>
        <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 20 }}>
          Tonal Palette
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2, marginBottom: 10 }}>
          13 Oklab-derived stops from tone 0 to 100
        </Text>
        <View style={styles.tonalStrip}>
          {TONES.map((tone) => (
            <View key={tone} style={[styles.tonalStop, { backgroundColor: tonalPalette[tone] }]} />
          ))}
        </View>
        <View style={styles.tonalLabels}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>0</Text>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>50</Text>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>100</Text>
        </View>
      </Animated.View>

      {/* Generated color roles */}
      <Animated.View key={`roles-${seed}-${mode}`} entering={FadeIn.duration(350)}>
        <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 20 }}>
          Generated Roles ({mode})
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2, marginBottom: 10 }}>
          WCAG-AA verified pairs from createDynamicColorScheme
        </Text>
        <View style={styles.roleGrid}>
          {roleSwatches.map((role) => (
            <View key={role.label} style={[styles.roleSwatch, { backgroundColor: role.bg }]}>
              <Text variant="titleSmall" style={{ color: role.fg, fontWeight: '700' }}>
                Aa
              </Text>
              <Text variant="labelSmall" style={{ color: role.fg, opacity: 0.9 }} numberOfLines={2}>
                {role.label}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Live component preview — real components under a nested provider */}
      <Animated.View key={`preview-${seed}-${mode}`} entering={FadeIn.duration(350)}>
        <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 20 }}>
          Live Preview
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2, marginBottom: 10 }}>
          Real components themed by createDynamicThemes
        </Text>
        <QuartzProvider
          initialMode={mode}
          lightTheme={dynamicThemes.light}
          darkTheme={dynamicThemes.dark}
        >
          <View style={[styles.previewCanvas, { backgroundColor: scheme.surfaceContainerLow }]}>
            <Card variant="elevated" style={styles.previewCard}>
              <View style={styles.previewCardContent}>
                <View style={styles.previewHeader}>
                  <View style={[styles.previewAvatar, { backgroundColor: scheme.primary }]}>
                    <Ionicons name="color-wand" size={20} color={scheme.onPrimary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleSmall" style={{ color: scheme.onSurface, fontWeight: '600' }}>
                      {activePreset.name}
                    </Text>
                    <Text variant="bodySmall" style={{ color: scheme.onSurfaceVariant }}>
                      36 roles from one seed
                    </Text>
                  </View>
                </View>
                <View style={styles.previewChips}>
                  <Chip label="Dynamic" selected onPress={() => {}} />
                  <Chip label="Material You" onPress={() => {}} />
                </View>
                <View style={styles.previewButtons}>
                  <Button variant="filled" onPress={() => {}} style={{ flex: 1 }}>
                    Primary
                  </Button>
                  <Button variant="tonal" onPress={() => {}} style={{ flex: 1 }}>
                    Tonal
                  </Button>
                </View>
              </View>
            </Card>
          </View>
        </QuartzProvider>
      </Animated.View>
    </Surface>
  );
}

function formatColorName(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').trim();
}

function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    marginTop: 8,
  },
  headerSubtitle: {
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  themeCard: {
    padding: 16,
    borderRadius: 16,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeText: {
    gap: 2,
  },
  colorCard: {
    padding: 16,
    borderRadius: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorItem: {
    alignItems: 'center',
    width: '22%',
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  elevationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  elevationItem: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shapeCard: {
    padding: 16,
    borderRadius: 16,
  },
  shapeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  shapeItem: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  // Dynamic Color showcase
  dynamicCard: {
    padding: 20,
    borderRadius: 20,
  },
  seedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  seedRing: {
    borderWidth: 2,
    borderRadius: 26,
    padding: 3,
  },
  seedSwatch: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  seedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tonalStrip: {
    flexDirection: 'row',
    height: 36,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tonalStop: {
    flex: 1,
  },
  tonalLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleSwatch: {
    width: '30.5%',
    flexGrow: 1,
    minHeight: 72,
    borderRadius: 14,
    padding: 10,
    justifyContent: 'space-between',
  },
  previewCanvas: {
    borderRadius: 20,
    padding: 16,
  },
  previewCard: {
    borderRadius: 16,
  },
  previewCardContent: {
    padding: 16,
    gap: 14,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewChips: {
    flexDirection: 'row',
    gap: 8,
  },
  previewButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});
