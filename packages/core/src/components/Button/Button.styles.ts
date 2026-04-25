/**
 * Quartz UI - Button Styles
 *
 * Material 3 button styling. State layer opacities and color math go through
 * `withAlpha` so non-hex inputs (rgb / rgba / named colors / theme overrides)
 * are handled correctly.
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { QuartzTheme, Size } from '../../theme/types';
import { withAlpha, pickForeground } from '../../utils/color';
import { ButtonVariant, ButtonStyleConfig } from './Button.types';

/**
 * MD3 sizing. Heights are content heights — the touch target hit-slop is added
 * separately so visual density and a11y are decoupled.
 */
const sizeConfig = {
  small: {
    height: 34,
    minWidth: 48,
    paddingHorizontal: 16,
    paddingWithIconStart: 12,
    paddingWithIconEnd: 16,
    paddingIconOnly: 8,
    fontSize: 13,
    iconSize: 16,
    iconGap: 6,
    borderRadius: 17,
  },
  medium: {
    height: 40,
    minWidth: 48,
    paddingHorizontal: 24,
    paddingWithIconStart: 16,
    paddingWithIconEnd: 24,
    paddingIconOnly: 10,
    fontSize: 14,
    iconSize: 18,
    iconGap: 8,
    borderRadius: 20,
  },
  large: {
    height: 48,
    minWidth: 56,
    paddingHorizontal: 28,
    paddingWithIconStart: 20,
    paddingWithIconEnd: 28,
    paddingIconOnly: 14,
    fontSize: 15,
    iconSize: 20,
    iconGap: 10,
    borderRadius: 24,
  },
} as const;

/**
 * Variant colors. When `containerOverride` is provided, the foreground is
 * auto-picked for AA contrast (unless the consumer also passes `textColor`).
 */
function getVariantColors(
  variant: ButtonVariant,
  theme: QuartzTheme,
  disabled: boolean,
  containerOverride?: string
) {
  const { colors } = theme;

  if (disabled) {
    return {
      backgroundColor:
        variant === 'text' || variant === 'outlined'
          ? 'transparent'
          : withAlpha(colors.onSurface, 0.12),
      textColor: withAlpha(colors.onSurface, 0.38),
      borderColor: variant === 'outlined' ? withAlpha(colors.onSurface, 0.12) : 'transparent',
    };
  }

  if (containerOverride) {
    return {
      backgroundColor: containerOverride,
      textColor: pickForeground(containerOverride, '#FFFFFF', '#000000'),
      borderColor: 'transparent',
    };
  }

  switch (variant) {
    case 'filled':
      return {
        backgroundColor: colors.primary,
        textColor: colors.onPrimary,
        borderColor: 'transparent',
      };
    case 'outlined':
      return {
        backgroundColor: 'transparent',
        textColor: colors.primary,
        borderColor: colors.outline,
      };
    case 'text':
      return {
        backgroundColor: 'transparent',
        textColor: colors.primary,
        borderColor: 'transparent',
      };
    case 'elevated':
      return {
        backgroundColor: colors.surfaceContainerLow,
        textColor: colors.primary,
        borderColor: 'transparent',
      };
    case 'tonal':
      return {
        backgroundColor: colors.secondaryContainer,
        textColor: colors.onSecondaryContainer,
        borderColor: 'transparent',
      };
  }
}

/**
 * MD3 state layer opacities:
 *   hover 8% · focus 10% · pressed 10% · dragged 16%
 * Returned as `{ color, opacity }` so the consumer can drive opacity with a
 * shared value while keeping the color stable (avoids mid-animation re-renders).
 */
function getStateLayer(
  variant: ButtonVariant,
  theme: QuartzTheme,
  pressed: boolean,
  hovered: boolean,
  focused: boolean,
  containerOverride?: string,
  textColorOverride?: string
): { color: string; opacity: number } {
  const { colors } = theme;
  let color: string = colors.primary;
  if (variant === 'filled') color = colors.onPrimary;
  else if (variant === 'tonal') color = colors.onSecondaryContainer;

  if (textColorOverride) color = textColorOverride;
  else if (containerOverride) color = pickForeground(containerOverride, '#FFFFFF', '#000000');

  let opacity = 0;
  if (pressed) opacity = 0.1;
  else if (focused) opacity = 0.1;
  else if (hovered) opacity = 0.08;

  return { color, opacity };
}

