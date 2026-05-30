# Logging Guidelines

> Logging for `@myshop/db`.

---

## Overview

Prisma client logging is configured in `packages/db/src/client.ts`.

---

## Current Configuration

```typescript
new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});
```

| Environment | Logs |
|-------------|------|
| `development` | query, error, warn |
| production | error only |

---

## Guidelines

- Do not add application-level logging in this package
- API services log business events via NestJS `Logger`
- Query logs are dev-only — never enable `query` log level in production (PII/performance risk)

---

## Hot Reload

Dev singleton stored on `globalThis` to prevent multiple Prisma instances during HMR (`packages/db/src/client.ts`).
