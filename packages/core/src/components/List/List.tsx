/**
 * Quartz UI - List Component
 * 
 * Lists:
 * - One-line
 * - Two-line
 * - Three-line
 * - With leading/trailing elements
 */

import React, { useCallback } from 'react';
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
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';

export interface ListItemProps {
  /** Primary text (headline) */
  headline: string;
  /** Secondary text (supporting text) */
  supportingText?: string;
  /** Tertiary text (overline) */
  overline?: string;
  /** Leading element (icon, avatar, image, checkbox) */
  leading?: React.ReactNode;
  /** Trailing element (icon, text, checkbox, switch) */
  trailing?: React.ReactNode;
  /** Number of lines for supporting text (1, 2, or 3) */
  lines?: 1 | 2 | 3;
  /** Callback when item is pressed */
  onPress?: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the item is selected */
  selected?: boolean;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function ListItem({
  headline,
  supportingText,
  overline,
  leading,
  trailing,
  lines = supportingText ? 2 : 1,
  onPress,
  disabled = false,
  selected = false,
  style,
  testID,
}: ListItemProps) {
  const theme = useTheme();
  
  const pressed = useSharedValue(0);
  
  const handlePressIn = () => {
    pressed.value = withTiming(1, { duration: 100 });
  };
  
  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: 200 });
  };
  
  const handlePress = useCallback(() => {
    if (disabled) return;
    
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress?.();
  }, [disabled, onPress, theme.accessibility.hapticFeedback]);
  
  const stateLayerStyle = useAnimatedStyle(() => ({
    opacity: pressed.value * 0.08,
  }));
  
  const minHeight = lines === 3 ? 88 : lines === 2 ? 72 : 56;
  
  const Container = onPress ? Pressable : View;
  const containerProps = onPress
    ? {
        onPress: handlePress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        disabled,
      }
    : {};
  
  return (
    <Container
      {...containerProps}
      style={[
        styles.container,
        { minHeight, backgroundColor: selected ? theme.colors.secondaryContainer : 'transparent' },
        style,
      ]}
      testID={testID}
      accessible={true}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ disabled, selected }}
    >
      {/* State Layer */}
      {onPress && (
        <AnimatedView
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.colors.onSurface },
            stateLayerStyle,
          ]}
        />
      )}
      
      {/* Leading */}
      {leading && (
        <View style={styles.leading}>
          {leading}
        </View>
      )}
      
      {/* Content */}
      <View style={styles.content}>
        {overline && (
          <Text
            variant="labelSmall"
            style={[
              styles.overline,
              { color: disabled ? theme.colors.onSurface + '61' : theme.colors.onSurfaceVariant },
            ]}
            numberOfLines={1}
          >
            {overline}
          </Text>
        )}
        
        <Text
          variant="bodyLarge"
          style={[
            styles.headline,
            { color: disabled ? theme.colors.onSurface + '61' : theme.colors.onSurface },
          ]}
          numberOfLines={1}
        >
          {headline}
        </Text>
        
        {supportingText && (
          <Text
            variant="bodyMedium"
            style={[
              styles.supportingText,
              { color: disabled ? theme.colors.onSurface + '61' : theme.colors.onSurfaceVariant },
            ]}
            numberOfLines={lines === 3 ? 2 : 1}
          >
            {supportingText}
          </Text>
        )}
      </View>
      
      {/* Trailing */}
      {trailing && (
        <View style={styles.trailing}>
          {trailing}
        </View>
      )}
    </Container>
  );
}

/** List Section Header */
export interface ListSectionProps {
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ListSection({ title, children, style }: ListSectionProps) {
  const theme = useTheme();
  
  return (
    <View style={[styles.section, style]}>
      <Text
        variant="titleSmall"
        style={[styles.sectionTitle, { color: theme.colors.primary }]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

/** List Divider */
export function ListDivider() {
  const theme = useTheme();
  
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: theme.colors.outlineVariant },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingStart: 16,
    paddingEnd: 24,
    overflow: 'hidden',
  },
  leading: {
    marginEnd: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  overline: {
    marginBottom: 2,
  },
  headline: {},
  supportingText: {
    marginTop: 2,
  },
  trailing: {
    marginStart: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});

export default ListItem;
