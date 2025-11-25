/**
 * Quartz UI Demo - Pickers Demo
 * 
 * Demonstrates Date Picker and Time Picker components
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Button, 
  Surface, 
  DatePicker, 
  TimePicker,
  useTheme,
  Divider,
} from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function PickersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Date Picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Time Picker state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<{ hours: number; minutes: number } | undefined>();

  // Time Picker 24h state
  const [showTimePicker24, setShowTimePicker24] = useState(false);
  const [selectedTime24, setSelectedTime24] = useState<{ hours: number; minutes: number } | undefined>();

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No date selected';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: { hours: number; minutes: number } | undefined, use24Hour = false) => {
    if (!time) return 'No time selected';
    if (use24Hour) {
      return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
    }
    const period = time.hours >= 12 ? 'PM' : 'AM';
    const hours = time.hours % 12 || 12;
    return `${hours}:${time.minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Surface style={[styles.header, { paddingTop: insets.top }]} elevation={0}>
        <View style={styles.headerContent}>
          <Button
            variant="text"
            onPress={() => router.back()}
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />}
          >
            Back
          </Button>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
            Pickers
          </Text>
          <View style={{ width: 80 }} />
        </View>
      </Surface>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Picker Section */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Date Picker
        </Text>
        <Text variant="bodySmall" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Select dates with a calendar interface
        </Text>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.pickerRow}>
            <View style={styles.pickerInfo}>
              <Ionicons name="calendar" size={24} color={theme.colors.primary} />
              <View style={styles.pickerText}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
                  Selected Date
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {formatDate(selectedDate)}
                </Text>
              </View>
            </View>
            <Button variant="tonal" onPress={() => setShowDatePicker(true)}>
              Select
            </Button>
          </View>
        </Surface>

        <Divider style={styles.divider} />

        {/* Time Picker Section */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Time Picker (12-hour)
        </Text>
        <Text variant="bodySmall" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Select time with AM/PM format
        </Text>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.pickerRow}>
            <View style={styles.pickerInfo}>
              <Ionicons name="time" size={24} color={theme.colors.secondary} />
              <View style={styles.pickerText}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
                  Selected Time
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {formatTime(selectedTime)}
                </Text>
              </View>
            </View>
            <Button variant="tonal" onPress={() => setShowTimePicker(true)}>
              Select
            </Button>
          </View>
        </Surface>

        <Divider style={styles.divider} />

        {/* Time Picker 24h Section */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Time Picker (24-hour)
        </Text>
        <Text variant="bodySmall" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Select time in 24-hour format
        </Text>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.pickerRow}>
            <View style={styles.pickerInfo}>
              <Ionicons name="time-outline" size={24} color={theme.colors.tertiary} />
              <View style={styles.pickerText}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
                  Selected Time (24h)
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {formatTime(selectedTime24, true)}
                </Text>
              </View>
            </View>
            <Button variant="tonal" onPress={() => setShowTimePicker24(true)}>
              Select
            </Button>
          </View>
        </Surface>

        {/* Features List */}
        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Features
        </Text>
        
        <Surface style={styles.featureCard} elevation={1}>
          {[
            { icon: 'calendar-outline', text: 'Calendar view with month navigation' },
            { icon: 'today-outline', text: 'Today highlighting' },
            { icon: 'list-outline', text: 'Year selector grid view' },
            { icon: 'create-outline', text: 'Toggle between calendar and input modes' },
            { icon: 'ban-outline', text: 'Min/Max date constraints' },
            { icon: 'time-outline', text: 'Clock dial with draggable selector' },
            { icon: 'keypad-outline', text: 'Keyboard input mode' },
            { icon: 'sunny-outline', text: '12-hour and 24-hour formats' },
            { icon: 'hand-left-outline', text: 'Touch-friendly interface' },
            { icon: 'accessibility-outline', text: 'Full accessibility support' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name={feature.icon as any} size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginStart: 12 }}>
                {feature.text}
              </Text>
            </View>
          ))}
        </Surface>
      </ScrollView>

      {/* Date Picker Modal */}
      <DatePicker
        visible={showDatePicker}
        value={selectedDate}
        onChange={setSelectedDate}
        onDismiss={() => setShowDatePicker(false)}
        onConfirm={(date: Date) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
        headline="Select a date"
      />

      {/* Time Picker Modal (12-hour) */}
      <TimePicker
        visible={showTimePicker}
        value={selectedTime}
        onChange={setSelectedTime}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={(time: { hours: number; minutes: number }) => {
          setSelectedTime(time);
          setShowTimePicker(false);
        }}
        headline="Select time"
      />

      {/* Time Picker Modal (24-hour) */}
      <TimePicker
        visible={showTimePicker24}
        value={selectedTime24}
        onChange={setSelectedTime24}
        onDismiss={() => setShowTimePicker24(false)}
        onConfirm={(time: { hours: number; minutes: number }) => {
          setSelectedTime24(time);
          setShowTimePicker24(false);
        }}
        use24Hour
        headline="Select time (24h)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerText: {
    marginStart: 16,
    flex: 1,
  },
  divider: {
    marginVertical: 24,
  },
  featureCard: {
    padding: 16,
    borderRadius: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
