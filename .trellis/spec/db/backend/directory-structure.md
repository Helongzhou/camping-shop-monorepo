# Directory Structure

> How `@myshop/db` is organized.

---

## Overview

Prisma-based database package. Single source of truth for PostgreSQL schema and generated client.

Source: `packages/db/`, `.cursor/rules/db.mdc`.

---

## Directory Layout

```
packages/db/
├── prisma/
│   └── schema.prisma      # Models, enums, indexes
├── src/
│   ├── client.ts          # Singleton PrismaClient
│   └── index.ts           # Public exports
├── .env.example           # DATABASE_URL template
├── package.json           # name: @myshop/db
└── tsconfig.json
```

---

## Public API

Consumers import only from the package entry:

```typescript
import { prisma, Product, OrderStatus } from '@myshop/db';
```

Do not import from `@prisma/client` directly outside this package.

---

## Scripts

| Script | Command |
|--------|---------|
| Generate client | `pnpm --filter @myshop/db db:generate` |
| Migrate (dev) | `pnpm --filter @myshop/db db:migrate` |
| Push schema | `pnpm --filter @myshop/db db:push` |
| Studio | `pnpm --filter @myshop/db db:studio` |

---

## Naming Conventions

| Artifact | Pattern |
|----------|---------|
| Money fields | `*Cents` suffix, `Int` type |
| IDs | `@default(cuid())` |
| Timestamps | `createdAt`, `updatedAt` with `@updatedAt` |
| Relations | Explicit `@relation` with indexes on FK columns |

---

## Examples

- Schema: `packages/db/prisma/schema.prisma`
- Client singleton: `packages/db/src/client.ts`
