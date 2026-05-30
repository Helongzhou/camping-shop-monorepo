# Hook Guidelines

> Custom hooks and data fetching in `@myshop/web`.

---

## Overview

Prefer **Server Components + async server data fetching** over client hooks when possible. Client hooks are for interactivity and browser-only state.

---

## Server Data Fetching (Preferred)

Fetch in Server Components or Route Handlers:

```typescript
// apps/web/src/app/products/[slug]/page.tsx
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  // render
}
```

Use `@myshop/shared` types for response shapes (`ProductDto`).

---

## Client Hooks

When `'use client'` is required:

- Colocate hooks in `src/hooks/` (create when first needed)
- Never access `window` / `localStorage` during render — use `useEffect`
- For countdowns, timers, or locale formatting: initialize in `useEffect` with loading skeleton during SSR

---

## Forbidden Patterns

- `useEffect` + fetch for data that can load on the server (hurts SEO and CWV)
- Synchronous `new Date().toLocaleString()` in render
- Duplicating Zod schemas — import from `@myshop/shared`

---

## Current State

Scaffold has no custom hooks yet. First hooks will likely appear for cart/checkout client state.
