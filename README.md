# My Shop Monorepo

Indie e-commerce monorepo: **Next.js 15** storefront, **NestJS 11** API, **Prisma** database, shared **Zod/DTO** types. Optimized for a small full-stack team using **Cursor + Trellis** (vibe coding workflow).

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@myshop/web` | `apps/web` | Customer-facing Next.js app (SEO, Stripe) |
| `@myshop/api` | `apps/api` | NestJS backend (orders, inventory, cron) |
| `@myshop/shared` | `packages/shared` | Zod schemas, DTOs, enums |
| `@myshop/db` | `packages/db` | Prisma schema + client |

## Prerequisites

- **Node.js 22+** (see `.nvmrc`)
- **pnpm 9+** (see `packageManager` in root `package.json`)
- **Docker** (for local PostgreSQL)
- **Python 3.9+** (Trellis scripts)

```bash
# Enable pnpm via corepack (recommended)
corepack enable
corepack prepare pnpm@9.15.9 --activate

# Or use nvm
nvm use
```

## Quick start

```bash
# 1. Install dependencies (always from repo root)
pnpm install

# 2. Environment
cp .env.example .env
cp packages/db/.env.example packages/db/.env
# Edit if needed — defaults match docker-compose

# 3. Start PostgreSQL
pnpm db:up

# 4. Build shared packages & apply DB schema
pnpm db:generate
pnpm --filter @myshop/db db:push   # first-time dev; use db:migrate for migrations

# 5. Run apps (API :3001, Web :3000)
pnpm dev:apps
```

Open:

- Web: http://localhost:3000
- API: http://localhost:3001

## Common commands

| Command | Description |
|---------|-------------|
| `pnpm dev:apps` | Parallel dev for web + api only |
| `pnpm dev` | Dev for all `@myshop/*` packages (includes tsc watch) |
| `pnpm build` | Build packages then apps |
| `pnpm lint` | Lint / typecheck all workspaces |
| `pnpm test` | Run tests in all workspaces |
| `pnpm db:up` / `pnpm db:down` | Start/stop Postgres |
| `pnpm db:migrate` | Prisma migrate dev |

## Adding dependencies

Never install at the monorepo root (except shared dev tooling). Use `--filter`:

```bash
pnpm --filter @myshop/web add lucide-react
pnpm --filter @myshop/api add @nestjs/config
pnpm --filter @myshop/shared add zod
```

## Branch strategy

- `main` — production-ready; protected; CI must pass
- `feature/<ticket>-<slug>` — one feature or Trellis task per branch
- Open PRs into `main`; squash merge recommended

## AI / Trellis workflow (vibe coding)

This repo uses [Trellis](https://docs.trytrellis.app/) for task-driven AI development.

### First-time developer setup

```bash
python3 ./.trellis/scripts/init_developer.py <your-github-username>
```

Creates `.trellis/workspace/<your-github-username>/` for session journals.

### Typical feature flow

1. **Plan** — `/trellis-brainstorm` or `grill-me` skill to stress-test the idea
2. **Task** — `python3 ./.trellis/scripts/task.py create "Feature title" --slug my-feature`
3. **Start** — `python3 ./.trellis/scripts/task.py start my-feature`
4. **Implement** — Cursor agents load `.trellis/spec/` + task PRD via hooks
5. **Finish** — `/trellis-finish-work` or `task.py finish` + `task.py archive`

Read:

- `AGENTS.md` — AI entry point
- `.trellis/workflow.md` — full lifecycle
- `.trellis/spec/` — coding guidelines per package (source of truth for sub-agents)
- `.cursor/rules/` — Cursor session rules (summary; keep in sync with spec)

### Where code lives vs Trellis metadata

```
apps/, packages/     ← application source (stay at repo root)
.trellis/spec/       ← team conventions for AI
.trellis/tasks/      ← active task PRDs
.trellis/workspace/  ← developer session journals (NOT application code)
```

## Conventions (short)

- Money stored as **integer cents** (`priceCents`, never float)
- **No `any`**; strict TypeScript in shared packages
- **No placeholder code** (`// TODO`, `// ... rest unchanged`)
- Next.js 15: `params` / `searchParams` are **Promises** — always `await`
- NestJS: Controller → Service → `@myshop/db`; use `prisma.$transaction` for multi-table writes

## CI

GitHub Actions runs on every push/PR to `main`: `install → build → lint → test`.

## Remote setup (team lead, once)

```bash
git remote add origin git@github.com:<org>/camping-shop-monorepo.git
git push -u origin main
```

Replace `<org>` with your GitHub org or username.
