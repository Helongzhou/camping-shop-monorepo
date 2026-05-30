# Quality Guidelines

> Code quality standards for `@myshop/web`.

---

## Overview

From `.cursor/rules/monorepo.mdc` and `.cursor/rules/nextjs-frontend.mdc`.

---

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| `any` | Strict TypeScript across monorepo |
| `// TODO` / ellipsis placeholders | Zero-Placeholder policy |
| Sync read of `params` / `searchParams` | Breaks Next.js 15 contract |
| Raw `<img>` for product images | Hurts LCP and CLS |
| `<div>`-only product pages | SEO and accessibility |
| `new Date().toLocaleString()` in SSR | Hydration mismatch |
| Installing packages at monorepo root | Use `--filter @myshop/web` |

---

## Required Patterns

- `generateMetadata` on all dynamic product/blog routes
- `alternates.canonical` + language variants
- Product JSON-LD on detail pages
- `next/image` with dimensions or `sizes`
- `next/font` for web fonts
- `@myshop/shared` for DTOs and validation

---

## Testing & Lint

```bash
pnpm --filter @myshop/web lint
pnpm --filter @myshop/web build
```

---

## Code Review Checklist

- [ ] Page is a Server Component unless client interactivity required
- [ ] Metadata and JSON-LD present on product routes
- [ ] One `<h1>` per page
- [ ] Images use `next/image`
- [ ] No hydration-risky dynamic values in SSR
- [ ] Types from `@myshop/shared`, not duplicated

---

## Port

Dev server: **3000** (`next dev`). API runs on **3001**.
