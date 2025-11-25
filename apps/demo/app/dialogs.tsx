import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Button, Dialog, Snackbar, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import { DemoLayout, Section } from './_components/DemoLayout';

export default function DialogsScreen() {
  const theme = useTheme();
  const [basicDialog, setBasicDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [simpleSnackbar, setSimpleSnackbar] = useState(false);
  const [actionSnackbar, setActionSnackbar] = useState(false);

  return (
    <DemoLayout
      title="Dialogs & Snackbars"
      subtitle="Alerts, modals & notifications"
      icon="chatbox-ellipses"
      gradient={['#a18cd1', '#fbc2eb']}
    >
      <Section title="Basic Dialogs" subtitle="Simple dialog windows" index={0}>
        <View style={styles.buttonGroup}>
          <Button variant="filled" onPress={() => setBasicDialog(true)}>
            Show Basic Dialog
          </Button>
          <Button variant="outlined" onPress={() => setConfirmDialog(true)}>
            Show Confirm Dialog
          </Button>
          <Button variant="tonal" onPress={() => setAlertDialog(true)}>
            Show Alert
          </Button>
        </View>
      </Section>

      <Section title="Snackbars" subtitle="Brief messages at bottom of screen" index={1}>
        <View style={styles.buttonGroup}>
          <Button variant="filled" onPress={() => setSimpleSnackbar(true)}>
            Simple Snackbar
          </Button>
          <Button variant="outlined" onPress={() => setActionSnackbar(true)}>
            With Action
          </Button>
        </View>
      </Section>

      <Section title="Dialog Guidelines" subtitle="Best practices" index={2}>
        <View style={[styles.guideCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons name="information-circle" size={28} color={theme.colors.onPrimaryContainer} />
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 12, fontWeight: '600' }}>
            When to Use Dialogs
          </Text>
          <View style={styles.guideList}>
            <View style={styles.guideItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.onPrimaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 12, flex: 1 }}>
                Important decisions or confirmations
              </Text>
            </View>
            <View style={styles.guideItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.onPrimaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 12, flex: 1 }}>
                Critical information that requires acknowledgment
              </Text>
            </View>
            <View style={styles.guideItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.onPrimaryContainer} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 12, flex: 1 }}>
                Quick actions that don't require full screen
              </Text>
            </View>
          </View>
        </View>
      </Section>

      {/* Dialogs */}
      <Dialog visible={basicDialog} onDismiss={() => setBasicDialog(false)} title="Basic Dialog">
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          This is a simple dialog with a title and content.
        </Text>
        <View style={styles.dialogActions}>
          <Button variant="text" onPress={() => setBasicDialog(false)}>Close</Button>
        </View>
      </Dialog>

      <Dialog visible={confirmDialog} onDismiss={() => setConfirmDialog(false)} title="Confirm Action">
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          Are you sure you want to proceed with this action?
        </Text>
        <View style={styles.dialogActions}>
          <Button variant="text" onPress={() => setConfirmDialog(false)}>Cancel</Button>
          <Button variant="filled" onPress={() => setConfirmDialog(false)}>Confirm</Button>
        </View>
      </Dialog>

      <Dialog visible={alertDialog} onDismiss={() => setAlertDialog(false)} title="Alert">
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          This is an important alert message.
        </Text>
        <View style={styles.dialogActions}>
          <Button variant="filled" onPress={() => setAlertDialog(false)}>OK</Button>
        </View>
      </Dialog>

      {/* Snackbars */}
      <Snackbar visible={simpleSnackbar} onDismiss={() => setSimpleSnackbar(false)} duration={3000}>
        Message sent successfully
      </Snackbar>

      <Snackbar
        visible={actionSnackbar}
        onDismiss={() => setActionSnackbar(false)}
        action={{ label: 'Undo', onPress: () => {} }}
        duration={3000}
      >
        Item deleted
      </Snackbar>
    </DemoLayout>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    gap: 12,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  guideCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  guideList: {
    width: '100%',
    gap: 16,
    marginTop: 16,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
