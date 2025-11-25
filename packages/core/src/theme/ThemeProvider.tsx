/**
 * Quartz UI - Theme Provider
 * 
 * React context provider for theming with support for:
 * - Light/Dark mode
 * - System color scheme detection
 * - RTL support
 * - Dynamic theme switching
 */

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useMemo, 
  useCallback,
  ReactNode,
} from 'react';
import { useColorScheme, I18nManager, Platform } from 'react-native';
import { QuartzTheme, ThemeContextValue, ThemeMode, TextDirection } from './types';
import { createTheme, lightTheme, darkTheme } from './createTheme';

// Create the theme context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Props for the ThemeProvider
export interface ThemeProviderProps {
  children: ReactNode;
  
  // Initial theme mode
  initialMode?: ThemeMode;
  
  // Custom light theme
  lightTheme?: QuartzTheme;
  
  // Custom dark theme
  darkTheme?: QuartzTheme;
  
  // Initial direction
  initialDirection?: TextDirection;
  
  // Callback when theme changes
  onThemeChange?: (theme: QuartzTheme) => void;
}

/**
 * Theme Provider Component
 * 
 * Wraps your app to provide theming context
 */
export function QuartzProvider({
  children,
  initialMode = 'system',
  lightTheme: customLightTheme,
  darkTheme: customDarkTheme,
  initialDirection = 'ltr',
  onThemeChange,
}: ThemeProviderProps): React.ReactElement {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // Theme mode state
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  
  // Direction state
  const [direction, setDirection] = useState<TextDirection>(initialDirection);
  
  // Determine if we should use dark mode
  const isDarkMode = useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark';
    }
    return mode === 'dark';
  }, [mode, systemColorScheme]);
  
  // Get the current theme
  const theme = useMemo((): QuartzTheme => {
    const baseTheme = isDarkMode 
      ? (customDarkTheme ?? darkTheme)
      : (customLightTheme ?? lightTheme);
    
    // Update direction in theme
    return {
      ...baseTheme,
      direction,
    };
  }, [isDarkMode, customLightTheme, customDarkTheme, direction]);
  
  // Toggle between light and dark mode
  const toggleMode = useCallback(() => {
    setMode((currentMode) => {
      if (currentMode === 'light') return 'dark';
      if (currentMode === 'dark') return 'light';
      // If system, switch to opposite of current system preference
      return systemColorScheme === 'dark' ? 'light' : 'dark';
    });
  }, [systemColorScheme]);
  
  // Handle direction changes
  const handleSetDirection = useCallback((newDirection: TextDirection) => {
    setDirection(newDirection);
    
    // Update I18nManager for RTL support
    const isRTL = newDirection === 'rtl';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      
      // Note: On some platforms, RTL changes require app restart
      if (Platform.OS !== 'web') {
        console.warn(
          'Quartz UI: RTL direction changed. A restart may be required for full effect.'
        );
      }
    }
  }, []);
  
  // Notify on theme change
  useEffect(() => {
    onThemeChange?.(theme);
  }, [theme, onThemeChange]);
  
  // Context value
  const contextValue = useMemo((): ThemeContextValue => ({
    theme,
    mode,
    setMode,
    toggleMode,
    direction,
    setDirection: handleSetDirection,
    isRTL: direction === 'rtl',
  }), [theme, mode, toggleMode, direction, handleSetDirection]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the theme context
 */
export function useQuartzTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useQuartzTheme must be used within a QuartzProvider');
  }
  
  return context;
}

/**
 * Hook to access just the theme object
 */
export function useTheme(): QuartzTheme {
  const { theme } = useQuartzTheme();
  return theme;
}

/**
 * Hook to access theme colors
 */
export function useColors() {
  const { theme } = useQuartzTheme();
  return theme.colors;
}

/**
 * Hook to access typography styles
 */
export function useTypography() {
  const { theme } = useQuartzTheme();
  return theme.typography;
}

/**
 * Hook to access spacing values
 */
export function useSpacing() {
  const { theme } = useQuartzTheme();
  return theme.spacing;
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDarkMode(): boolean {
  const { mode, theme } = useQuartzTheme();
  const systemColorScheme = useColorScheme();
  
  if (mode === 'system') {
    return systemColorScheme === 'dark';
  }
  return mode === 'dark';
}

/**
 * Hook to check RTL status
 */
export function useIsRTL(): boolean {
  const { isRTL } = useQuartzTheme();
  return isRTL;
}

// Export context for advanced usage
export { ThemeContext };
