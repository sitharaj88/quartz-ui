# Accessibility guarantees

Every component in `quartz-ui` ships with the following a11y guarantees. If you find a component that doesn't satisfy them, file a bug — it's a defect, not a feature request.

## Cross-component baseline

| Guarantee | How |
|---|---|
| **Semantic role** | `accessibilityRole` set correctly per component |
| **State exposure** | `accessibilityState` reflects `disabled`, `selected`, `checked`, `busy`, `expanded` where applicable |
| **WCAG 2.5.5 touch targets** | ≥48dp tappable area, achieved via `hitSlop` for compact sizes |
| **WCAG 2.4.7 focus visibility** | Focus-visible ring rendered on keyboard focus (CSS `:focus-visible` parity) |
| **WCAG 2.3.3 reduced motion** | Animations skip / shorten when OS reduce-motion is enabled, observed via `useReducedMotion` |
| **WCAG 1.4.3 contrast** | Theme tokens pre-paired (e.g. `primary` ↔ `onPrimary`); custom container colors auto-pick foreground via `pickForeground` for AA contrast |
| **RTL** | Logical properties (`paddingStart` / `paddingEnd` / `marginStart` / `marginEnd`); direction-aware paddings respond to `I18nManager.isRTL` |
| **Live regions** | State changes (loading, validation errors, snackbar/toast/badge messages) announced via `accessibilityLiveRegion="polite"` |

## Per-component table

| Component | Role | Key state | Touch target | Live region |
|---|---|---|---|---|
| **Button** | `button` / `togglebutton` | `disabled`, `busy`, `selected` | ≥48dp at all sizes | `polite` while loading |
| **IconButton** | `button` / `togglebutton` | `disabled`, `selected` | hitSlop fills to 48dp on small/medium | — |
| **TextInput** | (input) | `disabled`, `invalid` | 56dp height | `alert` on error text |
| **Checkbox** | `checkbox` | `checked` (bool / `'mixed'`), `disabled` | hitSlop to 48dp | — |
| **RadioButton** | `radio` (in `radiogroup`) | `checked`, `disabled` | hitSlop to 48dp | — |
| **Switch** | `switch` | `checked`, `disabled` | 52×32 + focus ring | — |
| **Card** | `button` (interactive) / static | `disabled` | min content padding | — |
| **Text** | `text` | — | — | — |
| **Avatar** | `image` | — | — | — |
| **Badge** | `text` | — | — | `polite` (count changes) |
| **Chip** | `button` / `togglebutton` (filter) | `selected`, `disabled` | 32 + hitSlop | — |
| **FAB** | `button` | `disabled` | 40 / 56 / 96 | — |
| **SegmentedButton** | `tablist` / `tab` | `selected`, `disabled` | per density | — |
| **Slider** | `adjustable` | min / max / now | 40dp thumb container | — |
| **ProgressIndicator** | `progressbar` | min / max / now (or `undefined` indeterminate) | — | — |
| **SearchBar** | `search` (input) | `disabled` | 56dp | — |
| **Snackbar** | `alert` | — | — | `polite` |
| **Toast** | `alert` | — | — | `polite` |
| **Tooltip** | `text` | — | — | `polite` |
| **Tabs** | `tablist` / `tab` | `selected` | 48dp | — |
| **Menu** | (`menu`) / `menuitem` | `disabled` | 48dp item height | — |
| **Dialog** | `alert` (modal) | — | — | — |
| **AlertDialog** | `alert` (modal) | — | — | — |
| **BottomSheet** | (modal) | — | — | — |
| **AppBar** | `header` | — | — | — |
| **NavigationBar** | (tab list) | `selected` | per density | — |
| **NavigationDrawer** | — | — | — | — |
| **NavigationRail** | — | `selected` | — | — |
| **List / ListItem** | `button` (interactive) | `disabled`, `selected` | 56dp | — |
| **ListSection** | `header` | — | — | — |
| **Banner** | — | — | — | — |
| **Carousel** | — | — | — | — |
| **DatePicker / TimePicker** | (modal) | — | — | — |
| **Skeleton** | — | — | — | — |
| **Surface / Divider / Gradient / AnimatedView** | — | — | — | — |

## Patterns to follow when adding components

- Inputs that emit value changes → `accessibilityRole="adjustable"` + `accessibilityValue={{ min, max, now }}`
- Toggle buttons → `togglebutton` role + `accessibilityState.selected`
- Modal containers → `accessibilityViewIsModal: true`
- Status / error messages → `accessibilityLiveRegion="polite"` + `accessibilityRole="alert"` if interrupting
- Loading states → `accessibilityState.busy: true` + `announceForAccessibility(...)` on transition

The hooks in [src/hooks/](src/hooks/) cover the harder parts:
- `useReducedMotion()` — reactive OS reduce-motion subscription
- `useFocusVisible()` — keyboard-vs-pointer focus
- `useInteractiveState()` — composed pressed / hovered / focus-visible state for any pressable surface

## What we don't claim yet

- **Full keyboard nav for complex composites** (DatePicker arrow-key calendar nav, ComboBox typeahead) — partial.
- **High-contrast mode** — `theme.accessibility.highContrast` exists in the type but no component currently switches palettes on it.
- **Non-Latin RTL text shaping** — RN handles glyph rendering; we handle layout direction.
- **Screen reader testing on every release** — automated (RNTL) coverage exists; manual VoiceOver/TalkBack verification is per-PR, not pre-publish.

If you depend on any of the gaps above, please file an issue so we can prioritize.
