// A creator pede para publicar o portfólio com o link escolhido. Exige sessão; o servidor confere tudo de novo.
import type { APIRoute } from 'astro';
import { bancoConfigurado } from '@server/banco';
import { pedirPublicacao } from '@server/publicacao';
import { usuarioDoPedido } from '@server/usuario';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const usuario = await usuarioDoPedido(request);
  if (!usuario) return Response.json({ erro: 'Entre na sua conta para publicar.' }, { status: 401 });
  if (!bancoConfigurado()) return Response.json({ erro: 'A publicação ainda não está configurada.' }, { status: 503 });

  const corpo = (await request.json().catch(() => null)) as { slug?: string } | null;
  if (!corpo?.slug) return Response.json({ erro: 'Escolha o link do seu portfólio.' }, { status: 400 });

  const r = await pedirPublicacao(usuario.id, corpo.slug.trim().toLowerCase());
  return r.ok ? Response.json(r) : Response.json({ erro: r.erro }, { status: r.status });
};
