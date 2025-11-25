import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Text,
    Menu,
    BottomSheet,
    SideSheet,
    Button,
    ListItem,
    Divider,
    useTheme
} from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const menuProps: PropDefinition[] = [
    {
        name: 'visible',
        type: 'boolean',
        required: true,
        description: 'Whether the menu is visible',
    },
    {
        name: 'onDismiss',
        type: '() => void',
        required: true,
        description: 'Callback when menu should be dismissed',
    },
    {
        name: 'anchor',
        type: 'React.ReactNode',
        required: true,
        description: 'Anchor element to position the menu relative to',
    },
    {
        name: 'items',
        type: 'MenuItem[]',
        required: true,
        description: 'Array of menu items',
    },
    {
        name: 'onSelect',
        type: '(key: string) => void',
        required: true,
        description: 'Callback when item is selected',
    },
    {
        name: 'position',
        type: "'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'",
        default: "'bottom-left'",
        description: 'Position relative to anchor',
    },
    {
        name: 'style',
        type: 'StyleProp<ViewStyle>',
        description: 'Style override',
    },
];

const bottomSheetProps: PropDefinition[] = [
  {
    name: 'visible',
    type: 'boolean',
    required: true,
    description: 'Whether the bottom sheet is visible',
  },
  {
    name: 'onDismiss',
    type: '() => void',
    required: true,
    description: 'Callback when sheet is dismissed',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'Content to render inside the sheet',
  },
  {
    name: 'modal',
    type: 'boolean',
    default: 'true',
    description: 'Whether the sheet is modal (has backdrop)',
  },
  {
    name: 'showDragHandle',
    type: 'boolean',
    default: 'true',
    description: 'Show the drag handle',
  },
  {
    name: 'height',
    type: "'auto' | number | string",
    default: "'auto'",
    description: 'Height of the sheet',
  },
  {
    name: 'dismissable',
    type: 'boolean',
    default: 'true',
    description: 'Allow dismissing by dragging down',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override',
  },
];const sideSheetProps: PropDefinition[] = [
    {
        name: 'open',
        type: 'boolean',
        required: true,
        description: 'Whether the sheet is open',
    },
    {
        name: 'onClose',
        type: '() => void',
        required: true,
        description: 'Callback when sheet should close',
    },
    {
        name: 'children',
        type: 'React.ReactNode',
        required: true,
        description: 'Content to render inside the sheet',
    },
    {
        name: 'title',
        type: 'string',
        description: 'Sheet title',
    },
    {
        name: 'variant',
        type: "'modal' | 'standard'",
        default: "'modal'",
        description: 'Sheet variant',
    },
    {
        name: 'position',
        type: "'start' | 'end'",
        default: "'end'",
        description: 'Position of the sheet',
    },
    {
        name: 'showHeader',
        type: 'boolean',
        default: 'true',
        description: 'Whether to show the header',
    },
    {
        name: 'header',
        type: 'React.ReactNode',
        description: 'Custom header content',
    },
    {
        name: 'footer',
        type: 'React.ReactNode',
        description: 'Custom footer content',
    },
    {
        name: 'dismissable',
        type: 'boolean',
        default: 'true',
        description: 'Allow dismissing by tapping scrim',
    },
    {
        name: 'style',
        type: 'StyleProp<ViewStyle>',
        description: 'Style override',
    },
];

