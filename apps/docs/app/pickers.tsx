import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, DatePicker, TimePicker, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const datePickerProps: PropDefinition[] = [
    {
        name: 'visible',
        type: 'boolean',
        required: true,
        description: 'Whether the picker is visible',
    },
    {
        name: 'value',
        type: 'Date',
        description: 'Currently selected date',
    },
    {
        name: 'onChange',
        type: '(date: Date) => void',
        description: 'Callback when date is selected',
    },
    {
        name: 'onDismiss',
        type: '() => void',
        description: 'Callback when picker is dismissed',
    },
    {
        name: 'onConfirm',
        type: '(date: Date) => void',
        description: 'Callback when date is confirmed',
    },
    {
        name: 'minDate',
        type: 'Date',
        description: 'Minimum selectable date',
    },
    {
        name: 'maxDate',
        type: 'Date',
        description: 'Maximum selectable date',
    },
    {
        name: 'headline',
        type: 'string',
        description: 'Title shown in the header',
    },
    {
        name: 'cancelLabel',
        type: 'string',
        description: 'Cancel button label',
    },
    {
        name: 'confirmLabel',
        type: 'string',
        description: 'Confirm button label',
    },
    {
        name: 'initialMode',
        type: "'calendar' | 'input' | 'year'",
        default: "'calendar'",
        description: 'Initial picker mode',
    },
    {
        name: 'style',
        type: 'StyleProp<ViewStyle>',
        description: 'Style override',
    },
];

const timePickerProps: PropDefinition[] = [
    {
        name: 'visible',
        type: 'boolean',
        required: true,
        description: 'Whether the picker is visible',
    },
    {
        name: 'value',
        type: '{ hours: number; minutes: number }',
        description: 'Current time value',
    },
    {
        name: 'onChange',
        type: '(time: { hours: number; minutes: number }) => void',
        description: 'Callback when time changes',
    },
    {
        name: 'onDismiss',
        type: '() => void',
        description: 'Callback when picker is dismissed',
    },
    {
        name: 'onConfirm',
        type: '(time: { hours: number; minutes: number }) => void',
        description: 'Callback when time is confirmed',
    },
    {
        name: 'use24Hour',
        type: 'boolean',
        default: 'false',
        description: 'Use 24-hour format',
    },
    {
        name: 'headline',
        type: 'string',
        description: 'Title shown in the header',
    },
    {
        name: 'cancelLabel',
        type: 'string',
        description: 'Cancel button label',
    },
    {
        name: 'confirmLabel',
        type: 'string',
        description: 'Confirm button label',
    },
    {
        name: 'style',
        type: 'StyleProp<ViewStyle>',
        description: 'Style override',
    },
];

