import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Locale } from '@myshop/shared';

type SiteContentRow = {
  siteName: string;
  announcement: string | null;
  footerText: string | null;
};

const findUniqueMock = jest.fn<Promise<SiteContentRow | null>, [unknown]>();

jest.mock('@myshop/db', () => ({
  prisma: {
    siteContent: {
      findUnique: (args: unknown) => findUniqueMock(args),
    },
  },
  SITE_SETTINGS_SINGLETON_ID: 'singleton',
}));

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    service = new SettingsService();
    findUniqueMock.mockReset();
  });

  describe('parseLocaleQuery', () => {
    it('defaults to en when locale is omitted', () => {
      expect(service.parseLocaleQuery(undefined)).toBe(Locale.EN);
    });

    it('accepts zh', () => {
      expect(service.parseLocaleQuery('zh')).toBe(Locale.ZH);
    });

    it('throws BadRequestException for unsupported locale', () => {
      expect(() => service.parseLocaleQuery('fr')).toThrow(BadRequestException);
    });
  });

  describe('getSettings', () => {
    it('returns zh content when configured', async () => {
      findUniqueMock.mockResolvedValueOnce({
        siteName: '趣巢',
        announcement: '趣巢满 $50 免运费',
        footerText: '© 2026 趣巢（TrailNest）',
      });

      const result = await service.getSettings(Locale.ZH);

      expect(result).toEqual({
        requestedLocale: Locale.ZH,
        resolvedLocale: Locale.ZH,
        siteName: '趣巢',
        announcement: '趣巢满 $50 免运费',
        footerText: '© 2026 趣巢（TrailNest）',
      });
    });

    it('falls back to en when zh content is missing', async () => {
      findUniqueMock.mockResolvedValueOnce(null).mockResolvedValueOnce({
        siteName: 'TrailNest',
        announcement: 'Free shipping on TrailNest orders over $50',
        footerText: '© 2026 TrailNest',
      });

      const result = await service.getSettings(Locale.ZH);

      expect(result).toEqual({
        requestedLocale: Locale.ZH,
        resolvedLocale: Locale.EN,
        siteName: 'TrailNest',
        announcement: 'Free shipping on TrailNest orders over $50',
        footerText: '© 2026 TrailNest',
      });
    });

    it('throws NotFoundException when en content is missing', async () => {
      findUniqueMock.mockResolvedValueOnce(null);

      await expect(service.getSettings(Locale.EN)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