export default function OverlaysDocPage() {
    const theme = useTheme();

    // Menu state
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');

    // Bottom Sheet state
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

    // Side Sheet state
    const [sideSheetOpen, setSideSheetOpen] = useState(false);

    const menuItems = [
        { key: 'edit', label: 'Edit', icon: <Ionicons name="pencil" size={20} /> },
        { key: 'copy', label: 'Copy', icon: <Ionicons name="copy" size={20} /> },
        { key: 'share', label: 'Share', icon: <Ionicons name="share" size={20} /> },
        { key: 'delete', label: 'Delete', icon: <Ionicons name="trash" size={20} />, destructive: true },
    ];

    return (
        <DocLayout
            title="Overlays & Sheets"
            description="Components for displaying content in overlays, sheets, and menus"
        >
            {/* Menu Section */}
            <Animated.View entering={FadeInDown.delay(100).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Menu
                </Text>
                <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Menus display a list of choices on a temporary surface. They appear when
                    users interact with a button, action, or other control.
                </Text>
            </Animated.View>

            {/* Basic Menu */}
            <Animated.View entering={FadeInDown.delay(200).springify()}>
                <CodePlayground
                    title="Basic Menu"
                    description="Dropdown menu with icons and actions"
                    code={`const [visible, setVisible] = useState(false);

const menuItems = [
  { key: 'edit', label: 'Edit', icon: <Icon name="pencil" /> },
  { key: 'copy', label: 'Copy', icon: <Icon name="copy" /> },
  { key: 'share', label: 'Share', icon: <Icon name="share" /> },
  { key: 'delete', label: 'Delete', destructive: true },
];

<Menu
  visible={visible}
  onDismiss={() => setVisible(false)}
  anchor={<Button onPress={() => setVisible(true)}>Open Menu</Button>}
  items={menuItems}
  onSelect={(key) => {
    console.log('Selected:', key);
    setVisible(false);
  }}
/>`}
                    preview={
                        <View style={styles.demoContainer}>
                            <Menu
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                anchor={
                                    <Button onPress={() => setMenuVisible(true)} variant="outlined">
                                        Open Menu
                                    </Button>
                                }
                                items={menuItems}
                                onSelect={(key) => {
                                    setSelectedItem(key);
                                    setMenuVisible(false);
                                }}
                            />
                            {selectedItem && (
                                <Text variant="bodyMedium" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
                                    Selected: {selectedItem}
                                </Text>
                            )}
                        </View>
                    }
                />
            </Animated.View>

            {/* Menu Props */}
            <Animated.View entering={FadeInDown.delay(300).springify()}>
                <PropsTable
                    title="Menu"
                    props={menuProps}
                />
            </Animated.View>

            {/* Bottom Sheet Section */}
            <Animated.View entering={FadeInDown.delay(400).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 48 }]}>
                    Bottom Sheet
                </Text>
                <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Bottom sheets are surfaces containing supplementary content that are anchored
                    to the bottom of the screen. They support snap points and gestures.
                </Text>
            </Animated.View>

            {/* Basic Bottom Sheet */}
            <Animated.View entering={FadeInDown.delay(500).springify()}>
                <CodePlayground
                    title="Basic Bottom Sheet"
                    description="Draggable sheet with snap points"
                    code={`const [visible, setVisible] = useState(false);

<Button onPress={() => setVisible(true)}>
  Open Bottom Sheet
</Button>

<BottomSheet
  visible={visible}
  onDismiss={() => setVisible(false)}
>
  <View style={{ padding: 24 }}>
    <Text variant="headlineSmall">Sheet Content</Text>
    <Text variant="bodyMedium">
      Drag down to dismiss
    </Text>
  </View>
</BottomSheet>`}
                    preview={
                        <View style={styles.demoContainer}>
                            <Button
                                onPress={() => setBottomSheetOpen(true)}
                                variant="filled"
                            >
                                Open Bottom Sheet
                            </Button>
                            <BottomSheet
                                visible={bottomSheetOpen}
                                onDismiss={() => setBottomSheetOpen(false)}
                            >
                                <View style={{ padding: 24 }}>
                                    <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
                                        Sheet Content
                                    </Text>
                                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
                                        This is a bottom sheet. You can drag it up and down to explore
                                        different snap points. The sheet can contain any content.
                                    </Text>
                                    <ListItem
                                        headline="Option 1"
                                        supportingText="Description for option 1"
                                        leading={<Ionicons name="star" size={24} color={theme.colors.primary} />}
                                    />
                                    <Divider inset="none" />
                                    <ListItem
                                        headline="Option 2"
                                        supportingText="Description for option 2"
                                        leading={<Ionicons name="heart" size={24} color={theme.colors.primary} />}
                                    />
                                    <Divider inset="none" />
                                    <ListItem
                                        headline="Option 3"
                                        supportingText="Description for option 3"
                                        leading={<Ionicons name="bookmark" size={24} color={theme.colors.primary} />}
                                    />
                                    <View style={{ marginTop: 24 }}>
                                        <Button onPress={() => setBottomSheetOpen(false)}>
                                            Close Sheet
                                        </Button>
                                    </View>
                                </View>
                            </BottomSheet>
                        </View>
                    }
                />
            </Animated.View>

            {/* Bottom Sheet Props */}
            <Animated.View entering={FadeInDown.delay(600).springify()}>
                <PropsTable
                    title="BottomSheet"
                    props={bottomSheetProps}
                />
            </Animated.View>

            {/* Side Sheet Section */}
            <Animated.View entering={FadeInDown.delay(700).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 48 }]}>
                    Side Sheet
                </Text>
                <Text variant="bodyLarge" style={[styles.sectionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Side sheets are surfaces containing supplementary content or actions.
                    They slide in from the side of the screen.
                </Text>
            </Animated.View>

            {/* Basic Side Sheet */}
            <Animated.View entering={FadeInDown.delay(800).springify()}>
                <CodePlayground
                    title="Basic Side Sheet"
                    description="Modal side sheet with header"
                    code={`const [open, setOpen] = useState(false);

<Button onPress={() => setOpen(true)}>
  Open Side Sheet
</Button>

<SideSheet
  open={open}
  onClose={() => setOpen(false)}
  title="Settings"
  position="end"
>
  <View style={{ padding: 24 }}>
    <Text variant="bodyMedium">
      Side sheet content here
    </Text>
  </View>
</SideSheet>`}
                    preview={
                        <View style={styles.demoContainer}>
                            <Button
                                onPress={() => setSideSheetOpen(true)}
                                variant="filled"
                            >
                                Open Side Sheet
                            </Button>
                            <SideSheet
                                open={sideSheetOpen}
                                onClose={() => setSideSheetOpen(false)}
                                title="Settings"
                                position="end"
                            >
                                <View style={{ padding: 24 }}>
                                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
                                        This is a side sheet. It slides in from the side of the screen
                                        and is useful for supplementary content or navigation.
                                    </Text>
                                    <ListItem
                                        headline="Account"
                                        supportingText="Manage your account settings"
                                        leading={<Ionicons name="person" size={24} color={theme.colors.primary} />}
                                    />
                                    <Divider inset="none" />
                                    <ListItem
                                        headline="Notifications"
                                        supportingText="Configure notification preferences"
                                        leading={<Ionicons name="notifications" size={24} color={theme.colors.primary} />}
                                    />
                                    <Divider inset="none" />
                                    <ListItem
                                        headline="Privacy"
                                        supportingText="Privacy and security settings"
                                        leading={<Ionicons name="shield" size={24} color={theme.colors.primary} />}
                                    />
                                    <View style={{ marginTop: 24 }}>
                                        <Button onPress={() => setSideSheetOpen(false)}>
                                            Close
                                        </Button>
                                    </View>
                                </View>
                            </SideSheet>
                        </View>
                    }
                />
            </Animated.View>

            {/* Side Sheet Props */}
            <Animated.View entering={FadeInDown.delay(900).springify()}>
                <PropsTable
                    title="SideSheet"
                    props={sideSheetProps}
                />
            </Animated.View>

            {/* Guidelines Section */}
            <Animated.View entering={FadeInDown.delay(1000).springify()}>
                <Text variant="headlineMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 48 }]}>
                    Usage Guidelines
                </Text>

                <View style={[styles.guidelineCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
                        Choosing the Right Overlay
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        • <Text style={{ fontWeight: '600' }}>Menu:</Text> Use for quick actions
                        and selections from a list of options
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        • <Text style={{ fontWeight: '600' }}>Bottom Sheet:</Text> Use for content
                        that requires more space, like sharing options or filters
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        • <Text style={{ fontWeight: '600' }}>Side Sheet:</Text> Use for
                        supplementary content on larger screens
                    </Text>
                </View>

                <View style={[styles.guidelineCard, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
                        Best Practices
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        • Always provide a way to dismiss overlays (scrim tap, close button)
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        • Keep menu items scannable - limit to 5-7 options when possible
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        • Bottom sheets should be dismissable by dragging down
                    </Text>
                </View>
            </Animated.View>
        </DocLayout>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        marginBottom: 8,
        marginTop: 24,
    },
    sectionDescription: {
        marginBottom: 24,
    },
    demoContainer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    guidelineCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
});
