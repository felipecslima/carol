# Handoff: site da Carol Limah (eucarollimah.com.br)

Atualizado em 23/out/2026. Cobre o portfólio e media kit da Carol: home, páginas por nicho, media kit em PDF e os três idiomas. A página de vendas do Portfólio Creator, que mora no mesmo código, tem o próprio handoff em `../HANDOFF-portfolio-creator.md`.

---

## 1. Propósito

O site é o **portfólio e media kit da Carol Limah** (@eu.carollimah), criadora de conteúdo amazonense que mora em São Paulo e mostra restaurantes, hotéis, pousadas e viagens com humor e sem roteiro decorado.

Ele existe para **gerar pedidos de parceria**. Uma visita deu certo quando a marca ou agência:

1. escreve para `parceria.eucarollimah@gmail.com` (o link já abre com assunto e roteiro do brief preenchidos),
2. chama no WhatsApp comercial (+55 12 99137-6550), ou
3. baixa o media kit em PDF.

**Para quem é:** marcas e agências de gastronomia, hotelaria, varejo e beleza, além de agências de influência. Chegam pelo link na bio, por indicação ou pela busca ("influenciadora gastronomia SP", "Carol Limah"). Querem decidir rápido se perfil, público e resultados combinam com a campanha. Os seguidores são público secundário.

**O argumento:** os reels passam bem do tamanho da base. São 58,4 mil seguidores e média de 242 mil views por reel, mais de quatro vezes o número de seguidores. As publis também entregam: os 10 reels para o Mercado Livre têm média de 480 mil views. O site inteiro é montado para que a marca **veja essa prova antes de ler qualquer argumento**.

### Princípios (de `PRODUCT.md`)
1. Toda afirmação sai de um dado confirmado em `src/data/content.ts`. Número ou fato novo só entra se a Carol confirmar.
2. A marca encontra a prova (vídeo, views, marca parceira) antes de ler argumento.
3. O contato fica sempre a um gesto de distância.
4. A personalidade da Carol é o diferencial: o texto soa como ela, não como agência.

### Regras de conteúdo que não se negociam
- **Nunca mencionar a avó da Carol** ("vozinha") no site, no PDF ou em textos novos. Ela faleceu e o assunto é doloroso.
- O tom visual é chique e editorial. Nada de ornamentos kitsch (✦, emojis decorativos, enfeites).
- Não inventar depoimentos, cases, imprensa, preços, pacotes ou taxa de engajamento. Nada disso existe confirmado.
- A voz é em primeira pessoa, espontânea, divertida e sincera. O original é em português do Brasil; o inglês e o espanhol seguem o mesmo tom.

---

## 2. Como foi pensado

### De onde veio
1. **Design em alta fidelidade** (`../design_handoff_carol_portfolio/`): protótipo em HTML de uma página, inspirado na estrutura de jumoura.com.br. A paleta espresso/caramelo e as fontes Instrument Serif + Hanken Grotesk vieram daí e são decisões fixas. O `README.md` dessa pasta é a especificação original.
2. **Catálogo dos vídeos** (`../CATALOGO-videos.md`): cada vídeo de `../medias/` foi transcrito com Whisper e analisado quadro a quadro. Títulos, marcas e views foram conferidos no próprio vídeo e casados com as capas do print da aba Reels, em vez de serem chutados.
3. **Rodadas de crítica** (`../HANDOFF-critique.md`): a página passou por várias críticas com o fluxo `/impeccable`, e a nota subiu de 20/32 para 24/32. O arquivo registra cada decisão, correção e pendência dessas rodadas.

### Direção visual: "The Late Table"
Uma mesa pouco iluminada no fim da noite: fundo espresso, texto creme e uma única luz caramelo que cai só nas palavras que importam. A leitura deve lembrar um caderno impresso de gastronomia e viagem, não uma página de links de creator.

- **Três fundos:** espresso (padrão), creme (a faixa do portfólio, onde está a prova) e caramelo (o convite final para o contato).
- **O caramelo aparece pouco:** só no trecho em itálico dos títulos, nos pontos do roteiro, na barra do maior número e na ação principal.
- **Números sempre na serif**, peso 400. A ênfase vem do itálico e da cor, nunca do negrito.
- **Sombras só em fotos e no que flutua.** Blocos de texto se separam por fios de 1px ou faixas de cor.

O sistema completo, com tokens, tipografia, componentes e o que fazer e evitar, está em `DESIGN.md`.

