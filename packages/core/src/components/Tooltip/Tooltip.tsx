/**
 * Quartz UI - Tooltip Component
 * 
 * Tooltips:
 * - Plain tooltip (short text)
 * - Rich tooltip (with title, text, actions)
 */

import React, { useCallback, useEffect, useState, useRef, cloneElement, isValidElement } from 'react';
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  LayoutRectangle,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';

export interface TooltipProps {
  /** Tooltip content/message */
  message: string;
  /** Rich tooltip title */
  title?: string;
  /** Rich tooltip actions */
  actions?: React.ReactNode;
  /** Element that triggers the tooltip */
  children: React.ReactElement;
  /** Position relative to anchor */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Duration tooltip stays visible (ms) */
  duration?: number;
  /** Whether tooltip is controlled */
  visible?: boolean;
  /** Callback when visibility changes */
  onVisibleChange?: (visible: boolean) => void;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Tooltip({
  message,
  title,
  actions,
  children,
  position = 'top',
  duration = 1500,
  visible: controlledVisible,
  onVisibleChange,
  style,
  testID,
}: TooltipProps) {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [internalVisible, setInternalVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<LayoutRectangle | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const anchorRef = useRef<View>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const visible = controlledVisible ?? internalVisible;
  const isRich = !!title || !!actions;
  
  const opacity = useSharedValue(0);
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);
  
  // Animate opacity only when positioned
  useEffect(() => {
    if (visible && isPositioned) {
      opacity.value = withTiming(1, { duration: 150 });
    } else if (!visible) {
      opacity.value = withTiming(0, { duration: 100 });
      setIsPositioned(false);
    }
  }, [visible, isPositioned, opacity]);
  
  const setVisible = useCallback((value: boolean) => {
    if (controlledVisible === undefined) {
      setInternalVisible(value);
      onVisibleChange?.(value);
    }
  }, [controlledVisible, onVisibleChange]);
  
  const measureAnchor = useCallback(() => {
    return new Promise<LayoutRectangle>((resolve) => {
      if (anchorRef.current) {
        anchorRef.current.measureInWindow((x, y, width, height) => {
          const layout = { x, y, width, height };
          setAnchorLayout(layout);
          resolve(layout);
        });
      }
    });
  }, []);
  
  const handleTooltipLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setTooltipSize({ width, height });
      // Mark as positioned once we have tooltip dimensions
      setIsPositioned(true);
    }
  }, []);
  
  // Show tooltip
  const showTooltip = useCallback(async () => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // Measure position before showing
    await measureAnchor();
    setVisible(true);
    
    // Auto-hide plain tooltips after duration
    if (!isRich) {
      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
  }, [measureAnchor, setVisible, isRich, duration]);
  
  const hideTooltip = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setVisible(false);
  }, [setVisible]);
  
  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  
  // Calculate tooltip position
  const getTooltipPosition = (): ViewStyle => {
    if (!anchorLayout || tooltipSize.width === 0 || tooltipSize.height === 0) {
      // Position off-screen initially for measurement
      return { top: -9999, left: -9999 };
    }
    
    const padding = 12;
    const gap = 4; // Gap between anchor and tooltip
    let top = 0;
    let left = 0;
    
    // Center horizontally relative to anchor
    left = anchorLayout.x + (anchorLayout.width / 2) - (tooltipSize.width / 2);
    
    switch (position) {
      case 'top':
        // Position above the anchor
        top = anchorLayout.y - tooltipSize.height - gap;
        break;
      case 'bottom':
        // Position below the anchor
        top = anchorLayout.y + anchorLayout.height + gap;
        break;
      case 'left':
        // Position to the left, vertically centered
        top = anchorLayout.y + (anchorLayout.height / 2) - (tooltipSize.height / 2);
        left = anchorLayout.x - tooltipSize.width - gap;
        break;
      case 'right':
        // Position to the right, vertically centered
        top = anchorLayout.y + (anchorLayout.height / 2) - (tooltipSize.height / 2);
        left = anchorLayout.x + anchorLayout.width + gap;
        break;
    }
    
    // Keep on screen horizontally
    if (left + tooltipSize.width > screenWidth - padding) {
      left = screenWidth - tooltipSize.width - padding;
    }
    if (left < padding) {
      left = padding;
    }
    
    // Keep on screen vertically - flip position if needed
    if (position === 'top' && top < padding) {
      // Flip to bottom if top would go off screen
      top = anchorLayout.y + anchorLayout.height + gap;
    } else if (position === 'bottom' && top + tooltipSize.height > screenHeight - padding) {
      // Flip to top if bottom would go off screen
      top = anchorLayout.y - tooltipSize.height - gap;
    }
    
    // Final bounds check
    if (top < padding) {
      top = padding;
    }
    if (top + tooltipSize.height > screenHeight - padding) {
      top = screenHeight - tooltipSize.height - padding;
    }
    
    return { top, left };
  };
  
  // Clone the child and inject onLongPress handler
  const renderChild = () => {
    if (!isValidElement(children)) {
      return children;
    }
    
    const childProps = children.props as any;
    const originalOnLongPress = childProps.onLongPress;
    
    return cloneElement(children, {
      onLongPress: (e: any) => {
        showTooltip();
        originalOnLongPress?.(e);
      },
    } as any);
  };
  
  return (
    <View
      ref={anchorRef}
      onLayout={measureAnchor}
      collapsable={false}
    >
      {renderChild()}
      
      {visible && (
        <Modal
          visible={visible}
          transparent
          statusBarTranslucent
          animationType="fade"
          onRequestClose={hideTooltip}
        >
          <Pressable style={styles.backdrop} onPress={hideTooltip}>
            <AnimatedView
              style={[
                styles.tooltip,
                isRich ? styles.richTooltip : styles.plainTooltip,
                {
                  backgroundColor: isRich 
                    ? theme.colors.surfaceContainerLow 
                    : theme.colors.inverseSurface,
                  ...getTooltipPosition(),
                },
                tooltipStyle,
                style,
              ]}
              onLayout={handleTooltipLayout}
              testID={testID}
              accessible={true}
              accessibilityRole="text"
            >
              {isRich ? (
                <>
                  {title && (
                    <Text
                      variant="titleSmall"
                      style={[styles.title, { color: theme.colors.onSurfaceVariant }]}
                    >
                      {title}
                    </Text>
                  )}
                  <Text
                    variant="bodyMedium"
                    style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
                  >
                    {message}
                  </Text>
                  {actions && (
                    <View style={styles.actions}>
                      {actions}
                    </View>
                  )}
                </>
              ) : (
                <Text
                  variant="bodySmall"
                  style={[styles.plainMessage, { color: theme.colors.inverseOnSurface }]}
                  numberOfLines={2}
                >
                  {message}
                </Text>
              )}
            </AnimatedView>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  tooltip: {
    position: 'absolute',
  },
  plainTooltip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    maxWidth: 200,
  },
  richTooltip: {
    padding: 16,
    borderRadius: 12,
    maxWidth: 280,
    minWidth: 200,
  },
  title: {
    marginBottom: 4,
  },
  message: {},
  plainMessage: {},
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
});

export default Tooltip;
