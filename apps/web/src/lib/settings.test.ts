import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';

import { Locale } from '@myshop/shared';

import { getSiteSettings } from './settings';

describe('getSiteSettings', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  afterEach(() => {
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it('returns TrailNest fallback for en when API URL is unset', async () => {
    const settings = await getSiteSettings(Locale.EN);

    assert.equal(settings.siteName, 'TrailNest');
    assert.equal(settings.resolvedLocale, Locale.EN);
    assert.match(settings.footerText ?? '', /USD/);
  });

  it('returns 趣巢 fallback for zh when API URL is unset', async () => {
    const settings = await getSiteSettings(Locale.ZH);

    assert.equal(settings.siteName, '趣巢');
    assert.equal(settings.resolvedLocale, Locale.ZH);
    assert.match(settings.announcement ?? '', /免运费/);
  });
});
