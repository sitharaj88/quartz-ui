/**
 * Quartz UI - Snackbar Component
 * 
 * Snackbar for brief messages:
 * - Single line
 * - Two line
 * - With action
 * - With dismiss
 */

import React, { forwardRef, memo, useCallback, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { useViewportDimensions } from '../../hooks/useViewportDimensions';
import { springConfig } from '../../tokens/motion';
import { Text } from '../Text';

export interface SnackbarProps {
  /** Whether the snackbar is visible */
  visible: boolean;
  /** Callback when snackbar is dismissed */
  onDismiss: () => void;
  /** Message to display */
  message: string;
  /** Action button configuration */
  action?: {
    label: string;
    onPress: () => void;
  };
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Whether to show close icon */
  showCloseIcon?: boolean;
  /** Position on screen */
  position?: 'bottom' | 'top';
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const DURATION_SHORT = 4000;
const DURATION_LONG = 7000;

const SnackbarImpl = forwardRef<View, SnackbarProps>(function Snackbar(
  {
    visible,
    onDismiss,
    message,
    action,
    duration = DURATION_SHORT,
    showCloseIcon = false,
    position = 'bottom',
    style,
    testID,
  },
  ref
) {
  const theme = useTheme();
  const { width: screenWidth } = useViewportDimensions();
  
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 150 });
      translateY.value = withSpring(0, springConfig.gentle);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          onDismiss();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      opacity.value = withTiming(0, { duration: 100 });
      translateY.value = withTiming(100, { duration: 150 });
    }
  }, [visible, duration, onDismiss, opacity, translateY]);
  
  const handleAction = useCallback(() => {
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    action?.onPress();
    onDismiss();
  }, [action, onDismiss, theme.accessibility.hapticFeedback]);
  
  const handleDismiss = useCallback(() => {
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onDismiss();
  }, [onDismiss, theme.accessibility.hapticFeedback]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: position === 'bottom' ? translateY.value : -translateY.value },
    ],
  }));
  
  if (!visible) return null;
  
  const isWide = screenWidth > 600;
  
  return (
    <View
      ref={ref}
      style={[
        styles.container,
        position === 'bottom' ? styles.bottom : styles.top,
      ]}
      pointerEvents="box-none"
    >
      <AnimatedView
        style={[
          styles.snackbar,
          {
            backgroundColor: theme.colors.inverseSurface,
            maxWidth: isWide ? 560 : screenWidth - 32,
          },
          animatedStyle,
          style,
        ]}
        testID={testID}
        accessible={true}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.inverseOnSurface }]}
          numberOfLines={2}
        >
          {message}
        </Text>
        
        {(action || showCloseIcon) && (
          <View style={styles.actions}>
            {action && (
              <Pressable
                onPress={handleAction}
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  variant="labelLarge"
                  style={{ color: theme.colors.inversePrimary }}
                >
                  {action.label}
                </Text>
              </Pressable>
            )}
            
            {showCloseIcon && (
              <Pressable
                onPress={handleDismiss}
                style={styles.closeButton}
                accessibilityLabel="Dismiss"
                accessibilityRole="button"
              >
                <View style={styles.closeIcon}>
                  <View
                    style={[
                      styles.closeLine,
                      { backgroundColor: theme.colors.inverseOnSurface, transform: [{ rotate: '45deg' }] },
                    ]}
                  />
                  <View
                    style={[
                      styles.closeLine,
                      { backgroundColor: theme.colors.inverseOnSurface, transform: [{ rotate: '-45deg' }] },
                    ]}
                  />
                </View>
              </Pressable>
            )}
          </View>
        )}
      </AnimatedView>
    </View>
  );
});

SnackbarImpl.displayName = 'Snackbar';

const SnackbarMemo = memo(SnackbarImpl) as React.MemoExoticComponent<typeof SnackbarImpl> & {
  DURATION_SHORT: number;
  DURATION_LONG: number;
};
SnackbarMemo.DURATION_SHORT = DURATION_SHORT;
SnackbarMemo.DURATION_LONG = DURATION_LONG;
export const Snackbar = SnackbarMemo;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bottom: {
    bottom: 16,
  },
  top: {
    top: 16,
  },
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  message: {
    flex: 1,
    marginEnd: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 8,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginStart: -8,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: -8,
  },
  closeIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLine: {
    position: 'absolute',
    width: 16,
    height: 2,
    borderRadius: 1,
  },
});

export default Snackbar;
