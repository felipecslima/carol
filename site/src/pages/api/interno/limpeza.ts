// Rotina diária de prazos de guarda (Política de Privacidade, item 4): apaga registros de acesso com mais de 6 meses e
// o registro de ações da equipe com mais de 5 anos. Chamada pelo cron do Worker (src/server/worker.ts) com a chave de
// admin, junto com a exclusão definitiva.
import { ADMIN_TOKEN } from 'astro:env/server';
import type { APIRoute } from 'astro';
import { bancoConfigurado } from '@server/banco';
import { apagarRegistrosVencidos } from '@server/acessos';
import { mesmaChave } from '@server/usuario';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!ADMIN_TOKEN || !(await mesmaChave(request.headers.get('x-admin-token') ?? '', ADMIN_TOKEN)))
    return Response.json({ erro: 'Sem permissão.' }, { status: 403 });
  if (!bancoConfigurado()) return Response.json({ erro: 'Banco não configurado.' }, { status: 503 });
  const r = await apagarRegistrosVencidos();
  return Response.json(r, { status: r.ok ? 200 : 502 });
};
