import type { Locale } from '../enums/locale.js';

export interface SiteSettingsDto {
  /** Locale from the request query (before fallback). */
  requestedLocale: Locale;
  /** Locale actually used to resolve content (after fallback to en). */
  resolvedLocale: Locale;
  siteName: string;
  announcement: string | null;
  footerText: string | null;
}
