/**
 * Quartz UI - Tabs Component
 * 
 * Tabs:
 * - Primary tabs
 * - Secondary tabs
 * - Scrollable tabs
 */

import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { springConfig } from '../../tokens/motion';
import { Text } from '../Text';
import { Badge } from '../Badge';

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | boolean;
}

export interface TabsProps {
  /** Tab items */
  tabs: TabItem[];
  /** Currently selected tab key */
  selectedKey: string;
  /** Callback when tab is selected */
  onSelect: (key: string) => void;
  /** Tab variant */
  variant?: 'primary' | 'secondary';
  /** Whether tabs are scrollable */
  scrollable?: boolean;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Tabs({
  tabs,
  selectedKey,
  onSelect,
  variant = 'primary',
  scrollable = false,
  style,
  testID,
}: TabsProps) {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const tabWidths = useRef<{ [key: string]: { x: number; width: number } }>({});
  
  const indicatorLeft = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  
  const updateIndicator = useCallback((key: string) => {
    const tab = tabWidths.current[key];
    if (tab) {
      indicatorLeft.value = withSpring(tab.x, springConfig.gentle);
      indicatorWidth.value = withSpring(tab.width, springConfig.gentle);
    }
  }, [indicatorLeft, indicatorWidth]);
  
  useEffect(() => {
    updateIndicator(selectedKey);
  }, [selectedKey, updateIndicator]);
  
  const handleTabLayout = (key: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabWidths.current[key] = { x, width };
    if (key === selectedKey) {
      updateIndicator(key);
    }
  };
  
  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorLeft.value,
    width: indicatorWidth.value,
  }));
  
  const isPrimary = variant === 'primary';
  
  const content = (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TabItemComponent
          key={tab.key}
          tab={tab}
          selected={tab.key === selectedKey}
          onSelect={onSelect}
          variant={variant}
          onLayout={(e) => handleTabLayout(tab.key, e)}
          scrollable={scrollable}
        />
      ))}
      
      {/* Active Indicator */}
      <AnimatedView
        style={[
          styles.indicator,
          {
            backgroundColor: theme.colors.primary,
            height: isPrimary ? 3 : 2,
            borderTopLeftRadius: isPrimary ? 3 : 0,
            borderTopRightRadius: isPrimary ? 3 : 0,
          },
          indicatorStyle,
        ]}
      />
    </View>
  );
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: isPrimary ? 0 : 1,
          borderBottomColor: theme.colors.surfaceVariant,
        },
        style,
      ]}
      testID={testID}
      accessibilityRole="tablist"
    >
      {scrollable ? (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

interface TabItemComponentProps {
  tab: TabItem;
  selected: boolean;
  onSelect: (key: string) => void;
  variant: 'primary' | 'secondary';
  onLayout: (e: LayoutChangeEvent) => void;
  scrollable: boolean;
}

function TabItemComponent({
  tab,
  selected,
  onSelect,
  variant,
  onLayout,
  scrollable,
}: TabItemComponentProps) {
  const theme = useTheme();
  
  const handlePress = useCallback(() => {
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect(tab.key);
  }, [tab.key, onSelect, theme.accessibility.hapticFeedback]);
  
  const isPrimary = variant === 'primary';
  
  return (
    <Pressable
      onPress={handlePress}
      onLayout={onLayout}
      style={({ pressed }) => [
        styles.tab,
        !scrollable && styles.flexTab,
        pressed && { opacity: 0.8 },
      ]}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={tab.label}
    >
      {isPrimary && tab.icon && (
        <View style={styles.iconContainer}>
          {tab.icon}
          {tab.badge !== undefined && (
            <View style={styles.badge}>
              <Badge
                content={typeof tab.badge === 'number' ? tab.badge : undefined}
                visible={tab.badge === true || (typeof tab.badge === 'number' && tab.badge > 0)}
                size="small"
              />
            </View>
          )}
        </View>
      )}
      
      <View style={styles.labelContainer}>
        <Text
          variant="titleSmall"
          style={[
            styles.label,
            { color: selected ? theme.colors.primary : theme.colors.onSurfaceVariant },
          ]}
          numberOfLines={1}
        >
          {tab.label}
        </Text>
        
        {!isPrimary && tab.badge !== undefined && (
          <View style={styles.inlineBadge}>
            <Badge
              content={typeof tab.badge === 'number' ? tab.badge : undefined}
              visible={tab.badge === true || (typeof tab.badge === 'number' && tab.badge > 0)}
              size="small"
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
  },
  scrollContent: {
    flexGrow: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    minHeight: 48,
  },
  flexTab: {
    flex: 1,
  },
  iconContainer: {
    marginBottom: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    end: -8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {},
  inlineBadge: {
    marginStart: 8,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
  },
});

export default Tabs;
