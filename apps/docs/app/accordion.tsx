import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Accordion, AccordionItem, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const accordionProps: PropDefinition[] = [
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'One or more AccordionItem elements',
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'false',
    description: 'Allow several panels to be open at once. When false, expanding one item collapses the previously open item',
  },
  {
    name: 'expandedIds',
    type: 'string[]',
    description: 'Controlled mode: ids of the currently expanded items. Pair with onChange',
  },
  {
    name: 'defaultExpandedIds',
    type: 'string[]',
    description: 'Uncontrolled mode: ids of the items expanded on first render',
  },
  {
    name: 'onChange',
    type: '(expandedIds: string[]) => void',
    description: 'Called with the next set of expanded ids whenever a header is toggled',
  },
  {
    name: 'divider',
    type: 'boolean',
    default: 'true',
    description: 'Render a hairline (outlineVariant) divider between items',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override for the outer container',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier (forwarded to the container view)',
  },
];

const accordionItemProps: PropDefinition[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Unique id — used by the parent Accordion to track expansion',
  },
  {
    name: 'title',
    type: 'string | ReactNode',
    required: true,
    description: 'Header title. A string gets the standard titleMedium treatment',
  },
  {
    name: 'subtitle',
    type: 'string | ReactNode',
    description: 'Optional supporting text below the title',
  },
  {
    name: 'leading',
    type: 'ReactNode',
    description: 'Optional leading slot (icon / avatar) before the title',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disabled visually and for interaction',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Panel content revealed when the item is expanded',
  },
  {
    name: 'enableHaptics',
    type: 'boolean',
    description: 'Force-enable or force-disable haptic feedback (defaults to theme setting)',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override for the item container',
  },
  {
    name: 'headerStyle',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override for the header row',
  },
  {
    name: 'titleStyle',
    type: 'StyleProp<TextStyle>',
    description: 'Style override for the title text (string titles only)',
  },
  {
    name: 'contentStyle',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override for the panel content wrapper',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label for the header. Defaults to the title when it is a string',
  },
  {
    name: 'accessibilityHint',
    type: 'string',
    description: 'Accessibility hint announced for the header',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test ID for the item container. The header gets `${testID}-header` and the panel `${testID}-panel`',
  },
];

// ─── Previews — each runs inside the MobileFrame's own provider ────────────

function PanelText({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
      {children}
    </Text>
  );
}

