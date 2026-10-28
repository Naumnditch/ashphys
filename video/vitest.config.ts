import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@site': path.resolve(__dirname, '..'), 'perfect-freehand': path.resolve(__dirname, 'node_modules/perfect-freehand') } },
  test: { include: ['src/**/__tests__/**/*.test.ts'], environment: 'node' },
});
