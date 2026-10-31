# Progresso do Portfólio Creator

Diário do projeto e memória entre sessões. Toda IA que trabalhar aqui lê a seção "Onde parei" antes de começar e atualiza este arquivo ao fim de cada tarefa e antes de encerrar a sessão. Regras em `docs/00-guia-ia.md`.

## Onde parei

- **Estado em 31/out:** o código previsto até o lançamento está **feito e commitado na `dev`** e foi testado só em localhost. Nada foi para a `main` nem para produção. Funciona de ponta a ponta: assistente → editor → revisão → publicar com plano (PDF + link ou Site) → pagamento marcado no admin → página `/c/<link>` no ar (prévia no WhatsApp, rápida no 4G) → links para marcas com aviso de abertura → PDF do mídia kit gerado no servidor e guardado → prazo de 7 dias para publicar mudanças e "Liberar a edição".
- **Último trabalho (31/out):** DEV-036, e-mail do login com o código pelo Resend, e antes DEV-035 (Turnstile, `fe90d8b`) e DEV-031 (Google, `57dc7bc`), todos aprovados e commitados. Próximo passo: revisão final e merge na `main` quando o usuário pedir para publicar.
- **Depende de você antes de abrir ao público:**
  1. **`wrangler login`: feito em 31/out** (conta ana.carolinelima1987@gmail.com, com permissão `browser`). Conferido: `npm run pdf:kit` gerou o PDF do `eu-carollimah` pelo navegador da Cloudflare (2 páginas, 307 KB, ~10 s). A config temporária `astro.config.semremoto.mjs` foi apagada.
  2. **Google (DEV-031): login funcionando e app publicado no Google Cloud em 31/out** (qualquer conta Google entra). Opcional, depois do site no ar: verificação de marca, para a tela do Google mostrar o nome do produto em vez do endereço do Supabase. O arquivo `client_secret_*.json` na raiz é ignorado pelo Git; pode ser apagado.
  3. **Chaves do Supabase trocadas em 31/out:** secret key nova `servidor_31_out` (no `site/.env`, no Worker por `wrangler secret put` e no `.env` da raiz como `SUPABASE_SECRET_KEY`) e token novo `claude-carol` (no `~/.zshrc` como `SUPABASE_CAROL`, no `~/.claude.json` do MCP e no `.env` da raiz como `SUPABASE_TOKEN`); a antiga e o token antigo apagados pelo usuário. Testado: página publicada, login na área e no admin, API de gestão. Sugerido: desligar as chaves legacy (JWT `anon` e `service_role`), que o app não usa.
  4. **Revisão jurídica dos Termos e da Privacidade (DEV-200):** os trechos em amarelo. Depois dela, tirar o `noindex` das duas páginas (está no molde `site/src/views/PaginaLegal.astro`). Preços e limites citados nos Termos são lidos do código: mudar o preço atualiza os Termos sozinho.
  5. **Contador:** se o MEI (CNAE 5912-0/99, pós-produção de vídeo) pode vender assinatura de sistema online, e qual é o teto de faturamento.
  6. **Decisão:** a página publicada `/c/<link>` deve aparecer no Google? Hoje está `noindex`.
  7. **Publicar:** autorizar o merge `dev` → `main`. Junto, trocar o Site URL do Supabase (hoje `http://localhost:4321`) para `https://eucarollimah.com.br`. Ele também leva para produção o rodapé novo do site da Carol ("Portfólio para creators") e o aviso de medição da Amplitude.
