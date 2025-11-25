import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function ButtonsScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <DemoLayout
      title="Buttons"
      subtitle="Interactive button components with MD3 styling"
      icon="radio-button-on"
      gradient={['#667eea', '#764ba2']}
    >
      {/* Filled Buttons */}
      <Section title="Filled Buttons" subtitle="High emphasis actions" index={0}>
        <View style={styles.buttonRow}>
          <Button variant="filled" onPress={() => {}}>
            Primary
          </Button>
          <Button variant="filled" onPress={() => {}} icon={<Ionicons name="add" size={18} color="#fff" />}>
            With Icon
          </Button>
        </View>
        <View style={styles.buttonRow}>
          <Button variant="filled" onPress={() => {}} disabled>
            Disabled
          </Button>
          <Button variant="filled" onPress={handleLoadingDemo} loading={loading}>
            {loading ? 'Loading...' : 'Click Me'}
          </Button>
        </View>
      </Section>

      {/* Outlined Buttons */}
      <Section title="Outlined Buttons" subtitle="Medium emphasis actions" index={1}>
        <View style={styles.buttonRow}>
          <Button variant="outlined" onPress={() => {}}>
            Outlined
          </Button>
          <Button variant="outlined" onPress={() => {}} icon={<Ionicons name="heart" size={18} color={theme.colors.primary} />}>
            Favorite
          </Button>
        </View>
        <View style={styles.buttonRow}>
          <Button variant="outlined" onPress={() => {}} disabled>
            Disabled
          </Button>
          <Button variant="outlined" onPress={() => {}} icon={<Ionicons name="share-social" size={18} color={theme.colors.primary} />}>
            Share
          </Button>
        </View>
      </Section>

      {/* Text Buttons */}
      <Section title="Text Buttons" subtitle="Low emphasis actions" index={2}>
        <View style={styles.buttonRow}>
          <Button variant="text" onPress={() => {}}>
            Text Button
          </Button>
          <Button variant="text" onPress={() => {}} icon={<Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />} iconPosition="right">
            Learn More
          </Button>
        </View>
        <View style={styles.buttonRow}>
          <Button variant="text" onPress={() => {}} disabled>
            Disabled
          </Button>
          <Button variant="text" onPress={() => {}}>
            Cancel
          </Button>
        </View>
      </Section>

      {/* Tonal Buttons */}
      <Section title="Tonal Buttons" subtitle="Balanced emphasis" index={3}>
        <View style={styles.buttonRow}>
          <Button variant="tonal" onPress={() => {}}>
            Tonal
          </Button>
          <Button variant="tonal" onPress={() => {}} icon={<Ionicons name="bookmark" size={18} color={theme.colors.onSecondaryContainer} />}>
            Save
          </Button>
        </View>
        <View style={styles.buttonRow}>
          <Button variant="tonal" onPress={() => {}} disabled>
            Disabled
          </Button>
          <Button variant="tonal" onPress={() => {}} icon={<Ionicons name="download" size={18} color={theme.colors.onSecondaryContainer} />}>
            Download
          </Button>
        </View>
      </Section>

      {/* Elevated Buttons */}
      <Section title="Elevated Buttons" subtitle="With shadow elevation" index={4}>
        <View style={styles.buttonRow}>
          <Button variant="elevated" onPress={() => {}}>
            Elevated
          </Button>
          <Button variant="elevated" onPress={() => {}} icon={<Ionicons name="star" size={18} color={theme.colors.primary} />}>
            Rate
          </Button>
        </View>
      </Section>

      {/* Button Sizes */}
      <Section title="Button Sizes" subtitle="Small to large" index={5}>
        <View style={styles.buttonColumn}>
          <Button variant="filled" onPress={() => {}} size="small">
            Small Button
          </Button>
          <Button variant="filled" onPress={() => {}} size="medium">
            Medium Button
          </Button>
          <Button variant="filled" onPress={() => {}} size="large">
            Large Button
          </Button>
        </View>
      </Section>

      {/* Interactive Example */}
      <Section title="Interactive Demo" subtitle="Try the buttons" index={6}>
        <View style={[styles.interactiveCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons name="hand-left" size={28} color={theme.colors.onPrimaryContainer} />
          <Text variant="bodyLarge" style={{ color: theme.colors.onPrimaryContainer, marginTop: 12, textAlign: 'center', fontWeight: '500' }}>
            All buttons have haptic feedback and ripple effects on press
          </Text>
          <View style={styles.buttonRow}>
            <Button variant="filled" onPress={() => {}}>
              Try Me!
            </Button>
          </View>
        </View>
      </Section>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  buttonColumn: {
    gap: 16,
    alignItems: 'flex-start',
  },
  interactiveCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: -8,
  },
});