/** Style payload for the button. `stateLayer.opacity` is overwritten at runtime by the animated value. */
export function createButtonStyles(
  variant: ButtonVariant,
  size: Size,
  theme: QuartzTheme,
  options: {
    disabled?: boolean;
    pressed?: boolean;
    hovered?: boolean;
    focused?: boolean;
    fullWidth?: boolean;
    hasIcon?: boolean;
    iconPosition?: 'left' | 'right';
    iconOnly?: boolean;
    containerOverride?: string;
    textColorOverride?: string;
  } = {}
): ButtonStyleConfig & { stateLayerColor: string; stateLayerOpacity: number } {
  const {
    disabled = false,
    pressed = false,
    hovered = false,
    focused = false,
    fullWidth = false,
    hasIcon = false,
    iconPosition = 'left',
    iconOnly = false,
    containerOverride,
    textColorOverride,
  } = options;

  const sizeStyles = sizeConfig[size];
  const variantColors = getVariantColors(variant, theme, disabled, containerOverride);
  const stateLayer = getStateLayer(
    variant,
    theme,
    pressed,
    hovered,
    focused,
    containerOverride,
    textColorOverride
  );

  // Elevated buttons: rest = 1, hover/focus/press = 2 (MD3).
  const elevationLevel: 0 | 1 | 2 =
    variant === 'elevated' ? (pressed || hovered || focused ? 2 : 1) : 0;

  const container: ViewStyle = {
    height: iconOnly ? sizeStyles.height : sizeStyles.height,
    minWidth: iconOnly ? sizeStyles.height : sizeStyles.minWidth,
    width: iconOnly ? sizeStyles.height : undefined,
    borderRadius: iconOnly ? sizeStyles.height / 2 : sizeStyles.borderRadius,
    backgroundColor: variantColors.backgroundColor,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: variantColors.borderColor,
    overflow: 'hidden',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    ...(variant === 'elevated' ? theme.elevation(elevationLevel) : {}),
  };

  const getPadding = (): ViewStyle => {
    if (iconOnly) {
      return { paddingHorizontal: sizeStyles.paddingIconOnly };
    }
    if (!hasIcon) {
      return { paddingHorizontal: sizeStyles.paddingHorizontal };
    }
    if (iconPosition === 'left') {
      return {
        paddingStart: sizeStyles.paddingWithIconStart,
        paddingEnd: sizeStyles.paddingWithIconEnd,
      };
    }
    return {
      paddingStart: sizeStyles.paddingWithIconEnd,
      paddingEnd: sizeStyles.paddingWithIconStart,
    };
  };

  const content: ViewStyle = {
    flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...getPadding(),
    height: '100%',
    gap: hasIcon && !iconOnly ? sizeStyles.iconGap : 0,
  };

  const label: TextStyle = {
    ...theme.typography.labelLarge,
    fontSize: sizeStyles.fontSize,
    fontWeight: '500',
    letterSpacing: 0.1,
    color: textColorOverride ?? variantColors.textColor,
    textAlign: 'center',
  };

  const icon: ViewStyle = {
    width: sizeStyles.iconSize,
    height: sizeStyles.iconSize,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const stateLayerStyle: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: stateLayer.color,
    opacity: stateLayer.opacity,
  };

  // Focus ring: 2dp outline at 3dp offset, in primary. Only rendered when
  // focus arrived via keyboard (`focus-visible`).
  const focusRing: ViewStyle = {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: (iconOnly ? sizeStyles.height / 2 : sizeStyles.borderRadius) + 3,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  };

  return {
    container,
    content,
    label,
    icon,
    stateLayer: stateLayerStyle,
    focusRing,
    stateLayerColor: stateLayer.color,
    stateLayerOpacity: stateLayer.opacity,
  };
}
