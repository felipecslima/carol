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

- [ ] **DEV-010** Projeto Supabase e migrations versionadas no repositório.
- [ ] **DEV-011** Tabela `profiles` (nome, @, WhatsApp, cidade, nicho, modo iniciante, papel). Depende: DEV-010.
- [ ] **DEV-012** Tabela `projects` (tipo site/mídia kit/os dois, modelo, paleta, blocos JSON, slug, status, prazo de edição). Depende: DEV-010.
- [ ] **DEV-013** Tabela `media` (id Cloudinary, tipo, tamanho, duração, capa, dono).
- [ ] **DEV-014** Tabela `orders` (projeto, plano, status, link de pagamento, thread do Slack, datas).
- [ ] **DEV-015** Tabela `premium_grants` (creator, molde, motivo, validade, quem liberou).
- [ ] **DEV-016** Tabelas `brand_links` (código, nome da marca, projeto) e `brand_opens` (código, data).
- [ ] **DEV-017** Tabelas `events` (eventos do editor) e `audit_log` (ações da equipe).
- [ ] **DEV-018** Tabela `waitlist` (nome, WhatsApp, @, data).
- [ ] **DEV-019** RLS em todas as tabelas: creator só lê e altera o que é dela; papel de equipe gravado no usuário, alterável só pelo servidor. Pronto quando: teste automatizado prova que uma creator não lê dados de outra.
- [ ] **DEV-020** Tipos TypeScript gerados do banco.

### E3. Autenticação

- [ ] **DEV-030** Login por e-mail com código de 6 dígitos (Supabase OTP), tela pensada para celular.
- [ ] **DEV-032** Sessão longa e renovação automática.
- [ ] **DEV-033** Começar sem conta: rascunho salvo no aparelho e migrado para a conta ao entrar. Pronto quando: o rascunho aparece igual depois do login.
- [ ] **DEV-034** Proteção das rotas `/app` e `/admin` por sessão e papel.

### E4. Área da creator

- [ ] **DEV-040** Layout com barra fixa de 4 abas (Início, Projetos, Mídias, Conta), áreas de toque de 44 px, safe areas do celular.
- [ ] **DEV-041** Início: cartão "próximo passo" calculado pelo estado do projeto, status dos pedidos e dicas.
- [ ] **DEV-042** Projetos: lista com miniatura, status e botão principal contextual (Continuar, Publicar, Copiar link). Limite de 1 site e 1 mídia kit.
- [ ] **DEV-043** Conta: dados, WhatsApp, plano e pagamentos.
- [ ] **DEV-044** Estados do projeto: rascunho, aguardando pagamento, no ar, edição travada, fora do ar. Pronto quando: cada estado tem teste.

### E5. Cores e temas

- [x] **DEV-050** Módulo de paleta com `@material/material-color-utilities`: de uma cor de origem e um esquema (Fidelity, Vibrant, Neutral...) gerar os papéis claro e escuro.
- [x] **DEV-051** Mapa de papéis para variáveis CSS (`--destaque`, `--fundo`, `--texto`...). Pronto quando: trocar a cor recalcula a página sem recarregar.
- [x] **DEV-052** Teste automático de contraste: todos os pares texto/fundo de todas as paletas passam 4,5:1.
- [x] **DEV-053** Tokens de modelo (fontes, cantos, respiro, ornamentos) separados das cores.

### E6. Blocos e modelos

- [x] **DEV-060** Contrato de bloco: tipo, variações, campos (com limite de letras), placeholders, regras (obrigatório, máximo). Pronto quando: um registro central lista os blocos.
- [x] **DEV-061** Bloco Capa (2 variações).
- [x] **DEV-062** Bloco Sobre mim (2 variações).
- [x] **DEV-063** Bloco Números (2 variações), escondido no modo iniciante.
- [x] **DEV-064** Bloco Vídeos (2 variações), com vídeo leve e capa.
- [x] **DEV-065** Bloco Marcas (2 variações), escondido no modo iniciante.
- [x] **DEV-066** Bloco Público (2 variações), escondido no modo iniciante.
- [x] **DEV-067** Bloco Formatos (2 variações).
- [x] **DEV-068** Bloco Contato (2 variações), obrigatório, com WhatsApp e e-mail validados.
- [ ] **DEV-069** Modelo Nuvem completo (tokens + 3 paletas). *Feito em código (`themes/modelos/nuvem.ts`, `blocks/blocos.css`); falta a aprovação visual do usuário.*
- [ ] **DEV-070** Modelo Clean. Depende: Nuvem aprovado.
- [ ] **DEV-071** Modelo Pop Color.
- [ ] **DEV-072** Modelo Casual.
- [ ] **DEV-073** Modelo Glow Rosé.
- [ ] **DEV-074** Mesmos blocos renderizando no editor (interativo) e no servidor (HTML puro). Pronto quando: teste compara as duas saídas.

### E7. Editor

