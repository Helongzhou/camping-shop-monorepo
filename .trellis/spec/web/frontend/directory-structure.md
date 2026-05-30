# Directory Structure

> How frontend code is organized in `@myshop/web`.

---

## Overview

Next.js 15 App Router storefront under `apps/web/`. SEO, i18n (`next-intl`), theme (`next-themes`), SiteSettings API, Stripe checkout, and Core Web Vitals are first-class concerns.

Source: `.cursor/rules/nextjs-frontend.mdc`, `.trellis/spec/web/frontend/i18n-theme-guidelines.md`.

---

## Directory Layout (current)

```
apps/web/
├── src/
│   ├── middleware.ts
│   ├── i18n/
│   │   ├── routing.ts
│   │   ├── request.ts
│   │   └── navigation.ts
│   ├── messages/
│   │   ├── en.json
│   │   └── zh.json
│   ├── lib/
│   │   ├── settings.ts
│   │   └── theme-server.ts
│   ├── components/
│   │   ├── site-header.tsx
│   │   ├── announcement-bar.tsx
│   │   ├── site-footer.tsx
│   │   ├── locale-switcher.tsx
│   │   ├── theme-switcher.tsx
│   │   └── theme-provider.tsx
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       └── [locale]/
│           ├── layout.tsx
│           └── page.tsx
├── public/
├── next.config.ts             # next-intl plugin
├── tsconfig.json              # paths: "@/*" → "./src/*"
└── package.json               # name: @myshop/web
```

Planned growth:

```
apps/web/src/app/[locale]/
├── products/
│   └── [slug]/page.tsx        # generateMetadata + JSON-LD
└── (checkout)/...
```

---

## Import Alias

Use `@/` for imports from `src/`:

```typescript
import { Locale } from '@myshop/shared';
import { SiteHeader } from '@/components/site-header';
import { Link } from '@/i18n/navigation';
```

---

## Naming Conventions

| Artifact | Pattern |
|----------|---------|
| Route segment folder | `[locale]`, `[slug]` |
| Components | PascalCase in `src/components/` |
| Server Components | Default — no `'use client'` unless needed |
| Client Components | `'use client'` — switchers, theme provider |
| i18n keys | PascalCase namespaces in JSON (`HomePage`, `ThemeSwitcher`) |

---

## Monorepo

```bash
pnpm --filter @myshop/web add next-intl
pnpm --filter @myshop/web dev    # port 3000
```

Never install UI dependencies at the monorepo root.

See [i18n & Theme Guidelines](./i18n-theme-guidelines.md) for middleware, cookie, and Settings API rules.
