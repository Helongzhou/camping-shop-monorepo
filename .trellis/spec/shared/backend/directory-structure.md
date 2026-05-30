# Directory Structure

> How `@myshop/shared` is organized.

---

## Overview

Pure TypeScript library — no runtime framework dependencies except Zod. Shared by `@myshop/api` and `@myshop/web`.

Source: `.cursor/rules/monorepo.mdc`, `packages/shared/`.

---

## Directory Layout

```
packages/shared/
├── src/
│   ├── enums/
│   │   ├── order-status.ts
│   │   ├── currency.ts
│   │   ├── locale.ts           # Locale.EN | Locale.ZH
│   │   └── theme-mode.ts       # light | dark | system
│   ├── constants/
│   │   ├── cookies.ts          # LOCALE_COOKIE_NAME, THEME_COOKIE_NAME
│   │   └── site-config.ts      # SITE_CONFIG (locales, defaultCurrency USD)
│   ├── schemas/
│   │   ├── product.schema.ts
│   │   ├── order.schema.ts
│   │   ├── locale.schema.ts
│   │   └── theme-mode.schema.ts
│   ├── dto/
│   │   ├── product.dto.ts
│   │   ├── order.dto.ts
│   │   └── site-settings.dto.ts
│   └── index.ts
├── dist/
├── package.json
└── tsconfig.json
```

---

## Module Boundaries

| Folder | Contains |
|--------|----------|
| `enums/` | `const` objects + inferred union types |
| `constants/` | Cookie names, `SITE_CONFIG` structural config |
| `schemas/` | Zod validators; infer input types with `z.infer` |
| `dto/` | Response/read-model interfaces (API → UI) |

**Do not** import NestJS, Next.js, or Prisma in this package.

---

## Global Foundation Exports

### Locale & i18n

```typescript
import {
  Locale,
  LOCALE_VALUES,
  DEFAULT_LOCALE,
  localeSchema,
  parseLocale,
} from '@myshop/shared';
```

- `LOCALE_VALUES`: `['en', 'zh']` — must stay in sync with `apps/web/src/i18n/routing.ts` and Prisma `SiteContent.locale`.
- `parseLocale(unknown)`: invalid → `DEFAULT_LOCALE` (`en`).

### Theme

```typescript
import {
  ThemeMode,
  THEME_MODE_VALUES,
  DEFAULT_THEME_MODE,
  themeModeSchema,
  parseThemeMode,
} from '@myshop/shared';
```

- `DEFAULT_THEME_MODE`: `system`.
- Used by `apps/web` theme provider and `NEXT_THEME` cookie parsing.

### Cookies

```typescript
import {
  LOCALE_COOKIE_NAME,   // 'NEXT_LOCALE'
  THEME_COOKIE_NAME,    // 'NEXT_THEME'
  COOKIE_MAX_AGE_SECONDS,
} from '@myshop/shared';
```

Middleware and client switchers must import these — **never hardcode cookie names**.

### SiteSettings DTO

```typescript
import type { SiteSettingsDto } from '@myshop/shared';
```

Fields: `requestedLocale`, `resolvedLocale`, `siteName`, `announcement`, `footerText`.

Returned by `GET /settings`; consumed by `apps/web/src/lib/settings.ts`.

### SITE_CONFIG

```typescript
import { SITE_CONFIG } from '@myshop/shared';
// { supportedLocales, defaultLocale, defaultCurrency: USD, defaultThemeMode }
```

Structural config only — operational copy (announcement, footer) lives in DB.

---

## Exports

Single entry point — `packages/shared/src/index.ts` re-exports all public symbols.

```typescript
import {
  createProductSchema,
  type ProductDto,
  type SiteSettingsDto,
  Locale,
  ThemeMode,
  SITE_CONFIG,
} from '@myshop/shared';
```

---

## Build

```bash
pnpm --filter @myshop/shared build
pnpm --filter @myshop/shared dev      # tsc --watch
```

Rebuild shared before consuming apps if types change.

---

## ESM

Package uses `"type": "module"` with `.js` extensions in relative imports (`./enums/locale.js`).
