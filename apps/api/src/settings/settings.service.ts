import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DEFAULT_LOCALE,
  Locale,
  localeSchema,
  type SiteSettingsDto,
} from '@myshop/shared';
import { prisma, SITE_SETTINGS_SINGLETON_ID } from '@myshop/db';

@Injectable()
export class SettingsService {
  parseLocaleQuery(rawLocale: string | undefined): Locale {
    if (rawLocale === undefined || rawLocale === '') {
      return DEFAULT_LOCALE;
    }

    const result = localeSchema.safeParse(rawLocale);
    if (!result.success) {
      throw new BadRequestException(`Unsupported locale: ${rawLocale}`);
    }

    return result.data;
  }

  async getSettings(requestedLocale: Locale): Promise<SiteSettingsDto> {
    const directContent = await prisma.siteContent.findUnique({
      where: {
        settingsId_locale: {
          settingsId: SITE_SETTINGS_SINGLETON_ID,
          locale: requestedLocale,
        },
      },
    });

    if (directContent) {
      return {
        requestedLocale,
        resolvedLocale: requestedLocale,
        siteName: directContent.siteName,
        announcement: directContent.announcement,
        footerText: directContent.footerText,
      };
    }

    if (requestedLocale === DEFAULT_LOCALE) {
      throw new NotFoundException(
        `Site settings not configured for locale: ${DEFAULT_LOCALE}`,
      );
    }

    const fallbackContent = await prisma.siteContent.findUnique({
      where: {
        settingsId_locale: {
          settingsId: SITE_SETTINGS_SINGLETON_ID,
          locale: DEFAULT_LOCALE,
        },
      },
    });

    if (!fallbackContent) {
      throw new NotFoundException('Site settings not configured');
    }

    return {
      requestedLocale,
      resolvedLocale: DEFAULT_LOCALE,
      siteName: fallbackContent.siteName,
      announcement: fallbackContent.announcement,
      footerText: fallbackContent.footerText,
    };
  }
}
