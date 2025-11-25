/**
 * Quartz UI - Navigation Bar Component
 * 
 * Bottom Navigation Bar:
 * - 3-5 destinations
 * - Labels always visible or only on active
 * - Badge support
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
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { springConfig } from '../../tokens/motion';
import { Text } from '../Text';
import { Badge } from '../Badge';

export interface NavigationBarItem {
  /** Item key/id */
  key: string;
  /** Icon to display */
  icon: React.ReactNode;
  /** Active icon (optional - uses icon if not provided) */
  activeIcon?: React.ReactNode;
  /** Label text */
  label: string;
  /** Badge content (number or dot) */
  badge?: number | boolean;
}

export interface NavigationBarProps {
  /** Navigation items (3-5) */
  items: NavigationBarItem[];
  /** Currently selected item key */
  selectedKey: string;
  /** Callback when item is selected */
  onSelect: (key: string) => void;
  /** Whether to show labels only on active item */
  labelVisibility?: 'always' | 'active-only';
  /** Whether to show indicator pill */
  showIndicator?: boolean;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function NavigationBar({
  items,
  selectedKey,
  onSelect,
  labelVisibility = 'always',
  showIndicator = true,
  style,
  testID,
}: NavigationBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceContainer,
          paddingBottom: Math.max(insets.bottom, 12),
        },
        style,
      ]}
      testID={testID}
      accessibilityRole="tablist"
    >
      {items.map((item) => (
        <NavigationBarItemComponent
          key={item.key}
          item={item}
          selected={item.key === selectedKey}
          onSelect={onSelect}
          labelVisibility={labelVisibility}
          showIndicator={showIndicator}
        />
      ))}
    </View>
  );
}

interface NavigationBarItemComponentProps {
  item: NavigationBarItem;
  selected: boolean;
  onSelect: (key: string) => void;
  labelVisibility: 'always' | 'active-only';
  showIndicator: boolean;
}

function NavigationBarItemComponent({
  item,
  selected,
  onSelect,
  labelVisibility,
  showIndicator,
}: NavigationBarItemComponentProps) {
  const theme = useTheme();
  
  const indicatorScale = useSharedValue(selected ? 1 : 0);
  const indicatorWidth = useSharedValue(selected ? 64 : 0);
  
  React.useEffect(() => {
    indicatorScale.value = withSpring(selected ? 1 : 0, springConfig.gentle);
    indicatorWidth.value = withSpring(selected ? 64 : 0, springConfig.gentle);
  }, [selected, indicatorScale, indicatorWidth]);
  
  const handlePress = useCallback(() => {
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect(item.key);
  }, [item.key, onSelect, theme.accessibility.hapticFeedback]);
  
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: indicatorScale.value }],
    width: indicatorWidth.value,
  }));
  
  const showLabel = labelVisibility === 'always' || selected;
  const icon = selected && item.activeIcon ? item.activeIcon : item.icon;
  
  return (
    <Pressable
      onPress={handlePress}
      style={styles.item}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={item.label}
    >
      <View style={styles.iconContainer}>
        {/* Active Indicator */}
        {showIndicator && (
          <AnimatedView
            style={[
              styles.indicator,
              { backgroundColor: theme.colors.secondaryContainer },
              indicatorStyle,
            ]}
          />
        )}
        
        {/* Icon */}
        <View style={styles.icon}>
          {icon}
          {item.badge !== undefined && (
            <View style={styles.badge}>
              <Badge
                content={typeof item.badge === 'number' ? item.badge : undefined}
                visible={item.badge === true || (typeof item.badge === 'number' && item.badge > 0)}
              />
            </View>
          )}
        </View>
      </View>
      
      {/* Label */}
      {showLabel && (
        <Text
          variant="labelMedium"
          style={[
            styles.label,
            { color: selected ? theme.colors.onSurface : theme.colors.onSurfaceVariant },
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    paddingTop: 12,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 48,
    maxWidth: 150,
  },
  iconContainer: {
    width: 64,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  indicator: {
    position: 'absolute',
    height: 32,
    borderRadius: 16,
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    end: -10,
  },
  label: {
    textAlign: 'center',
  },
});

export default NavigationBar;
