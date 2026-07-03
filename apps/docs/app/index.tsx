import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, StatusBar, ScrollView, Platform, NativeSyntheticEvent, NativeScrollEvent, useWindowDimensions, Linking, Share, TextStyle } from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  useQuartzTheme,
  QuartzProvider,
  createDynamicThemes,
  generateTonalPalette,
  Button,
  Chip,
  Switch,
  Slider,
  TextInput,
  ProgressIndicator,
  Checkbox,
  RadioButton,
  Badge,
  IconButton,
  Avatar,
} from 'quartz-ui';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { WebPressableState, webStyle } from './_components/webTypes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Accent,
  accents,
  accentColor,
  accentTint,
  brandGradient,
  sweepGradient,
} from './_components/accents';

type IconName = keyof typeof Ionicons.glyphMap;

/** Text-flavored twin of `webStyle` — for web-only CSS on <Text> (gradient text). */
const webTextStyle = (style: Record<string, unknown>): TextStyle => style as TextStyle;

const DOCS_URL = 'https://sitharaj88.github.io/quartz-ui/';
const GITHUB_URL = 'https://github.com/sitharaj88/quartz-ui';

interface Feature {
  icon: IconName;
  title: string;
  description: string;
  accent: Accent;
}

const features: Feature[] = [
  { icon: 'cube', title: '40 Components', description: 'Every Material 3 primitive — forms, navigation, overlays, feedback, layout', accent: accents.gettingStarted },
  { icon: 'accessibility', title: 'WCAG 2.2 AA', description: 'Roles, states, ≥48dp touch targets, focus-visible rings, live regions', accent: accents.dataDisplay },
  { icon: 'eye-off', title: 'Reduce-motion aware', description: 'Animations skip / shorten when the OS asks. No motion sickness.', accent: accents.cards },
  { icon: 'language', title: 'Real RTL', description: 'Logical paddings throughout, direction-aware layouts out of the box', accent: accents.inputs },
  { icon: 'flash', title: 'Reanimated 3 perf', description: 'State-layer transitions on the UI thread. Zero re-renders during press.', accent: accents.feedback },
  { icon: 'code-slash', title: 'TypeScript-first', description: 'Strict types, JSDoc on every prop, imperative refs where it matters', accent: accents.foundations },
];

const componentCategories = [
  { name: 'Core Components', icon: 'radio-button-on' as IconName, accent: accents.buttons, count: 8, items: ['Button', 'FAB', 'Icon Button', 'Card', 'Typography', 'Surface'], route: '/buttons' },
  { name: 'Inputs & Selection', icon: 'create' as IconName, accent: accents.inputs, count: 9, items: ['Text Input', 'Checkbox', 'Switch', 'Radio', 'Chip', 'Picker'], route: '/inputs' },
  { name: 'Navigation', icon: 'navigate' as IconName, accent: accents.navigation, count: 8, items: ['App Bar', 'Nav Bar', 'Tabs', 'Drawer', 'Rail', 'Search'], route: '/navigation' },
  { name: 'Data Display', icon: 'albums' as IconName, accent: accents.dataDisplay, count: 7, items: ['List', 'Badge', 'Divider', 'Carousel', 'Slider', 'Progress'], route: '/lists' },
  { name: 'Feedback', icon: 'chatbubbles' as IconName, accent: accents.feedback, count: 5, items: ['Dialog', 'Snackbar', 'Banner', 'Tooltip', 'Progress'], route: '/dialogs' },
  { name: 'Overlays', icon: 'layers' as IconName, accent: accents.overlays, count: 5, items: ['Menu', 'Bottom Sheet', 'Side Sheet', 'Modal'], route: '/overlays' },
];

// Stats data — 40 components · 540 tests · WCAG 2.2 AA · Apache-2.0
const stats = [
  { value: '40', label: 'Components', accent: accents.gettingStarted },
  { value: '540', label: 'Tests passing', accent: accents.inputs },
  { value: 'AA', label: 'WCAG 2.2', accent: accents.dataDisplay },
  { value: 'Apache-2.0', label: 'License', accent: accents.feedback },
];

const LICENSE_URL = 'https://github.com/sitharaj88/quartz-ui/blob/main/LICENSE';

// Code example for the developer experience section
const codeExample = `import { Button, Card, Text } from 'quartz-ui';

function MyComponent() {
  return (
    <Card>
      <Text variant="headlineSmall">
        Hello Quartz UI!
      </Text>
      <Button mode="filled" onPress={handlePress}>
        Get Started
      </Button>
    </Card>
  );
}`;

