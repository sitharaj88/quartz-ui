/**
 * Quartz UI - Time Picker Component
 * 
 * Time Picker with dial and input modes
 * 
 * Anatomy - Dial:
 * 1. Headline
 * 2. Time selector separator
 * 3. Container
 * 4. Period selector container
 * 5. Period selector label text
 * 6. Clock dial selector center
 * 7. Clock dial selector track
 * 8. Text button
 * 9. Icon button (keyboard/clock toggle)
 * 10. Clock dial selector container (handle)
 * 11. Clock dial label text
 * 12. Clock dial container
 * 13. Time selector label text
 * 14. Time selector container
 * 
 * MD3 Measurements:
 * - Container: Dynamic width/height, 24dp padding
 * - Time selector: 96x80dp (114x80 for 24h)
 * - Period selector: 52x80dp (vertical), 216x38dp (horizontal)
 * - Clock dial: 256dp diameter
 * - Clock dial selector handle: 48dp
 * - Clock dial selector center: 8dp
 * - Clock dial selector track: 2dp width
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  Modal,
  TextInput,
  Platform,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import Animated, {
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { Button } from '../Button';
import { IconButton } from '../IconButton';

export interface TimePickerProps {
  /** Whether the picker is visible */
  visible: boolean;
  /** Current time value */
  value?: { hours: number; minutes: number };
  /** Callback when time changes */
  onChange?: (time: { hours: number; minutes: number }) => void;
  /** Callback when picker is dismissed */
  onDismiss?: () => void;
  /** Callback when time is confirmed */
  onConfirm?: (time: { hours: number; minutes: number }) => void;
  /** Whether to use 24-hour format */
  use24Hour?: boolean;
  /** Title shown in the header */
  headline?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

type Period = 'AM' | 'PM';
type InputMode = 'dial' | 'input';
type SelectionMode = 'hours' | 'minutes';

// MD3 Clock dial size
const CLOCK_SIZE = 256;
const CLOCK_RADIUS = CLOCK_SIZE / 2;
const CLOCK_INNER_RADIUS = 85; // For 24-hour inner ring
const CLOCK_OUTER_RADIUS = 108;
const SELECTOR_SIZE = 48;
const CENTER_SIZE = 8;

/**
 * Clock Dial Component
 */
