import { defineConfig } from 'astro/config';

// `site` garante URLs absolutas no og:image e nas meta tags.
export default defineConfig({
  site: 'https://eucarollimah.com.br',
  // CSS dentro do HTML: um pedido a menos bloqueando o primeiro desenho
  build: { inlineStylesheets: 'always' },
});
