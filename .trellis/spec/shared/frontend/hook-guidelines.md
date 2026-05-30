# Hook Guidelines (Shared Validation)

> Client hooks using shared Zod schemas.

---

## Form Hooks (Future)

When adding react-hook-form or similar, wire resolvers to shared schemas:

```typescript
import { createProductSchema } from '@myshop/shared';
// zodResolver(createProductSchema) when form library added
```

---

## Current State

No form hooks yet. Validation schemas are ready in `packages/shared/src/schemas/`.

---

## Server-First

Prefer validating on the server (Route Handler or API call) even when client validation exists — shared schema ensures both sides match.
