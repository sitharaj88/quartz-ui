/**
 * Quartz UI - Accordion Component
 *
 * Material 3 expansion panels, built for production:
 *   • compound pattern — <Accordion> + <AccordionItem> wired via context
 *   • single-expand (default) or multi-expand (`multiple`)
 *   • controlled (`expandedIds`/`onChange`) and uncontrolled (`defaultExpandedIds`)
 *   • animated chevron rotation + measured-height panel reveal (reanimated)
 *   • respects OS reduce-motion (snaps without animation)
 *   • headers are buttons with accessibilityState.expanded; panels are
 *     labelled by their header
 *   • haptics on toggle (theme-gated), MD3 surface/outlineVariant styling
 */

import React, {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { withAlpha } from '../../utils/color';
import { useInteractiveState, useReducedMotion } from '../../hooks';
import { duration } from '../../tokens/motion';
import { Text } from '../Text';
import {
  AccordionContextValue,
  AccordionItemProps,
  AccordionProps,
} from './Accordion.types';

const AccordionContext = createContext<AccordionContextValue | null>(null);

// ─── Chevron ───────────────────────────────────────────────────────────────

/**
 * Lightweight downward chevron made from a rotated bordered square — avoids
 * pulling in an icon library as a peer dep (same trick as Carousel's arrows).
 */
function Chevron({ color }: { color: string }) {
  return (
    <View style={chevronStyles.box}>
      <View style={[chevronStyles.tick, { borderColor: color }]} />
    </View>
  );
}

const chevronStyles = StyleSheet.create({
  box: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // Bottom+right borders form an L; +45° turns the corner downward: ⌄
    transform: [{ rotate: '45deg' }],
  },
  tick: {
    width: 9,
    height: 9,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});

// ─── Accordion (container) ─────────────────────────────────────────────────

const AccordionImpl = forwardRef<View, AccordionProps>(function Accordion(
  {
    children,
    multiple = false,
    expandedIds,
    defaultExpandedIds,
    onChange,
    divider = true,
    style,
    testID,
  },
  ref
): React.ReactElement {
  const theme = useTheme();

  const isControlled = expandedIds !== undefined;
  const [internalIds, setInternalIds] = useState<string[]>(
    () => defaultExpandedIds ?? []
  );
  const currentIds = isControlled ? expandedIds : internalIds;

  // Ref keeps `toggle` referentially stable across expansion changes.
  const currentIdsRef = useRef(currentIds);
  currentIdsRef.current = currentIds;

  const toggle = useCallback(
    (id: string) => {
      const prev = currentIdsRef.current;
      const next = prev.includes(id)
        ? prev.filter((openId) => openId !== id)
        : multiple
          ? [...prev, id]
          : [id];
      if (!isControlled) {
        setInternalIds(next);
      }
      onChange?.(next);
    },
    [multiple, isControlled, onChange]
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      expandedIds: currentIds,
      isExpanded: (id: string) => currentIds.includes(id),
      toggle,
    }),
    [currentIds, toggle]
  );

  // Interleave hairline dividers between items.
  const items = React.Children.toArray(children);

  return (
    <AccordionContext.Provider value={contextValue}>
      <View
        ref={ref}
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.shape.medium,
          },
          style,
        ]}
        testID={testID}
      >
        {items.map((child, index) => (
          <React.Fragment key={`accordion-slot-${index}`}>
            {index > 0 && divider && (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outlineVariant },
                ]}
              />
            )}
            {child}
          </React.Fragment>
        ))}
      </View>
    </AccordionContext.Provider>
  );
});

AccordionImpl.displayName = 'Accordion';

/**
 * Accordion — Material 3 expansion panel group. Manages single/multi expand,
 * controlled and uncontrolled modes for its `<AccordionItem>` children.
 */
export const Accordion = memo(AccordionImpl);

// ─── AccordionItem ─────────────────────────────────────────────────────────

const PANEL_TIMING = { duration: duration.medium1 };
const CHEVRON_TIMING = { duration: duration.medium1 };

