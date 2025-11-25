import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'quartz-ui';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function CardsScreen() {
  const theme = useTheme();

  return (
    <DemoLayout
      title="Cards"
      subtitle="Container components for content grouping"
      icon="albums"
      gradient={['#f093fb', '#f5576c']}
    >
      {/* Elevated Card */}
      <Section title="Elevated Card" subtitle="With shadow depth" index={0}>
        <Card variant="elevated" style={styles.card}>
          <View style={styles.cardMedia}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.cardMediaGradient}
            >
              <Ionicons name="image" size={56} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
          </View>
          <View style={styles.cardContent}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Mountain Retreat
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 22 }}>
              Escape to nature with our exclusive mountain getaway packages. Perfect for adventure seekers.
            </Text>
            <View style={styles.cardActions}>
              <Button variant="text" onPress={() => {}}>Cancel</Button>
              <Button variant="filled" onPress={() => {}}>Book Now</Button>
            </View>
          </View>
        </Card>
      </Section>

      {/* Filled Card */}
      <Section title="Filled Card" subtitle="With background color" index={1}>
        <Card variant="filled" style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardRow}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="person" size={28} color="#fff" />
              </View>
              <View style={styles.cardMeta}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  John Appleseed
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Product Designer
                </Text>
              </View>
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16, lineHeight: 22, fontStyle: 'italic' }}>
              "This design system has completely transformed how we build products. The consistency and quality are unmatched."
            </Text>
          </View>
        </Card>
      </Section>

      {/* Outlined Card */}
      <Section title="Outlined Card" subtitle="With border styling" index={2}>
        <Card variant="outlined" style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: theme.colors.tertiaryContainer }]}>
                <Ionicons name="stats-chart" size={22} color={theme.colors.onTertiaryContainer} />
              </View>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                Weekly Stats
              </Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  2.4k
                </Text>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  Views
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={{ color: theme.colors.secondary, fontWeight: '700' }}>
                  189
                </Text>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  Likes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={{ color: theme.colors.tertiary, fontWeight: '700' }}>
                  42
                </Text>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  Shares
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </Section>

      {/* Horizontal Card */}
      <Section title="Horizontal Card" subtitle="Media on the side" index={3}>
        <Card variant="elevated" style={styles.horizontalCard}>
          <View style={styles.horizontalMedia}>
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.horizontalMediaGradient}
            >
              <Ionicons name="musical-notes" size={36} color="#fff" />
            </LinearGradient>
          </View>
          <View style={styles.horizontalContent}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Now Playing
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Summer Vibes Playlist
            </Text>
            <View style={styles.playbackControls}>
              <Ionicons name="play-skip-back" size={22} color={theme.colors.onSurface} />
              <View style={[styles.playButton, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="play" size={18} color="#fff" />
              </View>
              <Ionicons name="play-skip-forward" size={22} color={theme.colors.onSurface} />
            </View>
          </View>
        </Card>
      </Section>

      {/* Interactive Cards */}
      <Section title="Interactive Cards" subtitle="Pressable card actions" index={4}>
        <View style={styles.cardGrid}>
          <Card variant="filled" style={styles.smallCard} onPress={() => {}}>
            <View style={styles.smallCardContent}>
              <LinearGradient
                colors={['#fa709a', '#fee140']}
                style={styles.smallCardIcon}
              >
                <Ionicons name="heart" size={28} color="#fff" />
              </LinearGradient>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginTop: 12, fontWeight: '600' }}>
                Favorites
              </Text>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                24 items
              </Text>
            </View>
          </Card>
          <Card variant="filled" style={styles.smallCard} onPress={() => {}}>
            <View style={styles.smallCardContent}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.smallCardIcon}
              >
                <Ionicons name="bookmark" size={28} color="#fff" />
              </LinearGradient>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginTop: 12, fontWeight: '600' }}>
                Saved
              </Text>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                12 items
              </Text>
            </View>
          </Card>
        </View>
      </Section>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardMedia: {
    height: 180,
  },
  cardMediaGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMeta: {
    marginLeft: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  horizontalCard: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
  },
  horizontalMedia: {
    width: 120,
  },
  horizontalMediaGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 16,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    borderRadius: 20,
  },
  smallCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  smallCardIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
