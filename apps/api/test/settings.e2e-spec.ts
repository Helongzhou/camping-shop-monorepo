import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { Locale, type SiteSettingsDto } from '@myshop/shared';

import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import type { ErrorResponseBody } from '../src/common/interfaces/standard-response.interface';
import type { StandardResponse } from '../src/common/interfaces/standard-response.interface';
import { SettingsService } from '../src/settings/settings.service';

describe('Settings (e2e)', () => {
  let app: INestApplication<App>;

  const parseLocaleQueryMock = jest.fn<
    ReturnType<SettingsService['parseLocaleQuery']>,
    Parameters<SettingsService['parseLocaleQuery']>
  >();

  const getSettingsMock = jest.fn<
    Promise<SiteSettingsDto>,
    Parameters<SettingsService['getSettings']>
  >();

  const settingsServiceMock: Pick<
    SettingsService,
    'parseLocaleQuery' | 'getSettings'
  > = {
    parseLocaleQuery: parseLocaleQueryMock,
    getSettings: getSettingsMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SettingsService)
      .useValue(settingsServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('GET /settings?locale=zh returns success envelope with zh content', async () => {
    parseLocaleQueryMock.mockReturnValue(Locale.ZH);
    getSettingsMock.mockResolvedValue({
      requestedLocale: Locale.ZH,
      resolvedLocale: Locale.ZH,
      siteName: '趣巢',
      announcement: '趣巢满 $50 免运费',
      footerText: '© 2026 趣巢（TrailNest）。所有价格均以美元（USD）显示。',
    });

    const response = await request(app.getHttpServer())
      .get('/settings?locale=zh')
      .expect(200);

    const body = response.body as StandardResponse<SiteSettingsDto>;

    expect(body).toEqual({
      success: true,
      data: {
        requestedLocale: Locale.ZH,
        resolvedLocale: Locale.ZH,
        siteName: '趣巢',
        announcement: '趣巢满 $50 免运费',
        footerText: '© 2026 趣巢（TrailNest）。所有价格均以美元（USD）显示。',
      },
    });

    expect(parseLocaleQueryMock).toHaveBeenCalledWith('zh');
    expect(getSettingsMock).toHaveBeenCalledWith(Locale.ZH);
  });

  it('GET /settings returns default locale when query is omitted', async () => {
    parseLocaleQueryMock.mockReturnValue(Locale.EN);
    getSettingsMock.mockResolvedValue({
      requestedLocale: Locale.EN,
      resolvedLocale: Locale.EN,
      siteName: 'TrailNest',
      announcement: 'Free shipping on TrailNest orders over $50',
      footerText: '© 2026 TrailNest. All prices in USD.',
    });

    await request(app.getHttpServer()).get('/settings').expect(200);

    expect(parseLocaleQueryMock).toHaveBeenCalledWith(undefined);
    expect(getSettingsMock).toHaveBeenCalledWith(Locale.EN);
  });

  it('GET /settings?locale=fr returns 400 error envelope', async () => {
    parseLocaleQueryMock.mockImplementation(() => {
      throw new BadRequestException('Unsupported locale: fr');
    });

    const response = await request(app.getHttpServer())
      .get('/settings?locale=fr')
      .expect(400);

    const body = response.body as ErrorResponseBody;

    expect(body.success).toBe(false);
    expect(body.statusCode).toBe(400);
    expect(body.message).toContain('Unsupported locale: fr');
  });
});
