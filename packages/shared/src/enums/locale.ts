export const Locale = {
  EN: 'en',
  ZH: 'zh',
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];

export const LOCALE_VALUES = [Locale.EN, Locale.ZH] as const;

export const DEFAULT_LOCALE: Locale = Locale.EN;
