import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

export type Theme = 'light' | 'dark';
export type ThemePreference = Theme | 'system';

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference(value: ThemePreference): void;
  toggleTheme(): void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'family-task-center.theme';

const isStoredPreference = (value: string | null): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system';

const getStoredPreference = (): ThemePreference | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isStoredPreference(stored) ? stored : null;
  } catch (error) {
    console.warn('Unable to access theme preference storage.', error);
    return null;
  }
};

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolvePreference = (preference: ThemePreference, systemTheme: Theme): Theme =>
  preference === 'system' ? systemTheme : preference;

const applyDocumentTheme = (theme: Theme) => {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.setProperty('color-scheme', theme === 'dark' ? 'dark' : 'light');
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => getStoredPreference() ?? 'system');
  const [theme, setTheme] = useState<Theme>(() => {
    const storedPreference = getStoredPreference() ?? 'system';
    const resolved = resolvePreference(storedPreference, getSystemTheme());
    applyDocumentTheme(resolved);
    return resolved;
  });

  useEffect(() => {
    applyDocumentTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      if (preference === 'system') {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };

    if (preference === 'system') {
      setTheme(media.matches ? 'dark' : 'light');
    }

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [preference]);

  const setPreference = useCallback(
    (value: ThemePreference) => {
      setPreferenceState(value);
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, value);
        } catch (error) {
          console.warn('Unable to persist theme preference.', error);
        }
      }
      setTheme(resolvePreference(value, getSystemTheme()));
    },
    [setPreferenceState, setTheme]
  );

  const toggleTheme = useCallback(() => {
    setPreference(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setPreference]);

  const value = useMemo(
    () => ({
      theme,
      preference,
      setPreference,
      toggleTheme
    }),
    [theme, preference, setPreference, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
