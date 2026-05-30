# Database Guidelines

> Prisma and PostgreSQL conventions for `@myshop/db`.

---

## Overview

Source: `.cursor/rules/db.mdc`, `packages/db/prisma/schema.prisma`.

---

## Money Storage

**All prices, amounts, and discounts are stored as integer cents.**

```prisma
model Product {
  priceCents  Int
  // ...
}

model Order {
  totalCents Int
}

model OrderItem {
  unitPriceCents Int
}
```

**Forbidden**: `Float`, `Decimal`, or dollar floats in schema or seed data.

---

## Schema Change Workflow

1. Edit `packages/db/prisma/schema.prisma`
2. Run generate (required after every schema change):

```bash
pnpm --filter @myshop/db db:generate
```

3. Apply to database:

```bash
pnpm --filter @myshop/db db:migrate   # named migrations (preferred)
# or
pnpm --filter @myshop/db db:push      # prototyping only
```

---

## Transactions

Multi-table writes (e.g. deduct stock + create order) **must** use `prisma.$transaction` in the consuming service (`@myshop/api`), not split across separate non-transactional calls.

Example pattern (in API service):

```typescript
await prisma.$transaction(async (tx) => {
  await tx.product.update({ /* decrement stock */ });
  await tx.order.create({ /* ... */ });
});
```

---

## Enums

| Enum | Values | Shared mirror |
|------|--------|---------------|
| `OrderStatus` | PENDING, PAID, SHIPPED, CANCELLED | `@myshop/shared` `OrderStatus` |
| `Currency` | USD, CNY, EUR | `@myshop/shared` `Currency` |

Keep enum values in sync between Prisma schema and `@myshop/shared`.

---

## Environment

Copy `packages/db/.env.example` → `packages/db/.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myshop?schema=public"
```

---

## Indexes

Current schema indexes: `Product.slug`, `Order.status`, `OrderItem.orderId`, `OrderItem.productId`.

Add indexes when query patterns emerge — document rationale in migration names.
