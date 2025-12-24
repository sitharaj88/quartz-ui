import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Text,
    Button,
    ToastProvider,
    useToast,
    useTheme
} from 'quartz-ui';
import { DemoLayout, Section } from './_components/DemoLayout';

function ToastDemos() {
    const theme = useTheme();
    const toast = useToast();

    return (
        <>
            {/* Toast Types */}
            <Section title="Toast Types" subtitle="Info, success, warning, error" index={0}>
                <View style={styles.grid}>
                    <Button
                        variant="tonal"
                        onPress={() => toast.info('This is an info message')}
                        label="Info"
                        style={{ flex: 1 }}
                    />
                    <Button
                        variant="tonal"
                        onPress={() => toast.success('Operation completed!')}
                        label="Success"
                        style={{ flex: 1 }}
                    />
                    <Button
                        variant="tonal"
                        onPress={() => toast.warning('Please review this')}
                        label="Warning"
                        style={{ flex: 1 }}
                    />
                    <Button
                        variant="tonal"
                        onPress={() => toast.error('Something went wrong')}
                        label="Error"
                        style={{ flex: 1 }}
                    />
                </View>
            </Section>

            {/* With Action */}
            <Section title="With Action" subtitle="Toast with action button" index={1}>
                <Button
                    variant="filled"
                    onPress={() => toast.show({
                        message: 'Item moved to trash',
                        type: 'info',
                        action: {
                            label: 'Undo',
                            onPress: () => toast.success('Restored!'),
                        },
                    })}
                    label="Show Toast with Action"
                />
            </Section>

            {/* Custom Duration */}
            <Section title="Duration" subtitle="Control auto-dismiss timing" index={2}>
                <View style={styles.row}>
                    <Button
                        variant="outlined"
                        onPress={() => toast.show({
                            message: 'Quick toast (2s)',
                            type: 'info',
                            duration: 2000,
                        })}
                        label="2 seconds"
                    />
                    <Button
                        variant="outlined"
                        onPress={() => toast.show({
                            message: 'Long toast (8s)',
                            type: 'info',
                            duration: 8000,
                        })}
                        label="8 seconds"
                    />
                </View>
            </Section>

            {/* Multiple Toasts */}
            <Section title="Queue" subtitle="Show multiple toasts" index={3}>
                <Button
                    variant="filled"
                    onPress={() => {
                        toast.info('First message');
                        setTimeout(() => toast.success('Second message'), 300);
                        setTimeout(() => toast.warning('Third message'), 600);
                    }}
                    label="Show 3 Toasts"
                />
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12, textAlign: 'center' }}>
                    Swipe to dismiss any toast
                </Text>
            </Section>
        </>
    );
}

export default function ToastsScreen() {
    return (
        <ToastProvider maxToasts={5} position="bottom">
            <DemoLayout
                title="Toast"
                subtitle="Notifications with swipe to dismiss"
                icon="notifications"
                gradient={['#22c55e', '#16a34a']}
            >
                <ToastDemos />
            </DemoLayout>
        </ToastProvider>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
});
