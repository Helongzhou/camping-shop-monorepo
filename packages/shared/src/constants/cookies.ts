/** Cookie written when the user selects a locale; read by Middleware on unprefixed paths. */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/** Cookie written on theme toggle; read by Root Layout for SSR initial class. */
export const THEME_COOKIE_NAME = 'NEXT_THEME';

/** One year — matches task-stripe-flow cookie spec. */
export const COOKIE_MAX_AGE_SECONDS = 31_536_000;
