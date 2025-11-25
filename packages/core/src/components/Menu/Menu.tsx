/**
 * Quartz UI - Menu Component
 * 
 * Menus:
 * - Dropdown menu
 * - Context menu
 */

import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  LayoutRectangle,
  useWindowDimensions,
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
import { Divider } from '../Divider';

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  divider?: boolean;
}

export interface MenuProps {
  /** Whether the menu is visible */
  visible: boolean;
  /** Callback when menu should be dismissed */
  onDismiss: () => void;
  /** Anchor element to position the menu relative to */
  anchor: React.ReactNode;
  /** Menu items */
  items: MenuItem[];
  /** Callback when item is selected */
  onSelect: (key: string) => void;
  /** Position relative to anchor */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Menu({
  visible,
  onDismiss,
  anchor,
  items,
  onSelect,
  position = 'bottom-left',
  style,
  testID,
}: MenuProps) {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [anchorLayout, setAnchorLayout] = useState<LayoutRectangle | null>(null);
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });
  const anchorRef = useRef<View>(null);
  
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 150 });
      scale.value = withSpring(1, springConfig.gentle);
    } else {
      opacity.value = withTiming(0, { duration: 100 });
      scale.value = withTiming(0.9, { duration: 100 });
    }
  }, [visible, opacity, scale]);
  
  const handleAnchorLayout = useCallback(() => {
    if (anchorRef.current) {
      anchorRef.current.measureInWindow((x, y, width, height) => {
        setAnchorLayout({ x, y, width, height });
      });
    }
  }, []);
  
  const handleMenuLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setMenuSize({ width, height });
  };
  
  const handleSelect = useCallback((item: MenuItem) => {
    if (item.disabled) return;
    
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onSelect(item.key);
    onDismiss();
  }, [onSelect, onDismiss, theme.accessibility.hapticFeedback]);
  
  const menuStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  // Calculate menu position
  const getMenuPosition = (): ViewStyle => {
    if (!anchorLayout) return {};
    
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'bottom-left':
        top = anchorLayout.y + anchorLayout.height + 4;
        left = anchorLayout.x;
        break;
      case 'bottom-right':
        top = anchorLayout.y + anchorLayout.height + 4;
        left = anchorLayout.x + anchorLayout.width - menuSize.width;
        break;
      case 'top-left':
        top = anchorLayout.y - menuSize.height - 4;
        left = anchorLayout.x;
        break;
      case 'top-right':
        top = anchorLayout.y - menuSize.height - 4;
        left = anchorLayout.x + anchorLayout.width - menuSize.width;
        break;
    }
    
    // Ensure menu stays on screen
    if (left + menuSize.width > screenWidth - 8) {
      left = screenWidth - menuSize.width - 8;
    }
    if (left < 8) left = 8;
    if (top + menuSize.height > screenHeight - 8) {
      top = anchorLayout.y - menuSize.height - 4;
    }
    if (top < 8) top = 8;
    
    return { top, left };
  };
  
  return (
    <View>
      <View ref={anchorRef} onLayout={handleAnchorLayout}>
        {anchor}
      </View>
      
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={onDismiss}
      >
        <Pressable style={styles.backdrop} onPress={onDismiss}>
          <AnimatedView
            style={[
              styles.menu,
              {
                backgroundColor: theme.colors.surfaceContainer,
                ...getMenuPosition(),
              },
              menuStyle,
              style,
            ]}
            onLayout={handleMenuLayout}
            testID={testID}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.key}>
                {item.divider && index > 0 && (
                  <Divider style={styles.divider} />
                )}
                <Pressable
                  onPress={() => handleSelect(item)}
                  disabled={item.disabled}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && { backgroundColor: theme.colors.onSurface + '0D' },
                    item.disabled && styles.disabledItem,
                  ]}
                  accessibilityRole="menuitem"
                  accessibilityState={{ disabled: item.disabled }}
                >
                  {item.icon && (
                    <View style={styles.leadingIcon}>
                      {item.icon}
                    </View>
                  )}
                  
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.label,
                      {
                        color: item.disabled
                          ? theme.colors.onSurface + '61'
                          : item.destructive
                          ? theme.colors.error
                          : theme.colors.onSurface,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  
                  {item.trailingIcon && (
                    <View style={styles.trailingIcon}>
                      {item.trailingIcon}
                    </View>
                  )}
                </Pressable>
              </React.Fragment>
            ))}
          </AnimatedView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    minWidth: 112,
    maxWidth: 280,
    borderRadius: 4,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  disabledItem: {
    opacity: 0.5,
  },
  leadingIcon: {
    marginEnd: 12,
    width: 24,
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
  trailingIcon: {
    marginStart: 12,
  },
  divider: {
    marginVertical: 8,
  },
});

export default Menu;
