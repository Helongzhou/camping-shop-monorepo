# PRD：Global i18n · Theme · SiteSettings Foundation

**Task ID**: `global-i18n-theme-foundation`  
**Status**: `completed` (Strip 0–6 delivered)  
**Owner**: zhoudaxia  
**Created**: 2026-05-30

---

## 1. 背景与目标

出海独立站需要三项全局基础设施，作为商品、订单、Stripe 结账的前置底座：

1. **多语言（i18n）** — `/en`、`/zh` 子路径；UI 静态字典；URL 为 SEO 权威来源  
2. **日夜模式** — `light` / `dark` / `system`；cookie SSR 同步；避免 FOUC  
3. **全局数据底座** — 结构配置在 `@myshop/shared`；运营内容（站点名、公告、页脚）在 DB + 只读 API  

详细架构与 Strip 拆分见同目录 [`task-stripe-flow.md`](./task-stripe-flow.md)。

---

## 2. 已锁定决策（Grill-Me）

| 议题 | 决策 |
|------|------|
| 货币/定价 | MVP 冻结 USD；不做货币切换；Schema 仅预留 |
| i18n 路由 | 全员 `/[locale]/...`；默认 locale 也带前缀 |
| 翻译分层 | UI → `next-intl` JSON；DB 预留 `ProductTranslation`；API fallback `en` |
| 全局底座 | 结构 → `shared`；运营内容 → DB + `GET /settings` |
| 主题 | `next-themes` + cookie SSR；三态 |
| Middleware | URL 绝对权威；缺失 locale 时 cookie → Accept-Language → `en` |

---

## 3. 用户故事

### US-1：多语言浏览

**作为** 海外消费者  
**我希望** 通过 `/zh/...` 或 `/en/...` 稳定访问对应语言界面  
**以便** 理解商品与购物流程，且分享链接语言不被收件人浏览器偏好覆盖  

**验收**：
- 所有页面可经 `/en/...`、`/zh/...` 访问  
- 访问 `/` 按 cookie → Accept-Language → `en` 重定向  
- 语言切换更新 URL 前缀并写入 cookie  

### US-2：主题偏好

**作为** 任意访客  
**我希望** 在 light / dark / system 间切换并记住选择  
**以便** 舒适浏览且刷新后无闪烁  

**验收**：
- Header 提供三态切换  
- 首屏 SSR 与客户端主题一致  
- 偏好写入 `NEXT_THEME` cookie  

### US-3：全局运营内容

**作为** 运营（通过 Seed / 未来 Admin）  
**我希望** 站点名、公告、页脚按 locale 从 API 加载  
**以便** 不发版即可调整文案（本迭代 Seed 初始化）  

**验收**：
- `GET /settings?locale=zh` 返回中文 SiteContent  
- 缺失 locale 时 fallback 到 `en`  
- 公告/页脚为纯文本  

---

## 4. 功能范围

### In Scope

| Strip | 包 | 交付 |
|-------|-----|------|
| 0 | `shared` | Locale、ThemeMode、SITE_CONFIG、Cookie 常量、Zod、SiteSettingsDto |
| 1 | `db` | SiteSettings、SiteContent、ProductTranslation（预留）；Seed |
| 2 | `api` | `GET /settings`；HttpExceptionFilter |
| 3 | `web` | Middleware、next-intl、`[locale]` 路由 |
| 4 | `web` | next-themes、cookie SSR、class 暗色 |
| 5 | `web` | SiteHeader、AnnouncementBar、SiteFooter、Layout 集成 |
| 6 | 全仓 | Spec 更新、测试、README |

### Out of Scope

- 多币种 / Stripe checkout  
- 商品翻译 CRUD  
- Admin Settings UI  
- GeoIP、RTL、富文本公告  
- Cookie 覆盖 URL locale  

---

## 5. 技术约束

- 禁止 `any`；金额仍用整数分（USD only 展示）  
- 禁止 `// TODO` 占位  
- 依赖安装使用 `pnpm --filter`  
- Next.js 15：`params` / `searchParams` 必须 `await`  
- NestJS：Controller → Service → `@myshop/db`  

---

## 6. API 契约摘要

### `GET /settings?locale=en|zh`

**Response** (`SiteSettingsDto`):

| 字段 | 类型 | 说明 |
|------|------|------|
| `requestedLocale` | `Locale` | 请求参数 |
| `resolvedLocale` | `Locale` | 实际使用（fallback 后） |
| `siteName` | `string` | 站点名 |
| `announcement` | `string \| null` | 顶栏公告 |
| `footerText` | `string \| null` | 页脚文案 |

---

## 7. 验收标准（Definition of Done）

- [ ] Strip 0–6 全部完成  
- [ ] `pnpm build && pnpm lint && pnpm test` 通过  
- [ ] 无 hardcoded UI 字符串（messages 字典）  
- [ ] 分享 `/zh/...` 链接语言稳定  
- [ ] 主题三态无 FOUC  
- [ ] Settings E2E 测试通过  

---

## 8. 参考文档

- [`task-stripe-flow.md`](./task-stripe-flow.md) — 实施 Strip 与边缘 case  
- `.cursor/rules/monorepo.mdc`  
- `.cursor/rules/nextjs-frontend.mdc`  
- `.cursor/rules/nestjs-backend.mdc`  
- `.cursor/rules/db.mdc`  
