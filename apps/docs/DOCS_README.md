# Quartz UI Documentation - Modern Setup

## Overview

This documentation app has been modernized with a comprehensive, guided structure that includes:

- **Modern UI Design** - Beautiful, polished interface with smooth animations
- **Interactive Code Playgrounds** - Live previews and copyable code examples
- **Comprehensive API Documentation** - Detailed props tables for all components
- **Guided Navigation** - Sidebar navigation with organized sections
- **Quick Start Guides** - Step-by-step tutorials for getting started
- **Mobile-Responsive** - Works beautifully on all screen sizes

## New File Structure

```
apps/docs/
├── app/
│   ├── _components/          # Reusable documentation components
│   │   ├── CodePlayground.tsx    # Interactive code preview component
│   │   ├── PropsTable.tsx        # API reference table component
│   │   ├── DocLayout.tsx         # Documentation page layout
│   │   ├── DocsSidebar.tsx       # Navigation sidebar
│   │   └── DemoLayout.tsx        # Component demo layout (existing)
│   │
│   ├── docs/                  # Documentation pages
│   │   ├── introduction.tsx      # Getting started intro
│   │   ├── installation.tsx      # Installation guide
│   │   ├── quick-start.tsx       # Quick start tutorial
│   │   ├── theming-guide.tsx     # Theming documentation
│   │   ├── colors.tsx            # Color tokens
│   │   ├── typography-tokens.tsx # Typography tokens
│   │   ├── spacing.tsx           # Spacing tokens
│   │   ├── elevation.tsx         # Elevation tokens
│   │   ├── motion.tsx            # Motion/animation tokens
│   │   ├── accessibility.tsx     # Accessibility guide
│   │   ├── rtl.tsx              # RTL support guide
│   │   ├── custom-themes.tsx    # Custom theme guide
│   │   └── best-practices.tsx   # Best practices guide
│   │
│   ├── buttons-new.tsx        # Enhanced Button docs (example)
│   ├── index-new.tsx          # New modern homepage
│   │
│   └── [existing component pages] # Cards, Inputs, FAB, etc.
│
├── serve-local.js             # Local development server
├── fix-paths.js               # GitHub Pages path fixer
└── package.json
```

## New Components

### 1. CodePlayground

Interactive code example component with live preview and code view.

**Usage:**
```tsx
import { CodePlayground } from './_components/CodePlayground';

<CodePlayground
  title="Button Example"
  description="A simple filled button"
  code={`<Button variant="filled" onPress={() => {}}>
  Click Me
</Button>`}
  preview={
    <Button variant="filled" onPress={() => {}}>
      Click Me
    </Button>
  }
/>
```

**Features:**
- Tab switching between Preview and Code
- Copy code button
- Syntax highlighting (monospace font)
- Language badge
- Responsive design

### 2. PropsTable

API reference table for documenting component props.

**Usage:**
```tsx
import { PropsTable, PropDefinition } from './_components/PropsTable';

const props: PropDefinition[] = [
  {
    name: 'variant',
    type: "'filled' | 'outlined'",
    default: "'filled'",
    required: false,
    description: 'Visual style variant'
  },
  {
    name: 'onPress',
    type: '() => void',
    required: true,
    description: 'Callback when pressed'
  }
];

<PropsTable props={props} title="Button Props" />
```

**Features:**
- Scrollable table for long content
- Required badge for mandatory props
- Type highlighting
- Default values
- Comprehensive descriptions

### 3. DocLayout

Consistent layout for documentation pages with sidebar navigation.

**Usage:**
```tsx
import { DocLayout } from './_components/DocLayout';

export default function MyDocPage() {
  return (
    <DocLayout
      title="Page Title"
      description="Page description"
    >
      {/* Your content here */}
    </DocLayout>
  );
}
```

**Features:**
- Responsive sidebar (desktop) / drawer (mobile)
- Top navigation bar
- Breadcrumbs
- Max-width content area
- Beautiful page header with gradient
- Mobile menu toggle

### 4. DocsSidebar

Navigation sidebar with organized sections.

**Features:**
- Organized sections (Getting Started, Components, Design Tokens, Guides)
- Active route highlighting
- Icons for each item
- Badge support
- Smooth animations
- Version footer

## Navigation Structure

### Getting Started
- Introduction - Overview of Quartz UI
- Installation - Step-by-step install guide
- Quick Start - First app tutorial
- Theming - Theme customization guide

