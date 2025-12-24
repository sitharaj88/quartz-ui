/**
 * Quartz UI - Toast Component Types
 */

import { ViewStyle } from 'react-native';

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top' | 'bottom';

export interface ToastData {
    /** Unique ID for the toast */
    id: string;
    /** Toast message */
    message: string;
    /** Toast type */
    type: ToastType;
    /** Duration in milliseconds (0 = persistent) */
    duration: number;
    /** Optional action button */
    action?: {
        label: string;
        onPress: () => void;
    };
    /** Whether the toast can be dismissed by swipe */
    swipeToDismiss?: boolean;
}

export interface ToastProps {
    /** Toast data */
    data: ToastData;
    /** Callback when toast is dismissed */
    onDismiss: (id: string) => void;
    /** Position of the toast */
    position: ToastPosition;
    /** Index in the toast stack */
    index: number;
    /** Custom style */
    style?: ViewStyle;
}

export interface ToastProviderProps {
    /** Maximum number of visible toasts */
    maxToasts?: number;
    /** Default duration in milliseconds */
    defaultDuration?: number;
    /** Position of toasts */
    position?: ToastPosition;
    /** Children */
    children: React.ReactNode;
}

export interface ToastContextValue {
    /** Show a toast */
    show: (options: ToastShowOptions) => string;
    /** Show an info toast */
    info: (message: string, options?: Partial<ToastShowOptions>) => string;
    /** Show a success toast */
    success: (message: string, options?: Partial<ToastShowOptions>) => string;
    /** Show a warning toast */
    warning: (message: string, options?: Partial<ToastShowOptions>) => string;
    /** Show an error toast */
    error: (message: string, options?: Partial<ToastShowOptions>) => string;
    /** Dismiss a toast by ID */
    dismiss: (id: string) => void;
    /** Dismiss all toasts */
    dismissAll: () => void;
}

export interface ToastShowOptions {
    /** Toast message */
    message: string;
    /** Toast type */
    type?: ToastType;
    /** Duration in milliseconds */
    duration?: number;
    /** Action button */
    action?: {
        label: string;
        onPress: () => void;
    };
    /** Whether the toast can be dismissed by swipe */
    swipeToDismiss?: boolean;
}
