/**
 * Quartz UI - Toast Component
 * 
 * Modern notification system with:
 * - Multiple variants: info, success, warning, error
 * - Auto-dismiss with configurable duration
 * - Swipe to dismiss gesture
 * - Action button support
 * - Queue management via ToastProvider
 */

import React, {
    forwardRef,
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    ViewStyle,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    FadeIn,
    FadeOut,
    SlideInUp,
    SlideInDown,
    SlideOutUp,
    SlideOutDown,
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import {
    ToastData,
    ToastProps,
    ToastProviderProps,
    ToastContextValue,
    ToastShowOptions,
    ToastType,
    ToastPosition,
} from './Toast.types';

// Generate unique ID
function generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Toast context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Hook to use toast
 */
export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

/**
 * Get icon for toast type
 */
function getToastIcon(type: ToastType): string {
    switch (type) {
        case 'success':
            return '✓';
        case 'error':
            return '✕';
        case 'warning':
            return '⚠';
        case 'info':
        default:
            return 'ℹ';
    }
}

/**
 * Get background color for toast type
 */
function getToastColors(type: ToastType, theme: any): { bg: string; text: string; icon: string } {
    switch (type) {
        case 'success':
            return {
                bg: '#1B5E20',
                text: '#FFFFFF',
                icon: '#4CAF50',
            };
        case 'error':
            return {
                bg: theme.colors.errorContainer,
                text: theme.colors.onErrorContainer,
                icon: theme.colors.error,
            };
        case 'warning':
            return {
                bg: '#F57C00',
                text: '#FFFFFF',
                icon: '#FFB74D',
            };
        case 'info':
        default:
            return {
                bg: theme.colors.inverseSurface,
                text: theme.colors.inverseOnSurface,
                icon: theme.colors.inversePrimary,
            };
    }
}

/**
 * Individual Toast Component
 */
const Toast = forwardRef<View, ToastProps>(function Toast(
    {
        data,
        onDismiss,
        position,
        index,
        style,
    },
    ref
) {
    const theme = useTheme();
    const translateX = useSharedValue(0);
    const screenWidth = Dimensions.get('window').width;

    // Colors based on type
    const colors = getToastColors(data.type, theme);
    const icon = getToastIcon(data.type);

    // Handle dismiss
    const handleDismiss = useCallback(() => {
        onDismiss(data.id);
    }, [data.id, onDismiss]);

    // Auto-dismiss timer
    useEffect(() => {
        if (data.duration > 0) {
            const timer = setTimeout(handleDismiss, data.duration);
            return () => clearTimeout(timer);
        }
    }, [data.duration, handleDismiss]);

    // Swipe gesture
    const panGesture = Gesture.Pan()
        .enabled(data.swipeToDismiss !== false)
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > screenWidth * 0.3) {
                translateX.value = withTiming(
                    event.translationX > 0 ? screenWidth : -screenWidth,
                    { duration: 200 },
                    () => runOnJS(handleDismiss)()
                );
            } else {
                translateX.value = withSpring(0);
            }
        });

    // Animated style
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: 1 - Math.abs(translateX.value) / screenWidth,
    }));

    // Entry/exit animations
    const entering = position === 'top' ? SlideInUp : SlideInDown;
    const exiting = position === 'top' ? SlideOutUp : SlideOutDown;

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                ref={ref}
                entering={entering.duration(300)}
                exiting={exiting.duration(200)}
                style={[
                    styles.toast,
                    {
                        backgroundColor: colors.bg,
                        marginTop: index > 0 ? 8 : 0,
                    },
                    animatedStyle,
                    style,
                ]}
                accessible={true}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
            >
                {/* Icon */}
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: colors.icon + '20' },
                    ]}
                >
                    <Text style={[styles.icon, { color: colors.icon }]}>{icon}</Text>
                </View>

                {/* Message */}
                <Text
                    style={[styles.message, { color: colors.text }]}
                    numberOfLines={3}
                >
                    {data.message}
                </Text>

                {/* Action button */}
                {data.action && (
                    <Pressable
                        onPress={() => {
                            data.action?.onPress();
                            handleDismiss();
                        }}
                        style={styles.actionButton}
                    >
                        <Text style={[styles.actionText, { color: colors.icon }]}>
                            {data.action.label}
                        </Text>
                    </Pressable>
                )}

                {/* Close button */}
                <Pressable
                    onPress={handleDismiss}
                    style={styles.closeButton}
                    accessibilityLabel="Dismiss"
                >
                    <Text style={[styles.closeIcon, { color: colors.text }]}>✕</Text>
                </Pressable>
            </Animated.View>
        </GestureDetector>
    );
});

/**
 * Toast Provider Component
 */
export function ToastProvider({
    maxToasts = 3,
    defaultDuration = 4000,
    position = 'bottom',
    children,
}: ToastProviderProps) {
    const insets = useSafeAreaInsets();
    const [toasts, setToasts] = useState<ToastData[]>([]);

    // Show toast
    const show = useCallback((options: ToastShowOptions): string => {
        const id = generateId();
        const toast: ToastData = {
            id,
            message: options.message,
            type: options.type ?? 'info',
            duration: options.duration ?? defaultDuration,
            action: options.action,
            swipeToDismiss: options.swipeToDismiss ?? true,
        };

        setToasts((prev) => {
            const updated = [...prev, toast];
            // Limit to maxToasts
            if (updated.length > maxToasts) {
                return updated.slice(-maxToasts);
            }
            return updated;
        });

        return id;
    }, [defaultDuration, maxToasts]);

    // Convenience methods
    const info = useCallback((message: string, options?: Partial<ToastShowOptions>) => {
        return show({ message, type: 'info', ...options });
    }, [show]);

    const success = useCallback((message: string, options?: Partial<ToastShowOptions>) => {
        return show({ message, type: 'success', ...options });
    }, [show]);

    const warning = useCallback((message: string, options?: Partial<ToastShowOptions>) => {
        return show({ message, type: 'warning', ...options });
    }, [show]);

    const error = useCallback((message: string, options?: Partial<ToastShowOptions>) => {
        return show({ message, type: 'error', ...options });
    }, [show]);

    // Dismiss toast
    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Dismiss all toasts
    const dismissAll = useCallback(() => {
        setToasts([]);
    }, []);

    // Context value
    const contextValue = useMemo<ToastContextValue>(() => ({
        show,
        info,
        success,
        warning,
        error,
        dismiss,
        dismissAll,
    }), [show, info, success, warning, error, dismiss, dismissAll]);

    // Container style
    const containerStyle: ViewStyle = {
        position: 'absolute',
        left: 16,
        right: 16,
        ...(position === 'top'
            ? { top: insets.top + 16 }
            : { bottom: insets.bottom + 16 }),
        zIndex: 9999,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <View style={containerStyle} pointerEvents="box-none">
                {toasts.map((toast, index) => (
                    <Toast
                        key={toast.id}
                        data={toast}
                        onDismiss={dismiss}
                        position={position}
                        index={index}
                    />
                ))}
            </View>
        </ToastContext.Provider>
    );
}

const styles = StyleSheet.create({
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 16,
        fontWeight: '700',
    },
    message: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    actionButton: {
        marginLeft: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    closeButton: {
        marginLeft: 8,
        padding: 4,
    },
    closeIcon: {
        fontSize: 14,
        opacity: 0.7,
    },
});

export { Toast };
export default ToastProvider;
