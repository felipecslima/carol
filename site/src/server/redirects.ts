// Um endereço só para o Google: http:// e www. vão com 301 para https://eucarollimah.com.br.
const HOST = 'eucarollimah.com.br';

/** Resposta 301 se o pedido veio de www ou de http no domínio principal; `undefined` no resto. */
export function canonicalRedirect(request: Request): Response | undefined {
  const url = new URL(request.url);
  if (url.hostname === `www.${HOST}` || (url.hostname === HOST && url.protocol === 'http:')) {
    url.hostname = HOST;
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
}