### Decisões tomadas no caminho
- **Hero:** a frase ficou ("Uma amazonense morando em São Paulo te levando em *lugares incríveis.*") com o H1 menor, para os botões e os três números caberem na primeira tela. O usuário descartou usar um número como título.
- **Filtros do portfólio** seguem o que a marca compra: Todos · Publis · Viagem & hospedagem · Gastronomia. Item com `brand` entra em Publis automaticamente.
- **Ordem do portfólio:** primeiro os reels de 1,1 mi e 1 mi, depois as publis por views, depois o resto por views.
- **Contato à prova de falha:** o `mailto` vem com o brief; o botão Copiar confirma a cópia e funciona mesmo se o Amplitude for bloqueado; há WhatsApp, PDF e o prazo "Respondo em até 2 dias úteis". No mobile, um CTA fixo aparece depois do hero e some quando o contato entra na tela.
- **Busca:** em vez de uma página só, há páginas por nicho escritas como **roteiros** (paradas com os vídeos de cada lugar), que respondem a buscas como "influenciadora restaurantes SP".
- **Três idiomas** para atender marcas e agências de fora: português na raiz, inglês em `/en/` e espanhol latino-americano neutro em `/es/`, com slugs, PDF e prévia de link próprios.

---

## 3. O que tem no site

### Home (`/`, `/en/`, `/es/`), na ordem da página
| Seção | O que mostra | De onde vêm os dados |
|---|---|---|
| Nav | Sobre · Portfólio · Resultados · Formatos, botão "Quero uma parceria" e seletor PT · EN · ES. Marca a seção atual | `ui.ts` |
| Hero (`#topo`) | Frase, texto de apoio, dois botões e três números: seguidores (com crescimento em 30 dias), views em 30 dias, média por reel. Colagem com fotos e um vídeo | `INSIGHTS`, `REELS_STATS` |
| Faixa animada | Lifestyle · *Viagens* · Experiências · *Gastronomia* · Moda · *UGC*, com botão de pausa | `ui.ts` (`marquee`) |
| Sobre (`#sobre`) | Quem é a Carol, temas e o e-mail em destaque sobre a foto | `ui.ts`, `EMAIL` |
| Portfólio (`#portfolio`) | Faixa creme com a grade de vídeos 9:16, filtros, botão "Ver todos" e links para os nichos. Cada card abre o lightbox | `MEDIA` |
| Resultados (`#resultados`) | Texto com os números do mês; comparação seguidores × média por reel × média do Mercado Livre; os 8 reels mais vistos em barras | `INSIGHTS`, `REELS_STATS`, `TOP_REELS` |
| Público (`#publico`) | Síntese em três frases, mais gênero, faixa etária e cidades | `AUDIENCE`, `audienceSummary` |
| Formatos (`#servicos`) | Reels & stories · Hotéis & pousadas · Restaurantes em SP · Vídeos UGC, cada um ligado ao seu nicho | `SERVICES` |
| Marcas (`#marcas`) | Faixa com as 22 marcas e lugares com quem já trabalhou | `BRANDS` |
| Contato (`#contato`) | Faixa caramelo: e-mail com Copiar, roteiro do brief, prazo, WhatsApp, PDF e redes | `EMAIL`, `BRIEF`, `RESPONSE_TIME`, `SOCIAL` |

### Páginas por nicho (`src/data/niches.ts`)
Cada página é um roteiro com paradas. Cada parada tem nome, região, texto e os vídeos do lugar. Um índice lateral acompanha a rolagem; no mobile, a parada atual aparece numa faixa na nav.

| Página (PT) | Paradas |
|---|---|
| `/restaurantes-em-sao-paulo/` | Sabores do Amazonas · Kome (Bela Vista) · Churrasco On Fire (Jacareí) · Gusto Cucina · Outras mesas |
| `/viagens-e-hospedagem/` | Jacareí e Igaratá · Campos do Jordão · Ilhabela · Pousada na mata · Dia de campo |
| `/publis-e-ugc/` | Mercado Livre · Restaurantes e eventos · Moda e beleza · Bem-estar · Vídeo UGC |

Regra: só entra como parada o lugar confirmado em `content.ts` ou no catálogo. Lugar sem nome confirmado não vira parada.

### Media kit (`/media-kit/`, noindex) → PDF
Uma página A4 com números, publis que entregaram, formatos, público e contato. É impressa em PDF por `npm run pdf` nos três idiomas (`public/carol-limah-media-kit.pdf`, `-en.pdf`, `-es.pdf`). Como os números vêm de `content.ts`, o PDF fica desatualizado sempre que esse arquivo muda e não é gerado de novo.

### Outros
- **404 própria** em cada idioma, com caminhos para a home e os nichos.
- **SEO:** título até 60 caracteres e descrição até cerca de 125; canonical; `og:image` por idioma; hreflang recíproco; JSON-LD (`ProfilePage`/`Person` na home, `CollectionPage` + `BreadcrumbList` nos nichos); `sitemap.xml` gerado no build; `robots.txt`.
- **Analytics:** Amplitude com autocapture e Session Replay em todas as páginas. Evento próprio: `Email Copied`.

