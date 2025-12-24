/**
 * Quartz UI - Gradient Component Types
 */

import { ViewStyle } from 'react-native';

export type GradientDirection =
    | 'horizontal'
    | 'vertical'
    | 'diagonal'
    | 'diagonalReverse';

export type GradientPreset =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'error'
    | 'sunset'
    | 'ocean'
    | 'forest'
    | 'purple'
    | 'pink'
    | 'dark';

export interface GradientProps {
    /** Gradient colors array */
    colors?: string[];
    /** Preset gradient */
    preset?: GradientPreset;
    /** Gradient direction */
    direction?: GradientDirection;
    /** Color stops (0-1) */
    locations?: number[];
    /** Start point (x, y) from 0-1 */
    start?: { x: number; y: number };
    /** End point (x, y) from 0-1 */
    end?: { x: number; y: number };
    /** Custom style */
    style?: ViewStyle;
    /** Children */
    children?: React.ReactNode;
    /** Test ID */
    testID?: string;
}

export interface GradientTextProps {
    /** Text to display */
    children: string;
    /** Gradient colors */
    colors?: string[];
    /** Preset gradient */
    preset?: GradientPreset;
    /** Font size */
    fontSize?: number;
    /** Font weight */
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    /** Custom style */
    style?: ViewStyle;
    /** Test ID */
    testID?: string;
}

// Direction to start/end point mapping
export const directionMap: Record<GradientDirection, { start: { x: number; y: number }; end: { x: number; y: number } }> = {
    horizontal: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
    vertical: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    diagonalReverse: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
};

// Gradient presets
export const gradientPresets: Record<GradientPreset, string[]> = {
    primary: ['#6750A4', '#9A82DB'],
    secondary: ['#625B71', '#958DA5'],
    tertiary: ['#7D5260', '#B58392'],
    success: ['#1B5E20', '#4CAF50'],
    warning: ['#E65100', '#FF9800'],
    error: ['#B71C1C', '#F44336'],
    sunset: ['#FF512F', '#F09819'],
    ocean: ['#2193b0', '#6dd5ed'],
    forest: ['#134E5E', '#71B280'],
    purple: ['#667eea', '#764ba2'],
    pink: ['#f093fb', '#f5576c'],
    dark: ['#232526', '#414345'],
};
