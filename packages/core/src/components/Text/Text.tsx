/**
 * Quartz UI - Typography Text Component
 * 
 * Typography with all type scales
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { TypeScale } from '../../tokens/typography';

// Type scale variants
export type TextVariant = keyof TypeScale;

export interface TextProps extends RNTextProps {
  // Typography variant from type scale
  variant?: TextVariant;
  
  // Color (defaults to onSurface)
  color?: string;
  
  // Custom font weight override
  weight?: TextStyle['fontWeight'];
  
  // Text alignment with RTL support
  align?: 'left' | 'center' | 'right' | 'auto';
  
  // Custom line height
  lineHeight?: number;
  
  // Italic style
  italic?: boolean;
  
  // Uppercase transform
  uppercase?: boolean;
  
  // Style override
  style?: StyleProp<TextStyle>;
  
  // Children
  children?: React.ReactNode;
}

/**
 * Text Component with Typography
 */
export function Text({
  variant = 'bodyMedium',
  color,
  weight,
  align = 'auto',
  lineHeight,
  italic = false,
  uppercase = false,
  style,
  children,
  ...textProps
}: TextProps): React.ReactElement {
  const theme = useTheme();
  
  // Get typography style for the variant
  const typographyStyle = theme.typography[variant];
  
  // Compose final style
  const composedStyle: StyleProp<TextStyle> = [
    {
      fontFamily: typographyStyle.fontFamily,
      fontSize: typographyStyle.fontSize,
      fontWeight: weight ?? typographyStyle.fontWeight,
      lineHeight: lineHeight ?? typographyStyle.lineHeight,
      letterSpacing: typographyStyle.letterSpacing,
      color: color ?? theme.colors.onSurface,
      textAlign: align,
      fontStyle: italic ? 'italic' : 'normal',
      textTransform: uppercase ? 'uppercase' : 'none',
      writingDirection: theme.direction === 'rtl' ? 'rtl' : 'ltr',
    },
    style,
  ];

  return (
    <RNText
      {...textProps}
      style={composedStyle}
      accessible={true}
      accessibilityRole="text"
    >
      {children}
    </RNText>
  );
}

// Convenience components for common variants
export function DisplayLarge(props: Omit<TextProps, 'variant'>) {
  return <Text variant="displayLarge" {...props} />;
}

export function DisplayMedium(props: Omit<TextProps, 'variant'>) {
  return <Text variant="displayMedium" {...props} />;
}

export function DisplaySmall(props: Omit<TextProps, 'variant'>) {
  return <Text variant="displaySmall" {...props} />;
}

export function HeadlineLarge(props: Omit<TextProps, 'variant'>) {
  return <Text variant="headlineLarge" {...props} />;
}

export function HeadlineMedium(props: Omit<TextProps, 'variant'>) {
  return <Text variant="headlineMedium" {...props} />;
}

export function HeadlineSmall(props: Omit<TextProps, 'variant'>) {
  return <Text variant="headlineSmall" {...props} />;
}

export function TitleLarge(props: Omit<TextProps, 'variant'>) {
  return <Text variant="titleLarge" {...props} />;
}

export function TitleMedium(props: Omit<TextProps, 'variant'>) {
  return <Text variant="titleMedium" {...props} />;
}

export function TitleSmall(props: Omit<TextProps, 'variant'>) {
  return <Text variant="titleSmall" {...props} />;
}

export function BodyLarge(props: Omit<TextProps, 'variant'>) {
  return <Text variant="bodyLarge" {...props} />;
}

export function BodyMedium(props: Omit<TextProps, 'variant'>) {
  return <Text variant="bodyMedium" {...props} />;
}

export function BodySmall(props: Omit<TextProps, 'variant'>) {
  return <Text variant="bodySmall" {...props} />;
}

export function LabelLarge(props: Omit<TextProps, 'variant'>) {
  return <Text variant="labelLarge" {...props} />;
}

export function LabelMedium(props: Omit<TextProps, 'variant'>) {
  return <Text variant="labelMedium" {...props} />;
}

export function LabelSmall(props: Omit<TextProps, 'variant'>) {
  return <Text variant="labelSmall" {...props} />;
}

export default Text;
