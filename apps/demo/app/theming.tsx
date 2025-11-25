import React, { useState } from 'react';
import { View, StyleSheet, Pressable, StatusBar } from 'react-native';
import { Text, Surface, Button, useTheme, useQuartzTheme } from 'quartz-ui';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
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
              Dynamic Color Ready
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onTertiaryContainer, textAlign: 'center', marginTop: 4 }}>
              Quartz UI supports dynamic color extraction from wallpaper on Android 12+
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
});
