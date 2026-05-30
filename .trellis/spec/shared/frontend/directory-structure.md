# Directory Structure (Frontend Consumer View)

> How `@myshop/web` imports from `@myshop/shared`.

---

## Overview

Web imports the same package as the API — no separate `@myshop/web-types` package.

---

## Import Examples

```typescript
import type { ProductDto, OrderDto } from '@myshop/shared';
import { createOrderSchema } from '@myshop/shared';
import { Currency, OrderStatus } from '@myshop/shared';
```

Use `@myshop/shared` in:
- Server Components (types for fetched data)
- Client Components (form validation with Zod)
- Route Handlers (request body validation)

---

## Do Not Duplicate

If a type or validator exists in shared, **import it** — do not copy into `apps/web/src/types/`.

---

## Build Order

When changing shared types, rebuild before web:

```bash
pnpm --filter @myshop/shared build
pnpm --filter @myshop/web build
```

Or run root `pnpm build` which builds packages first.
