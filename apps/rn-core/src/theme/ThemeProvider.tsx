import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {ColorSchemeName, useColorScheme} from 'react-native';
import {DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme as NavigationTheme} from '@react-navigation/native';
import {AppTheme, darkTheme, lightTheme} from './tokens';

export type ThemeContextValue = {
  theme: AppTheme;
  colorScheme: Exclude<ColorSchemeName, null>;
  toggleTheme: () => void;
  setColorScheme: (scheme: Exclude<ColorSchemeName, null>) => void;
  navigationTheme: NavigationTheme;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const mapNavigationTheme = (scheme: 'light' | 'dark', theme: AppTheme): NavigationTheme => {
  const base = scheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      primary: theme.colors.primary,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.secondary,
    },
  };
};

export const ThemeProvider = ({children}: PropsWithChildren) => {
  const systemScheme = useColorScheme();
  const [manualScheme, setManualScheme] = useState<Exclude<ColorSchemeName, null> | null>(null);

  const scheme: Exclude<ColorSchemeName, null> = manualScheme ?? (systemScheme ?? 'light');

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const navigationTheme = useMemo(() => mapNavigationTheme(scheme, theme), [scheme, theme]);

  const toggleTheme = useCallback(() => {
    setManualScheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setColorScheme = useCallback((value: Exclude<ColorSchemeName, null>) => {
    setManualScheme(value);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colorScheme: scheme,
      toggleTheme,
      setColorScheme,
      navigationTheme,
    }),
    [navigationTheme, scheme, setColorScheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
