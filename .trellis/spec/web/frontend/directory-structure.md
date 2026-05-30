# Directory Structure

> How frontend code is organized in `@myshop/web`.

---

## Overview

Next.js 15 App Router storefront under `apps/web/`. SEO, Stripe checkout, and Core Web Vitals are first-class concerns.

Source: `.cursor/rules/nextjs-frontend.mdc`, `.cursor/rules/monorepo.mdc`.

---

## Directory Layout

```
apps/web/
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout
│       ├── page.tsx         # Home page
│       └── globals.css
├── public/                  # Static assets
├── next.config.ts
├── tsconfig.json            # paths: "@/*" → "./src/*"
└── package.json             # name: @myshop/web
```

Planned growth for the indie shop:

```
apps/web/src/app/
├── layout.tsx
├── page.tsx
├── products/
│   └── [slug]/
│       └── page.tsx         # Product detail + generateMetadata + JSON-LD
├── (checkout)/
│   └── ...
└── api/                     # Route handlers if needed
```

---

## Import Alias

Use `@/` for imports from `src/`:

```typescript
import { createProductSchema } from '@myshop/shared';
import { ProductCard } from '@/components/product-card';
```

---

## Naming Conventions

| Artifact | Pattern |
|----------|---------|
| Route segment folder | kebab-case (`products/[slug]`) |
| Components | PascalCase files in `src/components/` |
| Server Components | Default — no `'use client'` unless needed |
| Client Components | `'use client'` at top; suffix `-client.tsx` optional |

---

## Examples

- Home page scaffold: `apps/web/src/app/page.tsx` — uses `<main>`, `next/image` with `priority` on hero logo.
- Shared validation: import Zod schemas from `@myshop/shared`, not duplicated in web.

---

## Monorepo

```bash
pnpm --filter @myshop/web add lucide-react
pnpm --filter @myshop/web dev    # next dev — port 3000
```

Never install UI dependencies at the monorepo root.
