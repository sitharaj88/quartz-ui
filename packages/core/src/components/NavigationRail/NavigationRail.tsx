/**
 * Quartz UI - Navigation Rail Component
 * 
 * Navigation Rail for compact side navigation
 * Ideal for larger screens (tablets, desktop)
 */

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { FAB } from '../FAB';

export interface RailDestination {
  /** Unique key */
  key: string;
  /** Label text */
  label: string;
  /** Icon component */
  icon: React.ReactNode;
  /** Icon when selected */
  selectedIcon?: React.ReactNode;
  /** Badge count */
  badge?: number | string;
  /** Disabled state */
  disabled?: boolean;
}

export interface NavigationRailProps {
  /** Navigation destinations */
  destinations: RailDestination[];
  /** Currently selected destination key */
  selectedKey?: string;
  /** Selection change callback */
  onSelect?: (key: string) => void;
  /** Whether to show labels */
  labelType?: 'none' | 'selected' | 'all';
  /** Optional FAB config */
  fab?: {
    icon: React.ReactNode;
    onPress: () => void;
    label?: string;
  };
  /** Header content (e.g., menu button) */
  header?: React.ReactNode;
  /** Alignment of destinations */
  alignment?: 'top' | 'center';
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

/**
 * Rail Destination Item
 */
function RailDestinationItem({
  destination,
  selected,
  showLabel,
  onPress,
}: {
  destination: RailDestination;
  selected: boolean;
  showLabel: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconToShow = selected && destination.selectedIcon
    ? destination.selectedIcon
    : destination.icon;

  const activeIndicatorColor = selected
    ? theme.colors.secondaryContainer
    : 'transparent';

  const iconColor = selected
    ? theme.colors.onSecondaryContainer
    : theme.colors.onSurfaceVariant;

  const labelColor = selected
    ? theme.colors.onSurface
    : theme.colors.onSurfaceVariant;

  return (
    <Animated.View style={[styles.destinationContainer, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={destination.disabled}
        style={[
          styles.destination,
          destination.disabled && styles.destinationDisabled,
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected, disabled: destination.disabled }}
        accessibilityLabel={destination.label}
      >
        {/* Active indicator */}
        <View
          style={[
            styles.activeIndicator,
            { backgroundColor: activeIndicatorColor },
          ]}
        >
          {/* Icon */}
          <View style={styles.iconWrapper}>
            {iconToShow}
          </View>

          {/* Badge */}
          {destination.badge !== undefined && (
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.error },
              ]}
            >
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onError, fontSize: 10 }}
              >
                {typeof destination.badge === 'number' && destination.badge > 99
                  ? '99+'
                  : destination.badge}
              </Text>
            </View>
          )}
        </View>

        {/* Label */}
        {showLabel && (
          <Text
            variant="labelMedium"
            style={[
              styles.label,
              { color: labelColor },
            ]}
            numberOfLines={1}
          >
            {destination.label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

/**
 * Navigation Rail Component
 */
export function NavigationRail({
  destinations,
  selectedKey,
  onSelect,
  labelType = 'all',
  fab,
  header,
  alignment = 'top',
  style,
  testID,
}: NavigationRailProps): React.ReactElement {
  const theme = useTheme();

  const handleDestinationPress = useCallback((key: string) => {
    if (Platform.OS !== 'web' && theme.accessibility.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect?.(key);
  }, [onSelect, theme.accessibility.hapticFeedback]);

  const shouldShowLabel = (selected: boolean) => {
    if (labelType === 'all') return true;
    if (labelType === 'selected') return selected;
    return false;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface },
        style,
      ]}
      testID={testID}
      accessibilityRole="tablist"
    >
      {/* Header / Menu button area */}
      {header && <View style={styles.header}>{header}</View>}

      {/* FAB */}
      {fab && (
        <View style={styles.fabContainer}>
          <FAB
            icon={fab.icon}
            onPress={fab.onPress}
            color="secondary"
            size="small"
            accessibilityLabel={fab.label || 'Action'}
          />
        </View>
      )}

      {/* Destinations */}
      <View
        style={[
          styles.destinationsContainer,
          alignment === 'center' && styles.destinationsCentered,
        ]}
      >
        {destinations.map((destination) => (
          <RailDestinationItem
            key={destination.key}
            destination={destination}
            selected={selectedKey === destination.key}
            showLabel={shouldShowLabel(selectedKey === destination.key)}
            onPress={() => handleDestinationPress(destination.key)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  header: {
    marginBottom: 8,
  },
  fabContainer: {
    marginBottom: 8,
  },
  destinationsContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  destinationsCentered: {
    justifyContent: 'center',
  },
  destinationContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 4,
  },
  destination: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  destinationDisabled: {
    opacity: 0.38,
  },
  activeIndicator: {
    width: 56,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    end: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 72,
  },
});

export default NavigationRail;
