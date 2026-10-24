// Apaga um arquivo da própria creator no Cloudinary (aba Mídias, exclusão de conta). Exige sessão e confere que o
// arquivo está na pasta dela.
import { CLOUDINARY_URL } from 'astro:env/server';
import type { APIRoute } from 'astro';
import { apagarArquivo, arquivoDoUsuario, lerConta } from '@server/cloudinary';
import { usuarioDoPedido } from '@server/usuario';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const usuario = await usuarioDoPedido(request);
  if (!usuario) return Response.json({ erro: 'Entre na sua conta.' }, { status: 401 });
  const conta = lerConta(CLOUDINARY_URL);
  if (!conta) return Response.json({ erro: 'Envio de arquivos ainda não configurado.' }, { status: 503 });

  const corpo = (await request.json().catch(() => null)) as { publicId?: string; tipo?: string } | null;
  if (
    !corpo?.publicId ||
    (corpo.tipo !== 'image' && corpo.tipo !== 'video') ||
    !arquivoDoUsuario(corpo.publicId, usuario.id)
  )
    return Response.json({ erro: 'Pedido inválido.' }, { status: 400 });

  const ok = await apagarArquivo(conta, corpo.publicId, corpo.tipo);
  return Response.json({ ok }, { status: ok ? 200 : 502 });
};
