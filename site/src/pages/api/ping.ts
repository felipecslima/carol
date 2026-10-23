// Rota de teste do servidor (SSR no Worker): confirma que o adapter do Cloudflare está funcionando.
// Sai quando houver a primeira rota de API de verdade.
export const prerender = false;

export function GET() {
  return Response.json({ ok: true, hora: new Date().toISOString() });
}
