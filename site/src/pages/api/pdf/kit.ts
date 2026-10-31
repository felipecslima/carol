// A creator pede o PDF do mídia kit (DEV-151): devolve um link de 1 hora para baixar. Se ainda não existe (ou se ela
// pediu um novo), gera antes pelo navegador da Cloudflare. Só para portfólio no ar: o PDF sai da versão publicada.
import type { APIRoute } from 'astro';
import { consulta } from '@server/banco';
import { gerarPdfDoKit, linkDoKit, origemDoSite } from '@server/pdf';
import { usuarioDoPedido } from '@server/usuario';

export const prerender = false;

const MENSAGENS = {
  'sem-navegador': 'O PDF automático ainda não está ligado. Use "Salvar como PDF" no mídia kit, por enquanto.',
  limite: 'Muitos PDFs gerados hoje. Tente de novo amanhã ou use "Salvar como PDF" no mídia kit.',
  pagina: 'Não conseguimos montar o PDF agora. Tente de novo em instantes.',
  guardar: 'Não conseguimos guardar o PDF agora. Tente de novo em instantes.',
} as const;

export const POST: APIRoute = async ({ request }) => {
  const usuario = await usuarioDoPedido(request);
  if (!usuario) return Response.json({ erro: 'Entre na sua conta para baixar o PDF.' }, { status: 401 });
  const corpo = (await request.json().catch(() => ({}))) as { novo?: boolean };
  const { ok, dados } = await consulta<{ id: string; slug: string | null; status: string }>(
    `projects?dono=eq.${usuario.id}&tipo=eq.site&select=id,slug,status`,
  );
  if (!ok) return Response.json({ erro: 'Não conseguimos falar com o servidor agora.' }, { status: 503 });
  const projeto = dados[0];
  if (!projeto?.slug || !['no_ar', 'edicao_travada'].includes(projeto.status))
    return Response.json({ erro: 'O PDF sai da versão publicada. Publique o portfólio primeiro.' }, { status: 409 });

  let link = corpo.novo ? null : await linkDoKit(projeto.id);
  if (!link) {
    const r = await gerarPdfDoKit(origemDoSite(request), projeto.slug, projeto.id);
    console.log(JSON.stringify({ tipo: 'pdf-do-kit', slug: projeto.slug, ...r }));
    if (!r.ok) return Response.json({ erro: MENSAGENS[r.motivo] }, { status: r.motivo === 'limite' ? 429 : 502 });
    link = await linkDoKit(projeto.id);
  }
  return link
    ? Response.json({ link })
    : Response.json({ erro: 'Não conseguimos achar o PDF agora. Tente de novo.' }, { status: 502 });
};
