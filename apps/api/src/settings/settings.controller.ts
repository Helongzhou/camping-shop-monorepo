import { Controller, Get, Query } from '@nestjs/common';
import type { SiteSettingsDto } from '@myshop/shared';

import type { StandardResponse } from '../common/interfaces/standard-response.interface';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(
    @Query('locale') locale?: string,
  ): Promise<StandardResponse<SiteSettingsDto>> {
    const requestedLocale = this.settingsService.parseLocaleQuery(locale);
    const data = await this.settingsService.getSettings(requestedLocale);

    return { success: true, data };
  }
}
