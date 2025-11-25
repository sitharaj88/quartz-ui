import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Surface } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const textProps: PropDefinition[] = [
    {
        name: 'variant',
        type: 'TextVariant',
        default: "'bodyMedium'",
        description: 'Typography variant following Material Design 3 type scale',
    },
    {
        name: 'color',
        type: 'string',
        description: 'Text color override',
    },
    {
        name: 'align',
        type: "'left' | 'center' | 'right'",
        default: "'left'",
        description: 'Text alignment',
    },
    {
        name: 'numberOfLines',
        type: 'number',
        description: 'Maximum number of lines before truncation',
    },
    {
        name: 'selectable',
        type: 'boolean',
        default: 'false',
        description: 'Allow text selection',
    },
    {
        name: 'style',
        type: 'StyleProp<TextStyle>',
        description: 'Style override',
    },
    {
        name: 'children',
        type: 'ReactNode',
        description: 'Text content',
    },
];

const textVariants = {
    display: [
        { variant: 'displayLarge', size: '57px', weight: '400', lineHeight: '64px' },
        { variant: 'displayMedium', size: '45px', weight: '400', lineHeight: '52px' },
        { variant: 'displaySmall', size: '36px', weight: '400', lineHeight: '44px' },
    ],
    headline: [
        { variant: 'headlineLarge', size: '32px', weight: '400', lineHeight: '40px' },
        { variant: 'headlineMedium', size: '28px', weight: '400', lineHeight: '36px' },
        { variant: 'headlineSmall', size: '24px', weight: '400', lineHeight: '32px' },
    ],
    title: [
        { variant: 'titleLarge', size: '22px', weight: '400', lineHeight: '28px' },
        { variant: 'titleMedium', size: '16px', weight: '500', lineHeight: '24px' },
        { variant: 'titleSmall', size: '14px', weight: '500', lineHeight: '20px' },
    ],
    body: [
        { variant: 'bodyLarge', size: '16px', weight: '400', lineHeight: '24px' },
        { variant: 'bodyMedium', size: '14px', weight: '400', lineHeight: '20px' },
        { variant: 'bodySmall', size: '12px', weight: '400', lineHeight: '16px' },
    ],
    label: [
        { variant: 'labelLarge', size: '14px', weight: '500', lineHeight: '20px' },
        { variant: 'labelMedium', size: '12px', weight: '500', lineHeight: '16px' },
        { variant: 'labelSmall', size: '11px', weight: '500', lineHeight: '16px' },
    ],
};

