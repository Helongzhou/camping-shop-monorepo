# Backend Development Guidelines

> Conventions for `@myshop/api` (NestJS 11).

---

## Overview

NestJS backend for merchant operations, order state machines, cron, and high-concurrency flows. Populated from `.cursor/rules/nestjs-backend.mdc`, `.cursor/rules/monorepo.mdc`, and current scaffold under `apps/api/`.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | Module layout, naming | Filled |
| [Database Guidelines](./database-guidelines.md) | Prisma via `@myshop/db` | Filled |
| [Error Handling](./error-handling.md) | Nest exceptions, envelopes | Filled |
| [Quality Guidelines](./quality-guidelines.md) | Types, zero-placeholder | Filled |
| [Logging Guidelines](./logging-guidelines.md) | Logger usage | Filled |

---

## Package Role

| Package | Role |
|---------|------|
| `@myshop/api` | HTTP API, business orchestration |
| `@myshop/db` | Prisma client + schema |
| `@myshop/shared` | Zod schemas, DTOs, enums |

---

**Language**: English (source rules in `.cursor/rules/` may be Chinese; this spec is the English runtime source of truth for Trellis sub-agents).
