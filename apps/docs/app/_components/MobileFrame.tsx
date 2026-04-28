/**
 * Quartz UI docs - Mobile preview frame
 *
 * Wraps a component preview in an iPhone-style bezel so it reads as a "real
 * device" demo. Used by CodePlayground by default. Pass `framed={false}` to
 * the playground for previews that need full-bleed rendering (large layout
 * primitives, navigation containers, etc.).
 *
 * Design: iPhone 15 Pro inspired — visible titanium-feel bezel, dynamic
 * island with camera dot, status bar, home indicator, side buttons. Themed
 * inner screen. Layered shadow for depth.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  QuartzProvider,
  QuartzViewportProvider,
  Text,
  useQuartzTheme,
  useTheme,
} from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';

interface MobileFrameProps {
  children: React.ReactNode;
  /** Outer device width in dp. Scales down on narrow viewports. Default 360. */
  width?: number;
  /** Min content height inside the screen. Default 640. */
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

// Bezel padding — thick enough to clearly read as a phone bezel.
const BEZEL_PADDING = 11;

interface FramedScreenProps {
  children: React.ReactNode;
  showChrome: boolean;
  contentLayout: 'center' | 'top' | 'full';
  screenBackground?: string;
  screenWidth: number;
  minHeight: number;
}

/**
 * Renders the phone screen — chrome (status bar, dynamic island, home
 * indicator) and content. Runs under the inner QuartzProvider so chrome
 * tracks the local theme: toggling theme inside the preview flips the
 * status-bar/home-indicator colors without affecting the docs site.
 */
function FramedScreen({
  children,
  showChrome,
  contentLayout,
  screenBackground,
  screenWidth,
  minHeight,
}: FramedScreenProps) {
  const theme = useTheme();
  const screenBg = screenBackground || theme.colors.background;

  return (
    <View style={[styles.screen, { backgroundColor: screenBg }]}>
      {showChrome && (
        <View style={styles.statusBar}>
          <Text
            variant="labelMedium"
            style={{
              color: theme.colors.onSurface,
              fontSize: 14,
              fontWeight: '700',
              letterSpacing: 0.2,
            }}
          >
            9:41
          </Text>
          <View style={styles.statusIcons}>
            <Ionicons name="cellular" size={13} color={theme.colors.onSurface} />
            <Ionicons name="wifi" size={14} color={theme.colors.onSurface} />
            <View style={[styles.battery, { borderColor: theme.colors.onSurface }]}>
              <View style={[styles.batteryFill, { backgroundColor: theme.colors.onSurface }]} />
              <View style={[styles.batteryNub, { backgroundColor: theme.colors.onSurface }]} />
            </View>
          </View>
        </View>
      )}

      {/* Dynamic island */}
      {showChrome && (
        <View style={styles.dynamicIsland} pointerEvents="none">
          <View style={styles.dynamicIslandCamera} />
        </View>
      )}

      {/* Content */}
      <QuartzViewportProvider
        width={screenWidth}
        height={minHeight}
        isContained
        style={[
          styles.screenContentBase,
          contentLayout === 'full' && styles.screenContentFull,
          contentLayout === 'top' && styles.screenContentTop,
          contentLayout === 'center' && styles.screenContentCenter,
        ]}
      >
        {children}
      </QuartzViewportProvider>

      {/* Home indicator */}
      {showChrome && (
        <View style={styles.homeIndicatorWrap}>
          <View style={[styles.homeIndicator, { backgroundColor: theme.colors.onSurface }]} />
        </View>
      )}
    </View>
  );
}

