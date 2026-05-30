import { ThemeMode, type ThemeMode as ThemeModeType } from '@myshop/shared';

export function getThemeHtmlClass(themeMode: ThemeModeType): string {
  if (themeMode === ThemeMode.LIGHT) {
    return 'light';
  }

  if (themeMode === ThemeMode.DARK) {
    return 'dark';
  }

  return '';
}
