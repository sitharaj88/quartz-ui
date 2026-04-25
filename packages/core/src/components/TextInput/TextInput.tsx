/**
 * Quartz UI - TextInput (Material 3 TextField)
 *
 * Two variants × full a11y. Floating label, helper/error text, leading/trailing
 * icons, character counter, error state with screen-reader live announcement.
 *
 * forwardRef → underlying React Native TextInput (so consumers can call
 * focus(), blur(), clear(), isFocused() imperatively).
 */

import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  I18nManager,
  NativeSyntheticEvent,
  Platform,
  Text,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  TextInputProps as RNTextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { duration } from '../../tokens/motion';
import { withAlpha } from '../../utils/color';

export type TextInputVariant = 'filled' | 'outlined';

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  variant?: TextInputVariant;
  /** Floating label. Becomes the implicit `accessibilityLabel`. */
  label?: string;
  /** Helper text shown below the field. Hidden when `errorText` is set. */
  helperText?: string;
  /** Error state. Triggers error styling and announces `errorText` to screen readers. */
  error?: boolean;
  /** Error message (also forces `error` true). */
  errorText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  maxLength?: number;
  /** Show "current/max" counter below the field. Requires `maxLength`. */
  showCounter?: boolean;
  disabled?: boolean;
  /** Mark the field as required (sets `accessibilityState.required` for SR users). */
  required?: boolean;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

const TextInputImpl = forwardRef<RNTextInput, TextInputProps>(function TextInput(
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
    required = false,
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
  const reduceMotion = useReducedMotion();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? defaultValue ?? '');

  const initialValue = value ?? defaultValue ?? '';
  const labelPosition = useSharedValue(initialValue.length > 0 ? 1 : 0);

  const currentValue = value ?? inputValue;
  const hasValue = currentValue.length > 0;
  const showError = error || !!errorText;
  const supportText = showError ? errorText : helperText;

  const animateLabel = useCallback(
    (target: 0 | 1) => {
      labelPosition.value = reduceMotion
        ? target
        : withTiming(target, { duration: duration.short4 });
    },
    [labelPosition, reduceMotion]
  );

  // Sync label position when controlled value changes.
  useEffect(() => {
    if (currentValue.length > 0 && labelPosition.value === 0) {
      animateLabel(1);
    } else if (currentValue.length === 0 && !isFocused && labelPosition.value === 1) {
      animateLabel(0);
    }
  }, [currentValue, isFocused, labelPosition, animateLabel]);

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      animateLabel(1);
      onFocus?.(e as never);
    },
    [animateLabel, onFocus]
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      if (!hasValue) animateLabel(0);
      onBlur?.(e as never);
    },
    [hasValue, animateLabel, onBlur]
  );

  const handleChangeText = useCallback(
    (text: string) => {
      setInputValue(text);
      onChangeText?.(text);
      if (text.length > 0 && labelPosition.value === 0) animateLabel(1);
    },
    [animateLabel, labelPosition, onChangeText]
  );

  // Resolve colors. Disabled overrides everything; error overrides default.
  const colors = (() => {
    if (disabled) {
      return {
        container: variant === 'filled' ? withAlpha(theme.colors.onSurface, 0.04) : 'transparent',
        border: withAlpha(theme.colors.onSurface, 0.38),
        label: withAlpha(theme.colors.onSurface, 0.38),
        input: withAlpha(theme.colors.onSurface, 0.38),
        support: withAlpha(theme.colors.onSurface, 0.38),
        indicator: withAlpha(theme.colors.onSurface, 0.38),
      };
    }
    if (showError) {
      return {
        container: variant === 'filled' ? theme.colors.surfaceContainerHighest : 'transparent',
        border: theme.colors.error,
        label: theme.colors.error,
        input: theme.colors.onSurface,
        support: theme.colors.error,
        indicator: theme.colors.error,
      };
    }
    return {
      container: variant === 'filled' ? theme.colors.surfaceContainerHighest : 'transparent',
      border: isFocused ? theme.colors.primary : theme.colors.outline,
      label: isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant,
      input: theme.colors.onSurface,
      support: theme.colors.onSurfaceVariant,
      indicator: theme.colors.primary,
    };
  })();

  const animatedLabelStyle = useAnimatedStyle(() => {
    const restingTop = 18;
    const floatingTop = variant === 'filled' ? 8 : -8;
    const top = interpolate(labelPosition.value, [0, 1], [restingTop, floatingTop]);
    const fontSize = interpolate(labelPosition.value, [0, 1], [16, 12]);
    const lineHeight = interpolate(labelPosition.value, [0, 1], [24, 16]);
    const paddingHorizontal =
      variant === 'outlined' && labelPosition.value > 0.5 ? 4 : 0;
    const backgroundColor =
      variant === 'outlined' && labelPosition.value > 0.5 ? theme.colors.surface : 'transparent';
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

  const containerStyles: ViewStyle = {
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.6 : 1,
    ...containerStyle,
  };

  const inputContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
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

  const indicatorStyles: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: isFocused ? 2 : 1,
    backgroundColor: isFocused ? colors.indicator : colors.border,
  };

  // Build the label that screen readers will read. Append "required" hint.
  const a11yLabel = accessibilityLabel ?? label;
  const a11yHint = accessibilityHint;

  return (
    <View style={containerStyles} testID={testID}>
      <View style={inputContainerStyles}>
        {label && (
          <AnimatedText
            style={[
              animatedLabelStyle,
              { color: colors.label, fontFamily: theme.typography.bodySmall.fontFamily },
            ]}
            // The floating label visual duplicates the input's a11y label;
            // hide from AT to avoid double-announcement.
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {label}
            {required ? ' *' : ''}
          </AnimatedText>
        )}

        {leadingIcon && <View style={{ marginEnd: 12, width: 24, height: 24 }}>{leadingIcon}</View>}

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
              paddingTop: label ? (variant === 'filled' ? 24 : 16) : 16,
              paddingBottom: label ? 8 : 16,
              color: colors.input,
              fontSize: 16,
              lineHeight: 24,
            },
            Platform.OS === 'web'
              ? ({ outlineStyle: 'none', outlineWidth: 0 } as unknown as TextStyle)
              : null,
            inputStyle,
          ]}
          placeholder={isFocused || hasValue ? inputProps.placeholder : ''}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onFocus={handleFocus as unknown as RNTextInputProps['onFocus']}
          onBlur={handleBlur as unknown as RNTextInputProps['onBlur']}
          onChangeText={handleChangeText}
          accessible
          accessibilityLabel={a11yLabel}
          accessibilityHint={a11yHint}
          accessibilityState={{ disabled, ...(showError ? { invalid: true } : null) }}
          {...(required ? { 'aria-required': true } : null)}
        />

        {trailingIcon && (
          <View style={{ marginStart: 12, width: 24, height: 24 }}>{trailingIcon}</View>
        )}

        {variant === 'filled' && <View style={indicatorStyles} />}
      </View>

      {(supportText || showCounter) && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 4,
          }}
        >
          {/* Error text gets a polite live region so SR users hear it land. */}
          <Text
            style={{ ...theme.typography.bodySmall, color: colors.support, flex: 1 }}
            accessibilityLiveRegion={showError ? 'polite' : 'none'}
            accessibilityRole={showError ? 'alert' : undefined}
          >
            {supportText}
          </Text>
          {showCounter && maxLength && (
            <Text style={{ ...theme.typography.bodySmall, color: colors.support }}>
              {currentValue.length}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

TextInputImpl.displayName = 'TextInput';

export const TextInput = memo(TextInputImpl);

export default TextInput;
