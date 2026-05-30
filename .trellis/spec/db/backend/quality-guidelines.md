# Quality Guidelines

> Quality standards for `@myshop/db`.

---

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| Float/Decimal for money | Cents-as-int rule |
| Skipping `prisma generate` after schema edits | Stale client types |
| Instantiating `new PrismaClient()` outside `client.ts` | Connection pool exhaustion |
| Business logic in this package | Belongs in `@myshop/api` services |
| `any` types | Monorepo strict TypeScript |

---

## Required Patterns

- Singleton client in `packages/db/src/client.ts`
- Re-export types from `packages/db/src/index.ts`
- Run `db:generate` after every schema change
- Use `$transaction` for multi-table writes (in API consumers)

---

## Build

```bash
pnpm --filter @myshop/db build    # prisma generate && tsc
```

---

## Code Review Checklist

- [ ] New money fields use `Int` and `*Cents` naming
- [ ] Enums synced with `@myshop/shared`
- [ ] Migration or push documented
- [ ] No direct `@prisma/client` imports outside this package
