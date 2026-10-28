import { renameSync, rmdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import cloudflare from '@astrojs/cloudflare';
import { defineConfig, envField } from 'astro/config';

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

// `client:carregada`: hidrata depois do evento load (página publicada, DEV-146; ver src/diretivas/carregada.ts)
const diretivaCarregada = {
  name: 'client-carregada',
  hooks: {
    'astro:config:setup': ({ addClientDirective }) =>
      addClientDirective({ name: 'carregada', entrypoint: './src/diretivas/carregada.ts' }),
  },
};

// `site` garante URLs absolutas no og:image e nas meta tags.
export default defineConfig({
  site: 'https://eucarollimah.com.br',
  // CSS dentro do HTML: um pedido a menos bloqueando o primeiro desenho
  build: { inlineStylesheets: 'always' },
  // adapter só para as rotas com `prerender = false` (src/pages/api/); o resto do site continua estático.
  // imageService passthrough: sem Cloudflare Images (o site usa só imagens prontas em public/).
  // Variáveis do produto (lidas com `astro:env/server` e `astro:env/client`). Segredos são só do servidor: o
  // Astro recusa importá-los no navegador. Todas opcionais por enquanto, porque as contas ainda não existem;
  // quando uma virar obrigatória, tirar o `optional`. Valores em .env (local) e `wrangler secret put` (produção).
  env: {
    schema: {
      PUBLIC_SUPABASE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      SUPABASE_SERVICE_ROLE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CLOUDINARY_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      ADMIN_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      SLACK_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      WHATSAPP_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      AI_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  // a barra do Astro (só em `npm run dev`) cobria os botões de baixo do editor no celular
  devToolbar: { enabled: false },
  // sem sessões: evita o KV `SESSION` que o adapter cria sozinho no deploy
  session: false,
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [localized404, diretivaCarregada, react()],
});