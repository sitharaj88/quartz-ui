import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Checkbox, RadioButton, RadioGroup, Switch, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const checkboxProps: PropDefinition[] = [
  {
    name: 'checked',
    type: 'boolean',
    default: 'false',
    description: 'Whether the checkbox is checked',
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    default: 'false',
    description: 'Whether the checkbox is in indeterminate state',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the checkbox is disabled',
  },
  {
    name: 'onValueChange',
    type: '(checked: boolean) => void',
    description: 'Callback when checkbox is pressed',
  },
  {
    name: 'color',
    type: 'string',
    description: 'Custom color for checked state',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    default: "'medium'",
    description: 'Size of the checkbox',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label for screen readers',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

const radioButtonProps: PropDefinition[] = [
  {
    name: 'selected',
    type: 'boolean',
    default: 'false',
    description: 'Whether the radio button is selected',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the radio button is disabled',
  },
  {
    name: 'onPress',
    type: '() => void',
    description: 'Callback when radio button is pressed',
  },
  {
    name: 'value',
    type: 'string',
    description: 'Value associated with this radio button',
  },
  {
    name: 'color',
    type: 'string',
    description: 'Custom color for selected state',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    default: "'medium'",
    description: 'Size of the radio button',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label for screen readers',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

const switchProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'boolean',
    description: 'Controlled value of the switch',
  },
  {
    name: 'onValueChange',
    type: '(value: boolean) => void',
    description: 'Callback when switch is toggled',
  },
  {
    name: 'thumbIcon',
    type: 'React.ReactNode',
    description: 'Icon to display inside thumb when ON',
  },
  {
    name: 'thumbIconOff',
    type: 'React.ReactNode',
    description: 'Icon to display inside thumb when OFF',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Whether the switch is disabled',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessibility label for screen readers',
  },
  {
    name: 'accessibilityHint',
    type: 'string',
    description: 'Accessibility hint describing the action',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

export default function SelectionDocPage() {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchValue, setSwitchValue] = useState(false);

  return (
    <DocLayout
      title="Selection Controls"
      description="Checkbox, Radio Button, and Switch components for user selections and toggles"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Selection controls allow users to complete tasks that involve making choices such as selecting options,
          or switching settings on or off. They provide clear visual feedback about the current state.
        </Text>
      </Animated.View>

      {/* Import */}
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.section}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Import
        </Text>
        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace' }}
          >
            {`import { Checkbox, RadioButton, RadioGroup, Switch } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* Checkbox Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Checkbox
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          Checkboxes allow users to select one or more options from a set. They can also display an indeterminate state.
        </Text>

        {/* Basic Checkbox */}
        <CodePlayground
          title="Basic Checkbox"
          description="Simple checkbox with checked state"
          code={`const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onValueChange={setChecked}
/>`}
          preview={
            <Checkbox
              checked={checked}
              onValueChange={setChecked}
            />
          }
        />

        {/* Indeterminate Checkbox */}
        <CodePlayground
          title="Indeterminate State"
          description="Checkbox showing partial selection (e.g., select all)"
          code={`<Checkbox
  indeterminate={true}
  onValueChange={() => {}}
/>`}
          preview={
            <Checkbox
              indeterminate={indeterminate}
              onValueChange={() => setIndeterminate(!indeterminate)}
            />
          }
        />

        {/* Checkbox Sizes */}
        <CodePlayground
          title="Checkbox Sizes"
          description="Three size options: small, medium, large"
          code={`<View style={{ gap: 16, flexDirection: 'row' }}>
  <Checkbox size="small" checked />
  <Checkbox size="medium" checked />
  <Checkbox size="large" checked />
</View>`}
          preview={
            <View style={{ gap: 16, flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox size="small" checked onValueChange={() => { }} />
              <Checkbox size="medium" checked onValueChange={() => { }} />
              <Checkbox size="large" checked onValueChange={() => { }} />
            </View>
          }
        />

        {/* Checkbox with Label */}
        <CodePlayground
          title="Checkbox with Label"
          description="Checkbox paired with descriptive text"
          code={`<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
  <Checkbox checked={checked} onValueChange={setChecked} />
  <Text variant="bodyLarge">Accept terms and conditions</Text>
</View>`}
          preview={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Checkbox checked={checked} onValueChange={setChecked} />
              <Text variant="bodyLarge">Accept terms and conditions</Text>
            </View>
          }
        />
      </View>

      {/* Radio Button Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Radio Button
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          Radio buttons allow users to select one option from a set. Use RadioGroup to manage multiple radio buttons.
        </Text>

        {/* Basic Radio Button */}
        <CodePlayground
          title="Radio Group"
          description="Group of radio buttons for single selection"
          code={`const [radioValue, setRadioValue] = useState('option1');

<RadioGroup value={radioValue} onValueChange={setRadioValue}>
  <View style={{ gap: 16 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <RadioButton value="option1" />
      <Text variant="bodyLarge">Option 1</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <RadioButton value="option2" />
      <Text variant="bodyLarge">Option 2</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <RadioButton value="option3" />
      <Text variant="bodyLarge">Option 3</Text>
    </View>
  </View>
</RadioGroup>`}
          preview={
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <RadioButton value="option1" />
                  <Text variant="bodyLarge">Option 1</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <RadioButton value="option2" />
                  <Text variant="bodyLarge">Option 2</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <RadioButton value="option3" />
                  <Text variant="bodyLarge">Option 3</Text>
                </View>
              </View>
            </RadioGroup>
          }
        />

        {/* Radio Button Sizes */}
        <CodePlayground
          title="Radio Button Sizes"
          description="Three size options: small, medium, large"
          code={`<View style={{ gap: 16, flexDirection: 'row' }}>
  <RadioButton size="small" selected />
  <RadioButton size="medium" selected />
  <RadioButton size="large" selected />
</View>`}
          preview={
            <View style={{ gap: 16, flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton size="small" selected onPress={() => { }} />
              <RadioButton size="medium" selected onPress={() => { }} />
              <RadioButton size="large" selected onPress={() => { }} />
            </View>
          }
        />
      </View>

      {/* Switch Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
          Switch
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20, lineHeight: 22 }}>
          Switches toggle the state of a single setting on or off. They provide immediate feedback and are ideal for settings.
        </Text>

        {/* Basic Switch */}
        <CodePlayground
          title="Basic Switch"
          description="Toggle switch for on/off states"
          code={`const [switchValue, setSwitchValue] = useState(false);

<Switch
  value={switchValue}
  onValueChange={setSwitchValue}
/>`}
          preview={
            <Switch
              value={switchValue}
              onValueChange={setSwitchValue}
            />
          }
        />

        {/* Switch with Icons */}
        <CodePlayground
          title="Switch with Icons"
          description="Display icons inside the switch thumb"
          code={`<Switch
  value={switchValue}
  onValueChange={setSwitchValue}
  thumbIcon={<Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />}
  thumbIconOff={<Ionicons name="close" size={16} color={theme.colors.surfaceContainerHighest} />}
/>`}
          preview={
            <Switch
              value={switchValue}
              onValueChange={setSwitchValue}
              thumbIcon={<Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />}
              thumbIconOff={<Ionicons name="close" size={16} color={theme.colors.surfaceContainerHighest} />}
            />
          }
        />

        {/* Switch with Label */}
        <CodePlayground
          title="Switch with Label"
          description="Switch paired with descriptive text"
          code={`<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
  <View style={{ flex: 1 }}>
    <Text variant="titleMedium">Enable notifications</Text>
    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
      Receive push notifications for updates
    </Text>
  </View>
  <Switch value={switchValue} onValueChange={setSwitchValue} />
</View>`}
          preview={
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium">Enable notifications</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  Receive push notifications for updates
                </Text>
              </View>
              <Switch value={switchValue} onValueChange={setSwitchValue} />
            </View>
          }
        />

        {/* Disabled Switch */}
        <CodePlayground
          title="Disabled State"
          description="Disabled switches prevent user interaction"
          code={`<View style={{ gap: 12 }}>
  <Switch value={true} disabled />
  <Switch value={false} disabled />
</View>`}
          preview={
            <View style={{ gap: 12 }}>
              <Switch value={true} onValueChange={() => { }} disabled />
              <Switch value={false} onValueChange={() => { }} disabled />
            </View>
          }
        />
      </View>

      {/* Checkbox Props API */}
      <PropsTable props={checkboxProps} title="Checkbox API Reference" />

      {/* Radio Button Props API */}
      <PropsTable props={radioButtonProps} title="RadioButton API Reference" />

      {/* Switch Props API */}
      <PropsTable props={switchProps} title="Switch API Reference" />

      {/* Accessibility */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Accessibility
        </Text>
        <View style={[styles.accessibilityCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Screen Reader Support
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                All controls announce their role and state correctly to screen readers
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Haptic Feedback
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Light haptic feedback on interaction (iOS/Android only)
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Touch Targets
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Adequate touch target size with built-in padding for easy interaction
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                State Indication
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Clear visual feedback with smooth animations for state changes
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Best Practices */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Best Practices
        </Text>
        <View style={styles.bestPracticesList}>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>checkboxes</Text> when users can select multiple options
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>radio buttons</Text> when users must select exactly one option from a set
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>switches</Text> for settings that take immediate effect
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Always pair selection controls with clear, descriptive labels
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use indeterminate checkbox state to represent partial selection in hierarchical lists
            </Text>
          </View>
        </View>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 12,
  },
  accessibilityCard: {
    padding: 24,
    borderRadius: 16,
    gap: 20,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bestPracticesList: {
    gap: 16,
  },
  bestPracticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bestPracticeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});
