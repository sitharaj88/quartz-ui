import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, useWindowDimensions, Platform } from 'react-native';
import { Text, Surface, Divider, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export interface PropDefinition {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
}

interface PropsTableProps {
  props: PropDefinition[];
  title?: string;
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'type' | null;

// Type colors helper
const getTypeColors = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('string')) return { bg: '#E3F2FD', text: '#0D47A1', border: '#90CAF9' };
  if (lowerType.includes('number')) return { bg: '#F3E5F5', text: '#4A148C', border: '#CE93D8' };
  if (lowerType.includes('boolean')) return { bg: '#E8F5E9', text: '#1B5E20', border: '#81C784' };
  if (lowerType.includes('function') || lowerType.includes('=>')) return { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' };
  if (lowerType.includes('object') || lowerType.includes('{}')) return { bg: '#FCE4EC', text: '#880E4F', border: '#F48FB1' };
  if (lowerType.includes('array') || lowerType.includes('[]')) return { bg: '#E0F2F1', text: '#004D40', border: '#4DB6AC' };
  return { bg: '#F5F5F5', text: '#424242', border: '#9E9E9E' };
};

// Type icon helper
const getTypeIcon = (type: string): any => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('string')) return 'text';
  if (lowerType.includes('number')) return 'calculator';
  if (lowerType.includes('boolean')) return 'toggle';
  if (lowerType.includes('function') || lowerType.includes('=>')) return 'code-working';
  if (lowerType.includes('object') || lowerType.includes('{}')) return 'cube';
  if (lowerType.includes('array') || lowerType.includes('[]')) return 'list';
  return 'help-circle';
};

// Mobile Card Row Component
function PropCard({
  prop,
  index,
  theme,
  isMobile,
}: {
  prop: PropDefinition;
  index: number;
  theme: any;
  isMobile: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handleCopy = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const typeColors = getTypeColors(prop.type);
  const typeIcon = getTypeIcon(prop.type);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 30).springify().damping(15)}
      style={animatedStyle}
    >
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Surface
          style={[
            styles.propCard,
            {
              backgroundColor: theme.colors.surface,
              minHeight: isMobile ? 140 : 120,
            },
          ]}
          elevation={2}
        >
          {/* Card Header */}
          <View style={[styles.propCardHeader, { paddingBottom: isExpanded ? 16 : 0 }]}>
            <View style={styles.propNameRow}>
              <View style={styles.propNameContent}>
                <Text
                  variant="titleMedium"
                  style={{
                    color: theme.colors.primary,
                    fontWeight: '900',
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                    fontSize: isMobile ? 20 : 18,
                  }}
                >
                  {prop.name}
                </Text>

                {/* Required Badge */}
                {prop.required && (
                  <LinearGradient
                    colors={['#FF6B6B', '#EE5A6F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.requiredBadge, { paddingHorizontal: isMobile ? 12 : 10, paddingVertical: isMobile ? 6 : 5 }]}
                  >
                    <Ionicons name="star" size={isMobile ? 12 : 10} color="#FFFFFF" />
                    <Text style={[styles.requiredText, { fontSize: isMobile ? 11 : 10 }]}>REQUIRED</Text>
                  </LinearGradient>
                )}
              </View>

              {/* Copy Button */}
              <Pressable
                onPress={handleCopy}
                style={[
                  styles.copyButton,
                  {
                    backgroundColor: copied ? '#4CAF50' : theme.colors.primaryContainer,
                    minWidth: isMobile ? 44 : 40,
                    minHeight: isMobile ? 44 : 40,
                  },
                ]}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={isMobile ? 20 : 18}
                  color={copied ? '#FFFFFF' : theme.colors.primary}
                />
              </Pressable>
            </View>

            {/* Type Badge */}
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor: typeColors.bg,
                  borderWidth: 1.5,
                  borderColor: typeColors.border,
                  paddingHorizontal: isMobile ? 16 : 14,
                  paddingVertical: isMobile ? 10 : 9,
                  marginTop: isMobile ? 14 : 12,
                },
              ]}
            >
              <Ionicons name={typeIcon} size={isMobile ? 18 : 16} color={typeColors.text} />
              <Text
                variant="bodyMedium"
                style={{
                  color: typeColors.text,
                  fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                  fontWeight: '800',
                  fontSize: isMobile ? 15 : 14,
                  marginLeft: 8,
                }}
              >
                {prop.type}
              </Text>
            </View>

            {/* Default Value */}
            {prop.default && (
              <View
                style={[
                  styles.defaultBadge,
                  {
                    backgroundColor: theme.colors.secondaryContainer,
                    paddingHorizontal: isMobile ? 16 : 14,
                    paddingVertical: isMobile ? 10 : 8,
                    marginTop: isMobile ? 12 : 10,
                  },
                ]}
              >
                <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer, fontSize: isMobile ? 12 : 11, fontWeight: '700' }}>
                  DEFAULT:
                </Text>
                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.onSecondaryContainer,
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                    fontWeight: '700',
                    marginLeft: 8,
                    fontSize: isMobile ? 14 : 13,
                  }}
                >
                  {prop.default}
                </Text>
              </View>
            )}
          </View>

          {/* Description - Always visible on mobile, expandable on desktop */}
          {(isMobile || isExpanded) && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={[
                styles.propDescription,
                {
                  backgroundColor: theme.colors.primaryContainer + '15',
                  padding: isMobile ? 18 : 16,
                  marginTop: isMobile ? 16 : 12,
                },
              ]}
            >
              <View style={styles.descriptionRow}>
                <Ionicons name="information-circle" size={isMobile ? 20 : 18} color={theme.colors.primary} />
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurface,
                    lineHeight: isMobile ? 26 : 24,
                    fontSize: isMobile ? 16 : 14,
                    flex: 1,
                    marginLeft: 12,
                  }}
                >
                  {prop.description}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Expand indicator for desktop */}
          {!isMobile && (
            <View style={styles.expandIndicator}>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </View>
          )}
        </Surface>
      </Pressable>
    </Animated.View>
  );
}

