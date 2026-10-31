// A creator pede para liberar a edição depois do prazo (DEV-193): assinatura mensal, anual ou 30 dias avulsos.
// Abre o pedido; a equipe manda o link de pagamento e marca como pago no admin.
import type { APIRoute } from 'astro';
import { ehPlano } from '@lib/planos';
import { bancoConfigurado } from '@server/banco';
import { pedirEdicao } from '@server/publicacao';
import { usuarioDoPedido } from '@server/usuario';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const usuario = await usuarioDoPedido(request);
  if (!usuario) return Response.json({ erro: 'Entre na sua conta.' }, { status: 401 });
  if (!bancoConfigurado()) return Response.json({ erro: 'Os pedidos ainda não estão configurados.' }, { status: 503 });
  const corpo = (await request.json().catch(() => null)) as { plano?: string } | null;
  if (!ehPlano(corpo?.plano)) return Response.json({ erro: 'Escolha uma forma de liberar a edição.' }, { status: 400 });
  const r = await pedirEdicao(usuario.id, corpo.plano);
  return r.ok ? Response.json(r) : Response.json({ erro: r.erro }, { status: r.status });
};
