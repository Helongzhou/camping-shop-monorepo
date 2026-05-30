# Frontend Development Guidelines

> Conventions for `@myshop/web` (Next.js 15 storefront).

---

## Overview

Customer-facing indie shop: SEO, Stripe checkout, Core Web Vitals. Populated from `.cursor/rules/nextjs-frontend.mdc` and `apps/web/` scaffold.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | App Router layout | Filled |
| [Component Guidelines](./component-guidelines.md) | Semantic HTML, Image, JSON-LD | Filled |
| [Hook Guidelines](./hook-guidelines.md) | Server-first data fetching | Filled |
| [State Management](./state-management.md) | Server vs client state | Filled |
| [Quality Guidelines](./quality-guidelines.md) | Forbidden patterns | Filled |
| [Type Safety & SEO](./type-safety.md) | Async params, generateMetadata | Filled |

---

## Package Dependencies

| Package | Usage |
|---------|-------|
| `@myshop/shared` | DTOs, Zod schemas, enums |
| `@myshop/web` | UI only — no direct Prisma |

Database access stays in `@myshop/api` or Server Actions calling the API.

---

**Language**: English (Trellis runtime source of truth).
