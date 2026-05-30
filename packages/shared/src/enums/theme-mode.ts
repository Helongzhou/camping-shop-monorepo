export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

export const THEME_MODE_VALUES = [
  ThemeMode.LIGHT,
  ThemeMode.DARK,
  ThemeMode.SYSTEM,
] as const;

export const DEFAULT_THEME_MODE: ThemeMode = ThemeMode.SYSTEM;
