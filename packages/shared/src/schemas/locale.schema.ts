import { z } from 'zod';

import { DEFAULT_LOCALE, LOCALE_VALUES } from '../enums/locale.js';

export const localeSchema = z.enum(LOCALE_VALUES);

export const localeQuerySchema = z.object({
  locale: localeSchema.optional().default(DEFAULT_LOCALE),
});

export type LocaleQueryInput = z.infer<typeof localeQuerySchema>;

/**
 * Parse an unknown locale string; returns DEFAULT_LOCALE when invalid or missing.
 */
export function parseLocale(value: unknown): (typeof LOCALE_VALUES)[number] {
  const result = localeSchema.safeParse(value);
  return result.success ? result.data : DEFAULT_LOCALE;
}
