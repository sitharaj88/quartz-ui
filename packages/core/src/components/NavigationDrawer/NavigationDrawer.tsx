/**
 * Quartz UI - Navigation Drawer Component
 * 
 * Navigation Drawer for app navigation
 * Supports modal and standard (side) variants
 */

import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  Dimensions,
  I18nManager,
  ScrollView,
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
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { Divider } from '../Divider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = 360;
const DRAWER_MAX_WIDTH = Math.min(DRAWER_WIDTH, SCREEN_WIDTH * 0.85);

export interface DrawerItem {
  /** Unique key for the item */
  key: string;
  /** Label to display */
  label: string;
  /** Icon component */
  icon?: React.ReactNode;
  /** Icon when selected */
  selectedIcon?: React.ReactNode;
  /** Badge count */
  badge?: number | string;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Custom onPress handler */
  onPress?: () => void;
}

export interface DrawerSection {
  /** Optional section title */
  title?: string;
  /** Items in this section */
  items: DrawerItem[];
  /** Whether to show divider after this section */
  showDivider?: boolean;
}

export interface NavigationDrawerProps {
  /** Whether the drawer is open (for modal variant) */
  open?: boolean;
  /** Callback when drawer should close */
  onClose?: () => void;
  /** Currently selected item key */
  selectedKey?: string;
  /** Callback when item is selected */
  onSelect?: (key: string) => void;
  /** Sections of navigation items */
  sections: DrawerSection[];
  /** Header content */
  header?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Drawer variant */
  variant?: 'modal' | 'standard';
  /** Style override for drawer container */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

/**
 * DrawerItemComponent - Individual navigation item
 */
function DrawerItemComponent({
  item,
  selected,
  onPress,
}: {
  item: DrawerItem;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundColor = selected
    ? theme.colors.secondaryContainer
    : 'transparent';
  const textColor = selected
    ? theme.colors.onSecondaryContainer
    : theme.colors.onSurfaceVariant;
  const iconColor = selected
    ? theme.colors.onSecondaryContainer
    : theme.colors.onSurfaceVariant;

  const iconToShow = selected && item.selectedIcon ? item.selectedIcon : item.icon;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={item.disabled}
        style={[
          styles.drawerItem,
          { backgroundColor },
          item.disabled && styles.drawerItemDisabled,
        ]}
        accessibilityRole="menuitem"
        accessibilityState={{ selected, disabled: item.disabled }}
        accessibilityLabel={item.label}
      >
        {/* Icon */}
        {iconToShow && (
          <View style={[styles.itemIcon, { opacity: item.disabled ? 0.38 : 1 }]}>
            {iconToShow}
          </View>
        )}

        {/* Label */}
        <Text
          variant="labelLarge"
          style={[
            styles.itemLabel,
            {
              color: item.disabled ? theme.colors.onSurface + '61' : textColor,
            },
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Text>

        {/* Badge */}
        {item.badge !== undefined && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: selected
                  ? theme.colors.onSecondaryContainer
                  : theme.colors.error,
              },
            ]}
          >
            <Text
              variant="labelSmall"
              style={{
                color: selected
                  ? theme.colors.secondaryContainer
                  : theme.colors.onError,
              }}
            >
              {typeof item.badge === 'number' && item.badge > 99
                ? '99+'
                : item.badge}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

/**
 * Navigation Drawer Component
 */
export function NavigationDrawer({
  open = false,
  onClose,
  selectedKey,
  onSelect,
  sections,
  header,
  footer,
  variant = 'modal',
  style,
  testID,
}: NavigationDrawerProps): React.ReactElement | null {
  const theme = useTheme();
  const translateX = useSharedValue(I18nManager.isRTL ? DRAWER_MAX_WIDTH : -DRAWER_MAX_WIDTH);
  const scrimOpacity = useSharedValue(0);
  const [shouldRender, setShouldRender] = React.useState(open);

  // Animation duration
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
      const targetX = I18nManager.isRTL ? DRAWER_MAX_WIDTH : -DRAWER_MAX_WIDTH;
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
  }, [open, translateX, scrimOpacity]);

  // Swipe gesture to close
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const translation = I18nManager.isRTL ? -event.translationX : event.translationX;
      if (translation < 0) {
        translateX.value = translation;
        scrimOpacity.value = interpolate(
          Math.abs(translation),
          [0, DRAWER_MAX_WIDTH],
          [0.32, 0]
        );
      }
    })
    .onEnd((event) => {
      const translation = I18nManager.isRTL ? -event.translationX : event.translationX;
      const velocity = I18nManager.isRTL ? -event.velocityX : event.velocityX;
      
      if (translation < -DRAWER_MAX_WIDTH / 3 || velocity < -500) {
        const targetX = I18nManager.isRTL ? DRAWER_MAX_WIDTH : -DRAWER_MAX_WIDTH;
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

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const scrimAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrimOpacity.value,
  }));

  const handleItemPress = useCallback((item: DrawerItem) => {
    if (Platform.OS !== 'web' && theme.accessibility.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (item.onPress) {
      item.onPress();
    } else if (onSelect) {
      onSelect(item.key);
    }

    if (variant === 'modal' && onClose) {
      onClose();
    }
  }, [onSelect, onClose, variant, theme.accessibility.hapticFeedback]);

  // Standard variant - always visible
  if (variant === 'standard') {
    return (
      <View
        style={[
          styles.standardDrawer,
          { backgroundColor: theme.colors.surface },
          style,
        ]}
        testID={testID}
        accessibilityRole="menu"
      >
        {header && <View style={styles.header}>{header}</View>}
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section, sectionIndex) => (
            <View key={sectionIndex}>
              {section.title && (
                <Text
                  variant="titleSmall"
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {section.title}
                </Text>
              )}
              
              {section.items.map((item) => (
                <DrawerItemComponent
                  key={item.key}
                  item={item}
                  selected={selectedKey === item.key}
                  onPress={() => handleItemPress(item)}
                />
              ))}
              
              {section.showDivider && sectionIndex < sections.length - 1 && (
                <Divider style={styles.divider} />
              )}
            </View>
          ))}
        </ScrollView>
        
        {footer && <View style={styles.footer}>{footer}</View>}
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
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close navigation drawer"
      >
        <Animated.View
          style={[
            styles.scrim,
            { backgroundColor: theme.colors.scrim },
            scrimAnimatedStyle,
          ]}
        />
      </Pressable>

      {/* Drawer */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.modalDrawer,
            {
              backgroundColor: theme.colors.surfaceContainerLow,
              width: DRAWER_MAX_WIDTH,
              [I18nManager.isRTL ? 'right' : 'left']: 0,
            },
            drawerAnimatedStyle,
            style,
          ]}
          accessibilityRole="menu"
          accessibilityViewIsModal={true}
        >
          {header && <View style={styles.header}>{header}</View>}
          
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {sections.map((section, sectionIndex) => (
              <View key={sectionIndex}>
                {section.title && (
                  <Text
                    variant="titleSmall"
                    style={[
                      styles.sectionTitle,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {section.title}
                  </Text>
                )}
                
                {section.items.map((item) => (
                  <DrawerItemComponent
                    key={item.key}
                    item={item}
                    selected={selectedKey === item.key}
                    onPress={() => handleItemPress(item)}
                  />
                ))}
                
                {section.showDivider && sectionIndex < sections.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))}
          </ScrollView>
          
          {footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  standardDrawer: {
    width: DRAWER_MAX_WIDTH,
    height: '100%',
    borderTopEndRadius: 16,
    borderBottomEndRadius: 16,
  },
  modalDrawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderTopEndRadius: 16,
    borderBottomEndRadius: 16,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 28,
    marginVertical: 2,
  },
  drawerItemDisabled: {
    opacity: 0.38,
  },
  itemIcon: {
    marginEnd: 12,
  },
  itemLabel: {
    flex: 1,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default NavigationDrawer;
