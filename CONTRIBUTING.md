# Contributing to Quartz UI

Thanks for considering a contribution. This document covers the workflow.

## Development setup

```sh
git clone https://github.com/sitharaj88/quartz-ui.git
cd quartz-ui
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is required because `react-test-renderer` peer ranges drift behind React releases.

## Running checks

```sh
# Test the core library (run from packages/core)
cd packages/core && npm test

# Typecheck the whole repo
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

CI runs all four on every PR.

## Adding a component

1. Folder under `packages/core/src/components/<Name>/`
2. Files: `<Name>.tsx`, `index.ts`, optionally `<Name>.types.ts` and `<Name>.styles.ts`
3. Apply the world-class checklist (`forwardRef`, `memo`, `displayName`, animated state layer where interactive, focus-visible ring, reduce-motion respect, RTL-aware logical paddings, `withAlpha` for opacity, full a11y props)
4. Write `<Name>.test.tsx` covering: render, variants, behavior, a11y states, ref handle, testID
5. Update `packages/core/src/components/index.ts` to export it
6. Add a demo screen at `apps/demo/app/<name>.tsx`

## Submitting a change

1. Branch off `master`
2. **Add a changeset**: `npx changeset` — pick the bump type and write a one-line summary. Commit the resulting `.md`.
3. Open a PR. Ensure CI is green.
4. A maintainer reviews and merges. Releases happen via the manual `Release` workflow.

## Code style

- Prettier + ESLint enforce style. Don't fight them.
- No emojis in code unless explicitly requested.
- Comments only when the *why* is non-obvious. Don't narrate what the code already says.
- Tests live next to the file they test, not in a separate folder.

## A11y is not optional

Every interactive component must:
- Have a meaningful `accessibilityRole`
- Surface the right `accessibilityState` flags (`disabled`, `selected`, `checked`, `busy`, etc.)
- Hit the WCAG 2.5.5 minimum touch target (≥48dp; use `hitSlop` to compensate for compact sizes)
- Provide a focus indicator for keyboard users (focus-visible ring on web/native)
- Respect OS reduce-motion (`useReducedMotion` hook)

If you're not sure how to satisfy any of these, ask in the PR — don't ship a component that quietly excludes users.

## Reporting bugs

Open an issue with: RN/Expo version, minimal repro, expected vs actual behavior. A failing test is the gold standard.
