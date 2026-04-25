/**
 * Quartz UI - useFocusVisible Hook
 *
 * Distinguishes keyboard-driven focus from pointer/touch-driven focus, mirroring
 * CSS `:focus-visible`. Focus rings should only show for keyboard users — showing
 * them on every tap creates UI noise.
 *
 * On native (iOS/Android) we always treat focus as "visible" because focus there
 * is almost always assistive-tech driven (VoiceOver/TalkBack/keyboard). On web
 * we track the last input modality and only flag focus as visible when it
 * arrived via keyboard.
 */

import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

type Modality = 'keyboard' | 'pointer';

let lastModality: Modality = 'keyboard';
let listenersInstalled = false;
const subscribers = new Set<(m: Modality) => void>();

function installWebListeners() {
  if (listenersInstalled || Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }
  listenersInstalled = true;

  const setModality = (next: Modality) => {
    if (lastModality !== next) {
      lastModality = next;
      subscribers.forEach((s) => s(next));
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    // Modifier-only presses (Tab navigation, arrow keys, Enter/Space) count as keyboard.
    // Cmd/Ctrl shortcuts don't count — user could be using mouse with shortcuts.
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    setModality('keyboard');
  };
  const onPointerDown = () => setModality('pointer');

  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('mousedown', onPointerDown, true);
  window.addEventListener('pointerdown', onPointerDown, true);
  window.addEventListener('touchstart', onPointerDown, true);
}

/**
 * Returns `{ isFocusVisible, onFocus, onBlur }`. Wire `onFocus`/`onBlur` to
 * your component's focus events, and use `isFocusVisible` to conditionally
 * render a focus ring.
 *
 * @example
 *   const { isFocusVisible, onFocus, onBlur } = useFocusVisible();
 *   return <Pressable onFocus={onFocus} onBlur={onBlur}>
 *     {isFocusVisible && <FocusRing />}
 *   </Pressable>
 */
export function useFocusVisible() {
  const [isFocused, setIsFocused] = useState(false);
  const [modality, setModality] = useState<Modality>(lastModality);

  useEffect(() => {
    installWebListeners();
    const sub = (m: Modality) => setModality(m);
    subscribers.add(sub);
    return () => {
      subscribers.delete(sub);
    };
  }, []);

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);

  // On native, focus is essentially always assistive — show the ring.
  // On web, only show when the last input modality was keyboard.
  const isFocusVisible = isFocused && (Platform.OS !== 'web' || modality === 'keyboard');

  return { isFocusVisible, isFocused, onFocus, onBlur };
}