- **Decisões de 28/out que valem:** preços confirmados; limites de 300 arquivos, 1 GB e 50 links por dia; lançamento sem cupom (DEV-221); domínio do produto em `/portfolio-creator/` no site da Carol; Sentry dispensado por ora (ficam os logs do Cloudflare). Termos (DEV-200): só maiores de 18; domínio do plano Site no nome e CPF da creator, que renova direto no Registro.br do 2º ano em diante; no arrependimento de 7 dias devolve tudo menos a taxa do domínio já registrado; foro do domicílio da consumidora e, nos demais casos, São José dos Campos/SP; resposta à LGPD em 15 dias; Amplitude sem gravação de sessão e com aviso discreto na primeira visita ("Ok", guardado no navegador, no `SeoHead`), também no site da Carol (pedido explícito). Dados da empresa em `site/src/data/empresa.ts` (razão social, CNPJ, cidade). Consulta pública do CNPJ em 28/out: MEI ativo desde 29/09/2025, São José dos Campos/SP.
- **Pode vir depois do lançamento (já combinado):** Slack com card do pedido e botões (DEV-161 a 164); WhatsApp oficial com avisos e "marca abriu" (DEV-170 a 174, 162, 184); gateway de pagamento (hoje o pagamento é combinado pelo WhatsApp e marcado no admin); DEV-089 (trocar formato), DEV-092 (eventos), DEV-113 a 115 (quadro do vídeo, limites de duração, corte com foco no rosto); LGPD: .zip de "baixar meus dados" (DEV-201), código ao excluir (DEV-202), e-mail ao excluir (DEV-204; o servidor de e-mail já existe desde a DEV-036); admin: MFA, "ver como ela vê", Mensagens, Mídias, Modelos, Planos, Exclusões e Uso (DEV-303 a 305), lista de espera (DEV-220), consultas do Studio (DEV-212); template Editorial e ondas 2 e 3 (`docs/PROPOSTA-TEMPLATE-2026-10-24.md`); IA (DEV-103, 195) e OCR dos prints (DEV-120 a 126, código no commit `6ecf8fc`); leitor de tela fora do editor (DEV-232) e o "Ainda aberto" de `docs/CRITICA-DESIGN-2026-10-24.md`; prévia por branch (DEV-006); e2e de publicar e marca abrir (DEV-230, precisa de conta de teste e SSR no Playwright); a rodada de testes unitários em `docs/TESTES-PENDENTES.md`.
- **Limites conhecidos:** com edições pendentes em dois aparelhos, vence o que abrir primeiro (DEV-082); o plano grátis do Browser Run dá ~30 a 60 PDFs por dia (DEV-151); sem gateway, a assinatura mensal é um pedido por mês; se o link está livre só se sabe ao publicar (DEV-141).
- **Modo de trabalho:** branch `dev`; uma tarefa `DEV-###` por vez, com plano, testes e commit sem atribuição de IA. Testes unitários adiados de propósito (`docs/TESTES-PENDENTES.md`). Roteiros de verificação em `/tmp/rev/` (somem ao reiniciar; o do PDF virou `site/scripts/pdf-kit.mjs`). PDF do mídia kit: como funciona e como mudar o layout em `docs/05-pdf-midia-kit.md`; teste real com `npm run pdf:kit -- <código da equipe>`.
- **Conta de teste (decisão de 31/out):** só a `lfj182@gmail.com`, do usuário: papel `admin`, dona do único portfólio no ar (`eu-carollimah`), entra por e-mail e pelo Google. As contas `carol.limah.teste@example.com`, `equipe.teste@example.com` e `ana.carolinelima1987@gmail.com` (criada sem querer no teste do e-mail) foram excluídas em 31/out a pedido, arquivos do Cloudinary primeiro (4 imagens e 2 vídeos em `creators/<id>/`) e depois o login. `npm run acesso:teste` e `npm run equipe:teste` usam essa conta por padrão e dão o código e um link `…/entrar/?teste=<e-mail>` que abre na etapa do código (o `?teste=` só vale em `astro dev`; o botão "Já tenho um código" saiu em 31/out a pedido). `npm run seed:carol` agora exige `SEED_EMAIL` e recusa conta com portfólio no ar, porque sobrescreve o projeto. Roteiros antigos em `/tmp/rev/` que usavam as contas `@example.com` ou o botão não funcionam mais. No build, `/tmp/rev/dev200-compra.mjs` mostra como entrar pondo a sessão no navegador. Servidor de desenvolvimento: `cd site && npx astro dev` (porta 4321; o Astro só deixa um por vez: `npx astro dev status` e `npx astro dev stop`).
- **Banco:** migrações `protecao`, `exclusao_definitiva`, `limites` e `midia_kits` aplicadas em 28/out. `supabase/tests/rls.sql` roda verde (6 grupos).
- **Regras vivas:** nunca mexer no site da Carol sem pedido; nunca mencionar a avó; nunca inventar número, depoimento, case ou preço; mensagens de erro sempre em português e validação no front antes de enviar; vídeos sempre mudos na página (o som só existe no visor, aberto pelo toque do visitante).
- **Ambiente:** `.env` da raiz (fora do Git): chaves do Google OAuth, do Turnstile e do Resend (esta com o nome `RESEND_API_KEU`, a corrigir). E-mail do login: Supabase → Resend (`envio.eucarollimah.com.br`), modelo em `supabase/templates/codigo.html`; para mudar o texto, editar o arquivo e aplicar pela API (`mailer_templates_*`). `site/.env` (chaves Supabase e Cloudinary e `PUBLIC_TURNSTILE_SITE_KEY`, não versionado), token do CLI do Supabase em `SUPABASE_CAROL` (`~/.zshrc`). Segredos do Worker `carol` (`SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_URL`, `ADMIN_TOKEN`) postos em 28/out. Amplitude desligada nas páginas do app.
- **OCR:** código removido por ora; a spec `docs/04-ocr-prints.md` fica (código no commit `6ecf8fc`).
- **Sequência até o lançamento (feita em 28/out, uma tarefa por commit):** DEV-082 (`425b1e5`), DEV-034 (`eda5135`), DEV-160/190/192/193 (`ea77acb`), DEV-221 (`49544eb`), DEV-144 (`6787c44`), DEV-146 (`51207d0`), DEV-203 (`07d902c`), DEV-232 (`11bf88f`), DEV-093 (`2beed0b`), DEV-094 (`4903c39`), DEV-095 (`6ff283e`), DEV-233 (`00d2886`), DEV-234 (`318c90f`), DEV-230 (`2ec8d6e`), DEV-231 (`4b9302e`), backlog marcado (`7f9a6c5`), migrações aplicadas (`62a61be`), DEV-151 a 153 (`c5d0c4f`), DEV-154 (`18cba2a`). Depois: Termos e Privacidade (DEV-200, `d981572` e `f37e262`) e cupom removido (DEV-221, `b700ba4`).
- **Histórico:** as descrições das entregas aprovadas até 28/out (o que cada uma faz, decisões e roteiros) estão em `docs/ENTREGAS.md`.

