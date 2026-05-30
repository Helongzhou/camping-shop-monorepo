# 需求契约：feature-catalog-seo

## 👥 业务基本面
- **本次功能**：商品货架与极致 SEO（首页、分类、详情）
- **页面属性**：SEO 核心页面（启用严格水合防崩与语义化HTML）
- **数据库变动**：涉及 Schema 变更
- **外部依赖**：无

## 🛠️ 脚本自动追加的 AI 研发底线（人类无感）
- **SEO 红线**：必须严格遵循 @nextjs-frontend.mdc。在 Page 落地页中必须使用异步 params 并导出 generateMetadata，必须注入 Schema.org JSON-LD 结构化数据，确保 LCP 性能指标。
- **DB 红线**：修改 packages/db 中的 schema.prisma 时，字段命名必须采用驼峰命名，金额一律存整型（分），完成后自动运行 prisma generate。

