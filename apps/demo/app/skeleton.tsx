import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
    Text,
    Skeleton,
    SkeletonText,
    SkeletonAvatar,
    SkeletonCard,
    Button,
    useTheme
} from 'quartz-ui';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function SkeletonScreen() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    return (
        <DemoLayout
            title="Skeleton"
            subtitle="Loading placeholders with shimmer"
            icon="scan"
            gradient={['#64748b', '#94a3b8']}
        >
            {/* Toggle */}
            <Section title="Toggle Loading" index={0}>
                <Button
                    variant="tonal"
                    onPress={() => setLoading(!loading)}
                    label={loading ? 'Show Content' : 'Show Skeleton'}
                />
            </Section>

            {/* Basic Shapes */}
            <Section title="Basic Shapes" subtitle="Rectangle, circle, and text" index={1}>
                <View style={styles.column}>
                    <View style={styles.shapeRow}>
                        <Skeleton width={100} height={100} shape="rectangular" animated={loading} />
                        <Skeleton width={100} height={100} shape="circular" animated={loading} />
                        <Skeleton width={100} height={100} shape="rounded" animated={loading} />
                    </View>
                    <View style={styles.labels}>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Rectangle</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Circle</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Rounded</Text>
                    </View>
                </View>
            </Section>

            {/* Text Skeleton */}
            <Section title="Text Skeleton" subtitle="Multi-line text placeholder" index={2}>
                <SkeletonText lines={4} animated={loading} />
            </Section>

            {/* Avatar Skeleton */}
            <Section title="Avatar Skeleton" subtitle="User avatar placeholders" index={3}>
                <View style={styles.row}>
                    <SkeletonAvatar size={32} animated={loading} />
                    <SkeletonAvatar size={40} animated={loading} />
                    <SkeletonAvatar size={48} animated={loading} />
                    <SkeletonAvatar size={56} animated={loading} />
                    <SkeletonAvatar size={64} animated={loading} />
                </View>
            </Section>

            {/* Card Skeleton */}
            <Section title="Card Skeleton" subtitle="Complete card loading state" index={4}>
                {loading ? (
                    <SkeletonCard />
                ) : (
                    <View style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]} />
                            <View style={styles.cardHeaderText}>
                                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>John Doe</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Software Engineer</Text>
                            </View>
                        </View>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 12 }}>
                            This is an example of loaded content that replaces the skeleton loading state.
                        </Text>
                        <View style={[styles.image, { backgroundColor: theme.colors.primary }]}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Image Content</Text>
                        </View>
                    </View>
                )}
            </Section>
        </DemoLayout>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    column: {
        gap: 12,
    },
    shapeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    card: {
        padding: 16,
        borderRadius: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHeaderText: {
        flex: 1,
        gap: 4,
    },
    image: {
        height: 120,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
