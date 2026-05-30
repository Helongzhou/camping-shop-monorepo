#!/usr/bin/env node
/**
 * GitHub Pages build: static export requires middleware to be absent.
 * Temporarily renames middleware.ts for `next build`, then restores it.
 */
import { access, rename, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const middlewarePath = path.join(webRoot, 'src/middleware.ts');
const middlewareBackup = path.join(webRoot, 'src/middleware.ts.pages-backup');

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const hadMiddleware = await exists(middlewarePath);

  if (hadMiddleware) {
    await rename(middlewarePath, middlewareBackup);
  }

  try {
    const result = spawnSync('pnpm', ['exec', 'next', 'build'], {
      cwd: webRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        GITHUB_PAGES: 'true',
      },
    });

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }

    const rootRedirect = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=en/" />
    <title>TrailNest</title>
  </head>
  <body>
    <p><a href="en/">Continue to TrailNest</a></p>
  </body>
</html>
`;
    await writeFile(path.join(webRoot, 'out/index.html'), rootRedirect, 'utf8');
  } finally {
    if (hadMiddleware && (await exists(middlewareBackup))) {
      await rename(middlewareBackup, middlewarePath);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
