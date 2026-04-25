# quartz-ui

## 1.0.0-alpha.1

### Major changes

First public alpha. All 38 components rebuilt to a unified "world-class" rubric:

- **API consistency**: every component exports a `forwardRef`-backed memoized component with `displayName`, JSDoc'd props, and a typed imperative `Handle` (where focus/blur/clear semantics make sense).
- **Animated interaction**: state-layer opacity transitions on every interactive surface (Button, IconButton, Card, Chip, FAB), driven by Reanimated shared values to avoid React re-renders during press/hover.
- **Accessibility**: WCAG 2.2 AA contrast via the new `pickForeground` helper for custom container colors; touch-target padding via `hitSlop` brings every interactive surface to ≥48dp; loading state changes announced through `accessibilityLiveRegion`; correct `accessibilityRole` (`togglebutton` for toggle modes, `radio`/`radiogroup`, `tablist`/`tab`, `progressbar`, `alert`, `menuitem`).
- **Reduce-motion**: new `useReducedMotion` hook reactively subscribes to OS preference + theme override; every animated component (Button, Switch, Checkbox, RadioButton, Chip, FAB, Card, TextInput, Slider) skips or shortens animations when on.
- **Focus-visible**: new `useFocusVisible` hook distinguishes keyboard focus from pointer focus (matches CSS `:focus-visible`). Focus rings render only when needed.
- **RTL**: logical paddings throughout; direction-aware chevrons and layouts.
- **Color math**: new `withAlpha` / `luminance` / `contrastRatio` / `pickForeground` utilities replace fragile hex+opacity string concatenation across all components.
- **Tests**: 218 unit + behavior + a11y tests across 26 suites covering all interactive components.

### Infrastructure

- Jest + `@testing-library/react-native` configured with reanimated/gesture-handler mocks
- GitHub Actions CI (lint, typecheck, test, build) on every PR
- Changesets-based release workflow with npm provenance
- `tsup` build now ships source maps + correctly externalizes all peer dependencies
- Repo governance: CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, this CHANGELOG

### Known issues

- Some RN AccessibilityRoles (`radiogroup`, `header`, `menu`) are not mapped by RNTL's `getByRole`. Tests use `accessibilityRole` prop queries instead. This is a test-tool limitation, not a runtime issue.
- Web platform support is best-effort. iOS and Android are first-class; web SSR is untested.
