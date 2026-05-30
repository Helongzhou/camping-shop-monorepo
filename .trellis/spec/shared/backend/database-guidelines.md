# Database-Related Types

> How shared types align with the database layer.

---

## Overview

`@myshop/shared` does not access the database. It mirrors Prisma enums and defines validation/API shapes that align with `@myshop/db` schema.

---

## Money Fields

All monetary fields in schemas and DTOs use **integer cents**:

```typescript
// packages/shared/src/schemas/product.schema.ts
priceCents: z.number().int().nonnegative(),

// packages/shared/src/dto/product.dto.ts
priceCents: number;
```

Must match Prisma `Int` columns in `packages/db/prisma/schema.prisma`.

---

## Enum Alignment

| Shared (`packages/shared/src/enums/`) | Prisma (`packages/db/prisma/schema.prisma`) |
|---------------------------------------|---------------------------------------------|
| `OrderStatus` | `enum OrderStatus` |
| `Currency` | `enum Currency` |

When adding enum values, update **both** packages in the same PR.

---

## DTO vs Prisma Models

- **Prisma models** (`Product`, `Order`) — database shape with `DateTime`
- **DTOs** (`ProductDto`, `OrderDto`) — API response shape with ISO date strings

Map in API services:

```typescript
function toProductDto(product: Product): ProductDto {
  return {
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
```

---

## Forbidden Patterns

- Float prices in Zod schemas or DTOs
- Importing `@myshop/db` or `@prisma/client` here
- Duplicating enum string literals without `as const` objects