export function PropsTable({ props, title = 'Props' }: PropsTableProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const isMobile = width < 768;

  // Sort handler
  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((dir) => {
          if (dir === 'asc') return 'desc';
          if (dir === 'desc') {
            setSortField(null);
            return null;
          }
          return 'asc';
        });
      } else {
        setSortDirection('asc');
      }
      return field;
    });
  }, []);

  // Filtered and sorted props
  const processedProps = useMemo(() => {
    let filtered = props;

    // Filter by search
    if (searchQuery) {
      filtered = props.filter((prop) =>
        prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        return aVal < bVal ? -modifier : modifier;
      });
    }

    return filtered;
  }, [props, searchQuery, sortField, sortDirection]);

  return (
    <Animated.View entering={FadeInDown.springify().damping(15)} style={[styles.container, { marginVertical: isMobile ? 32 : 48 }]}>
      {/* Title Section */}
      <View style={[styles.titleContainer, { marginBottom: isMobile ? 32 : 28 }]}>
        <View style={styles.titleRow}>
          <View>
            <Text
              variant="displaySmall"
              style={{
                color: theme.colors.onSurface,
                fontWeight: '900',
                marginBottom: 8,
                fontSize: isMobile ? 36 : 32,
              }}
            >
              {title}
            </Text>
            <LinearGradient
              colors={['#667eea', '#764ba2', '#f093fb', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.titleUnderline, { width: isMobile ? 100 : 120, height: isMobile ? 5 : 6 }]}
            />
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <Surface
              style={[
                styles.statBadge,
                {
                  backgroundColor: theme.colors.primaryContainer,
                  paddingHorizontal: isMobile ? 20 : 16,
                  paddingVertical: isMobile ? 14 : 12,
                  minWidth: isMobile ? 80 : 70,
                },
              ]}
              elevation={2}
            >
              <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '900', fontSize: isMobile ? 28 : 24 }}>
                {props.length}
              </Text>
              <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, marginTop: 2, fontSize: isMobile ? 11 : 10 }}>
                Total
              </Text>
            </Surface>
            <Surface
              style={[
                styles.statBadge,
                {
                  backgroundColor: theme.colors.tertiaryContainer,
                  paddingHorizontal: isMobile ? 20 : 16,
                  paddingVertical: isMobile ? 14 : 12,
                  minWidth: isMobile ? 80 : 70,
                },
              ]}
              elevation={2}
            >
              <Text variant="headlineSmall" style={{ color: theme.colors.tertiary, fontWeight: '900', fontSize: isMobile ? 28 : 24 }}>
                {props.filter((p) => p.required).length}
              </Text>
              <Text variant="labelSmall" style={{ color: theme.colors.onTertiaryContainer, marginTop: 2, fontSize: isMobile ? 11 : 10 }}>
                Required
              </Text>
            </Surface>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <Animated.View
        entering={FadeInDown.delay(100).springify().damping(15)}
        style={[styles.searchContainer, { marginBottom: isMobile ? 24 : 20 }]}
      >
        <Surface
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surfaceVariant + '80',
              borderColor: theme.colors.outlineVariant,
              minHeight: isMobile ? 60 : 52,
            },
          ]}
          elevation={1}
        >
          <Ionicons name="search" size={isMobile ? 24 : 22} color={theme.colors.onSurfaceVariant} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search props by name, type, or description..."
            placeholderTextColor={theme.colors.onSurfaceVariant + '80'}
            style={[
              styles.searchInput,
              {
                color: theme.colors.onSurface,
                fontSize: isMobile ? 17 : 15,
              },
            ]}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={[styles.clearButton, { minWidth: isMobile ? 48 : 44, minHeight: isMobile ? 48 : 44 }]}>
              <Ionicons name="close-circle" size={isMobile ? 24 : 22} color={theme.colors.onSurfaceVariant} />
            </Pressable>
          )}
        </Surface>
        {searchQuery && (
          <Animated.View entering={FadeIn}>
            <Text
              variant="labelMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                marginTop: 10,
                marginLeft: 4,
                fontSize: isMobile ? 14 : 12,
              }}
            >
              Found {processedProps.length} of {props.length} props
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Props Cards - Mobile first grid */}
      <View style={[styles.cardsGrid, { gap: isMobile ? 16 : 12 }]}>
        {processedProps.length > 0 ? (
          processedProps.map((prop, index) => (
            <PropCard
              key={prop.name}
              prop={prop}
              index={index}
              theme={theme}
              isMobile={isMobile}
            />
          ))
        ) : (
          <View style={[styles.emptyState, { paddingVertical: isMobile ? 80 : 60 }]}>
            <Ionicons
              name="search-outline"
              size={isMobile ? 64 : 48}
              color={theme.colors.onSurfaceVariant}
              style={{ opacity: 0.3 }}
            />
            <Text
              variant="titleLarge"
              style={{
                color: theme.colors.onSurfaceVariant,
                marginTop: isMobile ? 20 : 16,
                opacity: 0.6,
                fontSize: isMobile ? 20 : 18,
              }}
            >
              No props found matching "{searchQuery}"
            </Text>
          </View>
        )}
      </View>

      {/* Helper Text */}
      <View
        style={[
          styles.helperContainer,
          {
            backgroundColor: theme.colors.surfaceContainerHighest + '40',
            padding: isMobile ? 18 : 16,
            marginTop: isMobile ? 24 : 20,
          },
        ]}
      >
        <Ionicons name="bulb-outline" size={isMobile ? 20 : 18} color={theme.colors.onSurfaceVariant} />
        <Text
          variant="labelMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            marginLeft: 10,
            fontSize: isMobile ? 14 : 12,
            flex: 1,
          }}
        >
          {isMobile ? 'Tap any prop card to view full details' : 'Click on any prop to expand and view detailed description'}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
  titleContainer: {},
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 },
  titleUnderline: { borderRadius: 3 },
  statsContainer: { flexDirection: 'row', gap: 12 },
  statBadge: { borderRadius: 16, alignItems: 'center' },
  searchContainer: {},
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderRadius: 18, borderWidth: 1.5, gap: 12 },
  searchInput: { flex: 1, fontWeight: '600' },
  clearButton: { justifyContent: 'center', alignItems: 'center' },
  cardsGrid: { flexDirection: 'column' },
  propCard: { borderRadius: 24, padding: 24, marginBottom: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16 },
  propCardHeader: {},
  propNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  propNameContent: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1 },
  requiredBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, gap: 4, shadowColor: '#FF6B6B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 },
  requiredText: { color: '#FFFFFF', fontWeight: '900', letterSpacing: 0.5 },
  copyButton: { borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, alignSelf: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  defaultBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, alignSelf: 'flex-start' },
  propDescription: { borderRadius: 16 },
  descriptionRow: { flexDirection: 'row', alignItems: 'flex-start' },
  expandIndicator: { position: 'absolute', bottom: 12, right: 12 },
  emptyState: { alignItems: 'center', justifyContent: 'center' },
  helperContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 16 },
});
