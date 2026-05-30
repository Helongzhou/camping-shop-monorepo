import { cookies } from 'next/headers';
import { parseThemeMode, THEME_COOKIE_NAME, type ThemeMode as ThemeModeType } from '@myshop/shared';

export { getThemeHtmlClass } from './theme-class';

export async function getServerThemeMode(): Promise<ThemeModeType> {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get(THEME_COOKIE_NAME)?.value;
  return parseThemeMode(rawTheme);
}
