/**
 * Quartz UI - Divider Component
 * 
 * Divider for separating content
 */

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface DividerProps {
  // Orientation
  orientation?: 'horizontal' | 'vertical';
  
  // Inset from edges (for horizontal dividers)
  inset?: 'none' | 'start' | 'end' | 'both';
  
  // Custom inset value
  insetValue?: number;
  
  // Style override
  style?: StyleProp<ViewStyle>;
  
  // Test ID
  testID?: string;
}

/**
 * Divider Component
 */
export function Divider({
  orientation = 'horizontal',
  inset = 'none',
  insetValue = 16,
  style,
  testID,
}: DividerProps): React.ReactElement {
  const theme = useTheme();
  
  // Get inset margins
  const getMargins = (): ViewStyle => {
    if (orientation === 'vertical') {
      return {};
    }
    
    switch (inset) {
      case 'start':
        return { marginStart: insetValue };
      case 'end':
        return { marginEnd: insetValue };
      case 'both':
        return { marginHorizontal: insetValue };
      default:
        return {};
    }
  };
  
  // Divider styles
  const dividerStyle: ViewStyle = {
    backgroundColor: theme.colors.outlineVariant,
    ...(orientation === 'horizontal' 
      ? { height: 1, width: '100%' }
      : { width: 1, height: '100%' }
    ),
    ...getMargins(),
  };

  return (
    <View 
      style={[dividerStyle, style]} 
      testID={testID}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}

export default Divider;
