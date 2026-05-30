# Error Handling

> Validation errors in `@myshop/shared`.

---

## Overview

This package defines Zod schemas — parsing failures are handled by consumers (NestJS pipes, API routes, form handlers).

---

## Parse Pattern

```typescript
import { createProductSchema } from '@myshop/shared';

const result = createProductSchema.safeParse(input);
if (!result.success) {
  // API: map to 400 Bad Request with z.flattenError(result.error)
  // Web: show field errors in form UI
}
```

---

## API Layer

NestJS services should validate with shared schemas before DB writes:

```typescript
const parsed = createProductSchema.parse(dto); // throws ZodError
```

Map `ZodError` to `BadRequestException` in the API exception filter.

---

## Forbidden Patterns

- Silently ignoring `safeParse` failures
- Defining duplicate validation logic outside shared schemas
