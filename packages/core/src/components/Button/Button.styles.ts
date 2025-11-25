/**
 * Quartz UI - Button Styles
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { QuartzTheme } from '../../theme/types';
import { ButtonVariant, ButtonStyleConfig } from './Button.types';
import { Size } from '../../theme/types';

/**
 * MD3 Button Size Specifications
 * Standard button height: 40dp
 * Icon size: 18dp
 * Corner radius: height/2 for stadium shape
 * Horizontal padding: 24dp (no icon) or 16dp/24dp (with icon)
 */
const sizeConfig = {
  small: {
    height: 34,
    minWidth: 48, // Minimum touch target
    paddingHorizontal: 16,
    paddingWithIconStart: 12,
    paddingWithIconEnd: 16,
    fontSize: 13,
    iconSize: 16,
    iconGap: 6,
    borderRadius: 17, // height / 2
  },
  medium: {
    height: 40,
    minWidth: 48,
    paddingHorizontal: 24,
    paddingWithIconStart: 16,
    paddingWithIconEnd: 24,
    fontSize: 14,
    iconSize: 18,
    iconGap: 8,
    borderRadius: 20, // height / 2 (stadium shape)
  },
  large: {
    height: 48,
    minWidth: 56,
    paddingHorizontal: 28,
    paddingWithIconStart: 20,
    paddingWithIconEnd: 28,
    fontSize: 15,
    iconSize: 20,
    iconGap: 10,
    borderRadius: 24, // height / 2
  },
};

// Get variant-specific colors
function getVariantColors(
  variant: ButtonVariant,
  theme: QuartzTheme,
  disabled: boolean = false
) {
  const { colors } = theme;

  if (disabled) {
    // MD3: Disabled container is 12% onSurface, text/icon is 38% onSurface
    return {
      backgroundColor: variant === 'text' || variant === 'outlined' 
        ? 'transparent' 
        : colors.onSurface + '1F', // 12% opacity
      textColor: colors.onSurface + '61', // 38% opacity
      borderColor: variant === 'outlined' ? colors.onSurface + '1F' : 'transparent',
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
    default:
      return {
        backgroundColor: colors.primary,
        textColor: colors.onPrimary,
        borderColor: 'transparent',
      };
  }
}

/**
 * MD3 State Layer Opacities:
 * - Hover: 8% (0x14)
 * - Focus: 10% (0x1A)
 * - Pressed: 10% (0x1A)
 * - Dragged: 16% (0x29)
 */
function getStateLayerColor(
  variant: ButtonVariant,
  theme: QuartzTheme,
  pressed: boolean,
  hovered: boolean,
  focused: boolean = false
): string {
  const { colors } = theme;
  
  // State layer uses the content color with opacity
  let baseColor = colors.primary;
  if (variant === 'filled') {
    baseColor = colors.onPrimary;
  } else if (variant === 'tonal') {
    baseColor = colors.onSecondaryContainer;
  }

  // MD3 specifies 10% for pressed state (not 12%)
  if (pressed) {
    return baseColor + '1A'; // 10% opacity
  }
  if (focused) {
    return baseColor + '1A'; // 10% opacity
  }
  if (hovered) {
    return baseColor + '14'; // 8% opacity
  }
  return 'transparent';
}

/**
 * Create button styles following MD3 specifications
 */
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
  } = {}
): ButtonStyleConfig {
  const { 
    disabled = false, 
    pressed = false, 
    hovered = false, 
    focused = false,
    fullWidth = false, 
    hasIcon = false, 
    iconPosition = 'left' 
  } = options;
  
  const sizeStyles = sizeConfig[size];
  const variantColors = getVariantColors(variant, theme, disabled);
  const stateLayerColor = getStateLayerColor(variant, theme, pressed, hovered, focused);

  // MD3: Elevated buttons get elevation 1 at rest, 2 when hovered/focused
  const elevationLevel = variant === 'elevated' 
    ? (pressed || hovered || focused ? 2 : 1) 
    : 0;

  const container: ViewStyle = {
    height: sizeStyles.height,
    minWidth: sizeStyles.minWidth,
    borderRadius: sizeStyles.borderRadius,
    backgroundColor: variantColors.backgroundColor,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: variantColors.borderColor,
    overflow: 'hidden',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    ...(variant === 'elevated' ? theme.elevation(elevationLevel) : {}),
  };

  // MD3: Asymmetric padding when icon is present
  // Icon side gets less padding (16dp), label side gets more (24dp)
  // Using paddingStart/End for RTL support
  const getPadding = () => {
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
    gap: hasIcon ? sizeStyles.iconGap : 0,
  };

  // MD3: Use labelLarge typography for button text
  const label: TextStyle = {
    ...theme.typography.labelLarge,
    fontSize: sizeStyles.fontSize,
    fontWeight: '500', // MD3 labelLarge uses medium weight
    letterSpacing: 0.1, // MD3 labelLarge letter spacing
    color: variantColors.textColor,
    textAlign: 'center',
  };

  const icon: ViewStyle = {
    width: sizeStyles.iconSize,
    height: sizeStyles.iconSize,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const stateLayer: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: stateLayerColor,
  };

  return {
    container,
    content,
    label,
    icon,
    stateLayer,
  };
}
