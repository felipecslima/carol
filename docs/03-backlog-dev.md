# Backlog de desenvolvimento

Todas as tarefas de código do Portfólio Creator, de 23/out/2026, derivadas do PRD. Cada tarefa tem um código (`DEV-###`), o resultado esperado ("pronto quando") e de quais outras depende. Escritas para serem passadas à IA uma por vez.

Prioridade: **P0** = lançamento, **P1** = logo depois, **P2** = futuro. Tarefas que não são de código (decisões, contas, textos) ficam fora deste arquivo. Antes de começar, leia `00-guia-ia.md`.

## P0 — Lançamento

### E1. Repositório e infraestrutura

- [x] **DEV-001** Integrar React ao Astro (`@astrojs/react`) e criar a rota `/app` como ilha `client:only`. Pronto quando: `/app` abre uma tela React no deploy atual sem afetar o site da Carol.
- [x] **DEV-002** Adapter do Cloudflare para páginas renderizadas no servidor, mantendo o site estático. Pronto quando: uma rota de teste SSR responde no Worker e as páginas atuais continuam estáticas.
- [x] **DEV-003** Variáveis de ambiente e segredos (Supabase, Cloudinary, Slack, WhatsApp, IA) no Wrangler e no `.env`, fora do Git. Depende: DEV-002.
- [x] **DEV-004** Estrutura de pastas `src/app/` (editor e área), `src/blocks/`, `src/themes/`, `src/ocr/`, `src/server/`. Pronto quando: documentada no HANDOFF.
- [x] **DEV-005** TypeScript estrito, ESLint, Prettier e Vitest configurados; Playwright já existente reaproveitado.
- [ ] **DEV-006** Ambiente de prévia por branch (Cloudflare) para testar antes de publicar.

### E2. Banco e segurança (Supabase)

- [x] **DEV-010** Projeto Supabase e migrations versionadas no repositório. *Projeto `Creators` (`djuzcmnvwkethwlilhik`); 7 migrations aplicadas pelo CLI e registradas no histórico.*
- [x] **DEV-011** Tabela `profiles` (nome, @, WhatsApp, cidade, nicho, modo iniciante, papel). Depende: DEV-010. *Migration escrita em `supabase/migrations/` e validada num Postgres local (PGlite); aplicada no projeto `Creators` em 24/out/2026.*
- [x] **DEV-012** Tabela `projects` (tipo site/mídia kit/os dois, modelo (hoje valor interno fixo `'nuvem'`, ver DEV-096), paleta, blocos JSON, slug, status, prazo de edição). Depende: DEV-010. *Migration escrita em `supabase/migrations/` e validada num Postgres local (PGlite); aplicada no projeto `Creators` em 24/out/2026.*
- [x] **DEV-013** Tabela `media` (id Cloudinary, tipo, tamanho, duração, capa, dono). *Migration escrita em `supabase/migrations/` e validada num Postgres local (PGlite); aplicada no projeto `Creators` em 24/out/2026.*
- [x] **DEV-014** Tabela `orders` (projeto, plano, status, link de pagamento, thread do Slack, datas). *Migration escrita em `supabase/migrations/` e validada num Postgres local (PGlite); aplicada no projeto `Creators` em 24/out/2026.*
- [x] **DEV-015** Tabela `premium_grants` (creator, molde, motivo, validade, quem liberou). *Migration escrita em `supabase/migrations/` e validada num Postgres local (PGlite); aplicada no projeto `Creators` em 24/out/2026.*
- [x] **DEV-016** Tabelas `brand_links` (código, nome da marca, projeto) e `brand_opens` (código, data). *Migration escrita em `supabase/migrations/` e validada num Postgres local (PGlite); aplicada no projeto `Creators` em 24/out/2026.*
- [x] **DEV-017** Tabelas `events` (eventos do editor) e `audit_log` (ações da equipe). *Migration escrita em `supabase/migrations/` e validada num Postgres local (PGlite); aplicada no projeto `Creators` em 24/out/2026.*
- [x] **DEV-018** Tabela `waitlist` (nome, WhatsApp, @, data). *Migration escrita em `supabase/migrations/` e validada num Postgres local (PGlite); aplicada no projeto `Creators` em 24/out/2026.*
- [x] **DEV-019** RLS em todas as tabelas: creator só lê e altera o que é dela; papel de equipe gravado no usuário, alterável só pelo servidor. Pronto quando: teste automatizado prova que uma creator não lê dados de outra. *Políticas escritas e verificadas com 30 cenários em PGlite (`supabase/tests/rls.mjs`, ainda fora do npm). Falta rodar no projeto real.*
- [x] **DEV-020** Tipos TypeScript gerados do banco. *`src/lib/banco.tipos.ts` (regerar após mudar o banco).*