export function MobileFrame({
  children,
  width: requestedWidth = 360,
  minHeight = 640,
  screenBackground,
  showChrome = true,
  contentLayout = 'center',
  style,
}: MobileFrameProps) {
  // Read the OUTER docs-level theme mode purely to seed the inner provider.
  // Anything inside the frame runs under its own QuartzProvider, so toggling
  // the theme inside a preview doesn't affect the rest of the docs site.
  const { mode: outerMode } = useQuartzTheme();
  const { width: viewportWidth } = useWindowDimensions();

  // Scale down on narrow viewports — never wider than 92% of the viewport,
  // capped at the requested width.
  const width = Math.min(requestedWidth, Math.floor(viewportWidth * 0.92));
  const height = minHeight + (showChrome ? 84 : 0); // chrome adds ~84dp
  const screenWidth = width - BEZEL_PADDING * 2;

  // Bezel uses a subtle metallic gradient — not flat — so it reads as a real
  // device under any theme.
  const bezelGradient: [string, string, string] = ['#1c1c1f', '#0a0a0c', '#1c1c1f'];

  return (
    <View style={[styles.wrapper, style]}>
      {/* Outer drop shadow layer — separated from the bezel so the bezel
          can clip its inner highlight without losing the soft shadow. */}
      <View
        style={[
          styles.shadowLayer,
          {
            width,
            minHeight: height,
          },
        ]}
      >
        <View
          style={[
            styles.bezel,
            {
              width,
              minHeight: height,
            },
          ]}
        >
          {/* Metallic bezel fill */}
          <LinearGradient
            colors={bezelGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* Subtle highlight on the very edge of the bezel (titanium feel) */}
          <View pointerEvents="none" style={styles.bezelOuterHighlight} />

          {/* Inner bezel ring — separates bezel from screen visually */}
          <View pointerEvents="none" style={styles.bezelInnerRing} />

          {/* Inner screen — runs under its own QuartzProvider so any
              `useQuartzTheme()`/`toggleMode()` calls in the preview only
              affect this frame. The `key` resets the inner mode whenever
              the outer site theme changes, keeping the preview visually
              consistent with the docs by default. */}
          <QuartzProvider key={outerMode} initialMode={outerMode}>
            <FramedScreen
              showChrome={showChrome}
              contentLayout={contentLayout}
              screenBackground={screenBackground}
              screenWidth={screenWidth}
              minHeight={minHeight}
            >
              {children}
            </FramedScreen>
          </QuartzProvider>
        </View>

        {/* Side buttons — purely decorative. They sit half-inside, half-outside
            the bezel to give the device silhouette. */}
        <View pointerEvents="none" style={[styles.sideButtonLeft, styles.silentSwitch]} />
        <View pointerEvents="none" style={[styles.sideButtonLeft, styles.volumeUp]} />
        <View pointerEvents="none" style={[styles.sideButtonLeft, styles.volumeDown]} />
        <View pointerEvents="none" style={[styles.sideButtonRight, styles.powerButton]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  shadowLayer: {
    position: 'relative',
    borderRadius: 48,
    // Layered shadow — close + soft + far for depth.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.28,
    shadowRadius: 48,
    elevation: 16,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow:
            '0 1px 2px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.18), 0 32px 64px rgba(0,0,0,0.28)',
        } as ViewStyle)
      : null),
  },
  bezel: {
    borderRadius: 48,
    padding: BEZEL_PADDING,
    overflow: 'hidden',
    backgroundColor: '#0a0a0c',
  },
  bezelOuterHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  bezelInnerRing: {
    position: 'absolute',
    top: BEZEL_PADDING - 2,
    left: BEZEL_PADDING - 2,
    right: BEZEL_PADDING - 2,
    bottom: BEZEL_PADDING - 2,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  screen: {
    flex: 1,
    borderRadius: 37,
    overflow: 'hidden',
    position: 'relative',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingTop: 16,
    height: 44,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  battery: {
    width: 24,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    padding: 1.5,
    flexDirection: 'row',
    marginLeft: 3,
    position: 'relative',
    opacity: 0.85,
  },
  batteryFill: {
    flex: 1,
    borderRadius: 1,
  },
  batteryNub: {
    position: 'absolute',
    right: -2.5,
    top: 3.5,
    width: 1.5,
    height: 4,
    borderRadius: 1,
  },
  dynamicIsland: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 110,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    // Subtle inner highlight to make it feel inset
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
        } as ViewStyle)
      : null),
  },
  dynamicIslandCamera: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a1a1f',
    borderWidth: 1,
    borderColor: 'rgba(80,80,90,0.6)',
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
    paddingBottom: 10,
    alignItems: 'center',
  },
  homeIndicator: {
    width: 132,
    height: 5,
    borderRadius: 3,
    opacity: 0.45,
  },
  // Side button silhouettes — sit on the bezel edge.
  sideButtonLeft: {
    position: 'absolute',
    left: -2,
    width: 4,
    backgroundColor: '#0a0a0c',
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
  },
  sideButtonRight: {
    position: 'absolute',
    right: -2,
    width: 4,
    backgroundColor: '#0a0a0c',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },
  silentSwitch: {
    top: 110,
    height: 26,
  },
  volumeUp: {
    top: 156,
    height: 44,
  },
  volumeDown: {
    top: 212,
    height: 44,
  },
  powerButton: {
    top: 138,
    height: 64,
  },
});
