// Devolve a assinatura para o celular enviar uma foto ou vídeo direto ao Cloudinary (pasta própria da creator).
// ATENÇÃO: ainda sem login, qualquer aparelho pode pedir assinatura. Antes de publicar, exigir sessão (E3).
import { CLOUDINARY_URL } from 'astro:env/server';
import type { APIRoute } from 'astro';
import { assinar, FORMATOS, lerConta, pastaValida, type TipoDeArquivo } from '@server/cloudinary';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const conta = lerConta(CLOUDINARY_URL);
  if (!conta) return Response.json({ erro: 'Envio de arquivos ainda não configurado.' }, { status: 503 });

  const corpo = (await request.json().catch(() => null)) as { tipo?: string; pasta?: string } | null;
  const tipo = corpo?.tipo as TipoDeArquivo | undefined;
  if (!tipo || !(tipo in FORMATOS) || !corpo?.pasta || !pastaValida(corpo.pasta))
    return Response.json({ erro: 'Pedido inválido.' }, { status: 400 });

  const params = {
    allowed_formats: FORMATOS[tipo],
    folder: `creators/${corpo.pasta}`,
    timestamp: Math.floor(Date.now() / 1000),
  };
  return Response.json({
    nome: conta.nome,
    chave: conta.chave,
    tipo,
    params,
    assinatura: await assinar(params, conta.segredo),
  });
};
