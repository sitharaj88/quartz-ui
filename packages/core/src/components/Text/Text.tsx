/**
 * Quartz UI - Typography
 *
 * Theme-driven Text component covering the Material 3 type scale (display,
 * headline, title, body, label — each in large/medium/small). Convenience
 * components are provided for every variant.
 *
 * forwardRef forwards to the underlying RN Text so consumers can call
 * `measureInWindow`, etc.
 */

import React, { forwardRef, memo } from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
} from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { TypeScale } from '../../tokens/typography';

export type TextVariant = keyof TypeScale;

export interface TextProps extends RNTextProps {
  /** Type-scale variant (defaults to `bodyMedium`). */
  variant?: TextVariant;
  /** Override color. Defaults to theme.colors.onSurface. */
  color?: string;
  /** Override font weight. */
  weight?: TextStyle['fontWeight'];
  /** Text alignment. RN respects `auto` for RTL flipping. */
  align?: TextStyle['textAlign'];
  /** Override line height. */
  lineHeight?: number;
  italic?: boolean;
  uppercase?: boolean;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

const TextImpl = forwardRef<RNText, TextProps>(function Text(
  {
    variant = 'bodyMedium',
    color,
    weight,
    align = 'auto',
    lineHeight,
    italic = false,
    uppercase = false,
    style,
    children,
    ...rest
  },
  ref
) {
  const theme = useTheme();
  const tStyle = theme.typography[variant];

  const composedStyle: StyleProp<TextStyle> = [
    {
      fontFamily: tStyle.fontFamily,
      fontSize: tStyle.fontSize,
      fontWeight: weight ?? tStyle.fontWeight,
      lineHeight: lineHeight ?? tStyle.lineHeight,
      letterSpacing: tStyle.letterSpacing,
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
      ref={ref}
      accessible
      accessibilityRole="text"
      {...rest}
      style={composedStyle}
    >
      {children}
    </RNText>
  );
});

TextImpl.displayName = 'Text';

export const Text = memo(TextImpl);

// ─── Convenience components for every type-scale variant ────────────────
const variantComponent = (v: TextVariant, displayName: string) => {
  const C = memo(function Variant(props: Omit<TextProps, 'variant'>) {
    return <Text variant={v} {...props} />;
  });
  C.displayName = displayName;
  return C;
};

export const DisplayLarge = variantComponent('displayLarge', 'DisplayLarge');
export const DisplayMedium = variantComponent('displayMedium', 'DisplayMedium');
export const DisplaySmall = variantComponent('displaySmall', 'DisplaySmall');
export const HeadlineLarge = variantComponent('headlineLarge', 'HeadlineLarge');
export const HeadlineMedium = variantComponent('headlineMedium', 'HeadlineMedium');
export const HeadlineSmall = variantComponent('headlineSmall', 'HeadlineSmall');
export const TitleLarge = variantComponent('titleLarge', 'TitleLarge');
export const TitleMedium = variantComponent('titleMedium', 'TitleMedium');
export const TitleSmall = variantComponent('titleSmall', 'TitleSmall');
export const BodyLarge = variantComponent('bodyLarge', 'BodyLarge');
export const BodyMedium = variantComponent('bodyMedium', 'BodyMedium');
export const BodySmall = variantComponent('bodySmall', 'BodySmall');
export const LabelLarge = variantComponent('labelLarge', 'LabelLarge');
export const LabelMedium = variantComponent('labelMedium', 'LabelMedium');
export const LabelSmall = variantComponent('labelSmall', 'LabelSmall');

export default Text;
