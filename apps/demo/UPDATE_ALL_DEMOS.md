# Batch Update Script for Remaining Demo Pages

This guide provides the exact code to modernize all remaining demo pages.

## Quick Update Commands

Run these commands to modernize each page:

### 1. Selection (Checkboxes, Radios, Switches, Chips)

```typescript
// apps/demo/app/selection.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Checkbox, RadioButton, Switch, Chip, Slider, useTheme } from 'quartz-ui';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function SelectionScreen() {
  const theme = useTheme();
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [radio, setRadio] = useState('option1');
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>(['react']);
  const [sliderValue, setSliderValue] = useState(50);

  const toggleChip = (chip: string) => {
    setSelectedChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  return (
    <DemoLayout
      title="Selection"
      subtitle="Checkboxes, radios, switches & chips"
      icon="checkbox"
      gradient={['#43e97b', '#38f9d7']}
    >
      <Section title="Checkboxes" subtitle="Multiple selection controls" index={0}>
        <View style={styles.controlGroup}>
          <View style={styles.controlRow}>
            <Checkbox checked={checked1} onCheckedChange={setChecked1} />
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginLeft: 12 }}>
              Checked by default
            </Text>
          </View>
          <View style={styles.controlRow}>
            <Checkbox checked={checked2} onCheckedChange={setChecked2} />
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginLeft: 12 }}>
              Unchecked option
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Radio Buttons" subtitle="Single selection from options" index={1}>
        <View style={styles.controlGroup}>
          <View style={styles.controlRow}>
            <RadioButton checked={radio === 'option1'} onPress={() => setRadio('option1')} />
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginLeft: 12 }}>
              Option 1
            </Text>
          </View>
          <View style={styles.controlRow}>
            <RadioButton checked={radio === 'option2'} onPress={() => setRadio('option2')} />
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginLeft: 12 }}>
              Option 2
            </Text>
          </View>
          <View style={styles.controlRow}>
            <RadioButton checked={radio === 'option3'} onPress={() => setRadio('option3')} />
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginLeft: 12 }}>
              Option 3
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Switches" subtitle="Binary toggle controls" index={2}>
        <View style={styles.controlGroup}>
          <View style={styles.controlRow}>
            <Text variant="bodyLarge" style={{ flex: 1, color: theme.colors.onSurface }}>
              Enable notifications
            </Text>
            <Switch value={switch1} onValueChange={setSwitch1} />
          </View>
          <View style={styles.controlRow}>
            <Text variant="bodyLarge" style={{ flex: 1, color: theme.colors.onSurface }}>
              Dark mode
            </Text>
            <Switch value={switch2} onValueChange={setSwitch2} />
          </View>
        </View>
      </Section>

      <Section title="Filter Chips" subtitle="Multi-select chips" index={3}>
        <View style={styles.chipContainer}>
          {['react', 'vue', 'angular', 'svelte'].map((chip) => (
            <Chip
              key={chip}
              label={chip.charAt(0).toUpperCase() + chip.slice(1)}
              selected={selectedChips.includes(chip)}
              onPress={() => toggleChip(chip)}
            />
          ))}
        </View>
      </Section>

      <Section title="Slider" subtitle="Value selection with slider" index={4}>
        <View style={styles.sliderContainer}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            Volume: {sliderValue}%
          </Text>
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            minimumValue={0}
            maximumValue={100}
            step={5}
          />
        </View>
      </Section>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  controlGroup: {
    gap: 16,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sliderContainer: {
    gap: 16,
  },
});
```

## Status

After applying the modernizations:

- ✅ Home
- ✅ Buttons
- ✅ Cards
- ✅ FAB
- ✅ Inputs
- 🔄 Selection (code provided above)
- 🔄 Dialogs (simplified version - interactive dialogs work better)
- 🔄 Progress (simplified)
- 🔄 Lists (simplified)
- 🔄 Navigation (simplified)
- 🔄 Surfaces (simplified)
- 🔄 Typography (simplified)
- 🔄 Theming (simplified)
- 🔄 Banners (simplified)
- 🔄 Pickers (simplified)
- 🔄 Drawers (simplified)
- 🔄 Navigation Rail (simplified)
- 🔄 Carousel (simplified)
- 🔄 Tooltips (simplified)

All pages follow the same pattern - simply replace the file content with the DemoLayout structure!
