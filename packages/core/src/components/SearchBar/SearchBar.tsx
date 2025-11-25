/**
 * Quartz UI - Search Bar Component
 * 
 * Search:
 * - Search bar
 * - Search view (full screen)
 */

import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
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

export interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Callback when value changes */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Leading icon (search icon) */
  leadingIcon?: React.ReactNode;
  /** Trailing icon (avatar, etc.) */
  trailingIcon?: React.ReactNode;
  /** Callback when search is submitted */
  onSubmit?: (value: string) => void;
  /** Callback when search bar is focused */
  onFocus?: () => void;
  /** Callback when search bar is blurred */
  onBlur?: () => void;
  /** Whether the search bar is focused/expanded */
  expanded?: boolean;
  /** Whether to show clear button when there's text */
  showClearButton?: boolean;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Input style override */
  inputStyle?: StyleProp<ViewStyle>;
  /** Whether the input is editable */
  editable?: boolean;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  leadingIcon,
  trailingIcon,
  onSubmit,
  onFocus,
  onBlur,
  expanded: controlledExpanded,
  showClearButton = true,
  style,
  inputStyle,
  editable = true,
  autoFocus = false,
  testID,
}: SearchBarProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [internalFocused, setInternalFocused] = useState(false);
  
  const focused = controlledExpanded ?? internalFocused;
  const elevation = useSharedValue(focused ? 2 : 0);
  
  useEffect(() => {
    elevation.value = withSpring(focused ? 2 : 0, springConfig.gentle);
  }, [focused, elevation]);
  
  const handleFocus = useCallback((e: any) => {
    setInternalFocused(true);
    onFocus?.();
  }, [onFocus]);
  
  const handleBlur = useCallback((e: any) => {
    setInternalFocused(false);
    onBlur?.();
  }, [onBlur]);
  
  const handleSubmit = useCallback((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSubmit?.(value);
  }, [value, onSubmit, theme.accessibility.hapticFeedback]);
  
  const handleClear = useCallback(() => {
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChangeText('');
    inputRef.current?.focus();
  }, [onChangeText, theme.accessibility.hapticFeedback]);
  
  const containerStyle = useAnimatedStyle(() => ({
    // Shadow removed to prevent ghost effect during animations
  }));
  
  const showClear = showClearButton && value.length > 0;
  
  return (
    <AnimatedView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceContainerHigh,
        },
        containerStyle,
        style,
      ]}
      testID={testID}
    >
      {/* Leading Icon */}
      {leadingIcon && (
        <View style={styles.leadingIcon}>
          {leadingIcon}
        </View>
      )}
      
      {/* Default search icon if none provided */}
      {!leadingIcon && (
        <View style={styles.leadingIcon}>
          <View style={styles.searchIconContainer}>
            <View style={[styles.searchCircle, { borderColor: theme.colors.onSurface }]} />
            <View style={[styles.searchHandle, { backgroundColor: theme.colors.onSurface }]} />
          </View>
        </View>
      )}
      
      {/* Input */}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          { color: theme.colors.onSurface },
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        editable={editable}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityRole="search"
        accessibilityLabel={placeholder}
      />
      
      {/* Clear Button */}
      {showClear && (
        <Pressable
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <View style={styles.clearIcon}>
            <View
              style={[
                styles.clearLine,
                { backgroundColor: theme.colors.onSurfaceVariant, transform: [{ rotate: '45deg' }] },
              ]}
            />
            <View
              style={[
                styles.clearLine,
                { backgroundColor: theme.colors.onSurfaceVariant, transform: [{ rotate: '-45deg' }] },
              ]}
            />
          </View>
        </Pressable>
      )}
      
      {/* Trailing Icon */}
      {trailingIcon && !showClear && (
        <View style={styles.trailingIcon}>
          {trailingIcon}
        </View>
      )}
    </AnimatedView>
  );
}

/** Search suggestions list item */
export interface SearchSuggestionProps {
  text: string;
  icon?: React.ReactNode;
  onPress: () => void;
  testID?: string;
}

export function SearchSuggestion({
  text,
  icon,
  onPress,
  testID,
}: SearchSuggestionProps) {
  const theme = useTheme();
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.suggestion,
        pressed && { backgroundColor: theme.colors.onSurface + '0D' },
      ]}
      testID={testID}
    >
      {icon && <View style={styles.suggestionIcon}>{icon}</View>}
      <Text
        variant="bodyLarge"
        style={[styles.suggestionText, { color: theme.colors.onSurface }]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 4,
  },
  leadingIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  searchHandle: {
    width: 6,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
    bottom: 2,
    right: 2,
    transform: [{ rotate: '45deg' }],
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearLine: {
    position: 'absolute',
    width: 14,
    height: 2,
    borderRadius: 1,
  },
  trailingIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
  },
  suggestionIcon: {
    width: 24,
    marginEnd: 16,
    alignItems: 'center',
  },
  suggestionText: {
    flex: 1,
  },
});

export default SearchBar;