### E3. Autenticação

- [x] **DEV-030** Login por e-mail com código de 6 dígitos (Supabase OTP), tela pensada para celular. *Feito: `/app/entrar/` (e-mail → código de 6 números), testado ponta a ponta. Falta o e-mail trazer o código: precisa de SMTP próprio (o modelo padrão só tem link e o plano Free não deixa editá-lo).*
- [x] **DEV-032** Sessão longa e renovação automática. *Sessão no aparelho com renovação automática (`app/supabase.ts`).*
- [x] **DEV-033** Começar sem conta: rascunho salvo no aparelho e migrado para a conta ao entrar. Pronto quando: o rascunho aparece igual depois do login. *Feito: sem conta o rascunho fica no aparelho e, no primeiro login, vai para a conta (`Editor.tsx`).*
- [x] **DEV-034** Proteção das rotas `/app` e `/admin` por sessão e papel. *Feito em 28/out. As páginas de `/app` e `/admin` são cascas estáticas sem dados (a sessão fica no navegador); a proteção está nos dados: regras de linha no banco e rotas de API que conferem a sessão e o papel no servidor. Migração `20261028000200_protecao.sql`: a equipe não grava mais direto no banco (só por `/api/admin/acao`, com papel conferido e registro), a trava de estado/link/publicado vale também para a equipe, `search_path` fixo nas funções e funções de trigger fora da API. Chave do `/api/pedido/pago` comparada em tempo constante. Rascunho no aparelho marcado com a conta: num aparelho compartilhado não abre nem sobe para outra conta, e sai do aparelho ao sair da conta (menos se ainda não chegou à conta).*

### E4. Área da creator

- [x] **DEV-040** Layout com barra fixa de 4 abas (Início, Projetos, Mídias, Conta), áreas de toque de 44 px, safe areas do celular. *Barra fixa de 4 abas em `/app/` (`app/area/Area.tsx`).*
- [x] **DEV-041** Início: cartão "próximo passo" calculado pelo estado do projeto, status dos pedidos e dicas. *Cartão de próximo passo (`lib/proximo-passo.ts`) e resumo. Faltam pedidos (E13) e dicas da Carol (texto dela).*
- [x] **DEV-042** Projetos: lista com miniatura, status e botão principal contextual (Continuar, Publicar, Copiar link). Limite de 1 site e 1 mídia kit. *Lista com miniatura, estado e botão principal; mídia kit; apagar projeto. Faltam Publicar e Copiar link (publicação).*
- [x] **DEV-043** Conta: dados, WhatsApp, plano e pagamentos. *Dados (salvam em `profiles`), plano (teste grátis), baixar dados em JSON e exclusão de conta com 7 dias. Falta o .zip com os arquivos e o e-mail de confirmação (SMTP).*
- [x] **DEV-044** Estados do projeto: rascunho, aguardando pagamento, no ar, edição travada, fora do ar. Pronto quando: cada estado tem teste. *Estados, textos e regra de edição em `lib/estados.ts`; falta o teste de cada estado.*

### E5. Cores e temas

- [x] **DEV-050** Módulo de paleta com `@material/material-color-utilities`: de uma cor de origem e um esquema (Fidelity, Vibrant, Neutral...) gerar os papéis claro e escuro.
- [x] **DEV-051** Mapa de papéis para variáveis CSS (`--destaque`, `--fundo`, `--texto`...). Pronto quando: trocar a cor recalcula a página sem recarregar.
- [x] **DEV-052** Teste automático de contraste: todos os pares texto/fundo de todas as paletas passam 4,5:1.
- [x] **DEV-053** Tokens de estilo (fontes, cantos, respiro, ornamentos) separados das cores.

### E6. Blocos e estilo

