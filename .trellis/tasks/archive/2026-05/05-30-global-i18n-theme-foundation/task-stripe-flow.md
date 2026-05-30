# Task Stripe Flow：多语言 · 日夜模式 · 全局数据底座

> **状态**：Grill-Me 拷问已完成，待进入 Trellis 实现阶段  
> **创建日期**：2026-05-30  
> **范围**：MVP 底座（不含多币种定价、不含后台 Admin UI、不含 Stripe 结账集成）

---

## 1. 目标摘要

为出海独立站建立三项全局能力，作为后续商品、订单、Stripe 结账的公共基础设施：

| 能力 | MVP 交付物 |
|------|------------|
| **多语言（i18n）** | `/[locale]/...` 子路径路由；`en` / `zh` UI 双语；`next-intl` 静态字典 |
| **日夜模式** | `light` / `dark` / `system` 三态；cookie SSR 同步；无首屏 FOUC |
| **全局数据底座** | 结构配置在 `@myshop/shared`；运营内容在 DB + 只读 API |

**明确不在本迭代**：多币种/货币切换、商品内容翻译 CRUD、后台 Settings 编辑 UI、Stripe 集成、GeoIP、富文本公告。

---

## 2. 决策记录（Grill-Me 结论）

| # | 议题 | 决策 | 关键约束 |
|---|------|------|----------|
| 1 | 语言 × 货币 × 定价 | **D — MVP 冻结单维** | 商品单一 USD；Schema 仅预留扩展；不做货币切换 |
| 2 | i18n 路由模型 | **A — 全员子路径前缀** | 所有页面 `/[locale]/...`；默认 locale 也带前缀 |
| 3 | 翻译资源分层 | **B — 静态 UI + DB 预留** | UI 走 JSON 字典；`ProductTranslation` 等表预留；API fallback `en` |
| 4 | 全局数据底座边界 | **D — 结构静态 + 内容 DB** | enum/列表在 shared；公告/页脚/站点名进 DB；MVP 纯文本 |
| 5 | 日夜模式 | **B — next-themes + cookie SSR** | 三态 OK；cookie 为主；Layout 服务端读初始 class |
| 6 | Middleware 优先级 | **A — URL 绝对权威** | 有 locale 路径则以 URL 为准；缺失时 cookie → Accept-Language → `en` |

### 2.1 默认假设（未反对则生效）

- **默认 locale**：`en`
- **商品/API 内容 fallback 语言**：`en`
- **支持 locale 列表（MVP）**：`en`、`zh`
- **公告/页脚格式**：纯文本（无 Markdown / 富文本）
- **默认货币展示**：USD（只读，不可切换）

---

## 3. 架构总览

```
┌─────────────────────────────────────────────────────────────────────┐
│                         用户请求                                     │
└───────────────────────────────┬─────────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  apps/web — Middleware                                              │
│  · 无 locale 前缀 → cookie → Accept-Language → en → 302             │
│  · 有合法 locale 前缀 → 放行（URL 权威，不覆盖）                      │
│  · 非法 locale → 302 到 /en/...                                     │
└───────────────────────────────┬─────────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  apps/web — app/[locale]/layout.tsx                                 │
│  · next-intl：加载 messages/{locale}.json                           │
│  · 读 theme cookie → <html class="light|dark"> 初始值               │
│  · ThemeProvider（next-themes）三态 + 写 cookie                      │
│  · fetch GET /settings?locale={locale}（SiteSettings 运营内容）      │
└───────────────┬─────────────────────────────┬───────────────────────┘
                │                             │
                ▼                             ▼
┌───────────────────────────┐   ┌───────────────────────────────────┐
│  packages/shared          │   │  apps/api                         │
│  · Locale enum            │   │  · GET /settings?locale=          │
│  · ThemeMode enum         │   │  · GET /products（locale 参数预留   │
│  · SITE_CONFIG 常量       │   │    本迭代忽略，返回主表 en）         │
│  · Cookie 名常量          │   └───────────────┬───────────────────┘
└───────────────────────────┘                   │
                                                ▼
                                ┌───────────────────────────────────┐
                                │  packages/db                      │
                                │  · SiteSettings / SiteContent     │
                                │  · ProductTranslation（预留空表）  │
                                └───────────────────────────────────┘
```