function BasicAccordionDemo() {
  const theme = useTheme();
  return (
    <View style={[styles.demoCard, { backgroundColor: theme.colors.surface }]}>
      <Accordion defaultExpandedIds={['shipping']}>
        <AccordionItem id="shipping" title="How long does shipping take?">
          <PanelText>
            Standard shipping takes 3-5 business days. Express orders placed before noon ship the
            same day and arrive within 48 hours.
          </PanelText>
        </AccordionItem>
        <AccordionItem id="returns" title="What is the return policy?">
          <PanelText>
            Items can be returned within 30 days of delivery for a full refund. Return labels are
            generated automatically from your order page.
          </PanelText>
        </AccordionItem>
        <AccordionItem id="warranty" title="Is there a warranty?">
          <PanelText>
            Every product includes a two-year limited warranty covering manufacturing defects.
          </PanelText>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

function MultipleAccordionDemo() {
  const theme = useTheme();
  return (
    <View style={[styles.demoCard, { backgroundColor: theme.colors.surface }]}>
      <Accordion multiple defaultExpandedIds={['profile', 'privacy']}>
        <AccordionItem id="profile" title="Profile">
          <PanelText>Display name, photo, and public bio settings.</PanelText>
        </AccordionItem>
        <AccordionItem id="privacy" title="Privacy">
          <PanelText>Control who can see your activity and contact you.</PanelText>
        </AccordionItem>
        <AccordionItem id="notifications" title="Notifications">
          <PanelText>Choose which events send push and email alerts.</PanelText>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

function RichAccordionDemo() {
  const theme = useTheme();
  return (
    <View style={[styles.demoCard, { backgroundColor: theme.colors.surface }]}>
      <Accordion>
        <AccordionItem
          id="wifi"
          title="Wi-Fi"
          subtitle="Connected to Quartz-5G"
          leading={<Ionicons name="wifi" size={24} color={theme.colors.primary} />}
        >
          <PanelText>Manage saved networks and connection preferences.</PanelText>
        </AccordionItem>
        <AccordionItem
          id="bluetooth"
          title="Bluetooth"
          subtitle="2 devices paired"
          leading={<Ionicons name="bluetooth" size={24} color={theme.colors.primary} />}
        >
          <PanelText>Pair new devices and review connection history.</PanelText>
        </AccordionItem>
        <AccordionItem
          id="storage"
          title="Storage"
          subtitle="84.2 GB of 128 GB used"
          leading={<Ionicons name="server-outline" size={24} color={theme.colors.primary} />}
        >
          <PanelText>See a breakdown of space used by apps and media.</PanelText>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

function DisabledAccordionDemo() {
  const theme = useTheme();
  return (
    <View style={[styles.demoCard, { backgroundColor: theme.colors.surface }]}>
      <Accordion>
        <AccordionItem id="general" title="General">
          <PanelText>Language, region, and appearance preferences.</PanelText>
        </AccordionItem>
        <AccordionItem
          id="advanced"
          title="Advanced"
          subtitle="Requires administrator access"
          disabled
        >
          <PanelText>Hidden while the section is disabled.</PanelText>
        </AccordionItem>
        <AccordionItem id="about" title="About">
          <PanelText>Version 1.1.0 — build 2026.07.</PanelText>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

function ControlledAccordionDemo() {
  const theme = useTheme();
  const [expandedIds, setExpandedIds] = useState<string[]>(['step-1']);
  return (
    <View style={{ width: '100%', gap: 12 }}>
      <View style={[styles.demoCard, { backgroundColor: theme.colors.surface }]}>
        <Accordion expandedIds={expandedIds} onChange={setExpandedIds}>
          <AccordionItem id="step-1" title="1. Create an account">
            <PanelText>Sign up with your email address to get started.</PanelText>
          </AccordionItem>
          <AccordionItem id="step-2" title="2. Verify your email">
            <PanelText>Click the link we sent you to confirm your address.</PanelText>
          </AccordionItem>
          <AccordionItem id="step-3" title="3. Set up your workspace">
            <PanelText>Invite teammates and pick a theme for your project.</PanelText>
          </AccordionItem>
        </Accordion>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Button variant="tonal" size="small" onPress={() => setExpandedIds(['step-2'])}>
          Jump to step 2
        </Button>
        <Button variant="outlined" size="small" onPress={() => setExpandedIds([])}>
          Collapse all
        </Button>
      </View>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        Expanded: {expandedIds.length > 0 ? expandedIds.join(', ') : 'none'}
      </Text>
    </View>
  );
}

export default function AccordionDocPage() {
  const theme = useTheme();

  return (
    <DocLayout
      title="Accordion"
      description="Expandable panels that progressively disclose content — single or multi-expand, controlled or uncontrolled"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Accordions vertically stack sections of related content behind pressable headers. Quartz UI's
          Accordion is a compound component: the parent Accordion manages which panels are open, while
          each AccordionItem renders a header with an animated chevron and a collapsible panel. Panel
          animations respect the OS reduce-motion preference.
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
            {`import { Accordion, AccordionItem } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Examples
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          By default the accordion behaves like an FAQ: opening one panel closes the previous one.
          Every mode works uncontrolled out of the box, or fully controlled via expandedIds + onChange.
        </Text>

        {/* Basic */}
        <CodePlayground frameContentLayout="top"
          title="Basic FAQ"
          description="Single-expand accordion — opening a panel collapses the previous one"
          code={`<Accordion defaultExpandedIds={['shipping']}>
  <AccordionItem id="shipping" title="How long does shipping take?">
    <Text>Standard shipping takes 3-5 business days...</Text>
  </AccordionItem>
  <AccordionItem id="returns" title="What is the return policy?">
    <Text>Items can be returned within 30 days...</Text>
  </AccordionItem>
  <AccordionItem id="warranty" title="Is there a warranty?">
    <Text>Every product includes a two-year warranty...</Text>
  </AccordionItem>
</Accordion>`}
          preview={<BasicAccordionDemo />}
        />

        {/* Multiple */}
        <CodePlayground frameContentLayout="top"
          title="Multiple Expand"
          description="Set multiple to keep several panels open at once"
          code={`<Accordion multiple defaultExpandedIds={['profile', 'privacy']}>
  <AccordionItem id="profile" title="Profile">
    <Text>Display name, photo, and public bio settings.</Text>
  </AccordionItem>
  <AccordionItem id="privacy" title="Privacy">
    <Text>Control who can see your activity.</Text>
  </AccordionItem>
  <AccordionItem id="notifications" title="Notifications">
    <Text>Choose which events send alerts.</Text>
  </AccordionItem>
</Accordion>`}
          preview={<MultipleAccordionDemo />}
        />

        {/* Leading + subtitle */}
        <CodePlayground frameContentLayout="top"
          title="Leading Icons & Subtitles"
          description="Headers support a leading slot and supporting text"
          code={`<Accordion>
  <AccordionItem
    id="wifi"
    title="Wi-Fi"
    subtitle="Connected to Quartz-5G"
    leading={<Ionicons name="wifi" size={24} />}
  >
    <Text>Manage saved networks...</Text>
  </AccordionItem>
  <AccordionItem
    id="bluetooth"
    title="Bluetooth"
    subtitle="2 devices paired"
    leading={<Ionicons name="bluetooth" size={24} />}
  >
    <Text>Pair new devices...</Text>
  </AccordionItem>
</Accordion>`}
          preview={<RichAccordionDemo />}
        />

        {/* Disabled */}
        <CodePlayground frameContentLayout="top"
          title="Disabled Item"
          description="Disabled items dim and skip interaction while staying visible"
          code={`<Accordion>
  <AccordionItem id="general" title="General">
    <Text>Language, region, and appearance.</Text>
  </AccordionItem>
  <AccordionItem
    id="advanced"
    title="Advanced"
    subtitle="Requires administrator access"
    disabled
  >
    <Text>Hidden while the section is disabled.</Text>
  </AccordionItem>
</Accordion>`}
          preview={<DisabledAccordionDemo />}
        />

        {/* Controlled */}
        <CodePlayground frameContentLayout="top"
          title="Controlled"
          description="Own the expansion state — drive it from anywhere in your app"
          code={`const [expandedIds, setExpandedIds] = useState(['step-1']);

<Accordion expandedIds={expandedIds} onChange={setExpandedIds}>
  <AccordionItem id="step-1" title="1. Create an account">
    <Text>Sign up with your email address.</Text>
  </AccordionItem>
  <AccordionItem id="step-2" title="2. Verify your email">
    <Text>Click the link we sent you.</Text>
  </AccordionItem>
  <AccordionItem id="step-3" title="3. Set up your workspace">
    <Text>Invite teammates and pick a theme.</Text>
  </AccordionItem>
</Accordion>

<Button onPress={() => setExpandedIds(['step-2'])}>
  Jump to step 2
</Button>`}
          preview={<ControlledAccordionDemo />}
        />
      </View>

      {/* Props */}
      <PropsTable props={accordionProps} title="Accordion API Reference" />
      <PropsTable props={accordionItemProps} title="AccordionItem API Reference" />

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
                Expanded State
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Each header is a button that reports accessibilityState expanded, so screen readers announce "expanded" or "collapsed"
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Panel Linking
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Panels are programmatically linked to their headers so assistive tech reads the revealed content in context
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Reduce-Motion Respect
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Chevron and panel animations collapse to instant transitions when the OS reduce-motion preference is on
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Disabled Semantics
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Disabled items expose accessibilityState disabled in addition to the dimmed visual treatment
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
              Use single-expand (the default) for FAQs and step-by-step flows; reserve <Text style={{ fontWeight: '600' }}>multiple</Text> for settings-style groups users compare side by side
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Keep titles short and scannable — put detail in the panel, not the header
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Give every item a stable, unique <Text style={{ fontWeight: '600' }}>id</Text> — expansion state is tracked by id, so avoid array indexes
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Avoid nesting accordions — flatten the hierarchy or split content across screens instead
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
  demoCard: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
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
