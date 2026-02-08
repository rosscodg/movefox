'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  useCallback,
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

// ─── External store for localStorage theme preference ────────────────────────

let listeners: Array<() => void> = [];

function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem('theme') as Theme | null;
  return stored ?? 'system';
}

function getThemeServerSnapshot(): Theme {
  return 'system';
}

function subscribeToTheme(callback: () => void) {
  listeners.push(callback);

  // Listen for storage events (cross-tab sync)
  const handler = (e: StorageEvent) => {
    if (e.key === 'theme') callback();
  };
  window.addEventListener('storage', handler);

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    window.removeEventListener('storage', handler);
  };
}

function emitThemeChange() {
  for (const listener of listeners) {
    listener();
  }
}

// ─── External store for system color scheme preference ───────────────────────

function getSystemThemeSnapshot(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getSystemThemeServerSnapshot(): 'light' | 'dark' {
  return 'dark';
}

function subscribeToSystemTheme(callback: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    getSystemThemeServerSnapshot
  );

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  // Apply the theme class to the DOM (side effect only, no setState)
  const prevResolved = useRef(resolvedTheme);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    prevResolved.current = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem('theme', t);
    emitThemeChange();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
