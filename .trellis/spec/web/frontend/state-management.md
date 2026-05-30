# State Management

> State patterns for `@myshop/web`.

---

## Overview

Next.js 15 App Router — prefer server state over global client stores until complexity demands otherwise.

---

## State Layers

| Layer | Tool | When |
|-------|------|------|
| Server / URL | Server Components, `searchParams` | Product catalog, SEO pages |
| Form local | `useState` in client components | Checkout forms, filters |
| Cart / session | TBD (likely server + cookie or Stripe session) | Post-MVP |
| Global client | Avoid until needed | Only if prop-drilling becomes painful |

---

## Shared Types

Cart and product shapes come from `@myshop/shared`:

```typescript
import type { ProductDto, OrderDto } from '@myshop/shared';
```

---

## Hydration-Sensitive State

Time-based or random UI (countdowns, "recommended for you") must not differ between SSR HTML and client hydration. Pattern:

1. Server renders neutral placeholder
2. Client `useEffect` fills real value

---

## Forbidden Patterns

- Global Redux/MobX for initial scaffold without justification
- Storing prices as floats in client state — use `priceCents` integers

---

## Current State

Default Next.js template — no global store configured.
