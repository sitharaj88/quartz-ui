/**
 * Quartz UI Demo - Selection Controls Demo
 *
 * Demonstrates Checkbox, RadioButton, Switch, Chip, and Slider components
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Checkbox, RadioButton, Switch, Chip, Slider, Surface, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function SelectionScreen() {
  const theme = useTheme();

  // Checkboxes
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);

  // Radio Buttons
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [theme2, setTheme2] = useState('system');

  // Switches
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);

  // Filter Chips
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['react', 'typescript']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['design', 'development']);

  // Sliders
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [temperature, setTemperature] = useState(22);

  const toggleChip = (chip: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.includes(chip) ? list.filter(c => c !== chip) : [...list, chip]);
  };

  return (
    <DemoLayout
      title="Selection Controls"
      subtitle="Interactive choice components"
      icon="options"
      gradient={['#43e97b', '#38f9d7']}
    >
      {/* Checkboxes */}
      <Section title="Checkboxes" subtitle="Multiple selection controls" index={0}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.controlGroup}>
            <View style={styles.controlRow}>
              <Checkbox checked={termsAccepted} onCheckedChange={setTermsAccepted} />
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  Accept terms and conditions
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                  Required to continue
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.controlRow}>
              <Checkbox checked={newsletterSubscribed} onCheckedChange={setNewsletterSubscribed} />
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  Subscribe to newsletter
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                  Weekly updates and tips
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.controlRow}>
              <Checkbox checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  Marketing emails
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                  Special offers and promotions
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.controlRow}>
              <Checkbox checked={productUpdates} onCheckedChange={setProductUpdates} />
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  Product updates
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                  New features and improvements
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.controlRow}>
              <Checkbox checked={false} onCheckedChange={() => {}} disabled />
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                  Disabled option
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                  Cannot be changed
                </Text>
              </View>
            </View>
          </View>
        </Surface>
      </Section>

      {/* Radio Buttons - Delivery Method */}
      <Section title="Radio Buttons" subtitle="Single selection from options" index={1}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, paddingHorizontal: 16, paddingTop: 16 }}>
            DELIVERY METHOD
          </Text>
          <View style={styles.controlGroup}>
            <View style={styles.controlRow}>
              <RadioButton checked={deliveryMethod === 'express'} onPress={() => setDeliveryMethod('express')} />
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  Express Delivery
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                  1-2 business days • $15.00
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.controlRow}>
              <RadioButton checked={deliveryMethod === 'standard'} onPress={() => setDeliveryMethod('standard')} />
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  Standard Delivery
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                  3-5 business days • $5.00
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.controlRow}>
              <RadioButton checked={deliveryMethod === 'pickup'} onPress={() => setDeliveryMethod('pickup')} />
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  Store Pickup
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                  Available today • Free
                </Text>
              </View>
            </View>
          </View>
        </Surface>

        <Surface style={[styles.card, { backgroundColor: theme.colors.surface, marginTop: 16 }]} elevation={1}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, paddingHorizontal: 16, paddingTop: 16 }}>
            PAYMENT METHOD
          </Text>
          <View style={styles.controlGroup}>
            <View style={styles.controlRow}>
              <RadioButton checked={paymentMethod === 'card'} onPress={() => setPaymentMethod('card')} />
              <View style={styles.iconCircle}>
                <Ionicons name="card" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  Credit or Debit Card
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.controlRow}>
              <RadioButton checked={paymentMethod === 'paypal'} onPress={() => setPaymentMethod('paypal')} />
              <View style={styles.iconCircle}>
                <Ionicons name="logo-paypal" size={20} color="#00457C" />
              </View>
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  PayPal
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.controlRow}>
              <RadioButton checked={paymentMethod === 'apple'} onPress={() => setPaymentMethod('apple')} />
              <View style={styles.iconCircle}>
                <Ionicons name="logo-apple" size={20} color="#000" />
              </View>
              <View style={styles.controlLabel}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  Apple Pay
                </Text>
              </View>
            </View>
          </View>
        </Surface>
      </Section>

      {/* Switches */}
      <Section title="Switches" subtitle="Binary toggle controls" index={2}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.controlGroup}>
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="notifications" size={24} color={theme.colors.primary} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                    Push Notifications
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    Receive alerts and updates
                  </Text>
                </View>
              </View>
              <Switch value={notifications} onValueChange={setNotifications} />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="moon" size={24} color={theme.colors.secondary} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                    Dark Mode
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    Use dark theme appearance
                  </Text>
                </View>
              </View>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="location" size={24} color={theme.colors.tertiary} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                    Location Services
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    Allow location access
                  </Text>
                </View>
              </View>
              <Switch value={locationServices} onValueChange={setLocationServices} />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="cloud-download" size={24} color="#10b981" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                    Automatic Updates
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    Install updates automatically
                  </Text>
                </View>
              </View>
              <Switch value={autoUpdate} onValueChange={setAutoUpdate} />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="finger-print" size={24} color="#f59e0b" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                    Biometric Authentication
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    Use fingerprint or Face ID
                  </Text>
                </View>
              </View>
              <Switch value={biometricAuth} onValueChange={setBiometricAuth} />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="ban" size={24} color={theme.colors.onSurfaceVariant} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                    Disabled Switch
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    Cannot be toggled
                  </Text>
                </View>
              </View>
              <Switch value={false} onValueChange={() => {}} disabled />
            </View>
          </View>
        </Surface>
      </Section>

      {/* Filter Chips */}
      <Section title="Filter Chips" subtitle="Multi-select tags and categories" index={3}>
        <View style={styles.chipSection}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
            FRAMEWORKS & LANGUAGES
          </Text>
          <View style={styles.chipContainer}>
            {['react', 'vue', 'angular', 'svelte', 'typescript', 'javascript'].map((chip) => (
              <Chip
                key={chip}
                label={chip.charAt(0).toUpperCase() + chip.slice(1)}
                selected={selectedFrameworks.includes(chip)}
                onPress={() => toggleChip(chip, selectedFrameworks, setSelectedFrameworks)}
              />
            ))}
          </View>
        </View>

        <View style={styles.chipSection}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
            CATEGORIES
          </Text>
          <View style={styles.chipContainer}>
            {['design', 'development', 'marketing', 'sales', 'support', 'analytics'].map((chip) => (
              <Chip
                key={chip}
                label={chip.charAt(0).toUpperCase() + chip.slice(1)}
                selected={selectedCategories.includes(chip)}
                onPress={() => toggleChip(chip, selectedCategories, setSelectedCategories)}
              />
            ))}
          </View>
        </View>
      </Section>

      {/* Sliders */}
      <Section title="Sliders" subtitle="Continuous value selection" index={4}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.sliderGroup}>
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Ionicons name="volume-high" size={24} color={theme.colors.primary} />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', flex: 1, marginLeft: 12 }}>
                  Volume
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  {volume}%
                </Text>
              </View>
              <Slider
                value={volume}
                onValueChange={setVolume}
                minimumValue={0}
                maximumValue={100}
                step={1}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Ionicons name="sunny" size={24} color="#f59e0b" />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', flex: 1, marginLeft: 12 }}>
                  Brightness
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  {brightness}%
                </Text>
              </View>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                minimumValue={0}
                maximumValue={100}
                step={5}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Ionicons name="text" size={24} color={theme.colors.secondary} />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', flex: 1, marginLeft: 12 }}>
                  Font Size
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  {fontSize}px
                </Text>
              </View>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                minimumValue={12}
                maximumValue={24}
                step={1}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Ionicons name="thermometer" size={24} color="#ef4444" />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', flex: 1, marginLeft: 12 }}>
                  Temperature
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  {temperature}°C
                </Text>
              </View>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                minimumValue={16}
                maximumValue={30}
                step={1}
              />
            </View>
          </View>
        </Surface>
      </Section>

      {/* Usage Guidelines */}
      <Section title="Selection Guidelines" subtitle="Best practices for selection controls" index={5}>
        <View style={[styles.guideCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <Ionicons name="information-circle" size={32} color={theme.colors.onTertiaryContainer} />
          <Text variant="titleMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 16, fontWeight: '600' }}>
            When to Use Each Control
          </Text>
          <View style={styles.guideList}>
            <View style={styles.guideItem}>
              <Ionicons name="checkbox" size={20} color={theme.colors.onTertiaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                Checkboxes for multiple selections from a list
              </Text>
            </View>
            <View style={styles.guideItem}>
              <Ionicons name="radio-button-on" size={20} color={theme.colors.onTertiaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                Radio buttons for single selection from 2-5 options
              </Text>
            </View>
            <View style={styles.guideItem}>
              <Ionicons name="toggle" size={20} color={theme.colors.onTertiaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                Switches for on/off states with immediate effect
              </Text>
            </View>
            <View style={styles.guideItem}>
              <Ionicons name="pricetag" size={20} color={theme.colors.onTertiaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                Chips for filtering, categorization, and tags
              </Text>
            </View>
            <View style={styles.guideItem}>
              <Ionicons name="options" size={20} color={theme.colors.onTertiaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginLeft: 12, flex: 1, lineHeight: 20 }}>
                Sliders for selecting values from a continuous range
              </Text>
            </View>
          </View>
        </View>
      </Section>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  controlGroup: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  controlLabel: {
    flex: 1,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  switchInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  chipSection: {
    marginBottom: 24,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sliderGroup: {
    padding: 16,
  },
  sliderItem: {
    paddingVertical: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
