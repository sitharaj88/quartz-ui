/**
 * Quartz UI - Badge Component
 * 
 * Badge variants:
 * - Small (dot) badge
 * - Large (number) badge
 */

import React, { forwardRef, memo } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';

export interface BadgeProps {
  /** Content to display (number or string) */
  content?: number | string;
  /** Whether the badge is visible */
  visible?: boolean;
  /** Maximum number to display (shows max+ if exceeded) */
  max?: number;
  /** Size of the badge */
  size?: 'small' | 'large';
  /** Custom background color */
  color?: string;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const BadgeImpl = forwardRef<View, BadgeProps>(function Badge(
  {
    content,
    visible = true,
    max = 999,
    size = content !== undefined ? 'large' : 'small',
    color,
    style,
    testID,
  },
  ref
) {
  const theme = useTheme();

  const bgColor = color ?? theme.colors.error;
  const textColor = theme.colors.onError;

  if (!visible) return null;

  const isSmall = size === 'small';
  const displayContent =
    typeof content === 'number' && content > max ? `${max}+` : content?.toString();

  const hasContent = displayContent !== undefined && displayContent !== '';

  // Live-region announces count changes to screen readers (e.g. notification count).
  return (
    <AnimatedView
      ref={ref}
      entering={FadeIn.duration(150).springify()}
      exiting={FadeOut.duration(100)}
      style={[
        styles.badge,
        isSmall ? styles.smallBadge : styles.largeBadge,
        { backgroundColor: bgColor },
        hasContent && { minWidth: 16 + (displayContent?.length ?? 0) * 4 },
        style,
      ]}
      testID={testID}
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={
        hasContent ? `${displayContent} notifications` : 'New notification'
      }
    >
      {hasContent && <Text style={[styles.text, { color: textColor }]}>{displayContent}</Text>}
    </AnimatedView>
  );
});

BadgeImpl.displayName = 'Badge';

export const Badge = memo(BadgeImpl);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  largeBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default Badge;
