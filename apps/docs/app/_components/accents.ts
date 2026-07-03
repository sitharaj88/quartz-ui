/**
 * Docs-wide accent system.
 *
 * One cohesive family of vivid hues (similar saturation / lightness) keyed by
 * documentation category. Every colored surface in the docs chrome — sidebar
 * icons, page-header washes, landing-page chips and gradients — derives from
 * this map so the site feels colorful but never clownish.
 *
 * Each accent has a `main` tone (tuned for light backgrounds) and a `light`
 * companion (gradient endpoints + text/icons on dark backgrounds). Soft
 * background tints come from `accentTint`, which layers the tone at low alpha
 * so it adapts to both site themes automatically.
 */
import { withAlpha } from 'quartz-ui';

export interface Accent {
  /** Vivid base tone — text/icons/bars on light backgrounds. */
  main: string;
  /** Lighter companion — gradient endpoints and text/icons on dark backgrounds. */
  light: string;
}

export type AccentKey =
  | 'gettingStarted'
  | 'buttons'
  | 'inputs'
  | 'cards'
  | 'typography'
  | 'navigation'
  | 'feedback'
  | 'overlays'
  | 'dataDisplay'
  | 'foundations';

export const accents: Record<AccentKey, Accent> = {
  /** Violet — getting-started guides. */
  gettingStarted: { main: '#7C4DFF', light: '#B39DFF' },
  /** Indigo — buttons, FABs, icon buttons. */
  buttons: { main: '#536DFE', light: '#96A6FF' },
  /** Blue — inputs & selection controls. */
  inputs: { main: '#1A73E8', light: '#6FAAF8' },
  /** Pink — cards, surfaces, layout. */
  cards: { main: '#EC407A', light: '#F58AAE' },
  /** Amber — typography. */
  typography: { main: '#F59E0B', light: '#FBC64B' },
  /** Teal — navigation. */
  navigation: { main: '#009688', light: '#3ec2b3' },
  /** Orange — feedback & communication. */
  feedback: { main: '#F4511E', light: '#FF8A65' },
  /** Cyan — overlays, sheets, pickers. */
  overlays: { main: '#00ACC1', light: '#4DD0E1' },
  /** Green — data display (lists, accordion, carousel). */
  dataDisplay: { main: '#2E9E43', light: '#72CD82' },
  /** Grape — foundations (accessibility, hooks, utilities, theming). */
  foundations: { main: '#9C27B0', light: '#CE7ADC' },
};

/** Route → accent. Longest-prefix wins for nested routes. */
const routeAccents: Record<string, Accent> = {
  '/docs/whats-new': accents.gettingStarted,
  '/docs/introduction': accents.gettingStarted,
  '/docs/installation': accents.gettingStarted,
  '/docs/quick-start': accents.gettingStarted,
  '/docs/theming-guide': accents.foundations,
  '/docs/accessibility': accents.foundations,
  '/docs/hooks': accents.foundations,
  '/docs/utilities': accents.foundations,
  '/buttons': accents.buttons,
  '/fab': accents.buttons,
  '/cards': accents.cards,
  '/surfaces': accents.cards,
  '/typography': accents.typography,
  '/inputs': accents.inputs,
  '/selection': accents.inputs,
  '/chips': accents.inputs,
  '/pickers': accents.overlays,
  '/navigation': accents.navigation,
  '/bottom-app-bar': accents.navigation,
  '/tabs': accents.navigation,
  '/advanced-navigation': accents.navigation,
  '/lists': accents.dataDisplay,
  '/accordion': accents.dataDisplay,
  '/carousel': accents.dataDisplay,
  '/progress': accents.dataDisplay,
  '/dialogs': accents.feedback,
  '/feedback': accents.feedback,
  '/overlays': accents.overlays,
};

/** Resolve the accent for a docs route (exact match, then longest prefix). */
export function accentForRoute(pathname: string | null | undefined): Accent {
  if (!pathname) return accents.gettingStarted;
  const exact = routeAccents[pathname];
  if (exact) return exact;
  let best: Accent | undefined;
  let bestLen = 0;
  for (const route of Object.keys(routeAccents)) {
    if (pathname.startsWith(route) && route.length > bestLen) {
      best = routeAccents[route];
      bestLen = route.length;
    }
  }
  return best ?? accents.gettingStarted;
}

/** Theme-aware accent tone: vivid on light, lifted on dark for contrast. */
export function accentColor(accent: Accent, isDark: boolean): string {
  return isDark ? accent.light : accent.main;
}

/**
 * Soft accent tint for chips / cards / active nav items.
 * ~10–14% alpha of the theme-appropriate tone, so it reads on both themes.
 */
export function accentTint(accent: Accent, isDark: boolean, alpha = 0.12): string {
  return withAlpha(accentColor(accent, isDark), alpha);
}

/** Signature brand gradient — violet → pink. Logos, active-tab underlines. */
export const brandGradient = [accents.gettingStarted.main, accents.cards.main] as const;

/** Extended sweep — violet → pink → orange. Headline text, footer accent rules. */
export const sweepGradient = [
  accents.gettingStarted.main,
  accents.cards.main,
  accents.feedback.main,
] as const;
