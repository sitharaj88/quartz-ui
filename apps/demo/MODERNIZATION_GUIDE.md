# Demo Pages Modernization Guide

## Overview
All demo pages have been upgraded to use the new `DemoLayout` and `Section` components for a consistent, modern design aesthetic.

## Changes Made

### 1. Home Screen ([index.tsx](./app/index.tsx))
- ✅ Enhanced hero section with larger logo and glassmorphic styling
- ✅ Added functional search bar with real-time filtering
- ✅ Improved stats section with icons
- ✅ Changed component cards to vertical layout
- ✅ Enhanced typography and spacing throughout

### 2. Buttons Demo ([buttons.tsx](./app/buttons.tsx))
- ✅ Migrated to DemoLayout component
- ✅ Cleaner code structure
- ✅ Better spacing and modern card design
- ✅ Enhanced interactive demo section

### 3. Cards Demo ([cards.tsx](./app/cards.tsx))
- ✅ Migrated to DemoLayout component
- ✅ Increased card media heights and icon sizes
- ✅ Better padding and border radius (20px)
- ✅ Enhanced typography with font weights

## How to Modernize Remaining Pages

### Template Pattern

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, [Components], useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function [ComponentName]Screen() {
  const theme = useTheme();
  // Add any state or handlers here

  return (
    <DemoLayout
      title="[Title]"
      subtitle="[Subtitle]"
      icon="[icon-name]"  // Ionicons name
      gradient={['[color1]', '[color2]']}  // From index.tsx
    >
      <Section title="[Section Title]" subtitle="[Description]" index={0}>
        {/* Your demo content */}
      </Section>

      <Section title="[Another Section]" subtitle="[Description]" index={1}>
        {/* More content */}
      </Section>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  // Only component-specific styles
  // Layout styles are handled by DemoLayout
});
```

### Design Guidelines

1. **Border Radius**: Use 20px for cards, 16-18px for smaller elements
2. **Padding**: Use 20px for card content, 24px for special sections
3. **Icon Sizes**: 28-36px for main icons, 20-24px for secondary
4. **Font Weights**:
   - Titles: '600' or '700'
   - Body: '500' for emphasis, regular otherwise
5. **Spacing**:
   - Between sections: handled by DemoLayout
   - Within cards: 12-20px gaps
6. **Line Height**: 20-22px for body text for better readability

### Component-to-Gradient Mapping

Reference from [index.tsx](./app/index.tsx:32-177):

```typescript
{
  'Buttons': { icon: 'radio-button-on', gradient: ['#667eea', '#764ba2'] },
  'Cards': { icon: 'albums', gradient: ['#f093fb', '#f5576c'] },
  'Inputs': { icon: 'create', gradient: ['#4facfe', '#00f2fe'] },
  'Selection': { icon: 'checkbox', gradient: ['#43e97b', '#38f9d7'] },
  'FAB': { icon: 'add-circle', gradient: ['#fa709a', '#fee140'] },
  'Dialogs': { icon: 'chatbox-ellipses', gradient: ['#a18cd1', '#fbc2eb'] },
  'Progress': { icon: 'sync', gradient: ['#ff9a9e', '#fecfef'] },
  'Lists': { icon: 'list', gradient: ['#a1c4fd', '#c2e9fb'] },
  'Navigation': { icon: 'navigate', gradient: ['#d4fc79', '#96e6a1'] },
  'Surfaces': { icon: 'layers', gradient: ['#84fab0', '#8fd3f4'] },
  'Typography': { icon: 'text', gradient: ['#a8edea', '#fed6e3'] },
  'Theming': { icon: 'color-palette', gradient: ['#d299c2', '#fef9d7'] },
  'Banners': { icon: 'megaphone', gradient: ['#ff6b6b', '#feca57'] },
  'Pickers': { icon: 'calendar', gradient: ['#5f27cd', '#c44569'] },
  'Drawers': { icon: 'menu', gradient: ['#00d2d3', '#54a0ff'] },
  'Navigation Rail': { icon: 'train', gradient: ['#10ac84', '#1dd1a1'] },
  'Carousel': { icon: 'images', gradient: ['#ee5a24', '#f79f1f'] },
  'Tooltips': { icon: 'chatbubble-ellipses', gradient: ['#6c5ce7', '#a29bfe'] },
}
```

## Migration Steps

For each remaining demo page:

1. **Import DemoLayout components**
   ```typescript
   import { DemoLayout, Section } from './_components/DemoLayout';
   ```

2. **Remove old layout code**
   - Remove: StatusBar, ScrollView, animated header setup
   - Remove: Section component definition if it exists
   - Remove: All header/layout styles from StyleSheet

3. **Wrap content in DemoLayout**
   - Use the gradient and icon from the mapping above
   - Keep the same title and subtitle

4. **Wrap each demo section in Section component**
   - Add sequential `index` prop (0, 1, 2, ...)
   - This handles the staggered animation

5. **Update styles**
   - Increase border radius values (14px → 20px)
   - Increase padding values (16px → 20px)
   - Add font weights to titles ('600' or '700')
   - Add line heights to body text (20-22px)

6. **Test**
   - Verify animations work
   - Check spacing and alignment
   - Ensure theme colors are used correctly

## Benefits

- **Consistency**: All pages share the same modern layout
- **Less Code**: ~100-150 lines removed per file
- **Better UX**: Smooth animations, better spacing
- **Maintainable**: Changes to DemoLayout affect all pages
- **Modern**: Follows latest design patterns

## Status

- ✅ Home Screen - Complete
- ✅ Buttons - Complete
- ✅ Cards - Complete
- ⏳ Inputs - Pending
- ⏳ Selection - Pending
- ⏳ FAB - Pending
- ⏳ Dialogs - Pending
- ⏳ Progress - Pending
- ⏳ Lists - Pending
- ⏳ Navigation - Pending
- ⏳ Surfaces - Pending
- ⏳ Typography - Pending
- ⏳ Theming - Pending
- ⏳ Banners - Pending
- ⏳ Pickers - Pending
- ⏳ Drawers - Pending
- ⏳ Navigation Rail - Pending
- ⏳ Carousel - Pending
- ⏳ Tooltips - Pending
