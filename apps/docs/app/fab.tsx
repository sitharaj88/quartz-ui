import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, IconButton, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const fabProps: PropDefinition[] = [
  {
    name: 'icon',
    type: 'React.ReactNode',
    description: 'Icon to render in the FAB',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Optional label for extended FAB',
  },
  {
    name: 'color',
    type: "'primary' | 'secondary' | 'tertiary' | 'surface'",
    default: "'primary'",
    description: 'Color variant',
  },
  {
    name: 'size',
    type: "'small' | 'regular' | 'large'",
    default: "'regular'",
    description: 'Size of the FAB (40dp, 56dp, 96dp)',
  },
  {
    name: 'lowered',
    type: 'boolean',
    default: 'false',
    description: 'Whether FAB is lowered (no elevation)',
  },
  {
    name: 'onPress',
    type: '(event: GestureResponderEvent) => void',
    description: 'Press handler',
  },
  {
    name: 'onLongPress',
    type: '(event: GestureResponderEvent) => void',
    description: 'Long press handler',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disabled state',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label (required)',
  },
  {
    name: 'accessibilityHint',
    type: 'string',
    description: 'Accessibility hint',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

const iconButtonProps: PropDefinition[] = [
  {
    name: 'icon',
    type: 'React.ReactNode',
    description: 'Icon to render',
  },
  {
    name: 'variant',
    type: "'standard' | 'filled' | 'tonal' | 'outlined'",
    default: "'standard'",
    description: 'Visual variant',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    default: "'medium'",
    description: 'Size of the button (32dp, 40dp, 48dp)',
  },
  {
    name: 'selected',
    type: 'boolean',
    default: 'false',
    description: 'Toggle state for toggleable icon buttons',
  },
  {
    name: 'onPress',
    type: '(event: GestureResponderEvent) => void',
    description: 'Press handler',
  },
  {
    name: 'onLongPress',
    type: '(event: GestureResponderEvent) => void',
    description: 'Long press handler',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disabled state',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label (required)',
  },
  {
    name: 'accessibilityHint',
    type: 'string',
    description: 'Accessibility hint',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

export default function FABDocPage() {
  const theme = useTheme();
  const [favorite, setFavorite] = useState(false);

  return (
    <DocLayout
      title="FAB & Icon Buttons"
      description="Floating Action Button and Icon Button components for prominent and compact actions"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          FABs represent the primary action of a screen. Icon buttons allow users to take actions with a single tap,
          displaying icons without text labels. Both components provide haptic feedback and smooth animations.
        </Text>
      </Animated.View>

      {/* Import */}
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.section}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Import
        </Text>
        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace' }}
          >
            {`import { FAB, IconButton } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* FAB Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Floating Action Button
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          FABs perform the primary action of a screen. They appear in front of all screen content, typically as a circular shape with an icon.
        </Text>

        {/* Regular FAB */}
        <CodePlayground
          title="Regular FAB"
          description="Standard 56dp FAB for primary actions"
          code={`<FAB
  icon={<Ionicons name="add" size={24} color={theme.colors.onPrimaryContainer} />}
  onPress={() => {}}
  accessibilityLabel="Add new item"
/>`}
          preview={
            <FAB
              icon={<Ionicons name="add" size={24} color={theme.colors.onPrimaryContainer} />}
              onPress={() => {}}
              accessibilityLabel="Add new item"
            />
          }
        />

        {/* Extended FAB */}
        <CodePlayground
          title="Extended FAB"
          description="FAB with label for additional context"
          code={`<FAB
  icon={<Ionicons name="create-outline" size={24} color={theme.colors.onPrimaryContainer} />}
  label="Compose"
  onPress={() => {}}
  accessibilityLabel="Compose new message"
/>`}
          preview={
            <FAB
              icon={<Ionicons name="create-outline" size={24} color={theme.colors.onPrimaryContainer} />}
              label="Compose"
              onPress={() => {}}
              accessibilityLabel="Compose new message"
            />
          }
        />

        {/* FAB Sizes */}
        <CodePlayground
          title="FAB Sizes"
          description="Three sizes: small (40dp), regular (56dp), large (96dp)"
          code={`<View style={{ gap: 16, flexDirection: 'row', alignItems: 'center' }}>
  <FAB
    size="small"
    icon={<Ionicons name="add" size={24} />}
    accessibilityLabel="Small FAB"
  />
  <FAB
    size="regular"
    icon={<Ionicons name="add" size={24} />}
    accessibilityLabel="Regular FAB"
  />
  <FAB
    size="large"
    icon={<Ionicons name="add" size={36} />}
    accessibilityLabel="Large FAB"
  />
</View>`}
          preview={
            <View style={{ gap: 16, flexDirection: 'row', alignItems: 'center' }}>
              <FAB
                size="small"
                icon={<Ionicons name="add" size={24} color={theme.colors.onPrimaryContainer} />}
                onPress={() => {}}
                accessibilityLabel="Small FAB"
              />
              <FAB
                size="regular"
                icon={<Ionicons name="add" size={24} color={theme.colors.onPrimaryContainer} />}
                onPress={() => {}}
                accessibilityLabel="Regular FAB"
              />
              <FAB
                size="large"
                icon={<Ionicons name="add" size={36} color={theme.colors.onPrimaryContainer} />}
                onPress={() => {}}
                accessibilityLabel="Large FAB"
              />
            </View>
          }
        />

        {/* FAB Colors */}
        <CodePlayground
          title="FAB Colors"
          description="Four color variants: primary, secondary, tertiary, surface"
          code={`<View style={{ gap: 16 }}>
  <FAB
    color="primary"
    icon={<Ionicons name="add" size={24} />}
    accessibilityLabel="Primary FAB"
  />
  <FAB
    color="secondary"
    icon={<Ionicons name="add" size={24} />}
    accessibilityLabel="Secondary FAB"
  />
  <FAB
    color="tertiary"
    icon={<Ionicons name="add" size={24} />}
    accessibilityLabel="Tertiary FAB"
  />
  <FAB
    color="surface"
    icon={<Ionicons name="add" size={24} color={theme.colors.primary} />}
    accessibilityLabel="Surface FAB"
  />
</View>`}
          preview={
            <View style={{ gap: 16, alignItems: 'flex-start' }}>
              <FAB
                color="primary"
                icon={<Ionicons name="add" size={24} color={theme.colors.onPrimaryContainer} />}
                onPress={() => {}}
                accessibilityLabel="Primary FAB"
              />
              <FAB
                color="secondary"
                icon={<Ionicons name="add" size={24} color={theme.colors.onSecondaryContainer} />}
                onPress={() => {}}
                accessibilityLabel="Secondary FAB"
              />
              <FAB
                color="tertiary"
                icon={<Ionicons name="add" size={24} color={theme.colors.onTertiaryContainer} />}
                onPress={() => {}}
                accessibilityLabel="Tertiary FAB"
              />
              <FAB
                color="surface"
                icon={<Ionicons name="add" size={24} color={theme.colors.primary} />}
                onPress={() => {}}
                accessibilityLabel="Surface FAB"
              />
            </View>
          }
        />
      </View>

      {/* Icon Button Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Icon Button
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          Icon buttons are compact and used in toolbars, app bars, and other UI elements where space is limited.
        </Text>

        {/* Icon Button Variants */}
        <CodePlayground
          title="Icon Button Variants"
          description="Four variants: standard, filled, tonal, outlined"
          code={`<View style={{ gap: 16, flexDirection: 'row' }}>
  <IconButton
    variant="standard"
    icon={<Ionicons name="heart-outline" size={24} />}
    accessibilityLabel="Favorite"
  />
  <IconButton
    variant="filled"
    icon={<Ionicons name="heart" size={24} />}
    accessibilityLabel="Favorite"
  />
  <IconButton
    variant="tonal"
    icon={<Ionicons name="heart" size={24} />}
    accessibilityLabel="Favorite"
  />
  <IconButton
    variant="outlined"
    icon={<Ionicons name="heart-outline" size={24} />}
    accessibilityLabel="Favorite"
  />
</View>`}
          preview={
            <View style={{ gap: 16, flexDirection: 'row', alignItems: 'center' }}>
              <IconButton
                variant="standard"
                icon={<Ionicons name="heart-outline" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Favorite"
              />
              <IconButton
                variant="filled"
                icon={<Ionicons name="heart" size={24} color={theme.colors.primary} />}
                onPress={() => {}}
                accessibilityLabel="Favorite"
              />
              <IconButton
                variant="tonal"
                icon={<Ionicons name="heart" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Favorite"
              />
              <IconButton
                variant="outlined"
                icon={<Ionicons name="heart-outline" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Favorite"
              />
            </View>
          }
        />

        {/* Icon Button Sizes */}
        <CodePlayground
          title="Icon Button Sizes"
          description="Three sizes: small (32dp), medium (40dp), large (48dp)"
          code={`<View style={{ gap: 16, flexDirection: 'row' }}>
  <IconButton
    size="small"
    icon={<Ionicons name="settings-outline" size={18} />}
    accessibilityLabel="Settings"
  />
  <IconButton
    size="medium"
    icon={<Ionicons name="settings-outline" size={24} />}
    accessibilityLabel="Settings"
  />
  <IconButton
    size="large"
    icon={<Ionicons name="settings-outline" size={28} />}
    accessibilityLabel="Settings"
  />
</View>`}
          preview={
            <View style={{ gap: 16, flexDirection: 'row', alignItems: 'center' }}>
              <IconButton
                size="small"
                icon={<Ionicons name="settings-outline" size={18} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Settings"
              />
              <IconButton
                size="medium"
                icon={<Ionicons name="settings-outline" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Settings"
              />
              <IconButton
                size="large"
                icon={<Ionicons name="settings-outline" size={28} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Settings"
              />
            </View>
          }
        />

        {/* Toggle Icon Button */}
        <CodePlayground
          title="Toggle Icon Button"
          description="Icon button with selected state"
          code={`const [favorite, setFavorite] = useState(false);

<IconButton
  variant="filled"
  selected={favorite}
  icon={
    favorite
      ? <Ionicons name="heart" size={24} />
      : <Ionicons name="heart-outline" size={24} />
  }
  onPress={() => setFavorite(!favorite)}
  accessibilityLabel={favorite ? "Remove from favorites" : "Add to favorites"}
/>`}
          preview={
            <IconButton
              variant="filled"
              selected={favorite}
              icon={
                favorite
                  ? <Ionicons name="heart" size={24} color={theme.colors.onPrimary} />
                  : <Ionicons name="heart-outline" size={24} color={theme.colors.primary} />
              }
              onPress={() => setFavorite(!favorite)}
              accessibilityLabel={favorite ? "Remove from favorites" : "Add to favorites"}
            />
          }
        />

        {/* Icon Button Group */}
        <CodePlayground
          title="Icon Button Group"
          description="Multiple icon buttons in a toolbar"
          code={`<View style={{ flexDirection: 'row', gap: 8 }}>
  <IconButton
    icon={<Ionicons name="search-outline" size={24} />}
    onPress={() => {}}
    accessibilityLabel="Search"
  />
  <IconButton
    icon={<Ionicons name="filter-outline" size={24} />}
    onPress={() => {}}
    accessibilityLabel="Filter"
  />
  <IconButton
    icon={<Ionicons name="ellipsis-vertical" size={24} />}
    onPress={() => {}}
    accessibilityLabel="More options"
  />
</View>`}
          preview={
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <IconButton
                icon={<Ionicons name="search-outline" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Search"
              />
              <IconButton
                icon={<Ionicons name="filter-outline" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Filter"
              />
              <IconButton
                icon={<Ionicons name="ellipsis-vertical" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="More options"
              />
            </View>
          }
        />

        {/* Disabled Icon Button */}
        <CodePlayground
          title="Disabled State"
          description="Disabled icon buttons prevent interaction"
          code={`<View style={{ gap: 16, flexDirection: 'row' }}>
  <IconButton
    variant="standard"
    disabled
    icon={<Ionicons name="download-outline" size={24} />}
    accessibilityLabel="Download"
  />
  <IconButton
    variant="filled"
    disabled
    icon={<Ionicons name="download" size={24} />}
    accessibilityLabel="Download"
  />
</View>`}
          preview={
            <View style={{ gap: 16, flexDirection: 'row', alignItems: 'center' }}>
              <IconButton
                variant="standard"
                disabled
                icon={<Ionicons name="download-outline" size={24} color={theme.colors.onSurface} />}
                onPress={() => {}}
                accessibilityLabel="Download"
              />
              <IconButton
                variant="filled"
                disabled
                icon={<Ionicons name="download" size={24} color={theme.colors.onSurface} />}
                onPress={() => {}}
                accessibilityLabel="Download"
              />
            </View>
          }
        />
      </View>

      {/* FAB Props API */}
      <PropsTable props={fabProps} title="FAB API Reference" />

      {/* Icon Button Props API */}
      <PropsTable props={iconButtonProps} title="IconButton API Reference" />

      {/* Accessibility */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Accessibility
        </Text>
        <View style={[styles.accessibilityCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Required Labels
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                accessibilityLabel is required for screen reader support
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Haptic Feedback
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Medium haptic feedback for FAB, light for icon buttons (iOS/Android)
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Touch Targets
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                All sizes meet minimum 48dp touch target guidelines
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                State Animation
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Smooth scale animations on press with state layer feedback
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Best Practices */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Best Practices
        </Text>
        <View style={styles.bestPracticesList}>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use only one FAB per screen for the primary action
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>extended FAB</Text> when users need more context about the action
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>standard</Text> icon buttons for most cases, other variants for emphasis
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Always provide descriptive accessibility labels that describe the action, not the icon
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Position FAB in bottom-right corner (or bottom-left in RTL layouts) for easy thumb access
            </Text>
          </View>
        </View>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 12,
  },
  accessibilityCard: {
    padding: 24,
    borderRadius: 16,
    gap: 20,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bestPracticesList: {
    gap: 16,
  },
  bestPracticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bestPracticeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});
