/**
 * Quartz UI - Bottom Sheet Component
 * 
 * Bottom Sheets:
 * - Standard (non-modal)
 * - Modal
 */

import React, { useCallback, useEffect } from 'react';
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  useWindowDimensions,
  BackHandler,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { springConfig } from '../../tokens/motion';

export interface BottomSheetProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;
  /** Callback when sheet is dismissed */
  onDismiss: () => void;
  /** Sheet content */
  children: React.ReactNode;
  /** Whether the sheet is modal (has backdrop) */
  modal?: boolean;
  /** Whether to show drag handle */
  showDragHandle?: boolean;
  /** Height of the sheet (auto, percentage, or fixed) */
  height?: 'auto' | number | `${number}%`;
  /** Whether the sheet can be dismissed by dragging */
  dismissable?: boolean;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Content style override */
  contentStyle?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const DRAG_THRESHOLD = 100;

export function BottomSheet({
  visible,
  onDismiss,
  children,
  modal = true,
  showDragHandle = true,
  height = 'auto',
  dismissable = true,
  style,
  contentStyle,
  testID,
}: BottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  
  const translateY = useSharedValue(screenHeight);
  const opacity = useSharedValue(0);
  const dragY = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, springConfig.gentle);
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(screenHeight, { duration: 250 });
    }
  }, [visible, opacity, translateY, screenHeight]);
  
  useEffect(() => {
    if (!visible || Platform.OS !== 'android') return;
    
    const handleBack = () => {
      if (dismissable) {
        onDismiss();
        return true;
      }
      return false;
    };
    
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => subscription.remove();
  }, [visible, dismissable, onDismiss]);
  
  const handleBackdropPress = useCallback(() => {
    if (!dismissable) return;
    
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onDismiss();
  }, [dismissable, onDismiss, theme.accessibility.hapticFeedback]);
  
  const dragGesture = Gesture.Pan()
    .enabled(dismissable)
    .onUpdate((event) => {
      if (event.translationY > 0) {
        dragY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > DRAG_THRESHOLD) {
        runOnJS(onDismiss)();
      } else {
        dragY.value = withSpring(0, springConfig.gentle);
      }
    });
  
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));
  
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + dragY.value }],
  }));
  
  const calculatedHeight = height === 'auto' 
    ? undefined 
    : typeof height === 'string' && height.endsWith('%')
    ? (parseFloat(height) / 100) * screenHeight
    : height;
  
  const content = (
    <GestureHandlerRootView style={styles.gestureContainer}>
      {modal && (
        <Pressable
          onPress={handleBackdropPress}
          style={styles.backdropPressable}
        >
          <AnimatedView
            style={[
              styles.backdrop,
              { backgroundColor: theme.colors.scrim },
              backdropStyle,
            ]}
          />
        </Pressable>
      )}
      
      <AnimatedView
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surfaceContainerLow,
            paddingBottom: insets.bottom + 16,
            height: calculatedHeight,
            maxHeight: screenHeight * 0.9,
          },
          sheetStyle,
          style,
        ]}
        testID={testID}
      >
        <GestureDetector gesture={dragGesture}>
          <View style={styles.handleContainer}>
            {showDragHandle && (
              <View
                style={[
                  styles.dragHandle,
                  { backgroundColor: theme.colors.onSurfaceVariant + '66' },
                ]}
              />
            )}
          </View>
        </GestureDetector>
        
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      </AnimatedView>
    </GestureHandlerRootView>
  );
  
  if (modal) {
    return (
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={dismissable ? onDismiss : undefined}
      >
        {content}
      </Modal>
    );
  }
  
  if (!visible) return null;
  
  return content;
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 6,
  },
  dragHandle: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default BottomSheet;