---

## 4. 分 Strip 实施流（推荐顺序）

每个 Strip 可独立 PR，按依赖顺序合并。

### Strip 0 — 共享类型与常量（`packages/shared`）

**目的**：全 monorepo 单一真相源，避免 locale/theme 字符串散落。

**交付**：

- [ ] `Locale` enum：`en` | `zh`；`LOCALE_VALUES`、`DEFAULT_LOCALE`
- [ ] `ThemeMode` enum：`light` | `dark` | `system`；`DEFAULT_THEME_MODE`
- [ ] `SITE_CONFIG`：`supportedLocales`、`defaultLocale`、`defaultCurrency: USD`
- [ ] Cookie 名常量：`LOCALE_COOKIE_NAME`、`THEME_COOKIE_NAME`
- [ ] Zod schema：`localeSchema`、`themeModeSchema`
- [ ] `SiteSettingsDto` / `SiteContentDto`（运营内容响应形状）

**验收**：`pnpm --filter @myshop/shared build` 通过；web/api 均可 import。

---

### Strip 1 — 数据库预留（`packages/db`）

**目的**：全局底座表 + 内容翻译预留；本迭代 Seed 写入初始 SiteSettings。

**Prisma 新增（建议形状）**：

```prisma
model SiteSettings {
  id        String   @id @default("singleton")
  updatedAt DateTime @updatedAt
  contents  SiteContent[]
}

model SiteContent {
  id         String       @id @default(cuid())
  settingsId String       @default("singleton")
  settings   SiteSettings @relation(fields: [settingsId], references: [id])
  locale     String       // "en" | "zh"，与 shared Locale 对齐
  siteName   String
  announcement String?    // 纯文本，可 null
  footerText String?      // 纯文本，可 null
  @@unique([settingsId, locale])
}

// 预留 — 本迭代不实现读写逻辑
model ProductTranslation {
  id          String  @id @default(cuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  locale      String
  name        String
  description String
  @@unique([productId, locale])
  @@index([locale])
}
```

**Product 模型变更**：增加 `translations ProductTranslation[]` 关系。

**Seed**：`en` / `zh` 各一条 `SiteContent`（站点名、公告、页脚占位文案）。

**验收**：`pnpm db:migrate` + `pnpm db:generate` 成功；Seed 可重复执行。

**边缘 case**：

- `SiteSettings` 单例 id 固定 `"singleton"`，防止多行配置
- `ProductTranslation` 表存在但 API 不查询，避免半实现状态

---

### Strip 2 — 只读 Settings API（`apps/api`）

**目的**：Web Layout 拉取运营内容；locale 参数对齐 URL。

**交付**：

- [ ] `SettingsModule` / `SettingsController` / `SettingsService`
- [ ] `GET /settings?locale=en|zh`
  - 返回 `SiteSettingsDto`（siteName、announcement、footerText）
  - 请求 locale 无记录 → fallback 到 `en` 的 `SiteContent`
- [ ] 全局 `HttpExceptionFilter`（若尚未存在）
- [ ] E2E：`GET /settings?locale=zh` 返回中文 seed

**不在范围**：`PATCH /admin/settings`、鉴权、缓存层（Web 侧 `fetch` + `revalidate` 即可）。

**验收**：`pnpm --filter @myshop/api test:e2e` 覆盖 settings 端点。

---

### Strip 3 — i18n 路由与 Middleware（`apps/web`）

**目的**：子路径 locale；URL 权威；语言切换改 URL + 写 cookie。

**依赖**：`next-intl`（`pnpm --filter @myshop/web add next-intl`）