## Esperando aprovação

Nada.

## Diário

### 31/out/2026
- **DEV-036, e-mail com o código:** Supabase mandando pelo Resend (grátis), com o código em português; testado e aprovado.
- **DEV-035, Turnstile no login:** feito, testado por pessoa e aprovado (`fe90d8b`).
- **DEV-031, entrar com o Google:** feito, testado com conta real e aprovado (`57dc7bc`). Commits antes: documentos (`76a1edb`) e DEV-200 (`354ff31`).
- **DEV-200 na compra:** Termos e Privacidade ligados junto do botão ao reservar o link e ao liberar a edição. Aprovado e commitado.
- **Documentos arrumados:** "Onde parei" reescrito com o que falta até o lançamento. As 29 entradas antigas de "Esperando aprovação", todas já aprovadas e commitadas, foram para `docs/ENTREGAS.md` sem mudança de texto. No backlog, conferidos no código: DEV-141, 203, 231, 233 e 234 marcados como feitos; DEV-230 (falta e2e de publicar e da marca abrir) e DEV-232 (falta leitor de tela fora do editor) seguem abertos, com o que falta escrito.
- **Ambiente:** o `wrangler login` expirou e trava `astro dev` e o build (binding remoto do Browser Run). O servidor de desenvolvimento que estava de pé desde 28/out respondia 404 em todos os arquivos e foi parado. Resolvido no mesmo dia com o `wrangler login`.