- [x] **DEV-060** Contrato de bloco: tipo, variações, campos (com limite de letras), placeholders, regras (obrigatório, máximo). Pronto quando: um registro central lista os blocos.
- [x] **DEV-061** Bloco Capa (2 variações).
- [x] **DEV-062** Bloco Sobre mim (2 variações).
- [x] **DEV-063** Bloco Números (2 variações), escondido no modo iniciante.
- [x] **DEV-064** Bloco Vídeos (2 variações), com vídeo leve e capa.
- [x] **DEV-065** Bloco Marcas (2 variações), escondido no modo iniciante.
- [x] **DEV-066** Bloco Público (2 variações), escondido no modo iniciante.
- [x] **DEV-067** Bloco Formatos (2 variações).
- [x] **DEV-068** Bloco Contato (2 variações), obrigatório, com WhatsApp e e-mail validados.
- [ ] **DEV-069** Estilo padrão "Nuvem" completo (tokens + 3 paletas). *Feito em código (`themes/modelos/nuvem.ts`, `blocks/blocos.css`); falta a aprovação visual do usuário.*
- [x] ~~**DEV-070** Modelo Clean. Depende: Nuvem aprovado.~~ **Descartada (27/out/2026):** sem modelos; as seções montam o portfólio.
- [x] ~~**DEV-071** Modelo Pop Color.~~ **Descartada (27/out/2026):** sem modelos; as seções montam o portfólio.
- [x] ~~**DEV-072** Modelo Casual.~~ **Descartada (27/out/2026):** sem modelos; as seções montam o portfólio.
- [x] ~~**DEV-073** Modelo Glow Rosé.~~ **Descartada (27/out/2026):** sem modelos; as seções montam o portfólio.
- [ ] **DEV-074** Mesmos blocos renderizando no editor (interativo) e no servidor (HTML puro). Pronto quando: teste compara as duas saídas.

### E7. Editor

- [ ] **DEV-080** Teste do Puck (1 a 2 dias) com decisão registrada.
- [x] **DEV-081** Estado do editor (Zustand) com o JSON do projeto e histórico de desfazer/refazer (zundo).
- [x] **DEV-082** Salvar sozinho com debounce, indicador "Salvo ✓" e fila offline que reenvia ao voltar a internet. *Feito em 28/out: salva no aparelho e, com conta, na tabela `projects` (600 ms de espera); marcador de pendente (o aparelho vence ao abrir), gravações em fila, nova tentativa ao voltar a conexão e a cada 30 s, motivo da falha no status (sem conexão ou servidor), aviso ao fechar com algo não salvo. Limite: com pendências em dois aparelhos, vence o que abrir primeiro.*
- [x] **DEV-083** Seleção: primeiro toque no bloco, segundo no elemento; barra flutuante Editar, ↑, ↓, Esconder. *Feito: primeiro toque seleciona, segundo abre a edição, barra com Editar/↑/↓/Esconder. Falta: seleção por elemento dentro do bloco.*
- [x] **DEV-084** Gaveta de edição (Vaul) com campo focado, contador de letras, dica do bloco, teclado sem cobrir o campo. *Feito (Vaul, contador de letras, rola o bloco para cima da gaveta). Falta: testar com teclado real no celular.*
- [x] **DEV-085** Painel Seções: visíveis com ↑↓, Guardados com Devolver, Capa e Contato sem opção de remover.
- [x] **DEV-086** Adicionar bloco: biblioteca com miniaturas no estilo do projeto; máximo de 15 blocos. *Feito com lista de nomes e variações; faltam as miniaturas no estilo do projeto.*
- [x] **DEV-087** Trocar variação de um bloco.
- [x] **DEV-088** Aba Estilo: paleta, fontes, cantos; troca instantânea com aviso "Desfazer". *Feito: cor (3 paletas e cor própria), cantos, fonte, clima, aviso com Desfazer.*
- [ ] **DEV-089** Trocar formato (site, mídia kit, os dois) sem perder conteúdo; o que não cabe vai para Guardados.
- [x] **DEV-090** Placeholders com etiqueta "Exemplo · toque para trocar"; progresso "X de Y itens já são seus". *Contador feito (`lib/progresso.ts`).*
- [x] **DEV-091** Modo Ver (sem interface) e modo iniciante.
- [ ] **DEV-092** Eventos do editor (bloco adicionado, guardado, placeholder trocado, publicou).
- [x] **DEV-096** Sem modelos: o editor e as seções montam o portfólio. A etapa do assistente vira "Escolha suas cores"; textos do app sem "modelo"; documentos atualizados. `modelo` fica como valor interno `'nuvem'` (sem migração). *Feito em 27/out, aprovado.*
- [x] **DEV-093** Topo do editor em telas pequenas (status e Entrar cabem em 320 px), abas centradas no desktop e dica de primeiro uso que não bloqueia o toque (diz "Clique" no computador). *Feito em 28/out: abaixo de 480 px o status vira ícone (texto curto nos problemas: "Sem rede", "Não salvou"; o completo fica para o leitor de tela e na dica), "Entrar" vira ícone, a marca diminui e abaixo de 360 px vira o monograma PC; abas de 120 px no centro no desktop; dica diz "Clique" com mouse e não bloqueia a página.*
- [x] **DEV-094** Esqueleto do editor antes do JavaScript (topo e abas no HTML), sem tela em branco no 4G lento. *Feito em 28/out: esqueleto (topo, "Carregando seu portfólio…" e abas, nas alturas do editor) no HTML pelo fallback do `client:only`, o mesmo componente que o editor usa enquanto busca o projeto. Medido no build com brotli, 4G lento e CPU 4x: algo na tela em ~0,35 s (antes ~2,2 s em branco), CLS 0, editor pronto em ~2,2 s (igual).*
- [x] **DEV-095** Hierarquia: Publicar em destaque, rosa reservado para a ação principal e o selecionado, Esconder e Remover num menu "Mais" na barra flutuante. *Feito em 28/out: rosa só para Publicar e seleção (aba aberta creme com fio, Entrar e progresso neutros); Publicar com contorno rosa enquanto há pendências e rosa cheio quando dá para publicar, com o número junto; barra flutuante Editar, Subir, Descer e "Mais" (Esconder e Remover com explicação, teclado, tocar fora só fecha); aviso de Remover 10 s, pausando com mouse ou foco. Crítica em `site/.impeccable/critique/2026-10-28-hierarquia-editor.md`.*
- [x] **DEV-099** Espaçamento (pedido de 28/out):
  - Entre as seções, no editor o espaço dobrava (o respiro da "última seção" valia para todas): de 192 a 224 px no desktop, agora de 104 a 122 px. O respiro normal foi para `clamp(56px, 8cqi, 88px)`, também na página no ar.
  - Dentro das seções, mais ar entre título, texto, etiquetas e cartões.
  - O menu do topo ficou mais folgado.
  - O WhatsApp flutuante some quando o Contato está no menu.
  - Nos painéis, o título de cada grupo de opções encostava nos botões: agora fica a 10 px e alinhado com os campos de texto.
  - *Feito em 28/out, aprovado.*