---

## 4. Como foi construído

### Stack
| Peça | Escolha | Por quê |
|---|---|---|
| Framework | **Astro 7**, 100% estático, CSS embutido no HTML | Rápido, quase sem JS; todo o conteúdo cabe em arquivos de dados |
| Hospedagem | **Cloudflare Workers** com assets estáticos (`wrangler.jsonc`) | Domínio próprio, HTTPS, cache na borda, sem servidor |
| `src/server/worker.ts` | Redireciona `www` e `http` com 301 para `https://eucarollimah.com.br`; 404 por idioma; rotas SSR via adapter | Um endereço só para o Google |
| Vídeos | **Cloudinary** (conta `nepuxjxx`, plano Free, pasta `carol-limah/`) | Tira os MP4 do repositório; as capas são quadros do próprio vídeo |
| Fontes | Arquivos próprios em `public/fonts`, com preload | Sem Google Fonts atrasando o título do hero |
| Cache | `public/_headers`: HSTS; `_astro/` e `fonts/` imutáveis; `media/` por 30 dias | |
| PDF e prévias | **Playwright** (`scripts/`) | O PDF é impresso a partir de uma página do próprio site |

### Linha do tempo
| Data | O que entrou |
|---|---|
| 20/out | Portfólio e media kit; deploy no Cloudflare com o domínio; vídeos no Cloudinary; SEO e páginas por nicho; auditoria de velocidade (CLS 0,124 → 0,006, de 49 para ~20 requisições na home) |
| 22/out | Ajustes da revisão final; Amplitude; inglês e espanhol com seletor de idioma |
| 23/out | Prévia de link no idioma da página (`og-pt/en/es.jpg`); títulos com até 60 caracteres |

### Mapa do código
```
src/
  data/
    content.ts      ← fonte da verdade: e-mail, WhatsApp, brief, vídeos (MEDIA), capas (POSTER_T),
                      reels mais vistos, insights, público, marcas, formatos, redes
    niches.ts       ← páginas por nicho: paradas, textos e slugs nos 3 idiomas
  i18n/
    index.ts        ← idiomas, rotas por idioma, formato de números (58,4 mil / 58.4K)
    ui.ts           ← todos os textos de interface (pt/en/es)
    client.ts       ← textos usados pelos scripts no navegador
  views/            ← Home, MediaKit, Niche, NotFound (uma view serve os três idiomas)
  pages/            ← rotas finas que só chamam as views: /, en/, es/, [nicho], media-kit, 404, sitemap
  components/       ← SeoHead, MediaCard, Lightbox, LangSwitch, SiteFooter, Icons
  scripts/          ← main (faixa, nav, filtros, barras, copiar, CTA fixo), lightbox, menu, niche
  styles/global.css ← todo o sistema visual
scripts/            ← cloudinary-upload, media-kit-pdf, og-image
public/             ← PDFs, og-*.jpg, fontes, ícones, _headers, robots.txt
astro.config.mjs    ← site absoluto, CSS embutido, 404 por idioma
```

**Regra de arquitetura: o texto mora ao lado do dado.** Títulos de vídeos, nichos e formatos ficam traduzidos dentro de `src/data/`. Textos de interface ficam em `src/i18n/ui.ts`. As views não guardam texto solto, e os números chegam formatados no idioma por `num`, `numLong` e `pct`.

### Acessibilidade e qualidade já resolvidas
- O lightbox usa `<dialog>` nativo: foco preso, Esc fecha, setas navegam dentro da lista filtrada.
- A faixa animada tem botão de pausa e respeita `prefers-reduced-motion`; as barras só animam com JS e sem reduced-motion.
- O nav marca a seção atual com `aria-current`; há link "Pular para o conteúdo".
- O contraste foi revisado em cada fundo, e o anel de foco troca de cor junto com o fundo.
- Sem rolagem horizontal em 390px e 1440px; `impeccable detect` termina com 0 achados.

---

## 5. Operação do dia a dia

Todos os comandos rodam em `site/`.

