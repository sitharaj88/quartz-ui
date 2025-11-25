/**
 * Quartz UI - Dialog Component
 * 
 * Dialog with:
 * - Basic dialog
 * - Full-screen dialog
 * - Alert dialog
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
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { springConfig } from '../../tokens/motion';
import { Text } from '../Text';
import { Button } from '../Button';

export interface DialogAction {
  label: string;
  onPress: () => void;
  variant?: 'text' | 'filled' | 'outlined' | 'tonal';
}

export interface DialogProps {
  /** Whether the dialog is visible */
  visible: boolean;
  /** Callback when dialog is dismissed */
  onDismiss: () => void;
  /** Dialog title */
  title?: string;
  /** Dialog content/message */
  children?: React.ReactNode;
  /** Action buttons */
  actions?: DialogAction[];
  /** Whether to show full-screen dialog */
  fullScreen?: boolean;
  /** Whether to dismiss on backdrop press */
  dismissable?: boolean;
  /** Custom icon or illustration */
  icon?: React.ReactNode;
  /** Style override for content */
  contentStyle?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Dialog({
  visible,
  onDismiss,
  title,
  children,
  actions = [],
  fullScreen = false,
  dismissable = true,
  icon,
  contentStyle,
  testID,
}: DialogProps) {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, springConfig.gentle);
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.9, { duration: 150 });
    }
  }, [visible, opacity, scale]);
  
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
  
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));
  
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: fullScreen ? [] : [{ scale: scale.value }],
  }));
  
  const maxWidth = fullScreen ? screenWidth : Math.min(560, screenWidth - 48);
  const maxHeight = fullScreen ? screenHeight : screenHeight * 0.85;
  
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={dismissable ? onDismiss : undefined}
      testID={testID}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
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
        
        {/* Dialog */}
        <AnimatedView
          style={[
            styles.dialog,
            {
              backgroundColor: theme.colors.surfaceContainerHigh,
              maxWidth,
              maxHeight,
              borderRadius: fullScreen ? 0 : 28,
            },
            containerStyle,
            fullScreen && styles.fullScreenDialog,
          ]}
          accessible={true}
          accessibilityRole="alert"
          accessibilityViewIsModal={true}
        >
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={[styles.contentContainer, contentStyle]}
            showsVerticalScrollIndicator={false}
          >
            {/* Icon */}
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            
            {/* Title */}
            {title && (
              <Text
                variant="headlineSmall"
                style={[
                  styles.title,
                  { color: theme.colors.onSurface },
                  icon ? styles.titleWithIcon : undefined,
                ]}
              >
                {title}
              </Text>
            )}
            
            {/* Content */}
            {typeof children === 'string' ? (
              <Text
                variant="bodyMedium"
                style={[styles.content, { color: theme.colors.onSurfaceVariant }]}
              >
                {children}
              </Text>
            ) : (
              <View style={styles.content}>{children}</View>
            )}
          </ScrollView>
          
          {/* Actions */}
          {actions.length > 0 && (
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant ?? 'text'}
                  onPress={action.onPress}
                  style={styles.actionButton}
                >
                  {action.label}
                </Button>
              ))}
            </View>
          )}
        </AnimatedView>
      </View>
    </Modal>
  );
}

/** Alert Dialog - convenience component for simple alerts */
export interface AlertDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  destructive?: boolean;
  testID?: string;
}

export function AlertDialog({
  visible,
  onDismiss,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel,
  onConfirm,
  destructive = false,
  testID,
}: AlertDialogProps) {
  const theme = useTheme();
  
  const actions: DialogAction[] = [];
  
  if (cancelLabel) {
    actions.push({
      label: cancelLabel,
      onPress: onDismiss,
      variant: 'text',
    });
  }
  
  actions.push({
    label: confirmLabel,
    onPress: () => {
      onConfirm?.();
      onDismiss();
    },
    variant: destructive ? 'filled' : 'text',
  });
  
  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      title={title}
      actions={actions}
      testID={testID}
    >
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {message}
      </Text>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dialog: {
    minWidth: 280,
    overflow: 'hidden',
  },
  fullScreenDialog: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 0,
    flexShrink: 1,
  },
  contentContainer: {
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  titleWithIcon: {
    textAlign: 'center',
  },
  content: {},
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  actionButton: {},
});

export default Dialog;
