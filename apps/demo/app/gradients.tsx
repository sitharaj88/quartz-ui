import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Text,
    Gradient,
    GradientCard,
    GradientButton,
    GradientBorder,
    Button,
    useTheme
} from 'quartz-ui';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function GradientsScreen() {
    const theme = useTheme();

    return (
        <DemoLayout
            title="Gradient"
            subtitle="Linear gradients with presets"
            icon="color-fill"
            gradient={['#ec4899', '#f43f5e']}
        >
            {/* Presets */}
            <Section title="Presets" subtitle="12 beautiful gradient presets" index={0}>
                <View style={styles.grid}>
                    {(['primary', 'secondary', 'tertiary', 'sunset', 'ocean', 'forest', 'purple', 'warm', 'cool', 'dark', 'light', 'rainbow'] as const).map((preset) => (
                        <Gradient
                            key={preset}
                            preset={preset}
                            style={styles.presetBox}
                        >
                            <Text style={styles.presetLabel}>{preset}</Text>
                        </Gradient>
                    ))}
                </View>
            </Section>

            {/* Directions */}
            <Section title="Directions" subtitle="Control gradient angle" index={1}>
                <View style={styles.grid}>
                    {(['toRight', 'toLeft', 'toBottom', 'toTop', 'toBottomRight', 'toTopLeft'] as const).map((direction) => (
                        <Gradient
                            key={direction}
                            colors={[theme.colors.primary, theme.colors.tertiary]}
                            direction={direction}
                            style={styles.directionBox}
                        >
                            <Text style={styles.directionLabel}>{direction.replace('to', '→')}</Text>
                        </Gradient>
                    ))}
                </View>
            </Section>

            {/* Gradient Card */}
            <Section title="Gradient Card" subtitle="Card with gradient background" index={2}>
                <GradientCard preset="sunset" style={styles.gradientCard}>
                    <Text variant="titleLarge" style={styles.cardTitle}>Premium Feature</Text>
                    <Text variant="bodyMedium" style={styles.cardSubtitle}>
                        Unlock advanced capabilities with our premium plan
                    </Text>
                    <Button variant="filled" label="Upgrade Now" style={styles.cardButton} />
                </GradientCard>
            </Section>

            {/* Gradient Button */}
            <Section title="Gradient Button" subtitle="Button with gradient background" index={3}>
                <View style={styles.buttonRow}>
                    <GradientButton
                        preset="primary"
                        label="Primary"
                        onPress={() => { }}
                    />
                    <GradientButton
                        preset="sunset"
                        label="Sunset"
                        onPress={() => { }}
                    />
                    <GradientButton
                        preset="ocean"
                        label="Ocean"
                        onPress={() => { }}
                    />
                </View>
            </Section>

            {/* Gradient Border */}
            <Section title="Gradient Border" subtitle="Elements with gradient borders" index={4}>
                <View style={styles.column}>
                    <GradientBorder preset="rainbow" borderWidth={2} borderRadius={16}>
                        <View style={[styles.borderContent, { backgroundColor: theme.colors.surface }]}>
                            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Rainbow Border</Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Beautiful gradient border effect
                            </Text>
                        </View>
                    </GradientBorder>
                    <GradientBorder preset="sunset" borderWidth={3} borderRadius={12}>
                        <View style={[styles.borderContent, { backgroundColor: theme.colors.surface }]}>
                            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Sunset Border</Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Warm gradient border effect
                            </Text>
                        </View>
                    </GradientBorder>
                </View>
            </Section>

            {/* Custom Colors */}
            <Section title="Custom Colors" subtitle="Define your own gradients" index={5}>
                <View style={styles.grid}>
                    <Gradient
                        colors={['#ff0080', '#7928ca']}
                        style={styles.presetBox}
                    >
                        <Text style={styles.presetLabel}>Custom 1</Text>
                    </Gradient>
                    <Gradient
                        colors={['#00DFD8', '#007CF0']}
                        style={styles.presetBox}
                    >
                        <Text style={styles.presetLabel}>Custom 2</Text>
                    </Gradient>
                    <Gradient
                        colors={['#F9CB28', '#FF4D4D']}
                        style={styles.presetBox}
                    >
                        <Text style={styles.presetLabel}>Custom 3</Text>
                    </Gradient>
                </View>
            </Section>
        </DemoLayout>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    column: {
        gap: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    presetBox: {
        width: 90,
        height: 70,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    presetLabel: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    directionBox: {
        width: 90,
        height: 70,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    directionLabel: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    gradientCard: {
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
    },
    cardTitle: {
        color: '#fff',
        fontWeight: '700',
        marginBottom: 8,
    },
    cardSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 20,
    },
    cardButton: {
        minWidth: 140,
    },
    borderContent: {
        padding: 20,
        borderRadius: 12,
    },
});
