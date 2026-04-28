import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  ScaledSize,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

interface ViewportOverlay {
  id: string;
  node: ReactNode;
}

interface ViewportContextValue extends ScaledSize {
  x: number;
  y: number;
  isContained: boolean;
  mountOverlay: (id: string, node: ReactNode) => void;
  unmountOverlay: (id: string) => void;
}

interface QuartzViewportProviderProps {
  children: ReactNode;
  width: number;
  height: number;
  scale?: number;
  fontScale?: number;
  isContained?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface QuartzViewportPortalProps {
  children: ReactNode;
  active?: boolean;
}

const ViewportContext = createContext<ViewportContextValue | null>(null);

let nextPortalId = 0;

export function QuartzViewportProvider({
  children,
  width,
  height,
  scale = 1,
  fontScale = 1,
  isContained = false,
  style,
}: QuartzViewportProviderProps): React.ReactElement {
  const rootRef = useRef<View>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [overlays, setOverlays] = useState<ViewportOverlay[]>([]);

  const mountOverlay = useCallback((id: string, node: ReactNode) => {
    setOverlays((current) => {
      const index = current.findIndex((overlay) => overlay.id === id);

      if (index === -1) {
        return [...current, { id, node }];
      }

      const next = current.slice();
      next[index] = { id, node };
      return next;
    });
  }, []);

  const unmountOverlay = useCallback((id: string) => {
    setOverlays((current) => current.filter((overlay) => overlay.id !== id));
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;

    rootRef.current?.measureInWindow?.((x, y) => {
      setOrigin({ x, y });
    });

    if (!rootRef.current?.measureInWindow) {
      setOrigin({ x: layout.x, y: layout.y });
    }
  }, []);

  const value = useMemo<ViewportContextValue>(
    () => ({
      width,
      height,
      scale,
      fontScale,
      x: origin.x,
      y: origin.y,
      isContained,
      mountOverlay,
      unmountOverlay,
    }),
    [fontScale, height, isContained, mountOverlay, origin.x, origin.y, scale, unmountOverlay, width]
  );

  return (
    <ViewportContext.Provider value={value}>
      <View ref={rootRef} onLayout={handleLayout} style={[styles.viewportRoot, style]}>
        {children}
        {isContained && overlays.length > 0 && (
          <View pointerEvents="box-none" style={styles.overlayHost}>
            {overlays.map((overlay) => (
              <React.Fragment key={overlay.id}>{overlay.node}</React.Fragment>
            ))}
          </View>
        )}
      </View>
    </ViewportContext.Provider>
  );
}

export function useViewportDimensions(): ScaledSize & {
  x: number;
  y: number;
  isContained: boolean;
} {
  const dimensions = useWindowDimensions();
  const viewport = useContext(ViewportContext);

  if (!viewport) {
    return {
      ...dimensions,
      x: 0,
      y: 0,
      isContained: false,
    };
  }

  return viewport;
}

export function QuartzViewportPortal({
  children,
  active = true,
}: QuartzViewportPortalProps): React.ReactElement | null {
  const viewport = useContext(ViewportContext);
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    nextPortalId += 1;
    idRef.current = `quartz-viewport-portal-${nextPortalId}`;
  }

  React.useEffect(() => {
    const id = idRef.current;

    if (!viewport?.isContained || !active || !id) {
      return undefined;
    }

    viewport.mountOverlay(id, children);

    return () => {
      viewport.unmountOverlay(id);
    };
  }, [active, children, viewport]);

  return null;
}

const styles = StyleSheet.create({
  viewportRoot: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  overlayHost: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
});
