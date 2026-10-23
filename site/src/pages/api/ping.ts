// Rota de teste do servidor (SSR no Worker): confirma que o adapter do Cloudflare está funcionando e, só em
// desenvolvimento, quais segredos estão configurados (true/false, nunca o valor).
// Sai quando houver a primeira rota de API de verdade.
import { AI_API_KEY, CLOUDINARY_URL, SLACK_WEBHOOK_URL, SUPABASE_SERVICE_ROLE_KEY, WHATSAPP_TOKEN } from 'astro:env/server';

export const prerender = false;

export function GET() {
  const body: Record<string, unknown> = { ok: true, hora: new Date().toISOString() };
  if (import.meta.env.DEV) {
    body.segredos = Object.fromEntries(Object.entries({ SUPABASE_SERVICE_ROLE_KEY, CLOUDINARY_URL, SLACK_WEBHOOK_URL, WHATSAPP_TOKEN, AI_API_KEY })
      .map(([nome, valor]) => [nome, Boolean(valor)]));
  }
  return Response.json(body);
}
