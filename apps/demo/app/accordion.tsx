/**
 * Quartz UI Demo - Accordion Demo
 *
 * Demonstrates the Accordion + AccordionItem compound component:
 * single & multi expand, leading icons, subtitles, disabled items,
 * and fully controlled mode.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Accordion, AccordionItem, Button, Switch, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

const ALL_CONTROLLED_IDS = ['ctl-design', 'ctl-develop', 'ctl-deliver'];

function IconBadge({ icon, color }: { icon: keyof typeof Ionicons.glyphMap; color: string }) {
  return (
    <View style={[styles.iconBadge, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
  );
}

export default function AccordionScreen() {
  const theme = useTheme();
  const [controlledIds, setControlledIds] = useState<string[]>(['ctl-design']);
  const [autoSync, setAutoSync] = useState(true);
  const [cellularBackup, setCellularBackup] = useState(false);

  return (
    <DemoLayout
      title="Accordion"
      subtitle="Expandable panels for layered content"
      icon="chevron-expand"
      gradient={['#11998e', '#38ef7d']}
    >
      {/* FAQ — single expand (default) */}
      <Section title="FAQ" subtitle="Single-expand — opening one closes the rest" index={0}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Accordion defaultExpandedIds={['faq-what']}>
            <AccordionItem id="faq-what" title="What is Quartz UI?">
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Quartz UI is a premium Material Design 3 component library for React
                Native and Expo. Every component ships with 60 FPS Reanimated motion,
                full theming, and accessibility built in.
              </Text>
            </AccordionItem>
            <AccordionItem id="faq-expo" title="Does it work with Expo?">
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Yes — Quartz UI is built for Expo SDK 54 and works in Expo Go, dev
                clients, and bare React Native projects alike. No native configuration
                is required.
              </Text>
            </AccordionItem>
            <AccordionItem id="faq-theming" title="How does dark mode work?">
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Wrap your app in QuartzProvider and every component follows the active
                color scheme automatically. You can also generate complete light and
                dark themes from a single seed color with createDynamicThemes.
              </Text>
            </AccordionItem>
            <AccordionItem id="faq-a11y" title="Is it accessible?">
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Headers are announced as buttons with their expanded state, panels are
                labelled by their headers, and all animations respect the system
                reduce-motion setting.
              </Text>
            </AccordionItem>
          </Accordion>
        </Surface>
      </Section>

      {/* Multiple expand */}
      <Section title="Multiple Expand" subtitle="Several panels can stay open at once" index={1}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Accordion multiple defaultExpandedIds={['step-install', 'step-wrap']}>
            <AccordionItem id="step-install" title="1. Install the package">
              <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceContainerHighest }]}>
                <Text variant="bodySmall" style={[styles.codeText, { color: theme.colors.onSurface }]}>
                  npm install quartz-ui
                </Text>
              </View>
            </AccordionItem>
            <AccordionItem id="step-wrap" title="2. Wrap your app">
              <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceContainerHighest }]}>
                <Text variant="bodySmall" style={[styles.codeText, { color: theme.colors.onSurface }]}>
                  {'<QuartzProvider>\n  <App />\n</QuartzProvider>'}
                </Text>
              </View>
            </AccordionItem>
            <AccordionItem id="step-import" title="3. Import components">
              <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceContainerHighest }]}>
                <Text variant="bodySmall" style={[styles.codeText, { color: theme.colors.onSurface }]}>
                  {"import { Accordion, AccordionItem } from 'quartz-ui';"}
                </Text>
              </View>
            </AccordionItem>
          </Accordion>
        </Surface>
      </Section>

      {/* Leading icons + subtitles */}
      <Section title="Rich Headers" subtitle="Leading icons and supporting subtitles" index={2}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Accordion>
            <AccordionItem
              id="rich-profile"
              title="Profile"
              subtitle="Name, photo & visibility"
              leading={<IconBadge icon="person" color="#6366f1" />}
            >
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Control how your profile appears to other members. Changes are synced
                across all of your devices instantly.
              </Text>
            </AccordionItem>
            <AccordionItem
              id="rich-sync"
              title="Sync & Backup"
              subtitle="Automatic cloud backup"
              leading={<IconBadge icon="cloud-upload" color="#0ea5e9" />}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLabel}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    Auto sync
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Sync whenever changes are made
                  </Text>
                </View>
                <Switch value={autoSync} onValueChange={setAutoSync} />
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingLabel}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    Use cellular data
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Back up without Wi-Fi
                  </Text>
                </View>
                <Switch value={cellularBackup} onValueChange={setCellularBackup} />
              </View>
            </AccordionItem>
            <AccordionItem
              id="rich-notifications"
              title="Notifications"
              subtitle="Push, email & digests"
              leading={<IconBadge icon="notifications" color="#f59e0b" />}
            >
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Choose which events reach you in real time and which arrive bundled in
                a daily digest.
              </Text>
            </AccordionItem>
          </Accordion>
        </Surface>
      </Section>

      {/* Disabled item */}
      <Section title="Disabled Items" subtitle="Locked panels stay closed and dimmed" index={3}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Accordion>
            <AccordionItem
              id="plan-usage"
              title="Usage overview"
              subtitle="Included in every plan"
              leading={<IconBadge icon="stats-chart" color="#10b981" />}
            >
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                You have used 23.5 GB of 50 GB this month. Usage resets on the first
                day of each billing cycle.
              </Text>
            </AccordionItem>
            <AccordionItem
              id="plan-analytics"
              title="Advanced analytics"
              subtitle="Requires the Pro plan"
              leading={<IconBadge icon="lock-closed" color="#9ca3af" />}
              disabled
            >
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Upgrade to unlock cohort analysis and retention curves.
              </Text>
            </AccordionItem>
            <AccordionItem
              id="plan-billing"
              title="Billing history"
              subtitle="Invoices & receipts"
              leading={<IconBadge icon="receipt" color="#8b5cf6" />}
            >
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Download PDF invoices for any past billing period, or update the email
                address that receives receipts.
              </Text>
            </AccordionItem>
          </Accordion>
        </Surface>
      </Section>

      {/* Controlled */}
      <Section title="Controlled Mode" subtitle="Drive expansion from external state" index={4}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.controlsRow}>
            <Button
              variant="tonal"
              onPress={() => setControlledIds(ALL_CONTROLLED_IDS)}
              style={styles.controlButton}
            >
              Expand All
            </Button>
            <Button
              variant="outlined"
              onPress={() => setControlledIds([])}
              style={styles.controlButton}
            >
              Collapse All
            </Button>
          </View>
          <Text
            variant="labelMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}
          >
            {controlledIds.length} of {ALL_CONTROLLED_IDS.length} panels expanded
          </Text>
          <Accordion multiple expandedIds={controlledIds} onChange={setControlledIds}>
            <AccordionItem
              id="ctl-design"
              title="Design"
              leading={<IconBadge icon="color-palette" color="#ec4899" />}
            >
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Wireframes approved and the component inventory is complete. Tokens
                are synced with the Figma library.
              </Text>
            </AccordionItem>
            <AccordionItem
              id="ctl-develop"
              title="Develop"
              leading={<IconBadge icon="code-slash" color="#6366f1" />}
            >
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Feature branches are green in CI. Two pull requests are awaiting
                review before the merge window closes.
              </Text>
            </AccordionItem>
            <AccordionItem
              id="ctl-deliver"
              title="Deliver"
              leading={<IconBadge icon="rocket" color="#f97316" />}
            >
              <Text variant="bodyMedium" style={[styles.panelText, { color: theme.colors.onSurfaceVariant }]}>
                Staged rollout begins Monday at 10% of traffic, ramping to 100% over
                three days with automatic rollback guards.
              </Text>
            </AccordionItem>
          </Accordion>
        </Surface>
      </Section>

      {/* Guidelines */}
      <Section title="Design Guidelines" subtitle="Accordion best practices" index={5}>
        <View style={[styles.guideCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons name="information-circle" size={32} color={theme.colors.onPrimaryContainer} />
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 16, fontWeight: '600' }}>
            Accordion Best Practices
          </Text>
          <View style={styles.guideList}>
            {[
              'Use single-expand for FAQs so one answer stays in focus',
              'Use multiple-expand for checklists and settings groups',
              'Keep titles short — details belong in the subtitle or panel',
              'Lead with icons when items represent distinct categories',
              'Avoid nesting accordions inside accordion panels',
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
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 8,
  },
  panelText: {
    lineHeight: 21,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBlock: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLabel: {
    flex: 1,
    marginEnd: 16,
    gap: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  controlButton: {
    flex: 1,
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
