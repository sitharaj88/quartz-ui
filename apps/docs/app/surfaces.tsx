import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, useTheme, Divider } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const surfaceProps: PropDefinition[] = [
  {
    name: 'elevation',
    type: '0 | 1 | 2 | 3 | 4 | 5',
    default: '1',
    description: 'Surface elevation level following Material Design 3',
  },
  {
    name: 'mode',
    type: "'flat' | 'elevated'",
    default: "'elevated'",
    description: 'Surface style mode',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Surface content',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

const dividerProps: PropDefinition[] = [
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Divider orientation',
  },
  {
    name: 'variant',
    type: "'full' | 'inset' | 'middle'",
    default: "'full'",
    description: 'Divider indent style',
  },
  {
    name: 'thickness',
    type: 'number',
    default: '1',
    description: 'Line thickness in pixels',
  },
  {
    name: 'color',
    type: 'string',
    description: 'Custom divider color',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];

export default function SurfacesDocPage() {
  const theme = useTheme();

  return (
    <DocLayout
      title="Surfaces & Elevation"
      description="Foundational components for creating layered UI with depth and hierarchy"
    >
      {/* Surface Section */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Surface
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Surfaces are the foundational building blocks of Material Design. They represent 
          distinct areas of your UI and use elevation to create visual hierarchy through shadows.
        </Text>
      </Animated.View>

      {/* Elevation Levels */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <CodePlayground
          title="Elevation Levels"
          description="Material Design 3 defines 6 elevation levels (0-5)"
          code={`<Surface elevation={0}>Level 0</Surface>
<Surface elevation={1}>Level 1</Surface>
<Surface elevation={2}>Level 2</Surface>
<Surface elevation={3}>Level 3</Surface>
<Surface elevation={4}>Level 4</Surface>
<Surface elevation={5}>Level 5</Surface>`}
          preview={
            <View style={styles.elevationGrid}>
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <Surface 
                  key={level} 
                  elevation={level as any}
                  style={[styles.elevationCard, { backgroundColor: theme.colors.surface }]}
                >
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                    Level {level}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                    {level === 0 && 'No shadow'}
                    {level === 1 && 'Cards, containers'}
                    {level === 2 && 'Raised buttons'}
                    {level === 3 && 'FAB resting'}
                    {level === 4 && 'Menus, dialogs'}
                    {level === 5 && 'Modal surfaces'}
                  </Text>
                </Surface>
              ))}
            </View>
          }
        />
      </Animated.View>

      {/* Surface Colors */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <CodePlayground
          title="Surface Color Containers"
          description="Material Design 3 surface container colors"
          code={`<Surface style={{ backgroundColor: theme.colors.surface }}>
  Surface
</Surface>
<Surface style={{ backgroundColor: theme.colors.surfaceContainerLow }}>
  Container Low
</Surface>
<Surface style={{ backgroundColor: theme.colors.surfaceContainerHigh }}>
  Container High
</Surface>`}
          preview={
            <View style={styles.surfaceColorGrid}>
              <View style={[styles.surfaceColorCard, { backgroundColor: theme.colors.surface }]}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>surface</Text>
              </View>
              <View style={[styles.surfaceColorCard, { backgroundColor: theme.colors.surfaceContainerLowest }]}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>surfaceContainerLowest</Text>
              </View>
              <View style={[styles.surfaceColorCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>surfaceContainerLow</Text>
              </View>
              <View style={[styles.surfaceColorCard, { backgroundColor: theme.colors.surfaceContainer }]}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>surfaceContainer</Text>
              </View>
              <View style={[styles.surfaceColorCard, { backgroundColor: theme.colors.surfaceContainerHigh }]}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>surfaceContainerHigh</Text>
              </View>
              <View style={[styles.surfaceColorCard, { backgroundColor: theme.colors.surfaceContainerHighest }]}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>surfaceContainerHighest</Text>
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Surface Usage */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <CodePlayground
          title="Surface in Practice"
          description="Common surface usage patterns"
          code={`// Card-like container
<Surface elevation={1} style={styles.card}>
  <Text>Card content</Text>
</Surface>

// Nested surfaces
<Surface elevation={0}>
  <Surface elevation={2}>
    <Text>Nested content</Text>
  </Surface>
</Surface>`}
          preview={
            <View style={styles.usageDemo}>
              <Surface elevation={1} style={[styles.demoCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.cardHeader, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Ionicons name="image" size={24} color={theme.colors.onPrimaryContainer} />
                </View>
                <View style={styles.cardBody}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Surface Card</Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Surfaces provide the foundation for cards and other containers
                  </Text>
                </View>
              </Surface>
              
              <Surface elevation={0} style={[styles.nestedOuter, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
                  OUTER SURFACE (LEVEL 0)
                </Text>
                <Surface elevation={2} style={[styles.nestedInner, { backgroundColor: theme.colors.surface }]}>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                    INNER SURFACE (LEVEL 2)
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    Nested elevated content
                  </Text>
                </Surface>
              </Surface>
            </View>
          }
        />
      </Animated.View>

      {/* Surface Props */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <PropsTable title="Surface" props={surfaceProps} />
      </Animated.View>

      {/* Divider Section */}
      <Animated.View entering={FadeInDown.delay(600).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Divider
        </Text>
        <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
          Dividers are thin lines that separate content into clear groups. They help organize 
          content and establish visual hierarchy.
        </Text>
      </Animated.View>

      {/* Full Divider */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
        <CodePlayground
          title="Full Width Divider"
          description="Spans the entire width of its container"
          code={`<Text>Item 1</Text>
<Divider variant="full" />
<Text>Item 2</Text>`}
          preview={
            <View style={styles.dividerDemo}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Section One</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Some content in the first section
              </Text>
              <Divider inset="none" style={{ marginVertical: 16 }} />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Section Two</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Some content in the second section
              </Text>
            </View>
          }
        />
      </Animated.View>

      {/* Inset Divider */}
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <CodePlayground
          title="Inset Divider"
          description="Has left margin to align with list content"
          code={`<ListItem leading={<Avatar />} title="Item 1" />
<Divider variant="inset" />
<ListItem leading={<Avatar />} title="Item 2" />`}
          preview={
            <View style={styles.dividerDemo}>
              <View style={styles.listItem}>
                <View style={[styles.listAvatar, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Ionicons name="person" size={20} color={theme.colors.onPrimaryContainer} />
                </View>
                <View style={styles.listContent}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Alice Johnson</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>alice@example.com</Text>
                </View>
              </View>
              <Divider inset="start" style={{ marginLeft: 56 }} />
              <View style={styles.listItem}>
                <View style={[styles.listAvatar, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Ionicons name="person" size={20} color={theme.colors.onSecondaryContainer} />
                </View>
                <View style={styles.listContent}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Bob Smith</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>bob@example.com</Text>
                </View>
              </View>
              <Divider inset="start" style={{ marginLeft: 56 }} />
              <View style={styles.listItem}>
                <View style={[styles.listAvatar, { backgroundColor: theme.colors.tertiaryContainer }]}>
                  <Ionicons name="person" size={20} color={theme.colors.onTertiaryContainer} />
                </View>
                <View style={styles.listContent}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Carol Williams</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>carol@example.com</Text>
                </View>
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Middle Divider */}
      <Animated.View entering={FadeInDown.delay(900).springify()}>
        <CodePlayground
          title="Middle Divider"
          description="Has margin on both sides"
          code={`<View>
  <Text>Left content</Text>
</View>
<Divider variant="middle" />
<View>
  <Text>Right content</Text>
</View>`}
          preview={
            <View style={styles.dividerDemo}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, paddingHorizontal: 16 }}>
                Content with padding on both sides
              </Text>
              <Divider inset="both" style={{ marginVertical: 16, marginHorizontal: 16 }} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, paddingHorizontal: 16 }}>
                Divider respects the same horizontal padding
              </Text>
            </View>
          }
        />
      </Animated.View>

      {/* Vertical Divider */}
      <Animated.View entering={FadeInDown.delay(1000).springify()}>
        <CodePlayground
          title="Vertical Divider"
          description="Used to separate horizontal content"
          code={`<View style={{ flexDirection: 'row' }}>
  <Text>Left</Text>
  <Divider orientation="vertical" />
  <Text>Right</Text>
</View>`}
          preview={
            <View style={styles.verticalDividerDemo}>
              <View style={styles.verticalSection}>
                <Ionicons name="star" size={24} color={theme.colors.primary} />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>4.8</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Rating</Text>
              </View>
              <Divider orientation="vertical" style={{ height: 48 }} />
              <View style={styles.verticalSection}>
                <Ionicons name="download" size={24} color={theme.colors.secondary} />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>2.5M</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Downloads</Text>
              </View>
              <Divider orientation="vertical" style={{ height: 48 }} />
              <View style={styles.verticalSection}>
                <Ionicons name="people" size={24} color={theme.colors.tertiary} />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>50K</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Reviews</Text>
              </View>
            </View>
          }
        />
      </Animated.View>

      {/* Divider Props */}
      <Animated.View entering={FadeInDown.delay(1100).springify()}>
        <PropsTable title="Divider" props={dividerProps} />
      </Animated.View>

      {/* Elevation Guidelines */}
      <Animated.View entering={FadeInDown.delay(1200).springify()} style={{ marginTop: 48 }}>
        <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Elevation Guidelines
        </Text>
        <Surface elevation={1} style={[styles.guidelinesCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
          <View style={styles.guidelineRow}>
            <View style={[styles.levelBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer }}>0</Text>
            </View>
            <View style={styles.guidelineContent}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>Level 0 - Flat</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Background surfaces, canvas
              </Text>
            </View>
          </View>
          <View style={styles.guidelineRow}>
            <View style={[styles.levelBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer }}>1</Text>
            </View>
            <View style={styles.guidelineContent}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>Level 1 - Low</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Cards, search bars, text fields
              </Text>
            </View>
          </View>
          <View style={styles.guidelineRow}>
            <View style={[styles.levelBadge, { backgroundColor: theme.colors.tertiaryContainer }]}>
              <Text variant="labelMedium" style={{ color: theme.colors.onTertiaryContainer }}>2-3</Text>
            </View>
            <View style={styles.guidelineContent}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>Level 2-3 - Medium</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Buttons, FAB, navigation components
              </Text>
            </View>
          </View>
          <View style={styles.guidelineRow}>
            <View style={[styles.levelBadge, { backgroundColor: theme.colors.errorContainer }]}>
              <Text variant="labelMedium" style={{ color: theme.colors.onErrorContainer }}>4-5</Text>
            </View>
            <View style={styles.guidelineContent}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>Level 4-5 - High</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Dialogs, menus, modals, side sheets
              </Text>
            </View>
          </View>
        </Surface>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '700',
  },
  sectionDescription: {
    marginBottom: 24,
    lineHeight: 24,
  },
  elevationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
  },
  elevationCard: {
    flex: 1,
    minWidth: 140,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surfaceColorGrid: {
    gap: 8,
    width: '100%',
  },
  surfaceColorCard: {
    padding: 16,
    borderRadius: 8,
  },
  usageDemo: {
    gap: 24,
    width: '100%',
  },
  demoCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  nestedOuter: {
    padding: 16,
    borderRadius: 16,
  },
  nestedInner: {
    padding: 16,
    borderRadius: 12,
  },
  dividerDemo: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    marginLeft: 16,
    gap: 2,
  },
  verticalDividerDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
  },
  verticalSection: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  guidelinesCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidelineContent: {
    flex: 1,
    gap: 2,
  },
});
