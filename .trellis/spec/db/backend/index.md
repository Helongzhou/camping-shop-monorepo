# Backend Development Guidelines

> Conventions for `@myshop/db` (Prisma + PostgreSQL).

---

## Overview

Database schema and Prisma client package. Populated from `.cursor/rules/db.mdc` and `packages/db/`.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | Package layout | Filled |
| [Database Guidelines](./database-guidelines.md) | Cents, migrations, transactions | Filled |
| [Error Handling](./error-handling.md) | Prisma error codes | Filled |
| [Quality Guidelines](./quality-guidelines.md) | Forbidden patterns | Filled |
| [Logging Guidelines](./logging-guidelines.md) | Prisma log config | Filled |

---

## Consumers

Only `@myshop/api` (and future workers) should import `@myshop/db`. `@myshop/web` accesses data via API or Server Actions — not direct Prisma.

---

**Language**: English.
