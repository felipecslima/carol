// Uma marca abriu o link com código (DEV-181 a 184). Só conta com pedido vindo de navegador de verdade (a página
// manda depois de 2,5 s à vista, então a prévia de robôs do WhatsApp e do Instagram não chega aqui) e nunca conta a
// própria creator.
import type { APIRoute } from 'astro';
import { consulta } from '@server/banco';
import { linkDaMarca, paginaNoAr } from '@server/pagina';
import { usuarioDoPedido } from '@server/usuario';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const corpo = (await request.json().catch(() => null)) as { slug?: string; codigo?: string } | null;
  if (!corpo?.slug || !corpo.codigo) return Response.json({ ok: false }, { status: 400 });
  const pagina = await paginaNoAr(corpo.slug.toLowerCase());
  const marca = pagina ? await linkDaMarca(pagina.projetoId, corpo.codigo.toLowerCase()) : null;
  if (!pagina || !marca) return Response.json({ ok: false }, { status: 404 });

  const quem = await usuarioDoPedido(request);
  if (quem?.id === pagina.dono) return Response.json({ ok: true, contou: false });

  const r = await consulta('brand_opens', { metodo: 'POST', corpo: { link_id: marca.id } });
  return Response.json({ ok: r.ok, contou: r.ok });
};
