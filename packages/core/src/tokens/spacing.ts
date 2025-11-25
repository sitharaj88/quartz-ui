/**
 * Quartz UI - Spacing & Layout Tokens
 * 
 * Consistent spacing scale for padding, margins, and gaps
 */

// Base spacing unit (4px)
const BASE_UNIT = 4;

// Spacing scale following 4px grid system
export const spacing = {
  none: 0,
  xs: BASE_UNIT,        // 4
  sm: BASE_UNIT * 2,    // 8
  md: BASE_UNIT * 4,    // 16
  lg: BASE_UNIT * 6,    // 24
  xl: BASE_UNIT * 8,    // 32
  '2xl': BASE_UNIT * 10, // 40
  '3xl': BASE_UNIT * 12, // 48
  '4xl': BASE_UNIT * 16, // 64
} as const;

export type SpacingToken = keyof typeof spacing;

// Component-specific spacing
export const componentSpacing = {
  // Button internal padding
  buttonPaddingHorizontal: spacing.lg,
  buttonPaddingVertical: spacing.sm + 2, // 10
  
  // Card padding
  cardPadding: spacing.md,
  cardGap: spacing.md,
  
  // List item padding
  listItemPaddingHorizontal: spacing.md,
  listItemPaddingVertical: spacing.sm,
  
  // Input field padding
  inputPaddingHorizontal: spacing.md,
  inputPaddingVertical: spacing.sm,
  
  // Dialog padding
  dialogPadding: spacing.lg,
  
  // Navigation bar height
  navBarHeight: 64,
  navBarHeightCompact: 56,
  
  // Tab bar height
  tabBarHeight: 80,
  
  // Bottom sheet
  bottomSheetHandleHeight: 4,
  bottomSheetHandleWidth: 32,
  
  // FAB
  fabSize: 56,
  fabSizeLarge: 96,
  fabSizeSmall: 40,
} as const;

// Border radius tokens
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  full: 9999,
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;

// Shape tokens (shape system)
export const shape = {
  // Extra small shape (buttons, chips)
  extraSmall: borderRadius.xs,
  extraSmallTop: {
    topLeft: borderRadius.xs,
    topRight: borderRadius.xs,
    bottomLeft: 0,
    bottomRight: 0,
  },
  
  // Small shape (cards, dialogs)
  small: borderRadius.sm,
  
  // Medium shape (FABs, navigation drawer)
  medium: borderRadius.md,
  
  // Large shape (cards, sheets)
  large: borderRadius.lg,
  largeEnd: {
    topLeft: 0,
    topRight: borderRadius.lg,
    bottomLeft: 0,
    bottomRight: borderRadius.lg,
  },
  largeTop: {
    topLeft: borderRadius.lg,
    topRight: borderRadius.lg,
    bottomLeft: 0,
    bottomRight: 0,
  },
  
  // Extra large shape (large cards, sheets)
  extraLarge: borderRadius.xl,
  extraLargeTop: {
    topLeft: borderRadius.xl,
    topRight: borderRadius.xl,
    bottomLeft: 0,
    bottomRight: 0,
  },
  
  // Full (circular shapes)
  full: borderRadius.full,
} as const;

// Z-index elevation layers
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
} as const;

// Safe area insets (will be overridden by SafeAreaContext)
export const defaultSafeAreaInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} as const;
