'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ThemeMode } from '@myshop/shared';

const THEME_OPTIONS = [
  ThemeMode.LIGHT,
  ThemeMode.DARK,
  ThemeMode.SYSTEM,
] as const;

export function ThemeSwitcher() {
  const t = useTranslations('ThemeSwitcher');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-[7.5rem] rounded-md border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-zinc-300 bg-white p-1 dark:border-zinc-600 dark:bg-zinc-900"
      role="group"
      aria-label={t('label')}
    >
      {THEME_OPTIONS.map((option) => {
        const isActive = theme === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => setTheme(option)}
            aria-pressed={isActive}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              isActive
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            {t(option)}
          </button>
        );
      })}
    </div>
  );
}
