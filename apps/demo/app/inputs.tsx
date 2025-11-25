/**
 * Quartz UI Demo - Text Input Demo
 *
 * Demonstrates TextInput component with various states and configurations
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Surface, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function InputsScreen() {
  const theme = useTheme();

  // Basic inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  // With icons
  const [search, setSearch] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState('');

  // Validation states
  const [phone, setPhone] = useState('');
  const [validEmail, setValidEmail] = useState('user@example.com');
  const [invalidEmail, setInvalidEmail] = useState('invalid@');
  const [website, setWebsite] = useState('');

  // Multiline
  const [message, setMessage] = useState('');
  const [bio, setBio] = useState('');
  const [feedback, setFeedback] = useState('');

  // Advanced
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [creditCard, setCreditCard] = useState('');

  return (
    <DemoLayout
      title="Text Inputs"
      subtitle="Forms and text fields"
      icon="create"
      gradient={['#4facfe', '#00f2fe']}
    >
      {/* Filled Inputs */}
      <Section title="Filled Inputs" subtitle="Standard text fields" index={0}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              variant="filled"
            />
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              variant="filled"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="@username"
              variant="filled"
              autoCapitalize="none"
            />
          </View>
        </Surface>
      </Section>

      {/* Outlined Inputs */}
      <Section title="Outlined Inputs" subtitle="With border styling" index={1}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 (555) 000-0000"
              variant="outlined"
              keyboardType="phone-pad"
            />
            <TextInput
              label="Website URL"
              value={website}
              onChangeText={setWebsite}
              placeholder="https://example.com"
              variant="outlined"
              keyboardType="url"
              autoCapitalize="none"
            />
            <TextInput
              label="Company Name"
              value=""
              placeholder="Your company"
              variant="outlined"
            />
          </View>
        </Surface>
      </Section>

      {/* With Leading Icons */}
      <Section title="With Leading Icons" subtitle="Icons before input text" index={2}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Search"
              value={search}
              onChangeText={setSearch}
              placeholder="Search..."
              variant="filled"
              leftIcon={<Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />}
            />
            <TextInput
              label="Email"
              value=""
              placeholder="your@email.com"
              variant="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail" size={20} color={theme.colors.onSurfaceVariant} />}
            />
            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter your location"
              variant="filled"
              leftIcon={<Ionicons name="location" size={20} color={theme.colors.onSurfaceVariant} />}
            />
          </View>
        </Surface>
      </Section>

      {/* With Trailing Icons */}
      <Section title="With Trailing Icons" subtitle="Icons after input text" index={3}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              variant="outlined"
              secureTextEntry={!showPassword}
              rightIcon={
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <TextInput
              label="Price"
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              variant="filled"
              keyboardType="decimal-pad"
              rightIcon={
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}>
                  USD
                </Text>
              }
            />
            <TextInput
              label="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="1"
              variant="outlined"
              keyboardType="number-pad"
              rightIcon={
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}>
                  items
                </Text>
              }
            />
          </View>
        </Surface>
      </Section>

      {/* Both Leading and Trailing Icons */}
      <Section title="Both Leading & Trailing" subtitle="Icons on both sides" index={4}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Credit Card"
              value={creditCard}
              onChangeText={setCreditCard}
              placeholder="1234 5678 9012 3456"
              variant="filled"
              keyboardType="number-pad"
              leftIcon={<Ionicons name="card" size={20} color={theme.colors.primary} />}
              rightIcon={<Ionicons name="checkmark-circle" size={20} color="#10b981" />}
            />
            <TextInput
              label="Search Products"
              value=""
              placeholder="Find what you need..."
              variant="outlined"
              leftIcon={<Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />}
              rightIcon={<Ionicons name="options" size={20} color={theme.colors.onSurfaceVariant} />}
            />
            <TextInput
              label="Discount Code"
              value=""
              placeholder="Enter code"
              variant="filled"
              autoCapitalize="characters"
              leftIcon={<Ionicons name="pricetag" size={20} color={theme.colors.tertiary} />}
              rightIcon={
                <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  APPLY
                </Text>
              }
            />
          </View>
        </Surface>
      </Section>

      {/* Validation States */}
      <Section title="Validation States" subtitle="Success, error, and helper text" index={5}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Valid Email"
              value={validEmail}
              onChangeText={setValidEmail}
              variant="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              helperText="Email is valid and available"
              leftIcon={<Ionicons name="checkmark-circle" size={20} color="#10b981" />}
            />
            <TextInput
              label="Invalid Email"
              value={invalidEmail}
              onChangeText={setInvalidEmail}
              variant="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error
              helperText="Please enter a valid email address"
              leftIcon={<Ionicons name="close-circle" size={20} color="#ef4444" />}
            />
            <TextInput
              label="Phone Number"
              value=""
              placeholder="+1 (555) 000-0000"
              variant="filled"
              keyboardType="phone-pad"
              helperText="Include country code for international numbers"
            />
            <TextInput
              label="Password Strength"
              value="weak123"
              variant="outlined"
              secureTextEntry
              error
              helperText="Password must be at least 8 characters with numbers and symbols"
            />
          </View>
        </Surface>
      </Section>

      {/* Multiline Inputs */}
      <Section title="Multiline Inputs" subtitle="Text areas for longer content" index={6}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              placeholder="Write your message here..."
              variant="outlined"
              multiline
              numberOfLines={4}
              style={{ minHeight: 100 }}
            />
            <TextInput
              label="Bio"
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              variant="filled"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80 }}
              helperText={`${bio.length}/200 characters`}
            />
            <TextInput
              label="Feedback"
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Share your thoughts..."
              variant="outlined"
              multiline
              numberOfLines={5}
              style={{ minHeight: 120 }}
            />
          </View>
        </Surface>
      </Section>

      {/* Disabled State */}
      <Section title="Disabled State" subtitle="Non-editable inputs" index={7}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Read Only Field"
              value="This field cannot be edited"
              variant="filled"
              disabled
            />
            <TextInput
              label="Account ID"
              value="ACC-2024-001234"
              variant="outlined"
              disabled
              leftIcon={<Ionicons name="lock-closed" size={20} color={theme.colors.onSurfaceVariant} />}
            />
            <TextInput
              label="System Generated"
              value="AUTO-GENERATED-VALUE"
              variant="filled"
              disabled
              helperText="This value is automatically assigned"
            />
          </View>
        </Surface>
      </Section>

      {/* Input Best Practices */}
      <Section title="Input Guidelines" subtitle="Best practices for text inputs" index={8}>
        <View style={[styles.guideCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons name="information-circle" size={32} color={theme.colors.onPrimaryContainer} />
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 16, fontWeight: '600' }}>
            Text Input Best Practices
          </Text>
          <View style={styles.guideList}>
            {[
              'Always provide clear, descriptive labels',
              'Use appropriate keyboard types (email, phone, number)',
              'Show helper text for format requirements',
              'Provide immediate validation feedback',
              'Use icons to indicate input purpose or state',
              'Keep placeholder text concise and helpful',
              'Disable autocorrect for sensitive fields',
              'Use secure text entry for passwords',
            ].map((tip, index) => (
              <View key={index} style={styles.guideItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.onPrimaryContainer} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Section>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  inputGroup: {
    gap: 20,
  },
  guideCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  guideList: {
    width: '100%',
    gap: 16,
    marginTop: 16,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