| Tarefa | Como |
|---|---|
| Rodar local | `npm run dev` (porta 4321; também existe a config `site` em `../.claude/launch.json`) |
| Build | `npm run build` → `dist/client/` (site) e `dist/server/` (Worker) |
| Atualizar números | Editar `INSIGHTS`, `REELS_STATS`, `TOP_REELS` ou `AUDIENCE` em `content.ts` a partir de prints novos. Depois, `npm run pdf` |
| Media kit em PDF | `npm run pdf`. **Rodar sempre que mudar `content.ts`**: os PDFs ficam em `public/` e são commitados |
| Prévia de link | `npm run og`. Rodar sempre que mudar o título do hero (`heroH1` em `ui.ts`) |
| Vídeo novo | Converter para MP4 720×1280 → pôr em `media-backup/` → adicionar em `MEDIA` e em `POSTER_T` → `node scripts/cloudinary-upload.mjs media-backup` → `npm run pdf` |
| Marca nova | Acrescentar em `BRANDS` (só depois de a Carol confirmar a parceria) |
| Trocar o e-mail | Constante `EMAIL` em `content.ts`. Ela alimenta o Copiar, os `mailto`, o media kit e o rótulo do Sobre. Depois, `npm run pdf` |
| Texto novo | Nos três idiomas, em `ui.ts` ou ao lado do dado em `src/data/` |
| Deploy | O build roda no Cloudflare (por isso `PUBLIC_CLOUDINARY_CLOUD_NAME` fica em `.env.production`, versionado). Repositório: `github.com/felipecslima/carol`, branch `main` |

### Segredos e contas
- `.env` (fora do git): `CLOUDINARY_URL` (upload) e `PUBLIC_CLOUDINARY_CLOUD_NAME`. **O API secret do Cloudinary já foi colado num chat: gere um novo no painel (Settings → API Keys) e atualize o `.env`.**
- O Cloudinary está no plano Free (25 créditos por mês). Os vídeos vão sem transformação para não gastar créditos; só as capas usam `f_auto,q_auto`.
- A chave da Amplitude no HTML é a pública do projeto, que só envia eventos.
- Sem `PUBLIC_CLOUDINARY_CLOUD_NAME`, o site volta a usar os arquivos locais de `public/media`.

---

## 6. O que ainda falta

### Depende da Carol
- [ ] `v43`: a Carol aparece de uniforme no consultório. Fica no media kit? Com que título?
- [ ] Nomes que faltam: o restaurante do `v17` ("Jantar a dois"), a hospedagem em Ilhabela do `v21` (placa e fala dizem "Reserva") e se foi parceria, a festa do `v27` (palco "Sampa Tribal") e a pousada do `v30` (placa "…imê Pousada em…").
- [ ] **Arquivos dos reels mais vistos**, que não estão em `../medias/`: 762 mil (favoritos de beleza do Mercado Livre), "Eu sou do Amazonas" (760 mil), helicóptero (750 e 688 mil), 9.9 do Mercado Livre (683 mil) e outros. Com eles, o portfólio mostraria o melhor desempenho do perfil.
- [ ] URLs dos posts no Instagram, para um botão "Ver no Instagram" no lightbox.
- [ ] Opcional, mas marcas pedem: taxa de engajamento, alcance de stories (stories é vendido e não tem métrica), faixa de investimento ou pacotes.
- [ ] E-mail com domínio próprio (ex. `contato@eucarollimah.com.br`) via Cloudflare Email Routing + "Enviar como" do Gmail. Depois, trocar `EMAIL`.

### Melhorias que não dependem de ninguém
- [ ] Mobile: em 390×844 o rosto da Carol fica abaixo da dobra e a home tem cerca de 10,8 telas. Avaliar a colagem antes do texto ou uma foto menor no topo.
- [ ] O lightbox abre com foco em "Fechar". Avaliar focar o título ou a mídia.
- [ ] Derivar de `content.ts` os tópicos do Sobre que ainda estão escritos à mão.
- [ ] Limpeza: `p2.webp` e `p2-600.webp` não são mais usados.

### Pergunta de direção em aberto
- A identidade amazônica aparece só no texto e no selo "Amazonas → São Paulo". Um elemento visual (cor de rio, textura, foto regional) traria a origem para o visual. Todas as rodadas de crítica levantaram isso, e ainda não houve decisão.

---

## 7. Documentos de referência

| Arquivo | Conteúdo |
|---|---|
| `ARQUITETURA.md` | Arquitetura técnica: build, rotas, dados, idiomas, mídia, hospedagem, riscos |
| `PRODUCT.md` | Público, propósito, posicionamento, regras de marca e princípios |
| `DESIGN.md` | Sistema visual completo (tokens, tipografia, componentes, o que fazer e evitar) |
| `../HANDOFF-critique.md` | Histórico das críticas, decisões do usuário, dados do Instagram, tarefas e pendências |
| `../CATALOGO-videos.md` | Cada vídeo de `medias/`: marca, assunto, duração, views conferidas |
| `../design_handoff_carol_portfolio/` | Protótipo e especificação do design original |
| `.impeccable/` | Configuração e snapshots das críticas do fluxo `/impeccable` |
