# State Management (Shared Types)

> Typed client state with shared DTOs.

---

## Cart State (Planned)

When implementing cart, use shared types:

```typescript
import type { ProductDto } from '@myshop/shared';

interface CartLine {
  productId: string;
  quantity: number;
  unitPriceCents: number;  // snapshot at add-to-cart time
}
```

Never store formatted price strings — always cents.

---

## Enum State

Order/checkout status UI should use `OrderStatus` and `Currency` from `@myshop/shared`.

---

## Forbidden

- Untyped cart items (`any[]`)
- Float accumulation for totals — sum `unitPriceCents * quantity` as integers
