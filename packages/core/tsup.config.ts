import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: [
    'react',
    'react-native',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-safe-area-context',
    'expo',
    'expo-haptics',
    'expo-linear-gradient',
  ],
  banner: {
    js: '"use client";',
  },
});
