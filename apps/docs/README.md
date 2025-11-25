# Quartz UI Documentation

This is the documentation site for Quartz UI, built with Expo and React Native Web, and deployed to GitHub Pages.

## Development

Start the development server:

```bash
npm run docs:dev
# or
yarn docs:dev
```

## Building for Production

Build the single-page app for GitHub Pages:

```bash
npm run docs:build
# or
yarn docs:build
```

The built files will be output to the `dist` directory. The build process automatically:
1. Exports the Expo web app as a single-page application (SPA)
2. Runs `fix-paths.js` to update all asset paths for the GitHub Pages subpath (`/quartz-ui/`)

## Testing Locally

To test the GitHub Pages deployment locally:

```bash
cd apps/docs
npm run serve
```

Then open http://localhost:8080/quartz-ui/ in your browser. This simulates exactly how the site works on GitHub Pages.

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `master` branch. The workflow is defined in [.github/workflows/deploy-docs.yml](../../.github/workflows/deploy-docs.yml).

**Live Site:** https://sitharaj88.github.io/quartz-ui/

## GitHub Pages Configuration

This site is configured to work with GitHub Pages' subpath (`/quartz-ui/`). The `fix-paths.js` script handles path rewriting for:
- HTML script and link tags
- JavaScript asset references
- Image and resource paths

## Structure

This documentation site is based on the Quartz UI demo app and showcases all available components and their usage.
