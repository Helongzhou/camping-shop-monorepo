import { Currency } from '../enums/currency.js';
import { DEFAULT_LOCALE, LOCALE_VALUES } from '../enums/locale.js';
import { DEFAULT_THEME_MODE } from '../enums/theme-mode.js';

export const SITE_CONFIG = {
  supportedLocales: LOCALE_VALUES,
  defaultLocale: DEFAULT_LOCALE,
  defaultCurrency: Currency.USD,
  defaultThemeMode: DEFAULT_THEME_MODE,
} as const;
