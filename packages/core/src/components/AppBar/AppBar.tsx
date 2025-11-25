/**
 * Quartz UI - App Bar Component
 * 
 * Top App Bar variants:
 * - Center-aligned
 * - Small
 * - Medium
 * - Large
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';

export interface AppBarAction {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
}

export interface AppBarProps {
  /** App bar title */
  title: string;
  /** App bar variant */
  variant?: 'center-aligned' | 'small' | 'medium' | 'large';
  /** Navigation icon (back/menu) */
  navigationIcon?: React.ReactNode;
  /** Callback when navigation icon is pressed */
  onNavigationPress?: () => void;
  /** Action icons on the right */
  actions?: AppBarAction[];
  /** Whether the app bar is elevated (scrolled) */
  elevated?: boolean;
  /** Custom background color */
  backgroundColor?: string;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

export function AppBar({
  title,
  variant = 'small',
  navigationIcon,
  onNavigationPress,
  actions = [],
  elevated = false,
  backgroundColor,
  style,
  testID,
}: AppBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  const bgColor = backgroundColor ?? (elevated 
    ? theme.colors.surfaceContainerHigh 
    : theme.colors.surface);
  
  const isCentered = variant === 'center-aligned';
  const isExpanded = variant === 'medium' || variant === 'large';
  
  const containerHeight = isExpanded 
    ? (variant === 'large' ? 152 : 112) 
    : 64;
  
  const titleVariant = variant === 'large' 
    ? 'headlineMedium' 
    : variant === 'medium' 
    ? 'headlineSmall' 
    : 'titleLarge';
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          paddingTop: insets.top,
          minHeight: containerHeight + insets.top,
        },
        elevated && styles.elevated,
        style,
      ]}
      testID={testID}
    >
      {/* Top Row */}
      <View style={styles.topRow}>
        {/* Navigation Icon */}
        {navigationIcon ? (
          <Pressable
            onPress={onNavigationPress}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && { opacity: 0.7 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Navigate back"
          >
            {navigationIcon}
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
        
        {/* Title (for small/center-aligned) */}
        {!isExpanded && (
          <Text
            variant={titleVariant}
            style={[
              styles.title,
              isCentered && styles.centeredTitle,
              { color: theme.colors.onSurface },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        
        {/* Actions */}
        <View style={styles.actions}>
          {actions.slice(0, 3).map((action, index) => (
            <Pressable
              key={index}
              onPress={action.onPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && { opacity: 0.7 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={action.accessibilityLabel}
            >
              {action.icon}
            </Pressable>
          ))}
        </View>
      </View>
      
      {/* Expanded Title (for medium/large) */}
      {isExpanded && (
        <View
          style={[
            styles.expandedTitleContainer,
            variant === 'large' && styles.largeTitleContainer,
          ]}
        >
          <Text
            variant={titleVariant}
            style={[
              styles.expandedTitle,
              { color: theme.colors.onSurface },
            ]}
            numberOfLines={variant === 'large' ? 2 : 1}
          >
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  elevated: {
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 4,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    marginStart: 4,
  },
  centeredTitle: {
    textAlign: 'center',
    marginStart: 0,
    marginEnd: 48, // Balance with navigation icon
  },
  actions: {
    flexDirection: 'row',
  },
  expandedTitleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    justifyContent: 'flex-end',
  },
  largeTitleContainer: {
    flex: 1,
    paddingBottom: 28,
  },
  expandedTitle: {},
});

export default AppBar;