function ClockDial({
  values,
  innerValues,
  selectedValue,
  selectionMode,
  onValueChange,
  onDragEnd,
}: {
  values: number[];
  innerValues?: number[];
  selectedValue: number;
  selectionMode: SelectionMode;
  onValueChange: (value: number, fromDrag?: boolean) => void;
  onDragEnd?: () => void;
}) {
  const theme = useTheme();
  const clockRef = useRef<View>(null);
  const isDragging = useRef(false);
  const lastValue = useRef(selectedValue);
  
  // Update lastValue ref when selectedValue changes (e.g., switching modes)
  React.useEffect(() => {
    lastValue.current = selectedValue;
  }, [selectedValue, selectionMode]);
  
  // Calculate angle for the selector line
  const getAngle = useCallback((value: number, isInner: boolean = false) => {
    if (selectionMode === 'hours') {
      if (innerValues && innerValues.includes(value)) {
        // 24-hour inner ring (12-23 or 0)
        return ((value % 12) * 30) - 90;
      }
      return (value * 30) - 90;
    }
    return (value * 6) - 90;
  }, [selectionMode, innerValues]);

  const isInnerValue = innerValues?.includes(selectedValue);
  const selectorRadius = isInnerValue ? CLOCK_INNER_RADIUS : CLOCK_OUTER_RADIUS;
  const selectorAngle = getAngle(selectedValue, isInnerValue);
  const selectorX = Math.cos((selectorAngle * Math.PI) / 180) * selectorRadius;
  const selectorY = Math.sin((selectorAngle * Math.PI) / 180) * selectorRadius;

  // Calculate value from touch position
  const calculateValueFromTouch = useCallback((x: number, y: number): number | null => {
    const centerX = CLOCK_RADIUS;
    const centerY = CLOCK_RADIUS;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Ignore touches too far outside the clock face
    if (distance > CLOCK_RADIUS + 20 || distance < 20) return null;
    
    // Calculate angle (0° at 12 o'clock, increasing clockwise)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    if (selectionMode === 'hours') {
      const isInner = innerValues && distance < 75;
      let hour = Math.round(angle / 30) % 12;
      
      if (innerValues) {
        // 24-hour mode
        if (isInner) {
          hour = hour === 0 ? 0 : hour + 12;
          if (hour === 12) hour = 0;
        } else {
          if (hour === 0) hour = 12;
        }
      } else {
        // 12-hour mode
        if (hour === 0) hour = 12;
      }
      
      return hour;
    } else {
      // Minutes - allow any minute selection
      return Math.round(angle / 6) % 60;
    }
  }, [selectionMode, innerValues]);

  // Create panResponder with current callbacks
  const panResponder = useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        isDragging.current = false;
        const { locationX, locationY } = evt.nativeEvent;
        const newValue = calculateValueFromTouch(locationX, locationY);
        if (newValue !== null && newValue !== lastValue.current) {
          lastValue.current = newValue;
          onValueChange(newValue, false);
          if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
          }
        }
      },
      onPanResponderMove: (evt) => {
        isDragging.current = true;
        const { locationX, locationY } = evt.nativeEvent;
        const newValue = calculateValueFromTouch(locationX, locationY);
        if (newValue !== null && newValue !== lastValue.current) {
          lastValue.current = newValue;
          onValueChange(newValue, true);
          if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
          }
        }
      },
      onPanResponderRelease: () => {
        // When gesture ends, notify parent
        onDragEnd?.();
        isDragging.current = false;
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
      },
    }), [calculateValueFromTouch, onValueChange, onDragEnd]
  );

  // Calculate the midpoint between center and selector position for track positioning
  const trackCenterX = selectorX / 2;
  const trackCenterY = selectorY / 2;

  return (
    <View
      ref={clockRef}
      style={[
        styles.clockFace,
        { backgroundColor: theme.colors.surfaceContainerHighest },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Selector track (line from center to selected) */}
      <View
        style={[
          styles.selectorTrack,
          {
            backgroundColor: theme.colors.primary,
            height: selectorRadius,
            left: CLOCK_RADIUS + trackCenterX - 1,
            top: CLOCK_RADIUS + trackCenterY - selectorRadius / 2,
            transform: [
              { rotate: `${selectorAngle + 90}deg` },
            ],
          },
        ]}
      />
      
      {/* Selector handle */}
      <View
        style={[
          styles.selectorHandle,
          {
            backgroundColor: theme.colors.primary,
            left: CLOCK_RADIUS + selectorX - SELECTOR_SIZE / 2,
            top: CLOCK_RADIUS + selectorY - SELECTOR_SIZE / 2,
          },
        ]}
      />

      {/* Center dot */}
      <View
        style={[
          styles.centerDot,
          { backgroundColor: theme.colors.primary },
        ]}
      />

      {/* Clock numbers with fade animation */}
      <Animated.View 
        key={selectionMode}
        entering={FadeIn.duration(150)}
        style={StyleSheet.absoluteFill}
      >
        {/* Outer ring numbers */}
        {values.map((val, index) => {
          const total = values.length;
          const angle = (index * 360) / total - 90;
          const x = Math.cos((angle * Math.PI) / 180) * CLOCK_OUTER_RADIUS;
          const y = Math.sin((angle * Math.PI) / 180) * CLOCK_OUTER_RADIUS;
          const isSelected = val === selectedValue;

          return (
            <View
              key={`outer-${val}`}
              style={[
                styles.clockNumber,
                {
                  left: CLOCK_RADIUS + x - 20,
                  top: CLOCK_RADIUS + y - 20,
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
                {selectionMode === 'hours' ? val : val.toString().padStart(2, '0')}
              </Text>
            </View>
          );
        })}

        {/* Inner ring numbers (24-hour mode) */}
        {innerValues?.map((val, index) => {
          const total = innerValues.length;
          const angle = (index * 360) / total - 90;
          const x = Math.cos((angle * Math.PI) / 180) * CLOCK_INNER_RADIUS;
          const y = Math.sin((angle * Math.PI) / 180) * CLOCK_INNER_RADIUS;
          const isSelected = val === selectedValue;

          return (
            <View
              key={`inner-${val}`}
              style={[
                styles.clockNumber,
                {
                  left: CLOCK_RADIUS + x - 20,
                  top: CLOCK_RADIUS + y - 20,
                },
            ]}
          >
            <Text
              variant="bodySmall"
              style={{
                color: isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                fontWeight: isSelected ? '500' : '400',
              }}
            >
              {val.toString().padStart(2, '0')}
            </Text>
          </View>
        );
      })}
      </Animated.View>
    </View>
  );
}

/**
 * Time Picker Component
 */
export function TimePicker({
  visible,
  value,
  onChange,
  onDismiss,
  onConfirm,
  use24Hour = false,
  headline = 'Select time',
  cancelLabel = 'Cancel',
  confirmLabel = 'OK',
  style,
  testID,
}: TimePickerProps): React.ReactElement | null {
  const theme = useTheme();

  // Initialize state from value
  const initialHours = value?.hours ?? 12;
  const initialMinutes = value?.minutes ?? 0;
  
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [period, setPeriod] = useState<Period>(initialHours >= 12 ? 'PM' : 'AM');
  const [inputMode, setInputMode] = useState<InputMode>('dial');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('hours');

  // Convert to 12-hour format for display
  const displayHours = useMemo(() => {
    if (use24Hour) return hours;
    if (hours === 0) return 12;
    if (hours > 12) return hours - 12;
    return hours;
  }, [hours, use24Hour]);

  // Format time for display
  const formattedHours = use24Hour 
    ? hours.toString().padStart(2, '0')
    : displayHours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Hour values for dial
  const hourValues = use24Hour
    ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] // Outer ring for 24h
    : [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  
  // Inner ring for 24-hour mode (0, 13-23)
  const innerHourValues = use24Hour
    ? [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    : undefined;

  // Minute values (0-55 in 5-minute increments shown, but any minute selectable)
  const minuteValues = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const handleHoursChange = useCallback((newHours: number, fromDrag?: boolean) => {
    let actualHours = newHours;
    if (!use24Hour) {
      if (period === 'PM' && newHours !== 12) {
        actualHours = newHours + 12;
      } else if (period === 'AM' && newHours === 12) {
        actualHours = 0;
      }
    }
    
    setHours(actualHours);
    onChange?.({ hours: actualHours, minutes });
    
    // Don't auto-advance during drag, only on release (handled by onDragEnd)
  }, [period, use24Hour, minutes, onChange]);

  const handleMinutesChange = useCallback((newMinutes: number, fromDrag?: boolean) => {
    setMinutes(newMinutes);
    onChange?.({ hours, minutes: newMinutes });
  }, [hours, onChange]);

  // Handle when drag gesture ends on the clock
  const handleClockDragEnd = useCallback(() => {
    if (selectionMode === 'hours') {
      // Auto-advance to minutes after releasing on hours
      setTimeout(() => setSelectionMode('minutes'), 200);
    }
  }, [selectionMode]);

  const handlePeriodChange = useCallback((newPeriod: Period) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setPeriod(newPeriod);
    
    let newHours = hours;
    if (newPeriod === 'PM' && hours < 12) {
      newHours = hours + 12;
    } else if (newPeriod === 'AM' && hours >= 12) {
      newHours = hours - 12;
    }
    
    setHours(newHours);
    onChange?.({ hours: newHours, minutes });
  }, [hours, minutes, onChange]);

  const handleConfirm = useCallback(() => {
    onConfirm?.({ hours, minutes });
    onDismiss?.();
  }, [hours, minutes, onConfirm, onDismiss]);

  const handleCancel = useCallback(() => {
    // Reset to original value
    setHours(value?.hours ?? 12);
    setMinutes(value?.minutes ?? 0);
    setPeriod((value?.hours ?? 12) >= 12 ? 'PM' : 'AM');
    setSelectionMode('hours');
    onDismiss?.();
  }, [value, onDismiss]);

  const toggleInputMode = useCallback(() => {
    setInputMode(prev => prev === 'dial' ? 'input' : 'dial');
  }, []);

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
              {/* Header/Headline */}
              <View style={styles.header}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {headline}
                </Text>
              </View>

              {/* Time Display */}
              <View style={styles.timeDisplay}>
                {/* Hours */}
                <View>
                  <Pressable
                    onPress={() => setSelectionMode('hours')}
                    style={[
                      styles.timeBox,
                      use24Hour && styles.timeBox24h,
                      {
                        backgroundColor: selectionMode === 'hours'
                          ? theme.colors.primaryContainer
                          : theme.colors.surfaceContainerHighest,
                      },
                    ]}
                  >
                    {inputMode === 'input' ? (
                      <TextInput
                        style={[
                          styles.timeInput,
                          { color: selectionMode === 'hours' ? theme.colors.onPrimaryContainer : theme.colors.onSurface },
                        ]}
                        value={formattedHours}
                        onChangeText={(text) => {
                          const num = parseInt(text, 10);
                          if (!isNaN(num)) {
                            const max = use24Hour ? 23 : 12;
                            const min = use24Hour ? 0 : 1;
                            if (num >= min && num <= max) {
                              handleHoursChange(num);
                            }
                          }
                        }}
                        keyboardType="number-pad"
                        maxLength={2}
                        selectTextOnFocus
                      />
                    ) : (
                      <Text
                        variant="displayLarge"
                        style={{
                          color: selectionMode === 'hours'
                            ? theme.colors.onPrimaryContainer
                            : theme.colors.onSurface,
                        }}
                      >
                        {formattedHours}
                      </Text>
                    )}
                  </Pressable>
                  <Text 
                    variant="bodySmall" 
                    style={{ 
                      color: theme.colors.onSurfaceVariant, 
                      textAlign: 'center',
                      marginTop: 4,
                    }}
                  >
                    Hour
                  </Text>
                </View>

                {/* Separator */}
                <Text variant="displayLarge" style={{ color: theme.colors.onSurface, marginBottom: 20 }}>
                  :
                </Text>

                {/* Minutes */}
                <View>
                  <Pressable
                    onPress={() => setSelectionMode('minutes')}
                    style={[
                      styles.timeBox,
                      {
                        backgroundColor: selectionMode === 'minutes'
                          ? theme.colors.primaryContainer
                          : theme.colors.surfaceContainerHighest,
                      },
                    ]}
                  >
                    {inputMode === 'input' ? (
                      <TextInput
                        style={[
                          styles.timeInput,
                          { color: selectionMode === 'minutes' ? theme.colors.onPrimaryContainer : theme.colors.onSurface },
                        ]}
                        value={formattedMinutes}
                        onChangeText={(text) => {
                          const num = parseInt(text, 10);
                          if (!isNaN(num) && num >= 0 && num <= 59) {
                            handleMinutesChange(num);
                          }
                        }}
                        keyboardType="number-pad"
                        maxLength={2}
                        selectTextOnFocus
                      />
                    ) : (
                      <Text
                        variant="displayLarge"
                        style={{
                          color: selectionMode === 'minutes'
                            ? theme.colors.onPrimaryContainer
                            : theme.colors.onSurface,
                        }}
                      >
                        {formattedMinutes}
                      </Text>
                    )}
                  </Pressable>
                  <Text 
                    variant="bodySmall" 
                    style={{ 
                      color: theme.colors.onSurfaceVariant, 
                      textAlign: 'center',
                      marginTop: 4,
                    }}
                  >
                    Minute
                  </Text>
                </View>

                {/* AM/PM Toggle (12-hour only) */}
                {!use24Hour && (
                  <View style={styles.periodContainer}>
                    <Pressable
                      onPress={() => handlePeriodChange('AM')}
                      style={[
                        styles.periodButton,
                        styles.periodButtonTop,
                        {
                          backgroundColor: period === 'AM'
                            ? theme.colors.tertiaryContainer
                            : theme.colors.surfaceContainerHighest,
                          borderColor: theme.colors.outline,
                        },
                      ]}
                    >
                      <Text
                        variant="titleMedium"
                        style={{
                          color: period === 'AM'
                            ? theme.colors.onTertiaryContainer
                            : theme.colors.onSurfaceVariant,
                        }}
                      >
                        AM
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handlePeriodChange('PM')}
                      style={[
                        styles.periodButton,
                        styles.periodButtonBottom,
                        {
                          backgroundColor: period === 'PM'
                            ? theme.colors.tertiaryContainer
                            : theme.colors.surfaceContainerHighest,
                          borderColor: theme.colors.outline,
                        },
                      ]}
                    >
                      <Text
                        variant="titleMedium"
                        style={{
                          color: period === 'PM'
                            ? theme.colors.onTertiaryContainer
                            : theme.colors.onSurfaceVariant,
                        }}
                      >
                        PM
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* Clock Face / Input Mode */}
              {inputMode === 'dial' ? (
                <View style={styles.clockContainer}>
                  <ClockDial
                    values={selectionMode === 'hours' ? hourValues : minuteValues}
                    innerValues={selectionMode === 'hours' ? innerHourValues : undefined}
                    selectedValue={selectionMode === 'hours' ? (use24Hour ? hours : displayHours) : minutes}
                    selectionMode={selectionMode}
                    onValueChange={selectionMode === 'hours' ? handleHoursChange : handleMinutesChange}
                    onDragEnd={handleClockDragEnd}
                  />
                </View>
              ) : (
                <View style={styles.inputModeContainer}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Use the fields above to enter time
                  </Text>
                </View>
              )}

              {/* Actions */}
              <View style={styles.actions}>
                <IconButton
                  icon={<Text style={{ fontSize: 20 }}>{inputMode === 'dial' ? '⌨️' : '🕐'}</Text>}
                  onPress={toggleInputMode}
                  accessibilityLabel={inputMode === 'dial' ? 'Switch to keyboard input' : 'Switch to dial'}
                />
                <View style={styles.actionButtons}>
                  <Button variant="text" onPress={handleCancel}>
                    {cancelLabel}
                  </Button>
                  <Button variant="text" onPress={handleConfirm}>
                    {confirmLabel}
                  </Button>
                </View>
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
    paddingTop: 24,
    paddingBottom: 8,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 8,
  },
  timeBox: {
    width: 96,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBox24h: {
    width: 114,
  },
  timeInput: {
    fontSize: 45,
    fontWeight: '400',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  periodContainer: {
    marginStart: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden',
  },
  periodButton: {
    width: 52,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  periodButtonTop: {
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    borderBottomWidth: 0,
  },
  periodButtonBottom: {
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    borderTopWidth: 0,
  },
  clockContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  clockFace: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    borderRadius: CLOCK_RADIUS,
    position: 'relative',
  },
  selectorTrack: {
    position: 'absolute',
    width: 2,
  },
  selectorHandle: {
    position: 'absolute',
    width: SELECTOR_SIZE,
    height: SELECTOR_SIZE,
    borderRadius: SELECTOR_SIZE / 2,
  },
  clockNumber: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDot: {
    position: 'absolute',
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    left: CLOCK_RADIUS - CENTER_SIZE / 2,
    top: CLOCK_RADIUS - CENTER_SIZE / 2,
  },
  inputModeContainer: {
    alignItems: 'center',
    padding: 40,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default TimePicker;