### 28/out/2026
- **Sequência até o lançamento, toda em código** (commits na lista de "Onde parei"):
  - salvar sem perder edição (DEV-082) e proteção por sessão e papel (DEV-034: brechas da equipe gravando direto no banco e de rascunho passando entre contas no mesmo aparelho);
  - plano ao publicar, regras de acesso, prazo de 7 dias e liberar a edição (DEV-160, 190, 192, 193);
  - prévia do link no WhatsApp (DEV-144: o portfólio publicado não tinha nenhuma) e página publicada rápida no 4G (DEV-146: LCP de 5,1 s para 2,2 a 2,3 s);
  - exclusão definitiva na ordem certa (DEV-203), foco e teclado, topo em 320 px, esqueleto e hierarquia do editor (DEV-232, 093, 094, 095);
  - logs de erro (DEV-233), limites contra abuso (DEV-234), teste de ponta a ponta (DEV-230) e teste de RLS (DEV-231).
- **Migrações aplicadas pelo agente a pedido do usuário:** `protecao`, `exclusao_definitiva`, `limites` e `midia_kits`. O teste de RLS, que tinha confirmado a brecha da assistente, ficou verde.
- **PDF do mídia kit no servidor** (DEV-151 a 153): grátis pelo Browser Run da Cloudflare, guardado no Supabase Storage, regerado a cada publicação. A ideia do endereço interno respondido pelo Worker veio do `document-renderer`. O túnel foi bloqueado pelas permissões e não foi usado. Medido: 10 a 20 s por PDF no build de produção. Documento: `docs/05-pdf-midia-kit.md`.
- **DEV-154:** mídia kit editorial "Revista" (feito em outra sessão, aprovado).
- **DEV-097:** página de vendas sem modelos. Textos, imagens do portfólio real da Carol feitas no editor e enquadramento do topo (`00e6357`, `6f786d0`, `f1d1ea0`).
- **DEV-098:** menu no topo da página, pelas seções (`eb4bebe`). Coluna nova `projects.menu` aplicada no Supabase.
- **DEV-099:** espaçamento (`b7a2717`).
  - O editor dobrava o respiro entre as seções.
  - O respiro foi para `clamp(56px, 8cqi, 88px)`, depois de um primeiro corte que ficou apertado.
  - Mais ar dentro das seções e no menu.
  - O WhatsApp flutuante some com o Contato no menu.
  - Os títulos dos painéis ficaram afastados dos botões.
- **DEV-235:** validação de WhatsApp e e-mail com uma regra só (`lib/formatos.ts`). Corrige o link do WhatsApp sem o 55.
- **Pendente com você:** 3 fotos antigas sem registro no Cloudinary (pasta da conta de teste). O controle de permissões bloqueou a exclusão.

### 27/out/2026
- DEV-096: sem modelos (assistente com etapa de cores, textos do app e documentos).
- Revisão de UX do editor em 10 critérios, medida com Playwright (dev, build de produção com 4G lento e conta de teste com gravações interceptadas). Nota 6/10. Achados principais: perda de edição feita sem conexão, foco de teclado invisível nos blocos, topo cortado em 320 px e tela em branco até ~2,2 s.
- Commit do trabalho que estava pendente:
  - Gaveta de Vídeos com cartões e "Adicionar vários".
  - Visor de vídeos com som na página publicada.
  - Desenhos dos layouts na gaveta.
  - Entrada separada da equipe (`/admin/entrar/`).
  - Leituras "da minha conta" filtradas pelo dono.
  - `capaDeVideo` aceita endereço com transformação.
  - Antes do commit: corrigidos 2 avisos do lint (estado copiado em efeito no Estilo; ref no visor) e formatados os arquivos com o Prettier.

### 23/out/2026 (tarde)
- `dev` criada, 3 commits `Setup:`; DEV-001 implementada.

### 23/out/2026
- Planejamento fechado: PRD, construtor, backlog de desenvolvimento, especificação de OCR e este guia, em `docs/`.
- Versão 1 sem leitura de prints, sem IA no assistente, sem login Google e sem gateway de pagamento.
- Nenhum código do produto escrito ainda.

## Publicações

Nenhuma ainda.
