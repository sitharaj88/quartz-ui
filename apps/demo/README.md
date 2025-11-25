# Quartz UI Demo App

A comprehensive component showcase built with React Native and Expo.

## ✨ Features

- 🎨 **Modern Design** - Fully redesigned with modern design principles
- 🔍 **Smart Search** - Real-time component filtering on home screen
- 🎬 **Beautiful Animations** - Parallax scrolling and staggered fade-ins
- 📱 **18 Component Categories** - Complete library showcase
- 🌗 **Theme Support** - Works perfectly in light and dark modes
- ♿ **Accessibility** - Full a11y support throughout

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

## 📱 Demo Pages

All demo pages follow a consistent, modern design pattern:

### Completed & Modernized
- ✅ **Home** - Component browser with search
- ✅ **Buttons** - All button variants and sizes
- ✅ **Cards** - Elevated, filled, outlined, and interactive cards
- ✅ **FAB** - Floating action buttons with usage guidelines

### Available Demos
- **Inputs** - Text fields and input components
- **Selection** - Checkboxes, radios, switches, chips
- **Dialogs** - Alerts, modals, snackbars
- **Progress** - Linear and circular indicators
- **Lists** - List items and dividers
- **Navigation** - App bars, tabs, navigation bars
- **Surfaces** - Cards, menus, tooltips
- **Typography** - Type scale and text styles
- **Theming** - Colors, shapes, dark mode
- **Banners** - Prominent messages with actions
- **Pickers** - Date and time selection
- **Drawers** - Navigation drawer and side sheet
- **Navigation Rail** - Compact side navigation
- **Carousel** - Scrollable content gallery
- **Tooltips** - Plain and rich tooltip overlays

## 🎨 Design System

### Colors
Each component category has its own gradient theme:
- Buttons: Purple gradient (#667eea → #764ba2)
- Cards: Pink gradient (#f093fb → #f5576c)
- Inputs: Blue gradient (#4facfe → #00f2fe)
- FAB: Sunset gradient (#fa709a → #fee140)
- And more...

### Typography
- **Display**: headlineLarge (32sp, 800 weight)
- **Headlines**: headlineMedium (28sp, 700-800 weight)
- **Titles**: titleLarge (22sp, 700 weight)
- **Body**: bodyLarge/Medium (16-14sp, 400-500 weight)
- **Labels**: labelLarge/Medium (14-12sp, 600 weight)

### Spacing
- **Cards**: 20px padding, 20px border radius
- **Sections**: 24px vertical spacing
- **Elements**: 12-16px gaps
- **Hero**: 32-40px padding

### Animations
- **Hero Parallax**: 0.3x scroll speed with scale
- **Section Fade-ins**: 50ms stagger delay
- **Card Interactions**: Scale + opacity on press

## 🛠 Architecture

### Component Structure
```
app/
├── _components/
│   └── DemoLayout.tsx      # Reusable page layout
├── index.tsx               # Home screen with search
├── buttons.tsx            # Buttons demo
├── cards.tsx              # Cards demo
├── fab.tsx                # FAB demo
└── ...                    # Other demos
```

### DemoLayout Component
All demo pages use the `DemoLayout` component for consistency:

```typescript
<DemoLayout
  title="Buttons"
  subtitle="Interactive button components"
  icon="radio-button-on"
  gradient={['#667eea', '#764ba2']}
>
  <Section title="Filled Buttons" subtitle="High emphasis" index={0}>
    {/* Demo content */}
  </Section>
</DemoLayout>
```

**Benefits:**
- Automatic parallax scrolling
- Staggered section animations
- Consistent styling
- ~150 lines less code per page

## 📖 Documentation

- **Modernization Guide**: [MODERNIZATION_GUIDE.md](./MODERNIZATION_GUIDE.md)
- **Summary**: [../MODERNIZATION_SUMMARY.md](../MODERNIZATION_SUMMARY.md)

## 🎯 Best Practices

### Adding New Demo Pages

1. Create new file in `app/` directory
2. Import `DemoLayout` and `Section`
3. Use the gradient from home screen mapping
4. Follow the design guidelines:
   - 20px border radius for cards
   - 20px padding for content
   - 600-700 font weight for titles
   - 20-22px line height for body text

Example template available in [MODERNIZATION_GUIDE.md](./MODERNIZATION_GUIDE.md).

## 🌟 Highlights

### Home Screen
- **Search functionality**: Filter 18+ components in real-time
- **Dynamic stats**: Shows actual component count
- **Empty state**: Helpful message when no results found
- **Vertical cards**: Better content display with gradients

### Component Demos
- **Consistent layout**: All use DemoLayout component
- **Smooth animations**: Parallax headers and fade-ins
- **Clear sections**: Well-organized with descriptions
- **Interactive examples**: Try all component variants

## 📦 Dependencies

- **React Native** 0.81.5
- **Expo** ~54.0.0
- **quartz-ui** - Component library
- **expo-linear-gradient** - Beautiful gradients
- **react-native-reanimated** - Smooth animations
- **@expo/vector-icons** - Iconography

## 🤝 Contributing

To add or modernize a demo page:

1. Follow the template in `MODERNIZATION_GUIDE.md`
2. Use the `DemoLayout` component
3. Match the design system guidelines
4. Test on both iOS and Android
5. Ensure accessibility support

## 📝 License

Apache 2.0

## 🎉 Credits

Built with ❤️ using React Native.

---

**Note**: This demo app showcases the Quartz UI component library. All components support both light and dark themes.
