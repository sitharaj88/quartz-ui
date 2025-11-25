import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Text, Surface, Button, ProgressIndicator, useTheme } from 'quartz-ui';
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

export default function ProgressScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(65);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

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

  // Simulate download
  useEffect(() => {
    if (downloading && downloadProgress < 100) {
      const timer = setTimeout(() => {
        setDownloadProgress(prev => Math.min(prev + 5, 100));
      }, 200);
      return () => clearTimeout(timer);
    } else if (downloadProgress >= 100) {
      setDownloading(false);
    }
  }, [downloading, downloadProgress]);

  const startDownload = () => {
    setDownloadProgress(0);
    setDownloading(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      <Animated.View 
        style={[
          styles.statusBarBackground, 
          { height: insets.top, backgroundColor: '#ff9a9e' },
          statusBarStyle
        ]} 
      />
      <Animated.ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={scrollHandler} scrollEventThrottle={16}>
        {/* Header */}
        <Animated.View style={[styles.header, { marginTop: insets.top + 12 }, heroAnimatedStyle]}>
          <LinearGradient
            colors={['#ff9a9e', '#fecfef']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.headerGradient, { paddingTop: insets.top + 32 }]}
          >
            <Ionicons name="sync" size={32} color="#333" />
            <Text variant="headlineSmall" style={[styles.headerTitle, { color: '#333' }]}>Progress</Text>
            <Text variant="bodyMedium" style={[styles.headerSubtitle, { color: 'rgba(0,0,0,0.7)' }]}>
              Linear & circular indicators
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Linear Progress */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Section title="Linear Progress" subtitle="Determinate & indeterminate">
            <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={styles.progressItem}>
                <View style={styles.progressHeader}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>Determinate</Text>
                  <Text variant="labelMedium" style={{ color: theme.colors.primary }}>{progress}%</Text>
                </View>
                <ProgressIndicator variant="linear" progress={progress} />
                <View style={styles.progressControls}>
                  <Button 
                    variant="outlined" 
                    onPress={() => setProgress(Math.max(0, progress - 10))}
                    disabled={progress <= 0}
                  >
                    -10%
                  </Button>
                  <Button 
                    variant="outlined" 
                    onPress={() => setProgress(Math.min(100, progress + 10))}
                    disabled={progress >= 100}
                  >
                    +10%
                  </Button>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

              <View style={styles.progressItem}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
                  Indeterminate
                </Text>
                <ProgressIndicator variant="linear" indeterminate />
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                  Used when duration is unknown
                </Text>
              </View>
            </Surface>
          </Section>
        </Animated.View>

        {/* Circular Progress */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Section title="Circular Progress" subtitle="Various sizes">
            <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={styles.circularRow}>
                <View style={styles.circularItem}>
                  <ProgressIndicator variant="circular" size="small" progress={75} />
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                    Small
                  </Text>
                </View>
                <View style={styles.circularItem}>
                  <ProgressIndicator variant="circular" size="medium" progress={progress} />
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                    Medium
                  </Text>
                </View>
                <View style={styles.circularItem}>
                  <ProgressIndicator variant="circular" size="large" progress={45} />
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                    Large
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

              <View style={styles.circularRow}>
                <View style={styles.circularItem}>
                  <ProgressIndicator variant="circular" size="small" indeterminate />
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                    Loading
                  </Text>
                </View>
                <View style={styles.circularItem}>
                  <ProgressIndicator variant="circular" size="medium" indeterminate />
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                    Syncing
                  </Text>
                </View>
                <View style={styles.circularItem}>
                  <ProgressIndicator variant="circular" size="large" indeterminate />
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                    Processing
                  </Text>
                </View>
              </View>
            </Surface>
          </Section>
        </Animated.View>

        {/* Download Demo */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Section title="Real-World Example" subtitle="Simulated file download">
            <Surface style={[styles.downloadCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={styles.downloadHeader}>
                <View style={[styles.fileIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Ionicons name="document" size={24} color={theme.colors.onPrimaryContainer} />
                </View>
                <View style={styles.fileInfo}>
                  <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                    design-system.zip
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    24.5 MB
                  </Text>
                </View>
                {downloadProgress >= 100 ? (
                  <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
                ) : downloading ? (
                  <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                    {downloadProgress}%
                  </Text>
                ) : null}
              </View>

              {downloading ? (
                <ProgressIndicator 
                  variant="linear" 
                  progress={downloadProgress} 
                  size="medium"
                />
              ) : downloadProgress >= 100 ? (
                <View style={[styles.completeBanner, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer }}>
                    Download Complete!
                  </Text>
                </View>
              ) : null}

              <Button
                variant={downloading ? 'outlined' : 'filled'}
                onPress={downloadProgress >= 100 ? startDownload : startDownload}
                disabled={downloading}
              >
                {downloading ? 'Downloading...' : downloadProgress >= 100 ? 'Download Again' : 'Start Download'}
              </Button>
            </Surface>
          </Section>
        </Animated.View>

        {/* Custom Colors */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Section title="Custom Colors" subtitle="Branded progress indicators">
            <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={styles.colorRow}>
                <View style={styles.colorItem}>
                  <ProgressIndicator 
                    variant="circular" 
                    size="medium" 
                    progress={80} 
                    color="#6366f1"
                    trackColor="#e0e7ff"
                  />
                  <Text variant="labelSmall" style={{ color: '#6366f1', marginTop: 8 }}>Indigo</Text>
                </View>
                <View style={styles.colorItem}>
                  <ProgressIndicator 
                    variant="circular" 
                    size="medium" 
                    progress={60} 
                    color="#ec4899"
                    trackColor="#fce7f3"
                  />
                  <Text variant="labelSmall" style={{ color: '#ec4899', marginTop: 8 }}>Pink</Text>
                </View>
                <View style={styles.colorItem}>
                  <ProgressIndicator 
                    variant="circular" 
                    size="medium" 
                    progress={90} 
                    color="#10b981"
                    trackColor="#d1fae5"
                  />
                  <Text variant="labelSmall" style={{ color: '#10b981', marginTop: 8 }}>Emerald</Text>
                </View>
                <View style={styles.colorItem}>
                  <ProgressIndicator 
                    variant="circular" 
                    size="medium" 
                    progress={40} 
                    color="#f59e0b"
                    trackColor="#fef3c7"
                  />
                  <Text variant="labelSmall" style={{ color: '#f59e0b', marginTop: 8 }}>Amber</Text>
                </View>
              </View>
            </Surface>
          </Section>
        </Animated.View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
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
  card: {
    borderRadius: 16,
    padding: 20,
  },
  progressItem: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  circularRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  circularItem: {
    alignItems: 'center',
  },
  downloadCard: {
    borderRadius: 16,
    padding: 20,
  },
  downloadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  completeBanner: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  colorItem: {
    alignItems: 'center',
  },
});