**目录结构调整**：

```
apps/web/src/
├── middleware.ts
├── i18n/
│   ├── routing.ts      # locales, defaultLocale, pathnames
│   └── request.ts        # next-intl server config
├── messages/
│   ├── en.json
│   └── zh.json
└── app/
    └── [locale]/
        ├── layout.tsx
        └── page.tsx
```

**Middleware 规则（决策 A）**：

| 请求路径 | 行为 |
|----------|------|
| `/` | `cookie` → `Accept-Language`（匹配 `en`/`zh`）→ `en`；302 → `/{locale}` |
| `/products`（无 locale） | 同上；302 → `/{locale}/products` |
| `/en/...`、`/zh/...` | 放行；**不**读 cookie 覆盖 |
| `/fr/...`（不支持） | 302 → `/en/...`（保留 path suffix） |
| 静态资源 / `_next` / `favicon` | 跳过 matcher |

**语言切换器行为**：

1. 用户从 `/en/products/tent` 切到 `zh`
2. 客户端导航到 `/zh/products/tent`（同 path suffix）
3. 写入 `LOCALE_COOKIE_NAME=zh`（max-age 建议 1 年）

**SEO**：

- [ ] `<html lang={locale}>` 动态设置
- [ ] `generateMetadata` 中 `alternates.languages`：`en` → `/en/...`，`zh` → `/zh/...`
- [ ] 根 layout metadata 模板使用 next-intl `getTranslations`

**验收**：

- 分享 `/zh/...` 链接在英文浏览器仍显示中文
- 访问 `/` 无 cookie 时按 Accept-Language 跳转
- 切换语言后 cookie 持久化，下次访问 `/` 尊重 cookie

---

### Strip 4 — 日夜模式三态（`apps/web`）

**目的**：可切换主题；SSR 与客户端一致；无 FOUC。

**依赖**：`next-themes`（`pnpm --filter @myshop/web add next-themes`）

**交付**：

- [ ] `ThemeProvider` Client Component（`attribute="class"`, `defaultTheme="system"`, `enableSystem`）
- [ ] Root `[locale]/layout.tsx`：**服务端**读 `THEME_COOKIE_NAME` → 设置 `<html className={...} suppressHydrationWarning>`
- [ ] 切换主题时写 cookie（与 next-themes 同步，可用 small client wrapper）
- [ ] `globals.css`：从纯 `@media (prefers-color-scheme)` 迁移为 **class 策略**（`.dark` 变量）
- [ ] Header 主题切换器 UI（Sun / Moon / Monitor 或等效三态）

**三态语义**：

| 值 | SSR class | 客户端行为 |
|----|-----------|------------|
| `light` | `light` | 强制浅色 |
| `dark` | `dark` | 强制深色 |
| `system` | 不写死（或跟随首次 system 检测） | 监听 `prefers-color-scheme` |

**边缘 case**：

- theme cookie 与 locale cookie **独立**，Middleware 不处理 theme
- `system` 切换时 cookie 存 `system`，SSR 不强行 `dark`，避免与 OS 偏好冲突
- 所有主题切换控件在 Client Component；禁止 SSR 读 `window`

**验收**：

- 深色偏好用户首屏无白闪
- 手动切 `light` 后刷新仍保持 `light`
- 三态 UI 可循环切换

---

### Strip 5 — 全局 Layout 集成与 UI 组件

**目的**：把 Settings API、i18n、主题、切换器组装为可用全局壳。

**交付**：

- [ ] `SiteHeader`：Logo（siteName from settings）、LocaleSwitcher、ThemeSwitcher
- [ ] `AnnouncementBar`：展示 `announcement`（纯文本；null 不渲染）
- [ ] `SiteFooter`：展示 `footerText`
- [ ] Root `[locale]/layout.tsx`：`Promise.all([getSettings(locale), getMessages(locale)])`
- [ ] 首页及占位页文案全部改用 `useTranslations` / `getTranslations`

