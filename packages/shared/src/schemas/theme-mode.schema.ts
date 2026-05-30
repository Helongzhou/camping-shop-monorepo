import { z } from 'zod';

import { DEFAULT_THEME_MODE, THEME_MODE_VALUES } from '../enums/theme-mode.js';

export const themeModeSchema = z.enum(THEME_MODE_VALUES);

/**
 * Parse an unknown theme mode; returns DEFAULT_THEME_MODE when invalid or missing.
 */
export function parseThemeMode(value: unknown): (typeof THEME_MODE_VALUES)[number] {
  const result = themeModeSchema.safeParse(value);
  return result.success ? result.data : DEFAULT_THEME_MODE;
}
