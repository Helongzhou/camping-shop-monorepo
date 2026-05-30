# i18n & Theme Guidelines

> Global storefront foundation: locale routing, theme switching, and SiteSettings consumption in `@myshop/web`.

Source: `apps/web/src/`, `@myshop/shared`, task `05-30-global-i18n-theme-foundation`.

---

## Overview

| Concern | Library / location | Authority |
|---------|------------------|-----------|
| Locales | `next-intl` | URL path (`/en`, `/zh`) |
| Theme | `next-themes` + cookie | `NEXT_THEME` cookie for SSR |
| Site copy (name, announcement, footer) | `GET /settings` | `@myshop/api` + DB seed |
| UI chrome strings | `src/messages/*.json` | Static next-intl dictionaries |
| Structural config | `@myshop/shared` | `SITE_CONFIG`, enums, cookie names |

**Brand (MVP)**: English **TrailNest**, Chinese **趣巢**.

---

## Directory Layout (implemented)

```
apps/web/src/
├── middleware.ts                 # next-intl middleware (locale redirect)
├── i18n/
│   ├── routing.ts                # locales, localePrefix: always, localeCookie
│   ├── request.ts                # getRequestConfig → messages
│   └── navigation.ts             # Link, useRouter, usePathname
├── messages/
│   ├── en.json
│   └── zh.json
├── lib/
│   ├── settings.ts               # fetch GET /settings + fallback
│   └── theme-server.ts           # read NEXT_THEME cookie on server
├── components/
│   ├── locale-switcher.tsx       # URL prefix + NEXT_LOCALE cookie
│   ├── theme-switcher.tsx        # light / dark / system
│   ├── theme-provider.tsx        # next-themes + cookie sync
│   ├── site-header.tsx
│   ├── announcement-bar.tsx
│   └── site-footer.tsx
└── app/
    └── [locale]/
        ├── layout.tsx              # Promise.all messages + settings + theme
        └── page.tsx
```

---

## i18n Rules

### URL is authoritative

- All pages live under `/[locale]/...` with **`localePrefix: 'always'`** (including default `en`).
- Middleware must **not** override an explicit locale in the URL with cookie or `Accept-Language`.
- Unprefixed paths (`/`, `/products`) redirect: **cookie → Accept-Language → `en`**.

### Adding UI copy

1. Add keys to **both** `messages/en.json` and `messages/zh.json`.
2. Use `getTranslations` in Server Components, `useTranslations` in Client Components.
3. Do **not** hardcode user-visible strings in components (except API/seed fallback defaults in `lib/settings.ts`).

### Language switcher

On change:

1. Navigate to same path with new locale prefix (`router.replace(pathname, { locale })`).
2. Write `NEXT_LOCALE` cookie (`LOCALE_COOKIE_NAME` from `@myshop/shared`).

### Product/content translation

- MVP: product names/descriptions remain **English** from API.
- `ProductTranslation` table is reserved in DB — do not query until Phase 2.

---

## Theme Rules

### Three modes

| Mode | Cookie value | SSR `<html>` class |
|------|--------------|-------------------|
| `light` | `light` | `light` |
| `dark` | `dark` | `dark` |
| `system` | `system` | *(none — client applies OS preference)* |

### Implementation checklist

- `ThemeProvider`: `attribute="class"`, `enableSystem`, `defaultTheme` from server cookie.
- `ThemeCookieSync`: writes `NEXT_THEME` on client change.
- `globals.css`: use `.dark { ... }`, **not** `@media (prefers-color-scheme)` alone.
- `<html suppressHydrationWarning>` required.
- Theme controls must be Client Components only.

---

## SiteSettings (global data)

### Fetch

```typescript
// apps/web/src/lib/settings.ts
const settings = await getSiteSettings(locale);
// GET ${NEXT_PUBLIC_API_URL}/settings?locale=...
// next: { revalidate: 60 }
```

### Fallback

If API is down or `NEXT_PUBLIC_API_URL` is unset, `getSiteSettings` returns hardcoded TrailNest / 趣巢 defaults — site must still render.

### Layout assembly order

```
AnnouncementBar → SiteHeader → {children} → SiteFooter
```

---

## SEO

- `<html lang={locale}>` set in `[locale]/layout.tsx`.
- Pages export `generateMetadata` with `alternates.canonical` and `alternates.languages` per locale path.
- Dynamic product pages (future): include JSON-LD + locale-aware metadata.

---

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| Cookie overriding URL locale | Breaks shareable links |
| `@myshop/db` / Prisma in web | Data via API only |
| SSR `window` / `localStorage` for theme | Hydration mismatch |
| Locale-bound currency display | MVP is USD-only; language ≠ money |
| Rich text in announcement/footer MVP | Plain text only; no unsanitized HTML |

---

## Local Verification

```bash
pnpm db:up && pnpm db:migrate && pnpm db:seed
pnpm dev:apps
```

| Check | URL / action | Expected |
|-------|--------------|----------|
| Default redirect | `http://localhost:3000/` | → `/en` or `/zh` |
| EN site | `/en` | Header **TrailNest**, EN UI |
| ZH site | `/zh` | Header **趣巢**, ZH UI |
| Share link | Open `/zh` in EN browser | Stays Chinese |
| Theme persist | Set dark → refresh | Still dark, no white flash |
| Settings API | `curl localhost:3001/settings?locale=zh` | `siteName: 趣巢` |

---

## Dependencies

```bash
pnpm --filter @myshop/web add next-intl next-themes
```

Configured via `next-intl/plugin` in `next.config.ts`.
