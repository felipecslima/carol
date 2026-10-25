// Botão Pago (hoje chamado à mão pela equipe; depois pelo card do Slack, DEV-161). Protegido por uma chave só nossa.
import { ADMIN_TOKEN } from 'astro:env/server';
import type { APIRoute } from 'astro';
import { marcarComoPago } from '@server/publicacao';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!ADMIN_TOKEN || request.headers.get('x-admin-token') !== ADMIN_TOKEN)
    return Response.json({ erro: 'Sem permissão.' }, { status: 403 });
  const corpo = (await request.json().catch(() => null)) as { slug?: string } | null;
  if (!corpo?.slug) return Response.json({ erro: 'Informe o link do portfólio.' }, { status: 400 });
  const r = await marcarComoPago(corpo.slug.trim().toLowerCase());
  return Response.json(r, { status: r.ok ? 200 : 404 });
};
