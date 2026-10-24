# Progresso do Portfólio Creator

Diário do projeto e memória entre sessões. Toda IA que trabalhar aqui lê a seção "Onde parei" antes de começar e atualiza este arquivo ao fim de cada tarefa e antes de encerrar a sessão. Regras em `docs/00-guia-ia.md`.

## Onde parei

- **Fase:** E1 (fundação) em andamento.
- **Tarefa atual:** área da creator completa (sem publicação). Resta: SMTP para o e-mail trazer o código, rotina de exclusão no Cloudinary, outros modelos (aguardam o Nuvem), publicação (`/c/slug`, pedidos, Slack, WhatsApp).
- **Modo de trabalho:** o usuário autorizou seguir e commitar na `dev` sem parar, até precisar dele. Nada vai para a `main` nem para produção.
- **Próximo passo (precisa do usuário):** (1) `npx wrangler login` para a DEV-006; (2) `project-ref` de um projeto Supabase novo para a E2 em diante (login, salvar na nuvem, publicar `/c/slug`, pedidos); (3) olhar o editor no celular (`/app/novo/` → `/app/editor/`), o modelo Nuvem (DEV-069) e o mídia kit e dizer o que ajustar; (4) cadastro do Cloudinary no servidor para o upload de fotos e vídeos (E9). Sem isso o que resta é DEV-089/102/141 parciais.
- **Git:** branch `dev`; 3 commits `Setup:` e DEV-001 a DEV-005 commitadas.
- **OCR:** código removido por ora (pedido do usuário); continua no commit `6ecf8fc`. A spec `docs/04-ocr-prints.md` fica.
- **Atenção (upload):** `/api/upload/assinatura` ainda não exige login; qualquer aparelho pode pedir assinatura. Exigir sessão (E3) antes de publicar. `CLOUDINARY_URL` já foi gravado como segredo do Worker `carol` no Cloudflare (24/out/2026, `wrangler secret put`); o site no ar seguiu normal (home 200, www 301).
- **Privacidade:** o `SeoHead` ganhou a opção `analytics` (padrão ligado, o site da Carol não mudou); as páginas de `/app` passam `analytics={false}`, então a Amplitude com Session Replay não roda onde a creator digita dados dela. Se um dia houver analytics no app, só com consentimento.
- **Bloqueios:** preços dos planos, limites do Cloudinary e CNPJ/Termos ainda a definir (não bloqueiam a E1 a E7).

## Esperando aprovação

- **Onda 1 do template (proposta em `docs/PROPOSTA-TEMPLATE-2026-10-24.md`):** 3 blocos novos (**Em 1 olhada**, **Por que eu**, **Como eu trabalho**), variação de vídeos **"um grande e os outros pequenos"** (o primeiro toca com controles), **formatos com "O que inclui", prazo e "Valor sob consulta"** quando não há preço, e **botão de WhatsApp fixo no celular** (aparece depois da capa e some perto do Contato; no modo Ver do editor sobe para não cobrir "Voltar a editar"). Projeto de exemplo na ordem de narrativa: capa, em 1 olhada, vídeos, números, por que eu, sobre, público, formatos, como eu trabalho, contato (projetos já salvos não mudam). Blocos podem nascer com dados iniciais (`inicial` no registro). O assistente preenche o "Em 1 olhada" só com o que ela respondeu. O mídia kit ganhou o resumo e deixa "Por que eu" e "Como eu trabalho" só para o link. **Mudança de escopo em relação ao PRD (8 blocos): agora 11.** O texto das etapas de "Como eu trabalho" é um modelo genérico sem prazos, não marcado como exemplo: confira o tom. Faltam da proposta: modelo Editorial, ondas 2 e 3, correções do mídia kit (texto de ~9 px), publicar o botão fixo na página `/c/slug` (E11).

- **Seções sem cantos arredondados (a pedido):** o hero de fundo e a faixa de Contato agora vão de lado a lado, com cantos retos (antes a cor da página aparecia atrás de uma curva); o contorno de seleção das seções no editor é reto e desenhado por cima (não é mais coberto por conteúdo de largura total). Cartões de conteúdo dentro das seções continuam arredondados. A lista de marcas virou etiquetas compactas que quebram de linha (342 px no desktop, antes mais de 2000).

- **Capa com foto ou vídeo de fundo:** nova variação da Capa, "Foto ou vídeo de fundo" (em Layout, no editor). Ocupa a capa inteira, com véu escuro para o texto ficar legível; a creator envia uma imagem e/ou um vídeo (o vídeo toca sem som, em loop, e o quadro dele vira a imagem de fundo). Respeita "reduzir movimento" (mostra só a imagem) e tem botão "Pausar vídeo". No editor o vídeo não toca (só a imagem); toca no modo Ver. Os campos de cada layout aparecem só no layout certo (`Campo.soNasVariacoes`). **Pendência para a publicação (E11):** o botão de pausa é um `onClick` de React; a página publicada gerada no servidor precisa hidratar esse bloco ou ganhar um script mínimo. Teste novo anotado em `docs/TESTES-PENDENTES.md`.

