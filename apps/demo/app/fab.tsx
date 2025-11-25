import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, useTheme } from 'quartz-ui';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function FABScreen() {
  const theme = useTheme();
  const [extended, setExtended] = useState(true);

  return (
    <DemoLayout
      title="FAB"
      subtitle="Floating Action Buttons for primary actions"
      icon="add-circle"
      gradient={['#fa709a', '#fee140']}
    >
      {/* Standard FAB */}
      <Section title="Standard FAB" subtitle="Default floating action button" index={0}>
        <View style={styles.fabShowcase}>
          <FAB
            icon={<Ionicons name="add" size={24} color={theme.colors.onPrimaryContainer} />}
            onPress={() => {}}
            accessibilityLabel="Add"
          />
          <View style={styles.fabInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Standard Size
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              56dp × 56dp
            </Text>
          </View>
        </View>
      </Section>

      {/* Small FAB */}
      <Section title="Small FAB" subtitle="Compact floating action button" index={1}>
        <View style={styles.fabShowcase}>
          <FAB
            icon={<Ionicons name="add" size={20} color={theme.colors.onPrimaryContainer} />}
            size="small"
            onPress={() => {}}
            accessibilityLabel="Add small"
          />
          <View style={styles.fabInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Small Size
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              40dp × 40dp
            </Text>
          </View>
        </View>
      </Section>

      {/* Large FAB */}
      <Section title="Large FAB" subtitle="Prominent floating action button" index={2}>
        <View style={styles.fabShowcase}>
          <FAB
            icon={<Ionicons name="add" size={32} color={theme.colors.onPrimaryContainer} />}
            size="large"
            onPress={() => {}}
            accessibilityLabel="Add large"
          />
          <View style={styles.fabInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              Large Size
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              96dp × 96dp
            </Text>
          </View>
        </View>
      </Section>

      {/* Extended FAB */}
      <Section title="Extended FAB" subtitle="With label text" index={3}>
        <View style={styles.extendedFabShowcase}>
          <FAB
            icon={<Ionicons name="create" size={24} color={theme.colors.onPrimaryContainer} />}
            label="Compose"
            onPress={() => {}}
            accessibilityLabel="Compose message"
          />
        </View>
        <View style={styles.extendedFabShowcase}>
          <FAB
            icon={<Ionicons name="navigate" size={24} color={theme.colors.onPrimaryContainer} />}
            label="Navigate"
            onPress={() => {}}
            accessibilityLabel="Navigate to destination"
          />
        </View>
      </Section>

      {/* Color Variants */}
      <Section title="Color Variants" subtitle="Different color schemes" index={4}>
        <View style={styles.colorRow}>
          <View style={styles.colorItem}>
            <FAB
              icon={<Ionicons name="heart" size={24} color={theme.colors.onPrimaryContainer} />}
              onPress={() => {}}
              color="primary"
              accessibilityLabel="Primary FAB"
            />
            <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginTop: 12, fontWeight: '600' }}>
              Primary
            </Text>
          </View>
          <View style={styles.colorItem}>
            <FAB
              icon={<Ionicons name="star" size={24} color={theme.colors.onSecondaryContainer} />}
              onPress={() => {}}
              color="secondary"
              accessibilityLabel="Secondary FAB"
            />
            <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginTop: 12, fontWeight: '600' }}>
              Secondary
            </Text>
          </View>
          <View style={styles.colorItem}>
            <FAB
              icon={<Ionicons name="bookmark" size={24} color={theme.colors.onTertiaryContainer} />}
              onPress={() => {}}
              color="tertiary"
              accessibilityLabel="Tertiary FAB"
            />
            <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginTop: 12, fontWeight: '600' }}>
              Tertiary
            </Text>
          </View>
          <View style={styles.colorItem}>
            <FAB
              icon={<Ionicons name="layers" size={24} color={theme.colors.primary} />}
              onPress={() => {}}
              color="surface"
              accessibilityLabel="Surface FAB"
            />
            <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginTop: 12, fontWeight: '600' }}>
              Surface
            </Text>
          </View>
        </View>
      </Section>

      {/* Usage Example */}
      <Section title="Usage Example" subtitle="FAB placement guidelines" index={5}>
        <View style={[styles.usageCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <LinearGradient
            colors={['#fa709a', '#fee140']}
            style={styles.usageGradient}
          >
            <View style={styles.usageContent}>
              <Ionicons name="information-circle" size={32} color="#fff" />
              <Text variant="titleMedium" style={{ color: '#fff', marginTop: 12, fontWeight: '600', textAlign: 'center' }}>
                Best Practices
              </Text>
              <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.95)', marginTop: 8, textAlign: 'center', lineHeight: 22 }}>
                FABs should be placed 16dp from screen edges and represent the primary action on a screen
              </Text>
            </View>
          </LinearGradient>
          <View style={styles.tipsContainer}>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                Use for the most important screen action
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                Position above navigation components
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                Avoid more than one FAB per screen
              </Text>
            </View>
          </View>
        </View>
      </Section>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  fabShowcase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  fabInfo: {
    flex: 1,
  },
  extendedFabShowcase: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  colorItem: {
    alignItems: 'center',
  },
  usageCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  usageGradient: {
    padding: 32,
  },
  usageContent: {
    alignItems: 'center',
  },
  tipsContainer: {
    padding: 20,
    gap: 16,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
