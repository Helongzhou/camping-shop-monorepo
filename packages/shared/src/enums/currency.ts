export const Currency = {
  USD: 'USD',
  CNY: 'CNY',
  EUR: 'EUR',
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export const CURRENCY_VALUES = [
  Currency.USD,
  Currency.CNY,
  Currency.EUR,
] as const;
