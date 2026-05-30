# Database Guidelines

> How `@myshop/api` accesses the database.

---

## Overview

All persistence goes through `@myshop/db` — never instantiate `PrismaClient` inside `apps/api` directly.

Source: `.cursor/rules/db.mdc`, `packages/db/prisma/schema.prisma`.

---

## Import Pattern

```typescript
import { prisma } from '@myshop/db';
```

The singleton client is defined in `packages/db/src/client.ts` with dev hot-reload safety via `globalThis`.

---

## Money & Amounts

- Store all monetary values as **integer cents** (`priceCents`, `totalCents`, `unitPriceCents`).
- Never use `Float` or `Decimal` for prices in Prisma schema or application code.
- Display formatting (e.g. `$19.99`) happens at the UI layer only.

---

## Transactions

Any operation that writes to multiple tables (deduct stock + create order + create order items) **must** use:

```typescript
await prisma.$transaction(async (tx) => {
  const product = await tx.product.update({
    where: { id: productId, stock: { gte: quantity } },
    data: { stock: { decrement: quantity } },
  });
  // ... create order and items with tx
});
```

---

## Schema Changes

After editing `packages/db/prisma/schema.prisma`:

```bash
pnpm --filter @myshop/db db:generate
pnpm --filter @myshop/db db:migrate   # or db:push in early dev
```

---

## Current Models

| Model | Purpose |
|-------|---------|
| `Product` | Catalog item with `priceCents`, `stock`, `currency` |
| `Order` | Checkout record with `status`, `totalCents` |
| `OrderItem` | Line item with `unitPriceCents`, `quantity` |

Enums `OrderStatus` and `Currency` align with `@myshop/shared`.

---

## Forbidden Patterns

- Raw SQL without team review (use Prisma query API first).
- Cross-package imports of generated Prisma types except via `@myshop/db` public exports.
- Installing `prisma` CLI in `apps/api` — it belongs in `@myshop/db` only.