**缓存策略**：

- Settings fetch：`next: { revalidate: 60 }` 或按需调优
- messages 静态 import，构建时打包

**验收**：切换 locale / theme 后 Header、公告、页脚同步；无 hardcoded 英文 UI 串（除 seed 数据外）。

---

### Strip 6 — 质量门禁与文档

**交付**：

- [ ] 更新 `.trellis/spec/web/frontend/`：i18n + theme 约定
- [ ] 更新 `.trellis/spec/shared/`：Locale / ThemeMode 导出说明
- [ ] Middleware + Settings E2E / 集成测试
- [ ] `README.zh-CN.md` 补充 i18n/theme 本地验证步骤

**CI**：现有 pipeline `build → lint → test` 必须通过；Prisma migrate 在 CI 仅 generate，不依赖新表数据。

---

## 5. 包级变更清单

| 包 | 变更 |
|----|------|
| `packages/shared` | Locale、ThemeMode enum；SITE_CONFIG；Cookie 常量；SiteSettingsDto；Zod |
| `packages/db` | SiteSettings、SiteContent、ProductTranslation；Seed |
| `apps/api` | SettingsModule；GET /settings |
| `apps/web` | middleware；[locale] 路由；next-intl；next-themes；全局 Layout 组件 |

**不改动（本迭代）**：

- Stripe 相关 env 与 checkout 流
- Product CRUD 与翻译逻辑
- Admin 后台
- `Currency` enum 行为（仍 USD default）

---

## 6. API 契约

### `GET /settings`

**Query**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `locale` | `en` \| `zh` | 否 | 默认 `en` |

**Response 200**：

```typescript
interface SiteSettingsDto {
  locale: Locale;           // 实际返回的 locale（可能是 fallback 后的 en）
  siteName: string;
  announcement: string | null;
  footerText: string | null;
}
```

**Fallback 规则**：请求 `zh` 但 DB 无 `zh` 行 → 返回 `en` 行，响应中 `locale` 字段仍为实际使用的 `en`（便于调试）或保留请求 locale（实现时需二选一并写死，**推荐响应 `resolvedLocale` + `requestedLocale`**）。

---

## 7. Cookie 规范

| Cookie | 名称（建议） | 值 | Max-Age | 作用域 |
|--------|--------------|-----|---------|--------|
| Locale | `NEXT_LOCALE` | `en` \| `zh` | 31536000（1y） | `/` |
| Theme | `NEXT_THEME` | `light` \| `dark` \| `system` | 31536000（1y） | `/` |

- `Secure`：生产环境 true
- `SameSite=Lax`
- 不写 `HttpOnly`（theme 需 client 读；locale cookie 可由 client 写）

---

## 8. 边缘 Case 与金钱安全

| 场景 | 预期行为 | 风险等级 |
|------|----------|----------|
| 用户改语言 | 仅 UI + SiteContent 变；**价格仍 USD** | 低 |
| API 被传 `?locale=fr` | Zod 拒绝或 fallback `en`；不 500 | 低 |
| 商品 slug 跨语言相同 | `/en/products/tent` 与 `/zh/products/tent` 同 SKU；内容暂英 | 低 |
| 未来加 EUR 多币种 | 本迭代 Schema 未写死语言=货币；`ProductTranslation` 已预留 | — |
| Googlebot 访问 `/en/...` | 无 cookie 仍稳定收录英文 URL | SEO |
| Googlebot 访问 `/` | 302 到 `/en/`（无 Accept-Language 时） | 可接受 |
| Settings API 宕机 | Layout 应有 fallback 硬编码默认值，站仍可开 | 中 |
| theme=system + SSR | 避免 SSR 强行 dark 导致 mismatch | 中 |
| 水合 | 主题切换器、`localStorage` 仅作冗余；主路径 cookie | 中 |

**金钱相关红线（本迭代）**：