- [x] **DEV-098** Menu no topo da página, montado pelas seções na ordem delas (pedido de 28/out). Faixa fixa que desliza no celular e marca a seção à vista; a Capa não entra e o Contato fica no fim, como botão. Cada seção pode ter nome próprio no menu e sair dele; Estilo liga e desliga o menu. Aparece no editor (tocar seleciona a seção), no modo Ver e na página no ar; o mídia kit fica sem. *Feito em 28/out, aprovado. Coluna nova `projects.menu` (migração `20261028000100_menu.sql`).*

### E8. Assistente de início

- [x] **DEV-100** Etapa de cores: escolher uma das 3 paletas com prévia. *Feito em 27/out (antes era a escolha do modelo; sem modelos desde então, ver DEV-096).*
- [x] **DEV-101** Perguntas do assistente (nome, @, cidade, nicho, já fez publi, o que grava, frase).
- [x] **DEV-102** Pedido de vídeos dentro do assistente (usa E9) e dos números (usa DEV-130). *Feito: etapa de vídeos (até 4, com envio) e de números (só para quem já fez publi); ambas podem ser puladas.*
- [x] **DEV-104** Montagem do projeto: respostas, vídeos e números entram nos blocos; placeholder só onde faltou. Sem IA. *`lib/montagem.ts`.*

### E9. Mídias

- [x] **DEV-110** Upload assinado direto do celular para o Cloudinary (pasta por creator). *Feito: `/api/upload/assinatura` assina no servidor e o celular envia direto ao Cloudinary. Exige sessão; a pasta é `creators/<id do usuário>` (decidida no servidor).*
- [x] **DEV-111** Envio em segundo plano com barra no próprio card; editor continua usável. *Feito: barra de progresso no próprio campo, resto da gaveta usável. Falta fila com retomada em internet ruim.*
- [x] **DEV-112** Conversão de HEIC e .mov, compressão e capa automática (transformações do Cloudinary). *Feito na entrega: `f_auto`/`q_auto`/`w_1200` nas fotos (HEIC vira JPEG/WebP), `f_mp4`/`w_720` no vídeo (.mov vira MP4) e capa no quadro 0. Testado com foto e vídeo reais.*
- [ ] **DEV-113** Trocar capa escolhendo o quadro do vídeo.
- [ ] **DEV-114** Limites de duração, tamanho e espaço com mensagens claras. Depende: limites definidos. *Limites provisórios no código: foto 15 MB, vídeo 200 MB; falta duração e espaço por creator.*
- [ ] **DEV-115** Corte de foto no formato do espaço com foco no rosto; aviso de foto escura ou pequena.
- [x] **DEV-116** Aba Mídias: biblioteca, espaço usado, reaproveitar em qualquer projeto. *Feito: tabela `media` + aba Mídias na área e "Das minhas mídias" no editor; Apagar remove do Cloudinary (`/api/upload/apagar`) e do registro.*

### E10. Números informados pela creator

