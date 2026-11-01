// Registro de acesso à conta (Marco Civil da Internet, art. 15): o app chama uma vez por sessão do navegador, com a
// pessoa logada. Guarda só conta, IP e hora (server/acessos.ts); ninguém de fora do servidor lê.
import type { APIRoute } from 'astro';
import { bancoConfigurado } from '@server/banco';
import { ipDoPedido, registrarAcesso } from '@server/acessos';
import { usuarioDoPedido } from '@server/usuario';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const usuario = await usuarioDoPedido(request);
  if (!usuario) return new Response(null, { status: 401 });
  if (!bancoConfigurado()) return new Response(null, { status: 503 });
  return new Response(null, { status: (await registrarAcesso(usuario.id, ipDoPedido(request))) ? 204 : 502 });
};
