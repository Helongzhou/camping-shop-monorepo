# Backend Development Guidelines

> Conventions for `@myshop/shared` (shared TypeScript library).

---

## Overview

DTOs, Zod schemas, and enums consumed by API and web. Populated from `.cursor/rules/monorepo.mdc` and `packages/shared/`.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | enums / schemas / dto / locale / theme | Filled |
| [Database Alignment](./database-guidelines.md) | Cents, enum sync | Filled |
| [Error Handling](./error-handling.md) | Zod parse patterns | Filled |
| [Quality Guidelines](./quality-guidelines.md) | Pure TS rules | Filled |
| [Logging Guidelines](./logging-guidelines.md) | N/A | Filled |

---

## Monorepo Role

From `.cursor/rules/monorepo.mdc`:

> `packages/shared`: Pure TypeScript shared library. DTO structures, Zod validation schemas, common enums.

Install deps only here when needed:

```bash
pnpm --filter @myshop/shared add zod
```

---

**Language**: English.
