/**
 * Quartz UI - Variant System
 * 
 * Type-safe variant system for consistent component styling.
 * Inspired by CVA (Class Variance Authority) for React Native.
 */

import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Style types
type Style = ViewStyle | TextStyle | ImageStyle;
type StyleValue = Style | undefined | null | false;

/**
 * Variant configuration type
 */
export interface VariantConfig<V extends Record<string, Record<string, Style>>> {
  /** Base styles applied to all variants */
  base?: Style;
  /** Variant definitions */
  variants: V;
  /** Default variant values */
  defaultVariants?: { [K in keyof V]?: keyof V[K] };
  /** Compound variants for combining multiple variants */
  compoundVariants?: Array<
    {
      [K in keyof V]?: keyof V[K];
    } & { style: Style }
  >;
}

/**
 * Extract variant props type from config
 */
export type VariantProps<T extends VariantConfig<any>> = T extends VariantConfig<infer V>
  ? { [K in keyof V]?: keyof V[K] }
  : never;

/**
 * Create a variant-based style function
 * 
 * @example
 * ```tsx
 * const buttonVariants = createVariants({
 *   base: { paddingHorizontal: 16, paddingVertical: 8 },
 *   variants: {
 *     variant: {
 *       filled: { backgroundColor: '#6750A4' },
 *       outlined: { borderWidth: 1, borderColor: '#6750A4' },
 *       text: { backgroundColor: 'transparent' },
 *     },
 *     size: {
 *       small: { paddingHorizontal: 12, paddingVertical: 6 },
 *       medium: { paddingHorizontal: 16, paddingVertical: 8 },
 *       large: { paddingHorizontal: 24, paddingVertical: 12 },
 *     },
 *   },
 *   defaultVariants: {
 *     variant: 'filled',
 *     size: 'medium',
 *   },
 *   compoundVariants: [
 *     { variant: 'outlined', size: 'large', style: { borderWidth: 2 } },
 *   ],
 * });
 * 
 * // Usage
 * const styles = buttonVariants({ variant: 'filled', size: 'large' });
 * ```
 */
export function createVariants<V extends Record<string, Record<string, Style>>>(
  config: VariantConfig<V>
): (props?: VariantProps<VariantConfig<V>>) => Style {
  return (props = {}) => {
    const styles: StyleValue[] = [];

    // Add base styles
    if (config.base) {
      styles.push(config.base);
    }

    // Get variant values (with defaults)
    const variantValues: Record<string, string | undefined> = {};

    for (const variantKey of Object.keys(config.variants)) {
      const propValue = props[variantKey as keyof typeof props];
      const defaultValue = config.defaultVariants?.[variantKey as keyof V];
      variantValues[variantKey] = (propValue ?? defaultValue) as string | undefined;
    }

    // Add variant styles
    for (const [variantKey, variantValue] of Object.entries(variantValues)) {
      if (variantValue && config.variants[variantKey]?.[variantValue]) {
        styles.push(config.variants[variantKey][variantValue]);
      }
    }

    // Add compound variant styles
    if (config.compoundVariants) {
      for (const compound of config.compoundVariants) {
        const { style, ...conditions } = compound;

        const matches = Object.entries(conditions).every(([key, value]) => {
          return variantValues[key] === value;
        });

        if (matches) {
          styles.push(style);
        }
      }
    }

    // Merge all styles
    return StyleSheet.flatten(styles.filter(Boolean) as Style[]);
  };
}

/**
 * Utility to create responsive variants
 * Useful for breakpoint-based styling
 */
export function createResponsiveVariants<T extends Record<string, Style>>(
  variants: T
): { [K in keyof T]: Style } {
  return variants;
}

/**
 * Merge multiple style objects with proper typing
 */
export function mergeStyles(...styles: StyleValue[]): Style {
  return StyleSheet.flatten(styles.filter(Boolean) as Style[]);
}
