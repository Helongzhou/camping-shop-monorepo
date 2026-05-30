import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  COOKIE_MAX_AGE_SECONDS,
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_VALUES,
  SITE_CONFIG,
  THEME_COOKIE_NAME,
} from '@myshop/shared';

import { routing } from './routing';

describe('i18n routing', () => {
  it('locales match @myshop/shared LOCALE_VALUES', () => {
    assert.deepEqual([...routing.locales], [...LOCALE_VALUES]);
  });

  it('default locale matches SITE_CONFIG', () => {
    assert.equal(routing.defaultLocale, DEFAULT_LOCALE);
    assert.equal(routing.defaultLocale, SITE_CONFIG.defaultLocale);
  });

  it('uses always locale prefix and shared locale cookie', () => {
    assert.notEqual(routing.localeCookie, false);

    if (routing.localeCookie !== false) {
      assert.equal(routing.localeCookie.name, LOCALE_COOKIE_NAME);
      assert.equal(routing.localeCookie.maxAge, COOKIE_MAX_AGE_SECONDS);
    }
  });

  it('theme cookie name is defined in shared for cross-layer use', () => {
    assert.equal(THEME_COOKIE_NAME, 'NEXT_THEME');
  });
});
