# Directory Structure

> How `@myshop/shared` is organized.

---

## Overview

Pure TypeScript library — no runtime framework dependencies except Zod. Shared by `@myshop/api` and `@myshop/web`.

Source: `.cursor/rules/monorepo.mdc`, `packages/shared/`.

---

## Directory Layout

```
packages/shared/
├── src/
│   ├── enums/
│   │   ├── order-status.ts
│   │   └── currency.ts
│   ├── schemas/
│   │   ├── product.schema.ts
│   │   └── order.schema.ts
│   ├── dto/
│   │   ├── product.dto.ts
│   │   └── order.dto.ts
│   └── index.ts
├── dist/                  # tsc output
├── package.json           # name: @myshop/shared
└── tsconfig.json
```

---

## Module Boundaries

| Folder | Contains |
|--------|----------|
| `enums/` | `const` objects + inferred union types |
| `schemas/` | Zod validators; infer input types with `z.infer` |
| `dto/` | Response/read-model interfaces (API → UI) |

**Do not** import NestJS, Next.js, or Prisma in this package.

---

## Exports

Single entry point — `packages/shared/src/index.ts` re-exports all public symbols.

Consumers:

```typescript
import {
  createProductSchema,
  type ProductDto,
  OrderStatus,
  Currency,
} from '@myshop/shared';
```

---

## Build

```bash
pnpm --filter @myshop/shared build    # tsc → dist/
pnpm --filter @myshop/shared dev      # tsc --watch
```

Rebuild shared before consuming apps if types change.

---

## ESM

Package uses `"type": "module"` with `.js` extensions in relative imports (`./enums/currency.js`).
