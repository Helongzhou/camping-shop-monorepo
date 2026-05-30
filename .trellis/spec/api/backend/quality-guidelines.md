# Quality Guidelines

> Code quality standards for `@myshop/api`.

---

## Overview

Standards inherited from monorepo-wide rules (`.cursor/rules/monorepo.mdc`) and NestJS backend rules (`.cursor/rules/nestjs-backend.mdc`).

---

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| `any` type | Use strict TypeScript; infer DTOs from `@myshop/shared` |
| `// TODO` / `// ... rest unchanged` placeholders | Zero-Placeholder policy — ship complete, compilable code |
| Installing npm packages at monorepo root | Use `pnpm --filter @myshop/api add <pkg>` |
| Untyped `Promise` returns | Always `Promise<ConcreteDto>` |
| Custom error JSON instead of Nest exceptions | See [Error Handling](./error-handling.md) |

---

## Required Patterns

- **Layered architecture**: Controller → Service → `@myshop/db`.
- **Strong typing**: Share DTOs and Zod schemas via `@myshop/shared`.
- **Validation**: Whitelist unknown fields on HTTP input.
- **Transactions**: Multi-table writes wrapped in `prisma.$transaction`.

---

## Testing Requirements

- Unit tests colocated as `*.spec.ts` next to services (Jest configured in `apps/api/package.json`).
- E2E tests under `apps/api/test/` using Supertest.
- Run: `pnpm --filter @myshop/api test`

---

## Code Review Checklist

- [ ] No `any`; all public methods have explicit return types
- [ ] Controller contains no business logic
- [ ] Money fields are integers (cents)
- [ ] Multi-step DB writes use transactions
- [ ] New dependencies added via `--filter @myshop/api`
- [ ] No placeholder comments or stub implementations

---

## Build & Dev

```bash
pnpm --filter @myshop/api dev      # nest start --watch
pnpm --filter @myshop/api build
pnpm --filter @myshop/api lint
```

Default port: **3001** (`apps/api/src/main.ts`).
