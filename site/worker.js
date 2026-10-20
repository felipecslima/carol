// Um endereço só para o Google: http:// e www. vão com 301 para https://eucarollimah.com.br.
// O resto é o site estático de dist/ (com o _headers e a 404.html aplicados pelo ASSETS).
const HOST = 'eucarollimah.com.br';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === `www.${HOST}` || (url.hostname === HOST && url.protocol === 'http:')) {
      url.hostname = HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