- 禁止在 UI 层根据 locale 换算或展示非 USD 符号（除非明确写 `$` + USD）
- 禁止在 `ProductTranslation` 预留表中加 `priceCents` 字段（价格与语言解耦）

---

## 9. 非目标（Out of Scope）

- [ ] 多币种价格矩阵与 Stripe 多 currency checkout
- [ ] 商品/分类内容翻译 Admin CRUD
- [ ] 公告富文本 / Markdown / HTML  sanitize
- [ ] GeoIP 自动 locale
- [ ] 子域名 i18n（`en.myshop.com`）
- [ ] Cookie 覆盖 URL locale（决策已否决）
- [ ] RTL 语言（阿拉伯语等）
- [ ] 用户账户级 locale 偏好（登录态）

---

## 10. 验收标准（Definition of Done）

### 功能

- [ ] 所有页面可通过 `/en/...` 与 `/zh/...` 访问
- [ ] UI 字符串无 hardcode（messages 字典覆盖）
- [ ] 语言切换更新 URL + cookie；分享链接语言稳定
- [ ] 主题三态可用；刷新后偏好保持；无明显 FOUC
- [ ] 公告 / 页脚 / 站点名从 API 按 locale 加载；纯文本渲染
- [ ] `GET /settings` 有测试覆盖

### 工程

- [ ] 无 `any`；shared enum 全链路引用
- [ ] Prisma migrate 可重复；Seed 文档化
- [ ] CI 全绿
- [ ] 零 `// TODO` 占位

---

## 11. 测试计划

| 类型 | 覆盖点 |
|------|--------|
| **Middleware 单元/集成** | `/` redirect；非法 locale；URL 不被 cookie 覆盖 |
| **API E2E** | settings fallback；locale 参数校验 |
| **Web 手动** | 分享链接；Accept-Language；theme 三态；hydration 无报错 |
| **SEO 手动** | view-source 检查 `lang`、`hreflang` alternates |

---

## 12. 风险与缓解

| 风险 | 缓解 |
|------|------|
| next-intl 与 Next.js 15 异步 API 不兼容 | 实施前读 `node_modules/next/dist/docs/`；Pin 文档版本 |
| class 暗色迁移遗漏 `dark:` 类 | Strip 4 全站扫一遍；lint 规则可选 |
| SiteSettings 单点故障 | Layout fallback 默认文案 |
| ProductTranslation 预留被误实现 | PR checklist 明确「不查询翻译表」 |
| 范围蔓延到 Admin CMS | Strip 2 只做 GET；拒绝 PATCH PR |

---

## 13. 后续迭代（Post-MVP）

1. **Phase 2**：`ProductTranslation` CRUD + API `?locale=` 返回翻译内容 + `generateMetadata` 多语言
2. **Phase 3**：多币种价格矩阵 + Stripe currency + 货币切换器（与 locale 解耦）
3. **Phase 4**：Admin Settings / 商品翻译后台
4. **Phase 5**：Sitemap 分 locale；JSON-LD 多语言

---

## 14. Trellis 启动命令（供开发者）

```bash
python3 ./.trellis/scripts/task.py create "Global i18n theme and SiteSettings foundation" --slug global-i18n-theme-foundation
python3 ./.trellis/scripts/task.py start global-i18n-theme-foundation
```

实现时按 **Strip 0 → 6** 顺序提交；每 Strip 完成后运行 `trellis-check`。

---

## 附录 A：拷问全程速查

```
Q1 货币/语言/定价  → D (MVP 单 USD，预留扩展)
Q2 i18n 路由       → A (全员 /[locale]/...)
Q3 翻译分层       → B (UI 静态 + DB 预留，fallback en)
Q4 全局底座       → D (结构 shared + 内容 DB，纯文本)
Q5 日夜模式       → B (cookie SSR + 三态)
Q6 Middleware     → A (URL 权威)
```

## 附录 B：推荐依赖

```bash
pnpm --filter @myshop/web add next-intl next-themes
```

无需在 root 安装业务依赖。
