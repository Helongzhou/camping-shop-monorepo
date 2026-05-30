'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  COOKIE_MAX_AGE_SECONDS,
  LOCALE_COOKIE_NAME,
  LOCALE_VALUES,
  type Locale,
} from '@myshop/shared';

import { usePathname, useRouter } from '@/i18n/navigation';

export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;

    document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
      <span>{t('label')}</span>
      <select
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        aria-label={t('label')}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {LOCALE_VALUES.map((value) => (
          <option key={value} value={value}>
            {t(value)}
          </option>
        ))}
      </select>
    </label>
  );
}
