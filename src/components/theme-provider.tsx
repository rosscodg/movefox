'use client';

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
  useRef,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

// Simple external store for theme to avoid setState-in-effect lint errors
function createThemeStore() {
  let theme: Theme = 'system';
  let resolved: 'light' | 'dark' = 'dark';
  const listeners = new Set<() => void>();

  function getSnapshot() {
    return { theme, resolved };
  }

  function getServerSnapshot() {
    return { theme: 'system' as Theme, resolved: 'dark' as const };
  }

  function subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }

  function emit() {
    listeners.forEach((cb) => cb());
  }

  function init() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('theme') as Theme | null;
    theme = stored ?? 'system';
    resolved = theme === 'system' ? getSystemTheme() : theme;
    applyClass(resolved);
    emit();
  }

  function set(t: Theme) {
    theme = t;
    resolved = t === 'system' ? getSystemTheme() : t;
    localStorage.setItem('theme', t);
    applyClass(resolved);
    emit();
  }

  function onSystemChange(dark: boolean) {
    if (theme !== 'system') return;
    resolved = dark ? 'dark' : 'light';
    applyClass(resolved);
    emit();
  }

  function applyClass(r: 'light' | 'dark') {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(r);
  }

  return { getSnapshot, getServerSnapshot, subscribe, init, set, onSystemChange };
}

const store = createThemeStore();

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, resolved } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const initRef = useRef(false);

  // Initialise once on mount
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      store.init();
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => store.onSystemChange(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setTheme = useCallback((t: Theme) => store.set(t), []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
