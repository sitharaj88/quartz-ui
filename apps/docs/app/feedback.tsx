import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Snackbar, Banner, Tooltip, useTheme, Button } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const snackbarProps: PropDefinition[] = [
  {
    name: 'visible',
    type: 'boolean',
    description: 'Whether snackbar is visible',
  },
  {
    name: 'message',
    type: 'string',
    description: 'Message text to display',
  },
  {
    name: 'action',
    type: '{ label: string; onPress: () => void }',
    description: 'Optional action button',
  },
  {
    name: 'duration',
    type: 'number',
    default: '4000',
    description: 'Duration in ms before auto-dismiss (0 = no auto-dismiss)',
  },
  {
    name: 'onDismiss',
    type: '() => void',
    description: 'Callback when snackbar is dismissed',
  },
  {
    name: 'showCloseIcon',
    type: 'boolean',
    default: 'false',
    description: 'Show close icon button',
  },
  {
    name: 'position',
    type: "'bottom' | 'top'",
    default: "'bottom'",
    description: 'Position on screen',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

const bannerProps: PropDefinition[] = [
  {
    name: 'visible',
    type: 'boolean',
    description: 'Whether banner is visible',
  },
  {
    name: 'message',
    type: 'string',
    description: 'Banner message text',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Leading icon element',
  },
  {
    name: 'action',
    type: '{ label: string; onPress: () => void }',
    description: 'Primary action button',
  },
  {
    name: 'secondaryAction',
    type: '{ label: string; onPress: () => void }',
    description: 'Secondary action button',
  },
  {
    name: 'dismissable',
    type: 'boolean',
    default: 'false',
    description: 'Show close/dismiss button',
  },
  {
    name: 'onDismiss',
    type: '() => void',
    description: 'Callback when banner is dismissed',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

const tooltipProps: PropDefinition[] = [
  {
    name: 'message',
    type: 'string',
    description: 'Tooltip text content',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Rich tooltip title',
  },
  {
    name: 'children',
    type: 'ReactElement',
    description: 'Element that triggers the tooltip',
  },
  {
    name: 'position',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'top'",
    description: 'Tooltip position relative to anchor',
  },
  {
    name: 'duration',
    type: 'number',
    default: '1500',
    description: 'Duration tooltip stays visible (ms)',
  },
  {
    name: 'visible',
    type: 'boolean',
    description: 'Controlled visibility state',
  },
  {
    name: 'onVisibleChange',
    type: '(visible: boolean) => void',
    description: 'Callback when visibility changes',
  },
];

export default function FeedbackDocPage() {
  const theme = useTheme();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarWithAction, setSnackbarWithAction] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [bannerWarning, setBannerWarning] = useState(false);

  return (
    <DocLayout
      title="Feedback Components"
      description="Snackbars, Banners, and Tooltips for user feedback"
    >
      {/* Snackbar Section */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Snackbar
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Snackbars provide brief messages about app processes at the bottom of the screen.
        </Text>
      </Animated.View>

      {/* Basic Snackbar */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <CodePlayground
          title="Basic Snackbar"
          description="Simple message notification"
          code={`<Snackbar
  visible={visible}
  message="Item deleted"
  onDismiss={() => setVisible(false)}
/>`}
          preview={
          <View style={styles.demoContainer}>
            <Button
              variant="filled"
              onPress={() => setSnackbarVisible(true)}
            >
              Show Snackbar
            </Button>
            <Snackbar
              visible={snackbarVisible}
              message="Item has been deleted"
              onDismiss={() => setSnackbarVisible(false)}
              duration={4000}
            />
          </View>
          }
        />
      </Animated.View>

      {/* Snackbar with Action */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <CodePlayground
          title="With Action"
          description="Snackbar with undo action button"
          code={`<Snackbar
  visible={visible}
  message="Email archived"
  action={{
    label: 'Undo',
    onPress: () => handleUndo()
  }}
  onDismiss={() => setVisible(false)}
/>`}
          preview={
          <View style={styles.demoContainer}>
            <Button
              variant="filled"
              onPress={() => setSnackbarWithAction(true)}
            >
              Show with Action
            </Button>
            <Snackbar
              visible={snackbarWithAction}
              message="Email archived"
              action={{
                label: 'Undo',
                onPress: () => {
                  setSnackbarWithAction(false);
                }
              }}
              onDismiss={() => setSnackbarWithAction(false)}
              duration={7000}
            />
          </View>
          }
        />
      </Animated.View>

      {/* Snackbar Props */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <PropsTable title="Snackbar" props={snackbarProps} />
      </Animated.View>

      {/* Banner Section */}
      <Animated.View entering={FadeInDown.delay(500).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Banner
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Banners display prominent messages and related optional actions at the top of the screen.
        </Text>
      </Animated.View>

      {/* Basic Banner */}
      <Animated.View entering={FadeInDown.delay(600).springify()}>
        <CodePlayground
          title="Basic Banner"
          description="Informational banner with actions"
          code={`<Banner
  visible={visible}
  message="There was a problem processing your payment."
  icon={<Ionicons name="card-outline" />}
  action={{ label: 'Update', onPress: () => {} }}
  secondaryAction={{ label: 'Dismiss', onPress: () => {} }}
/>`}
          preview={
          <View style={styles.bannerDemo}>
            <Banner
              visible={bannerVisible}
              message="There was a problem processing your payment. Please update your payment method."
              icon={<Ionicons name="card-outline" size={24} color={theme.colors.onSurface} />}
              action={{ label: 'Update', onPress: () => {} }}
              secondaryAction={{ label: 'Dismiss', onPress: () => setBannerVisible(false) }}
            />
            {!bannerVisible && (
              <Button variant="outlined" onPress={() => setBannerVisible(true)}>
                Show Banner
              </Button>
            )}
          </View>
          }
        />
      </Animated.View>

      {/* Warning Banner */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
        <CodePlayground
          title="Warning Banner"
          description="Banner for important warnings"
          code={`<Banner
  visible={visible}
  message="Your trial expires in 3 days"
  icon={<Ionicons name="warning" />}
  action={{ label: 'Upgrade Now', onPress: () => {} }}
/>`}
          preview={
          <View style={styles.bannerDemo}>
            <Banner
              visible={bannerWarning}
              message="Your free trial expires in 3 days. Upgrade now to keep all your features."
              icon={<Ionicons name="warning-outline" size={24} color={theme.colors.error} />}
              action={{ label: 'Upgrade Now', onPress: () => {} }}
              secondaryAction={{ label: 'Later', onPress: () => setBannerWarning(false) }}
            />
            {!bannerWarning && (
              <Button variant="outlined" onPress={() => setBannerWarning(true)}>
                Show Warning Banner
              </Button>
            )}
          </View>
          }
        />
      </Animated.View>

      {/* Banner Props */}
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <PropsTable title="Banner" props={bannerProps} />
      </Animated.View>

      {/* Tooltip Section */}
      <Animated.View entering={FadeInDown.delay(900).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Tooltip
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Tooltips display informative text when users hover over, focus on, or tap an element.
        </Text>
      </Animated.View>

      {/* Basic Tooltip */}
      <Animated.View entering={FadeInDown.delay(1000).springify()}>
        <CodePlayground
          title="Basic Tooltips"
          description="Plain tooltips on hover/long-press"
          code={`<Tooltip message="Add to favorites">
  <IconButton icon={<Ionicons name="heart" />} />
</Tooltip>`}
          preview={
          <View style={styles.tooltipRow}>
            <Tooltip message="Add to favorites">
              <View style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Ionicons name="heart-outline" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
            </Tooltip>

            <Tooltip message="Share this item">
              <View style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Ionicons name="share-outline" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
            </Tooltip>

            <Tooltip message="Download file">
              <View style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Ionicons name="download-outline" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
            </Tooltip>

            <Tooltip message="Delete item">
              <View style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Ionicons name="trash-outline" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
            </Tooltip>
          </View>
          }
        />
      </Animated.View>

      {/* Tooltip Placement */}
      <Animated.View entering={FadeInDown.delay(1100).springify()}>
        <CodePlayground
          title="Position Options"
          description="Tooltips can appear on any side"
          code={`<Tooltip message="Top" position="top">...</Tooltip>
<Tooltip message="Bottom" position="bottom">...</Tooltip>
<Tooltip message="Left" position="left">...</Tooltip>
<Tooltip message="Right" position="right">...</Tooltip>`}
          preview={
          <View style={styles.placementDemo}>
            <Tooltip message="Appears on top" position="top">
              <View style={[styles.placementButton, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={{ color: theme.colors.onPrimaryContainer }}>Top</Text>
              </View>
            </Tooltip>

            <Tooltip message="Appears on bottom" position="bottom">
              <View style={[styles.placementButton, { backgroundColor: theme.colors.secondaryContainer }]}>
                <Text style={{ color: theme.colors.onSecondaryContainer }}>Bottom</Text>
              </View>
            </Tooltip>

            <Tooltip message="Appears on left" position="left">
              <View style={[styles.placementButton, { backgroundColor: theme.colors.tertiaryContainer }]}>
                <Text style={{ color: theme.colors.onTertiaryContainer }}>Left</Text>
              </View>
            </Tooltip>

            <Tooltip message="Appears on right" position="right">
              <View style={[styles.placementButton, { backgroundColor: theme.colors.errorContainer }]}>
                <Text style={{ color: theme.colors.onErrorContainer }}>Right</Text>
              </View>
            </Tooltip>
          </View>
          }
        />
      </Animated.View>

      {/* Tooltip Props */}
      <Animated.View entering={FadeInDown.delay(1200).springify()}>
        <PropsTable title="Tooltip" props={tooltipProps} />
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '700',
  },
  sectionDescription: {
    marginBottom: 24,
    lineHeight: 24,
  },
  demoContainer: {
    alignItems: 'flex-start',
  },
  bannerDemo: {
    minHeight: 100,
  },
  tooltipRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placementDemo: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  placementButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
