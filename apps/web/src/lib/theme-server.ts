import { cookies } from 'next/headers';
import {
  parseThemeMode,
  THEME_COOKIE_NAME,
  ThemeMode,
  type ThemeMode as ThemeModeType,
} from '@myshop/shared';

export { getThemeHtmlClass } from './theme-class';

export async function getServerThemeMode(): Promise<ThemeModeType> {
  if (process.env.GITHUB_PAGES === 'true') {
    return ThemeMode.SYSTEM;
  }

  const cookieStore = await cookies();
  const rawTheme = cookieStore.get(THEME_COOKIE_NAME)?.value;
  return parseThemeMode(rawTheme);
}
