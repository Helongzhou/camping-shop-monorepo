# Component Guidelines

> React / Next.js component patterns for `@myshop/web`.

---

## Overview

Source: `.cursor/rules/nextjs-frontend.mdc`.

---

## Server vs Client Components

- **Default to Server Components** for pages, layouts, and static product content.
- Add `'use client'` only when using hooks, browser APIs, or event handlers.

---

## Semantic HTML (Required for Product Pages)

Product and content pages must use semantic structure:

| Element | Usage |
|---------|--------|
| `<main>` | Page wrapper |
| `<article>` | Product or blog post body |
| `<section>` | Logical sections |
| `<h1>` | Exactly one per page (product title) |
| `<button>` | Actions |
| `<Link>` | Internal navigation (from `next/link`) |

**Forbidden**: wrapping entire pages in anonymous `<div>` soup without landmarks.

---

## Images

Always use `next/image`:

```tsx
import Image from 'next/image';

<Image
  src={product.mainImage}
  alt={product.name}
  width={1200}
  height={630}
  priority={isAboveFold}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

- Above-the-fold images: `priority`
- Always set `width`/`height` or `sizes` to prevent CLS

---

## JSON-LD (Product Pages)

Inject Product schema for rich snippets:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Price in JSON-LD uses decimal string from cents: `(priceCents / 100).toFixed(2)`.

---

## Hydration Safety

| Scenario | Pattern |
|----------|---------|
| `window`, `localStorage` | Client component + `useEffect` |
| `new Date().toLocaleString()` in SSR | **Forbidden** — format on client |
| Uncontrolled third-party widgets | `dynamic(..., { ssr: false })` |

---

## Example Reference

Scaffold home page: `apps/web/src/app/page.tsx` — uses `<main>`, `Image` with `priority`.
