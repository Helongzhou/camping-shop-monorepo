import { routing } from '@/i18n/routing';

export function buildLocaleAlternates(path: string): Record<string, string> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return Object.fromEntries(
    routing.locales.map((locale) => [locale, `/${locale}${normalizedPath}`]),
  );
}

export function buildCanonicalPath(locale: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}
