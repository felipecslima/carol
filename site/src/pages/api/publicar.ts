// A creator pede para publicar o portfólio com o link escolhido. Exige sessão; o servidor confere tudo de novo.
import type { APIRoute } from 'astro';
import { bancoConfigurado } from '@server/banco';
import { ehPlano } from '@lib/planos';
import { contextoDe, origemDoSite, regerarKitDepois } from '@server/pdf';
import { pedirPublicacao } from '@server/publicacao';
import { usuarioDoPedido } from '@server/usuario';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const usuario = await usuarioDoPedido(request);
  if (!usuario) return Response.json({ erro: 'Entre na sua conta para publicar.' }, { status: 401 });
  if (!bancoConfigurado()) return Response.json({ erro: 'A publicação ainda não está configurada.' }, { status: 503 });

  const corpo = (await request.json().catch(() => null)) as { slug?: string; plano?: string } | null;
  if (!corpo?.slug) return Response.json({ erro: 'Escolha o link do seu portfólio.' }, { status: 400 });

  const plano = ehPlano(corpo.plano) ? corpo.plano : 'pdf';
  const r = await pedirPublicacao(usuario.id, corpo.slug.trim().toLowerCase(), plano);
  // foi ao ar: o PDF do mídia kit sai da versão nova, em segundo plano (DEV-153)
  if (r.ok && r.projetoId) regerarKitDepois(contextoDe(locals), origemDoSite(request), r.slug, r.projetoId);
  return r.ok ? Response.json(r) : Response.json({ erro: r.erro }, { status: r.status });
};