- [ ] **DEV-080** Teste do Puck (1 a 2 dias) com decisão registrada.
- [ ] **DEV-081** Estado do editor (Zustand) com o JSON do projeto e histórico de desfazer/refazer (zundo).
- [ ] **DEV-082** Salvar sozinho com debounce, indicador "Salvo ✓" e fila offline que reenvia ao voltar a internet.
- [ ] **DEV-083** Seleção: primeiro toque no bloco, segundo no elemento; barra flutuante Editar, ↑, ↓, Esconder.
- [ ] **DEV-084** Gaveta de edição (Vaul) com campo focado, contador de letras, dica do bloco, teclado sem cobrir o campo.
- [ ] **DEV-085** Painel Seções: visíveis com ↑↓, Guardados com Devolver, Capa e Contato sem opção de remover.
- [ ] **DEV-086** Adicionar bloco: biblioteca com miniaturas no estilo do modelo atual; máximo de 15 blocos.
- [ ] **DEV-087** Trocar variação de um bloco.
- [ ] **DEV-088** Aba Estilo: modelo, paleta, fontes, cantos; troca instantânea com aviso "Desfazer".
- [ ] **DEV-089** Trocar modelo ou formato (site, mídia kit, os dois) sem perder conteúdo; o que não cabe vai para Guardados.
- [ ] **DEV-090** Placeholders com etiqueta "Exemplo · toque para trocar"; progresso "X de Y itens já são seus".
- [ ] **DEV-091** Modo Ver (sem interface) e modo iniciante.
- [ ] **DEV-092** Eventos do editor (bloco adicionado, guardado, placeholder trocado, modelo trocado, publicou).

### E8. Assistente de início

- [ ] **DEV-100** Escolha do modelo: cards em tela cheia, deslizando, com bolinhas de paleta.
- [ ] **DEV-101** Perguntas do assistente (nome, @, cidade, nicho, já fez publi, o que grava, frase).
- [ ] **DEV-102** Pedido de vídeos dentro do assistente (usa E9) e dos números (usa DEV-130).
- [ ] **DEV-104** Montagem do projeto: respostas, vídeos e números entram nos blocos; placeholder só onde faltou. Sem IA.

### E9. Mídias

- [ ] **DEV-110** Upload assinado direto do celular para o Cloudinary (pasta por creator).
- [ ] **DEV-111** Envio em segundo plano com barra no próprio card; editor continua usável.
- [ ] **DEV-112** Conversão de HEIC e .mov, compressão e capa automática (transformações do Cloudinary).
- [ ] **DEV-113** Trocar capa escolhendo o quadro do vídeo.
- [ ] **DEV-114** Limites de duração, tamanho e espaço com mensagens claras. Depende: limites definidos.
- [ ] **DEV-115** Corte de foto no formato do espaço com foco no rosto; aviso de foto escura ou pequena.
- [ ] **DEV-116** Aba Mídias: biblioteca, espaço usado, reaproveitar em qualquer projeto.

### E10. Números informados pela creator

- [ ] **DEV-130** Formulário de números (seguidores, visualizações, contas alcançadas, interações, público, views por reel) com período e guia visual de onde achar cada um no Insights. Grava no mesmo formato que a leitura de prints vai usar (`04-ocr-prints.md`, seção 3.2). Pronto quando: os números aparecem nos blocos Números e Público.
- [ ] **DEV-131** Selo "informado pela creator" e validações simples (percentuais que somam perto de 100, valores não negativos).

### E11. Publicação e páginas públicas

- [ ] **DEV-140** Revisão final: alertas vermelhos (placeholder, número de exemplo, sem contato) e amarelos.
- [ ] **DEV-141** Escolha do link `/nome`: regras de formato, checagem em tempo real, sugestões, nomes reservados.
- [ ] **DEV-142** Rota pública `/c/[slug]` renderizada no servidor a partir do JSON publicado, quase sem JavaScript.
- [ ] **DEV-143** Versão publicada separada do rascunho (editar não muda o que está no ar até publicar de novo).
- [ ] **DEV-144** Prévia do link (imagem e título) gerada para WhatsApp e Instagram.
- [ ] **DEV-145** Selo "Feito com Portfólio Creator" no site.
- [ ] **DEV-146** Cache e desempenho: página publicada abre rápido no 4G (meta: LCP abaixo de 2,5 s).

### E12. PDF do mídia kit

- [ ] **DEV-150** Rota de impressão do mídia kit em 1 página A4 por modelo.
- [ ] **DEV-151** Geração do PDF pelo Cloudflare Browser Rendering e armazenamento no Supabase Storage.
- [ ] **DEV-152** Marca d'água "PORTFÓLIO CREATOR • TESTE" na conta grátis; selo no PDF pago.
- [ ] **DEV-153** Regerar o PDF a cada publicação.

### E13. Pedidos, pagamento e Slack

- [ ] **DEV-160** Publicar cria o pedido em `orders` com o plano escolhido.
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

