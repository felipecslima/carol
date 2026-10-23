# Progresso do Portfólio Creator

Diário do projeto e memória entre sessões. Toda IA que trabalhar aqui lê a seção "Onde parei" antes de começar e atualiza este arquivo ao fim de cada tarefa e antes de encerrar a sessão. Regras em `docs/00-guia-ia.md`.

## Onde parei

- **Fase:** E1 (fundação) em andamento.
- **Tarefa atual:** `DEV-002` pronta (local), esperando aprovação. DEV-001 commitada (`ab7d404`).
- **Próximo passo:** depois do ok e do commit da DEV-002, plano da `DEV-003` (variáveis de ambiente e segredos).
- **Git:** branch `dev`; commits `Setup:` já feitos (página de vendas, docs, ferramentas).
- **OCR:** código removido por ora (pedido do usuário); continua no commit `6ecf8fc`. A spec `docs/04-ocr-prints.md` fica.
- **Bloqueios:** preços dos planos, limites do Cloudinary e CNPJ/Termos ainda a definir (não bloqueiam a E1 a E7).

## Esperando aprovação

- **DEV-002:** `@astrojs/cloudflare` (`output: 'static'`, `session: false`, imagens passthrough). `src/server/worker.ts` assume o lugar do `worker.js` (redirects www/http → https com teste unitário, 404 por idioma, SSR para o adapter). Rota de teste `/api/ping`. Verificado só local (`wrangler dev`): estáticos, `/app`, redirects em todos os caminhos, 404 pt/en/es, `_headers`. Testes: Vitest 4/4, Playwright 2/2. `scripts/media-kit-pdf.mjs` agora lê `dist/client/`. **Nada publicado.** Diferença no HTML: o CSS ganhou prefixos `-webkit-` (efeito do adapter), sem mudança visual. **Antes de publicar na `main`:** conferir no painel do Cloudflare o comando de build e o deploy, porque a pasta servida agora é `dist/client/`.

## Diário

### 23/out/2026 (tarde)
- `dev` criada, 3 commits `Setup:`; DEV-001 implementada.

### 23/out/2026
- Planejamento fechado: PRD, construtor, backlog de desenvolvimento, especificação de OCR e este guia, em `docs/`.
- Versão 1 sem leitura de prints, sem IA no assistente, sem login Google e sem gateway de pagamento.
- Nenhum código do produto escrito ainda.

## Publicações

Nenhuma ainda.