### Components
All component pages (Buttons, Cards, Inputs, etc.)

### Design Tokens
- Colors - Color system documentation
- Typography - Type scale and font usage
- Spacing - Spacing scale and usage
- Elevation - Shadow and elevation system
- Motion - Animation and transitions

### Guides
- Accessibility - A11y best practices
- RTL Support - Right-to-left languages
- Custom Themes - Advanced theming
- Best Practices - Development guidelines

## How to Use the New Structure

### Creating a New Documentation Page

1. **Create the page file:**
```tsx
// app/docs/my-page.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'quartz-ui';
import { DocLayout } from '../_components/DocLayout';

export default function MyDocPage() {
  const theme = useTheme();

  return (
    <DocLayout
      title="My Page"
      description="Page description"
    >
      <View style={styles.section}>
        <Text variant="headlineSmall">Section Title</Text>
        <Text variant="bodyLarge">Content...</Text>
      </View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
});
```

2. **Add to sidebar navigation:**
```tsx
// app/_components/DocsSidebar.tsx

const navigation: NavSection[] = [
  {
    title: 'My Section',
    items: [
      {
        title: 'My Page',
        route: '/docs/my-page',
        icon: 'document'
      },
    ],
  },
];
```

### Creating an Enhanced Component Page

1. **Create the component doc page:**
```tsx
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable } from './_components/PropsTable';

export default function MyComponentDoc() {
  return (
    <DocLayout title="MyComponent" description="Description">
      {/* Overview */}
      <View style={styles.section}>
        <Text variant="bodyLarge">Component overview...</Text>
      </View>

      {/* Import */}
      <View style={styles.section}>
        <Text variant="titleLarge">Import</Text>
        {/* Code block */}
      </View>

      {/* Examples */}
      <View style={styles.section}>
        <CodePlayground
          title="Basic Example"
          code="<MyComponent />"
          preview={<MyComponent />}
        />
      </View>

      {/* Props API */}
      <PropsTable props={myComponentProps} />

      {/* Accessibility */}
      {/* Best Practices */}
    </DocLayout>
  );
}
```

## Migration Guide

To migrate from old pages to new structure:

1. **Keep existing demo pages** - They work great for component showcases
2. **Create new doc pages** - Use `DocLayout` for comprehensive documentation
3. **Add API documentation** - Use `PropsTable` to document all props
4. **Add code examples** - Use `CodePlayground` for interactive examples
5. **Update navigation** - Add new pages to `DocsSidebar`

## Development

### Running the docs locally

```bash
cd apps/docs
npm start
```

### Building for production

```bash
npm run build
```

### Testing GitHub Pages locally

```bash
npm run serve
```

This serves the built docs at `http://localhost:8080` with the correct base path.

## Best Practices

1. **Use consistent structure** - Follow the pattern in existing doc pages
2. **Add comprehensive examples** - Show all major use cases
3. **Document all props** - Use PropsTable for complete API coverage
4. **Include accessibility info** - Document screen reader support, keyboard nav, etc.
5. **Add best practices** - Help users use components correctly
6. **Use animations** - FadeInDown, FadeInRight for visual polish
7. **Mobile-first** - Ensure responsive design works on all sizes

## File Naming Conventions

- **Documentation pages**: `docs/[topic-name].tsx`
- **Component pages**: `[component-name].tsx` (existing) or `[component-name]-new.tsx` (enhanced)
- **Shared components**: `_components/[ComponentName].tsx`
- **Utilities**: `_utils/[util-name].ts`

## Color Scheme

The docs use your Quartz UI theme colors:
- Primary gradient: From primary to tertiary
- Surface: Component backgrounds
- Surface variant: Code blocks, subtle backgrounds
- Containers: Colored highlights (primary, secondary, tertiary containers)

## Future Enhancements

Potential additions:
- [ ] Search functionality across all docs
- [ ] Dark/Light theme toggle in nav
- [ ] Copy code snippets with syntax highlighting
- [ ] Live code editor with preview
- [ ] Component playground with prop controls
- [ ] Version switcher
- [ ] Table of contents for long pages
- [ ] Related components suggestions
- [ ] Download examples as files

## Support

For questions or issues with the documentation:
- Check existing component examples
- Review the pattern in `buttons-new.tsx`
- Look at the layout components in `_components/`

---

**Built with Quartz UI** - Making React Native documentation beautiful and accessible.
