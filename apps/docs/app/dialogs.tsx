import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Dialog, AlertDialog, Button, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DocLayout } from './_components/DocLayout';
import { CodePlayground } from './_components/CodePlayground';
import { PropsTable, PropDefinition } from './_components/PropsTable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const dialogProps: PropDefinition[] = [
  {
    name: 'visible',
    type: 'boolean',
    description: 'Whether the dialog is visible',
  },
  {
    name: 'onDismiss',
    type: '() => void',
    description: 'Callback when dialog is dismissed',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Dialog title',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    description: 'Dialog content/message',
  },
  {
    name: 'actions',
    type: 'DialogAction[]',
    description: 'Action buttons (label, onPress, variant)',
  },
  {
    name: 'fullScreen',
    type: 'boolean',
    default: 'false',
    description: 'Whether to show full-screen dialog',
  },
  {
    name: 'dismissable',
    type: 'boolean',
    default: 'true',
    description: 'Whether to dismiss on backdrop press',
  },
  {
    name: 'icon',
    type: 'React.ReactNode',
    description: 'Custom icon or illustration',
  },
  {
    name: 'contentStyle',
    type: 'StyleProp<ViewStyle>',
    description: 'Style override for content',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

const alertDialogProps: PropDefinition[] = [
  {
    name: 'visible',
    type: 'boolean',
    description: 'Whether the alert dialog is visible',
  },
  {
    name: 'onDismiss',
    type: '() => void',
    description: 'Callback when dialog is dismissed',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Alert dialog title',
  },
  {
    name: 'message',
    type: 'string',
    description: 'Alert dialog message',
  },
  {
    name: 'confirmLabel',
    type: 'string',
    default: "'OK'",
    description: 'Label for confirm button',
  },
  {
    name: 'cancelLabel',
    type: 'string',
    description: 'Label for cancel button (optional)',
  },
  {
    name: 'onConfirm',
    type: '() => void',
    description: 'Callback when confirmed',
  },
  {
    name: 'destructive',
    type: 'boolean',
    default: 'false',
    description: 'Whether action is destructive (uses filled variant)',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier',
  },
];

export default function DialogsDocPage() {
  const theme = useTheme();
  const [basicDialog, setBasicDialog] = useState(false);
  const [iconDialog, setIconDialog] = useState(false);
  const [fullScreenDialog, setFullScreenDialog] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [destructiveAlert, setDestructiveAlert] = useState(false);

  return (
    <DocLayout
      title="Dialogs"
      description="Modal windows that display important information or require user interaction"
    >
      {/* Overview */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 26 }}>
          Dialogs inform users about a task and can contain critical information, require decisions, or involve
          multiple tasks. They appear in front of app content to provide information or ask for a decision.
        </Text>
      </Animated.View>

      {/* Import */}
      <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.section}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Import
        </Text>
        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace' }}
          >
            {`import { Dialog, AlertDialog } from 'quartz-ui';`}
          </Text>
        </View>
      </Animated.View>

      {/* Examples */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 20 }}>
          Examples
        </Text>

        {/* Basic Dialog */}
        <CodePlayground
          title="Basic Dialog"
          description="Dialog with title, content, and action buttons"
          code={`const [visible, setVisible] = useState(false);

<Button onPress={() => setVisible(true)}>
  Show Dialog
</Button>

<Dialog
  visible={visible}
  onDismiss={() => setVisible(false)}
  title="Dialog Title"
  actions={[
    { label: 'Cancel', onPress: () => setVisible(false), variant: 'text' },
    { label: 'Confirm', onPress: () => setVisible(false), variant: 'filled' }
  ]}
>
  This is a basic dialog with a title, content, and action buttons.
  Dialogs can contain any content you need.
</Dialog>`}
          preview={
            <>
              <Button variant="filled" onPress={() => setBasicDialog(true)}>
                Show Basic Dialog
              </Button>
              <Dialog
                visible={basicDialog}
                onDismiss={() => setBasicDialog(false)}
                title="Dialog Title"
                actions={[
                  { label: 'Cancel', onPress: () => setBasicDialog(false), variant: 'text' },
                  { label: 'Confirm', onPress: () => setBasicDialog(false), variant: 'filled' }
                ]}
              >
                This is a basic dialog with a title, content, and action buttons.
                Dialogs can contain any content you need.
              </Dialog>
            </>
          }
        />

        {/* Dialog with Icon */}
        <CodePlayground
          title="Dialog with Icon"
          description="Dialog featuring an icon for visual emphasis"
          code={`<Dialog
  visible={visible}
  onDismiss={() => setVisible(false)}
  title="Success"
  icon={<Ionicons name="checkmark-circle" size={56} color={theme.colors.primary} />}
  actions={[
    { label: 'Done', onPress: () => setVisible(false), variant: 'filled' }
  ]}
>
  Your changes have been saved successfully!
</Dialog>`}
          preview={
            <>
              <Button variant="filled" onPress={() => setIconDialog(true)}>
                Show Icon Dialog
              </Button>
              <Dialog
                visible={iconDialog}
                onDismiss={() => setIconDialog(false)}
                title="Success"
                icon={<Ionicons name="checkmark-circle" size={56} color={theme.colors.primary} />}
                actions={[
                  { label: 'Done', onPress: () => setIconDialog(false), variant: 'filled' }
                ]}
              >
                Your changes have been saved successfully!
              </Dialog>
            </>
          }
        />

        {/* Full-Screen Dialog */}
        <CodePlayground
          title="Full-Screen Dialog"
          description="Dialog that takes up the entire screen"
          code={`<Dialog
  visible={visible}
  onDismiss={() => setVisible(false)}
  fullScreen
  title="Full-Screen Dialog"
  actions={[
    { label: 'Cancel', onPress: () => setVisible(false), variant: 'text' },
    { label: 'Save', onPress: () => setVisible(false), variant: 'filled' }
  ]}
>
  <View style={{ gap: 16 }}>
    <Text variant="bodyLarge">
      Full-screen dialogs are useful for complex forms or
      multi-step workflows that need more space.
    </Text>
    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
      They can contain scrollable content and multiple sections
      of information or input fields.
    </Text>
  </View>
</Dialog>`}
          preview={
            <>
              <Button variant="filled" onPress={() => setFullScreenDialog(true)}>
                Show Full-Screen Dialog
              </Button>
              <Dialog
                visible={fullScreenDialog}
                onDismiss={() => setFullScreenDialog(false)}
                fullScreen
                title="Full-Screen Dialog"
                actions={[
                  { label: 'Cancel', onPress: () => setFullScreenDialog(false), variant: 'text' },
                  { label: 'Save', onPress: () => setFullScreenDialog(false), variant: 'filled' }
                ]}
              >
                <View style={{ gap: 16 }}>
                  <Text variant="bodyLarge">
                    Full-screen dialogs are useful for complex forms or
                    multi-step workflows that need more space.
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    They can contain scrollable content and multiple sections
                    of information or input fields.
                  </Text>
                </View>
              </Dialog>
            </>
          }
        />

        {/* Alert Dialog */}
        <CodePlayground
          title="Alert Dialog"
          description="Simple alert with confirm button"
          code={`const [visible, setVisible] = useState(false);

<AlertDialog
  visible={visible}
  onDismiss={() => setVisible(false)}
  title="Information"
  message="This is a simple alert dialog with a confirmation button."
  confirmLabel="OK"
/>`}
          preview={
            <>
              <Button variant="filled" onPress={() => setAlertDialog(true)}>
                Show Alert
              </Button>
              <AlertDialog
                visible={alertDialog}
                onDismiss={() => setAlertDialog(false)}
                title="Information"
                message="This is a simple alert dialog with a confirmation button."
                confirmLabel="OK"
              />
            </>
          }
        />

        {/* Destructive Alert */}
        <CodePlayground
          title="Destructive Alert"
          description="Alert for destructive actions with cancel option"
          code={`<AlertDialog
  visible={visible}
  onDismiss={() => setVisible(false)}
  title="Delete Item?"
  message="This action cannot be undone. Are you sure you want to delete this item?"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  destructive
  onConfirm={() => {
    // Handle delete action
    console.log('Item deleted');
  }}
/>`}
          preview={
            <>
              <Button variant="filled" onPress={() => setDestructiveAlert(true)}>
                Show Destructive Alert
              </Button>
              <AlertDialog
                visible={destructiveAlert}
                onDismiss={() => setDestructiveAlert(false)}
                title="Delete Item?"
                message="This action cannot be undone. Are you sure you want to delete this item?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                destructive
                onConfirm={() => {
                  console.log('Item deleted');
                }}
              />
            </>
          }
        />

        {/* Non-Dismissable Dialog */}
        <CodePlayground
          title="Non-Dismissable Dialog"
          description="Dialog that requires explicit user action"
          code={`<Dialog
  visible={visible}
  onDismiss={() => setVisible(false)}
  dismissable={false}
  title="Action Required"
  actions={[
    { label: 'Take Action', onPress: () => setVisible(false), variant: 'filled' }
  ]}
>
  This dialog cannot be dismissed by tapping outside or using
  the back button. You must select an action.
</Dialog>`}
          preview={
            <>
              <Button variant="outlined">Show Non-Dismissable</Button>
            </>
          }
        />
      </View>

      {/* Dialog Props API */}
      <PropsTable props={dialogProps} title="Dialog API Reference" />

      {/* AlertDialog Props API */}
      <PropsTable props={alertDialogProps} title="AlertDialog API Reference" />

      {/* Accessibility */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Accessibility
        </Text>
        <View style={[styles.accessibilityCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Modal Accessibility
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Dialogs are announced as alerts and trap focus within the modal
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Back Button Support
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Android hardware back button dismisses the dialog (if dismissable)
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Scrim Backdrop
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Semi-transparent backdrop with haptic feedback on dismiss
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityItem}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.onTertiaryContainer} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: '600' }}>
                Smooth Animations
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onTertiaryContainer, marginTop: 4, opacity: 0.9 }}>
                Spring-based entrance and exit animations for natural feel
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Best Practices */}
      <Animated.View entering={FadeInDown.springify()} style={styles.section}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
          Best Practices
        </Text>
        <View style={styles.bestPracticesList}>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Keep dialog content concise and focused on a single task or decision
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use <Text style={{ fontWeight: '600' }}>AlertDialog</Text> for simple confirmations and notifications
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Place primary action on the right, secondary/cancel action on the left
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Use full-screen dialogs for complex workflows with multiple steps or extensive content
            </Text>
          </View>
          <View style={styles.bestPracticeItem}>
            <View style={[styles.bestPracticeBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimaryContainer} />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flex: 1, lineHeight: 22 }}>
              Set dismissable to false for critical actions that require explicit user response
            </Text>
          </View>
        </View>
      </Animated.View>
    </DocLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 48,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 12,
  },
  accessibilityCard: {
    padding: 24,
    borderRadius: 16,
    gap: 20,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bestPracticesList: {
    gap: 16,
  },
  bestPracticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bestPracticeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});
