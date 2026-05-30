# Error Handling

> Database error handling for `@myshop/db`.

---

## Overview

This package exports the Prisma client only — it does not catch or transform errors. Error mapping happens in `@myshop/api` services.

---

## Prisma Error Types (handle in API layer)

| Code | Typical cause | API mapping |
|------|---------------|-------------|
| `P2002` | Unique constraint (duplicate slug) | `ConflictException` |
| `P2025` | Record not found | `NotFoundException` |
| `P2003` | FK constraint failed | `BadRequestException` |

Example in service:

```typescript
import { Prisma } from '@myshop/db';

try {
  await prisma.product.create({ data });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new ConflictException('Product slug already exists');
  }
  throw error;
}
```

---

## Transaction Failures

If any step inside `$transaction` throws, the entire transaction rolls back. Services must not catch-and-ignore partial failures.

---

## Connection Errors

Log at API layer; retry policies for transient DB outages belong in infrastructure, not in this package.

---

## Forbidden Patterns

- Swallowing Prisma errors in `@myshop/db` client wrapper
- Returning `{ success: false }` instead of throwing from services
