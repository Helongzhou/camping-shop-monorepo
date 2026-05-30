# Logging Guidelines

> Logging conventions for `@myshop/api`.

---

## Overview

NestJS default logger is used at bootstrap (`NestFactory.create`). Structured logging should be added before production traffic.

Current state: minimal logging in scaffold — `main.ts` only starts the app.

---

## Recommended Patterns (to adopt)

### Use NestJS Logger in services

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  async create(dto: CreateOrderInput): Promise<Order> {
    this.logger.log(`Creating order with ${dto.items.length} items`);
    // ...
  }
}
```

### Prisma query logging in development

`@myshop/db` enables `query`, `error`, `warn` logs when `NODE_ENV === 'development'` (see `packages/db/src/client.ts`). Do not duplicate query logging in API services unless debugging a specific issue.

---

## Log Levels

| Level | When |
|-------|------|
| `log` | Normal business events (order created, payment captured) |
| `warn` | Recoverable anomalies (retry, idempotency hit) |
| `error` | Failures requiring attention (transaction rollback, external API error) |
| `debug` | Verbose diagnostics — dev only |

---

## Forbidden Patterns

- Logging full payment card or PII payloads
- `console.log` in production service code (use `Logger`)
- Swallowing errors without at least `logger.error`

---

## Future Work

When integrating Stripe/webhooks, add request-id correlation and redact secrets in log metadata.
