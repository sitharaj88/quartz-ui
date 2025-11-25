import React, { useState } from 'react';
import { View, StyleSheet, Pressable, StatusBar } from 'react-native';
import { Text, Surface, Menu, Tooltip, BottomSheet, useTheme } from 'quartz-ui';
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

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>{title}</Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>{subtitle}</Text>
      {children}
    </View>
  );
}

export default function SurfacesScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

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

  const menuItems = [
    { key: 'edit', label: 'Edit', icon: 'create-outline' },
    { key: 'duplicate', label: 'Duplicate', icon: 'copy-outline' },
    { key: 'share', label: 'Share', icon: 'share-outline' },
    { key: 'delete', label: 'Delete', icon: 'trash-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      <Animated.View 
        style={[
          styles.statusBarBackground, 
          { height: insets.top, backgroundColor: '#84fab0' },
          statusBarStyle
        ]} 
      />
      <Animated.ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={scrollHandler} scrollEventThrottle={16}>
        {/* Header */}
        <Animated.View style={[styles.header, { marginTop: insets.top + 12 }, heroAnimatedStyle]}>
          <LinearGradient
            colors={['#84fab0', '#8fd3f4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.headerGradient, { paddingTop: insets.top + 32 }]}
          >
            <Ionicons name="layers" size={32} color="#333" />
            <Text variant="headlineSmall" style={[styles.headerTitle, { color: '#333' }]}>Surfaces</Text>
            <Text variant="bodyMedium" style={[styles.headerSubtitle, { color: 'rgba(0,0,0,0.7)' }]}>
              Elevation, menus & sheets
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Elevation Levels */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Section title="Elevation" subtitle="Surface depth levels (0-5)">
            <View style={styles.elevationGrid}>
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <Surface 
                  key={level}
                  style={[styles.elevationCard, { backgroundColor: theme.colors.surface }]} 
                  elevation={level as 0 | 1 | 2 | 3 | 4 | 5}
                >
                  <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                    {level}
                  </Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Level {level}
                  </Text>
                </Surface>
              ))}
            </View>
          </Section>
        </Animated.View>

        {/* Surface Variants */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Section title="Surface Colors" subtitle="Container variants">
            <View style={styles.surfaceStack}>
              <Surface style={[styles.surfaceItem, { backgroundColor: theme.colors.surface }]} elevation={0}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>Surface</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Default surface</Text>
              </Surface>
              <Surface style={[styles.surfaceItem, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Surface Variant</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Subtle distinction</Text>
              </Surface>
              <Surface style={[styles.surfaceItem, { backgroundColor: theme.colors.surfaceContainerLowest }]} elevation={0}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>Container Lowest</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Deepest layer</Text>
              </Surface>
              <Surface style={[styles.surfaceItem, { backgroundColor: theme.colors.surfaceContainerHighest }]} elevation={0}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>Container Highest</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Top layer</Text>
              </Surface>
            </View>
          </Section>
        </Animated.View>

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Section title="Menu" subtitle="Contextual actions">
            <Surface style={[styles.menuCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={styles.menuDemo}>
                <View style={styles.menuInfo}>
                  <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>Context Menu</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Shows a list of actions
                  </Text>
                </View>
              </View>
              
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Pressable 
                    style={[styles.menuButton, { backgroundColor: theme.colors.primaryContainer }]}
                    onPress={() => setMenuVisible(true)}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.onPrimaryContainer} />
                  </Pressable>
                }
                items={menuItems.map(item => ({
                  key: item.key,
                  label: item.label,
                  icon: <Ionicons name={item.icon as any} size={20} color={theme.colors.onSurfaceVariant} />,
                }))}
                onSelect={() => setMenuVisible(false)}
              />
            </Surface>
          </Section>
        </Animated.View>

        {/* Tooltip */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Section title="Tooltips" subtitle="Helpful hints on hover/press">
            <Surface style={[styles.tooltipCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={styles.tooltipRow}>
                <Tooltip message="Edit this item">
                  <View style={[styles.tooltipTarget, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Ionicons name="create" size={24} color={theme.colors.onPrimaryContainer} />
                  </View>
                </Tooltip>
                <Tooltip message="Share with others">
                  <View style={[styles.tooltipTarget, { backgroundColor: theme.colors.secondaryContainer }]}>
                    <Ionicons name="share" size={24} color={theme.colors.onSecondaryContainer} />
                  </View>
                </Tooltip>
                <Tooltip message="Add to favorites">
                  <View style={[styles.tooltipTarget, { backgroundColor: theme.colors.tertiaryContainer }]}>
                    <Ionicons name="heart" size={24} color={theme.colors.onTertiaryContainer} />
                  </View>
                </Tooltip>
                <Tooltip message="More options">
                  <View style={[styles.tooltipTarget, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.onSurfaceVariant} />
                  </View>
                </Tooltip>
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 12 }}>
                Long press icons to see tooltips
              </Text>
            </Surface>
          </Section>
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Section title="Bottom Sheet" subtitle="Modal panel from bottom">
            <Pressable onPress={() => setBottomSheetVisible(true)}>
              <Surface style={[styles.bottomSheetTrigger, { backgroundColor: theme.colors.surface }]} elevation={1}>
                <View style={[styles.sheetIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Ionicons name="chevron-up" size={24} color={theme.colors.onPrimaryContainer} />
                </View>
                <View style={styles.sheetInfo}>
                  <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>Open Bottom Sheet</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Tap to show modal sheet
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
              </Surface>
            </Pressable>
          </Section>
        </Animated.View>

        {/* Design Tips */}
        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Section title="Best Practices" subtitle="Surface guidelines">
            <View style={styles.tipsGrid}>
              <Surface style={[styles.tipCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
                <Ionicons name="layers" size={20} color={theme.colors.onPrimaryContainer} />
                <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 8, textAlign: 'center' }}>
                  Use elevation sparingly
                </Text>
              </Surface>
              <Surface style={[styles.tipCard, { backgroundColor: theme.colors.secondaryContainer }]} elevation={0}>
                <Ionicons name="contrast" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer, marginTop: 8, textAlign: 'center' }}>
                  Ensure contrast
                </Text>
              </Surface>
              <Surface style={[styles.tipCard, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={0}>
                <Ionicons name="grid" size={20} color={theme.colors.onTertiaryContainer} />
                <Text variant="labelMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 8, textAlign: 'center' }}>
                  Consistent hierarchy
                </Text>
              </Surface>
              <Surface style={[styles.tipCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
                <Ionicons name="moon" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                  Test in dark mode
                </Text>
              </Surface>
            </View>
          </Section>
        </Animated.View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Bottom Sheet */}
      <BottomSheet
        visible={bottomSheetVisible}
        onDismiss={() => setBottomSheetVisible(false)}
      >
        <View style={styles.bottomSheetContent}>
          <View style={[styles.handle, { backgroundColor: theme.colors.outline }]} />
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
            Bottom Sheet
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
            This is a modal bottom sheet. It slides up from the bottom and can contain any content.
          </Text>
          
          <View style={styles.sheetActions}>
            {[
              { icon: 'share-outline', label: 'Share' },
              { icon: 'link-outline', label: 'Get Link' },
              { icon: 'download-outline', label: 'Download' },
              { icon: 'trash-outline', label: 'Delete' },
            ].map((action) => (
              <Pressable 
                key={action.label}
                style={styles.sheetAction}
                onPress={() => setBottomSheetVisible(false)}
              >
                <View style={[styles.sheetActionIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Ionicons name={action.icon as any} size={20} color={theme.colors.onPrimaryContainer} />
                </View>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurface }}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </BottomSheet>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerGradient: {
    padding: 32,
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 12,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  elevationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  elevationCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surfaceStack: {
    gap: 12,
  },
  surfaceItem: {
    padding: 16,
    borderRadius: 12,
  },
  menuCard: {
    borderRadius: 16,
    padding: 16,
  },
  menuDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuInfo: {
    flex: 1,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipCard: {
    borderRadius: 16,
    padding: 20,
  },
  tooltipRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tooltipTarget: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetTrigger: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tipCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bottomSheetContent: {
    padding: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sheetAction: {
    alignItems: 'center',
    gap: 8,
  },
  sheetActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
