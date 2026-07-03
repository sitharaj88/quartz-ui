/**
 * Quartz UI Demo - Bottom App Bar Demo
 *
 * Demonstrates the BottomAppBar component inside framed "phone bottom edge"
 * previews: actions + FAB, actions only, custom colors, and disabled actions.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, BottomAppBar, FAB, Snackbar, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

type IconName = keyof typeof Ionicons.glyphMap;

/**
 * A rounded frame that simulates the bottom edge of a phone screen so the
 * bottom-anchored bar can be previewed inline. The bar's own safe-area
 * padding is zeroed out via its style override since the frame provides
 * the "device edge".
 */
function PhoneFrame({ children, label }: { children: React.ReactNode; label?: string }) {
  const theme = useTheme();
  return (
    <View>
      <Surface
        style={[
          styles.frame,
          {
            backgroundColor: theme.colors.surfaceContainerLowest,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
        elevation={1}
      >
        {/* Placeholder app content above the bar */}
        <View style={styles.frameContent}>
          <View style={[styles.ghostLine, { width: '62%', backgroundColor: theme.colors.surfaceContainerHigh }]} />
          <View style={[styles.ghostLine, { width: '84%', backgroundColor: theme.colors.surfaceContainerHigh }]} />
          <View style={[styles.ghostLine, { width: '48%', backgroundColor: theme.colors.surfaceContainerHigh }]} />
        </View>
        {children}
      </Surface>
      {label && (
        <Text
          variant="labelMedium"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 10 }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

export default function BottomAppBarScreen() {
  const theme = useTheme();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [lastAction, setLastAction] = useState('');

  const notify = (label: string) => {
    setLastAction(label);
    setSnackbarVisible(true);
  };

  const makeActions = (icons: { icon: IconName; label: string; disabled?: boolean }[], color?: string) =>
    icons.map(({ icon, label, disabled }) => ({
      icon: (
        <Ionicons
          name={icon}
          size={24}
          color={color ?? theme.colors.onSurfaceVariant}
        />
      ),
      onPress: () => notify(label),
      accessibilityLabel: label,
      disabled,
    }));

  return (
    <DemoLayout
      title="Bottom App Bar"
      subtitle="Actions & FAB anchored to the bottom edge"
      icon="browsers"
      gradient={['#2193b0', '#6dd5ed']}
    >
      {/* Actions + FAB */}
      <Section title="Actions + FAB" subtitle="Four actions with a trailing floating button" index={0}>
        <PhoneFrame label="80dp bar • surfaceContainer • elevation 2">
          <BottomAppBar
            style={styles.barInFrame}
            accessibilityLabel="Mail toolbar"
            actions={makeActions([
              { icon: 'checkbox-outline', label: 'Select' },
              { icon: 'archive-outline', label: 'Archive' },
              { icon: 'trash-outline', label: 'Delete' },
              { icon: 'mail-unread-outline', label: 'Mark unread' },
            ])}
            fab={
              <FAB
                icon={<Ionicons name="create" size={24} color={theme.colors.onPrimaryContainer} />}
                onPress={() => notify('Compose')}
                accessibilityLabel="Compose"
              />
            }
          />
        </PhoneFrame>
      </Section>

      {/* Actions only */}
      <Section title="Actions Only" subtitle="A lightweight toolbar without a FAB" index={1}>
        <PhoneFrame label="Up to four leading actions, no trailing slot">
          <BottomAppBar
            style={styles.barInFrame}
            accessibilityLabel="Playback toolbar"
            actions={makeActions([
              { icon: 'play-skip-back', label: 'Previous' },
              { icon: 'play', label: 'Play' },
              { icon: 'play-skip-forward', label: 'Next' },
            ])}
          />
        </PhoneFrame>
      </Section>

      {/* Custom background */}
      <Section title="Custom Colors" subtitle="Recolor the bar with backgroundColor" index={2}>
        <PhoneFrame label="primaryContainer background with matching icons">
          <BottomAppBar
            style={styles.barInFrame}
            backgroundColor={theme.colors.primaryContainer}
            accessibilityLabel="Media toolbar"
            actions={makeActions(
              [
                { icon: 'image-outline', label: 'Gallery' },
                { icon: 'videocam-outline', label: 'Video' },
                { icon: 'mic-outline', label: 'Audio' },
              ],
              theme.colors.onPrimaryContainer
            )}
            fab={
              <FAB
                icon={<Ionicons name="camera" size={24} color={theme.colors.onPrimaryContainer} />}
                onPress={() => notify('Capture')}
                accessibilityLabel="Capture"
              />
            }
          />
        </PhoneFrame>
      </Section>

      {/* Flat (non-elevated) */}
      <Section title="Flat Variant" subtitle="elevated={false} removes the shadow" index={3}>
        <PhoneFrame label="Flush against tonal layouts">
          <BottomAppBar
            style={styles.barInFrame}
            elevated={false}
            accessibilityLabel="Browser toolbar"
            actions={makeActions([
              { icon: 'arrow-back', label: 'Back' },
              { icon: 'arrow-forward', label: 'Forward' },
              { icon: 'refresh', label: 'Reload' },
              { icon: 'share-outline', label: 'Share' },
            ])}
          />
        </PhoneFrame>
      </Section>

      {/* Disabled actions */}
      <Section title="Disabled Actions" subtitle="Individual actions can be locked out" index={4}>
        <PhoneFrame label="Undo and redo are disabled at 38% opacity">
          <BottomAppBar
            style={styles.barInFrame}
            accessibilityLabel="Editor toolbar"
            actions={makeActions([
              { icon: 'arrow-undo', label: 'Undo', disabled: true },
              { icon: 'arrow-redo', label: 'Redo', disabled: true },
              { icon: 'text-outline', label: 'Format' },
              { icon: 'attach', label: 'Attach' },
            ])}
            fab={
              <FAB
                icon={<Ionicons name="checkmark" size={24} color={theme.colors.onPrimaryContainer} />}
                onPress={() => notify('Save')}
                accessibilityLabel="Save"
              />
            }
          />
        </PhoneFrame>
      </Section>

      {/* Guidelines */}
      <Section title="Design Guidelines" subtitle="Bottom app bar best practices" index={5}>
        <View style={[styles.guideCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons name="information-circle" size={32} color={theme.colors.onPrimaryContainer} />
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 16, fontWeight: '600' }}>
            Bottom App Bar Best Practices
          </Text>
          <View style={styles.guideList}>
            {[
              'Reserve the bar for the screen’s most frequent actions',
              'Show at most four actions — overflow belongs in a menu',
              'Place the single primary action in the trailing FAB slot',
              'The bar is safe-area aware — no extra bottom padding needed',
              'Prefer it on compact layouts; use a navigation rail on tablets',
            ].map((tip, index) => (
              <View key={index} style={styles.guideItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.onPrimaryContainer} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Section>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={lastAction ? `${lastAction} pressed` : 'Action pressed'}
        duration={2000}
      />
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  frameContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  ghostLine: {
    height: 12,
    borderRadius: 6,
  },
  // The frame provides the device edge, so drop the bar's safe-area inset.
  barInFrame: {
    paddingBottom: 0,
    minHeight: 80,
  },
  guideCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  guideList: {
    width: '100%',
    gap: 16,
    marginTop: 16,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
