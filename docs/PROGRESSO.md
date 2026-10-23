# Progresso do Portfólio Creator

Diário do projeto e memória entre sessões. Toda IA que trabalhar aqui lê a seção "Onde parei" antes de começar e atualiza este arquivo ao fim de cada tarefa e antes de encerrar a sessão. Regras em `docs/00-guia-ia.md`.

## Onde parei

- **Fase:** E1 (fundação) em andamento.
- **Tarefa atual:** tudo o que não depende de acesso externo está feito até a DEV-150 (assistente, editor, números, revisão, mídia kit). Faltam só itens que exigem as contas (Supabase, Cloudflare) ou decisões visuais.
- **Modo de trabalho:** o usuário autorizou seguir e commitar na `dev` sem parar, até precisar dele. Nada vai para a `main` nem para produção.
- **Próximo passo (precisa do usuário):** (1) `npx wrangler login` para a DEV-006; (2) `project-ref` de um projeto Supabase novo para a E2 em diante (login, salvar na nuvem, publicar `/c/slug`, pedidos); (3) olhar o editor no celular (`/app/novo/` → `/app/editor/`), o modelo Nuvem (DEV-069) e o mídia kit e dizer o que ajustar; (4) cadastro do Cloudinary no servidor para o upload de fotos e vídeos (E9). Sem isso o que resta é DEV-089/102/141 parciais.
- **Git:** branch `dev`; 3 commits `Setup:` e DEV-001 a DEV-005 commitadas.
- **OCR:** código removido por ora (pedido do usuário); continua no commit `6ecf8fc`. A spec `docs/04-ocr-prints.md` fica.
- **Atenção (upload):** `/api/upload/assinatura` ainda não exige login; qualquer aparelho pode pedir assinatura. Exigir sessão (E3) antes de publicar. `CLOUDINARY_URL` já foi gravado como segredo do Worker `carol` no Cloudflare (24/out/2026, `wrangler secret put`); o site no ar seguiu normal (home 200, www 301).
- **Privacidade:** o `SeoHead` ganhou a opção `analytics` (padrão ligado, o site da Carol não mudou); as páginas de `/app` passam `analytics={false}`, então a Amplitude com Session Replay não roda onde a creator digita dados dela. Se um dia houver analytics no app, só com consentimento.
- **Bloqueios:** preços dos planos, limites do Cloudinary e CNPJ/Termos ainda a definir (não bloqueiam a E1 a E7).

## Esperando aprovação

- **Banco (E2) escrito, não aplicado:** `supabase/migrations/` tem as tabelas `profiles`, `projects`, `media`, `orders`, `premium_grants`, `brand_links`, `brand_opens`, `events`, `audit_log`, `waitlist` com RLS, validadas em PGlite. Decisões: o papel da equipe fica em `app_metadata` do Auth (só o servidor grava), não em `profiles`; estado, link e versão publicada do projeto só o servidor muda (gatilho); 1 site e 1 mídia kit por creator. Aplicar no projeto novo quando existir (DEV-010).

- **Mídia kit em 1 página A4 (`/app/midia-kit/`)**: primeira versão a partir dos mesmos blocos, com marca d'água de teste e "Salvar como PDF" pela impressão do navegador. Precisa do seu olho: a ordem das seções na folha e o tamanho do texto.

- **Editor (`/app/editor/`, funciona em `npm run dev` e no build):** toque no bloco seleciona, toque de novo edita; gavetas de Seções, Adicionar e Estilo; desfazer/refazer; salvo no aparelho. Vale abrir no celular e testar. Pendências visuais conhecidas: miniaturas na biblioteca de blocos, envio de foto/vídeo (hoje só endereço), `viewport-fit=cover` para as áreas seguras do iPhone (o `SeoHead` do site tem o viewport fixo).

- **DEV-069 (visual do modelo Nuvem):** os 8 blocos (2 variações cada) e o modelo Nuvem com 3 paletas (lavanda, pêssego, menta) renderizam em `/app/blocos/?paleta=0&modo=claro` (só no `npm run dev`). Referência: `prototipo/ModeloNuvem` do handoff. **O usuário precisa olhar e aprovar** antes dos modelos Clean, Pop Color, Casual e Glow Rosé (DEV-070 a 073). Pontos a avaliar: paleta Pêssego sai com botão marrom (a regra Fidelity escurece o tom 40); capa e vídeos sem foto mostram "Sua foto"/"Seu vídeo"; as variações escolhidas são as duas primeiras de cada bloco no `docs/02-construtor.md`.

## Diário

### 23/out/2026 (tarde)
- `dev` criada, 3 commits `Setup:`; DEV-001 implementada.

### 23/out/2026
- Planejamento fechado: PRD, construtor, backlog de desenvolvimento, especificação de OCR e este guia, em `docs/`.
- Versão 1 sem leitura de prints, sem IA no assistente, sem login Google e sem gateway de pagamento.
- Nenhum código do produto escrito ainda.

## Publicações

Nenhuma ainda.
