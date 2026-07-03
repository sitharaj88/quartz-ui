# Quartz UI

A modern, accessible component library for React Native and Expo.

![React Native](https://img.shields.io/badge/React%20Native-0.76+-61DAFB)
![Expo](https://img.shields.io/badge/Expo-52+-000020)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)
![License](https://img.shields.io/badge/license-Apache_2.0-green)

## ✨ Features

- 🎨 **Modern Design** - Beautiful, consistent design system
- 📱 **Expo Ready** - Built with Expo libraries for seamless integration
- 🌙 **Dark Mode** - Automatic light/dark theme switching with system detection
- 🌍 **RTL Support** - Full right-to-left language support
- ♿ **Accessible** - WCAG compliant with screen reader support
- 🎭 **Animations** - Smooth, performant animations with Reanimated
- 🔤 **Typography** - Complete type scale system
- 🎯 **TypeScript** - Full type safety and IntelliSense support
- 📦 **Tree-shakeable** - Only import what you need

## 📦 Installation (current dev build)

```bash
# Using npm
npm install quartz-ui@dev

# Using yarn
yarn add quartz-ui@dev

# Using pnpm
pnpm add quartz-ui@dev
```

> Note: This is a dev build targeting Feb 2025. Use the `@dev` tag (or the explicit version in package.json) until the stable release ships.

### Links
- NPM: https://www.npmjs.com/package/quartz-ui
- Repository: https://github.com/sitharaj88/quartz-ui
- Issues: https://github.com/sitharaj88/quartz-ui/issues
- Docs (local app): `apps/docs` in this repo

### Peer Dependencies

Make sure you have these Expo packages installed:

```bash
npx expo install expo-haptics react-native-reanimated react-native-gesture-handler react-native-safe-area-context
```

## 🚀 Quick Start

### 1. Wrap your app with QuartzProvider

```tsx
import { QuartzProvider } from 'quartz-ui';

export default function App() {
  return (
    <QuartzProvider initialMode="system">
      <YourApp />
    </QuartzProvider>
  );
}
```

### 2. Use components

```tsx
import { Button, Text, Card, Surface, useTheme } from 'quartz-ui';

function MyScreen() {
  const theme = useTheme();
  
  return (
    <Surface padding="lg" style={{ backgroundColor: theme.colors.background }}>
      <Text variant="headlineLarge">Welcome to Quartz UI</Text>
      
      <Card variant="elevated" onPress={() => console.log('Card pressed!')}>
        <Text variant="titleMedium">Interactive Card</Text>
        <Text variant="bodyMedium" color={theme.colors.onSurfaceVariant}>
          Cards can be elevated, filled, or outlined.
        </Text>
      </Card>
      
      <Button 
        variant="filled" 
        label="Get Started" 
        onPress={() => {}} 
      />
    </Surface>
  );
}
```

## 🎨 Components

### Buttons
- **Button** - Filled, outlined, text, elevated, and tonal variants
- **IconButton** - Standard, filled, tonal, and outlined icon buttons
- **FAB** - Floating action buttons in multiple sizes

### Inputs
- **TextInput** - Filled and outlined text fields with floating labels
- **Switch** - Toggle switch with animations
- **Chip** - Assist, filter, input, and suggestion chips

### Layout
- **Surface** - Themed container with elevation support
- **Card** - Elevated, filled, and outlined cards
- **Divider** - Horizontal and vertical dividers
- **Accordion** - Expandable panels with single or multiple expansion

### Navigation
- **AppBar** - Top app bar (center-aligned, small, medium, large)
- **BottomAppBar** - Bottom-anchored bar with actions and a FAB slot
- **NavigationBar / NavigationRail / NavigationDrawer** - Adaptive navigation
- **Tabs** - Tab navigation

### Media & Display
- **Avatar** - Image, initials, or icon with badge and group support
- **Skeleton** - Loading placeholders with shimmer animation
- **Gradient** - Linear gradients with presets and variants

### Communication
- **Toast** - Notification system with swipe-to-dismiss
- **Dialog** - Modal dialogs with actions
- **Snackbar** - Brief messages with actions

### Animation
- **AnimatedView** - 14 animation presets (fadeIn, scaleIn, slideIn, etc.)
- **Stagger** - Staggered child animations

### Typography
- **Text** - All type scale variants
- Display: Large, Medium, Small
- Headline: Large, Medium, Small
- Title: Large, Medium, Small
- Body: Large, Medium, Small
- Label: Large, Medium, Small

## 🎨 Theming

### Using the Theme

```tsx
import { useTheme, useQuartzTheme } from 'quartz-ui';

function MyComponent() {
  const theme = useTheme();
  const { mode, toggleMode, isRTL } = useQuartzTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>
        Current mode: {mode}
      </Text>
      <Button onPress={toggleMode} label="Toggle Dark Mode" />
    </View>
  );
}
```

### Custom Theme

```tsx
import { QuartzProvider, createLightTheme, createDarkTheme } from 'quartz-ui';

const customLightTheme = createLightTheme({
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
  },
});

const customDarkTheme = createDarkTheme({
  colors: {
    primary: '#90CAF9',
  },
});

function App() {
  return (
    <QuartzProvider
      lightTheme={customLightTheme}
      darkTheme={customDarkTheme}
    >
      <YourApp />
    </QuartzProvider>
  );
}
```

### Dynamic Color (Material You)

Generate a complete, WCAG-AA-compliant color system from a single brand color.
All 36 Material 3 color roles — tonal palettes, containers, surfaces, outlines —
are derived from the seed's hue and chroma using perceptually uniform (Oklab)
color math:

```tsx
import { QuartzProvider, createDynamicThemes } from 'quartz-ui';

const { light, dark } = createDynamicThemes('#1A73E8');

function App() {
  return (
    <QuartzProvider lightTheme={light} darkTheme={dark}>
      <YourApp />
    </QuartzProvider>
  );
}
```

Lower-level utilities are exported too:

```tsx
import {
  createDynamicColorScheme, // seed → full ColorScheme for 'light' | 'dark'
  generateTonalPalette,     // seed → 13-stop MD3 tonal palette
  toneColor,                // (hue, chroma, tone) → hex at an exact MD3 tone
} from 'quartz-ui';
```

## 🎯 Design Tokens

Access design tokens directly for custom styling:

```tsx
import { 
  spacing, 
  borderRadius, 
  duration, 
  easing,
  lightColorScheme,
  darkColorScheme,
} from 'quartz-ui';

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,           // 16
    borderRadius: borderRadius.lg, // 16
    gap: spacing.sm,               // 8
  },
});
```

### Variant Utility

For your own components, `createVariants` gives you a type-safe, CVA-style
variant map:

```tsx
import { createVariants } from 'quartz-ui';

const badgeVariants = createVariants({
  base: { paddingHorizontal: 12, borderRadius: 999 },
  variants: {
    tone: {
      info: { backgroundColor: '#E3F2FD' },
      success: { backgroundColor: '#E8F5E9' },
    },
    size: {
      sm: { paddingVertical: 2 },
      md: { paddingVertical: 6 },
    },
  },
  defaultVariants: { tone: 'info', size: 'md' },
});

<View style={badgeVariants({ tone: 'success' })} />
```

## ♿ Accessibility

All components are built with accessibility in mind:

- Proper ARIA roles and labels
- Screen reader announcements
- Minimum touch targets (48dp)
- Focus management
- High contrast support
- Reduced motion support

```tsx
<Button
  variant="filled"
  label="Submit"
  accessibilityLabel="Submit form"
  accessibilityHint="Double tap to submit the form"
  onPress={handleSubmit}
/>
```

## 📱 Platform Support

| Platform | Supported |
|----------|-----------||
| iOS      | ✅        |
| Android  | ✅        |
| Web      | 🚧 In Development |

## 📝 Notes

> **⚠️ Development Build Notice**
> 
> This is a dev build targeting release in **February 2025**. 
> 
> **Focus areas currently in progress:**
> - Web platform interactions and scroll behaviors
> - TODO follow-ups and bug fixes
> - RTL (Right-to-Left) support validation
> - Component stabilization for launch
> - Performance optimizations
> 
> Some features may be incomplete or behave unexpectedly. Please report issues on our [GitHub Issues](https://github.com/sitharaj88/quartz-ui/issues) page.

## 🏗️ Project Structure

```
quartz-ui/
├── packages/
│   └── core/              # Main component library
│       ├── src/
│       │   ├── components/  # UI Components
│       │   ├── theme/       # Theme system
│       │   ├── tokens/      # Design tokens
│       │   └── utils/       # Utilities
│       └── package.json
├── apps/
│   └── demo/              # Expo demo app
└── package.json           # Monorepo root
```

## 🧪 Development

```bash
# Clone the repository
git clone https://github.com/your-username/quartz-ui.git
cd quartz-ui

# Install dependencies
yarn install

# Build the core library
yarn build

# Run the demo app
cd apps/demo
npx expo start
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Apache 2.0 License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - React Native development platform
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animation library

---

<p align="center">Made with ❤️ for the React Native community</p>
