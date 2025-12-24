/**
 * Quartz UI - Text Input (TextField)
 * 
 * Text Field with two variants:
 * - Filled: Filled container background
 * - Outlined: Border outline
 */

import React, { useState, useRef, useCallback, forwardRef, useEffect } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  I18nManager,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { duration } from '../../tokens/motion';

export type TextInputVariant = 'filled' | 'outlined';

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  // Variant
  variant?: TextInputVariant;

  // Label text (floating label)
  label?: string;

  // Helper/support text
  helperText?: string;

  // Error state
  error?: boolean;
  errorText?: string;

  // Leading icon
  leadingIcon?: React.ReactNode;

  // Trailing icon (or clear button)
  trailingIcon?: React.ReactNode;

  // Character counter
  maxLength?: number;
  showCounter?: boolean;

  // Disabled state
  disabled?: boolean;

  // Full width
  fullWidth?: boolean;

  // Style overrides
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

/**
 * TextInput Component
 */
export const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput(
  {
    variant = 'filled',
    label,
    helperText,
    error = false,
    errorText,
    leadingIcon,
    trailingIcon,
    maxLength,
    showCounter = false,
    disabled = false,
    fullWidth = true,
    containerStyle,
    inputStyle,
    accessibilityLabel,
    accessibilityHint,
    testID,
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChangeText,
    ...inputProps
  },
  ref
): React.ReactElement {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? defaultValue ?? '');

  // Calculate initial label position based on whether there's a value
  const initialValue = value ?? defaultValue ?? '';
  const labelPosition = useSharedValue(initialValue.length > 0 ? 1 : 0);

  const hasValue = (value ?? inputValue).length > 0;
  const showError = error || !!errorText;
  const supportText = showError ? errorText : helperText;

  // Sync label position when controlled value changes
  useEffect(() => {
    const currentValue = value ?? inputValue;
    if (currentValue.length > 0 && labelPosition.value === 0) {
      labelPosition.value = withTiming(1, { duration: duration.short4 });
    } else if (currentValue.length === 0 && !isFocused && labelPosition.value === 1) {
      labelPosition.value = withTiming(0, { duration: duration.short4 });
    }
  }, [value, inputValue, isFocused, labelPosition]);

  // Handle focus
  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    labelPosition.value = withTiming(1, { duration: duration.short4 });
    onFocus?.(e);
  }, [labelPosition, onFocus]);

  // Handle blur
  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    if (!hasValue) {
      labelPosition.value = withTiming(0, { duration: duration.short4 });
    }
    onBlur?.(e);
  }, [hasValue, labelPosition, onBlur]);

  // Handle text change
  const handleChangeText = useCallback((text: string) => {
    setInputValue(text);
    onChangeText?.(text);

    if (text.length > 0 && !isFocused) {
      labelPosition.value = withTiming(1, { duration: duration.short4 });
    }
  }, [isFocused, labelPosition, onChangeText]);

  // Get colors
  const getColors = () => {
    if (disabled) {
      return {
        container: variant === 'filled'
          ? theme.colors.onSurface + '0A' // 4%
          : 'transparent',
        border: theme.colors.onSurface + '61', // 38%
        label: theme.colors.onSurface + '61',
        input: theme.colors.onSurface + '61',
        support: theme.colors.onSurface + '61',
        indicator: theme.colors.onSurface + '61',
      };
    }

    if (showError) {
      return {
        container: variant === 'filled'
          ? theme.colors.surfaceContainerHighest
          : 'transparent',
        border: theme.colors.error,
        label: isFocused ? theme.colors.error : theme.colors.error,
        input: theme.colors.onSurface,
        support: theme.colors.error,
        indicator: theme.colors.error,
      };
    }

    return {
      container: variant === 'filled'
        ? theme.colors.surfaceContainerHighest
        : 'transparent',
      border: isFocused ? theme.colors.primary : theme.colors.outline,
      label: isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant,
      input: theme.colors.onSurface,
      support: theme.colors.onSurfaceVariant,
      indicator: theme.colors.primary,
    };
  };

  const colors = getColors();

  // Animated label styles
  const animatedLabelStyle = useAnimatedStyle(() => {
    // MD3 specs: 
    // - Filled: resting label at center (vertically centered), focused/filled at top (8dp from top)
    // - Outlined: resting label at center, focused/filled outside the border (with background)
    const restingTop = 18; // Vertically centered in 56dp container
    const floatingTop = variant === 'filled' ? 8 : -8;

    const top = interpolate(labelPosition.value, [0, 1], [restingTop, floatingTop]);
    const fontSize = interpolate(labelPosition.value, [0, 1], [16, 12]);
    const lineHeight = interpolate(labelPosition.value, [0, 1], [24, 16]);

    // For outlined, add horizontal padding and background when floating
    const paddingHorizontal = variant === 'outlined' && labelPosition.value > 0.5 ? 4 : 0;
    const backgroundColor = variant === 'outlined' && labelPosition.value > 0.5
      ? theme.colors.surface
      : 'transparent';

    // RTL support: use start/end instead of left/right
    const startPosition = leadingIcon ? 48 : 16;

    return {
      position: 'absolute',
      ...(I18nManager.isRTL ? { right: startPosition } : { left: startPosition }),
      top,
      fontSize,
      lineHeight,
      paddingHorizontal,
      backgroundColor,
      zIndex: 10,
    };
  });

  // Container styles
  const containerStyles: ViewStyle = {
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.38 : 1,
    ...containerStyle,
  };

  // Input container styles
  const inputContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56, // MD3 standard height
    paddingHorizontal: 16,
    backgroundColor: colors.container,
    ...(variant === 'filled' && {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    }),
    ...(variant === 'outlined' && {
      borderWidth: isFocused ? 2 : 1,
      borderColor: colors.border,
      borderRadius: 4,
    }),
  };

  // Active indicator for filled variant
  const indicatorStyles: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: isFocused ? 2 : 1,
    backgroundColor: isFocused ? colors.indicator : colors.border,
  };

  return (
    <View style={containerStyles} testID={testID}>
      {/* Input container */}
      <View style={inputContainerStyles}>
        {/* Floating label */}
        {label && (
          <AnimatedText
            style={[
              animatedLabelStyle,
              {
                color: colors.label,
                fontFamily: theme.typography.bodySmall.fontFamily,
              },
            ]}
          >
            {label}
          </AnimatedText>
        )}

        {/* Leading icon */}
        {leadingIcon && (
          <View style={{ marginEnd: 12, width: 24, height: 24 }}>
            {leadingIcon}
          </View>
        )}

        {/* Text input */}
        <RNTextInput
          ref={ref}
          {...inputProps}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          editable={!disabled}
          style={[
            {
              flex: 1,
              // MD3: When label is present, push input down to make room for floating label
              // Filled: label floats at top=8, needs ~24dp space, so input starts at ~24dp
              // Outlined: label floats outside, less padding needed
              paddingTop: label ? (variant === 'filled' ? 24 : 16) : 16,
              paddingBottom: label ? 8 : 16,
              color: colors.input,
              fontSize: 16,
              lineHeight: 24,
            },
            // Remove default browser outline on web
            Platform.OS === 'web' && ({
              outlineStyle: 'none',
              outlineWidth: 0,
            } as unknown as TextStyle),
            inputStyle,
          ]}
          // MD3: Placeholder only shows when label is floating (focused or has value)
          // When inactive and empty, only the resting label is visible
          placeholder={isFocused || hasValue ? inputProps.placeholder : ''}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          accessible={true}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled }}
        />

        {/* Trailing icon */}
        {trailingIcon && (
          <View style={{ marginStart: 12, width: 24, height: 24 }}>
            {trailingIcon}
          </View>
        )}

        {/* Active indicator for filled variant */}
        {variant === 'filled' && <View style={indicatorStyles} />}
      </View>

      {/* Supporting text row */}
      {(supportText || showCounter) && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 4,
        }}>
          <Text style={{
            ...theme.typography.bodySmall,
            color: colors.support,
            flex: 1,
          }}>
            {supportText}
          </Text>

          {showCounter && maxLength && (
            <Text style={{
              ...theme.typography.bodySmall,
              color: colors.support,
            }}>
              {(value ?? inputValue).length}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

export default TextInput;
