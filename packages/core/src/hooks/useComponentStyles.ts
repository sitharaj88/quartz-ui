/**
 * Quartz UI - useComponentStyles Hook
 * 
 * Centralized style computation hook for consistent component styling.
 */

import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { QuartzTheme } from '../theme/types';

// Style types
type Style = ViewStyle | TextStyle | ImageStyle;
type StyleValue = Style | undefined | null | false;

/**
 * Component state for style computation
 */
export interface ComponentState {
    /** Whether the component is pressed */
    pressed?: boolean;
    /** Whether the component is hovered (web) */
    hovered?: boolean;
    /** Whether the component is focused */
    focused?: boolean;
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Whether the component is loading */
    loading?: boolean;
    /** Whether the component is selected/checked */
    selected?: boolean;
    /** Whether the component is in an error state */
    error?: boolean;
}

/**
 * Style factory function type
 */
type StyleFactory<P> = (theme: QuartzTheme, props: P, state: ComponentState) => Style;

/**
 * Multiple style factories
 */
type StyleFactories<P, K extends string> = Record<K, StyleFactory<P>>;

/**
 * Hook for computing component styles with theme and state awareness
 * 
 * @example
 * ```tsx
 * function MyButton({ variant = 'filled', disabled = false }: Props) {
 *   const [pressed, setPressed] = useState(false);
 *   
 *   const styles = useComponentStyles(
 *     { variant, disabled },
 *     { pressed, disabled },
 *     (theme, props, state) => ({
 *       container: {
 *         backgroundColor: state.pressed 
 *           ? theme.colors.primaryContainer 
 *           : theme.colors.primary,
 *         opacity: state.disabled ? 0.38 : 1,
 *       },
 *     })
 *   );
 *   
 *   return <View style={styles.container} />;
 * }
 * ```
 */
export function useComponentStyles<P extends Record<string, any>, K extends string>(
    props: P,
    state: ComponentState,
    styleFactory: (theme: QuartzTheme, props: P, state: ComponentState) => Record<K, Style>
): Record<K, Style> {
    const theme = useTheme();

    return useMemo(() => {
        return styleFactory(theme, props, state);
    }, [theme, props, state, styleFactory]);
}

/**
 * Hook for computing a single style value
 */
export function useStyle<P extends Record<string, any>>(
    props: P,
    state: ComponentState,
    styleFactory: StyleFactory<P>
): Style {
    const theme = useTheme();

    return useMemo(() => {
        return styleFactory(theme, props, state);
    }, [theme, props, state, styleFactory]);
}

/**
 * Hook for computing styles with caching key
 */
export function useCachedStyles<P extends Record<string, any>, K extends string>(
    cacheKey: string,
    props: P,
    state: ComponentState,
    styleFactory: (theme: QuartzTheme, props: P, state: ComponentState) => Record<K, Style>
): Record<K, Style> {
    const theme = useTheme();

    return useMemo(() => {
        return styleFactory(theme, props, state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cacheKey, theme]);
}

/**
 * Create a style hook factory for a specific component
 * 
 * @example
 * ```tsx
 * const useButtonStyles = createStyleHook<ButtonProps>()({
 *   container: (theme, props, state) => ({
 *     backgroundColor: props.variant === 'filled' ? theme.colors.primary : 'transparent',
 *     opacity: state.disabled ? 0.38 : 1,
 *   }),
 *   label: (theme, props) => ({
 *     color: props.variant === 'filled' ? theme.colors.onPrimary : theme.colors.primary,
 *   }),
 * });
 * ```
 */
export function createStyleHook<P extends Record<string, any>>() {
    return <K extends string>(factories: StyleFactories<P, K>) => {
        return (props: P, state: ComponentState = {}): Record<K, Style> => {
            const theme = useTheme();

            return useMemo(() => {
                const result = {} as Record<K, Style>;
                for (const key of Object.keys(factories) as K[]) {
                    result[key] = factories[key](theme, props, state);
                }
                return result;
            }, [theme, props, state]);
        };
    };
}

/**
 * Merge styles with proper handling of undefined values
 */
export function mergeComponentStyles(...styles: StyleValue[]): Style {
    return StyleSheet.flatten(styles.filter(Boolean) as Style[]);
}

/**
 * Get state layer opacity based on component state
 */
export function getStateLayerOpacity(state: ComponentState): number {
    if (state.disabled) return 0;
    if (state.pressed) return 0.12;
    if (state.focused) return 0.12;
    if (state.hovered) return 0.08;
    return 0;
}

/**
 * Get state layer style for a component
 */
export function useStateLayer(
    color: string,
    state: ComponentState
): ViewStyle {
    const opacity = getStateLayerOpacity(state);

    return useMemo(() => ({
        ...StyleSheet.absoluteFillObject,
        backgroundColor: color,
        opacity,
    }), [color, opacity]);
}
