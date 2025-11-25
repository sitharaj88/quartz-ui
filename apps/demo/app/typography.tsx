import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Text, Surface, useTheme } from 'quartz-ui';
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

const typeScale = [
  { variant: 'displayLarge', label: 'Display Large', size: '57/64' },
  { variant: 'displayMedium', label: 'Display Medium', size: '45/52' },
  { variant: 'displaySmall', label: 'Display Small', size: '36/44' },
  { variant: 'headlineLarge', label: 'Headline Large', size: '32/40' },
  { variant: 'headlineMedium', label: 'Headline Medium', size: '28/36' },
  { variant: 'headlineSmall', label: 'Headline Small', size: '24/32' },
  { variant: 'titleLarge', label: 'Title Large', size: '22/28' },
  { variant: 'titleMedium', label: 'Title Medium', size: '16/24' },
  { variant: 'titleSmall', label: 'Title Small', size: '14/20' },
  { variant: 'bodyLarge', label: 'Body Large', size: '16/24' },
  { variant: 'bodyMedium', label: 'Body Medium', size: '14/20' },
  { variant: 'bodySmall', label: 'Body Small', size: '12/16' },
  { variant: 'labelLarge', label: 'Label Large', size: '14/20' },
  { variant: 'labelMedium', label: 'Label Medium', size: '12/16' },
  { variant: 'labelSmall', label: 'Label Small', size: '11/16' },
] as const;

export default function TypographyScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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
          { height: insets.top, backgroundColor: '#a8edea' },
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
            colors={['#a8edea', '#fed6e3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Ionicons name="text" size={32} color="#333" />
            <Text variant="headlineSmall" style={[styles.headerTitle, { color: '#333' }]}>Typography</Text>
            <Text variant="bodyMedium" style={[styles.headerSubtitle, { color: 'rgba(0,0,0,0.7)' }]}>
              Complete type scale
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Display Styles */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Section title="Display" subtitle="Large headlines for hero sections">
            <Surface style={[styles.demoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              {typeScale.slice(0, 3).map((item, index) => (
                <View key={item.variant} style={[styles.typeRow, index > 0 && styles.typeRowBorder]}>
                  <View style={styles.typeInfo}>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                      {item.label}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {item.size}
                    </Text>
                  </View>
                  <Text variant={item.variant} style={{ color: theme.colors.onSurface }} numberOfLines={1}>
                    Aa
                  </Text>
                </View>
              ))}
            </Surface>
          </Section>
        </Animated.View>

        {/* Headline Styles */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Section title="Headline" subtitle="Section headers and titles">
            <Surface style={[styles.demoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              {typeScale.slice(3, 6).map((item, index) => (
                <View key={item.variant} style={[styles.typeRow, index > 0 && styles.typeRowBorder]}>
                  <View style={styles.typeInfo}>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                      {item.label}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {item.size}
                    </Text>
                  </View>
                  <Text variant={item.variant} style={{ color: theme.colors.onSurface }}>
                    Headline
                  </Text>
                </View>
              ))}
            </Surface>
          </Section>
        </Animated.View>

        {/* Title Styles */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Section title="Title" subtitle="Card titles and list headers">
            <Surface style={[styles.demoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              {typeScale.slice(6, 9).map((item, index) => (
                <View key={item.variant} style={[styles.typeRow, index > 0 && styles.typeRowBorder]}>
                  <View style={styles.typeInfo}>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                      {item.label}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {item.size}
                    </Text>
                  </View>
                  <Text variant={item.variant} style={{ color: theme.colors.onSurface }}>
                    Title Style
                  </Text>
                </View>
              ))}
            </Surface>
          </Section>
        </Animated.View>

        {/* Body Styles */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Section title="Body" subtitle="Primary content text">
            <Surface style={[styles.demoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              {typeScale.slice(9, 12).map((item, index) => (
                <View key={item.variant} style={[styles.typeRow, index > 0 && styles.typeRowBorder]}>
                  <View style={styles.typeInfo}>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                      {item.label}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {item.size}
                    </Text>
                  </View>
                  <Text variant={item.variant} style={{ color: theme.colors.onSurface, flex: 1 }} numberOfLines={1}>
                    Body text for content
                  </Text>
                </View>
              ))}
            </Surface>
          </Section>
        </Animated.View>

        {/* Label Styles */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Section title="Label" subtitle="Buttons and navigation">
            <Surface style={[styles.demoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              {typeScale.slice(12, 15).map((item, index) => (
                <View key={item.variant} style={[styles.typeRow, index > 0 && styles.typeRowBorder]}>
                  <View style={styles.typeInfo}>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                      {item.label}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {item.size}
                    </Text>
                  </View>
                  <Text variant={item.variant} style={{ color: theme.colors.onSurface }}>
                    LABEL TEXT
                  </Text>
                </View>
              ))}
            </Surface>
          </Section>
        </Animated.View>

        {/* Example Usage */}
        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Section title="Example Usage" subtitle="Typography in context">
            <Surface style={[styles.exampleCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                Welcome to Quartz UI
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                A comprehensive component library for React Native applications.
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
                Build beautiful, accessible, and performant mobile apps with our carefully crafted components.
              </Text>
              <View style={styles.tagRow}>
                <View style={[styles.tag, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>
                    React Native
                  </Text>
                </View>
                <View style={[styles.tag, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer }}>
                    Modern Design
                  </Text>
                </View>
              </View>
            </Surface>
          </Section>
        </Animated.View>

        {/* Reference */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <Surface style={[styles.referenceCard, { backgroundColor: theme.colors.secondaryContainer }]} elevation={0}>
            <Ionicons name="information-circle" size={24} color={theme.colors.onSecondaryContainer} />
            <Text variant="titleSmall" style={{ color: theme.colors.onSecondaryContainer, marginTop: 8 }}>
              Font Reference
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer, textAlign: 'center', marginTop: 4 }}>
              Size format: fontSize/lineHeight in sp{'\n'}
              Using system fonts with MD3 type scale
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
  demoCard: {
    padding: 16,
    borderRadius: 16,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  typeRowBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  typeInfo: {
    gap: 2,
  },
  exampleCard: {
    padding: 20,
    borderRadius: 16,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  referenceCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
});