const AccordionItemImpl = forwardRef<View, AccordionItemProps>(
  function AccordionItem(
    {
      id,
      title,
      subtitle,
      leading,
      disabled = false,
      children,
      enableHaptics,
      style,
      headerStyle,
      titleStyle,
      contentStyle,
      accessibilityLabel,
      accessibilityHint,
      testID,
    },
    ref
  ): React.ReactElement {
    const theme = useTheme();
    const reduceMotion = useReducedMotion();
    const context = useContext(AccordionContext);

    const isExpanded = context?.isExpanded(id) ?? false;
    const toggle = context?.toggle;

    // ─── Interactive state (header press/hover/focus) ────────────────
    const interactive = useInteractiveState({ disabled });
    const { pressed, hovered, focused, handlers } = interactive;

    // ─── Animated values ──────────────────────────────────────────────
    // openProgress drives the chevron (0 = collapsed, 1 = expanded).
    const openProgress = useSharedValue(isExpanded ? 1 : 0);
    // Measured-height reveal: panel animates between 0 and content height.
    const panelHeight = useSharedValue(0);
    const contentHeight = useSharedValue(0);
    const stateLayerProgress = useSharedValue(0);

    // Panel stays mounted while the collapse animation plays out.
    const [mounted, setMounted] = useState(isExpanded);
    const isFirstRenderRef = useRef(true);
    const expandedRef = useRef(isExpanded);
    expandedRef.current = isExpanded;

    // Unmount is scheduled with a plain timer (matching the animation
    // duration) rather than the reanimated completion callback, so it works
    // identically on-device, on web, and under test renderers.
    const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(
      () => () => {
        if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      },
      []
    );

    // Drive the state layer from interaction state (matches Button).
    useEffect(() => {
      const target = pressed || hovered || focused ? 1 : 0;
      stateLayerProgress.value = reduceMotion
        ? target
        : withTiming(target, { duration: duration.short3 });
    }, [pressed, hovered, focused, reduceMotion, stateLayerProgress]);

    // Expand / collapse when the parent's state changes.
    useEffect(() => {
      if (isFirstRenderRef.current) {
        // Initial values were seeded above; the first content layout snaps
        // a default-expanded panel to its measured height.
        isFirstRenderRef.current = false;
        return;
      }
      if (isExpanded) {
        if (collapseTimerRef.current) {
          clearTimeout(collapseTimerRef.current);
          collapseTimerRef.current = null;
        }
        setMounted(true);
        openProgress.value = reduceMotion ? 1 : withTiming(1, CHEVRON_TIMING);
        // Height is known from a previous mount — animate straight to it.
        // (First-ever expand animates from the content's onLayout instead.)
        if (contentHeight.value > 0) {
          panelHeight.value = reduceMotion
            ? contentHeight.value
            : withTiming(contentHeight.value, PANEL_TIMING);
        }
      } else {
        openProgress.value = reduceMotion ? 0 : withTiming(0, CHEVRON_TIMING);
        if (reduceMotion) {
          panelHeight.value = 0;
          setMounted(false);
        } else {
          panelHeight.value = withTiming(0, PANEL_TIMING);
          collapseTimerRef.current = setTimeout(() => {
            collapseTimerRef.current = null;
            setMounted(false);
          }, PANEL_TIMING.duration);
        }
      }
    }, [isExpanded, reduceMotion, openProgress, panelHeight, contentHeight]);

    // Measure the panel content. Snap (no animation) when the item mounted
    // already expanded; animate when the size changes while open.
    const mountedExpandedRef = useRef(isExpanded);
    const handleContentLayout = useCallback(
      (event: LayoutChangeEvent) => {
        const measured = Math.round(event.nativeEvent.layout.height);
        const isInitialLayout = mountedExpandedRef.current;
        mountedExpandedRef.current = false;
        if (measured === contentHeight.value) return;
        contentHeight.value = measured;
        if (!expandedRef.current) return;
        panelHeight.value =
          isInitialLayout || reduceMotion
            ? measured
            : withTiming(measured, PANEL_TIMING);
      },
      [reduceMotion, contentHeight, panelHeight]
    );

    const chevronAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${openProgress.value * 180}deg` }],
    }));

    const panelAnimatedStyle = useAnimatedStyle(() => ({
      height: panelHeight.value,
    }));

    const stateLayerAnimatedStyle = useAnimatedStyle(() => ({
      opacity: stateLayerProgress.value * 0.08,
    }));

    // ─── Press handling ────────────────────────────────────────────────
    const handlePress = useCallback(() => {
      if (disabled) return;
      const hapticsOn = enableHaptics ?? theme.accessibility.hapticFeedback;
      if (hapticsOn && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
          // Haptics may fail on simulator — non-fatal.
        });
      }
      toggle?.(id);
    }, [disabled, enableHaptics, theme.accessibility.hapticFeedback, toggle, id]);

    if (!context) {
      throw new Error(
        '[Quartz UI] <AccordionItem> must be rendered inside an <Accordion>.'
      );
    }

    // ─── Colors ────────────────────────────────────────────────────────
    // 38% opacity for disabled content, matching the List convention.
    const titleColor = disabled
      ? withAlpha(theme.colors.onSurface, 0.38)
      : theme.colors.onSurface;
    const subtitleColor = disabled
      ? withAlpha(theme.colors.onSurface, 0.38)
      : theme.colors.onSurfaceVariant;
    const chevronColor = disabled
      ? withAlpha(theme.colors.onSurface, 0.38)
      : theme.colors.onSurfaceVariant;

    // ─── Accessibility ─────────────────────────────────────────────────
    const a11yLabel =
      accessibilityLabel ?? (typeof title === 'string' ? title : undefined);
    const headerNativeId = `quartz-accordion-${id}-header`;

    return (
      <View ref={ref} style={style} testID={testID}>
        <Pressable
          nativeID={headerNativeId}
          style={[styles.header, headerStyle]}
          onPress={handlePress}
          onPressIn={handlers.onPressIn}
          onPressOut={handlers.onPressOut}
          onHoverIn={handlers.onHoverIn}
          onHoverOut={handlers.onHoverOut}
          onFocus={handlers.onFocus}
          onBlur={handlers.onBlur}
          disabled={disabled}
          accessible
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ expanded: isExpanded, disabled }}
          focusable={!disabled}
          testID={testID ? `${testID}-header` : undefined}
        >
          {/* Animated state layer (hover/focus/press) */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.colors.onSurface },
              stateLayerAnimatedStyle,
            ]}
            pointerEvents="none"
          />

          {leading && <View style={styles.leading}>{leading}</View>}

          <View style={styles.headerText}>
            {typeof title === 'string' ? (
              <Text
                variant="titleMedium"
                style={[{ color: titleColor }, titleStyle]}
                numberOfLines={2}
              >
                {title}
              </Text>
            ) : (
              title
            )}
            {subtitle != null &&
              (typeof subtitle === 'string' ? (
                <Text
                  variant="bodyMedium"
                  style={[styles.subtitle, { color: subtitleColor }]}
                  numberOfLines={2}
                >
                  {subtitle}
                </Text>
              ) : (
                subtitle
              ))}
          </View>

          <Animated.View style={[styles.trailing, chevronAnimatedStyle]}>
            <Chevron color={chevronColor} />
          </Animated.View>
        </Pressable>

        {/* Collapsible panel — measured-height reveal. Content renders in an
            absolutely-positioned inner view so the animated outer height is
            the only thing driving layout. */}
        {mounted && (
          <Animated.View
            style={[styles.panel, panelAnimatedStyle]}
            accessibilityLabelledBy={headerNativeId}
            accessibilityLabel={a11yLabel ? `${a11yLabel}, content` : undefined}
            testID={testID ? `${testID}-panel` : undefined}
          >
            <View style={styles.panelInner} onLayout={handleContentLayout}>
              <View style={[styles.panelContent, contentStyle]}>{children}</View>
            </View>
          </Animated.View>
        )}
      </View>
    );
  }
);

AccordionItemImpl.displayName = 'AccordionItem';

/**
 * AccordionItem — a single expansion panel: pressable header (title,
 * optional subtitle/leading slot, animated chevron) + collapsible content.
 */
export const AccordionItem = memo(AccordionItemImpl);

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: 12,
    paddingStart: 16,
    paddingEnd: 16,
    overflow: 'hidden',
  },
  leading: {
    marginEnd: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 2,
  },
  trailing: {
    marginStart: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  panel: {
    overflow: 'hidden',
  },
  panelInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  panelContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default Accordion;
