/**
 * Quartz UI Demo - Navigation Rail Demo
 *
 * Demonstrates NavigationRail component with interactive controls
 */

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import {
  Text,
  Button,
  Surface,
  NavigationRail,
  useTheme,
  Switch,
} from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

export default function NavigationRailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedKey, setSelectedKey] = useState('home');
  const [labelType, setLabelType] = useState<'all' | 'selected' | 'none'>('all');
  const [showFab, setShowFab] = useState(true);

  const destinations = [
    {
      key: 'home',
      icon: <Ionicons name="home-outline" size={24} />,
      selectedIcon: <Ionicons name="home" size={24} />,
      label: 'Home',
    },
    {
      key: 'search',
      icon: <Ionicons name="search-outline" size={24} />,
      selectedIcon: <Ionicons name="search" size={24} />,
      label: 'Search',
      badge: 'New',
    },
    {
      key: 'favorites',
      icon: <Ionicons name="heart-outline" size={24} />,
      selectedIcon: <Ionicons name="heart" size={24} />,
      label: 'Favorites',
    },
    {
      key: 'profile',
      icon: <Ionicons name="person-outline" size={24} />,
      selectedIcon: <Ionicons name="person" size={24} />,
      label: 'Profile',
      badge: 5,
    },
    {
      key: 'settings',
      icon: <Ionicons name="settings-outline" size={24} />,
      selectedIcon: <Ionicons name="settings" size={24} />,
      label: 'Settings',
    },
  ];

  const getContentTitle = () => {
    const dest = destinations.find(d => d.key === selectedKey);
    return dest?.label || 'Home';
  };

  const getContentIcon = () => {
    const dest = destinations.find(d => d.key === selectedKey);
    return dest?.key || 'home';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      {/* Navigation Rail */}
      <NavigationRail
        destinations={destinations}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        labelType={labelType}
        fab={showFab ? {
          icon: <Ionicons name="add" size={24} />,
          onPress: () => {},
        } : undefined}
        header={
          <View style={styles.railHeader}>
            <Button
              variant="text"
              onPress={() => router.back()}
              icon={<Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />}
            />
          </View>
        }
      />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Enhanced Header with Gradient */}
        <Animated.View entering={FadeInRight.delay(100)}>
          <LinearGradient
            colors={['#10ac84', '#1dd1a1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerIconContainer}>
                <Ionicons name={getContentIcon()} size={32} color="#fff" />
              </View>
              <View style={styles.headerText}>
                <Text variant="headlineMedium" style={styles.headerTitle}>
                  {getContentTitle()}
                </Text>
                <Text variant="bodyMedium" style={styles.headerSubtitle}>
                  Navigation Rail Demo
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Interactive Controls Section */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <Surface style={[styles.controlCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <View style={styles.cardHeader}>
                <Ionicons name="options" size={24} color={theme.colors.primary} />
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginLeft: 12, fontWeight: '700' }}>
                  Interactive Controls
                </Text>
              </View>

              {/* Label Type Selection */}
              <View style={styles.controlSection}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 12 }}>
                  Label Display Mode
                </Text>
                <View style={styles.buttonRow}>
                  {(['all', 'selected', 'none'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={labelType === type ? 'filled' : 'outlined'}
                      size="medium"
                      onPress={() => setLabelType(type)}
                      style={styles.optionButton}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </View>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                  Current: Showing labels {labelType === 'all' ? 'for all items' : labelType === 'selected' ? 'only for selected item' : 'for none'}
                </Text>
              </View>

              {/* FAB Toggle */}
              <View style={styles.controlSection}>
                <View style={styles.toggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      Floating Action Button
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                      Toggle FAB visibility in the rail
                    </Text>
                  </View>
                  <Switch value={showFab} onValueChange={setShowFab} />
                </View>
              </View>
            </Surface>
          </Animated.View>

          {/* About Section */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Surface style={[styles.infoCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
              <Ionicons name="information-circle" size={32} color={theme.colors.onPrimaryContainer} />
              <Text variant="titleLarge" style={{ color: theme.colors.onPrimaryContainer, marginTop: 16, fontWeight: '700' }}>
                About Navigation Rail
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.onPrimaryContainer, marginTop: 12, lineHeight: 24, textAlign: 'center' }}>
                Navigation rails provide ergonomic access to primary destinations in apps.
                They're best suited for tablets and desktop screens with more horizontal space.
              </Text>
            </Surface>
          </Animated.View>

          {/* Features List */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <Surface style={[styles.featureCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <View style={styles.cardHeader}>
                <Ionicons name="star" size={24} color={theme.colors.secondary} />
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginLeft: 12, fontWeight: '700' }}>
                  Key Features
                </Text>
              </View>
              <View style={styles.featureList}>
                {[
                  { icon: 'add-circle', text: 'Optional FAB placement at top' },
                  { icon: 'notifications', text: 'Badge support on navigation items' },
                  { icon: 'eye', text: 'Three label display modes' },
                  { icon: 'construct', text: 'Custom header support' },
                  { icon: 'pulse', text: 'Smooth selection animations' },
                  { icon: 'tablet-landscape', text: 'Optimized for tablets & desktop' },
                ].map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={[styles.featureIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
                      <Ionicons name={feature.icon as any} size={20} color={theme.colors.onSecondaryContainer} />
                    </View>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginLeft: 16, flex: 1, lineHeight: 22 }}>
                      {feature.text}
                    </Text>
                  </View>
                ))}
              </View>
            </Surface>
          </Animated.View>

          {/* Best Practices */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Surface style={[styles.tipsCard, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={0}>
              <Ionicons name="bulb" size={28} color={theme.colors.onTertiaryContainer} />
              <Text variant="titleMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 12, fontWeight: '600' }}>
                Best Practices
              </Text>
              <View style={styles.tipsList}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, lineHeight: 20 }}>
                  • Use 3-7 destinations for optimal experience
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, lineHeight: 20 }}>
                  • Place rail on the left side of the screen
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, lineHeight: 20 }}>
                  • Consider bottom navigation for mobile
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, lineHeight: 20 }}>
                  • Use clear, recognizable icons
                </Text>
              </View>
            </Surface>
          </Animated.View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  railHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  mainContent: {
    flex: 1,
  },
  headerGradient: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 24,
    padding: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  controlCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlSection: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    minWidth: 90,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  infoCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  featureCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
  },
  featureList: {
    gap: 16,
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsCard: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  tipsList: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
});