- [x] **DEV-130** Formulário de números (seguidores, visualizações, contas alcançadas, interações, público, views por reel) com período e guia visual de onde achar cada um no Insights. Grava no mesmo formato que a leitura de prints vai usar (`04-ocr-prints.md`, seção 3.2). Pronto quando: os números aparecem nos blocos Números e Público.
- [x] **DEV-131** Selo "informado pela creator" e validações simples (percentuais que somam perto de 100, valores não negativos).

### E11. Publicação e páginas públicas

- [x] **DEV-140** Revisão final: alertas vermelhos (placeholder, número de exemplo, sem contato) e amarelos. *`lib/revisao.ts` e aba Publicar; o botão Publicar fica desabilitado até a E11 a E13.*
- [ ] **DEV-141** Escolha do link `/nome`: regras de formato, checagem em tempo real, sugestões, nomes reservados. *Feito: formato, nomes reservados, sugestões a partir do @ e validação ao digitar (`lib/slug.ts`, aba Publicar). Falta checar se o link está livre (precisa do banco, E2).*
- [x] **DEV-142** Rota pública `/c/[slug]` renderizada no servidor a partir do JSON publicado, quase sem JavaScript. *Funciona em localhost (conferido em 28/out): `/c/<link>` renderizado no servidor a partir da versão publicada; JS só depois do load (DEV-146).*
- [x] **DEV-143** Versão publicada separada do rascunho (editar não muda o que está no ar até publicar de novo). *Funciona: `projects.publicado` é uma cópia tirada ao publicar; editar não muda o que está no ar.*
- [x] **DEV-144** Prévia do link (imagem e título) gerada para WhatsApp e Instagram. *Feito em 28/out: a página publicada não tinha nenhuma tag og (o `SeoHead` tirava a prévia de toda página `noindex`); agora `previaSemBusca` liga só nas rotas `/c/` (o HTML do site da Carol não muda). Imagem da capa recortada pelo Cloudinary em 1200x630 JPG (`g_auto`), vídeo vira o primeiro quadro, sem foto vale a imagem do produto (`lib/previa.ts`). Medido: JPEG 1200x630, 55 KB.*
- [x] **DEV-145** Selo "Feito com Portfólio Creator" no site. *Funciona: rodapé "Feito com Portfólio Creator" na página publicada.*
- [x] **DEV-146** Cache e desempenho: página publicada abre rápido no 4G (meta: LCP abaixo de 2,5 s). *Feito em 28/out. Medido no build de produção com brotli (como o Cloudflare), 4G lento (1,6 Mbps, 150 ms) e CPU 4x: LCP de 5,1 s para 2,2 a 2,3 s (uma rodada com TTFB alto deu 2,65 s), FCP 0,4 a 0,7 s, CLS 0,04 a 0,06, 371 KB. O que mudou: imagem da capa pedida com prioridade alta no <head>; entrada da capa em CSS (o título ficava invisível até o JS, uns 6 s no 4G); tema calculado no servidor (a biblioteca de cores saiu do navegador); miniaturas dos vídeos como <img loading=lazy> em vez de poster; vídeo de fundo só baixa depois de montar; rotas `/c/` sem as fontes da Carol; hidratação depois do evento load (`client:carregada`, `src/diretivas/`). Cache: `s-maxage=60` na página, `private, no-store` nos links de marca (já existia).*

### E12. PDF do mídia kit

- [x] **DEV-150** Rota de impressão do mídia kit em 1 página A4. *Primeira versão em `/app/midia-kit/` (duas colunas, escala automática, PDF de 1 página pela impressão); precisa de aprovação visual.*
- [ ] **DEV-151** Geração do PDF pelo Cloudflare Browser Rendering e armazenamento no Supabase Storage.
- [ ] **DEV-152** Marca d'água "PORTFÓLIO CREATOR • TESTE" na conta grátis; selo no PDF pago. *28/out: a marca d'água agora depende do pagamento (antes `?marca=0` tirava); pago, sai o selo "Feito com Portfólio Creator". Na tela isso ainda dá para burlar pelo navegador: a garantia vem com o PDF gerado no servidor (DEV-151).*
- [ ] **DEV-153** Regerar o PDF a cada publicação.

### E13. Pedidos, pagamento e Slack

- [x] **DEV-160** Publicar cria o pedido em `orders` com o plano escolhido. *Feito em 28/out: ao publicar pela primeira vez ela escolhe PDF + link ou Site (`lib/planos.ts`, mesmos valores da página de vendas); um pedido de publicação aberto por vez, que muda de plano se ela trocar. O admin mostra nome e valor do plano, marca como pago pelo id do pedido e soma as vendas pagas.*
- [ ] **DEV-161** App do Slack: card do pedido com botões (Pago, Tirar do ar, Abrir no admin).
- [ ] **DEV-162** Link de pagamento colado na thread é salvo no pedido e enviado ao WhatsApp da creator.
- [ ] **DEV-163** Botão Pago: muda o status, publica de verdade, regera o PDF, avisa a creator.
- [ ] **DEV-164** Webhook do Slack verificado por assinatura; toda ação vai para o `audit_log`.

