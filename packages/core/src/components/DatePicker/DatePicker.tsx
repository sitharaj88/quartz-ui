/**
 * Quartz UI - Date Picker Component
 * 
 * Date Picker with modal and docked variants
 * Supports single date selection with calendar and input modes
 * 
 * Anatomy:
 * 1. Headline
 * 2. Supporting text
 * 3. Container
 * 4. Icon button (edit/calendar toggle)
 * 5. Previous/next month buttons
 * 6. Day of week labels
 * 7. Today's date
 * 8. Unselected date
 * 9. Text buttons (Cancel/OK)
 * 10. Selected date
 * 11. Menu button (month/year)
 * 12. Divider
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Divider } from '../Divider';

// Date utilities
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export type DatePickerMode = 'calendar' | 'input' | 'year';

export interface DatePickerProps {
  /** Whether the picker is visible */
  visible: boolean;
  /** Currently selected date */
  value?: Date;
  /** Callback when date is selected */
  onChange?: (date: Date) => void;
  /** Callback when picker is dismissed */
  onDismiss?: () => void;
  /** Callback when date is confirmed */
  onConfirm?: (date: Date) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Title/headline shown in the header */
  headline?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Initial mode */
  initialMode?: DatePickerMode;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

interface CalendarDayProps {
  day: number | null;
  date: Date | null;
  selected: boolean;
  today: boolean;
  disabled: boolean;
  onPress: () => void;
}

/**
 * Calendar Day Component
 */
