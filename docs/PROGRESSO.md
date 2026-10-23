# Progresso do Portfólio Creator

Diário do projeto e memória entre sessões. Toda IA que trabalhar aqui lê a seção "Onde parei" antes de começar e atualiza este arquivo ao fim de cada tarefa e antes de encerrar a sessão. Regras em `docs/00-guia-ia.md`.

## Onde parei

- **Fase:** E1 (fundação) em andamento.
- **Tarefa atual:** `DEV-003` pronta, esperando aprovação. DEV-001 e DEV-002 commitadas (`ab7d404`, `a842346`).
- **Próximo passo:** depois do ok e do commit da DEV-002, plano da `DEV-004` (estrutura de pastas).
- **Git:** branch `dev`; commits `Setup:` já feitos (página de vendas, docs, ferramentas).
- **OCR:** código removido por ora (pedido do usuário); continua no commit `6ecf8fc`. A spec `docs/04-ocr-prints.md` fica.
- **Bloqueios:** preços dos planos, limites do Cloudinary e CNPJ/Termos ainda a definir (não bloqueiam a E1 a E7).

## Esperando aprovação

- **DEV-003:** `env.schema` no `astro.config.mjs` (2 públicas, 5 segredos, todas opcionais), `.env.example`, `.dev.vars.example`, `.gitignore` para `.env.*` e `.dev.vars` (mantendo `.env.example` e `.env.production`), `/api/ping` mostra `true`/`false` dos segredos só em dev, `e2e/segredos.spec.ts` (nenhum nome de segredo no build do navegador) e seção no `ARQUITETURA.md`. Testado no dev server com um segredo falso. Nenhuma chave real criada nem enviada ao Cloudflare.

## Diário

### 23/out/2026 (tarde)
- `dev` criada, 3 commits `Setup:`; DEV-001 implementada.

### 23/out/2026
- Planejamento fechado: PRD, construtor, backlog de desenvolvimento, especificação de OCR e este guia, em `docs/`.
- Versão 1 sem leitura de prints, sem IA no assistente, sem login Google e sem gateway de pagamento.
- Nenhum código do produto escrito ainda.

## Publicações

Nenhuma ainda.
