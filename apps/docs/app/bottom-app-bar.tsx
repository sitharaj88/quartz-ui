import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, BottomAppBar, FAB, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PhoneScaffold } from './_components/PhoneScaffold';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const bottomAppBarProps: PropDefinition[] = [
  {
    name: 'actions',
    type: 'BottomAppBarAction[]',
    description: 'Leading icon-button actions (up to 4 are rendered)',
  },
  {
    name: 'fab',
    type: 'ReactNode',
    description: 'Trailing floating action button slot (e.g. a FAB element)',
  },
  {
    name: 'elevated',
    type: 'boolean',
    default: 'true',
    description: 'Whether the bar casts elevation (level 2)',
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: 'theme.colors.surfaceContainer',
    description: 'Custom background color',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override for the outer container',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label for the bar itself',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

const bottomAppBarActionProps: PropDefinition[] = [
  {
    name: 'icon',
    type: 'ReactNode',
    required: true,
    description: 'Icon to display inside the 48dp touch target',
  },
  {
    name: 'onPress',
    type: '() => void',
    description: 'Callback when the action is pressed',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label announced for the action',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables interaction and exposes the disabled state to assistive tech',
  },
  {
    name: 'testID',
    type: 'string',
    description: "Test ID for the action's pressable",
  },
];

// ─── Previews — each renders a real screen scaffold in the phone frame ─────

function useBarActions() {
  const theme = useTheme();
  return [
    {
      icon: <Ionicons name="checkbox-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      onPress: () => {},
      accessibilityLabel: 'Select items',
    },
    {
      icon: <Ionicons name="brush-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      onPress: () => {},
      accessibilityLabel: 'Edit labels',
    },
    {
      icon: <Ionicons name="archive-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      onPress: () => {},
      accessibilityLabel: 'Archive',
    },
    {
      icon: <Ionicons name="image-outline" size={24} color={theme.colors.onSurfaceVariant} />,
      onPress: () => {},
      accessibilityLabel: 'Add image',
    },
  ];
}

function BottomAppBarWithFabDemo() {
  const theme = useTheme();
  const actions = useBarActions();
  return (
    <PhoneScaffold
      bottomSlot={
        <BottomAppBar
          actions={actions.slice(0, 3)}
          fab={
            <FAB
              icon={<Ionicons name="add" size={24} color={theme.colors.onPrimaryContainer} />}
              lowered
              accessibilityLabel="Compose"
              onPress={() => {}}
            />
          }
        />
      }
    />
  );
}

function BottomAppBarActionsOnlyDemo() {
  const actions = useBarActions();
  return <PhoneScaffold bottomSlot={<BottomAppBar actions={actions} />} />;
}

function BottomAppBarCustomColorDemo() {
  const theme = useTheme();
  return (
    <PhoneScaffold
      bottomSlot={
        <BottomAppBar
          backgroundColor={theme.colors.primaryContainer}
          elevated={false}
          actions={[
            {
              icon: <Ionicons name="mic-outline" size={24} color={theme.colors.onPrimaryContainer} />,
              onPress: () => {},
              accessibilityLabel: 'Voice input',
            },
            {
              icon: <Ionicons name="camera-outline" size={24} color={theme.colors.onPrimaryContainer} />,
              onPress: () => {},
              accessibilityLabel: 'Open camera',
            },
            {
              icon: <Ionicons name="attach-outline" size={24} color={theme.colors.onPrimaryContainer} />,
              onPress: () => {},
              accessibilityLabel: 'Attach file',
            },
          ]}
          fab={
            <FAB
              icon={<Ionicons name="send" size={24} color={theme.colors.onPrimary} />}
              lowered
              accessibilityLabel="Send"
              onPress={() => {}}
            />
          }
        />
      }
    />
  );
}

function BottomAppBarDisabledDemo() {
  const theme = useTheme();
  return (
    <PhoneScaffold
      bottomSlot={
        <BottomAppBar
          actions={[
            {
              icon: <Ionicons name="arrow-undo-outline" size={24} color={theme.colors.onSurfaceVariant} />,
              onPress: () => {},
              accessibilityLabel: 'Undo',
            },
            {
              icon: <Ionicons name="arrow-redo-outline" size={24} color={theme.colors.onSurfaceVariant} />,
              accessibilityLabel: 'Redo',
              disabled: true,
            },
            {
              icon: <Ionicons name="trash-outline" size={24} color={theme.colors.onSurfaceVariant} />,
              accessibilityLabel: 'Delete',
              disabled: true,
            },
            {
              icon: <Ionicons name="share-social-outline" size={24} color={theme.colors.onSurfaceVariant} />,
              onPress: () => {},
              accessibilityLabel: 'Share',
            },
          ]}
        />
      }
    />
  );
}

export default function BottomAppBarDocPage() {
  const theme = useTheme();

  return (
    <DocLayout
      title="Bottom App Bar"
      description="A bottom-anchored bar with up to four contextual actions and an optional floating action button"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Bottom app bars put frequent, contextual actions within thumb reach at the bottom of mobile
          screens. Following the Material 3 spec, the bar is 80dp tall, uses the surfaceContainer color
          at elevation level 2, and automatically pads itself for the device's bottom safe-area inset.
          A trailing slot hosts the screen's primary-action FAB.
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
            {`import { BottomAppBar } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Examples
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          The bar renders up to four leading actions; pass a FAB element to the fab slot for the
          screen's primary action.
        </Text>

        {/* Actions + FAB */}
        <CodePlayground frameContentLayout="full"
          title="Actions with FAB"
          description="Three contextual actions plus the screen's primary action"
          code={`<BottomAppBar
  actions={[
    {
      icon: <Ionicons name="checkbox-outline" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'Select items',
    },
    {
      icon: <Ionicons name="brush-outline" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'Edit labels',
    },
    {
      icon: <Ionicons name="archive-outline" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'Archive',
    },
  ]}
  fab={
    <FAB
      icon={<Ionicons name="add" size={24} />}
      lowered
      accessibilityLabel="Compose"
      onPress={() => {}}
    />
  }
/>`}
          preview={<BottomAppBarWithFabDemo />}
        />

        {/* Actions only */}
        <CodePlayground frameContentLayout="full"
          title="Actions Only"
          description="Up to four actions, no FAB — for toolbars without a primary action"
          code={`<BottomAppBar
  actions={[
    { icon: <Ionicons name="checkbox-outline" size={24} />, accessibilityLabel: 'Select items' },
    { icon: <Ionicons name="brush-outline" size={24} />, accessibilityLabel: 'Edit labels' },
    { icon: <Ionicons name="archive-outline" size={24} />, accessibilityLabel: 'Archive' },
    { icon: <Ionicons name="image-outline" size={24} />, accessibilityLabel: 'Add image' },
  ]}
/>`}
          preview={<BottomAppBarActionsOnlyDemo />}
        />

        {/* Custom colors */}
        <CodePlayground frameContentLayout="full"
          title="Custom Colors"
          description="Override the container color and drop the elevation for a flat, tinted bar"
          code={`<BottomAppBar
  backgroundColor={theme.colors.primaryContainer}
  elevated={false}
  actions={[
    { icon: <Ionicons name="mic-outline" size={24} />, accessibilityLabel: 'Voice input' },
    { icon: <Ionicons name="camera-outline" size={24} />, accessibilityLabel: 'Open camera' },
    { icon: <Ionicons name="attach-outline" size={24} />, accessibilityLabel: 'Attach file' },
  ]}
  fab={
    <FAB
      icon={<Ionicons name="send" size={24} />}
      lowered
      accessibilityLabel="Send"
      onPress={() => {}}
    />
  }
/>`}
          preview={<BottomAppBarCustomColorDemo />}
        />

        {/* Disabled */}
        <CodePlayground frameContentLayout="full"
          title="Disabled Actions"
          description="Disabled actions dim, block presses, and announce their state to screen readers"
          code={`<BottomAppBar
  actions={[
    {
      icon: <Ionicons name="arrow-undo-outline" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'Undo',
    },
    {
      icon: <Ionicons name="arrow-redo-outline" size={24} />,
      accessibilityLabel: 'Redo',
      disabled: true,
    },
    {
      icon: <Ionicons name="trash-outline" size={24} />,
      accessibilityLabel: 'Delete',
      disabled: true,
    },
    {
      icon: <Ionicons name="share-social-outline" size={24} />,
      onPress: () => {},
      accessibilityLabel: 'Share',
    },
  ]}
/>`}
          preview={<BottomAppBarDisabledDemo />}
        />
      </View>

      {/* Props */}
      <PropsTable props={bottomAppBarProps} title="BottomAppBar API Reference" />
      <PropsTable props={bottomAppBarActionProps} title="BottomAppBarAction API Reference" />

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
                Toolbar Role
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                The bar exposes the toolbar role so screen readers announce it as a group of related actions
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                48dp Touch Targets
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Every action sits inside a 48dp pressable, satisfying WCAG 2.5.5 target-size guidance
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Action Labels & States
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Each action announces its accessibilityLabel, and disabled actions report the disabled state
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Safe Area Support
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                The bar automatically extends its background below the 80dp content row to cover the home-indicator inset
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
              Use a bottom app bar for <Text style={{ fontWeight: '600' }}>contextual actions</Text> on a screen; use NavigationBar for switching between top-level destinations
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Keep to 2-4 actions — the component renders at most four, and fewer reads better
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Pass a <Text style={{ fontWeight: '600' }}>lowered</Text> FAB in the fab slot — it sits on the bar, so it shouldn't cast its own large shadow
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Always provide an accessibilityLabel for every action — the icons are the only visible affordance
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