function CalendarDay({
  day,
  selected,
  today,
  disabled,
  onPress,
}: CalendarDayProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!disabled && day) {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    }
  }, [disabled, day, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (day === null) {
    return <View style={styles.dayCell} />;
  }

  const backgroundColor = selected
    ? theme.colors.primary
    : 'transparent';

  const textColor = selected
    ? theme.colors.onPrimary
    : today
    ? theme.colors.primary
    : disabled
    ? theme.colors.onSurface + '38'
    : theme.colors.onSurface;

  return (
    <Animated.View style={[styles.dayCell, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.dayButton,
          {
            backgroundColor,
            borderWidth: today && !selected ? 1 : 0,
            borderColor: theme.colors.primary,
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        accessibilityLabel={`Day ${day}`}
      >
        <Text
          variant="bodyMedium"
          style={{ color: textColor, fontWeight: selected || today ? '500' : '400' }}
        >
          {day}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Year Selector Component
 */
function YearSelector({
  selectedYear,
  minYear,
  maxYear,
  onYearSelect,
}: {
  selectedYear: number;
  minYear: number;
  maxYear: number;
  onYearSelect: (year: number) => void;
}) {
  const theme = useTheme();
  const years = useMemo(() => {
    const result = [];
    for (let y = maxYear; y >= minYear; y--) {
      result.push(y);
    }
    return result;
  }, [minYear, maxYear]);

  return (
    <ScrollView 
      style={styles.yearScrollView}
      contentContainerStyle={styles.yearGrid}
      showsVerticalScrollIndicator={false}
    >
      {years.map((year) => {
        const isSelected = year === selectedYear;
        return (
          <Pressable
            key={year}
            onPress={() => onYearSelect(year)}
            style={[
              styles.yearItem,
              {
                backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                borderRadius: 16,
              },
            ]}
          >
            <Text
              variant="bodyLarge"
              style={{
                color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface,
                fontWeight: isSelected ? '500' : '400',
              }}
            >
              {year}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/**
 * Date Input Component
 */
function DateInputView({
  value,
  onDateChange,
  minDate,
  maxDate,
}: {
  value: Date | null;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(
    value ? `${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getDate().toString().padStart(2, '0')}/${value.getFullYear()}` : ''
  );
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setError(null);

    // Try to parse date (MM/DD/YYYY format)
    const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const month = parseInt(match[1], 10) - 1;
      const day = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      
      const date = new Date(year, month, day);
      
      // Validate date
      if (date.getMonth() !== month || date.getDate() !== day) {
        setError('Invalid date');
        return;
      }
      
      if (minDate && date < minDate) {
        setError('Date is too early');
        return;
      }
      
      if (maxDate && date > maxDate) {
        setError('Date is too late');
        return;
      }
      
      onDateChange(date);
    }
  };

  return (
    <View style={styles.dateInputContainer}>
      <View style={[styles.dateInputWrapper, { borderColor: error ? theme.colors.error : theme.colors.outline }]}>
        <TextInput
          style={[styles.dateInput, { color: theme.colors.onSurface }]}
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder="MM/DD/YYYY"
          placeholderTextColor={theme.colors.onSurfaceVariant}
          keyboardType="number-pad"
          maxLength={10}
        />
      </View>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
        Date
      </Text>
      {error && (
        <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

/**
 * Date Picker Component
 */
export function DatePicker({
  visible,
  value,
  onChange,
  onDismiss,
  onConfirm,
  minDate,
  maxDate,
  headline = 'Select date',
  cancelLabel = 'Cancel',
  confirmLabel = 'OK',
  initialMode = 'calendar',
  style,
  testID,
}: DatePickerProps): React.ReactElement | null {
  const theme = useTheme();
  const today = useMemo(() => new Date(), []);
  
  // Internal state
  const [viewDate, setViewDate] = useState(() => value || today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [mode, setMode] = useState<DatePickerMode>(initialMode);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Min/max years for year selector
  const minYear = minDate?.getFullYear() || today.getFullYear() - 100;
  const maxYear = maxDate?.getFullYear() || today.getFullYear() + 50;

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [firstDay, daysInMonth]);

  const isDateDisabled = useCallback((date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }, [minDate, maxDate]);

  const handlePreviousMonth = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleDayPress = useCallback((day: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    onChange?.(newDate);
  }, [year, month, onChange]);

  const handleYearSelect = useCallback((selectedYear: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setViewDate(new Date(selectedYear, month, 1));
    setMode('calendar');
  }, [month]);

  const handleConfirm = useCallback(() => {
    if (selectedDate) {
      onConfirm?.(selectedDate);
    }
    onDismiss?.();
  }, [selectedDate, onConfirm, onDismiss]);

  const handleCancel = useCallback(() => {
    setSelectedDate(value || null);
    onDismiss?.();
  }, [value, onDismiss]);

  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'calendar' ? 'input' : 'calendar');
  }, []);

  // Format selected date for header display
  const formattedDate = selectedDate
    ? `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][selectedDate.getDay()]}, ${SHORT_MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`
    : 'No date selected';

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={handleCancel}
      testID={testID}
    >
      <Pressable
        style={[styles.overlay, { backgroundColor: theme.colors.scrim + '52' }]}
        onPress={handleCancel}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={[
              styles.container,
              { backgroundColor: theme.colors.surfaceContainerHigh },
              style,
            ]}
          >
              {/* Header */}
              <View style={styles.header}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {headline}
                </Text>
                <View style={styles.headerRow}>
                  <Text variant="headlineLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
                    {formattedDate}
                  </Text>
                  <IconButton
                    icon={
                      <Text style={{ fontSize: 20 }}>
                        {mode === 'calendar' ? '✏️' : '📅'}
                      </Text>
                    }
                    onPress={toggleMode}
                    accessibilityLabel={mode === 'calendar' ? 'Switch to keyboard input' : 'Switch to calendar'}
                  />
                </View>
              </View>

              <Divider />

              {mode === 'calendar' && (
                <>
                  {/* Month Navigation */}
                  <View style={styles.monthNav}>
                    <Pressable
                      onPress={() => setMode('year')}
                      style={styles.monthYearButton}
                    >
                      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                        {MONTHS[month]} {year}
                      </Text>
                      <Text style={{ fontSize: 16, marginStart: 4 }}>▾</Text>
                    </Pressable>
                    <View style={styles.navButtons}>
                      <IconButton
                        icon={<Text style={{ fontSize: 20, color: theme.colors.onSurfaceVariant }}>‹</Text>}
                        onPress={handlePreviousMonth}
                        accessibilityLabel="Previous month"
                      />
                      <IconButton
                        icon={<Text style={{ fontSize: 20, color: theme.colors.onSurfaceVariant }}>›</Text>}
                        onPress={handleNextMonth}
                        accessibilityLabel="Next month"
                      />
                    </View>
                  </View>

                  {/* Day Labels */}
                  <View style={styles.dayLabels}>
                    {DAYS.map((day, index) => (
                      <View key={index} style={styles.dayLabelCell}>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurface }}
                        >
                          {day}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <View style={styles.calendarGrid}>
                    {calendarDays.map((day, index) => {
                      const date = day ? new Date(year, month, day) : null;
                      const isSelected = selectedDate && date ? isSameDay(selectedDate, date) : false;
                      const isToday = date ? isSameDay(today, date) : false;
                      const isDisabled = date ? isDateDisabled(date) : true;

                      return (
                        <CalendarDay
                          key={index}
                          day={day}
                          date={date}
                          selected={isSelected}
                          today={isToday}
                          disabled={isDisabled}
                          onPress={() => day && handleDayPress(day)}
                        />
                      );
                    })}
                  </View>
                </>
              )}

              {mode === 'year' && (
                <YearSelector
                  selectedYear={year}
                  minYear={minYear}
                  maxYear={maxYear}
                  onYearSelect={handleYearSelect}
                />
              )}

              {mode === 'input' && (
                <DateInputView
                  value={selectedDate}
                  onDateChange={(date) => {
                    setSelectedDate(date);
                    onChange?.(date);
                  }}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              )}

              <Divider />

              {/* Actions */}
              <View style={styles.actions}>
                <Button variant="text" onPress={handleCancel}>
                  {cancelLabel}
                </Button>
                <Button variant="text" onPress={handleConfirm} disabled={!selectedDate}>
                  {confirmLabel}
                </Button>
              </View>
            </View>
          </Pressable>
        </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: 328,
    borderRadius: 28,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  monthYearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navButtons: {
    flexDirection: 'row',
  },
  dayLabels: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  dayLabelCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearScrollView: {
    height: 280,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 12,
  },
  yearItem: {
    width: 88,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  dateInputContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  dateInputWrapper: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateInput: {
    fontSize: 16,
    height: 40,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    gap: 8,
  },
});

export default DatePicker;
