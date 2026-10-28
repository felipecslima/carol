// Devolve a assinatura para o celular enviar uma foto ou vídeo direto ao Cloudinary, na pasta da própria creator.
// Exige sessão: o servidor confere o token e decide a pasta (`creators/<id do usuário>`).
import { CLOUDINARY_URL } from 'astro:env/server';
import type { APIRoute } from 'astro';
import { problemaDeEspaco } from '@lib/limites';
import { consulta } from '@server/banco';
import { assinar, FORMATOS, lerConta, pastaDoUsuario, type TipoDeArquivo } from '@server/cloudinary';
import { usuarioDoPedido } from '@server/usuario';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const usuario = await usuarioDoPedido(request);
  if (!usuario) return Response.json({ erro: 'Entre na sua conta para enviar fotos e vídeos.' }, { status: 401 });

  const conta = lerConta(CLOUDINARY_URL);
  if (!conta) return Response.json({ erro: 'Envio de arquivos ainda não configurado.' }, { status: 503 });

  const corpo = (await request.json().catch(() => null)) as { tipo?: string } | null;
  const tipo = corpo?.tipo as TipoDeArquivo | undefined;
  if (!tipo || !(tipo in FORMATOS)) return Response.json({ erro: 'Pedido inválido.' }, { status: 400 });

  // biblioteca cheia: não assina mais envios (DEV-234); se o banco não responder, deixa enviar (o trigger do banco
  // também barra o registro)
  const midias = await consulta<{ bytes: number }>(`media?dono=eq.${usuario.id}&select=bytes`);
  if (midias.ok) {
    const problema = problemaDeEspaco(
      midias.dados.length,
      midias.dados.reduce((t, m) => t + (m.bytes ?? 0), 0),
    );
    if (problema) return Response.json({ erro: problema }, { status: 429 });
  }

  const params = {
    allowed_formats: FORMATOS[tipo],
    folder: pastaDoUsuario(usuario.id),
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