- **Desktop da área e miniaturas (correção):** os blocos agora dimensionam o texto pelo contêiner (`cqi`, que cai para a janela quando não há contêiner, então a página publicada não muda), e a miniatura do portfólio (`app/area/Miniatura.tsx`) é um quadro fixo de 390 px reduzido por `ResizeObserver`; antes o título era cortado no desktop. O assistente usa a mesma miniatura. Início em duas colunas a partir de 960 px (saudação, próximo passo à esquerda, portfólio à direita). No celular o assistente mostra só o contador "1 de 10", sem os pontos.

- **App no mesmo mundo do site da Carol:** a interface (login, assistente, área, editor, mídia kit) passou do creme com cartões brancos para o sistema do site e da página de vendas: base espresso `#24130F`, superfícies `#2D1A14`, fios de 1 px, serifa Instrument Serif em marca, títulos e saudação, rosa `#FF8FB0` como grifo e `#D42A5B` nos botões, raios 12/16/20, próximo passo em faixa creme (como as faixas creme do site), ícones desenhados em SVG no lugar de glifos, seleção de texto, cursor e barra de rolagem no tema, uma entrada animada na área e dica de primeiro uso no editor ("toque numa seção para selecionar, de novo para editar"). Tudo em `site/src/app/tema.css` (tokens no topo; importado por último em cada tela). O portfólio da creator dentro do editor continua com as cores do modelo dela. Sem teste novo, como combinado; contrastes principais medidos (9 a 15:1).

- **Refino visual do app (crítica de design):** relatório em `docs/CRITICA-DESIGN-2026-10-24.md` (nota 26/40 antes; dois avaliadores isolados). Aplicado: serifa editorial nos títulos, marca única, hierarquia da área, estados e controles, acessibilidade, gaveta, mídia kit no celular e correção do vídeo nos cards. Vale rever no celular (`/app/`, `/app/editor/`, `/app/midia-kit/`). O que ficou aberto está na seção "Ainda aberto" do relatório.

- **Conta de teste da Carol:** `carol.limah.teste@example.com` no projeto Supabase `Creators`, com perfil, projeto (modelo Nuvem, cor caramelo da marca dela), foto dela no Cloudinary e só dados reais do site (`content.ts`, `ui.ts`): 58,4 mil seguidores, 1,67 mi de views, média de 242 mil por reel, público (AUDIENCE), 22 marcas, 6 vídeos dela (URLs de `carol-limah/`), formatos e contato. Criada por `npm run seed:carol <foto>` (repetível). Acesso: `npm run acesso:teste` gera um código de 6 números (vale 15 min) para entrar em `/app/entrar/`, porque o e-mail do login ainda não traz o código (falta SMTP). WhatsApp e e-mail de contato são os comerciais reais dela, já públicos no site.

- **Área da creator (`/app/`, sem publicação):** com login, 4 abas fixas embaixo: **Início** (próximo passo e resumo), **Projetos** (miniatura, estado, continuar editando, mídia kit, apagar projeto), **Mídias** (biblioteca na nuvem, espaço usado, apagar) e **Conta** (dados no perfil, plano, baixar meus dados em JSON, excluir conta com 7 dias para voltar atrás). Testado de ponta a ponta no banco real. Vale abrir no celular (`localhost:4321/app/`). **Lacuna conhecida (LGPD):** ao excluir a conta o banco apaga tudo, mas os arquivos no Cloudinary só saem se ela os apagar antes na aba Mídias; falta uma rotina do servidor que apague a pasta `creators/<id>` na exclusão definitiva. O envio e a exclusão de arquivos agora exigem login (o servidor confere o token). Os uploads de teste de ontem em `creators/dc8d82a4…` são seus e foram mantidos.

- **Login e nuvem (E3):** `/app/entrar/` entra por código de 6 números; o editor salva na conta (`projects`) e migra o rascunho do aparelho no primeiro login. **Preciso do usuário:** (1) um SMTP próprio (por exemplo, Resend com o domínio) para o e-mail trazer o código: hoje o Supabase só manda o link, não deixa editar o modelo no plano Free e limita a 2 e-mails por hora; (2) regerar a secret key e o token do Supabase (foram colados na conversa). Nos testes o código sai do servidor (`admin.generate_link`) e o envio do e-mail é simulado.

- **Supabase do produto:** projeto `Creators` (`djuzcmnvwkethwlilhik`, us-east-1). 7 migrations aplicadas (10 tabelas com RLS) e RLS verificada no banco real (transação desfeita). Achado: tabelas novas não dão permissão ao `authenticated` por padrão, por isso a migration `grants`. Token de acesso do CLI/MCP na variável `SUPABASE_CAROL` (`~/.zshrc`); chaves da API no `site/.env`. A secret key e o token foram colados na conversa: regerar quando terminarmos.

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
