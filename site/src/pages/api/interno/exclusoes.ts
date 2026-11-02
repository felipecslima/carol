// Rotina diária de exclusão definitiva (DEV-203). Chamada pelo cron do Worker (src/server/worker.ts, `scheduled`) com
// a chave de admin; também dá para chamar à mão com `x-admin-token`.
import { ADMIN_TOKEN, CLOUDINARY_URL } from 'astro:env/server';
import type { APIRoute } from 'astro';
import { apagarArquivosDoStorage, apagarUsuarioDoAuth, bancoConfigurado, consulta } from '@server/banco';
import { apagarPastaDoUsuario, lerConta } from '@server/cloudinary';
import { excluirContasVencidas } from '@server/exclusao';
import { BALDE_DOS_KITS, caminhoDoKit } from '@server/pdf';
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
    pastaEmUsoPorOutros: async (id) => {
      const r = await consulta<boolean>('rpc/pasta_em_uso_por_outros', {
        metodo: 'POST',
        corpo: { p_dono: id },
        retornar: true,
      });
      const valor = r.dados as unknown;
      return r.ok && typeof valor === 'boolean' ? valor : null;
    },
    // PDFs do mídia kit no Storage (um por projeto) e depois a pasta no Cloudinary; os projetos ainda existem aqui
    apagarArquivos: async (id) => {
      const projetos = await consulta<{ id: string }>(`projects?dono=eq.${id}&select=id`);
      if (!projetos.ok) return false;
      const pdfs = projetos.dados.map((p) => caminhoDoKit(p.id));
      if (!(await apagarArquivosDoStorage(BALDE_DOS_KITS, pdfs))) return false;
      return apagarPastaDoUsuario(conta, id);
    },
    apagarUsuario: apagarUsuarioDoAuth,
    registrar: async (id, detalhes) => {
      const bloqueio = 'bloqueada' in detalhes;
      const acao = bloqueio ? 'exclusao_bloqueada' : 'conta_excluida';
      // a rotina roda todo dia: o bloqueio de uma conta entra no registro uma vez só, não a cada dia
      if (bloqueio) {
        const ja = await consulta<{ id: number }>(`audit_log?acao=eq.${acao}&alvo=eq.${id}&select=id&limit=1`);
        if (ja.ok && ja.dados.length > 0) return;
      }
      await consulta('audit_log', { metodo: 'POST', corpo: { acao, alvo: id, detalhes } });
    },
  });
  return Response.json(r, { status: r.ok ? 200 : 502 });
};
