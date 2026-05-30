# @myshop/api — NestJS 后端

Monorepo 中的 **NestJS 11** 后端服务，负责订单、库存、商家后台 API 及未来的定时任务（Cron）。通过 `@myshop/db` 访问 PostgreSQL，通过 `@myshop/shared` 共享 DTO 与 Zod Schema，供 `@myshop/web` 前台或其他客户端调用。

> 英文版请参阅 [README.md](./README.md)（NestJS 官方脚手架模板）。

---

## 目录

- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [快速开始](#快速开始)
- [环境变量](#环境变量)
- [与 Monorepo 的协作](#与-monorepo-的协作)
- [架构与分层](#架构与分层)
- [数据库访问](#数据库访问)
- [共享类型与校验](#共享类型与校验)
- [API 设计约定](#api-设计约定)
- [脚本命令](#脚本命令)
- [测试](#测试)
- [构建与部署](#构建与部署)
- [AI 开发注意事项](#ai-开发注意事项)
- [相关文档](#相关文档)

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | NestJS | 11.x |
| HTTP | Express（`@nestjs/platform-express`） | — |
| ORM | Prisma（via `@myshop/db`） | 6.8.x |
| 数据库 | PostgreSQL | 16 |
| 共享类型 | `@myshop/shared` | workspace |
| 语言 | TypeScript | 5.7.x |
| 测试 | Jest + Supertest | 30.x |
| Lint | ESLint + Prettier | 9.x / 3.x |

---

## 目录结构

```
apps/api/
├── src/
│   ├── main.ts              # 应用入口，监听 PORT（默认 3001）
│   ├── app.module.ts        # 根模块
│   ├── app.controller.ts    # 根控制器（健康检查等）
│   ├── app.service.ts       # 根服务
│   └── app.controller.spec.ts
├── test/
│   ├── app.e2e-spec.ts      # E2E 测试
│   └── jest-e2e.json
├── nest-cli.json
├── tsconfig.json
├── eslint.config.mjs
├── package.json
└── README.md / README.zh-CN.md
```

当前为 NestJS CLI 初始脚手架。业务模块（如 `products/`、`orders/`）应按 Nest 模块化规范在 `src/` 下扩展：

```
src/
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts
│   └── products.service.ts
├── orders/
│   └── ...
├── common/
│   ├── filters/             # 全局异常过滤器
│   └── interceptors/        # 统一响应格式
└── main.ts
```

---

## 快速开始

### 在 Monorepo 根目录（推荐）

```bash
# 前置：pnpm install、.env、pnpm db:up、pnpm db:generate、pnpm db:push
pnpm dev:apps              # web :3000 + api :3001
```

### 仅启动 API

```bash
pnpm --filter @myshop/api dev
# 等价于 nest start --watch
```

服务默认监听：**http://localhost:3001**

### 生产模式

```bash
pnpm --filter @myshop/api build
pnpm --filter @myshop/api start:prod   # node dist/main
```

---

## 环境变量

API 读取**仓库根目录** `.env`：

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `PORT` | 否 | `3001` | HTTP 监听端口 |
| `NODE_ENV` | 否 | `development` | 运行环境 |
| `DATABASE_URL` | 是 | 见 `.env.example` | Prisma 连接串（`@myshop/db` 使用） |

`main.ts` 中的启动逻辑：

```typescript
await app.listen(process.env.PORT ?? 3001);
```

---

## 与 Monorepo 的协作

### Workspace 依赖

```json
"@myshop/db": "workspace:*",
"@myshop/shared": "workspace:*"
```

### 添加 Nest 或第三方依赖

```bash
pnpm --filter @myshop/api add @nestjs/config
pnpm --filter @myshop/api add @nestjs/schedule
pnpm --filter @myshop/api add -D @types/express
```

**不要**在 Monorepo 根目录安装 Nest 业务依赖。

### 构建顺序

根目录 `pnpm build` 会先构建 `packages/shared`、`packages/db`，再构建 `apps/api`。修改 Prisma Schema 后务必：

```bash
pnpm db:generate
```

---

## 架构与分层

遵循 `.cursor/rules/nestjs-backend.mdc` 与 `.trellis/spec/api/backend/` 中的规范。

### 三层职责

| 层 | 职责 | 禁止 |
|----|------|------|
| **Controller** | 接收请求、参数校验、调用 Service、返回响应 | 业务逻辑、直接操作数据库 |
| **Service** | 业务逻辑、事务边界 | HTTP 细节 |
| **Module** | 组织依赖、导出共享 Service | — |

### 标准 Controller 示例

```typescript
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createOrder(@Body() dto: CreateOrderInput): Promise<OrderDto> {
    return this.ordersService.create(dto);
  }
}
```

### 错误处理

- 配置全局 `HttpExceptionFilter`
- 业务错误使用 Nest 标准异常：`BadRequestException`、`NotFoundException` 等
- **禁止**手动 `return { code: 500, message: '...' }`

### 事务

涉及库存扣减、订单创建等多表写入时，在 Service 层使用：

```typescript
import { prisma } from '@myshop/db';

await prisma.$transaction(async (tx) => {
  // 扣库存、创建订单、创建订单项...
});
```

---

## 数据库访问

通过 `@myshop/db` 包导入 Prisma Client 单例：

```typescript
import { prisma, OrderStatus, type Product } from '@myshop/db';
```

`packages/db/src/client.ts` 在开发环境将 client 挂到 `globalThis`，避免热重载时连接数爆炸。

### 当前数据模型

| 模型 | 关键字段 |
|------|----------|
| `Product` | `name`, `slug`, `priceCents`, `stock`, `currency` |
| `Order` | `status`, `totalCents`, `currency`, `items` |
| `OrderItem` | `productId`, `quantity`, `unitPriceCents` |

金额字段均为**整数分**，禁止使用浮点数。

### 数据库命令（在 Monorepo 根目录）

```bash
pnpm db:generate
pnpm --filter @myshop/db db:push      # 开发快速同步
pnpm db:migrate                       # 正式迁移
pnpm --filter @myshop/db db:studio    # 可视化管理
```

---

## 共享类型与校验

`@myshop/shared` 提供跨 web / api 一致的类型与校验：

### DTO 接口

```typescript
import type { ProductDto, OrderDto } from '@myshop/shared';
```

### Zod Schema

```typescript
import { createProductSchema, createOrderSchema } from '@myshop/shared';

// 在 Controller 或 Pipe 中校验
const parsed = createProductSchema.parse(body);
```

| Schema | 用途 |
|--------|------|
| `createProductSchema` / `updateProductSchema` | 商品创建/更新 |
| `createOrderSchema` | 创建订单 |
| `updateOrderStatusSchema` | 更新订单状态 |

可将 Zod 与 NestJS 的 `ValidationPipe` 或自定义 `ZodValidationPipe` 结合使用。

---

## API 设计约定

### RESTful 路由（规划）

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/products` | 商品列表 |
| `GET` | `/products/:slug` | 商品详情 |
| `POST` | `/products` | 创建商品（后台） |
| `POST` | `/orders` | 创建订单 |
| `PATCH` | `/orders/:id/status` | 更新订单状态 |
| `GET` | `/health` | 健康检查 |

### 响应格式（建议）

统一成功响应结构，便于前台处理：

```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
}
```

错误由 Nest 异常过滤器转换为标准 HTTP 状态码 + 消息体。

### CORS

前台跨域调用时，在 `main.ts` 中按需启用：

```typescript
app.enableCors({
  origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
});
```

---

## 脚本命令

在 `apps/api` 目录或通过 `--filter` 执行：

| 命令 | 说明 |
|------|------|
| `pnpm dev` / `pnpm start:dev` | 开发模式，文件变更自动重启 |
| `pnpm start` | 普通启动 |
| `pnpm start:debug` | 调试模式（`--inspect`） |
| `pnpm start:prod` | 运行编译后的 `dist/main.js` |
| `pnpm build` | `nest build` 编译 TypeScript |
| `pnpm lint` | ESLint 检查 `src/`、`test/` |
| `pnpm lint:fix` | 自动修复可修复项 |
| `pnpm format` | Prettier 格式化 |
| `pnpm test` | 单元测试（Jest） |
| `pnpm test:watch` | 监听模式 |
| `pnpm test:cov` | 覆盖率报告 |
| `pnpm test:e2e` | E2E 测试 |

---

## 测试

### 单元测试

- 测试文件命名：`*.spec.ts`，与源文件同目录或 `src/` 下
- 配置见 `package.json` 的 `jest` 字段
- 使用 `@nestjs/testing` 创建 TestingModule

```bash
pnpm --filter @myshop/api test
```

### E2E 测试

```bash
pnpm --filter @myshop/api test:e2e
```

E2E 配置：`test/jest-e2e.json`，使用 Supertest 对 HTTP 端点发请求。

---

## 构建与部署

### 本地构建

```bash
pnpm --filter @myshop/api build
```

输出目录：`dist/`。

### 生产部署 checklist

- [ ] 设置 `NODE_ENV=production`
- [ ] 配置生产级 `DATABASE_URL`
- [ ] 设置 `PORT`（云平台常通过环境变量注入）
- [ ] 运行数据库迁移：`pnpm db:migrate`
- [ ] 使用 `pnpm start:prod` 或 PM2 / Docker 启动进程
- [ ] 配置健康检查端点供负载均衡器探测

### Docker 示例思路

多阶段构建：先 `pnpm build` 全 monorepo，再仅复制 `dist/` 与生产 `node_modules` 到运行镜像。需确保 `@myshop/db` 的 Prisma Client 已在构建阶段 `generate`。

### 云平台

- **Railway / Render / Fly.io**：适合 Node 服务 + 托管 Postgres
- **AWS ECS / Lambda**：需自行配置容器或 Serverless 适配
- NestJS 官方 [Mau](https://mau.nestjs.com) 平台提供一键 AWS 部署（可选）

---

## AI 开发注意事项

| 资源 | 说明 |
|------|------|
| `.cursor/rules/nestjs-backend.mdc` | Controller/Service 分层、异常、事务 |
| `.cursor/rules/db.mdc` | 金额用分、$transaction |
| `.trellis/spec/api/backend/index.md` | 后端编码规范入口 |

新建业务模块前建议阅读 Pre-Development Checklist：

```bash
cat .trellis/spec/api/backend/index.md
```

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [根 README.zh-CN.md](../../README.zh-CN.md) | Monorepo 总览 |
| [apps/web/README.zh-CN.md](../web/README.zh-CN.md) | 前台说明 |
| [NestJS 官方文档](https://docs.nestjs.com) | 框架权威参考 |
| [Prisma 文档](https://www.prisma.io/docs) | ORM 与迁移 |

---

## 许可证

`@myshop/api` 的 `package.json` 标注为 **UNLICENSED**（私有）。对外分发前请确认许可证策略。
