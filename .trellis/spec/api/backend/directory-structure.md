# Directory Structure

> How backend code is organized in `@myshop/api`.

---

## Overview

`@myshop/api` is a NestJS 11 application under `apps/api/`. It owns merchant-facing APIs, order state machines, cron jobs, and high-concurrency business logic. Shared types and validation live in `@myshop/shared`; database access goes through `@myshop/db`.

Source: `.cursor/rules/monorepo.mdc`, `.cursor/rules/nestjs-backend.mdc`.

---

## Directory Layout

```
apps/api/
├── src/
│   ├── main.ts              # Bootstrap; listens on PORT (default 3001)
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Health / sample endpoints (replace per feature)
│   └── app.service.ts
├── test/
│   └── app.e2e-spec.ts
├── nest-cli.json
├── tsconfig.json
└── package.json             # name: @myshop/api
```

When adding features, grow into feature modules:

```
apps/api/src/
├── main.ts
├── app.module.ts
├── orders/
│   ├── orders.module.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── dto/                 # Nest-specific DTO classes if needed; prefer @myshop/shared Zod schemas
└── products/
    └── ...
```

---

## Module Organization

- **One module per business domain** (orders, products, inventory, webhooks).
- **Controller**: HTTP only — validate input, call service, return response. No business logic.
- **Service**: Business rules and orchestration. Use `prisma.$transaction` from `@myshop/db` for multi-step writes.
- **Module**: Register providers; export services other modules need.

---

## Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Module file | `{feature}.module.ts` | `orders.module.ts` |
| Controller | `{feature}.controller.ts` | `orders.controller.ts` |
| Service | `{feature}.service.ts` | `orders.service.ts` |
| E2E test | `{feature}.e2e-spec.ts` | `orders.e2e-spec.ts` |

---

## Examples

- Entry point: `apps/api/src/main.ts` — uses port `3001` to avoid clashing with Next.js on `3000`.
- Scaffold: `apps/api/src/app.module.ts`, `app.controller.ts`, `app.service.ts`.

---

## Monorepo Dependencies

Install packages only inside the app or via filter:

```bash
pnpm --filter @myshop/api add @nestjs/config
pnpm --filter @myshop/api add @myshop/shared @myshop/db
```

Never install runtime dependencies at the monorepo root.