/** Three-way theme toggle: light → dark → system → light. */
function LandingThemeToggle() {
  const { mode, setMode } = useQuartzTheme();
  const theme = useTheme();
  const next = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
  const icon = mode === 'dark' ? 'moon' : mode === 'light' ? 'sunny' : 'contrast';
  const label = mode === 'dark' ? 'Dark mode' : mode === 'light' ? 'Light mode' : 'System mode';
  return (
    <Pressable
      onPress={() => setMode(next)}
      accessibilityRole="button"
      accessibilityLabel={`Theme: ${label}. Tap to switch.`}
      style={({ pressed, hovered }: WebPressableState) => [
        {
          width: 40,
          height: 40,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed
            ? theme.colors.primaryContainer
            : (hovered as boolean)
              ? theme.colors.surfaceVariant
              : 'transparent',
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={theme.colors.onSurface} />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Hero live demo — a real mini-app built from quartz-ui components, running
// inside a self-contained phone bezel with its own nested QuartzProvider.
// ---------------------------------------------------------------------------

const DEMO_SEEDS = [
  { name: 'Quartz Violet', color: '#6750A4' },
  { name: 'Ocean Blue', color: '#1A73E8' },
  { name: 'Evergreen', color: '#0F9D58' },
  { name: 'Sunset Coral', color: '#F4511E' },
  { name: 'Raspberry', color: '#D81B60' },
  { name: 'Deep Teal', color: '#00897B' },
];

const DEMO_INTEREST_KEYS = ['Design', 'Travel', 'Music'] as const;

/**
 * Real-device proportions — iPhone 15 is 71.6 × 147.6 mm ≈ 1 : 2.06.
 * The bezel is given a FIXED height from this ratio (never content-driven),
 * so the silhouette always reads as an actual phone.
 */
const PHONE_ASPECT = 2.08;

/** Self-contained iPhone-style bezel — decoupled from the docs playground frame. */
function PhoneBezel({ children, width }: { children: React.ReactNode; width: number }) {
  const height = Math.round(width * PHONE_ASPECT);
  return (
    <View style={[styles.phoneShadow, { width }]}>
      <View style={[styles.phoneBezel, { height }]}>
        <LinearGradient
          colors={['#1c1c1f', '#0a0a0c', '#1c1c1f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.phoneScreen}>
          {children}
          <View pointerEvents="none" style={styles.phoneIsland}>
            <View style={styles.phoneIslandCamera} />
          </View>
        </View>
      </View>
    </View>
  );
}

interface DemoScreenProps {
  name: string;
  onName: (value: string) => void;
  interests: Record<string, boolean>;
  onToggleInterest: (key: string) => void;
  notify: boolean;
  onNotify: (value: boolean) => void;
  textSize: number;
  onTextSize: (value: number) => void;
}

/** Runs under the nested QuartzProvider — every color below re-themes with the seed. */
function DemoScreen({ name, onName, interests, onToggleInterest, notify, onNotify, textSize, onTextSize }: DemoScreenProps) {
  const theme = useTheme();
  const selectedCount = DEMO_INTEREST_KEYS.filter((k) => interests[k]).length;
  const completeness = Math.min(
    100,
    25 + (name.trim() ? 30 : 0) + selectedCount * 10 + (notify ? 15 : 0)
  );
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'Q';

  return (
    <View style={[styles.demoScreen, { backgroundColor: theme.colors.background }]}>
      {/* Status bar */}
      <View style={styles.demoStatusBar}>
        <Text style={{ color: theme.colors.onSurface, fontSize: 13, fontWeight: '700', letterSpacing: 0.2 }}>
          9:41
        </Text>
        <View style={styles.demoStatusIcons}>
          <Ionicons name="cellular" size={12} color={theme.colors.onSurface} />
          <Ionicons name="wifi" size={13} color={theme.colors.onSurface} />
          <Ionicons name="battery-full" size={17} color={theme.colors.onSurface} />
        </View>
      </View>

      <View style={styles.demoBody}>
        {/* Profile header */}
        <View style={styles.demoProfileRow}>
          <View style={[styles.demoAvatar, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700', fontSize: 15 }}>
              {initials}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={{ color: theme.colors.onSurface, fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>
              {name.trim() || 'Your profile'}
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12, marginTop: 1 }}>
              Product designer
            </Text>
          </View>
          <View style={[styles.demoProBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Text style={{ color: theme.colors.onSecondaryContainer, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 }}>
              PRO
            </Text>
          </View>
        </View>

        <TextInput
          variant="outlined"
          label="Display name"
          value={name}
          onChangeText={onName}
          fullWidth
        />

        {/* Interests */}
        <View>
          <Text style={[styles.demoFieldLabel, { color: theme.colors.onSurfaceVariant }]}>
            Interests
          </Text>
          <View style={styles.demoChipsRow}>
            {DEMO_INTEREST_KEYS.map((key) => (
              <Chip
                key={key}
                label={key}
                variant="filter"
                selected={!!interests[key]}
                onPress={() => onToggleInterest(key)}
              />
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.demoSettingRow}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ color: theme.colors.onSurface, fontSize: 14, fontWeight: '600' }}>
              Notifications
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 11, marginTop: 1 }}>
              {notify ? 'Push alerts on' : 'Push alerts off'}
            </Text>
          </View>
          <Switch value={notify} onValueChange={onNotify} accessibilityLabel="Notifications" />
        </View>

        {/* Text size slider */}
        <View>
          <View style={styles.demoSliderHeader}>
            <Text style={[styles.demoFieldLabel, { color: theme.colors.onSurfaceVariant, marginBottom: 0 }]}>
              Text size
            </Text>
            <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '700' }}>
              {Math.round(textSize)}pt
            </Text>
          </View>
          <Slider value={textSize} min={12} max={24} step={1} onValueChange={onTextSize} />
        </View>

        {/* Profile strength */}
        <View>
          <View style={styles.demoSliderHeader}>
            <Text style={[styles.demoFieldLabel, { color: theme.colors.onSurfaceVariant, marginBottom: 0 }]}>
              Profile strength
            </Text>
            <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '700' }}>
              {completeness}%
            </Text>
          </View>
          <ProgressIndicator variant="linear" progress={completeness} />
        </View>

        <Button variant="filled" fullWidth label="Save profile" onPress={() => {}} />
      </View>

      {/* Home indicator */}
      <View style={styles.demoHomeWrap}>
        <View style={[styles.demoHomeBar, { backgroundColor: theme.colors.onSurface }]} />
      </View>
    </View>
  );
}

/** Phone + glow + seed swatches + demo light/dark toggle. */
function HeroDemo({ isMobile }: { isMobile: boolean }) {
  const theme = useTheme();
  const { mode: siteMode } = useQuartzTheme();
  const { width: viewportWidth } = useWindowDimensions();

  const [seed, setSeed] = useState(DEMO_SEEDS[0]);
  const [modeOverride, setModeOverride] = useState<'light' | 'dark' | null>(null);
  const [name, setName] = useState('Ava Chen');
  const [interests, setInterests] = useState<Record<string, boolean>>({ Design: true, Travel: false, Music: true });
  const [notify, setNotify] = useState(true);
  const [textSize, setTextSize] = useState(16);

  const demoMode: 'light' | 'dark' = modeOverride ?? (theme.mode === 'dark' || siteMode === 'dark' ? 'dark' : 'light');
  const demoThemes = useMemo(() => createDynamicThemes(seed.color), [seed.color]);
  const phoneWidth = Math.min(330, Math.floor(viewportWidth * 0.86));

  const toggleInterest = useCallback((key: string) => {
    setInterests((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <View style={{ alignItems: 'center', width: isMobile ? '100%' : undefined }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* Soft layered glow behind the phone — recolors with the seed.
            Radial CSS gradients on web; soft LinearGradient fallback elsewhere. */}
        <View pointerEvents="none" style={styles.heroGlowWrap}>
          {Platform.OS === 'web' ? (
            <>
              {/* Two-tone glow: the seed hue anchors the large orb, a pink
                  companion orb makes it a violet→pink gradient by default. */}
              <View
                style={[
                  styles.heroGlowLarge,
                  webStyle({ backgroundImage: `radial-gradient(closest-side, ${seed.color}59, ${seed.color}00)` }),
                ]}
              />
              <View
                style={[
                  styles.heroGlowSmall,
                  webStyle({
                    backgroundImage: `radial-gradient(closest-side, ${accentTint(accents.cards, false, 0.33)}, ${accentTint(accents.cards, false, 0)})`,
                  }),
                ]}
              />
            </>
          ) : (
            <LinearGradient
              colors={[seed.color + '40', accentTint(accents.cards, false, 0.16), seed.color + '00']}
              start={{ x: 0.5, y: 0.1 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.heroGlowLarge}
            />
          )}
        </View>

        <PhoneBezel width={phoneWidth}>
          <QuartzProvider
            key={`${seed.color}-${demoMode}`}
            initialMode={demoMode}
            lightTheme={demoThemes.light}
            darkTheme={demoThemes.dark}
          >
            <DemoScreen
              name={name}
              onName={setName}
              interests={interests}
              onToggleInterest={toggleInterest}
              notify={notify}
              onNotify={setNotify}
              textSize={textSize}
              onTextSize={setTextSize}
            />
          </QuartzProvider>
        </PhoneBezel>
      </View>

      {/* Seed swatches + demo mode toggle */}
      <Animated.View entering={FadeIn.delay(500).duration(400)} style={styles.seedRow}>
        {DEMO_SEEDS.map((s) => {
          const selected = s.color === seed.color;
          return (
            <Pressable
              key={s.color}
              onPress={() => setSeed(s)}
              accessibilityRole="button"
              accessibilityLabel={`Theme seed: ${s.name}`}
              testID={`seed-${s.name.replace(/\s+/g, '-').toLowerCase()}`}
              style={({ hovered }: WebPressableState) => [
                styles.seedSwatchOuter,
                {
                  borderColor: selected ? theme.colors.onSurface : 'transparent',
                  transform: [{ scale: selected || (hovered as boolean) ? 1.1 : 1 }],
                },
              ]}
            >
              <View style={[styles.seedSwatchInner, { backgroundColor: s.color }]}>
                {selected && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
            </Pressable>
          );
        })}

        <View style={[styles.seedDivider, { backgroundColor: theme.colors.outlineVariant }]} />

        <Pressable
          onPress={() => setModeOverride(demoMode === 'dark' ? 'light' : 'dark')}
          accessibilityRole="button"
          accessibilityLabel={`Demo theme: ${demoMode}. Tap to switch.`}
          style={({ hovered }: WebPressableState) => [
            styles.seedModeToggle,
            {
              borderColor: theme.colors.outlineVariant,
              backgroundColor: (hovered as boolean) ? theme.colors.surfaceVariant + '60' : theme.colors.surface,
            },
          ]}
        >
          <Ionicons name={demoMode === 'dark' ? 'moon' : 'sunny'} size={14} color={theme.colors.onSurfaceVariant} />
          <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12, fontWeight: '600' }}>
            {demoMode === 'dark' ? 'Dark' : 'Light'}
          </Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(600).duration(400)}>
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, marginTop: 12, textAlign: 'center' }}>
          One seed color. A whole theme.{' '}
          <Text style={{ color: theme.colors.primary, fontSize: 13, fontWeight: '700' }}>Try it.</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

// Feature card component
function FeatureCard({ feature, index, isMobile }: { feature: Feature; index: number; isMobile: boolean }) {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  const accent = accentColor(feature.accent, isDark);

  return (
    <Animated.View
      entering={FadeInUp.delay(40 * index).duration(260)}
      style={[styles.featureCard, { width: isMobile ? '100%' : 340 }]}
    >
      <View
        style={[
          styles.featureCardClean,
          styles.hoverTransition,
          {
            borderColor: theme.colors.outlineVariant + '60',
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <View
          style={[
            styles.featureIconClean,
            { backgroundColor: accentTint(feature.accent, isDark, 0.13) },
          ]}
        >
          <Ionicons name={feature.icon} size={20} color={accent} />
        </View>
        <Text
          style={{
            color: theme.colors.onSurface,
            fontWeight: '700',
            fontSize: 17,
            marginTop: 16,
            letterSpacing: -0.2,
          }}
        >
          {feature.title}
        </Text>
        <Text
          style={{
            color: theme.colors.onSurfaceVariant,
            fontSize: 14,
            marginTop: 6,
            lineHeight: 22,
          }}
        >
          {feature.description}
        </Text>
      </View>
    </Animated.View>
  );
}

// Code preview component
function CodePreview({ isMobile }: { isMobile: boolean }) {
  return (
    <Animated.View entering={FadeInUp.delay(400).springify().damping(14)} style={styles.codePreview}>
      <Surface style={[styles.codeSurface, { backgroundColor: '#1e1e1e' }]} elevation={4}>
        <View style={styles.codeHeader}>
          <View style={styles.codeHeaderDots}>
            <View style={[styles.codeDot, { backgroundColor: '#ff5f57' }]} />
            <View style={[styles.codeDot, { backgroundColor: '#ffbd2e' }]} />
            <View style={[styles.codeDot, { backgroundColor: '#28ca42' }]} />
          </View>
          <Text style={styles.codeFileName}>App.tsx</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.codeContent, { paddingHorizontal: isMobile ? 16 : 24 }]}>
            {codeExample.split('\n').map((line, i) => (
              <View key={i} style={styles.codeLine}>
                <Text style={styles.codeLineNumber}>{(i + 1).toString().padStart(2, ' ')}</Text>
                <Text style={styles.codeText}>{line}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </Surface>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Landing sections — every band below shares the same 1200px container, the
// small-caps accent eyebrow, and the staggered FadeInUp rhythm so the page
// reads as one system.
// ---------------------------------------------------------------------------

/** Shared section intro — small-caps accent eyebrow + headline + optional lede. */
function SectionIntro({
  accent,
  eyebrow,
  title,
  subtitle,
  isMobile,
}: {
  accent: Accent;
  eyebrow: string;
  title: string;
  subtitle?: string;
  isMobile: boolean;
}) {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  return (
    <Animated.View entering={FadeInUp.duration(280)} style={{ alignItems: 'flex-start', width: '100%' }}>
      <Text style={{ color: accentColor(accent, isDark), fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }}>
        {eyebrow}
      </Text>
      <Text style={{ color: theme.colors.onSurface, fontSize: isMobile ? 28 : 36, fontWeight: '700', letterSpacing: -0.8, lineHeight: isMobile ? 34 : 44, marginTop: 8 }}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: isMobile ? 15 : 17, marginTop: 12, lineHeight: isMobile ? 24 : 28, maxWidth: 640 }}>
          {subtitle}
        </Text>
      ) : null}
    </Animated.View>
  );
}

/** Accent-colored "Read more →" link used by the new bands. */
function SectionLink({ accent, label, route }: { accent: Accent; label: string; route: string }) {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  const router = useRouter();
  const color = accentColor(accent, isDark);
  return (
    <Pressable
      onPress={() => router.push(route as never)}
      accessibilityRole="link"
      style={({ hovered, pressed }: WebPressableState) => [
        styles.sectionLink,
        {
          opacity: pressed ? 0.7 : 1,
          backgroundColor: (hovered as boolean) ? accentTint(accent, isDark, 0.1) : 'transparent',
        },
      ]}
    >
      <Text style={{ color, fontSize: 15, fontWeight: '600' }}>{label}</Text>
      <Ionicons name="arrow-forward" size={15} color={color} />
    </Pressable>
  );
}

// --- (a) "Alive by default" — live component gallery -----------------------

function GalleryCard({
  label,
  accent,
  index,
  isMobile,
  children,
}: {
  label: string;
  accent: Accent;
  index: number;
  isMobile: boolean;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  return (
    <Animated.View
      entering={FadeInUp.delay(50 * index).duration(280)}
      style={[
        styles.galleryCard,
        {
          width: isMobile ? '100%' : 264,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant + '60',
        },
      ]}
    >
      <View style={styles.galleryCardDemo}>{children}</View>
      <View style={[styles.galleryCardLabelRow, { borderTopColor: theme.colors.outlineVariant + '40' }]}>
        <View style={[styles.galleryCardDot, { backgroundColor: accentColor(accent, isDark) }]} />
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' }}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

const GALLERY_CHIP_KEYS = ['React Native', 'Expo', 'Web'] as const;

function LiveGalleryBand({ isMobile }: { isMobile: boolean }) {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';

  const [switchOn, setSwitchOn] = useState(true);
  const [sliderVal, setSliderVal] = useState(64);
  const [chipSel, setChipSel] = useState<Record<string, boolean>>({ 'React Native': true, Expo: true, Web: false });
  const [notifCount, setNotifCount] = useState(3);
  const [starred, setStarred] = useState(true);
  const [checkTypes, setCheckTypes] = useState(true);
  const [checkTests, setCheckTests] = useState(false);
  const [channel, setChannel] = useState<'email' | 'push'>('push');

  const avatarSeeds = [
    { initials: 'AV', accent: accents.gettingStarted },
    { initials: 'RT', accent: accents.inputs },
    { initials: 'KO', accent: accents.dataDisplay },
    { initials: 'ML', accent: accents.feedback },
  ];

  return (
    <View style={[styles.band, { backgroundColor: accentTint(accents.gettingStarted, isDark, isDark ? 0.08 : 0.05), marginTop: isMobile ? 72 : 112 }]}>
      <View style={[styles.bandInner, { paddingHorizontal: isMobile ? 20 : 40, paddingVertical: isMobile ? 56 : 88 }]}>
        <SectionIntro
          accent={accents.feedback}
          eyebrow="Alive by default"
          title="Touch anything. It's all real."
          subtitle="Nothing on this page is a screenshot. Every control below is the shipped component, wired to live React state — flip it, drag it, tap it."
          isMobile={isMobile}
        />

        <View style={[styles.galleryGrid, { marginTop: isMobile ? 32 : 48 }]}>
          {/* Switch */}
          <GalleryCard label="Switch" accent={accents.inputs} index={0} isMobile={isMobile}>
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Switch value={switchOn} onValueChange={setSwitchOn} accessibilityLabel="Gallery demo switch" />
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13 }}>
                Haptics {switchOn ? 'on' : 'off'}
              </Text>
            </View>
          </GalleryCard>

          {/* Slider */}
          <GalleryCard label="Slider" accent={accents.dataDisplay} index={1} isMobile={isMobile}>
            <View style={{ width: '100%', gap: 8 }}>
              <Slider value={sliderVal} min={0} max={100} step={1} onValueChange={setSliderVal} />
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, textAlign: 'center' }}>
                Volume{' '}
                <Text style={{ color: theme.colors.primary, fontSize: 13, fontWeight: '700' }}>
                  {Math.round(sliderVal)}%
                </Text>
              </Text>
            </View>
          </GalleryCard>

          {/* Filter chips */}
          <GalleryCard label="Chips" accent={accents.gettingStarted} index={2} isMobile={isMobile}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {GALLERY_CHIP_KEYS.map((key) => (
                <Chip
                  key={key}
                  label={key}
                  variant="filter"
                  selected={!!chipSel[key]}
                  onPress={() => setChipSel((prev) => ({ ...prev, [key]: !prev[key] }))}
                />
              ))}
            </View>
          </GalleryCard>

          {/* Progress */}
          <GalleryCard label="Progress" accent={accents.overlays} index={3} isMobile={isMobile}>
            <View style={{ width: '100%', alignItems: 'center', gap: 14 }}>
              <ProgressIndicator variant="circular" progress={sliderVal} size="medium" />
              <View style={{ width: '100%' }}>
                <ProgressIndicator variant="linear" indeterminate />
              </View>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                The ring follows the slider
              </Text>
            </View>
          </GalleryCard>

          {/* Badge + IconButton */}
          <GalleryCard label="Badge & Icon Button" accent={accents.feedback} index={4} isMobile={isMobile}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <View>
                <IconButton
                  variant="tonal"
                  icon={<Ionicons name="notifications" size={22} color={theme.colors.onSecondaryContainer} />}
                  accessibilityLabel={`Notifications, ${notifCount} unread. Tap to add one.`}
                  onPress={() => setNotifCount((n) => (n >= 9 ? 1 : n + 1))}
                />
                <Badge content={notifCount} style={styles.galleryBadge} />
              </View>
              <IconButton
                variant="outlined"
                selected={starred}
                icon={<Ionicons name={starred ? 'star' : 'star-outline'} size={20} color={starred ? theme.colors.onPrimary : theme.colors.onSurfaceVariant} />}
                accessibilityLabel={starred ? 'Starred. Tap to unstar.' : 'Not starred. Tap to star.'}
                onPress={() => setStarred((s) => !s)}
              />
            </View>
          </GalleryCard>

          {/* Avatars */}
          <GalleryCard label="Avatar" accent={accents.cards} index={5} isMobile={isMobile}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {avatarSeeds.map((a, i) => (
                <View key={a.initials} style={[i > 0 && { marginLeft: -10 }, { borderRadius: 999, borderWidth: 2, borderColor: theme.colors.surface }]}>
                  <Avatar initials={a.initials} size="md" backgroundColor={accentColor(a.accent, isDark)} color={isDark ? '#1c1b1f' : '#ffffff'} />
                </View>
              ))}
              <View style={[{ marginLeft: -10, borderRadius: 999, borderWidth: 2, borderColor: theme.colors.surface }]}>
                <Avatar initials="+8" size="md" backgroundColor={theme.colors.surfaceVariant} color={theme.colors.onSurfaceVariant} />
              </View>
            </View>
          </GalleryCard>

          {/* Checkbox + RadioButton */}
          <GalleryCard label="Selection" accent={accents.foundations} index={6} isMobile={isMobile}>
            <View style={{ width: '100%', gap: 4 }}>
              <View style={styles.galleryOptionRow}>
                <Checkbox checked={checkTypes} onValueChange={setCheckTypes} accessibilityLabel="Strict types" />
                <Text style={{ color: theme.colors.onSurface, fontSize: 14 }}>Strict types</Text>
              </View>
              <View style={styles.galleryOptionRow}>
                <Checkbox checked={checkTests} onValueChange={setCheckTests} accessibilityLabel="Run 540 tests" />
                <Text style={{ color: theme.colors.onSurface, fontSize: 14 }}>Run 540 tests</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 20, marginTop: 2 }}>
                {(['push', 'email'] as const).map((opt) => (
                  <View key={opt} style={styles.galleryOptionRow}>
                    <RadioButton selected={channel === opt} onPress={() => setChannel(opt)} accessibilityLabel={`${opt} channel`} />
                    <Text style={{ color: theme.colors.onSurface, fontSize: 14, textTransform: 'capitalize' }}>{opt}</Text>
                  </View>
                ))}
              </View>
            </View>
          </GalleryCard>
        </View>
      </View>
    </View>
  );
}

// --- (b) "One seed. Infinite themes." — dynamic color showcase --------------

const PALETTE_TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const;

const PALETTE_SEEDS = [
  { name: 'Violet', seed: accents.gettingStarted.main },
  { name: 'Ocean', seed: accents.inputs.main },
  { name: 'Fern', seed: accents.dataDisplay.main },
] as const;

/** Live 13-stop MD3 tonal strip — generated at render time by the real library call. */
function TonalStrip({ name, seed }: { name: string; seed: string }) {
  const theme = useTheme();
  const palette = useMemo(() => generateTonalPalette(seed), [seed]);
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={[styles.paletteSeedChip, { backgroundColor: seed, borderColor: theme.colors.outlineVariant }]} />
        <Text style={{ color: theme.colors.onSurface, fontWeight: '600', fontSize: 14 }}>{name}</Text>
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12, fontFamily: 'monospace' }}>{seed}</Text>
      </View>
      {/* Hairline border keeps the near-white 95/99/100 tones visible on light cards */}
      <View style={[styles.paletteToneRow, { borderColor: theme.colors.outlineVariant + '80' }]}>
        {PALETTE_TONES.map((tone, index) => (
          <View
            key={tone}
            style={[
              styles.paletteToneCell,
              { backgroundColor: palette[tone] },
              index === 0 && styles.paletteToneCellFirst,
              index === PALETTE_TONES.length - 1 && styles.paletteToneCellLast,
            ]}
          >
            <Text style={{ color: tone >= 60 ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)', fontSize: 9, fontWeight: '600' }}>
              {tone}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function DynamicColorBand({ isMobile }: { isMobile: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.landingSection, { paddingHorizontal: isMobile ? 20 : 40, marginTop: isMobile ? 72 : 112 }]}>
      <SectionIntro
        accent={accents.foundations}
        eyebrow="Dynamic color"
        title="One seed. Infinite themes."
        subtitle="Hand createDynamicThemes() a single brand color and it expands into 13-stop MD3 tonal palettes and all 36 color roles — these strips are generated live by the real library call."
        isMobile={isMobile}
      />
      <Animated.View
        entering={FadeInUp.delay(120).duration(300)}
        style={[
          styles.paletteCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant + '60',
            padding: isMobile ? 16 : 28,
            marginTop: isMobile ? 32 : 44,
          },
        ]}
      >
        {PALETTE_SEEDS.map((p) => (
          <TonalStrip key={p.seed} name={p.name} seed={p.seed} />
        ))}
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(200).duration(300)} style={{ marginTop: 20 }}>
        <SectionLink accent={accents.foundations} label="Explore theming" route="/docs/theming-guide" />
      </Animated.View>
    </View>
  );
}

// --- (c) "Built for everyone" — accessibility band ---------------------------

interface A11yPoint {
  icon: IconName;
  title: string;
  text: string;
  accent: Accent;
}

const a11yPoints: A11yPoint[] = [
  { icon: 'shield-checkmark', title: 'WCAG 2.2 AA', text: 'Contrast-safe color roles, ≥48dp touch targets, and focus-visible rings on every control.', accent: accents.dataDisplay },
  { icon: 'megaphone', title: 'Screen readers', text: 'Live-region announcements for snackbars, progress, and selection changes — VoiceOver and TalkBack tested.', accent: accents.inputs },
  { icon: 'pulse', title: 'Reduce motion', text: 'Every animation shortens or skips entirely when the OS asks for less movement.', accent: accents.cards },
  { icon: 'swap-horizontal', title: 'RTL built in', text: 'Logical paddings and direction-aware layouts throughout — Arabic and Hebrew just work.', accent: accents.feedback },
];

function AccessibilityBand({ isMobile }: { isMobile: boolean }) {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  return (
    <View style={[styles.landingSection, { paddingHorizontal: isMobile ? 20 : 40, marginTop: isMobile ? 72 : 112 }]}>
      <SectionIntro
        accent={accents.dataDisplay}
        eyebrow="Built for everyone"
        title="Accessibility is the default, not a plugin."
        subtitle="Four guarantees, verified by the 540-test suite on every commit."
        isMobile={isMobile}
      />
      <View style={[styles.a11yGrid, { marginTop: isMobile ? 32 : 48 }]}>
        {a11yPoints.map((point, index) => {
          const accent = accentColor(point.accent, isDark);
          return (
            <Animated.View
              key={point.title}
              entering={FadeInUp.delay(50 * index).duration(280)}
              style={[
                styles.a11yCard,
                {
                  width: isMobile ? '100%' : 262,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant + '60',
                },
              ]}
            >
              <View style={[styles.a11yIconChip, { backgroundColor: accentTint(point.accent, isDark, 0.13) }]}>
                <Ionicons name={point.icon} size={18} color={accent} />
              </View>
              <Text style={{ color: theme.colors.onSurface, fontSize: 16, fontWeight: '700', letterSpacing: -0.2, marginTop: 14 }}>
                {point.title}
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13.5, lineHeight: 21, marginTop: 6 }}>
                {point.text}
              </Text>
            </Animated.View>
          );
        })}
      </View>
      <Animated.View entering={FadeInUp.delay(240).duration(300)} style={{ marginTop: 20 }}>
        <SectionLink accent={accents.dataDisplay} label="Read the accessibility guide" route="/docs/accessibility" />
      </Animated.View>
    </View>
  );
}

// --- (d) "What's new in 1.1" teaser ------------------------------------------

const whatsNewChips = [
  { label: 'Accordion', accent: accents.dataDisplay },
  { label: 'Bottom App Bar', accent: accents.navigation },
  { label: 'Dynamic color', accent: accents.foundations },
];

function WhatsNewTeaser({ isMobile }: { isMobile: boolean }) {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  const router = useRouter();
  const accent = accents.gettingStarted;
  return (
    <View style={[styles.landingSection, { paddingHorizontal: isMobile ? 20 : 40, marginTop: isMobile ? 72 : 112 }]}>
      <Animated.View entering={FadeInUp.duration(280)}>
        <Pressable
          onPress={() => router.push('/docs/whats-new' as never)}
          accessibilityRole="link"
          accessibilityLabel="What's new in 1.1: Accordion, Bottom App Bar, dynamic color. See the release notes."
          style={({ hovered, pressed }: WebPressableState) => [
            styles.whatsNewBanner,
            styles.hoverTransition,
            {
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              backgroundColor: theme.colors.surface,
              borderColor: (hovered as boolean) ? accentColor(accent, isDark) : theme.colors.outlineVariant + '70',
              transform: [{ scale: pressed ? 0.995 : 1 }],
            },
            webStyle({
              boxShadow: (hovered as boolean)
                ? `0 12px 32px ${accentTint(accent, isDark, 0.18)}`
                : '0 0 0 rgba(0,0,0,0)',
            }),
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 }}>
            <View style={[styles.whatsNewBadge, { backgroundColor: accentTint(accent, isDark, 0.16) }]}>
              <Text style={{ color: accentColor(accent, isDark), fontWeight: '700', fontSize: 10, letterSpacing: 0.4 }}>
                NEW
              </Text>
            </View>
            <Text style={{ color: theme.colors.onSurface, fontSize: 16, fontWeight: '700', letterSpacing: -0.2 }}>
              What's new in 1.1
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: isMobile ? undefined : 1, justifyContent: isMobile ? 'flex-start' : 'center' }}>
            {whatsNewChips.map((chip) => (
              <View key={chip.label} style={[styles.whatsNewChip, { backgroundColor: accentTint(chip.accent, isDark, 0.12) }]}>
                <Text style={{ color: accentColor(chip.accent, isDark), fontSize: 12, fontWeight: '600' }}>
                  {chip.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: accentColor(accent, isDark), fontSize: 14, fontWeight: '600' }}>
              Release notes
            </Text>
            <Ionicons name="arrow-forward" size={14} color={accentColor(accent, isDark)} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// --- (e) Numbers band --------------------------------------------------------

const bigNumbers = [
  { value: '40', label: 'components', accent: accents.gettingStarted },
  { value: '540', label: 'tests passing', accent: accents.dataDisplay },
  { value: '36', label: 'color roles', accent: accents.overlays },
  { value: '0', label: 'required config', accent: accents.feedback },
];

function NumbersBand({ isMobile }: { isMobile: boolean }) {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  return (
    <View style={[styles.band, { backgroundColor: isDark ? '#0B0A10' : '#16141C', marginTop: isMobile ? 72 : 112 }]}>
      {/* Sweep-gradient hairline along the top edge */}
      <LinearGradient
        colors={[sweepGradient[0], sweepGradient[1], sweepGradient[2]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.numbersHairline}
      />
      <View style={[styles.bandInner, { paddingHorizontal: isMobile ? 20 : 40, paddingVertical: isMobile ? 48 : 72 }]}>
        <Animated.View entering={FadeInUp.duration(280)}>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', textAlign: 'center' }}>
            Quartz UI, by the numbers
          </Text>
        </Animated.View>
        <View style={[styles.numbersRow, { marginTop: isMobile ? 28 : 40 }]}>
          {bigNumbers.map((stat, index) => (
            <Animated.View
              key={stat.label}
              entering={FadeInUp.delay(60 * index).duration(300)}
              style={[styles.numbersItem, isMobile && { flexBasis: '50%', marginBottom: 28 }]}
            >
              <Text
                style={{
                  color: accentColor(stat.accent, true),
                  fontSize: isMobile ? 40 : 56,
                  lineHeight: isMobile ? 44 : 60,
                  fontWeight: '800',
                  letterSpacing: -1.5,
                  textAlign: 'center',
                }}
              >
                {stat.value}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '600', marginTop: 6, textAlign: 'center' }}>
                {stat.label}
              </Text>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Wrap scroll handler for web compatibility
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS === 'web') {
      scrollY.value = event.nativeEvent.contentOffset.y;
    } else if (typeof scrollHandler === 'function') {
      scrollHandler(event);
    }
  }, [scrollHandler, scrollY]);

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      backgroundColor: theme.mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    };
  });

  const heroParallax = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 400], [0, 150], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, 300], [1, 0], Extrapolation.CLAMP);
    return { transform: [{ translateY }], opacity };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Floating Header */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top + 8 },
          headerStyle,
        ]}
      >
        <View style={[styles.headerContent, { maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={[brandGradient[0], brandGradient[1]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerLogo}>
              <Ionicons name="layers" size={isMobile ? 20 : 24} color="#fff" />
            </LinearGradient>
            <Text variant="titleMedium" style={[styles.headerTitle, { color: theme.colors.onSurface, fontSize: isMobile ? 16 : 18 }]}>
              Quartz UI
            </Text>
          </View>
          <View style={styles.headerRight}>
            {!isMobile && (
              <>
                <Pressable onPress={() => router.push('/docs/introduction' as any)} style={styles.headerLink}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>Docs</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/buttons' as any)} style={styles.headerLink}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>Components</Text>
                </Pressable>
              </>
            )}
            <LandingThemeToggle />
            <Pressable style={styles.headerIcon} onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui')}>
              <Ionicons name="logo-github" size={24} color={theme.colors.onSurface} />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isMobile ? insets.bottom + 100 : insets.bottom + 60 }}
      >
        {/* Hero — two-column: copy on the left, a LIVE quartz-ui mini-app on the right */}
        <View style={[styles.hero, { minHeight: isMobile ? undefined : height * 0.8, backgroundColor: theme.colors.background }]}>
          {/* One subtle two-tone gradient wash at the top, no animated orbs */}
          <LinearGradient
            colors={[
              accentTint(accents.gettingStarted, isDark, 0.16),
              accentTint(accents.cards, isDark, 0.07),
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={[StyleSheet.absoluteFill, { height: '80%' }]}
          />

          {/* Parallax fade only on desktop — on stacked layouts the hero is tall,
              and fading it with scroll would hide the live demo before it's reached. */}
          <Animated.View style={[styles.heroContent, isDesktop ? heroParallax : null, { paddingTop: insets.top + (isMobile ? 88 : 104), paddingBottom: isMobile ? 40 : 56, paddingHorizontal: isMobile ? 24 : 40, alignItems: 'flex-start', maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
            <View
              style={{
                flexDirection: isDesktop ? 'row' : 'column',
                alignItems: 'center',
                gap: isDesktop ? 56 : 48,
                width: '100%',
              }}
            >
              {/* Left column — copy + CTAs */}
              <View style={{ flex: isDesktop ? 1 : undefined, width: isDesktop ? undefined : '100%', alignItems: 'flex-start' }}>
                {/* Version pill */}
                <Animated.View entering={FadeInUp.delay(80).duration(280)}>
                  <View style={[styles.versionPill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant + '80' }]}>
                    <View style={[styles.versionDot, { backgroundColor: theme.colors.primary }]} />
                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600', fontSize: 12, letterSpacing: 0.3 }}>
                      v1.1.0 — production-ready
                    </Text>
                  </View>
                </Animated.View>

                {/* Hero title */}
                <Animated.View entering={FadeInUp.delay(140).duration(320)} style={{ width: '100%', marginTop: isMobile ? 24 : 28 }}>
                  <Text
                    style={{
                      color: theme.colors.onSurface,
                      fontSize: isMobile ? 40 : isTablet ? 52 : 58,
                      lineHeight: isMobile ? 46 : isTablet ? 58 : 64,
                      fontWeight: '700',
                      letterSpacing: -1.2,
                    }}
                  >
                    The component library{'\n'}
                    <Text
                      style={[
                        {
                          color:
                            Platform.OS === 'web'
                              ? 'transparent'
                              : accentColor(accents.gettingStarted, isDark),
                          fontSize: isMobile ? 40 : isTablet ? 52 : 58,
                          lineHeight: isMobile ? 46 : isTablet ? 58 : 64,
                          fontWeight: '700',
                          letterSpacing: -1.2,
                        },
                        Platform.OS === 'web'
                          ? webTextStyle({
                              backgroundImage: `linear-gradient(92deg, ${accentColor(accents.gettingStarted, isDark)}, ${accentColor(accents.cards, isDark)} 55%, ${accentColor(accents.feedback, isDark)})`,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            })
                          : null,
                      ]}
                    >
                      React Native deserves.
                    </Text>
                  </Text>
                </Animated.View>

                {/* Subtitle */}
                <Animated.View entering={FadeInUp.delay(220).duration(320)} style={{ width: '100%', marginTop: 20, maxWidth: 560 }}>
                  <Text
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      fontSize: isMobile ? 17 : 19,
                      lineHeight: isMobile ? 26 : 30,
                      fontWeight: '400',
                    }}
                  >
                    40 Material 3 components built to a single world-class bar — accessible, RTL-aware, reduce-motion respecting, with state-layer transitions on the UI thread.
                  </Text>
                </Animated.View>

                {/* CTAs */}
                <Animated.View entering={FadeInUp.delay(300).duration(320)} style={[styles.ctaRowModern, { flexDirection: isMobile ? 'column' : 'row', marginTop: isMobile ? 28 : 36 }]}>
                  <Pressable
                    onPress={() => router.push('/docs/installation' as any)}
                    style={({ pressed, hovered }: WebPressableState) => [
                      styles.ctaPrimaryModern,
                      {
                        backgroundColor: theme.colors.primary,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        opacity: hovered ? 0.92 : 1,
                        width: isMobile ? '100%' : undefined,
                      },
                    ]}
                  >
                    <Text style={{ color: theme.colors.onPrimary, fontWeight: '600', fontSize: 15 }}>
                      Get started
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={theme.colors.onPrimary} />
                  </Pressable>

                  <Pressable
                    onPress={() => router.push('/docs/whats-new' as any)}
                    style={({ pressed, hovered }: WebPressableState) => [
                      styles.ctaSecondaryModern,
                      {
                        borderColor: theme.colors.outline,
                        backgroundColor: hovered ? theme.colors.surfaceVariant + '40' : 'transparent',
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        width: isMobile ? '100%' : undefined,
                      },
                    ]}
                  >
                    <Ionicons name="sparkles" size={15} color={theme.colors.onSurface} />
                    <Text style={{ color: theme.colors.onSurface, fontWeight: '600', fontSize: 15 }}>
                      What's new in 1.1
                    </Text>
                  </Pressable>
                </Animated.View>
              </View>

              {/* Right column — the live demo */}
              <Animated.View
                entering={FadeIn.delay(260).duration(600)}
                style={{ width: isDesktop ? undefined : '100%', alignItems: 'center' }}
              >
                <HeroDemo isMobile={isMobile} />
              </Animated.View>
            </View>

            {/* Stats strip — 40 components · 540 tests · WCAG 2.2 AA · Apache-2.0 */}
            <Animated.View
              entering={FadeInUp.delay(380).duration(320)}
              style={[
                styles.statsRowModern,
                {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  borderTopColor: theme.colors.outlineVariant + '50',
                  marginTop: isMobile ? 40 : 64,
                },
              ]}
            >
              {stats.map((stat, i) => (
                <View
                  key={stat.label}
                  style={[
                    styles.statItemModern,
                    isMobile && { flexBasis: '50%', minWidth: 0, paddingRight: 16, marginBottom: 16 },
                    i < stats.length - 1 && {
                      borderRightWidth: isMobile ? 0 : 1,
                      borderRightColor: theme.colors.outlineVariant + '50',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: accentColor(stat.accent, isDark),
                      fontSize: isMobile ? 22 : 26,
                      fontWeight: '700',
                      letterSpacing: -0.5,
                    }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      fontSize: 12,
                      marginTop: 2,
                      fontWeight: '500',
                    }}
                  >
                    {stat.label}
                  </Text>
                </View>
              ))}
            </Animated.View>
          </Animated.View>
        </View>

        {/* (a) Live component gallery — proves "everything is real" */}
        <LiveGalleryBand isMobile={isMobile} />

        {/* Features Section */}
        <View style={[styles.section, { paddingHorizontal: isMobile ? 20 : 40, maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
          <Animated.View entering={FadeInUp.duration(280)} style={[styles.sectionHeader, { alignItems: 'flex-start' }]}>
            <Text style={{ color: accentColor(accents.gettingStarted, isDark), fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }}>
              Why Quartz
            </Text>
            <Text style={{ color: theme.colors.onSurface, fontSize: isMobile ? 28 : 36, fontWeight: '700', letterSpacing: -0.8, lineHeight: isMobile ? 34 : 44, marginTop: 8 }}>
              Modern foundations, no compromises.
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: isMobile ? 15 : 17, marginTop: 12, lineHeight: isMobile ? 24 : 28, maxWidth: 640 }}>
              Six things every component delivers — out of the box, with zero theming required.
            </Text>
          </Animated.View>

          <View style={[styles.featuresGrid, { gap: isMobile ? 16 : 20 }]}>
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} isMobile={isMobile} />
            ))}
          </View>
        </View>

        {/* Code Preview Section */}
        <View style={[styles.section, { paddingHorizontal: isMobile ? 20 : 40, maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
          <Animated.View entering={FadeInUp.duration(280)} style={[styles.sectionHeader, { alignItems: 'flex-start' }]}>
            <Text style={{ color: accentColor(accents.inputs, isDark), fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }}>
              Developer experience
            </Text>
            <Text style={{ color: theme.colors.onSurface, fontSize: isMobile ? 28 : 36, fontWeight: '700', letterSpacing: -0.8, lineHeight: isMobile ? 34 : 44, marginTop: 8 }}>
              Simple, intuitive API.
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: isMobile ? 15 : 17, marginTop: 12, lineHeight: isMobile ? 24 : 28, maxWidth: 640 }}>
              Import a component, pass props, ship. Strict TypeScript types and JSDoc on every prop.
            </Text>
          </Animated.View>

          <CodePreview isMobile={isMobile} />
        </View>

        {/* (b) Dynamic color showcase — live tonal palettes */}
        <DynamicColorBand isMobile={isMobile} />

        {/* Components Section */}
        <View style={[styles.section, { paddingHorizontal: isMobile ? 20 : 40, maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
          <Animated.View entering={FadeInUp.duration(280)} style={[styles.componentsGridHeader, { alignItems: 'flex-start' }]}>
            <Text
              style={{
                color: accentColor(accents.cards, isDark),
                fontSize: 12,
                fontWeight: '700',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}
            >
              Components
            </Text>
            <Text
              style={{
                color: theme.colors.onSurface,
                fontSize: isMobile ? 28 : 36,
                fontWeight: '700',
                letterSpacing: -0.8,
                lineHeight: isMobile ? 34 : 44,
                marginTop: 8,
              }}
            >
              40 production-ready primitives.
            </Text>
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                fontSize: isMobile ? 15 : 17,
                marginTop: 12,
                lineHeight: isMobile ? 24 : 28,
                maxWidth: 640,
              }}
            >
              Everything from buttons to bottom sheets, organized by usage. Each component is fully typed, fully tested, and accessible by default.
            </Text>
          </Animated.View>

          {/* Grid — clean cards, single accent color from theme */}
          <View style={[styles.componentsGrid, { marginTop: isMobile ? 40 : 48 }]}>
            {componentCategories.map((category, index) => {
              // Available row width = section width (capped at 1200) minus its
              // 40px horizontal paddings, minus the 24px grid gaps per row.
              const containerInner = Math.min(width, 1200) - 80;
              const cardWidth = isMobile
                ? '100%'
                : isTablet
                  ? (containerInner - 24) / 2
                  : (containerInner - 48) / 3;
              const accent = accentColor(category.accent, isDark);
              return (
                <Animated.View
                  key={category.name}
                  entering={FadeInUp.delay(40 * index).duration(260)}
                  style={[styles.componentsGridCard, { width: cardWidth as never }]}
                >
                  <Pressable
                    onPress={() => router.push(category.route as never)}
                    style={({ pressed, hovered }: WebPressableState) => [
                      styles.cleanCard,
                      styles.hoverTransition,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: (hovered as boolean)
                          ? accent
                          : theme.colors.outlineVariant + '70',
                        transform: [
                          { scale: pressed ? 0.99 : 1 },
                          { translateY: (hovered as boolean) && !pressed ? -4 : 0 },
                        ],
                      },
                      webStyle({
                        boxShadow: (hovered as boolean)
                          ? `0 12px 32px ${accentTint(category.accent, isDark, 0.2)}`
                          : '0 0 0 rgba(0,0,0,0)',
                      }),
                    ]}
                  >
                    <View style={styles.cleanCardHeader}>
                      <View
                        style={[
                          styles.cleanCardIcon,
                          { backgroundColor: accentTint(category.accent, isDark, 0.13) },
                        ]}
                      >
                        <Ionicons
                          name={category.icon}
                          size={20}
                          color={accent}
                        />
                      </View>
                      <View
                        style={[
                          styles.cleanCardCount,
                          { backgroundColor: accentTint(category.accent, isDark, 0.1) },
                        ]}
                      >
                        <Text
                          style={{
                            color: accent,
                            fontSize: 12,
                            fontWeight: '700',
                          }}
                        >
                          {category.count}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        color: theme.colors.onSurface,
                        fontSize: 18,
                        fontWeight: '700',
                        letterSpacing: -0.2,
                        marginTop: 16,
                      }}
                    >
                      {category.name}
                    </Text>

                    <Text
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        fontSize: 14,
                        marginTop: 6,
                        lineHeight: 22,
                      }}
                    >
                      {category.items.slice(0, 4).join(' · ')}
                      {category.items.length > 4 ? ` · +${category.items.length - 4}` : ''}
                    </Text>

                    <View style={styles.cleanCardFooter}>
                      <Text style={{ color: accent, fontSize: 13, fontWeight: '600' }}>
                        Explore
                      </Text>
                      <Ionicons name="arrow-forward" size={14} color={accent} />
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* (c) Accessibility band */}
        <AccessibilityBand isMobile={isMobile} />

        {/* (d) What's new in 1.1 teaser */}
        <WhatsNewTeaser isMobile={isMobile} />

        {/* (e) Numbers band — full-width dark strip with sweep hairline */}
        <NumbersBand isMobile={isMobile} />

        {/* Closing CTA — restrained, single accent */}
        <View style={[styles.closingCtaWrap, { paddingHorizontal: isMobile ? 20 : 40, maxWidth: 1100, alignSelf: 'center', width: '100%', marginTop: isMobile ? 80 : 120 }]}>
          <Animated.View
            entering={FadeInUp.duration(280)}
            style={[
              styles.closingCta,
              {
                backgroundColor: theme.colors.surfaceVariant + '50',
                borderColor: theme.colors.outlineVariant + '60',
                padding: isMobile ? 32 : 56,
              },
            ]}
          >
            <Text
              style={{
                color: theme.colors.onSurface,
                fontSize: isMobile ? 26 : 36,
                fontWeight: '700',
                letterSpacing: -0.5,
                lineHeight: isMobile ? 32 : 44,
                maxWidth: 640,
              }}
            >
              Install in 30 seconds. Build for hours.
            </Text>
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                fontSize: isMobile ? 15 : 17,
                marginTop: 12,
                lineHeight: isMobile ? 22 : 26,
                maxWidth: 580,
              }}
            >
              Drop into any Expo or React Native app. Zero theming required to look great. Customize when you're ready.
            </Text>

            {/* Install command */}
            <View
              style={[
                styles.installCommand,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                  marginTop: isMobile ? 20 : 28,
                  width: isMobile ? '100%' : undefined,
                  alignSelf: 'flex-start',
                },
              ]}
            >
              <Text style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace', fontSize: 14 }}>$</Text>
              <Text style={{ color: theme.colors.onSurface, fontFamily: 'monospace', fontSize: 14, flex: 1, marginLeft: 8 }}>
                npm install quartz-ui
              </Text>
            </View>

            {/* CTAs */}
            <View
              style={[
                styles.closingCtaRow,
                {
                  flexDirection: isMobile ? 'column' : 'row',
                  marginTop: isMobile ? 20 : 28,
                },
              ]}
            >
              <Pressable
                onPress={() => router.push('/docs/quick-start' as any)}
                style={({ pressed, hovered }: WebPressableState) => [
                  styles.ctaPrimaryModern,
                  {
                    backgroundColor: theme.colors.primary,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: (hovered as boolean) ? 0.92 : 1,
                    width: isMobile ? '100%' : undefined,
                  },
                ]}
              >
                <Text style={{ color: theme.colors.onPrimary, fontWeight: '600', fontSize: 15 }}>
                  Quick start
                </Text>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.onPrimary} />
              </Pressable>

              <Pressable
                onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui')}
                style={({ pressed, hovered }: WebPressableState) => [
                  styles.ctaSecondaryModern,
                  {
                    borderColor: theme.colors.outline,
                    backgroundColor: (hovered as boolean) ? theme.colors.surfaceVariant + '40' : 'transparent',
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    width: isMobile ? '100%' : undefined,
                  },
                ]}
              >
                <Ionicons name="logo-github" size={16} color={theme.colors.onSurface} />
                <Text style={{ color: theme.colors.onSurface, fontWeight: '600', fontSize: 15 }}>
                  GitHub
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.surface,
              borderTopWidth: 1,
              borderTopColor: theme.colors.outlineVariant + '60',
              marginTop: 80,
            },
          ]}
        >
          <View style={[styles.footerContent, { paddingHorizontal: isMobile ? 24 : 48, paddingVertical: isMobile ? 48 : 56, maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
            <View style={[styles.footerTop, { flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 40 : 64 }]}>
              {/* Brand Section */}
              <View style={[styles.footerBrand, { flex: isMobile ? undefined : 1.2, alignItems: isMobile ? 'center' : 'flex-start' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.colors.primary,
                    }}
                  >
                    <Ionicons name="layers" size={18} color={theme.colors.onPrimary} />
                  </View>
                  <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700', fontSize: 18 }}>
                    Quartz UI
                  </Text>
                </View>
                <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 12,
                    lineHeight: 22,
                    fontSize: 14,
                    textAlign: isMobile ? 'center' : 'left',
                    maxWidth: 320,
                  }}
                >
                  40 production-ready Material Design 3 components for React Native & Expo. Apache 2.0.
                </Text>

                {/* Social Icons */}
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                  <Pressable
                    onPress={() => Linking.openURL('https://github.com/sitharaj88/quartz-ui')}
                    style={({ pressed }) => [
                      styles.footerSocialIcon,
                      {
                        backgroundColor: theme.colors.surfaceContainerHigh,
                        width: 40,
                        height: 40,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Ionicons name="logo-github" size={20} color={theme.colors.onSurfaceVariant} />
                  </Pressable>
                  <Pressable
                    onPress={() => Linking.openURL('https://x.com/sitharaj08/')}
                    style={({ pressed }) => [
                      styles.footerSocialIcon,
                      {
                        backgroundColor: theme.colors.surfaceContainerHigh,
                        width: 40,
                        height: 40,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Ionicons name="logo-twitter" size={20} color={theme.colors.onSurfaceVariant} />
                  </Pressable>
                </View>
              </View>

              {/* Links Grid */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                  gap: isMobile ? 20 : 56,
                  flex: isMobile ? undefined : 2,
                  justifyContent: isMobile ? 'space-between' : 'flex-start',
                  width: '100%',
                }}
              >
                {/* Docs Column */}
                <View style={{ alignItems: 'flex-start', minWidth: isMobile ? '48%' : 120 }}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '700', fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Docs
                  </Text>
                  {[
                    { label: 'Introduction', route: '/docs/introduction' },
                    { label: 'Installation', route: '/docs/installation' },
                    { label: 'Quick Start', route: '/docs/quick-start' },
                    { label: 'Theming', route: '/docs/theming-guide' },
                  ].map((item) => (
                    <Pressable key={item.label} onPress={() => router.push(item.route as any)} style={({ pressed }) => ({ marginBottom: 10, opacity: pressed ? 0.6 : 1 })}>
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Components Column */}
                <View style={{ alignItems: 'flex-start', minWidth: isMobile ? '48%' : 120 }}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '700', fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Components
                  </Text>
                  {[
                    { label: 'Buttons', route: '/buttons' },
                    { label: 'Inputs', route: '/inputs' },
                    { label: 'Cards', route: '/cards' },
                    { label: 'Navigation', route: '/navigation' },
                  ].map((item) => (
                    <Pressable key={item.label} onPress={() => router.push(item.route as any)} style={({ pressed }) => ({ marginBottom: 10, opacity: pressed ? 0.6 : 1 })}>
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Resources Column */}
                <View style={{ alignItems: 'flex-start', minWidth: isMobile ? '48%' : 120 }}>
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '700', fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Resources
                  </Text>
                  {[
                    { label: 'GitHub', url: 'https://github.com/sitharaj88/quartz-ui', icon: 'logo-github' as IconName },
                    { label: 'Changelog', url: 'https://github.com/sitharaj88/quartz-ui/releases' },
                    { label: 'License', url: LICENSE_URL },
                    { label: 'Material Design', url: 'https://m3.material.io' },
                  ].map((item) => (
                    <Pressable key={item.label} onPress={() => Linking.openURL(item.url)} style={({ pressed }) => ({ marginBottom: 10, opacity: pressed ? 0.6 : 1 })}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {item.icon && <Ionicons name={item.icon} size={16} color={theme.colors.onSurfaceVariant} />}
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>
                          {item.label}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Bottom Bar */}
            <View
              style={[
                styles.footerBottom,
                {
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.outlineVariant + '20',
                  marginTop: isMobile ? 40 : 48,
                  paddingTop: isMobile ? 24 : 28,
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 12 : 0,
                },
              ]}
            >
              <View style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start', gap: 6 }}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, opacity: 0.7, textAlign: isMobile ? 'center' : 'left' }}>
                  © 2025 Quartz UI •
                </Text>
                <Pressable onPress={() => Linking.openURL(LICENSE_URL)}>
                  <Text variant="bodySmall" style={{ color: theme.colors.primary, fontSize: 13, fontWeight: '700', textAlign: isMobile ? 'center' : 'left' }}>
                    Apache 2.0 License
                  </Text>
                </Pressable>
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, opacity: 0.5, textAlign: isMobile ? 'center' : 'right' }}>
                Made with ❤️ for React Native
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <View
          style={[
            styles.mobileBottomNav,
            {
              backgroundColor: theme.mode === 'dark' ? 'rgba(18, 18, 18, 0.98)' : 'rgba(255, 255, 255, 0.98)',
              borderTopColor: theme.colors.outlineVariant + '30',
              paddingBottom: insets.bottom + 8,
            },
          ]}
        >
          <Pressable
            style={styles.mobileNavItem}
            onPress={() => {}}
          >
            <Ionicons name="home" size={22} color={theme.colors.primary} />
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontSize: 10, marginTop: 2 }}>
              Home
            </Text>
          </Pressable>
          <Pressable
            style={styles.mobileNavItem}
            onPress={() => router.push('/docs/introduction' as any)}
          >
            <Ionicons name="book-outline" size={22} color={theme.colors.onSurfaceVariant} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginTop: 2 }}>
              Docs
            </Text>
          </Pressable>
          <Pressable
            style={styles.mobileNavItem}
            onPress={() => Linking.openURL(GITHUB_URL)}
          >
            <Ionicons name="logo-github" size={22} color={theme.colors.onSurfaceVariant} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginTop: 2 }}>
              GitHub
            </Text>
          </Pressable>
          <Pressable
            style={styles.mobileNavItem}
            onPress={async () => {
              try {
                await Share.share({
                  message: '🎨 Check out Quartz UI — a modern, accessible component library for React Native & Expo with 40 Material Design 3 components!\n\n' + DOCS_URL,
                  url: DOCS_URL,
                  title: 'Quartz UI - React Native Component Library',
                });
              } catch (error) {
                console.log('Error sharing:', error);
              }
            }}
          >
            <Ionicons name="share-outline" size={22} color={theme.colors.onSurfaceVariant} />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginTop: 2 }}>
              Share
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontWeight: '800',
    marginLeft: 12,
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  headerLink: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexShrink: 0,
  },
  headerIcon: {
    padding: 8,
    flexShrink: 0,
  },

  // Hero
  hero: {
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  versionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    gap: 8,
  },
  ctaRowModern: {
    gap: 12,
    width: '100%',
    flexWrap: 'wrap',
  },
  ctaPrimaryModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  ctaSecondaryModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  statsRowModern: {
    width: '100%',
    paddingTop: 28,
    borderTopWidth: 1,
  },
  statItemModern: {
    paddingRight: 28,
    paddingLeft: 0,
    flexBasis: '25%',
    minWidth: 110,
  },
  closingCtaWrap: {},
  closingCta: {
    borderRadius: 20,
    borderWidth: 1,
  },
  cleanCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    minHeight: 180,
  },
  cleanCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cleanCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cleanCardCount: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center',
  },
  cleanCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  featureCardClean: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 160,
  },
  featureIconClean: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  installCommand: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 320,
  },
  closingCtaRow: {
    gap: 12,
    flexWrap: 'wrap',
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 32,
  },
  versionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 8,
  },
  versionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
  },
  heroTitle: {
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroTitleHighlight: {
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -1,
    color: '#c084fc',
  },
  heroTitleLine2: {
    marginBottom: 32,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 40,
    alignSelf: 'center',
  },
  heroSubtitleHighlight: {
    color: '#4ade80',
    fontWeight: '700',
  },
  ctaRow: {
    gap: 14,
    marginBottom: 56,
    width: '100%',
    maxWidth: 400,
  },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    gap: 8,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    gap: 8,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  ctaSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.15)',
  },
  statItemValue: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statItemLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 32,
  },
  scrollIndicatorInner: {
    width: 24,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    paddingTop: 8,
  },
  scrollIndicatorDot: {
    width: 4,
    height: 8,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  scrollIndicatorText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 12,
  },

  // Sections
  section: {
    marginTop: 80,
  },
  sectionHeader: {
    marginBottom: 48,
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 600,
  },

  // Features
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureCard: {
    marginBottom: 16,
  },
  noteCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  featureSurface: {
    padding: 28,
    borderRadius: 24,
  },
  featureIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontWeight: '700',
    marginTop: 20,
  },
  featureDescription: {
    marginTop: 8,
    lineHeight: 22,
  },
  featureAccent: {
    height: 3,
    width: 48,
    borderRadius: 2,
    marginTop: 20,
  },

  // Code Preview
  codePreview: {
    marginBottom: 32,
  },
  codeSurface: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  codeHeaderDots: {
    flexDirection: 'row',
    gap: 8,
  },
  codeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  codeFileName: {
    color: '#888',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  codeContent: {
    paddingVertical: 20,
  },
  codeLine: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  codeLineNumber: {
    color: '#555',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    width: 32,
    textAlign: 'right',
    marginRight: 16,
  },
  codeText: {
    color: '#d4d4d4',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  installSurface: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  installLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  installRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  installText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  installCopy: {
    padding: 8,
    borderRadius: 8,
  },

  // Categories
  categoriesScroll: {
    gap: 20,
    paddingVertical: 8,
  },
  categoryCard: {},
  categorySurface: {
    padding: 24,
    borderRadius: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  categoryIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryTitle: {
    fontWeight: '700',
    marginTop: 20,
  },
  categoryItems: {
    marginTop: 16,
    gap: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  // Components Grid Section
  componentsGridHeader: {
    alignItems: 'center',
    marginBottom: 0,
  },
  componentsGridBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  componentsGridBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  componentsGridBadgeText: {
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  componentsGridTitle: {
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 56,
  },
  componentsGridSubtitle: {
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 700,
    opacity: 0.9,
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  componentsGridCard: {
    marginBottom: 0,
  },
  componentsGridCardInner: {
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    height: 320,
  },
  componentsGridIcon: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  componentsGridCardContent: {
    flex: 1,
  },
  componentsGridCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  componentsGridCardTitle: {
    fontWeight: '800',
    flex: 1,
    lineHeight: 28,
  },
  componentsGridCardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
  },
  componentsGridCardBadgeText: {
    fontWeight: '900',
  },
  componentsGridCardItems: {
    gap: 10,
  },
  componentsGridCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  componentsGridCardItemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  componentsGridCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  componentsGridCardAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  // CTA Section
  // CTA Section - Modern & Light
  ctaSection: {
    overflow: 'hidden',
  },
  ctaSectionCard: {
    overflow: 'hidden',
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaIconBadge: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  ctaSectionTitle: {
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 52,
  },
  ctaSectionSubtitle: {
    textAlign: 'center',
    maxWidth: 600,
    opacity: 0.9,
  },
  ctaButtons: {
    alignItems: 'center',
    width: '100%',
  },
  ctaPrimaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 200,
  },
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 16,
  },
  ctaPrimaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ctaSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 16,
    minWidth: 200,
  },
  ctaSecondaryButtonText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ctaStats: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaStat: {
    alignItems: 'center',
  },
  ctaStatValue: {
    fontWeight: '900',
    lineHeight: 48,
  },
  ctaStatLabel: {
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Ultra Modern CTA Styles
  ctaGlassCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    margin: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  ctaOrb1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  ctaOrb2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  ctaOrb3: {
    position: 'absolute',
    top: '50%',
    left: '70%',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  ctaOrbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  ctaIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaIconGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaTitle: {
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaTitleHighlight: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '900',
  },
  ctaSubtitle: {
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 500,
    alignSelf: 'center',
  },
  ctaButtonGroup: {
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
  },
  ctaPrimaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    minWidth: 200,
    alignSelf: 'center',
  },
  ctaPrimaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ctaPrimaryTextBold: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ctaSecondaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    minWidth: 160,
    alignSelf: 'center',
  },
  ctaSecondaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  ctaSecondaryTextBold: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ctaStatsGrid: {
    justifyContent: 'center',
  },
  ctaStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 120,
  },
  ctaStatIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaStatValueBold: {
    fontWeight: '900',
    lineHeight: 24,
  },
  ctaStatLabelBold: {
    fontWeight: '600',
    marginTop: 2,
  },

  // Footer - Modern & Clean
  footer: {
    marginTop: 80,
    overflow: 'hidden',
  },
  footerContent: {
    width: '100%',
  },
  footerTop: {
    width: '100%',
  },
  footerBrand: {
    width: '100%',
  },
  footerBrandContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  footerTitle: {
    fontWeight: '800',
  },
  footerLinks: {
    width: '100%',
  },
  footerLinkGroup: {
    gap: 10,
  },
  footerBottom: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerSocial: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  footerSocialIcon: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hover polish (web-only CSS transition; no-op on native)
  hoverTransition: {
    ...webStyle({
      transitionProperty: 'transform, box-shadow, border-color',
      transitionDuration: '180ms',
      transitionTimingFunction: 'ease',
    }),
  },

  // Hero live demo — glow
  heroGlowWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 560,
    height: 560,
    borderRadius: 280,
    opacity: 0.9,
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    transform: [{ translateX: 60 }, { translateY: -40 }],
  },

  // Hero live demo — phone bezel
  phoneShadow: {
    position: 'relative',
    borderRadius: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.28,
    shadowRadius: 48,
    elevation: 16,
    ...webStyle({
      boxShadow:
        '0 1px 2px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.18), 0 32px 64px rgba(0,0,0,0.28)',
    }),
  },
  phoneBezel: {
    borderRadius: 44,
    padding: 10,
    overflow: 'hidden',
    backgroundColor: '#0a0a0c',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 34,
    overflow: 'hidden',
    position: 'relative',
  },
  phoneIsland: {
    position: 'absolute',
    top: 9,
    alignSelf: 'center',
    width: 96,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 9,
    zIndex: 10,
  },
  phoneIslandCamera: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a1a1f',
    borderWidth: 1,
    borderColor: 'rgba(80,80,90,0.6)',
  },

  // Hero live demo — screen content. The screen is taller than the content
  // needs (real-device aspect), so the body distributes its rows with
  // space-between — extra height becomes breathing room, never stretch.
  demoScreen: {
    flex: 1,
  },
  demoStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 13,
    height: 42,
  },
  demoStatusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  demoBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 14,
    justifyContent: 'space-between',
  },
  demoProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  demoAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoProBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  demoFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  demoChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  demoSliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  demoHomeWrap: {
    paddingTop: 4,
    paddingBottom: 8,
    alignItems: 'center',
  },
  demoHomeBar: {
    width: 120,
    height: 5,
    borderRadius: 3,
    opacity: 0.4,
  },

  // Hero live demo — seed swatches
  seedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  seedSwatchOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    ...webStyle({
      transitionProperty: 'transform, border-color',
      transitionDuration: '150ms',
      transitionTimingFunction: 'ease',
    }),
  },
  seedSwatchInner: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 2,
  },
  seedModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },

  // --- New landing bands -----------------------------------------------------

  // Full-width band (tinted / dark strips)
  band: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  bandInner: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  // In-container section (palette, a11y, teaser)
  landingSection: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: -12,
    borderRadius: 8,
  },

  // (a) Live gallery
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    width: '100%',
  },
  galleryCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  galleryCardDemo: {
    minHeight: 118,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  galleryCardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  galleryCardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  galleryBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 1,
  },
  galleryOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // (b) Dynamic color
  paletteCard: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 22,
    width: '100%',
  },
  paletteSeedChip: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
  },
  paletteToneRow: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderRadius: 11,
    overflow: 'hidden',
  },
  paletteToneCell: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
  },
  paletteToneCellFirst: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  paletteToneCellLast: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },

  // (c) Accessibility
  a11yGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    width: '100%',
  },
  a11yCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  a11yIconChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // (d) What's new teaser
  whatsNewBanner: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 16,
  },
  whatsNewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    minWidth: 32,
    alignItems: 'center',
  },
  whatsNewChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  // (e) Numbers band
  numbersHairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  numbersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 880,
    alignSelf: 'center',
  },
  numbersItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  // Mobile Bottom Navigation
  mobileBottomNav: {
    ...webStyle({ position: 'fixed' }),
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    zIndex: 99,
  },
  mobileNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
});
