import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 [Trellis Verify & Archive] 启动通用收尾流...');

let branchName = 'default-feature';
try {
  branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim().replace(/\//g, '-');
} catch (e) {
  console.error('❌ 错误：无法获取 Git 分支名，归档失败！');
  process.exit(1);
}

const taskFileName = `task-${branchName}.md`;
const mdcFileName = `task-${branchName}.mdc`;

const taskPath = path.join(__dirname, `../../docs/tasks/${taskFileName}`);
const mdcPath = path.join(__dirname, `../../.cursor/rules/${mdcFileName}`);
const journalDir = path.join(__dirname, '../../.trellis/journals');

if (!fs.existsSync(taskPath)) {
  console.error(`❌ 错误：未找到当前分支对应的需求契约文件 [docs/tasks/${taskFileName}]，拒绝归档。`);
  process.exit(1);
}

try {
  fs.mkdirSync(journalDir, { recursive: true });
  const dateStr = new Date().toISOString().split('T')[0];
  const journalPath = path.join(journalDir, `${dateStr}-${branchName}.md`);
  
  fs.copyFileSync(taskPath, journalPath);
  console.log(`📝 [团队记忆锁死] 成功将分支共识沉淀至长期记忆库: .trellis/journals/${dateStr}-${branchName}.md`);

  if (fs.existsSync(mdcPath)) {
    fs.unlinkSync(mdcPath);
    console.log(`🗑️  [清理战场] 已成功自动卸载当前分支的临时 MDC 规则: .cursor/rules/${mdcFileName}`);
  }

  console.log(`🏁 [Trellis 闭环成功] 分支 [${branchName}] 研发任务顺利完结！`);
} catch (error) {
  console.error('❌ 归档收尾过程中发生异常:', error.message);
  process.exit(1);
}