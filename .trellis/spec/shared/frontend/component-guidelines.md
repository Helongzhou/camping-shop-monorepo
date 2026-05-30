# Component Guidelines (Shared Types)

> Using shared enums and DTOs in UI components.

---

## Props Typing

```typescript
import type { ProductDto } from '@myshop/shared';

interface ProductCardProps {
  product: ProductDto;
}

export function ProductCard({ product }: ProductCardProps) {
  // ...
}
```

---

## Status Badges

Use shared `OrderStatus` constants:

```typescript
import { OrderStatus } from '@myshop/shared';

const label =
  status === OrderStatus.PAID ? 'Paid' : status === OrderStatus.PENDING ? 'Pending' : status;
```

---

## No Shared React Components (Yet)

`@myshop/shared` is logic/types only. UI components live in `apps/web/src/components/` when added.

---

## Forbidden

- Importing `@myshop/db` or Prisma types in components
- Hardcoding enum strings that differ from `@myshop/shared`