export default function TypographyDocPage() {
    const theme = useTheme();

    return (
        <DocLayout
            title="Typography"
            description="Text component with Material Design 3 type scale for consistent typography"
        >
            {/* Overview */}
            <Animated.View entering={FadeInDown.delay(100).springify()}>
                <Text variant="bodyLarge" style={[styles.intro, { color: theme.colors.onSurfaceVariant }]}>
                    The Text component implements the Material Design 3 type scale with 15 variants
                    organized into 5 roles: Display, Headline, Title, Body, and Label. Each role has
                    Large, Medium, and Small sizes.
                </Text>
            </Animated.View>

            {/* Display Styles */}
            <Animated.View entering={FadeInDown.delay(200).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Display
                </Text>
                <Text variant="bodyMedium" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Display styles are reserved for short, important text or numerals. Used for hero sections and large callouts.
                </Text>
                <CodePlayground
                    title="Display Variants"
                    description="Large, impactful typography for heroes"
                    code={`<Text variant="displayLarge">Display Large</Text>
<Text variant="displayMedium">Display Medium</Text>
<Text variant="displaySmall">Display Small</Text>`}
                    preview={
                        <View style={styles.variantList}>
                            {textVariants.display.map((item, index) => (
                                <View key={item.variant} style={[styles.variantItem, { borderBottomColor: theme.colors.outlineVariant }]}>
                                    <Text variant={item.variant as any} style={{ color: theme.colors.onSurface }}>
                                        {item.variant}
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                        {item.size} / {item.weight} / {item.lineHeight}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    }
                />
            </Animated.View>

            {/* Headline Styles */}
            <Animated.View entering={FadeInDown.delay(300).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Headline
                </Text>
                <Text variant="bodyMedium" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Headlines are best-suited for short, high-emphasis text on smaller screens. Used for section titles.
                </Text>
                <CodePlayground
                    title="Headline Variants"
                    description="Section headers and page titles"
                    code={`<Text variant="headlineLarge">Headline Large</Text>
<Text variant="headlineMedium">Headline Medium</Text>
<Text variant="headlineSmall">Headline Small</Text>`}
                    preview={
                        <View style={styles.variantList}>
                            {textVariants.headline.map((item) => (
                                <View key={item.variant} style={[styles.variantItem, { borderBottomColor: theme.colors.outlineVariant }]}>
                                    <Text variant={item.variant as any} style={{ color: theme.colors.onSurface }}>
                                        {item.variant}
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                        {item.size} / {item.weight} / {item.lineHeight}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    }
                />
            </Animated.View>

            {/* Title Styles */}
            <Animated.View entering={FadeInDown.delay(400).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Title
                </Text>
                <Text variant="bodyMedium" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Titles are smaller than headlines and should be used for medium-emphasis text. Used for cards, dialogs, and sections.
                </Text>
                <CodePlayground
                    title="Title Variants"
                    description="Card titles and dialog headers"
                    code={`<Text variant="titleLarge">Title Large</Text>
<Text variant="titleMedium">Title Medium</Text>
<Text variant="titleSmall">Title Small</Text>`}
                    preview={
                        <View style={styles.variantList}>
                            {textVariants.title.map((item) => (
                                <View key={item.variant} style={[styles.variantItem, { borderBottomColor: theme.colors.outlineVariant }]}>
                                    <Text variant={item.variant as any} style={{ color: theme.colors.onSurface }}>
                                        {item.variant}
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                        {item.size} / {item.weight} / {item.lineHeight}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    }
                />
            </Animated.View>

            {/* Body Styles */}
            <Animated.View entering={FadeInDown.delay(500).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Body
                </Text>
                <Text variant="bodyMedium" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Body styles are used for longer passages of text and paragraph content. The primary reading style.
                </Text>
                <CodePlayground
                    title="Body Variants"
                    description="Paragraph text and descriptions"
                    code={`<Text variant="bodyLarge">Body Large</Text>
<Text variant="bodyMedium">Body Medium</Text>
<Text variant="bodySmall">Body Small</Text>`}
                    preview={
                        <View style={styles.variantList}>
                            {textVariants.body.map((item) => (
                                <View key={item.variant} style={[styles.variantItem, { borderBottomColor: theme.colors.outlineVariant }]}>
                                    <Text variant={item.variant as any} style={{ color: theme.colors.onSurface }}>
                                        {item.variant} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                        {item.size} / {item.weight} / {item.lineHeight}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    }
                />
            </Animated.View>

            {/* Label Styles */}
            <Animated.View entering={FadeInDown.delay(600).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Label
                </Text>
                <Text variant="bodyMedium" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Label styles are smaller, utilitarian styles used for things like navigation, tabs, and buttons.
                </Text>
                <CodePlayground
                    title="Label Variants"
                    description="Buttons, tabs, and UI controls"
                    code={`<Text variant="labelLarge">Label Large</Text>
<Text variant="labelMedium">Label Medium</Text>
<Text variant="labelSmall">Label Small</Text>`}
                    preview={
                        <View style={styles.variantList}>
                            {textVariants.label.map((item) => (
                                <View key={item.variant} style={[styles.variantItem, { borderBottomColor: theme.colors.outlineVariant }]}>
                                    <Text variant={item.variant as any} style={{ color: theme.colors.onSurface }}>
                                        {item.variant.toUpperCase()}
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                        {item.size} / {item.weight} / {item.lineHeight}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    }
                />
            </Animated.View>

            {/* Color Variations */}
            <Animated.View entering={FadeInDown.delay(700).springify()}>
                <CodePlayground
                    title="Color Variations"
                    description="Text with semantic colors"
                    code={`<Text color={theme.colors.primary}>Primary Text</Text>
<Text color={theme.colors.secondary}>Secondary Text</Text>
<Text color={theme.colors.error}>Error Text</Text>`}
                    preview={
                        <View style={styles.colorDemo}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
                                Primary color for emphasis
                            </Text>
                            <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>
                                Secondary color for accents
                            </Text>
                            <Text variant="bodyLarge" style={{ color: theme.colors.tertiary }}>
                                Tertiary color for contrast
                            </Text>
                            <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
                                Error color for alerts
                            </Text>
                            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                                On surface variant for subdued text
                            </Text>
                        </View>
                    }
                />
            </Animated.View>

            {/* Text Features */}
            <Animated.View entering={FadeInDown.delay(800).springify()}>
                <CodePlayground
                    title="Text Features"
                    description="Alignment, truncation, and selection"
                    code={`// Alignment
<Text align="center">Centered text</Text>

// Truncation
<Text numberOfLines={2}>Long text...</Text>

// Selectable
<Text selectable>Select me</Text>`}
                    preview={
                        <View style={styles.featuresDemo}>
                            <Surface elevation={0} style={[styles.featureCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                                    CENTER ALIGNED
                                </Text>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, textAlign: 'center' }}>
                                    This text is centered within its container
                                </Text>
                            </Surface>

                            <Surface elevation={0} style={[styles.featureCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                                    TRUNCATED (2 LINES)
                                </Text>
                                <Text variant="bodyMedium" numberOfLines={2} style={{ color: theme.colors.onSurface }}>
                                    This is a very long text that will be truncated after two lines.
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Text>
                            </Surface>

                            <Surface elevation={0} style={[styles.featureCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                                    SELECTABLE
                                </Text>
                                <Text variant="bodyMedium" selectable style={{ color: theme.colors.onSurface }}>
                                    Try selecting this text on your device
                                </Text>
                            </Surface>
                        </View>
                    }
                />
            </Animated.View>

            {/* Props Table */}
            <Animated.View entering={FadeInDown.delay(900).springify()}>
                <PropsTable title="Text" props={textProps} />
            </Animated.View>

            {/* Usage Guidelines */}
            <Animated.View entering={FadeInDown.delay(1000).springify()} style={{ marginTop: 48 }}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Best Practices
                </Text>
                <View style={styles.guidelines}>
                    <View style={styles.guideline}>
                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                        <View style={styles.guidelineText}>
                            <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                                Use the type scale consistently
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Don't mix custom font sizes with the type scale variants
                            </Text>
                        </View>
                    </View>
                    <View style={styles.guideline}>
                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                        <View style={styles.guidelineText}>
                            <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                                Match variant to content hierarchy
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Use Display for heroes, Headlines for sections, Body for content
                            </Text>
                        </View>
                    </View>
                    <View style={styles.guideline}>
                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                        <View style={styles.guidelineText}>
                            <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                                Ensure sufficient color contrast
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Follow WCAG guidelines for text contrast ratios
                            </Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </DocLayout>
    );
}

const styles = StyleSheet.create({
    intro: {
        marginBottom: 32,
        lineHeight: 24,
    },
    sectionTitle: {
        marginBottom: 8,
        fontWeight: '700',
        marginTop: 32,
    },
    sectionDescription: {
        marginBottom: 16,
        lineHeight: 22,
    },
    variantList: {
        width: '100%',
    },
    variantItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    colorDemo: {
        gap: 12,
        width: '100%',
    },
    featuresDemo: {
        gap: 16,
        width: '100%',
    },
    featureCard: {
        padding: 16,
        borderRadius: 12,
    },
    guidelines: {
        gap: 16,
    },
    guideline: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    guidelineText: {
        flex: 1,
        gap: 4,
    },
});
