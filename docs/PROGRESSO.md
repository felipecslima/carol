# Progresso do Portfólio Creator

Diário do projeto e memória entre sessões. Toda IA que trabalhar aqui lê a seção "Onde parei" antes de começar e atualiza este arquivo ao fim de cada tarefa e antes de encerrar a sessão. Regras em `docs/00-guia-ia.md`.

## Onde parei

- **Fase:** E1 (fundação) em andamento.
- **Tarefa atual:** E7 e E8 quase completas: assistente (`/app/novo/`) → editor (`/app/editor/`) funcionam de ponta a ponta no celular, salvando no aparelho. Faltam DEV-089 (outros modelos/formato), DEV-102 (pedir vídeos e números no assistente). DEV-069 aguarda aprovação visual.
- **Modo de trabalho:** o usuário autorizou seguir e commitar na `dev` sem parar, até precisar dele. Nada vai para a `main` nem para produção.
- **Próximo passo:** E10 (formulário de números, DEV-130/131), DEV-140 (revisão final), DEV-150 (rota de impressão do mídia kit). Dependem de acesso: `DEV-006` (`wrangler login`), E2 (projeto Supabase novo), upload de mídia (E9, precisa do Cloudinary no servidor).
- **Git:** branch `dev`; 3 commits `Setup:` e DEV-001 a DEV-005 commitadas.
- **OCR:** código removido por ora (pedido do usuário); continua no commit `6ecf8fc`. A spec `docs/04-ocr-prints.md` fica.
- **Atenção (privacidade):** o `SeoHead` carrega a Amplitude com Session Replay em toda página, inclusive `/app`. Antes de haver login e dados de creators, tirar a Amplitude de `/app` (ou pedir consentimento).
- **Bloqueios:** preços dos planos, limites do Cloudinary e CNPJ/Termos ainda a definir (não bloqueiam a E1 a E7).

## Esperando aprovação

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
