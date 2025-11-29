import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const textInputProps: PropDefinition[] = [
  {
    name: 'variant',
    type: "'filled' | 'outlined'",
    default: "'filled'",
    description: 'Visual style variant of the text input',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Floating label text',
  },
  {
    name: 'value',
    type: 'string',
    description: 'Controlled input value',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Default uncontrolled input value',
  },
  {
    name: 'onChangeText',
    type: '(text: string) => void',
    description: 'Callback fired when text changes',
  },
  {
    name: 'helperText',
    type: 'string',
    description: 'Supporting text below the input',
  },
  {
    name: 'error',
    type: 'boolean',
    default: 'false',
    description: 'Enables error state styling',
  },
  {
    name: 'errorText',
    type: 'string',
    description: 'Error message (overrides helperText when shown)',
  },
  {
    name: 'leadingIcon',
    type: 'ReactNode',
    description: 'Icon element at the start of input',
  },
  {
    name: 'trailingIcon',
    type: 'ReactNode',
    description: 'Icon element at the end of input',
  },
  {
    name: 'maxLength',
    type: 'number',
    description: 'Maximum character length',
  },
  {
    name: 'showCounter',
    type: 'boolean',
    default: 'false',
    description: 'Shows character counter when maxLength is set',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the input field',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'true',
    description: 'Makes input expand to full container width',
  },
  {
    name: 'containerStyle',
    type: 'ViewStyle',
    description: 'Style for the container view',
  },
  {
    name: 'inputStyle',
    type: 'TextStyle',
    description: 'Style for the text input itself',
  },
];

export default function InputsDocPage() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');

  return (
    <DocLayout
      title="Text Input"
      description="Text fields let users enter and edit text with Material Design 3 styling"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Text fields let users enter text into a UI. They typically appear in forms and dialogs.
          They feature floating labels, error states, helper text, and icon support.
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
            {`import { TextInput } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 20 }}>
          Input Variants
        </Text>

        {/* Both Variants */}
        <CodePlayground
          title="All Variants"
          description="Filled and outlined text input styles"
          code={`<View style={{ gap: 16 }}>
  <TextInput
    variant="filled"
    label="Filled Input"
    placeholder="Enter text..."
  />
  <TextInput
    variant="outlined"
    label="Outlined Input"
    placeholder="Enter text..."
  />
</View>`}
          preview={
            <View style={{ gap: 16, width: '100%' }}>
              <TextInput
                variant="filled"
                label="Filled Input"
                placeholder="Enter text..."
              />
              <TextInput
                variant="outlined"
                label="Outlined Input"
                placeholder="Enter text..."
              />
            </View>
          }
        />

        {/* Filled Input */}
        <CodePlayground
          title="Filled Input"
          description="Default filled variant with background"
          code={`<TextInput
  variant="filled"
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>`}
          preview={
            <TextInput
              variant="filled"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          }
        />

        {/* Outlined Input */}
        <CodePlayground
          title="Outlined Input"
          description="Outlined variant with border"
          code={`<TextInput
  variant="outlined"
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
/>`}
          preview={
            <TextInput
              variant="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          }
        />

        {/* With Leading Icon */}
        <CodePlayground
          title="With Leading Icon"
          description="Input with icon at the start"
          code={`<TextInput
  variant="filled"
  label="Search"
  leadingIcon={
    <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />
  }
  placeholder="Search for items..."
/>`}
          preview={
            <TextInput
              variant="filled"
              label="Search"
              leadingIcon={
                <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />
              }
              placeholder="Search for items..."
            />
          }
        />

        {/* With Trailing Icon */}
        <CodePlayground
          title="With Trailing Icon"
          description="Input with icon at the end"
          code={`<TextInput
  variant="outlined"
  label="Username"
  trailingIcon={
    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
  }
  defaultValue="john_doe"
/>`}
          preview={
            <TextInput
              variant="outlined"
              label="Username"
              trailingIcon={
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              }
              defaultValue="john_doe"
            />
          }
        />

        {/* With Helper Text */}
        <CodePlayground
          title="With Helper Text"
          description="Supporting text below the input"
          code={`<TextInput
  variant="filled"
  label="Phone Number"
  helperText="Enter your mobile number with country code"
  keyboardType="phone-pad"
/>`}
          preview={
            <TextInput
              variant="filled"
              label="Phone Number"
              helperText="Enter your mobile number with country code"
              keyboardType="phone-pad"
            />
          }
        />

        {/* Error State */}
        <CodePlayground
          title="Error State"
          description="Input with error validation"
          code={`<TextInput
  variant="outlined"
  label="Email"
  error
  errorText="Please enter a valid email address"
  value="invalid@"
/>`}
          preview={
            <TextInput
              variant="outlined"
              label="Email"
              error
              errorText="Please enter a valid email address"
              value="invalid@"
              onChangeText={() => { }}
            />
          }
        />

        {/* Character Counter */}
        <CodePlayground
          title="Character Counter"
          description="Shows remaining characters"
          code={`const [bio, setBio] = useState('');

<TextInput
  variant="filled"
  label="Bio"
  value={bio}
  onChangeText={setBio}
  maxLength={150}
  showCounter
  multiline
  numberOfLines={4}
/>`}
          preview={
            <TextInput
              variant="filled"
              label="Bio"
              value={bio}
              onChangeText={setBio}
              maxLength={150}
              showCounter
              multiline
              numberOfLines={4}
            />
          }
        />

        {/* Multiline */}
        <CodePlayground
          title="Multiline Input"
          description="Text area for longer content"
          code={`<TextInput
  variant="outlined"
  label="Description"
  multiline
  numberOfLines={6}
  placeholder="Enter a detailed description..."
/>`}
          preview={
            <TextInput
              variant="outlined"
              label="Description"
              multiline
              numberOfLines={6}
              placeholder="Enter a detailed description..."
            />
          }
        />

        {/* Disabled */}
        <CodePlayground
          title="Disabled State"
          description="Non-editable input field"
          code={`<TextInput
  variant="filled"
  label="Account ID"
  value="ACC-12345"
  disabled
/>`}
          preview={
            <TextInput
              variant="filled"
              label="Account ID"
              value="ACC-12345"
              disabled
            />
          }
        />
      </View>

      {/* Props API */}
      <PropsTable props={textInputProps} title="API Reference" />

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
                Floating Labels
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Animated labels move up when focused or filled, providing clear context
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Error Feedback
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Error states provide visual and textual feedback for validation
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                RTL Support
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Full right-to-left layout support with proper icon positioning
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Keyboard Types
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Supports all React Native keyboard types for optimal input experience
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
              Always provide a clear label that describes the expected input
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use helper text to provide additional context or formatting instructions
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Show specific error messages rather than generic "Invalid input"
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use appropriate keyboard types (email, phone, number) for better UX
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use icons to provide visual cues (search, visibility toggle, validation)
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
