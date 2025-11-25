/**
 * Quartz UI - Segmented Button Component
 * 
 * Segmented Buttons:
 * - Single select
 * - Multi select
 */

import React, { useCallback } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeProvider';
import { springConfig } from '../../tokens/motion';
import { Text } from '../Text';

export interface SegmentedButtonSegment {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedButtonProps {
  /** Button segments */
  segments: SegmentedButtonSegment[];
  /** Selected value(s) */
  value: string | string[];
  /** Callback when selection changes */
  onValueChange: (value: string | string[]) => void;
  /** Whether to allow multiple selection */
  multiSelect?: boolean;
  /** Whether the entire button group is disabled */
  disabled?: boolean;
  /** Density (affects sizing) */
  density?: 'default' | 'comfortable' | 'compact';
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const DENSITIES = {
  default: { height: 40, paddingHorizontal: 12 },
  comfortable: { height: 36, paddingHorizontal: 10 },
  compact: { height: 32, paddingHorizontal: 8 },
};

export function SegmentedButton({
  segments,
  value,
  onValueChange,
  multiSelect = false,
  disabled = false,
  density = 'default',
  style,
  testID,
}: SegmentedButtonProps) {
  const theme = useTheme();
  const selectedValues = Array.isArray(value) ? value : [value];
  const densityConfig = DENSITIES[density];
  
  const handleSelect = useCallback((segmentValue: string) => {
    if (theme.accessibility.hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (multiSelect) {
      const newValues = selectedValues.includes(segmentValue)
        ? selectedValues.filter(v => v !== segmentValue)
        : [...selectedValues, segmentValue];
      onValueChange(newValues);
    } else {
      onValueChange(segmentValue);
    }
  }, [multiSelect, selectedValues, onValueChange, theme.accessibility.hapticFeedback]);
  
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.outline,
          height: densityConfig.height,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      testID={testID}
      accessibilityRole="tablist"
    >
      {segments.map((segment, index) => (
        <SegmentButton
          key={segment.value}
          segment={segment}
          selected={selectedValues.includes(segment.value)}
          onPress={handleSelect}
          disabled={disabled || !!segment.disabled}
          density={density}
          isFirst={index === 0}
          isLast={index === segments.length - 1}
          showIcon={!!segment.icon}
          showCheck={selectedValues.includes(segment.value)}
        />
      ))}
    </View>
  );
}

interface SegmentButtonProps {
  segment: SegmentedButtonSegment;
  selected: boolean;
  onPress: (value: string) => void;
  disabled: boolean;
  density: 'default' | 'comfortable' | 'compact';
  isFirst: boolean;
  isLast: boolean;
  showIcon: boolean;
  showCheck: boolean;
}

function SegmentButton({
  segment,
  selected,
  onPress,
  disabled,
  density,
  isFirst,
  isLast,
  showIcon,
  showCheck,
}: SegmentButtonProps) {
  const theme = useTheme();
  const densityConfig = DENSITIES[density];
  
  const scale = useSharedValue(1);
  const fillOpacity = useSharedValue(selected ? 1 : 0);
  
  React.useEffect(() => {
    fillOpacity.value = withTiming(selected ? 1 : 0, { duration: 150 });
  }, [selected, fillOpacity]);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig.stiff);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig.gentle);
  };
  
  const fillStyle = useAnimatedStyle(() => ({
    opacity: fillOpacity.value,
  }));
  
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Pressable
      onPress={() => onPress(segment.value)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={styles.segmentPressable}
      accessibilityRole="tab"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={segment.label}
    >
      <AnimatedView
        style={[
          styles.segment,
          {
            borderLeftWidth: !isFirst ? 1 : 0,
            borderColor: theme.colors.outline,
            paddingHorizontal: densityConfig.paddingHorizontal,
            borderTopLeftRadius: isFirst ? 20 : 0,
            borderBottomLeftRadius: isFirst ? 20 : 0,
            borderTopRightRadius: isLast ? 20 : 0,
            borderBottomRightRadius: isLast ? 20 : 0,
          },
          containerStyle,
        ]}
      >
        {/* Selected fill */}
        <AnimatedView
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: theme.colors.secondaryContainer,
              borderTopLeftRadius: isFirst ? 20 : 0,
              borderBottomLeftRadius: isFirst ? 20 : 0,
              borderTopRightRadius: isLast ? 20 : 0,
              borderBottomRightRadius: isLast ? 20 : 0,
            },
            fillStyle,
          ]}
        />
        
        {/* Content */}
        <View style={styles.content}>
          {/* Checkmark for selected state */}
          {showCheck && (
            <View style={styles.checkmark}>
              <View
                style={[
                  styles.checkShort,
                  { backgroundColor: theme.colors.onSecondaryContainer },
                ]}
              />
              <View
                style={[
                  styles.checkLong,
                  { backgroundColor: theme.colors.onSecondaryContainer },
                ]}
              />
            </View>
          )}
          
          {/* Icon (when not showing check) */}
          {!showCheck && showIcon && segment.icon && (
            <View style={styles.icon}>
              {segment.icon}
            </View>
          )}
          
          {/* Label */}
          {segment.label && (
            <Text
              variant="labelLarge"
              style={[
                styles.label,
                {
                  color: selected
                    ? theme.colors.onSecondaryContainer
                    : theme.colors.onSurface,
                },
              ]}
            >
              {segment.label}
            </Text>
          )}
        </View>
      </AnimatedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  segmentPressable: {
    flex: 1,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkmark: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkShort: {
    position: 'absolute',
    width: 5,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }, { translateX: -3 }, { translateY: 2 }],
  },
  checkLong: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }, { translateX: 1 }, { translateY: 0 }],
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {},
});

export default SegmentedButton;
