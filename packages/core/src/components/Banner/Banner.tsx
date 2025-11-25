/**
 * Quartz UI - Banner Component
 * 
 * Banner for displaying prominent messages
 * with optional actions at the top of the screen
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  I18nManager,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { Button } from '../Button';

export interface BannerAction {
  label: string;
  onPress: () => void;
}

export interface BannerProps {
  /** Whether the banner is visible */
  visible: boolean;
  /** The message to display */
  message: string;
  /** Optional icon component to display */
  icon?: React.ReactNode;
  /** Primary action button */
  action?: BannerAction;
  /** Secondary action button */
  secondaryAction?: BannerAction;
  /** Whether to show a close/dismiss button */
  dismissable?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const ANIMATION_DURATION = 250;

/**
 * Banner Component
 * 
 * Banners display a prominent message and optional related actions.
 * They appear at the top of the screen, below a top app bar.
 */
export function Banner({
  visible,
  message,
  icon,
  action,
  secondaryAction,
  dismissable = false,
  onDismiss,
  style,
  testID,
}: BannerProps): React.ReactElement | null {
  const theme = useTheme();
  const height = useSharedValue(visible ? 1 : 0);
  const [shouldRender, setShouldRender] = React.useState(visible);

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      height.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      height.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
      }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }
  }, [visible, height]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: height.value,
      transform: [
        { translateY: (1 - height.value) * -20 },
      ],
    };
  });

  if (!shouldRender) {
    return null;
  }

  const hasActions = action || secondaryAction;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceContainerLow },
        animatedStyle,
        style,
      ]}
      testID={testID}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.content}>
        {/* Icon */}
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurface }}
          >
            {message}
          </Text>
        </View>

        {/* Dismiss button */}
        {dismissable && onDismiss && (
          <Button
            variant="text"
            onPress={onDismiss}
            accessibilityLabel="Dismiss banner"
          >
            Dismiss
          </Button>
        )}
      </View>

      {/* Actions */}
      {hasActions && (
        <View style={styles.actionsContainer}>
          {secondaryAction && (
            <Button
              variant="text"
              onPress={secondaryAction.onPress}
              style={styles.actionButton}
            >
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button
              variant="text"
              onPress={action.onPress}
              style={styles.actionButton}
            >
              {action.label}
            </Button>
          )}
        </View>
      )}

      {/* Bottom border */}
      <View
        style={[
          styles.border,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  iconContainer: {
    marginEnd: 16,
  },
  messageContainer: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  actionButton: {
    marginStart: 8,
  },
  border: {
    height: 1,
    width: '100%',
  },
});

export default Banner;