- [ ] **DEV-180** "Mandar para uma marca": cria `brand_link` com código curto e monta a mensagem pronta com o link.
- [ ] **DEV-181** Rota `/c/[slug]/[codigo]` serve o portfólio e registra a abertura.
- [ ] **DEV-182** Filtro de prévias automáticas (robôs do WhatsApp, Instagram, e-mail): só conta com carregamento em navegador real.
- [ ] **DEV-183** Não contar a própria creator (sessão ou aparelho reconhecido).
- [ ] **DEV-184** Aviso no app e no WhatsApp na primeira abertura; contagem nas seguintes.
- [ ] **DEV-185** Lista "Marcas" na área da creator (para quem mandou, quando, se abriu, quantas vezes).

### E16. Planos, marca d'água e Premium

- [ ] **DEV-190** Regras de acesso centralizadas (uma função "pode fazer X?") por momento: sem conta, grátis, pago, edição liberada, Premium.
- [ ] **DEV-191** Modelos liberados no teste e cadeado nos outros.
- [ ] **DEV-192** Prazo de edição (até concluir + 7 dias) e trava sem tirar do ar.
- [ ] **DEV-193** Edição liberada (assinatura ou avulsa) controlada pelo status do pedido.
- [ ] **DEV-194** Premium por molde (Site, Mídia kit, os dois) com validade.

### E17. LGPD

- [ ] **DEV-200** Páginas de Termos e Privacidade ligadas no cadastro e na compra.
- [ ] **DEV-201** Baixar meus dados: .zip só com textos, mídias enviadas, dados da conta e pedidos (nunca modelos, blocos ou PDF).
- [ ] **DEV-202** Excluir conta: confirmação por código, desativação por 7 dias com recuperação.
- [ ] **DEV-203** Exclusão definitiva agendada: apaga Cloudinary, Storage, banco e Auth, nessa ordem; mantém só registro de pagamentos.
- [ ] **DEV-204** E-mail de confirmação e card no Slack ao excluir.

### E18. Operação mínima

- [ ] **DEV-210** Função de servidor para liberar e tirar Premium (chamada pelo Studio ou por um botão simples), com `audit_log`.
- [ ] **DEV-211** Tirar portfólio do ar pela equipe.
- [ ] **DEV-212** Consultas salvas no Studio: pedidos parados, creators novas, portfólios publicados na semana.

### E19. Página de vendas e lista de espera

- [ ] **DEV-220** Formulário de lista de espera salvando em `waitlist`, com aviso no Slack.
- [ ] **DEV-221** Textos do cupom conforme a decisão e botões apontando para `/app` quando o produto abrir.

### E20. Qualidade

- [ ] **DEV-230** Testes de ponta a ponta (Playwright, tamanho de celular): começar sem conta, montar, publicar, marca abrir.
- [ ] **DEV-231** Testes de RLS e de regras de acesso.
- [ ] **DEV-232** Acessibilidade: contraste, foco visível, leitor de tela nos controles do editor.
- [ ] **DEV-233** Monitoramento de erros (Sentry) no editor, na API e no Worker.
- [ ] **DEV-234** Proteção contra abuso: limite de envios, de chamadas de IA e de criação de links por conta.

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
- [ ] **DEV-304** Admin: Modelos, blocos e paletas (ligar e desligar, editar placeholders e dicas).
- [ ] **DEV-305** Admin: Planos e cupons, Exclusões, Uso do editor, Registro de ações, Configurações.
- [ ] **DEV-310** Cor própria e "usar a cor da minha foto" (extração de cor da biblioteca Material).
- [ ] **DEV-311** Revisão da Carol: pedido pago, fila no Admin, entrega por WhatsApp.
- [ ] **DEV-312** Plano Site: fluxo de domínio `.com.br`, ligação do domínio no Cloudflare.
- [ ] **DEV-313** Exportar o site (arquivos estáticos) mediante pagamento.
- [ ] **DEV-314** Botão "Fechei uma publi!" com pedido de depoimento e permissão.
- [ ] **DEV-315** Histórico de versões: cada publicação restaurável.
- [ ] **DEV-316** IA nos textos: "Melhorar", "Mais curto", "Mais meu jeito".

## P2 — Futuro

- [ ] **DEV-400** Os outros 10 modelos (Executivo, Editorial, Neon, Terra, Tropical, Assinatura, Cinema, Retrô, Placar, Galeria).
- [ ] **DEV-401** Blocos novos: Depoimento de marca, Galeria de fotos, Texto livre; terceira variação dos blocos.
- [ ] **DEV-402** Conectar o Instagram pela API (login, token criptografado, renovação, atualização diária, selo "números conferidos").
- [ ] **DEV-403** Login com código pelo WhatsApp.
- [ ] **DEV-404** Remover o selo como benefício de plano.
- [ ] **DEV-405** Pagamento automático (Mercado Pago com webhook).
- [ ] **DEV-406** Blocos salvos e botão "surpresa" de estilo.
