/**
 * Quartz UI - Surface Component
 * 
 * Base surface container with elevation and theming
 */

import React, { ReactNode } from 'react';
import { View, ViewProps, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ElevationLevel } from '../../tokens/elevation';

export interface SurfaceProps extends ViewProps {
  // Elevation level (0-5)
  elevation?: ElevationLevel;
  
  // Background color (defaults to surface)
  background?: 'surface' | 'surfaceVariant' | 'surfaceContainer' | 'surfaceContainerLow' | 'surfaceContainerHigh' | 'surfaceContainerHighest' | string;
  
  // Border radius preset
  radius?: 'none' | 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | 'full' | number;
  
  // Padding preset
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Style override
  style?: StyleProp<ViewStyle>;
  
  // Children
  children?: ReactNode;
}

/**
 * Surface Component
 */
export function Surface({
  elevation = 0,
  background = 'surface',
  radius = 'none',
  padding = 'none',
  style,
  children,
  ...viewProps
}: SurfaceProps): React.ReactElement {
  const theme = useTheme();
  
  // Get background color
  const getBackgroundColor = (): string => {
    if (background.startsWith('#') || background.startsWith('rgb')) {
      return background;
    }
    
    switch (background) {
      case 'surface':
        return theme.colors.surface;
      case 'surfaceVariant':
        return theme.colors.surfaceVariant;
      case 'surfaceContainer':
        return theme.colors.surfaceContainer;
      case 'surfaceContainerLow':
        return theme.colors.surfaceContainerLow;
      case 'surfaceContainerHigh':
        return theme.colors.surfaceContainerHigh;
      case 'surfaceContainerHighest':
        return theme.colors.surfaceContainerHighest;
      default:
        return theme.colors.surface;
    }
  };
  
  // Get border radius
  const getBorderRadius = (): number => {
    if (typeof radius === 'number') {
      return radius;
    }
    
    switch (radius) {
      case 'none':
        return 0;
      case 'extraSmall':
        return theme.shape.extraSmall;
      case 'small':
        return theme.shape.small;
      case 'medium':
        return theme.shape.medium;
      case 'large':
        return theme.shape.large;
      case 'extraLarge':
        return theme.shape.extraLarge;
      case 'full':
        return theme.shape.full;
      default:
        return 0;
    }
  };
  
  // Get padding
  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'xs':
        return theme.spacing.xs;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      case 'xl':
        return theme.spacing.xl;
      default:
        return 0;
    }
  };
  
  // Compose styles
  const composedStyle: StyleProp<ViewStyle> = [
    {
      backgroundColor: getBackgroundColor(),
      borderRadius: getBorderRadius(),
      padding: getPadding(),
    },
    style,
  ];

  return (
    <View {...viewProps} style={composedStyle}>
      {children}
    </View>
  );
}

export default Surface;
