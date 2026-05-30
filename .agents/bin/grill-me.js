import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 动态获取 Git 状态（分支名与当前改动的文件）
let branchName = 'patch-feature';
let modifiedFiles = '暂无未提交的改动';
try {
  branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim().replace(/\//g, '-');
  // 获取当前暂存或未暂存的文件列表，作为 AI 的精准补丁线索
  const diffFiles = execSync('git status --porcelain').toString().trim();
  if (diffFiles) {
    modifiedFiles = diffFiles.split('\n').map(f => `- ${f.trim()}`).join('\n');
  }
} catch (e) {
  branchName = 'feature-update';
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`====================================================`);
console.log(`⛺ Camping Shop 智能体工作流 ➔ [极速迭代模式]`);
console.log(`当前分支: ${branchName}`);
console.log(`====================================================\n`);

// 2. 只需要人类输入一句话，极简到极致
rl.question("👉 本次迭代/修复，你具体打算改动什么？（一句话大白话描述即可）\n输入: ", (userInput) => {
  rl.close();
  generateUltimateAssets(userInput);
});

function generateUltimateAssets(userInput) {
  console.log('\n⚡ 正在动态组装自适应 AI 强管控规则...');

  const taskFileName = `task-${branchName}.md`;
  const mdcFileName = `task-${branchName}.mdc`;

  // 3. 终极动态需求契约：将人类意图、当前代码库快照、全局规范融为一体
  const taskMdContent = `# 迭代研发契约：${branchName}

## 👥 人类原始迭代意图 (User Intent)
- ${userInput}

## 🔍 核心代码库当前快照 (Workspace Snapshot)
- **触发分支**：${branchName}
- **检测到的肉身改动文件/工作区状态**：
${modifiedFiles}

## 🛠️ 自适应研发底线
1. **专注原则 (Scope Control)**：Cursor Agent 在处理当前请求时，**必须且仅能**围绕人类所述的【${userInput}】进行精准修改。
2. **严禁无故重构**：严禁在未获得明确指令的情况下，重构、删改或覆盖与当前迭代无关的现有前端组件或后端接口逻辑。
3. **技术栈红线持续生效**：
   - 如果涉及 \`apps/web\`（前端），必须严格遵循项目全局的 @nextjs-frontend.mdc（锁死异步 params 与 SEO 标准）。
   - 如果涉及 \`apps/api\`（后端），必须严格遵循项目全局的 @nestjs-backend.mdc（锁死强类型 DTO 与标准异常捕获）。
4. **清理遗留**：禁止留下任何带有 \`// TODO\` 的半成品代码。修改完成后，必须提示用户在终端运行 \`pnpm verify\` 进行质量合规校验。
`;

  // 4. 终极动态 MDC 强控规则
  const mdcContent = `---
description: 修改或编写当前迭代分支 [${branchName}] 的逻辑时，AI 会被无感注入此围栏
globs: "apps/web/**/*, apps/api/**/*, packages/**/*"
---
# 🛑 Trellis 强管控：当前分支 [${branchName}] 增量迭代围栏

你现在处于针对既存代码进行【增量迭代/修复】的 Implement 阶段。

## ⚠️ 核心行为判定
1. **意图对齐**：本次迭代的唯一合法目标是：【${userInput}】。你所写的任何一行新代码、做出的任何一个逻辑调整，都必须为该目标服务。
2. **防御性编程**：当前是一个存量项目，请小心保护现有逻辑，禁止随意破坏既有的前后端数据契约。
3. **自检合规**：开发完毕后，你必须主动提示用户运行 \`pnpm verify\` 进行类型检查与 Lint 扫描。
`;

  // 写入文件
  fs.mkdirSync(path.join(__dirname, '../../docs/tasks'), { recursive: true });
  fs.mkdirSync(path.join(__dirname, '../../.cursor/rules'), { recursive: true });

  fs.writeFileSync(path.join(__dirname, `../../docs/tasks/${taskFileName}`), taskMdContent);
  fs.writeFileSync(path.join(__dirname, `../../.cursor/rules/${mdcFileName}`), mdcContent);

  console.log(`\n✨ [Trellis 托管成功] 动态契约已生成 ➔ docs/tasks/${taskFileName}`);
  console.log(`✨ [MDC 强控生效] 迭代围栏已拉起 ➔ .cursor/rules/${mdcFileName}`);
  console.log(`👉 唤醒 Cursor Composer (Cmd+I)，直接下令：“依据 @${taskFileName} 开始迭代！”`);
}