export default function PickersDocPage() {
    const theme = useTheme();

    // DatePicker state
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // TimePicker state
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState({ hours: 10, minutes: 30 });

    // 24-hour TimePicker state
    const [time24PickerVisible, setTime24PickerVisible] = useState(false);
    const [time24, setTime24] = useState({ hours: 14, minutes: 45 });

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (time: { hours: number; minutes: number }, use24 = false) => {
        const date = new Date();
        date.setHours(time.hours, time.minutes);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: !use24
        });
    };

    return (
        <DocLayout
            title="Date & Time Pickers"
            description="Components for selecting dates and times with various input modes"
        >
            {/* Date Picker Section */}
            <Animated.View entering={FadeInDown.delay(100).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Date Picker
                </Text>
                <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Date pickers let users select a date using a calendar interface. They support
                    calendar, input, and year selection modes.
                </Text>
            </Animated.View>

            {/* Basic Date Picker */}
            <Animated.View entering={FadeInDown.delay(200).springify()}>
                <CodePlayground
                    title="Basic Date Picker"
                    description="Calendar dialog for date selection"
                    code={`const [visible, setVisible] = useState(false);
const [date, setDate] = useState(new Date());

<Button onPress={() => setVisible(true)}>
  Select Date: {formatDate(date)}
</Button>

<DatePicker
  visible={visible}
  value={date}
  onChange={setDate}
  onDismiss={() => setVisible(false)}
  onConfirm={(d) => {
    setDate(d);
    setVisible(false);
  }}
  headline="Select date"
/>`}
                    preview={
                        <View style={styles.pickerDemo}>
                            <Button
                                onPress={() => setDatePickerVisible(true)}
                                variant="outlined"
                            >
                                Select Date: {formatDate(selectedDate)}
                            </Button>
                            <DatePicker
                                visible={datePickerVisible}
                                value={selectedDate}
                                onChange={setSelectedDate}
                                onDismiss={() => setDatePickerVisible(false)}
                                onConfirm={(d) => {
                                    setSelectedDate(d);
                                    setDatePickerVisible(false);
                                }}
                                headline="Select date"
                            />
                        </View>
                    }
                />
            </Animated.View>

            {/* Date Picker Props */}
            <Animated.View entering={FadeInDown.delay(300).springify()}>
                <PropsTable
                    title="DatePicker"
                    props={datePickerProps}
                />
            </Animated.View>

            {/* Time Picker Section */}
            <Animated.View entering={FadeInDown.delay(400).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 48 }]}>
                    Time Picker
                </Text>
                <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Time pickers help users select and set a specific time. They support both dial
                    and keyboard input modes for accessibility.
                </Text>
            </Animated.View>

            {/* Basic Time Picker */}
            <Animated.View entering={FadeInDown.delay(500).springify()}>
                <CodePlayground
                    title="Basic Time Picker (12-hour)"
                    description="Clock dial for time selection with AM/PM"
                    code={`const [visible, setVisible] = useState(false);
const [time, setTime] = useState({ hours: 10, minutes: 30 });

<Button onPress={() => setVisible(true)}>
  Select Time: {formatTime(time)}
</Button>

<TimePicker
  visible={visible}
  value={time}
  onChange={setTime}
  onDismiss={() => setVisible(false)}
  onConfirm={(t) => {
    setTime(t);
    setVisible(false);
  }}
  headline="Select time"
/>`}
                    preview={
                        <View style={styles.pickerDemo}>
                            <Button
                                onPress={() => setTimePickerVisible(true)}
                                variant="outlined"
                            >
                                Select Time: {formatTime(selectedTime)}
                            </Button>
                            <TimePicker
                                visible={timePickerVisible}
                                value={selectedTime}
                                onChange={setSelectedTime}
                                onDismiss={() => setTimePickerVisible(false)}
                                onConfirm={(t) => {
                                    setSelectedTime(t);
                                    setTimePickerVisible(false);
                                }}
                                headline="Select time"
                            />
                        </View>
                    }
                />
            </Animated.View>

            {/* 24-Hour Time Picker */}
            <Animated.View entering={FadeInDown.delay(600).springify()}>
                <CodePlayground
                    title="24-Hour Time Picker"
                    description="Clock dial with 24-hour format"
                    code={`<TimePicker
  visible={visible}
  value={time}
  onChange={setTime}
  onDismiss={() => setVisible(false)}
  onConfirm={(t) => {
    setTime(t);
    setVisible(false);
  }}
  use24Hour={true}
  headline="Select time"
/>`}
                    preview={
                        <View style={styles.pickerDemo}>
                            <Button
                                onPress={() => setTime24PickerVisible(true)}
                                variant="outlined"
                            >
                                Select Time (24h): {formatTime(time24, true)}
                            </Button>
                            <TimePicker
                                visible={time24PickerVisible}
                                value={time24}
                                onChange={setTime24}
                                onDismiss={() => setTime24PickerVisible(false)}
                                onConfirm={(t) => {
                                    setTime24(t);
                                    setTime24PickerVisible(false);
                                }}
                                use24Hour={true}
                                headline="Select time"
                            />
                        </View>
                    }
                />
            </Animated.View>

            {/* Time Picker Props */}
            <Animated.View entering={FadeInDown.delay(700).springify()}>
                <PropsTable
                    title="TimePicker"
                    props={timePickerProps}
                />
            </Animated.View>

            {/* Guidelines Section */}
            <Animated.View entering={FadeInDown.delay(800).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 48 }]}>
                    Usage Guidelines
                </Text>

                <View style={[styles.guidelineCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
                        When to Use
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        • <Text style={{ fontWeight: '600' }}>Date Picker:</Text> For selecting specific dates
                        like birthdays, appointments, or deadlines
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        • <Text style={{ fontWeight: '600' }}>Time Picker:</Text> For selecting specific times
                        for scheduling, alarms, or time-based events
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        • <Text style={{ fontWeight: '600' }}>Combined:</Text> Use both together for
                        date-time selections in forms
                    </Text>
                </View>

                <View style={[styles.guidelineCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
                        Accessibility
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        • Both pickers support keyboard input mode for users who prefer typing
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        • Clear headlines help screen reader users understand the context
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        • Cancel and confirm actions are clearly labeled
                    </Text>
                </View>
            </Animated.View>
        </DocLayout>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        marginBottom: 8,
        marginTop: 24,
    },
    sectionDescription: {
        marginBottom: 24,
    },
    pickerDemo: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 16,
    },
    guidelineCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
});
