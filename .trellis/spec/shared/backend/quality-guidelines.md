# Quality Guidelines

> Quality standards for `@myshop/shared`.

---

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| `any` | Monorepo strict TypeScript |
| Framework imports (Nest, Next, Prisma) | Keeps package pure |
| `// TODO` placeholders | Zero-Placeholder policy |
| Dollar floats for money | Use `*Cents` integers |
| Duplicate enums in api/web | Single source here |

---

## Required Patterns

- Zod schemas for all write inputs (`create*Schema`, `update*Schema`)
- `z.infer<typeof schema>` for input types — do not hand-write duplicates
- `as const` enum objects with derived union types
- Explicit DTO interfaces for API responses
- ESM `.js` extensions in relative imports

---

## Example: Product Schema

Real code — `packages/shared/src/schemas/product.schema.ts`:

```typescript
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(1).max(5000),
  priceCents: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  currency: z.enum(CURRENCY_VALUES).default(Currency.USD),
});
```

---

## Build & Test

```bash
pnpm --filter @myshop/shared build
pnpm --filter @myshop/shared lint    # tsc --noEmit
```

---

## Code Review Checklist

- [ ] New inputs have Zod schema + inferred type
- [ ] New API responses have DTO interface
- [ ] Enums synced with Prisma if persisted
- [ ] No framework dependencies added
