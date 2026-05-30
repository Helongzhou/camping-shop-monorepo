# Quality Guidelines (Frontend Consumer)

> Rules when consuming `@myshop/shared` from `@myshop/web`.

---

## Required

- Import types and schemas from `@myshop/shared`
- Display money from `*Cents` fields
- Validate forms with shared Zod schemas

---

## Forbidden

- Duplicating DTO interfaces in `apps/web`
- `any` props for domain entities
- Installing zod only in web for schemas that belong in shared

---

## Dependency

```json
"@myshop/shared": "workspace:*"
```

Add to web via:

```bash
pnpm --filter @myshop/web add @myshop/shared
```

(Already configured in `apps/web/package.json`.)
