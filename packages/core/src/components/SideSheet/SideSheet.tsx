/**
 * Quartz UI - Side Sheet Component
 * 
 * Side Sheet for supplementary content
 * Supports modal and standard (docked) variants
 */

import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  Dimensions,
  ScrollView,
  I18nManager,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { IconButton } from '../IconButton';
import { Divider } from '../Divider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SHEET_WIDTH = 360;
const SHEET_MAX_WIDTH = Math.min(SHEET_WIDTH, SCREEN_WIDTH * 0.9);

export interface SideSheetProps {
  /** Whether the sheet is open (for modal variant) */
  open?: boolean;
  /** Callback when sheet should close */
  onClose?: () => void;
  /** Content to render inside the sheet */
  children: React.ReactNode;
  /** Sheet title */
  title?: string;
  /** Sheet variant */
  variant?: 'modal' | 'standard';
  /** Position of the sheet */
  position?: 'start' | 'end';
  /** Whether to show the header */
  showHeader?: boolean;
  /** Custom header content */
  header?: React.ReactNode;
  /** Custom footer content */
  footer?: React.ReactNode;
  /** Whether the sheet is dismissable by tapping scrim */
  dismissable?: boolean;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

/**
 * Side Sheet Component
 */
export function SideSheet({
  open = false,
  onClose,
  children,
  title,
  variant = 'modal',
  position = 'end',
  showHeader = true,
  header,
  footer,
  dismissable = true,
  style,
  testID,
}: SideSheetProps): React.ReactElement | null {
  const theme = useTheme();
  
  // Determine translation direction based on position and RTL
  const isRTL = I18nManager.isRTL;
  const isEnd = position === 'end';
  const shouldSlideFromRight = (isEnd && !isRTL) || (!isEnd && isRTL);
  
  const translateX = useSharedValue(shouldSlideFromRight ? SHEET_MAX_WIDTH : -SHEET_MAX_WIDTH);
  const scrimOpacity = useSharedValue(0);
  const [shouldRender, setShouldRender] = React.useState(open);

  const DURATION = 250;

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      translateX.value = withTiming(0, {
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
      });
      scrimOpacity.value = withTiming(0.32, { duration: DURATION });
    } else {
      const targetX = shouldSlideFromRight ? SHEET_MAX_WIDTH : -SHEET_MAX_WIDTH;
      translateX.value = withTiming(targetX, {
        duration: DURATION,
        easing: Easing.in(Easing.cubic),
      }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
      scrimOpacity.value = withTiming(0, { duration: DURATION });
    }
  }, [open, translateX, scrimOpacity, shouldSlideFromRight]);

  // Swipe gesture to close
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const translation = shouldSlideFromRight ? event.translationX : -event.translationX;
      if (translation > 0) {
        translateX.value = shouldSlideFromRight ? translation : -translation;
        scrimOpacity.value = interpolate(
          translation,
          [0, SHEET_MAX_WIDTH],
          [0.32, 0]
        );
      }
    })
    .onEnd((event) => {
      const translation = shouldSlideFromRight ? event.translationX : -event.translationX;
      const velocity = shouldSlideFromRight ? event.velocityX : -event.velocityX;
      
      if (translation > SHEET_MAX_WIDTH / 3 || velocity > 500) {
        const targetX = shouldSlideFromRight ? SHEET_MAX_WIDTH : -SHEET_MAX_WIDTH;
        translateX.value = withTiming(targetX, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
        scrimOpacity.value = withTiming(0, { duration: 200 });
        if (onClose) {
          runOnJS(onClose)();
        }
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
        scrimOpacity.value = withTiming(0.32, { duration: 150 });
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const scrimAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrimOpacity.value,
  }));

  const handleScrimPress = useCallback(() => {
    if (dismissable && onClose) {
      onClose();
    }
  }, [dismissable, onClose]);

  // Standard variant - always visible
  if (variant === 'standard') {
    return (
      <View
        style={[
          styles.standardSheet,
          {
            backgroundColor: theme.colors.surface,
            [position === 'end' ? 'borderStartWidth' : 'borderEndWidth']: 1,
            borderColor: theme.colors.outlineVariant,
          },
          style,
        ]}
        testID={testID}
      >
        {/* Header */}
        {showHeader && (
          <>
            {header || (
              <View style={styles.header}>
                {title && (
                  <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                    {title}
                  </Text>
                )}
              </View>
            )}
            <Divider />
          </>
        )}

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {/* Footer */}
        {footer && (
          <>
            <Divider />
            <View style={styles.footer}>{footer}</View>
          </>
        )}
      </View>
    );
  }

  // Modal variant
  if (!shouldRender) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} testID={testID}>
      {/* Scrim */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleScrimPress}
        accessibilityRole="button"
        accessibilityLabel="Close side sheet"
      >
        <Animated.View
          style={[
            styles.scrim,
            { backgroundColor: theme.colors.scrim },
            scrimAnimatedStyle,
          ]}
        />
      </Pressable>

      {/* Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.modalSheet,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              width: SHEET_MAX_WIDTH,
              [shouldSlideFromRight ? 'right' : 'left']: 0,
              [shouldSlideFromRight ? 'borderTopStartRadius' : 'borderTopEndRadius']: 28,
              [shouldSlideFromRight ? 'borderBottomStartRadius' : 'borderBottomEndRadius']: 28,
            },
            sheetAnimatedStyle,
            style,
          ]}
          accessibilityViewIsModal={true}
        >
          {/* Header */}
          {showHeader && (
            <View style={styles.header}>
              {header || (
                <View style={styles.headerContent}>
                  {title && (
                    <Text variant="titleLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
                      {title}
                    </Text>
                  )}
                  {onClose && (
                    <IconButton
                      icon={<Text style={{ fontSize: 20 }}>✕</Text>}
                      onPress={onClose}
                      accessibilityLabel="Close"
                    />
                  )}
                </View>
              )}
            </View>
          )}

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {/* Footer */}
          {footer && (
            <>
              <Divider />
              <View style={styles.footer}>{footer}</View>
            </>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  standardSheet: {
    width: SHEET_MAX_WIDTH,
    height: '100%',
  },
  modalSheet: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  footer: {
    padding: 16,
  },
});

export default SideSheet;
