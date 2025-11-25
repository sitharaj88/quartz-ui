/**
 * Quartz UI Demo - Banners Demo
 * 
 * Demonstrates Banner component
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Button, 
  Surface, 
  Banner,
  useTheme,
  Divider,
} from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function BannersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Banner states
  const [showBanner1, setShowBanner1] = useState(false);
  const [showBanner2, setShowBanner2] = useState(false);
  const [showBanner3, setShowBanner3] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Surface style={[styles.header, { paddingTop: insets.top }]} elevation={0}>
        <View style={styles.headerContent}>
          <Button
            variant="text"
            onPress={() => router.back()}
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />}
          >
            Back
          </Button>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
            Banners
          </Text>
          <View style={{ width: 80 }} />
        </View>
      </Surface>

      {/* Banners appear here */}
      <Banner
        visible={showBanner1}
        message="Your network connection has been restored."
        icon={<Ionicons name="wifi" size={24} color={theme.colors.onSurface} />}
        action={{
          label: 'Dismiss',
          onPress: () => setShowBanner1(false),
        }}
      />

      <Banner
        visible={showBanner2}
        message="There was a problem processing your request. Please try again later."
        icon={<Ionicons name="warning" size={24} color={theme.colors.error} />}
        action={{
          label: 'Retry',
          onPress: () => setShowBanner2(false),
        }}
        secondaryAction={{
          label: 'Dismiss',
          onPress: () => setShowBanner2(false),
        }}
      />

      <Banner
        visible={showBanner3}
        message="New version available! Update now to get the latest features and improvements."
        icon={<Ionicons name="download" size={24} color={theme.colors.primary} />}
        action={{
          label: 'Update',
          onPress: () => setShowBanner3(false),
        }}
        secondaryAction={{
          label: 'Later',
          onPress: () => setShowBanner3(false),
        }}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Controls */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Banner Examples
        </Text>
        <Text variant="bodySmall" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Banners display important, succinct messages at the top of the screen
        </Text>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.bannerDemo}>
            <View style={styles.bannerInfo}>
              <Ionicons name="wifi" size={24} color={theme.colors.primary} />
              <View style={styles.bannerText}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
                  Single Action
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Network connection restored
                </Text>
              </View>
            </View>
            <Button variant="tonal" onPress={() => setShowBanner1(true)}>
              Show
            </Button>
          </View>
        </Surface>

        <Surface style={[styles.card, { marginTop: 12 }]} elevation={1}>
          <View style={styles.bannerDemo}>
            <View style={styles.bannerInfo}>
              <Ionicons name="warning" size={24} color={theme.colors.error} />
              <View style={styles.bannerText}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
                  Two Actions
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Error with retry option
                </Text>
              </View>
            </View>
            <Button variant="tonal" onPress={() => setShowBanner2(true)}>
              Show
            </Button>
          </View>
        </Surface>

        <Surface style={[styles.card, { marginTop: 12 }]} elevation={1}>
          <View style={styles.bannerDemo}>
            <View style={styles.bannerInfo}>
              <Ionicons name="download" size={24} color={theme.colors.primary} />
              <View style={styles.bannerText}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
                  Update Available
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  New version prompt
                </Text>
              </View>
            </View>
            <Button variant="tonal" onPress={() => setShowBanner3(true)}>
              Show
            </Button>
          </View>
        </Surface>

        {/* Use Cases */}
        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Common Use Cases
        </Text>
        
        <Surface style={styles.featureCard} elevation={1}>
          {[
            { icon: 'wifi-outline', text: 'Network connectivity changes', color: theme.colors.primary },
            { icon: 'alert-circle-outline', text: 'Error messages with actions', color: theme.colors.error },
            { icon: 'cloud-download-outline', text: 'App update notifications', color: theme.colors.primary },
            { icon: 'information-circle-outline', text: 'Important announcements', color: theme.colors.secondary },
            { icon: 'checkmark-circle-outline', text: 'Success confirmations', color: theme.colors.tertiary },
          ].map((useCase, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name={useCase.icon as any} size={20} color={useCase.color} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginStart: 12 }}>
                {useCase.text}
              </Text>
            </View>
          ))}
        </Surface>

        {/* Features List */}
        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Features
        </Text>
        
        <Surface style={styles.featureCard} elevation={1}>
          {[
            { icon: 'flash-outline', text: 'Animated show/hide transitions' },
            { icon: 'image-outline', text: 'Optional leading icon' },
            { icon: 'hand-left-outline', text: 'One or two action buttons' },
            { icon: 'close-outline', text: 'Optional dismiss button' },
            { icon: 'accessibility-outline', text: 'Accessibility support' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name={feature.icon as any} size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginStart: 12 }}>
                {feature.text}
              </Text>
            </View>
          ))}
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  bannerDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerText: {
    marginStart: 12,
    flex: 1,
  },
  divider: {
    marginVertical: 24,
  },
  featureCard: {
    padding: 16,
    borderRadius: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
