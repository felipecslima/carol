// Recebe erros do navegador (DEV-233) e grava no log do Worker. Público (o erro pode acontecer antes de entrar), por
// isso só aceita um corpo pequeno e com os campos esperados.
import type { APIRoute } from 'astro';

export const prerender = false;

const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : undefined);

export const POST: APIRoute = async ({ request }) => {
  const bruto = await request.text().catch(() => '');
  if (!bruto || bruto.length > 8000) return new Response(null, { status: 400 });
  let corpo: Record<string, unknown>;
  try {
    corpo = JSON.parse(bruto) as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 400 });
  }
  const mensagem = texto(corpo.mensagem, 500);
  if (!mensagem) return new Response(null, { status: 400 });
  console.error(
    JSON.stringify({
      tipo: 'erro-no-navegador',
      mensagem,
      pilha: texto(corpo.pilha, 3000),
      pagina: texto(corpo.pagina, 200),
      navegador: texto(corpo.navegador, 200),
    }),
  );
  return new Response(null, { status: 204 });
};
