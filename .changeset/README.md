# Changesets

This directory holds Changesets — descriptions of pending changes plus the version bump they imply (major/minor/patch). They drive automated releases via the workflow at `.github/workflows/release.yml`.

## Adding a changeset

```sh
npx changeset
```

Pick the package(s) affected, the bump type, and a one-line summary. Commit the resulting `.md` file alongside your code change.

## Releasing

The `release.yml` workflow (manual dispatch) consumes the changesets, bumps versions, regenerates `CHANGELOG.md`, and publishes to npm.
