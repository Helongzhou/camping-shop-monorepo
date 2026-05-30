import { defineRouting } from 'next-intl/routing';
import {
  COOKIE_MAX_AGE_SECONDS,
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_VALUES,
} from '@myshop/shared';

export const routing = defineRouting({
  locales: [...LOCALE_VALUES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
  localeDetection: true,
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    sameSite: 'lax',
    path: '/',
  },
});
