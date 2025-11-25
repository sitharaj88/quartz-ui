/**
 * Tooltips Demo Screen
 * 
 * Showcases Tooltip component
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Text,
  Surface,
  AppBar,
  IconButton,
  Tooltip,
  Button,
  FAB,
  useTheme,
} from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';

export default function TooltipsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [controlledVisible, setControlledVisible] = useState(false);

  return (
    <Surface style={styles.container}>
      <AppBar
        title="Tooltips"
        navigationIcon={<Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />}
        onNavigationPress={() => router.back()}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Plain Tooltips */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Plain Tooltips
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            Long press and hold on any button to see the tooltip. Best for icon buttons.
          </Text>

          <View style={styles.row}>
            <Tooltip message="Add to favorites" position="top">
              <IconButton
                icon={<Ionicons name="heart-outline" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Add to favorites"
              />
            </Tooltip>

            <Tooltip message="Share" position="top">
              <IconButton
                icon={<Ionicons name="share-outline" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Share"
              />
            </Tooltip>

            <Tooltip message="More options" position="top">
              <IconButton
                icon={<Ionicons name="ellipsis-vertical" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="More options"
              />
            </Tooltip>

            <Tooltip message="Delete" position="top">
              <IconButton
                icon={<Ionicons name="trash-outline" size={24} color={theme.colors.onSurfaceVariant} />}
                onPress={() => {}}
                accessibilityLabel="Delete"
              />
            </Tooltip>
          </View>
        </View>

        {/* Tooltip Positions */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Positions
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            Tooltips can appear in different positions relative to the anchor.
          </Text>

          <View style={styles.positionGrid}>
            <View style={styles.positionRow}>
              <View style={styles.positionItem} />
              <Tooltip message="Top tooltip" position="top">
                <Button variant="tonal" onPress={() => {}}>Top</Button>
              </Tooltip>
              <View style={styles.positionItem} />
            </View>
            
            <View style={styles.positionRow}>
              <Tooltip message="Left tooltip" position="left">
                <Button variant="tonal" onPress={() => {}}>Left</Button>
              </Tooltip>
              <View style={styles.positionItem} />
              <Tooltip message="Right tooltip" position="right">
                <Button variant="tonal" onPress={() => {}}>Right</Button>
              </Tooltip>
            </View>
            
            <View style={styles.positionRow}>
              <View style={styles.positionItem} />
              <Tooltip message="Bottom tooltip" position="bottom">
                <Button variant="tonal" onPress={() => {}}>Bottom</Button>
              </Tooltip>
              <View style={styles.positionItem} />
            </View>
          </View>
        </View>

        {/* Rich Tooltips */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Rich Tooltips
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            Rich tooltips can include a title, supporting text, and actions.
          </Text>

          <View style={styles.richTooltipContainer}>
            <Tooltip
              title="Grant access"
              message="To send a direct message, you need to add this person to your contacts first."
              actions={
                <View style={styles.tooltipActions}>
                  <Button variant="text" size="small" onPress={() => {}}>
                    Learn more
                  </Button>
                </View>
              }
              position="bottom"
            >
              <Button variant="filled" onPress={() => {}}>
                Send Message
              </Button>
            </Tooltip>
          </View>

          <View style={styles.richTooltipContainer}>
            <Tooltip
              title="Storage permission"
              message="This app needs access to your device storage to save and share photos."
              actions={
                <View style={styles.tooltipActions}>
                  <Button variant="text" size="small" onPress={() => {}}>
                    Dismiss
                  </Button>
                  <Button variant="text" size="small" onPress={() => {}}>
                    Settings
                  </Button>
                </View>
              }
              position="bottom"
            >
              <Button variant="outlined" onPress={() => {}}>
                Upload Photo
              </Button>
            </Tooltip>
          </View>
        </View>

        {/* Controlled Tooltip */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Controlled Tooltip
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            Tooltips can be controlled programmatically.
          </Text>

          <View style={styles.controlledContainer}>
            <Tooltip
              message="This tooltip is controlled"
              visible={controlledVisible}
              position="top"
            >
              <View style={[styles.controlledTarget, { backgroundColor: theme.colors.primaryContainer }]}>
                <Ionicons name="information-circle" size={32} color={theme.colors.onPrimaryContainer} />
              </View>
            </Tooltip>

            <View style={styles.controlButtons}>
              <Button 
                variant="filled" 
                onPress={() => setControlledVisible(true)}
                disabled={controlledVisible}
              >
                Show
              </Button>
              <Button 
                variant="outlined" 
                onPress={() => setControlledVisible(false)}
                disabled={!controlledVisible}
              >
                Hide
              </Button>
            </View>
          </View>
        </View>

        {/* Tooltip with FAB */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            FAB with Tooltip
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            Tooltips work great with Floating Action Buttons.
          </Text>

          <View style={styles.fabContainer}>
            <Tooltip message="Compose new email" position="left">
              <FAB
                icon={<Ionicons name="create-outline" size={24} color={theme.colors.onPrimaryContainer} />}
                onPress={() => {}}
                accessibilityLabel="Compose new email"
              />
            </Tooltip>
          </View>
        </View>

        {/* Custom Duration */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Custom Duration
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            Long press to show tooltip. Customize how long it stays visible.
          </Text>

          <View style={styles.row}>
            <Tooltip message="Quick (500ms)" duration={500} position="top">
              <Button variant="tonal" onPress={() => {}}>Quick</Button>
            </Tooltip>

            <Tooltip message="Long (3000ms)" duration={3000} position="top">
              <Button variant="tonal" onPress={() => {}}>Long</Button>
            </Tooltip>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  positionGrid: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 24,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  positionItem: {
    width: 80,
  },
  richTooltipContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  tooltipActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  controlledContainer: {
    alignItems: 'center',
    gap: 24,
  },
  controlledTarget: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  fabContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
