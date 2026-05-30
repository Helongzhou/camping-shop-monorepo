import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ThemeMode } from '@myshop/shared';

import { getThemeHtmlClass } from './theme-class';

describe('getThemeHtmlClass', () => {
  it('returns light class for light mode', () => {
    assert.equal(getThemeHtmlClass(ThemeMode.LIGHT), 'light');
  });

  it('returns dark class for dark mode', () => {
    assert.equal(getThemeHtmlClass(ThemeMode.DARK), 'dark');
  });

  it('returns empty string for system mode', () => {
    assert.equal(getThemeHtmlClass(ThemeMode.SYSTEM), '');
  });
});
