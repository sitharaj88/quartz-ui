/**
 * Quartz UI - Accordion Types
 *
 * Material 3 expansion panels. A compound component:
 *   <Accordion> manages which panels are open (single- or multi-expand,
 *   controlled or uncontrolled) and <AccordionItem> renders a pressable
 *   header + an animated collapsible panel.
 */

import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface AccordionProps {
  /** One or more `<AccordionItem>` elements. */
  children: ReactNode;

  // ─── Expansion behavior ───────────────────────────────────────────────
  /**
   * Allow several panels to be open at once. When `false` (default),
   * expanding one item collapses the previously open item.
   */
  multiple?: boolean;
  /**
   * Controlled mode: the ids of the currently expanded items. When set, the
   * accordion no longer manages its own state — pair with `onChange`.
   */
  expandedIds?: string[];
  /** Uncontrolled mode: ids of the items expanded on first render. */
  defaultExpandedIds?: string[];
  /** Called with the next set of expanded ids whenever a header is toggled. */
  onChange?: (expandedIds: string[]) => void;

  // ─── Appearance ───────────────────────────────────────────────────────
  /** Render a hairline (`outlineVariant`) divider between items. Defaults to `true`. */
  divider?: boolean;
  /** Style override for the outer container. */
  style?: StyleProp<ViewStyle>;

  /** Test ID (forwarded to the container view). */
  testID?: string;
}

export interface AccordionItemProps {
  /** Unique id — used by the parent `<Accordion>` to track expansion. */
  id: string;

  // ─── Header content ───────────────────────────────────────────────────
  /** Header title. A string gets the standard `titleMedium` treatment. */
  title: ReactNode;
  /** Optional supporting text below the title. */
  subtitle?: ReactNode;
  /** Optional leading slot (icon / avatar) before the title. */
  leading?: ReactNode;

  // ─── State ────────────────────────────────────────────────────────────
  /** Disabled visually and for interaction. */
  disabled?: boolean;

  /** Panel content revealed when the item is expanded. */
  children?: ReactNode;

  // ─── Behavior ─────────────────────────────────────────────────────────
  /** Force-enable or force-disable haptic feedback (defaults to theme setting). */
  enableHaptics?: boolean;

  // ─── Style overrides ──────────────────────────────────────────────────
  /** Style override for the item container. */
  style?: StyleProp<ViewStyle>;
  /** Style override for the header row. */
  headerStyle?: StyleProp<ViewStyle>;
  /** Style override for the title text (string titles only). */
  titleStyle?: StyleProp<TextStyle>;
  /** Style override for the panel content wrapper. */
  contentStyle?: StyleProp<ViewStyle>;

  // ─── Accessibility ────────────────────────────────────────────────────
  /** Defaults to the title when it is a string. */
  accessibilityLabel?: string;
  accessibilityHint?: string;

  /**
   * Test ID for the item container. The header pressable gets
   * `${testID}-header` and the panel gets `${testID}-panel`.
   */
  testID?: string;
}

/** Internal — the contract between `<Accordion>` and its items. */
export interface AccordionContextValue {
  /** Ids of the currently expanded items. */
  expandedIds: readonly string[];
  /** Whether the given item is expanded. */
  isExpanded: (id: string) => boolean;
  /** Toggle the given item (respects single/multi-expand mode). */
  toggle: (id: string) => void;
}
