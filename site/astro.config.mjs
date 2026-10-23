import { renameSync, rmdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// O Astro só gera 404.html na raiz; em /en/ e /es/ sai en/404/index.html. O Cloudflare serve a 404.html
// mais próxima do endereço pedido, então cada idioma ganha a sua.
const localized404 = {
  name: 'localized-404',
  hooks: {
    'astro:build:done': ({ dir }) => {
      for (const lang of ['en', 'es']) {
        const folder = fileURLToPath(new URL(`${lang}/404/`, dir));
        renameSync(`${folder}index.html`, fileURLToPath(new URL(`${lang}/404.html`, dir)));
        rmdirSync(folder);
      }
    },
  },
};

// `site` garante URLs absolutas no og:image e nas meta tags.
export default defineConfig({
  site: 'https://eucarollimah.com.br',
  // CSS dentro do HTML: um pedido a menos bloqueando o primeiro desenho
  build: { inlineStylesheets: 'always' },
  // adapter só para as rotas com `prerender = false` (src/pages/api/); o resto do site continua estático.
  // imageService passthrough: sem Cloudflare Images (o site usa só imagens prontas em public/).
  // sem sessões: evita o KV `SESSION` que o adapter cria sozinho no deploy
  session: false,
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [localized404, react()],
});