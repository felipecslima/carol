import { defineConfig } from '@playwright/test';

// Testa o build já gerado (`npm run build`), servido como arquivos estáticos.
export default defineConfig({
  testDir: 'e2e',
  webServer: { command: 'python3 -m http.server 4330 -d dist/client', url: 'http://localhost:4330/app/', reuseExistingServer: true },
  use: { baseURL: 'http://localhost:4330' },
});
