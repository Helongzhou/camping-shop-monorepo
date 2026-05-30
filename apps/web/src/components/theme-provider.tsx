'use client';

import { useEffect } from 'react';
import {
  ThemeProvider as NextThemesProvider,
  useTheme,
} from 'next-themes';
import {
  COOKIE_MAX_AGE_SECONDS,
  THEME_COOKIE_NAME,
  ThemeMode,
  type ThemeMode as ThemeModeType,
} from '@myshop/shared';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme: ThemeModeType;
};

function ThemeCookieSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) {
      return;
    }

    document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  }, [theme]);

  return null;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
      themes={[ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.SYSTEM]}
    >
      <ThemeCookieSync />
      {children}
    </NextThemesProvider>
  );
}
