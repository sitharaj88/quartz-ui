import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Text,
    Button,
    AnimatedView,
    FadeIn,
    ScaleIn,
    SlideIn,
    Stagger,
    Surface,
    useTheme
} from 'quartz-ui';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function AnimationsScreen() {
    const theme = useTheme();
    const [key, setKey] = useState(0);

    const replay = () => setKey(k => k + 1);

    return (
        <DemoLayout
            title="Animation"
            subtitle="Entry animations & transitions"
            icon="sparkles"
            gradient={['#f59e0b', '#d97706']}
        >
            {/* Replay Button */}
            <Section title="Replay Animations" index={0}>
                <Button variant="filled" onPress={replay} label="Replay All" />
            </Section>

            {/* Fade Animations */}
            <Section title="Fade" subtitle="Opacity-based entry" index={1}>
                <View style={styles.grid} key={`fade-${key}`}>
                    <FadeIn delay={0}>
                        <Surface style={[styles.box, { backgroundColor: theme.colors.primaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onPrimaryContainer }}>fadeIn</Text>
                        </Surface>
                    </FadeIn>
                    <AnimatedView animation="fadeInUp" delay={100}>
                        <Surface style={[styles.box, { backgroundColor: theme.colors.secondaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onSecondaryContainer }}>fadeInUp</Text>
                        </Surface>
                    </AnimatedView>
                    <AnimatedView animation="fadeInDown" delay={200}>
                        <Surface style={[styles.box, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onTertiaryContainer }}>fadeInDown</Text>
                        </Surface>
                    </AnimatedView>
                </View>
            </Section>

            {/* Scale Animations */}
            <Section title="Scale" subtitle="Size-based entry" index={2}>
                <View style={styles.grid} key={`scale-${key}`}>
                    <ScaleIn delay={0}>
                        <Surface style={[styles.box, { backgroundColor: theme.colors.primaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onPrimaryContainer }}>scaleIn</Text>
                        </Surface>
                    </ScaleIn>
                    <AnimatedView animation="scaleInUp" delay={100}>
                        <Surface style={[styles.box, { backgroundColor: theme.colors.secondaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onSecondaryContainer }}>scaleInUp</Text>
                        </Surface>
                    </AnimatedView>
                    <AnimatedView animation="bounceIn" delay={200}>
                        <Surface style={[styles.box, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onTertiaryContainer }}>bounceIn</Text>
                        </Surface>
                    </AnimatedView>
                </View>
            </Section>

            {/* Slide Animations */}
            <Section title="Slide" subtitle="Position-based entry" index={3}>
                <View style={styles.column} key={`slide-${key}`}>
                    <SlideIn direction="left" delay={0}>
                        <Surface style={[styles.wideBox, { backgroundColor: theme.colors.primaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onPrimaryContainer }}>slideInLeft</Text>
                        </Surface>
                    </SlideIn>
                    <SlideIn direction="right" delay={100}>
                        <Surface style={[styles.wideBox, { backgroundColor: theme.colors.secondaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onSecondaryContainer }}>slideInRight</Text>
                        </Surface>
                    </SlideIn>
                </View>
            </Section>

            {/* Stagger */}
            <Section title="Stagger" subtitle="Animated children sequence" index={4}>
                <View key={`stagger-${key}`}>
                    <Stagger staggerDelay={80}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Surface
                                key={i}
                                style={[styles.listItem, { backgroundColor: theme.colors.surfaceVariant }]}
                                elevation={1}
                            >
                                <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
                                <Text style={{ color: theme.colors.onSurface }}>List item {i}</Text>
                            </Surface>
                        ))}
                    </Stagger>
                </View>
            </Section>

            {/* Custom Duration */}
            <Section title="Custom Timing" subtitle="Adjust duration and easing" index={5}>
                <View style={styles.grid} key={`custom-${key}`}>
                    <AnimatedView animation="scaleIn" duration={200}>
                        <Surface style={[styles.box, { backgroundColor: theme.colors.primaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onPrimaryContainer, fontSize: 12 }}>200ms</Text>
                        </Surface>
                    </AnimatedView>
                    <AnimatedView animation="scaleIn" duration={500}>
                        <Surface style={[styles.box, { backgroundColor: theme.colors.secondaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onSecondaryContainer, fontSize: 12 }}>500ms</Text>
                        </Surface>
                    </AnimatedView>
                    <AnimatedView animation="scaleIn" duration={1000}>
                        <Surface style={[styles.box, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={1}>
                            <Text style={{ color: theme.colors.onTertiaryContainer, fontSize: 12 }}>1000ms</Text>
                        </Surface>
                    </AnimatedView>
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
        gap: 12,
    },
    box: {
        width: 90,
        height: 80,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wideBox: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        gap: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
