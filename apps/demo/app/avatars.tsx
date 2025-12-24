import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, AvatarBadge, AvatarGroup, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

const SAMPLE_IMAGES = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=6',
];

export default function AvatarsScreen() {
    const theme = useTheme();

    return (
        <DemoLayout
            title="Avatar"
            subtitle="Display user images, initials, or icons"
            icon="person-circle"
            gradient={['#6366f1', '#8b5cf6']}
        >
            {/* Sizes */}
            <Section title="Sizes" subtitle="5 preset sizes from xs to xl" index={0}>
                <View style={styles.row}>
                    <View style={styles.sizeItem}>
                        <Avatar size="xs" initials="XS" />
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>XS</Text>
                    </View>
                    <View style={styles.sizeItem}>
                        <Avatar size="sm" initials="SM" />
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>SM</Text>
                    </View>
                    <View style={styles.sizeItem}>
                        <Avatar size="md" initials="MD" />
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>MD</Text>
                    </View>
                    <View style={styles.sizeItem}>
                        <Avatar size="lg" initials="LG" />
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>LG</Text>
                    </View>
                    <View style={styles.sizeItem}>
                        <Avatar size="xl" initials="XL" />
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>XL</Text>
                    </View>
                </View>
            </Section>

            {/* With Images */}
            <Section title="Images" subtitle="Load avatar from URL" index={1}>
                <View style={styles.row}>
                    {SAMPLE_IMAGES.slice(0, 5).map((url, i) => (
                        <Avatar key={i} source={{ uri: url }} size="lg" />
                    ))}
                </View>
            </Section>

            {/* Initials */}
            <Section title="Initials" subtitle="Display text when no image" index={2}>
                <View style={styles.row}>
                    <Avatar initials="John Doe" size="lg" />
                    <Avatar initials="Alice" size="lg" backgroundColor={theme.colors.secondaryContainer} color={theme.colors.onSecondaryContainer} />
                    <Avatar initials="Bob Smith" size="lg" backgroundColor={theme.colors.tertiaryContainer} color={theme.colors.onTertiaryContainer} />
                    <Avatar initials="CK" size="lg" backgroundColor={theme.colors.errorContainer} color={theme.colors.onErrorContainer} />
                </View>
            </Section>

            {/* Variants */}
            <Section title="Shapes" subtitle="Circular, rounded, and square" index={3}>
                <View style={styles.row}>
                    <View style={styles.sizeItem}>
                        <Avatar source={{ uri: SAMPLE_IMAGES[0] }} size="lg" variant="circular" />
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>Circular</Text>
                    </View>
                    <View style={styles.sizeItem}>
                        <Avatar source={{ uri: SAMPLE_IMAGES[1] }} size="lg" variant="rounded" />
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>Rounded</Text>
                    </View>
                    <View style={styles.sizeItem}>
                        <Avatar source={{ uri: SAMPLE_IMAGES[2] }} size="lg" variant="square" />
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>Square</Text>
                    </View>
                </View>
            </Section>

            {/* With Icons */}
            <Section title="Icons" subtitle="Use icons as fallback" index={4}>
                <View style={styles.row}>
                    <Avatar
                        size="lg"
                        icon={<Ionicons name="person" size={24} color={theme.colors.onPrimaryContainer} />}
                    />
                    <Avatar
                        size="lg"
                        icon={<Ionicons name="briefcase" size={24} color={theme.colors.onSecondaryContainer} />}
                        backgroundColor={theme.colors.secondaryContainer}
                    />
                    <Avatar
                        size="lg"
                        icon={<Ionicons name="star" size={24} color={theme.colors.onTertiaryContainer} />}
                        backgroundColor={theme.colors.tertiaryContainer}
                    />
                </View>
            </Section>

            {/* Avatar Group */}
            <Section title="Avatar Group" subtitle="Stack multiple avatars" index={5}>
                <View style={styles.column}>
                    <AvatarGroup max={4} size="md">
                        {SAMPLE_IMAGES.map((url, i) => (
                            <Avatar key={i} source={{ uri: url }} />
                        ))}
                    </AvatarGroup>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
                        6 team members (+2 overflow)
                    </Text>
                </View>
            </Section>
        </DemoLayout>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
    },
    column: {
        alignItems: 'center',
    },
    sizeItem: {
        alignItems: 'center',
    },
});
