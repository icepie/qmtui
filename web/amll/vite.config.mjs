import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));

// 独立于 qmtui 主界面（web/browser）的一个小应用：产物落在 www/amll，由后端挂到 /amll。
export default defineConfig({
  root: here,
  base: '/amll/',
  build: {
    outDir: path.resolve(here, '../../www/amll'),
    emptyOutDir: true,
    target: 'chrome110',
  },
});
