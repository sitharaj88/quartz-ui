/**
 * Quartz UI - Bottom App Bar Component
 *
 * Material 3 bottom app bar:
 * - Bottom-anchored, 80dp tall, surfaceContainer color, elevation level 2
 * - Up to 4 leading icon-button actions
 * - Optional trailing FAB slot
 * - Safe-area aware bottom inset
 */

import React, { forwardRef, memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/ThemeProvider';
import type { BottomAppBarProps } from './BottomAppBar.types';

const BAR_HEIGHT = 80;
const MAX_ACTIONS = 4;

const BottomAppBarImpl = forwardRef<View, BottomAppBarProps>(function BottomAppBar(
  {
    actions = [],
    fab,
    elevated = true,
    backgroundColor,
    style,
    accessibilityLabel,
    testID,
  },
  ref
) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const bgColor = backgroundColor ?? theme.colors.surfaceContainer;

  return (
    <View
      ref={ref}
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          paddingBottom: insets.bottom,
          minHeight: BAR_HEIGHT + insets.bottom,
        },
        elevated && theme.elevation(2),
        style,
      ]}
      testID={testID}
      accessibilityRole="toolbar"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.row}>
        {/* Leading Actions */}
        <View style={styles.actions}>
          {actions.slice(0, MAX_ACTIONS).map((action, index) => (
            <Pressable
              key={index}
              onPress={action.onPress}
              disabled={action.disabled}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
                action.disabled && styles.disabledAction,
              ]}
              accessibilityRole="button"
              accessibilityLabel={action.accessibilityLabel}
              accessibilityState={{ disabled: !!action.disabled }}
              testID={action.testID}
            >
              {action.icon}
            </Pressable>
          ))}
        </View>

        {/* Trailing FAB slot */}
        {fab != null && <View style={styles.fab}>{fab}</View>}
      </View>
    </View>
  );
});

BottomAppBarImpl.displayName = 'BottomAppBar';

export const BottomAppBar = memo(BottomAppBarImpl);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_HEIGHT,
    paddingStart: 4,
    paddingEnd: 16,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabledAction: {
    opacity: 0.38,
  },
  fab: {
    marginStart: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomAppBar;
