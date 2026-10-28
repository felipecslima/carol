// Erros do servidor (DEV-233): exceção não tratada numa rota vira um registro no log do Worker (com rota e pilha) e
// uma resposta em português, em vez da página de erro crua. Vale para as rotas SSR (API, /c/); as páginas estáticas
// não passam por aqui em produção.
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (contexto, proximo) => {
  try {
    return await proximo();
  } catch (erro) {
    const e = erro as Error;
    console.error(
      JSON.stringify({
        tipo: 'erro-no-servidor',
        rota: contexto.url.pathname,
        metodo: contexto.request.method,
        mensagem: String(e?.message ?? erro).slice(0, 500),
        pilha: e?.stack?.slice(0, 3000),
      }),
    );
    if (contexto.url.pathname.startsWith('/api/'))
      return Response.json({ erro: 'Algo deu errado do nosso lado. Tente de novo em instantes.' }, { status: 500 });
    return new Response('Algo deu errado do nosso lado. Recarregue a página em instantes.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
});