### E14. WhatsApp

- [ ] **DEV-170** Cliente da Cloud API (Meta) no servidor, com envio de modelos de mensagem.
- [ ] **DEV-171** Avisos: pedido recebido, link de pagamento, pago, no ar, edição perto de travar, conta excluída, marca abriu.
- [ ] **DEV-172** Webhook de entrada: respostas da creator caem na thread do pedido no Slack.
- [ ] **DEV-173** Registro de envios com status (entregue, erro) e reenvio.
- [ ] **DEV-174** Plano B por e-mail se o WhatsApp falhar ou não estiver aprovado.

### E15. Aviso de abertura

- [x] **DEV-180** "Mandar para uma marca": cria `brand_link` com código curto e monta a mensagem pronta com o link. *Funciona: Marcas cria o link com código curto, copia e abre o WhatsApp com a mensagem pronta.*
- [x] **DEV-181** Rota `/c/[slug]/[codigo]` serve o portfólio e registra a abertura. *Funciona: `/c/<link>/<código>` serve o portfólio e registra a abertura.*
- [x] **DEV-182** Filtro de prévias automáticas (robôs do WhatsApp, Instagram, e-mail): só conta com carregamento em navegador real. *Funciona: só conta depois de 2,5 s com a página à vista, em navegador (robôs de prévia não rodam o JS).*
- [x] **DEV-183** Não contar a própria creator (sessão ou aparelho reconhecido). *Funciona: com a sessão da creator no aparelho, a abertura não conta.*
- [ ] **DEV-184** Aviso no app e no WhatsApp na primeira abertura; contagem nas seguintes. *Em parte: a contagem aparece na lista Marcas; falta o aviso ativo no app e o do WhatsApp (precisa da API oficial).*
- [x] **DEV-185** Lista "Marcas" na área da creator (para quem mandou, quando, se abriu, quantas vezes). *Funciona: a lista Marcas mostra para quem mandou, quando, se abriu e quantas vezes.*

### E16. Planos, marca d'água e Premium

- [x] **DEV-190** Regras de acesso centralizadas (uma função "pode fazer X?") por momento: sem conta, grátis, pago, edição liberada, Premium. *Feito em 28/out: `lib/acesso.ts` (`acessoDa`), usada pelo servidor (que decide) e pela tela (que explica).*
- [x] ~~**DEV-191** Modelos liberados no teste e cadeado nos outros.~~ **Descartada (27/out/2026):** sem modelos; as seções montam o portfólio.
- [x] **DEV-192** Prazo de edição (até concluir + 7 dias) e trava sem tirar do ar. *Feito em 28/out: calculado na hora (sem tarefa agendada): vencido o prazo, o servidor recusa publicar mudanças, o portfólio continua no ar e a área mostra "Edição travada". O rascunho continua editável.*
- [x] **DEV-193** Edição liberada (assinatura ou avulsa) controlada pelo status do pedido. *Feito em 28/out: "Liberar a edição" no Início abre um pedido (mensal, anual ou 30 dias, `/api/pedido/edicao`); pago no admin, libera pelo período do plano a partir do pagamento. Cobrança recorrente automática fica para quando houver gateway de pagamento.*
- [ ] **DEV-194** Premium por molde (Site, Mídia kit, os dois) com validade.

### E17. LGPD

- [ ] **DEV-200** Páginas de Termos e Privacidade ligadas no cadastro e na compra.
- [ ] **DEV-201** Baixar meus dados: .zip só com textos, mídias enviadas, dados da conta e pedidos (nunca estilos, blocos ou PDF).
- [ ] **DEV-202** Excluir conta: confirmação por código, desativação por 7 dias com recuperação.
- [ ] **DEV-203** Exclusão definitiva agendada: apaga Cloudinary, Storage, banco e Auth, nessa ordem; mantém só registro de pagamentos. *Código feito em 28/out: `server/exclusao.ts` (ordem e regras), `apagarPastaDoUsuario` (Admin API do Cloudinary), `apagarUsuarioDoAuth`, rota `/api/interno/exclusoes` (chave de admin) chamada pelo cron diário do Worker (`scheduled` em `worker.ts`, `triggers` no wrangler). Storage ainda não é usado. **Falta você:** aplicar a migração `20261028000300_exclusao_definitiva.sql` (desliga o pg_cron antigo, que apagava o usuário deixando os arquivos e levando os pedidos; pedidos passam a ficar sem ligação com a pessoa) e pôr `ADMIN_TOKEN` e `CLOUDINARY_URL` como segredos do Worker. Até a migração, o pg_cron antigo continua valendo.*
- [ ] **DEV-204** E-mail de confirmação e card no Slack ao excluir.

