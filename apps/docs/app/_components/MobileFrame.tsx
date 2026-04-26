/**
 * Quartz UI docs - Mobile preview frame
 *
 * Wraps a component preview in an iPhone-style bezel so it reads as a "real
 * device" demo. Used by CodePlayground by default. Pass `framed={false}` to
 * the playground for previews that need full-bleed rendering (large layout
 * primitives, navigation containers, etc.).
 *
 * Design: iPhone 15 Pro inspired — flat bezel, dynamic island, status bar,
 * home indicator. Themed inner screen. Subtle shadow.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { Text, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';

interface MobileFrameProps {
  children: React.ReactNode;
  /** Outer device width in dp. Scales down on narrow viewports. Default 320. */
  width?: number;
  /** Min content height inside the screen. Default 480. */
  minHeight?: number;
  /** Screen background — defaults to the theme's `background`. */
  screenBackground?: string;
  /** Show status bar + home indicator. Defaults to true. */
  showChrome?: boolean;
  /**
   * How content lays out inside the screen:
   *   - `'center'` (default): centered + padded — best for individual
   *     components or small previews
   *   - `'top'`: top-aligned + padded — best for lists, forms
   *   - `'full'`: edge-to-edge with no padding — best for navigation chrome
   *     (AppBar, NavigationBar) and full-bleed components (Drawer, Sheet)
   */
  contentLayout?: 'center' | 'top' | 'full';
  /** Outer wrapper style override. */
  style?: ViewStyle;
}

export function MobileFrame({
  children,
  width: requestedWidth = 320,
  minHeight = 480,
  screenBackground,
  showChrome = true,
  contentLayout = 'center',
  style,
}: MobileFrameProps) {
  const theme = useTheme();
  const { width: viewportWidth } = useWindowDimensions();

  // Scale down on narrow viewports — never wider than 90% of the viewport,
  // capped at the requested width.
  const width = Math.min(requestedWidth, Math.floor(viewportWidth * 0.9));
  const height = minHeight + (showChrome ? 80 : 0); // chrome adds ~80dp

  // Bezel color stays dark even in light theme — devices are dark frames.
  const bezelColor = '#0e0e10';
  const bezelHighlight = '#26262a';
  const screenBg = screenBackground || theme.colors.background;

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.bezel,
          {
            width,
            minHeight: height,
            backgroundColor: bezelColor,
            borderColor: bezelHighlight,
          },
        ]}
      >
        {/* Outer bezel highlight ring (subtle inner border) */}
        <View
          pointerEvents="none"
          style={[styles.bezelRing, { borderColor: bezelHighlight }]}
        />

        {/* Inner screen */}
        <View style={[styles.screen, { backgroundColor: screenBg }]}>
          {showChrome && (
            <View style={styles.statusBar}>
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.onSurface, fontSize: 13, fontWeight: '700' }}
              >
                9:41
              </Text>
              <View style={styles.statusIcons}>
                <Ionicons name="cellular" size={13} color={theme.colors.onSurface} />
                <Ionicons name="wifi" size={14} color={theme.colors.onSurface} />
                <View style={[styles.battery, { borderColor: theme.colors.onSurface }]}>
                  <View
                    style={[styles.batteryFill, { backgroundColor: theme.colors.onSurface }]}
                  />
                  <View
                    style={[styles.batteryNub, { backgroundColor: theme.colors.onSurface }]}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Dynamic island */}
          {showChrome && <View style={styles.dynamicIsland} />}

          {/* Content */}
          <View
            style={[
              styles.screenContentBase,
              contentLayout === 'full' && styles.screenContentFull,
              contentLayout === 'top' && styles.screenContentTop,
              contentLayout === 'center' && styles.screenContentCenter,
            ]}
          >
            {children}
          </View>

          {/* Home indicator */}
          {showChrome && (
            <View style={styles.homeIndicatorWrap}>
              <View style={[styles.homeIndicator, { backgroundColor: theme.colors.onSurface }]} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  bezel: {
    borderRadius: 44,
    padding: 6,
    borderWidth: 1,
    // Subtle shadow to lift the device off the page.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 36,
    elevation: 12,
    overflow: 'hidden',
  },
  bezelRing: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 40,
    borderWidth: 1,
  },
  screen: {
    flex: 1,
    borderRadius: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 14,
    height: 38,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  battery: {
    width: 22,
    height: 11,
    borderRadius: 3,
    borderWidth: 1,
    padding: 1,
    flexDirection: 'row',
    marginLeft: 2,
    position: 'relative',
  },
  batteryFill: {
    flex: 1,
    borderRadius: 1,
  },
  batteryNub: {
    position: 'absolute',
    right: -2,
    top: 3,
    width: 1.5,
    height: 4,
    borderRadius: 1,
  },
  dynamicIsland: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    width: 96,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0a0a0c',
    zIndex: 10,
  },
  screenContentBase: {
    flex: 1,
  },
  screenContentCenter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  screenContentTop: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'stretch',
    gap: 12,
  },
  screenContentFull: {
    // Edge-to-edge — for nav bars, drawers, sheets, dialogs.
  },
  homeIndicatorWrap: {
    paddingTop: 6,
    paddingBottom: 8,
    alignItems: 'center',
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
});
