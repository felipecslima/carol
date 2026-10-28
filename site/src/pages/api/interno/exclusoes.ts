// Rotina diária de exclusão definitiva (DEV-203). Chamada pelo cron do Worker (src/server/worker.ts, `scheduled`) com
// a chave de admin; também dá para chamar à mão com `x-admin-token`.
import { ADMIN_TOKEN, CLOUDINARY_URL } from 'astro:env/server';
import type { APIRoute } from 'astro';
import { apagarUsuarioDoAuth, bancoConfigurado, consulta } from '@server/banco';
import { apagarPastaDoUsuario, lerConta } from '@server/cloudinary';
import { excluirContasVencidas } from '@server/exclusao';
import { mesmaChave } from '@server/usuario';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!ADMIN_TOKEN || !(await mesmaChave(request.headers.get('x-admin-token') ?? '', ADMIN_TOKEN)))
    return Response.json({ erro: 'Sem permissão.' }, { status: 403 });
  const conta = lerConta(CLOUDINARY_URL);
  if (!bancoConfigurado() || !conta)
    return Response.json({ erro: 'Banco ou Cloudinary não configurados.' }, { status: 503 });
  const r = await excluirContasVencidas({
    listarVencidas: async (limite) => {
      const { ok, dados } = await consulta<{ id: string }>(
        `profiles?exclusao_pedida_em=lt.${encodeURIComponent(limite.toISOString())}&select=id`,
      );
      return ok ? dados.map((d) => d.id) : null;
    },
    apagarArquivos: (id) => apagarPastaDoUsuario(conta, id),
    apagarUsuario: apagarUsuarioDoAuth,
    registrar: async (id, detalhes) => {
      await consulta('audit_log', { metodo: 'POST', corpo: { acao: 'conta_excluida', alvo: id, detalhes } });
    },
  });
  return Response.json(r, { status: r.ok ? 200 : 502 });
};