### E18. Operação mínima

- [x] **DEV-210** Função de servidor para liberar e tirar Premium (chamada pelo Studio ou por um botão simples), com `audit_log`. *Funciona: Liberar e tirar Premium no admin, por `/api/admin/acao`, com registro.*
- [x] **DEV-211** Tirar portfólio do ar pela equipe. *Funciona: Tirar do ar e recolocar no admin, com registro.*
- [ ] **DEV-212** Consultas salvas no Studio: pedidos parados, creators novas, portfólios publicados na semana.

### E19. Página de vendas e lista de espera

- [ ] **DEV-220** Formulário de lista de espera salvando em `waitlist`, com aviso no Slack.
- [ ] **DEV-221** Textos do cupom conforme a decisão e botões apontando para `/app` quando o produto abrir. *Botões feitos (todos os "Testar agora" e "Quero este plano" levam a `/app/novo/`, commit `9226a90`). Falta só o texto do cupom, que depende da sua decisão (hoje: LANCAMENTO10, 10% até 30/11).*
- [ ] **DEV-097** Texto da página de vendas sem modelos: proposta em `docs/PROPOSTA-PAGINA-VENDAS-SEM-MODELOS.md`, aplicar só com aprovação.

### E20. Qualidade

- [ ] **DEV-230** Testes de ponta a ponta (Playwright, tamanho de celular): começar sem conta, montar, publicar, marca abrir. *28/out: `e2e/jornada.spec.ts` (iPhone 13): começar sem conta pelo assistente até o editor com as respostas, editar e recarregar sem perder, esconder pelo menu Mais e desfazer, modo Ver, "Entrar para publicar". Roda com `npm run test:e2e` sobre o build (5 testes passam). Publicar e a marca abrir precisam de conta e das rotas SSR: ficam nos roteiros com a conta de teste (`/tmp/rev/dev160.mjs`, `dev146-func.mjs`) até haver conta de teste no CI.*
- [ ] **DEV-231** Testes de RLS e de regras de acesso. *28/out: `supabase/tests/rls.sql` (transação desfeita no fim, com duas creators e uma assistente de mentira): creator só lê o que é dela, não altera nem apaga o projeto de outra, não muda estado/link/dono, não cria projeto no ar, pedido pago, Premium nem link no projeto alheio; equipe lê tudo e não grava direto; sem conta não vê nada. Rodado em 28/out contra o banco: tudo passou **menos a assistente**, que ainda grava direto (a migração `protecao` da DEV-034 fecha isso). As regras de acesso do app (`acessoDa`) têm o roteiro `/tmp/rev/acesso-check.ts`.*
- [ ] **DEV-232** Acessibilidade: contraste, foco visível, leitor de tela nos controles do editor (parte do editor planejada em 27/out: anel de foco dos blocos, foco entrando na gaveta, atalhos Ctrl/Cmd+Z, Shift+Ctrl/Cmd+Z, Delete esconde a seção, Esc). *Parte do editor feita em 28/out: anel de foco rosa com filete branco (3,8:1 na paleta padrão; antes 1,2:1); gavetas abrem com o foco no título e devolvem o foco a quem abriu; Ctrl/Cmd+Z, Shift+Ctrl/Cmd+Z e Ctrl+Y; Delete/Backspace escondem a seção selecionada (a Capa não); Esc tira a seleção e sai do modo Ver (o Esc que fecha a gaveta não tira a seleção); atalhos nas dicas dos botões; o botão Publicar anuncia as pendências; "Entendi" com 44 px. Falta: auditoria de leitor de tela no app inteiro (área, assistente, admin).*
- [ ] **DEV-233** Monitoramento de erros (Sentry) no editor, na API e no Worker. *28/out, sem Sentry por enquanto (precisa de conta e DSN, com você): erros do navegador nas páginas do app, do admin e do portfólio publicado vão para `/api/erro` (no máximo 5 por página, sem dado pessoal) e para o log do Worker; exceções das rotas SSR passam pelo `src/middleware.ts` (log com rota e pilha, resposta em português); `observability` ligado no wrangler (logs no painel do Cloudflare). Trocar por Sentry é só `src/app/erros.ts` e o middleware. O HTML do site da Carol não muda (conferido em pt e es).*
- [ ] **DEV-234** Proteção contra abuso: limite de envios, de chamadas de IA e de criação de links por conta. *28/out: limites técnicos em `lib/limites.ts` (confirmar valores): biblioteca de 300 arquivos e 3 GB (a assinatura de envio é recusada com explicação), 50 links de marca por dia, a mesma abertura de link em menos de 10 min conta uma vez. Links e mídias são gravados direto no banco pelo app, então o limite de verdade vem da migração `20261028000400_limites.sql` (triggers), **a aplicar por você**. IA ainda não existe no produto: limite entra junto com ela (DEV-195).*
- [x] **DEV-235** Validação de WhatsApp e e-mail enquanto a creator digita (pedido de 28/out). Uma regra só (`lib/formatos.ts`) no Contato do editor, na Conta, no login e na revisão: diz o que está errado em português e grava arrumado. Corrige o link do WhatsApp sem o 55, que abria a conversa errada. *Feito em 28/out, aprovado.*

