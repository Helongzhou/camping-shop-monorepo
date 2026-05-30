# My Shop Monorepo

面向独立站 / 小型电商团队的 **pnpm Monorepo** 全栈项目。包含 **Next.js 15** 前台、**NestJS 11** 后端、**Prisma + PostgreSQL** 数据层，以及基于 **Zod/DTO** 的跨层类型共享。项目针对 **Cursor + Trellis** 的 AI 辅助开发（Vibe Coding）工作流进行了优化。

> 英文版说明请参阅 [README.md](./README.md)。

---

## 目录

- [架构概览](#架构概览)
- [技术栈](#技术栈)
- [仓库结构](#仓库结构)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [环境变量](#环境变量)
- [数据库](#数据库)
- [常用命令](#常用命令)
- [依赖管理](#依赖管理)
- [分支与协作](#分支与协作)
- [AI / Trellis 工作流](#ai--trellis-工作流)
- [编码规范](#编码规范)
- [CI 持续集成](#ci-持续集成)
- [部署建议](#部署建议)
- [远程仓库配置](#远程仓库配置)
- [相关文档](#相关文档)

---

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                            │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  apps/web  (@myshop/web)                                    │
│  Next.js 15 · React 19 · Tailwind CSS 4                     │
│  职责：SEO、商品展示、Stripe 结账、静态/动态渲染              │
└──────────────────────────┬──────────────────────────────────┘
                           │ NEXT_PUBLIC_API_URL
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  apps/api  (@myshop/api)                                    │
│  NestJS 11 · Express                                        │
│  职责：订单、库存、Cron、商家后台 API                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ Prisma Client
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  packages/db  (@myshop/db)                                  │
│  Prisma Schema + Client 封装                                │
└──────────────────────────┬──────────────────────────────────┘
                           │ PostgreSQL
                           ▼
                    Docker / 云数据库

        packages/shared  (@myshop/shared)
        Zod Schema · DTO · Enum —— 被 web 与 api 共同引用
```

### 包职责一览

| 包名 | 路径 | 说明 |
|------|------|------|
| `@myshop/web` | `apps/web` | 面向用户的 Next.js 前台（SEO、Stripe 购买流） |
| `@myshop/api` | `apps/api` | NestJS 后端（订单、库存、定时任务） |
| `@myshop/shared` | `packages/shared` | Zod 校验 Schema、DTO 接口、业务枚举 |
| `@myshop/db` | `packages/db` | Prisma Schema、Client 单例、数据库迁移 |

---

## 技术栈

| 层级 | 技术 | 版本（参考 package.json） |
|------|------|---------------------------|
| 运行时 | Node.js | ≥ 22（见 `.nvmrc`） |
| 包管理 | pnpm | 9.15.9（见根 `package.json` 的 `packageManager`） |
| 前台 | Next.js / React | 15.5.x / 19.2.x |
| 样式 | Tailwind CSS | 4.x |
| 后端 | NestJS | 11.x |
| ORM | Prisma | 6.8.x |
| 数据库 | PostgreSQL | 16（Docker 镜像） |
| 校验 | Zod | 3.24.x |
| 语言 | TypeScript | 5.x |
| AI 工作流 | Trellis | 见 `.trellis/` |

---

## 仓库结构

```
camping-shop-monorepo/
├── apps/
│   ├── web/                 # Next.js 前台
│   └── api/                 # NestJS 后端
├── packages/
│   ├── shared/              # 共享类型与校验
│   └── db/                  # Prisma 与数据库客户端
├── .cursor/
│   └── rules/               # Cursor 会话规则（与 .trellis/spec 对齐）
├── .trellis/
│   ├── spec/                # 各包/层的编码规范（AI 子代理的权威来源）
│   ├── tasks/               # 活跃任务 PRD 与上下文
│   ├── workspace/           # 开发者会话日志（非业务代码）
│   └── workflow.md          # Trellis 完整生命周期说明
├── .github/workflows/       # GitHub Actions CI
├── docker-compose.yml       # 本地 PostgreSQL
├── pnpm-workspace.yaml      # pnpm 工作区配置
├── .env.example             # 根环境变量模板
├── AGENTS.md                # AI 助手入口说明
└── README.md / README.zh-CN.md
```

### 代码 vs Trellis 元数据

| 路径 | 性质 |
|------|------|
| `apps/`、`packages/` | **应用源码**，位于仓库根目录 |
| `.trellis/spec/` | 团队编码规范，供 AI 注入 |
| `.trellis/tasks/` | 活跃任务的 PRD 与实现上下文 |
| `.trellis/workspace/` | 开发者会话日志，**不是**应用代码 |

---

## 环境要求

开始开发前，请确保本机已安装：

| 工具 | 版本要求 | 用途 |
|------|----------|------|
| **Node.js** | 22+ | 运行 web、api、构建脚本 |
| **pnpm** | 9+ | Monorepo 依赖管理 |
| **Docker** | 任意较新版本 | 本地 PostgreSQL |
| **Python** | 3.9+ | Trellis 脚本（任务管理、开发者初始化） |

### 安装 Node 与 pnpm

```bash
# 使用 nvm 切换 Node 版本（推荐）
nvm use

# 通过 corepack 启用 pnpm（推荐）
corepack enable
corepack prepare pnpm@9.15.9 --activate
```

---

## 快速开始

以下步骤均从**仓库根目录**执行。

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
cp packages/db/.env.example packages/db/.env
```

默认配置与 `docker-compose.yml` 中的 PostgreSQL 一致，本地开发通常无需修改。

### 3. 启动 PostgreSQL

```bash
pnpm db:up
```

等价于 `docker compose up -d postgres`，容器名 `myshop-postgres`，端口 `5432`。

### 4. 生成 Prisma Client 并同步数据库 Schema

```bash
pnpm db:generate
pnpm --filter @myshop/db db:push    # 首次开发推荐 db:push
# 或使用正式迁移：
# pnpm db:migrate
```

### 5. 启动应用

```bash
pnpm dev:apps
```

| 服务 | 地址 | 默认端口 |
|------|------|----------|
| Web 前台 | http://localhost:3000 | 3000 |
| API 后端 | http://localhost:3001 | 3001 |

---

## 环境变量

根目录 `.env.example` 说明：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | PostgreSQL 连接串 | `postgresql://postgres:postgres@localhost:5432/myshop?schema=public` |
| `PORT` | NestJS API 监听端口 | `3001` |
| `NODE_ENV` | 运行环境 | `development` |
| `NEXT_PUBLIC_API_URL` | 前台调用 API 的基地址 | `http://localhost:3001` |
| `STRIPE_SECRET_KEY` | Stripe 服务端密钥（待集成） | — |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 签名密钥（待集成） | — |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 公钥（待集成） | — |

`packages/db/.env` 中只需 `DATABASE_URL`，供 Prisma CLI（`migrate`、`push`、`studio`）使用。

---

## 数据库

### 本地 Docker 配置

`docker-compose.yml` 使用 `postgres:16-alpine`：

- 用户 / 密码：`postgres` / `postgres`
- 数据库名：`myshop`
- 数据持久化卷：`postgres_data`
- 健康检查：`pg_isready`

### 数据模型（Prisma）

当前 Schema 位于 `packages/db/prisma/schema.prisma`，核心实体：

| 模型 | 说明 |
|------|------|
| `Product` | 商品（`priceCents` 以分为单位，`slug` 唯一） |
| `Order` | 订单（`totalCents`、`status`、`currency`） |
| `OrderItem` | 订单明细（关联商品、数量、单价） |

枚举：

- `OrderStatus`：`PENDING` · `PAID` · `SHIPPED` · `CANCELLED`
- `Currency`：`USD` · `CNY` · `EUR`

### 数据库常用命令

```bash
pnpm db:up              # 启动 Postgres 容器
pnpm db:down            # 停止并移除容器
pnpm db:generate        # 根据 schema 生成 Prisma Client
pnpm db:migrate         # 开发环境迁移（prisma migrate dev）
pnpm --filter @myshop/db db:push   # 将 schema 推送到数据库（快速原型）
pnpm --filter @myshop/db db:studio # 打开 Prisma Studio 可视化管理
```

### 数据库规范

- 所有金额字段使用**整数分**（`priceCents`、`totalCents`），**禁止** Float/Decimal
- 修改 `schema.prisma` 后必须执行 `pnpm db:generate`
- 多表写入（如扣库存 + 创建订单）必须使用 `prisma.$transaction`

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev:apps` | 并行启动 web + api（日常开发推荐） |
| `pnpm dev` | 并行启动所有 `@myshop/*` 包（含 shared 的 tsc watch） |
| `pnpm build` | 先构建 shared、db，再构建 apps |
| `pnpm lint` | 对所有 workspace 执行 lint / 类型检查 |
| `pnpm test` | 运行所有 workspace 的测试 |
| `pnpm db:up` / `pnpm db:down` | 启动 / 停止 Postgres |
| `pnpm db:migrate` | Prisma 开发迁移 |
| `pnpm db:generate` | 生成 Prisma Client |

### 单独运行某个包

```bash
pnpm --filter @myshop/web dev
pnpm --filter @myshop/api dev
pnpm --filter @myshop/shared build
pnpm --filter @myshop/db db:studio
```

---

## 依赖管理

**严禁**在 Monorepo 根目录安装业务依赖（根目录仅保留共享开发工具）。使用 `--filter` 指定目标包：

```bash
pnpm --filter @myshop/web add lucide-react
pnpm --filter @myshop/api add @nestjs/config
pnpm --filter @myshop/shared add zod
pnpm --filter @myshop/db add -D prisma
```

Workspace 包之间通过 `workspace:*` 引用，例如 api 依赖：

```json
"@myshop/db": "workspace:*",
"@myshop/shared": "workspace:*"
```

---

## 分支与协作

| 分支 | 用途 |
|------|------|
| `main` | 生产就绪代码；受保护；CI 必须通过 |
| `feature/<ticket>-<slug>` | 单个功能或 Trellis 任务一条分支 |

流程建议：

1. 从 `main` 切出 feature 分支
2. 开发完成后向 `main` 提 PR
3. 推荐使用 **Squash Merge** 保持历史整洁

---

## AI / Trellis 工作流

本项目使用 [Trellis](https://docs.trytrellis.app/) 进行任务驱动的 AI 协作开发。

### 首次开发者初始化

```bash
python3 ./.trellis/scripts/init_developer.py <你的-github-用户名>
```

将在 `.trellis/workspace/<用户名>/` 下创建个人会话日志目录。

### 典型功能开发流程

1. **规划** — 使用 `/trellis-brainstorm` 或 `grill-me` skill 梳理需求
2. **创建任务** — `python3 ./.trellis/scripts/task.py create "功能标题" --slug my-feature`
3. **开始任务** — `python3 ./.trellis/scripts/task.py start my-feature`
4. **实现** — Cursor Agent 通过 hooks 加载 `.trellis/spec/` 与任务 PRD
5. **收尾** — `/trellis-finish-work` 或 `task.py finish` + `task.py archive`

### 任务系统常用命令

```bash
python3 ./.trellis/scripts/task.py list              # 列出任务
python3 ./.trellis/scripts/task.py current --source  # 查看当前活跃任务
python3 ./.trellis/scripts/task.py finish            # 结束当前任务
python3 ./.trellis/scripts/task.py archive <name>    # 归档已完成任务
python3 ./.trellis/scripts/get_context.py --mode packages  # 列出 spec 包/层
```

### 必读文档

| 文件 | 内容 |
|------|------|
| `AGENTS.md` | AI 助手入口 |
| `.trellis/workflow.md` | 完整开发生命周期 |
| `.trellis/spec/` | 各包编码规范（子代理权威来源） |
| `.cursor/rules/` | Cursor 会话规则摘要 |

---

## 编码规范

### 全局（Monorepo）

- 禁止使用 `any`；所有异步方法返回明确类型，如 `Promise<OrderDto>`
- 禁止占位代码（`// TODO`、`// ... 其余代码保持不变`）
- 每次提交须可编译、可运行

### 金额

- 数据库存储、API 传输、DTO 一律使用**整数分**（`priceCents`）
- 展示层再除以 100 格式化为货币字符串

### Next.js 15（apps/web）

- `params` / `searchParams` 为 **Promise**，必须 `await`
- 动态商品页需 `generateMetadata` 与 JSON-LD 结构化数据
- 图片使用 `next/image`，首屏大图加 `priority`

### NestJS（apps/api）

- 分层：Controller → Service → `@myshop/db`
- Controller 只做参数校验与调用 Service
- 业务异常使用 Nest 标准异常（`BadRequestException` 等）
- 多表写入使用 `prisma.$transaction`

详细规范见 `.trellis/spec/` 与 `.cursor/rules/`。

---

## i18n · 主题 · 全局 Settings 验证

独立站品牌：**TrailNest**（英文）/ **趣巢**（中文）。

### 启动全栈

```bash
cp .env.example .env
cp packages/db/.env.example packages/db/.env
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev:apps          # web :3000 + api :3001
```

### 功能验证清单

| 检查项 | 操作 | 预期 |
|--------|------|------|
| 默认重定向 | 访问 `http://localhost:3000/` | 302 到 `/en` 或 `/zh` |
| 英文站 | `/en` | Header **TrailNest**，英文 UI |
| 中文站 | `/zh` | Header **趣巢**，中文 UI |
| 分享链接 | 英文浏览器打开 `/zh` | 保持中文（URL 权威） |
| 语言切换 | Header 切到中文 | URL 变 `/zh/...`，写 `NEXT_LOCALE` cookie |
| 主题三态 | 切换 Light / Dark / System | 刷新后偏好保持，无明显白闪 |
| Settings API | `curl localhost:3001/settings?locale=zh` | `siteName: 趣巢` |
| 公告/页脚 | 浏览 `/en` 与 `/zh` | 顶栏公告 + 页脚来自 API（失败时用 fallback） |

### 相关 Spec

- `.trellis/spec/web/frontend/i18n-theme-guidelines.md`
- `.trellis/spec/shared/backend/directory-structure.md`（Locale / ThemeMode 导出）

---

## CI 持续集成

GitHub Actions 工作流位于 `.github/workflows/ci.yml`。

**触发条件**：推送到 `main` 或针对 `main` 的 Pull Request。

**流水线步骤**：

1. Checkout 代码
2. 安装 Node.js（读取 `.nvmrc`）
3. 安装 pnpm 9.15.9
4. 缓存 pnpm store
5. `pnpm install --frozen-lockfile`
6. `pnpm db:generate`
7. `pnpm build`
8. `pnpm lint`
9. `pnpm test`

同一 ref 的并发 CI 会自动取消旧运行（`cancel-in-progress: true`）。

---

## 部署建议

| 组件 | 推荐平台 | 说明 |
|------|----------|------|
| `@myshop/web` | Vercel / 自托管 Node | Next.js 原生支持 Vercel |
| `@myshop/api` | Railway / Fly.io / AWS | 需配置 `PORT`、`DATABASE_URL` |
| PostgreSQL | Neon / Supabase / RDS | 生产环境勿使用 Docker 默认密码 |

生产部署前检查清单：

- [ ] 设置强密码的 `DATABASE_URL`
- [ ] 配置 `NEXT_PUBLIC_API_URL` 指向生产 API
- [ ] 执行 `pnpm build` 验证构建通过
- [ ] 运行 `pnpm db:migrate` 应用数据库迁移
- [ ] 配置 Stripe 相关环境变量（启用支付后）

---

## 远程仓库配置

团队负责人首次推送（仅需一次）：

```bash
git remote add origin git@github.com:<org>/camping-shop-monorepo.git
git push -u origin main
```

将 `<org>` 替换为你的 GitHub 组织或用户名。

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [apps/web/README.zh-CN.md](./apps/web/README.zh-CN.md) | Next.js 前台详细说明 |
| [apps/api/README.zh-CN.md](./apps/api/README.zh-CN.md) | NestJS 后端详细说明 |
| [README.md](./README.md) | 英文版根 README |

---

## 许可证

根 `package.json` 标注为 ISC；`@myshop/api` 为 UNLICENSED（私有）。使用前请确认各包许可证符合你的发布策略。
