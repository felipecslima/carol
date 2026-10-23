# server/

Código que só roda no Worker: Supabase com service role, Slack, WhatsApp, IA, PDF, redirecionamentos.

**Regra:** segredos (`astro:env/server`) só são lidos aqui e nas rotas SSR. Nunca importar este diretório de `app/` nem de `blocks/`.
