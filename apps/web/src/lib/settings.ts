import {
  DEFAULT_LOCALE,
  Locale,
  type SiteSettingsDto,
} from '@myshop/shared';

interface SettingsApiResponse {
  success: true;
  data: SiteSettingsDto;
}

const FALLBACK_SETTINGS: Record<Locale, SiteSettingsDto> = {
  [Locale.EN]: {
    requestedLocale: Locale.EN,
    resolvedLocale: Locale.EN,
    siteName: 'TrailNest',
    announcement: 'Free shipping on TrailNest orders over $50',
    footerText: '© 2026 TrailNest. All prices in USD.',
  },
  [Locale.ZH]: {
    requestedLocale: Locale.ZH,
    resolvedLocale: Locale.ZH,
    siteName: '趣巢',
    announcement: '趣巢满 $50 免运费',
    footerText: '© 2026 趣巢（TrailNest）。所有价格均以美元（USD）显示。',
  },
};

function getFallbackSettings(locale: Locale): SiteSettingsDto {
  return FALLBACK_SETTINGS[locale] ?? FALLBACK_SETTINGS[DEFAULT_LOCALE];
}

function isSettingsApiResponse(value: unknown): value is SettingsApiResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  if (record.success !== true || typeof record.data !== 'object' || record.data === null) {
    return false;
  }

  const data = record.data as Record<string, unknown>;
  return typeof data.siteName === 'string';
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettingsDto> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return getFallbackSettings(locale);
  }

  try {
    const response = await fetch(`${baseUrl}/settings?locale=${locale}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return getFallbackSettings(locale);
    }

    const body: unknown = await response.json();

    if (!isSettingsApiResponse(body)) {
      return getFallbackSettings(locale);
    }

    return body.data;
  } catch {
    return getFallbackSettings(locale);
  }
}
