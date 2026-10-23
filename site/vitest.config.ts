import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['ocr/tests/**/*.test.ts'] },
});
