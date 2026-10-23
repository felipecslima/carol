# Progresso do Portfólio Creator

Diário do projeto e memória entre sessões. Toda IA que trabalhar aqui lê a seção "Onde parei" antes de começar e atualiza este arquivo ao fim de cada tarefa e antes de encerrar a sessão. Regras em `docs/00-guia-ia.md`.

## Onde parei

- **Fase:** E1 (fundação) em andamento.
- **Tarefa atual:** `DEV-001` pronta, esperando aprovação.
- **Próximo passo:** depois do ok e do commit da DEV-001, plano da `DEV-002` (adapter do Cloudflare; mexe no deploy do site em produção, pedir confirmação).
- **Git:** branch `dev`; commits `Setup:` já feitos (página de vendas, docs, ferramentas).
- **OCR:** código removido por ora (pedido do usuário); continua no commit `6ecf8fc`. A spec `docs/04-ocr-prints.md` fica.
- **Bloqueios:** preços dos planos, limites do Cloudinary e CNPJ/Termos ainda a definir (não bloqueiam a E1 a E7).

## Esperando aprovação

- **DEV-001:** `@astrojs/react` instalado; `/app` abre tela React (ilha `client:only`, noindex, fora do sitemap, tema claro/escuro). Páginas do site idênticas no `dist/`. `playwright.config.ts` e `e2e/app.spec.ts` criados (2 testes passando). OCR removido (`site/ocr`, `ocr-teste`, scripts, `tesseract.js`); `test:ocr` virou `test` (Vitest, sem testes ainda).

## Diário

### 23/out/2026 (tarde)
- `dev` criada, 3 commits `Setup:`; DEV-001 implementada.

### 23/out/2026
- Planejamento fechado: PRD, construtor, backlog de desenvolvimento, especificação de OCR e este guia, em `docs/`.
- Versão 1 sem leitura de prints, sem IA no assistente, sem login Google e sem gateway de pagamento.
- Nenhum código do produto escrito ainda.

## Publicações

Nenhuma ainda.