## P1 — Logo depois do lançamento

### Adiado da versão 1

- [ ] **DEV-031** Entrar com Google.
- [ ] **DEV-103** Bio gerada pela IA a partir das respostas (servidor, com limite de uso por conta grátis).
- [ ] **DEV-195** Limite de IA na conta grátis. Depende: quantidade definida.

#### Leitura de prints (OCR + IA de reserva)

- [ ] **DEV-120** Conjunto de testes com os prints anotados e cálculo de acerto (`tests/ocr`).
- [ ] **DEV-121** Pré-processamento no canvas (tema, cinza, escala, limiar, barra de status, blocos).
- [ ] **DEV-122** Tesseract.js em Web Worker com modelos `por` e `eng` em cache.
- [ ] **DEV-123** Dicionário de rótulos PT/EN e classificação da tela.
- [ ] **DEV-124** Extração rótulo + número, listas com % e grade de reels.
- [ ] **DEV-125** Normalização de números (mil, mi, K, M, %, separadores por idioma) e períodos.
- [ ] **DEV-126** Validações e confiança por campo; consolidação dos prints da creator.
- [ ] **DEV-127** Reserva com IA no servidor: Haiku 5.5, depois Sonnet 5.5, saída em JSON com o mesmo formato.
- [ ] **DEV-128** Tela "Confere pra mim?" com destaque do número no print e confirmação.
- [ ] **DEV-129** Guia de prints com imagem de exemplo de cada tela.

### Outros


- [ ] **DEV-300** Admin em `/admin` com Refine + shadcn/ui e papel de equipe com verificação em duas etapas.
- [ ] **DEV-301** Admin: Painel (vendas, creators novas, publicados, pedidos parados).
- [ ] **DEV-302** Admin: Pedidos e Creators (com ver como ela vê e Premium).
- [ ] **DEV-303** Admin: Portfólios no ar, Mensagens, Mídias e espaço.
- [ ] **DEV-304** Admin: blocos e paletas (editar placeholders e dicas).
- [ ] **DEV-305** Admin: Planos e cupons, Exclusões, Uso do editor, Registro de ações, Configurações.
- [ ] **DEV-310** Cor própria e "usar a cor da minha foto" (extração de cor da biblioteca Material).
- [ ] **DEV-311** Revisão da Carol: pedido pago, fila no Admin, entrega por WhatsApp.
- [ ] **DEV-312** Plano Site: fluxo de domínio `.com.br`, ligação do domínio no Cloudflare.
- [ ] **DEV-313** Exportar o site (arquivos estáticos) mediante pagamento.
- [ ] **DEV-314** Botão "Fechei uma publi!" com pedido de depoimento e permissão.
- [ ] **DEV-315** Histórico de versões: cada publicação restaurável.
- [ ] **DEV-316** IA nos textos: "Melhorar", "Mais curto", "Mais meu jeito".

## P2 — Futuro

- [x] ~~**DEV-400** Os outros 10 modelos (Executivo, Editorial, Neon, Terra, Tropical, Assinatura, Cinema, Retrô, Placar, Galeria).~~ **Descartada (27/out/2026):** sem modelos; as seções montam o portfólio.
- [ ] **DEV-401** Blocos novos: Depoimento de marca, Galeria de fotos, Texto livre; terceira variação dos blocos.
- [ ] **DEV-402** Conectar o Instagram pela API (login, token criptografado, renovação, atualização diária, selo "números conferidos").
- [ ] **DEV-403** Login com código pelo WhatsApp.
- [ ] **DEV-404** Remover o selo como benefício de plano.
- [ ] **DEV-405** Pagamento automático (Mercado Pago com webhook).
- [ ] **DEV-406** Blocos salvos e botão "surpresa" de estilo.
