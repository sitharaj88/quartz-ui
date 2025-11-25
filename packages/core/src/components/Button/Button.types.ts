/**
 * Quartz UI - Button Types
 * 
 * Button Specifications:
 * - Height: 40dp (medium), 34dp (small), 48dp (large)
 * - Corner radius: height/2 for stadium shape
 * - Horizontal padding: 24dp (no icon), 16dp/24dp (with icon)
 * - Icon size: 18dp
 * - Typography: labelLarge
 */

import { ViewStyle, TextStyle, PressableProps, NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { ReactNode } from 'react';
import { Size, Variant } from '../../theme/types';

export type ButtonVariant = Extract<Variant, 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'>;

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  // Content
  children?: ReactNode;
  label?: string;
  
  // Visual variants
  variant?: ButtonVariant;
  size?: Size;
  
  // Icons
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  
  // State
  loading?: boolean;
  disabled?: boolean;
  
  // Full width
  fullWidth?: boolean;
  
  // Custom colors (overrides theme)
  color?: string;
  textColor?: string;
  
  // Style overrides
  style?: ViewStyle;
  labelStyle?: TextStyle;
  contentStyle?: ViewStyle;
  
  // Focus events
  onFocus?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export interface ButtonStyleConfig {
  container: ViewStyle;
  content: ViewStyle;
  label: TextStyle;
  icon: ViewStyle;
  stateLayer: ViewStyle;
}
