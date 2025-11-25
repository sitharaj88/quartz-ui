/**
 * Quartz UI Demo - Root Layout
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QuartzProvider, createLightTheme, createDarkTheme } from 'quartz-ui';

// Create custom themes (optional - you can use defaults)
const lightTheme = createLightTheme();
const darkTheme = createDarkTheme();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QuartzProvider
        initialMode="system"
        lightTheme={lightTheme}
        darkTheme={darkTheme}
      >
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </QuartzProvider>
    </GestureHandlerRootView>
  );
}