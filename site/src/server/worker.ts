// Entrada do Worker de produção (wrangler.jsonc → main). O adapter do Cloudflare cuida das rotas SSR
// (src/pages/api/…); aqui entram as duas regras que o Worker antigo (worker.js) já tinha:
//  1. http:// e www. vão com 301 para https://eucarollimah.com.br, inclusive em arquivos estáticos;
//  2. página inexistente devolve a 404.html mais próxima (en/404.html, es/404.html), que o adapter não escolhe sozinho.
import astro from '@astrojs/cloudflare/entrypoints/server';
import { canonicalRedirect } from './redirects';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  ADMIN_TOKEN?: string;
}

export default {
  async fetch(request: Request, env: Env, context: Parameters<typeof astro.fetch>[2]): Promise<Response> {
    const redirect = canonicalRedirect(request);
    if (redirect) return redirect;

    const response = await astro.fetch(request, env, context);
    const isPage =
      (request.method === 'GET' || request.method === 'HEAD') && !new URL(request.url).pathname.startsWith('/api/');
    return response.status === 404 && isPage ? env.ASSETS.fetch(request) : response;
  },

  // cron diário (wrangler.jsonc → triggers): exclusão definitiva das contas com prazo vencido (DEV-203) e prazos de
  // guarda da Política (registros de acesso 6 meses, registro de ações 5 anos). Passa pelas rotas internas para usar
  // as mesmas variáveis e regras das outras rotas.
  async scheduled(_evento: unknown, env: Env, context: Parameters<typeof astro.fetch>[2]): Promise<void> {
    for (const rotina of ['exclusoes', 'limpeza']) {
      const pedido = new Request(`https://eucarollimah.com.br/api/interno/${rotina}`, {
        method: 'POST',
        headers: { 'x-admin-token': env.ADMIN_TOKEN ?? '' },
      });
      const resposta = await astro.fetch(pedido, env, context);
      console.log(rotina, resposta.status, await resposta.text());
    }
  },
};
