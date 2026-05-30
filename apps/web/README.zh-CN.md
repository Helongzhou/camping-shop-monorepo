# @myshop/web — Next.js 前台

面向终端用户的 **Next.js 15** 独立站前台，负责商品展示、SEO、Core Web Vitals 优化，以及未来的 Stripe 结账流程。作为 Monorepo 中的 `apps/web` 包，通过 `@myshop/shared` 共享类型与校验，通过 `NEXT_PUBLIC_API_URL` 调用 `@myshop/api` 后端。

> 英文版请参阅 [README.md](./README.md)。

---

## 目录

- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [快速开始](#快速开始)
- [环境变量](#环境变量)
- [与 Monorepo 的协作](#与-monorepo-的协作)
- [路由与页面](#路由与页面)
- [样式与字体](#样式与字体)
- [i18n 与主题](#i18n-与主题)
- [全局 Settings API](#全局-settings-api)
- [SEO 与性能规范](#seo-与性能规范)
- [Next.js 15 重要变更](#nextjs-15-重要变更)
- [调用后端 API](#调用后端-api)
- [构建与部署](#构建与部署)
- [Lint 与测试](#lint-与测试)
- [AI 开发注意事项](#ai-开发注意事项)
- [相关文档](#相关文档)

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js（App Router） | 15.5.x |
| UI | React | 19.2.x |
| 样式 | Tailwind CSS | 4.x |
| i18n | next-intl | 4.x |
| 主题 | next-themes | 0.4.x |
| 字体 | Geist / Geist Mono（`next/font`） | — |
| 共享类型 | `@myshop/shared` | workspace |
| 语言 | TypeScript | 5.x |
| Lint | ESLint + eslint-config-next | 9.x |

---

## 目录结构

```
apps/web/
├── public/
├── src/
│   ├── middleware.ts           # locale 重定向（next-intl）
│   ├── i18n/                   # routing, request, navigation
│   ├── messages/               # en.json, zh.json
│   ├── lib/                    # settings.ts, theme-server.ts
│   ├── components/             # SiteHeader, switchers, …
│   └── app/
│       ├── globals.css
│       ├── favicon.ico
│       └── [locale]/
│           ├── layout.tsx
│           └── page.tsx
├── next.config.ts              # next-intl plugin
├── postcss.config.mjs
├── tsconfig.json
├── eslint.config.mjs
├── package.json
└── README.md / README.zh-CN.md
```

品牌名：**TrailNest**（`en`）/ **趣巢**（`zh`）。

---

## 快速开始

### 在 Monorepo 根目录（推荐）

```bash
# 确保已安装依赖、配置 .env、启动数据库（见根 README.zh-CN.md）
pnpm dev:apps          # 同时启动 web :3000 与 api :3001
```

### 仅启动 Web

```bash
pnpm --filter @myshop/web dev
```

浏览器访问：**http://localhost:3000**

修改 `src/app/page.tsx` 后页面会自动热更新。

### 生产模式本地预览

```bash
pnpm --filter @myshop/web build
pnpm --filter @myshop/web start
```

---

## 环境变量

Web 包读取**仓库根目录**的 `.env`（Next.js 会自动向上查找）。

| 变量 | 必填 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_API_URL` | 是 | 后端 API 基地址，如 `http://localhost:3001`（Layout 拉取 SiteSettings） |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 否 | Stripe 公钥（集成支付后） |

以 `NEXT_PUBLIC_` 开头的变量会暴露到浏览器，**切勿**放入服务端密钥。

---

## 与 Monorepo 的协作

### 依赖 workspace 包

```json
"@myshop/shared": "workspace:*"
```

使用示例：

```typescript
import { createProductSchema, type ProductDto } from '@myshop/shared';
```

修改 `@myshop/shared` 后需重新构建（或根目录 `pnpm dev` 开启 tsc watch）：

```bash
pnpm --filter @myshop/shared build
```

### 添加新依赖

```bash
pnpm --filter @myshop/web add lucide-react
pnpm --filter @myshop/web add -D @types/xxx
```

**不要**在 Monorepo 根目录安装 UI 或业务依赖。

---

## i18n 与主题

### 路由

- 所有页面在 `/[locale]/...` 下（`en`、`zh`），默认 locale 也带前缀。
- Middleware：`cookie` → `Accept-Language` → `en`（仅对无前缀路径）。
- URL 中的 locale **绝对权威**，分享链接语言不会被 cookie 覆盖。

### 语言切换

Header 内 `LocaleSwitcher`：改 URL 前缀 + 写 `NEXT_LOCALE` cookie。

### 主题三态

Header 内 `ThemeSwitcher`：`light` / `dark` / `system`。

- SSR 从 `NEXT_THEME` cookie 读初始 class，避免 FOUC。
- `globals.css` 使用 `.dark` class 策略。

### 本地验证

```bash
pnpm dev:apps
# /       → 重定向
# /en     → TrailNest
# /zh     → 趣巢
# 切换主题后刷新 → 偏好保持
```

详见 `.trellis/spec/web/frontend/i18n-theme-guidelines.md`。

---

## 全局 Settings API

Layout 通过 `GET /settings?locale=` 加载：

- 站点名（Header Logo）
- 顶栏公告（`AnnouncementBar`）
- 页脚（`SiteFooter`）

Fetch 使用 `revalidate: 60`；API 不可用时 fallback 到 TrailNest / 趣巢 硬编码默认值。

---

## 路由与页面

本项目使用 **App Router**（`src/app/`），约定：

| 路径模式 | 用途（规划） |
|----------|--------------|
| `/` | 首页 / 品牌落地页 |
| `/products` | 商品列表 |
| `/products/[slug]` | 商品详情（需 `generateMetadata` + JSON-LD） |
| `/cart` | 购物车 |
| `/checkout` | Stripe 结账 |
| `/api/*` | Route Handlers（BFF、Webhook 代理等） |

新增页面时在对应目录创建 `page.tsx`；需要布局共享时使用 `layout.tsx`。

---

## 样式与字体

- **Tailwind CSS 4**：通过 `postcss.config.mjs` 与 `globals.css` 集成
- **字体**：`layout.tsx` 使用 `next/font/google` 加载 Geist 系列，CSS 变量 `--font-geist-sans`、`--font-geist-mono`
- **暗色模式**：当前页面组件已包含 `dark:` 前缀样式，可按设计系统扩展

---

## SEO 与性能规范

本项目对前台有严格的 SEO 与 Core Web Vitals 要求（详见 `.cursor/rules/nextjs-frontend.mdc` 与 `.trellis/spec/web/frontend/`）。

### 动态 Metadata

所有动态商品页、内容页必须导出 `generateMetadata`：

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  // 返回 title、description、openGraph、alternates.canonical 等
}
```

### 结构化数据（JSON-LD）

商品详情页应注入 `Product` 类型的 JSON-LD，便于搜索引擎展示价格与库存。

### 图片与 LCP

- 一律使用 `next/image`
- 首屏大图设置 `priority`
- 必须提供 `width`/`height` 或 `sizes`，避免 CLS

### 语义化 HTML

- 每页有且仅有一个 `<h1>`
- 使用 `<main>`、`<article>`、`<section>` 等语义标签
- 内部导航使用 `next/link` 的 `<Link>`

### 避免水合错误

- 浏览器专属 API（`window`、`localStorage`）放在 Client Component 的 `useEffect` 中
- SSR 阶段不要渲染 `new Date().toLocaleString()`
- 不可控的第三方组件可用 `dynamic(..., { ssr: false })`

---

## Next.js 15 重要变更

> 详见 `AGENTS.md`：本仓库使用的 Next.js 版本可能与训练数据中的 API 不同，编写代码前请查阅 `node_modules/next/dist/docs/`。

### 异步 `params` 与 `searchParams`

在 Page、Layout、Metadata、Route Handlers 中，`params` 和 `searchParams` 均为 **Promise**，必须 `await`：

```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { ref } = await searchParams;
  // ...
}
```

**禁止**同步解构 `params.slug`。

---

## 调用后端 API

通过环境变量 `NEXT_PUBLIC_API_URL` 拼接请求地址。

### Server Component 中获取数据（推荐）

```typescript
async function getProducts(): Promise<ProductDto[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    next: { revalidate: 60 }, // ISR：按需调整
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}
```

### Client Component

在客户端组件中可直接使用 `process.env.NEXT_PUBLIC_API_URL`（构建时内联）。

后续可引入 React Query / SWR 等库管理客户端缓存，安装方式：

```bash
pnpm --filter @myshop/web add @tanstack/react-query
```

---

## 构建与部署

### 构建

```bash
pnpm --filter @myshop/web build
```

Monorepo 根目录 `pnpm build` 会先构建 `@myshop/shared`、`@myshop/db`，再并行构建所有 apps。

### Vercel 部署

Next.js 由 Vercel 团队维护，**Vercel** 是最简部署方式：

1. 将仓库连接到 Vercel
2. 设置 Root Directory 为 `apps/web`（或使用 Monorepo 预设）
3. 配置环境变量 `NEXT_PUBLIC_API_URL` 等
4. 构建命令：`pnpm build`（在根目录）或 `next build`（在 web 目录）

其他平台（Docker、Node 自托管）可参考 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。

---

## Lint 与测试

```bash
pnpm --filter @myshop/web lint
pnpm --filter @myshop/web test    # routing / settings fallback / theme class
pnpm --filter @myshop/web build
```

引入组件测试时可添加 Vitest + Testing Library，并在 `package.json` 的 `test` 脚本中替换占位实现。

---

## AI 开发注意事项

| 文件 | 作用 |
|------|------|
| `AGENTS.md` | 提醒 Next.js 版本与训练数据可能不一致 |
| `.cursor/rules/nextjs-frontend.mdc` | SEO、params Promise、性能红线 |
| `.trellis/spec/web/frontend/i18n-theme-guidelines.md` | i18n、主题、Settings 规范 |

开始编写前台代码前，建议执行 Trellis 规范注入：

```bash
cat .trellis/spec/web/frontend/index.md
```

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [根 README.zh-CN.md](../../README.zh-CN.md) | Monorepo 总览与快速开始 |
| [apps/api/README.zh-CN.md](../api/README.zh-CN.md) | 后端 API 说明 |
| [Next.js 官方文档](https://nextjs.org/docs) | 框架权威参考 |
| [Tailwind CSS 文档](https://tailwindcss.com/docs) | 样式工具 |
