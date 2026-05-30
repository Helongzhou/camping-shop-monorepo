# Error Handling

> Error handling conventions for `@myshop/api`.

---

## Overview

Use NestJS built-in HTTP exceptions and a global exception filter. Do not invent ad-hoc `{ code, message }` error shapes in controllers.

Source: `.cursor/rules/nestjs-backend.mdc`.

---

## Required Patterns

### Throw Nest HTTP exceptions from services

```typescript
import { BadRequestException, NotFoundException } from '@nestjs/common';

async findBySlug(slug: string): Promise<Product> {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    throw new NotFoundException(`Product not found: ${slug}`);
  }
  return product;
}
```

### Controllers return a consistent success envelope

```typescript
@Post()
@UsePipes(new ValidationPipe({ whitelist: true }))
async createOrder(
  @Body() createOrderDto: CreateOrderDto,
): Promise<StandardResponse<Order>> {
  const order = await this.ordersService.create(createOrderDto);
  return { success: true, data: order };
}
```

### Global filter (to add when first feature ships)

Configure `HttpExceptionFilter` in `main.ts` or a dedicated `filters/` module so all unhandled errors map to predictable HTTP status codes and JSON bodies.

---

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| `return { code: 500, message: '...' }` from controllers | Bypasses Nest exception pipeline and HTTP semantics |
| Swallowing errors in empty `catch` blocks | Hides production failures |
| Business logic in controllers | Hard to test and reuse |
| Using `any` for DTOs or service returns | Violates monorepo type-safety rules |

---

## Validation

- Prefer Zod schemas from `@myshop/shared` parsed in the service or a custom pipe.
- When using class-validator DTOs, always enable `ValidationPipe({ whitelist: true })` to strip unknown fields.

---

## Money & Inventory Errors

Operations that touch `priceCents`, `totalCents`, or `stock` must fail fast with `BadRequestException` or `ConflictException` when invariants break (insufficient stock, duplicate order, etc.), inside a `prisma.$transaction` block.
