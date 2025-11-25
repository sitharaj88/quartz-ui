/**
 * Quartz UI - RTL Utilities
 * 
 * Right-to-left language support helpers
 */

import { I18nManager, Platform } from 'react-native';

/**
 * Check if current layout is RTL
 */
export function isRTL(): boolean {
  return I18nManager.isRTL;
}

/**
 * Get the direction-aware start property
 */
export function getStartProperty(): 'left' | 'right' {
  return I18nManager.isRTL ? 'right' : 'left';
}

/**
 * Get the direction-aware end property
 */
export function getEndProperty(): 'left' | 'right' {
  return I18nManager.isRTL ? 'left' : 'right';
}

/**
 * Flip a horizontal value for RTL
 */
export function flipForRTL(value: number): number {
  return I18nManager.isRTL ? -value : value;
}

/**
 * Get direction-aware flex start/end
 */
export function getFlexStart(): 'flex-start' | 'flex-end' {
  return I18nManager.isRTL ? 'flex-end' : 'flex-start';
}

export function getFlexEnd(): 'flex-start' | 'flex-end' {
  return I18nManager.isRTL ? 'flex-start' : 'flex-end';
}

/**
 * Get direction-aware text align
 */
export function getTextAlign(): 'left' | 'right' {
  return I18nManager.isRTL ? 'right' : 'left';
}

/**
 * Create direction-aware style object
 */
export function createDirectionalStyle<T extends Record<string, unknown>>(
  ltrStyle: T,
  rtlStyle: T
): T {
  return I18nManager.isRTL ? rtlStyle : ltrStyle;
}

/**
 * Swap left/right values in a style object for RTL
 */
export function swapLeftRight<T extends Record<string, unknown>>(style: T): T {
  const swapped: Record<string, unknown> = { ...style };
  
  // Swap margin
  if ('marginLeft' in style || 'marginRight' in style) {
    swapped.marginLeft = style.marginRight;
    swapped.marginRight = style.marginLeft;
  }
  
  // Swap padding
  if ('paddingLeft' in style || 'paddingRight' in style) {
    swapped.paddingLeft = style.paddingRight;
    swapped.paddingRight = style.paddingLeft;
  }
  
  // Swap position
  if ('left' in style || 'right' in style) {
    swapped.left = style.right;
    swapped.right = style.left;
  }
  
  // Swap border radius
  if ('borderTopLeftRadius' in style || 'borderTopRightRadius' in style) {
    swapped.borderTopLeftRadius = style.borderTopRightRadius;
    swapped.borderTopRightRadius = style.borderTopLeftRadius;
  }
  
  if ('borderBottomLeftRadius' in style || 'borderBottomRightRadius' in style) {
    swapped.borderBottomLeftRadius = style.borderBottomRightRadius;
    swapped.borderBottomRightRadius = style.borderBottomLeftRadius;
  }
  
  return swapped as T;
}

/**
 * Configure RTL for the app
 */
export function configureRTL(options: {
  allowRTL?: boolean;
  forceRTL?: boolean;
}): void {
  if (options.allowRTL !== undefined) {
    I18nManager.allowRTL(options.allowRTL);
  }
  
  if (options.forceRTL !== undefined) {
    I18nManager.forceRTL(options.forceRTL);
    
    // Note: Changes require app restart on native
    if (Platform.OS !== 'web') {
      console.warn('RTL changes require app restart on native platforms');
    }
  }
}

/**
 * Writing direction type
 */
export type WritingDirection = 'ltr' | 'rtl' | 'auto';

/**
 * Get writing direction style
 */
export function getWritingDirection(direction: WritingDirection = 'auto'): { writingDirection: WritingDirection } {
  return { writingDirection: direction };
}
