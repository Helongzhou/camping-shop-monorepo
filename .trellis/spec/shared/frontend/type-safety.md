# Type Safety (Frontend)

> Using shared types and Zod on the frontend.

---

## DTOs for Display

Use `ProductDto` / `OrderDto` for rendered data — prices are `priceCents` integers:

```typescript
function formatPrice(cents: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}
```

Format currency in the UI layer only — never store formatted strings in state.

---

## Client Form Validation

Reuse Zod schemas from shared:

```typescript
'use client';

import { createProductSchema } from '@myshop/shared';

function onSubmit(raw: unknown) {
  const data = createProductSchema.parse(raw);
  // submit to API
}
```

---

## SEO / JSON-LD

Product JSON-LD price comes from `priceCents`:

```typescript
'price': (product.priceCents / 100).toFixed(2),
'priceCurrency': product.currency,
```

---

## Forbidden Patterns

- `any` for product/order props
- Local duplicate of `createProductSchema`
- Storing prices as floats in React state

---

## Real Types

See `packages/shared/src/dto/product.dto.ts` and `packages/shared/src/schemas/product.schema.ts`.
