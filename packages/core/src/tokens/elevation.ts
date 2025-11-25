/**
 * Quartz UI - Elevation Tokens
 * 
 * Shadow and elevation system
 */

import { Platform, ViewStyle } from 'react-native';

export interface ElevationStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android elevation
}

// Elevation levels
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

// Shadow color for elevation
const shadowColor = '#000000';

// Elevation definitions
export const elevation: Record<ElevationLevel, ElevationStyle> = {
  0: {
    shadowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  1: {
    shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  2: {
    shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  3: {
    shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  4: {
    shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  5: {
    shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
};

// Get platform-specific elevation styles
export function getElevationStyle(level: ElevationLevel): ViewStyle {
  const elevationStyles = elevation[level];
  
  if (Platform.OS === 'android') {
    return {
      elevation: elevationStyles.elevation,
    };
  }
  
  return {
    shadowColor: elevationStyles.shadowColor,
    shadowOffset: elevationStyles.shadowOffset,
    shadowOpacity: elevationStyles.shadowOpacity,
    shadowRadius: elevationStyles.shadowRadius,
  };
}

// Surface tint opacity based on elevation
// Elevated surfaces have a tint color overlay
export const surfaceTintOpacity: Record<ElevationLevel, number> = {
  0: 0,
  1: 0.05,
  2: 0.08,
  3: 0.11,
  4: 0.12,
  5: 0.14,
};

// Get surface tint color with opacity
export function getSurfaceTint(primaryColor: string, level: ElevationLevel): string {
  const opacity = surfaceTintOpacity[level];
  // Parse hex color and apply opacity
  const hex = primaryColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
