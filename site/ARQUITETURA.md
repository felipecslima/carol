# Arquitetura: eucarollimah.com.br

Atualizado em 23/out/2026. Descreve como o código em `site/` está organizado e por quê. Cobre o site da Carol (home, nichos, media kit, 404) e a página de vendas do Portfólio Creator, que roda na mesma base. Para o propósito e o conteúdo, veja `HANDOFF.md`; para o sistema visual, `DESIGN.md`.

---

## 1. Visão geral

```
                    ┌──────────────────────── build (npm run build) ───────────────────────┐
 src/data/*.ts  ─┐  │                                                                       │
 src/i18n/*.ts  ─┼─►│  pages/ (rotas finas) ──► views/ (uma por tipo de página, 3 idiomas)  │──► dist/ (HTML estático,
 src/styles/    ─┤  │                              │                                        │     CSS embutido, JS em
 src/scripts/   ─┘  │                              └─► components/ (head, card, lightbox…)  │     _astro/, public/)
                    └───────────────────────────────────────────────────────────────────────┘
                                                                                               │
 scripts/*.mjs (Playwright, Cloudinary) ──► public/ (PDFs, og-*.jpg)  ◄── rodados à mão         │
                                                                                               ▼
 Navegador ──► Cloudflare Worker (src/server/worker.ts: 301 www/http → https; SSR em /api/) ──► ASSETS (dist/client/, _headers, 404.html)
     │
     ├──► res.cloudinary.com  (vídeos e capas dos vídeos)
     └──► cdn.amplitude.com   (analytics + Session Replay)
```

As páginas do site são **100% estáticas**: tudo vira HTML no build, a partir de arquivos TypeScript de dados. O código no servidor é um Worker (`src/server/worker.ts`) que faz os redirecionamentos e atende as rotas com `prerender = false` (hoje só `/api/ping`, de teste; a área `/app` do Portfólio Creator virá depois).

### Princípios que moldaram as escolhas
1. **Os dados são a fonte da verdade.** Números, vídeos, marcas e textos de conteúdo moram em `src/data/`. As views só montam a página a partir deles e não guardam texto solto.
2. **Um template, três idiomas.** Cada tipo de página é uma view só, que recebe `lang`. As rotas em `pages/` só escolhem o idioma.
3. **Funciona sem JavaScript.** O JS só melhora: filtros, lightbox, botão Copiar, animações. Sem ele, os links `mailto` funcionam, as barras aparecem cheias e todos os cards ficam visíveis.
4. **Pouco peso na primeira tela.** O CSS vai embutido no HTML, as fontes vêm do próprio domínio com preload, as capas carregam sob demanda e os vídeos só baixam no hover ou no lightbox.
5. **Sem dependências desnecessárias.** A única dependência de runtime é o Astro. Não há framework de UI, Tailwind nem biblioteca de componentes.

---

## 2. Stack

| Camada | Tecnologia | Versão / detalhe |
|---|---|---|
| Gerador | Astro | 7.4 (`astro` é a única dependência de produção) |
| Linguagem | TypeScript nos dados e scripts; `.astro` nas views | Sem `tsconfig.json`: vale o padrão do Astro e não há checagem de tipos no build |
| Runtime local | Node | 22 (usa `process.loadEnvFile`) |
| Hospedagem | Cloudflare Workers + Static Assets, com `@astrojs/cloudflare` | `wrangler.jsonc`, `src/server/worker.ts` |
| Vídeo | Cloudinary | Conta `nepuxjxx`, plano Free, pasta `carol-limah/` |
| Analytics | Amplitude | Browser SDK via CDN, região US, autocapture + Session Replay |
| Automação | Playwright (Chromium) | Gera PDFs, imagens de prévia e capturas do Portfólio Creator |
| Upload | SDK `cloudinary` | Só no script de upload (dependência de desenvolvimento) |

---

## 3. Repositório

```
carol/                          ← raiz do git (github.com/felipecslima/carol)
├── HANDOFF*.md, CATALOGO-videos.md
├── design_handoff_carol_portfolio/   protótipo do design original (sem os .mov)
├── medias/                     ✗ fora do git: originais da Carol (~4,7 GB)
├── portfolio-creator-handoff.zip ✗ fora do git (*.zip é ignorado)
└── site/                       ← o projeto Astro
    ├── src/                    código (seções 4 a 9)
    ├── public/                 arquivos servidos como estão
    ├── scripts/                geradores rodados à mão (seção 11)
    ├── media-backup/           ✗ fora do git: MP4 720p já enviados ao Cloudinary
    ├── dist/                   ✗ fora do git: saída do build (dist/client = site, dist/server = Worker)
    ├── .env                    ✗ fora do git: credenciais do Cloudinary
    ├── .env.production         versionado: só o cloud name público
    ├── .impeccable/            config e críticas do fluxo de design /impeccable
    ├── astro.config.mjs, wrangler.jsonc
    └── PRODUCT.md, DESIGN.md, HANDOFF.md, ARQUITETURA.md
```

**Atenção:** `medias/`, `media-backup/` e os dois `.zip` (o de mockups e o `portfolio-creator-handoff.zip`) **só existem nesta máquina**. Um clone novo não tem os vídeos originais nem a especificação do Portfólio Creator. Vale guardar cópias num drive.

---

## 4. Build e rotas

### `astro.config.mjs`
- `site: 'https://eucarollimah.com.br'`: base das URLs absolutas (canonical, `og:image`, JSON-LD, sitemap).
- `build.inlineStylesheets: 'always'`: o CSS vai dentro do HTML, sem um pedido extra bloqueando o primeiro desenho.
- Integração `localized-404`: o Astro gera `en/404/index.html`, mas o Cloudflare procura `en/404.html`. Depois do build, o hook renomeia os arquivos de `en` e `es`.

### Rotas → views
As rotas são finas: cada arquivo em `pages/` tem 4 a 9 linhas e só chama a view com o idioma.

| Rota (pt) | en / es | Arquivo | View |
|---|---|---|---|
| `/` | `/en/`, `/es/` | `pages/index.astro` | `Home` |
| `/restaurantes-em-sao-paulo/` etc. | slugs traduzidos | `pages/[nicho].astro` + `getStaticPaths` | `Niche` |
| `/media-kit/` (noindex) | `/en/media-kit/`, `/es/media-kit/` | `pages/media-kit.astro` | `MediaKit` |
| `404.html` | `en/404.html`, `es/404.html` | `pages/404.astro` | `NotFound` |
| `/portfolio-creator/` | só pt | `pages/portfolio-creator/index.astro` | `PortfolioCreator` |
| `/sitemap.xml` | (único) | `pages/sitemap.xml.ts` (endpoint) | gerado no build |

As páginas de nicho saem de `nicheStaticPaths(lang)` em `data/niches.ts`, que devolve `{ params: { nicho: slug }, props: { lang, niche } }` para cada nicho daquele idioma.

---

## 5. Camada de dados (`src/data/`)

| Arquivo | Conteúdo | Quem usa |
|---|---|---|
| `content.ts` | Contato (`EMAIL`, `WHATSAPP`, `BRIEF`, `mailto()`, `waHref()`), mídia (`MEDIA`, `POSTER_T`, `videoSrc()`, `posterSrc()`), categorias e filtros (`CAT_LABEL`, `FILTERS`, `groupsOf()`), números (`INSIGHTS`, `REELS_STATS`, `TOP_REELS`), público (`AUDIENCE`, `audienceSummary()`), `BRANDS`, `SERVICES`, `SOCIAL` | Todas as views do site da Carol, o card, o lightbox, o SeoHead |
| `niches.ts` | Nichos e paradas (`SRC`), derivados por idioma (`nichesIn`, `nichePath`, `nicheAlternates`, `nicheStaticPaths`, `stopMedia`, `topViews`) | `Niche`, `Home` (links), `SiteFooter`, `sitemap` |
| `portfolio-creator.ts` | Config `PC`, textos, modelos, planos, FAQ | Só `PortfolioCreator` e o `sitemap` (`PC_PATH`) |

### Modelo de dados
```ts
type L<T = string> = Record<'pt' | 'en' | 'es', T>   // o mesmo valor nos três idiomas

interface MediaItem {
  video: boolean;     // vídeo (Cloudinary) ou foto (public/media/<id>.webp)
  id: string;         // v44, p4… é o nome do arquivo e o public_id no Cloudinary
  cat: Cat;           // categoria; vira rótulo traduzido por CAT_LABEL
  title: L;
  brand?: string;     // presença de marca → entra no filtro "Publis"
  views?: string;     // só quando a capa do print da aba Reels foi casada com o vídeo
}
```

### Convenções
- **Números são escritos como o Instagram mostra em português** (`'1,1 mi'`, `'478 mil'`, `'+11,9%'`). O valor numérico vai num campo à parte quando a página precisa calcular, por exemplo `followersK: 58.4` para a escala das barras. A tradução para outros idiomas é feita na renderização (seção 6).
- **Derivar em vez de repetir.** A síntese do público, o "mais de N vezes", a contagem de cada filtro e as 6 publis do media kit são calculadas a partir dos dados. Mudar um número em um lugar atualiza todas as páginas.
- **Ordem significa algo.** `MEDIA` está na ordem em que aparece na grade (reels de 1 mi primeiro, depois publis por views). `TOP_REELS` está do mais visto para o menos visto, e o primeiro define 100% da escala.

---

## 6. Internacionalização (`src/i18n/`)

| Arquivo | Papel |
|---|---|
| `index.ts` | `LANGS`, tipo `L`, `LOCALE`/`OG_LOCALE`, rotas (`home()`, `sameIn()`, `mediaKitPdf()`) e formatação de números (`num`, `numLong`, `pct`) |
| `ui.ts` | Todos os textos de interface das páginas, num objeto por idioma (`UI.pt`, `UI.en`, `UI.es`). O tipo `UI` é inferido do `pt`, então faltar uma chave em `en` ou `es` é erro de tipo no editor. Textos com variáveis são funções |
| `client.ts` | Textos dos scripts do navegador. O idioma é lido do `<html lang>` na hora |

**Estratégia de URL:** o português fica na raiz e os outros idiomas em prefixos (`/en/`, `/es/`). Páginas sem slug traduzido usam `sameIn('media-kit/')`; os nichos têm slug próprio por idioma em `niches.ts`.

**Ligação entre idiomas:** toda view calcula `alternates: L` (o caminho da mesma página em cada idioma) e passa para o `SeoHead` (hreflang, `og:locale:alternate`) e para o `LangSwitch` (seletor PT · EN · ES). O `sitemap.xml` repete as mesmas alternâncias. O Portfólio Creator passa só `{ pt }` e fica sem hreflang.

**Números:** `num('478 mil', 'en')` → `478K`; `num('1,1 mi', 'es')` → `1,1 M`; `numLong('1,67 mi', 'pt')` → `1,67 milhão`; `pct(67.7, 'es')` → `67,7 %`. `parseNum` lança erro se o formato for desconhecido, então um número mal escrito quebra o build em vez de sair errado na página.

**Onde mora cada texto:** interface em `ui.ts`; conteúdo (título de vídeo, nicho, formato) ao lado do dado, em `src/data/`; mensagens de e-mail e WhatsApp em `content.ts` (`MAIL`).

---

## 7. Views e componentes

### Views (`src/views/`)
Cada view é uma página HTML completa (`<html>`, `<head>` com `SeoHead`, `<body>`) e importa o próprio CSS e script.

| View | Monta | Script do navegador |
|---|---|---|
| `Home` | Hero, sobre, portfólio, resultados, público, formatos, marcas, contato. Calcula escalas das barras, JSON-LD `ProfilePage`/`Person` | `scripts/main.ts` |
| `Niche` | Trilha, roteiro de paradas com índice lateral, outros roteiros, contato. JSON-LD `CollectionPage` + `BreadcrumbList` | `scripts/niche.ts` |
| `MediaKit` | Uma folha A4 (`@page { size: A4 }`) com `<head>` próprio e `noindex`. Feita para ser impressa | nenhum |
| `NotFound` | 404 com nav simples e caminhos para a home e os nichos | nenhum |
| `PortfolioCreator` | Página de vendas; reaproveita classes e estrutura da home | `scripts/portfolio-creator.ts` |

### Componentes (`src/components/`)
| Componente | Responsabilidade |
|---|---|
| `SeoHead` | Tudo do `<head>`: título, descrição, canonical, hreflang, Open Graph/Twitter, JSON-LD, ícones, preconnect do Cloudinary, preload das fontes e o script da Amplitude. Aceita `noindex`, `og`, `themeColor` e `preload` próprios |
| `MediaCard` | Card 9:16 como `<button>`. Leva os dados do item em `data-*` (`id`, `video`, `title`, `brand`, `views`, `groups`, `cat`), que o filtro e o lightbox leem. Capa em `<img loading="lazy">` e `<video preload="none">` por cima |
| `Lightbox` | Esqueleto do `<dialog>`; o conteúdo é preenchido pelo script |
| `LangSwitch` | Seletor de idioma, com `aria-current` no idioma atual |
| `SiteFooter` | Logo, links dos nichos (também servem de ligação interna para a busca), redes |
| `Icons` | Sprite SVG (`#i-play`, `#i-eye`) usado pelos cards com `<use>` |

---

## 8. JavaScript no navegador (`src/scripts/`)

Módulos TypeScript empacotados pelo Astro (Vite) e carregados por um `<script>` no fim de cada view.

| Módulo | Faz |
|---|---|
| `main.ts` (home) | Pausa da faixa animada; nav com `aria-current` por `IntersectionObserver`; filtros (12 primeiros itens em "Todos" + botão "Ver todos"); barras que animam ao entrar na tela; botão Copiar com evento `Email Copied` e plano B (seleciona o texto se a área de transferência falhar); CTA fixo no mobile |
| `lightbox.ts` | `initLightbox(lista)` abre o `<dialog>` com vídeo (começa mudo, autoplay se não houver reduced-motion) ou foto, navega em loop pela lista visível e devolve o foco ao card ao fechar. `bindCards` toca o vídeo do card no hover ou foco |
| `menu.ts` | Menu mobile da home e dos nichos: abre e fecha, fecha com Esc, com clique fora e ao escolher um link |
| `niche.ts` | Lightbox com todos os cards da página; índice do roteiro que acende a parada atual e mostra a parada numa faixa da nav no mobile |
| `portfolio-creator.ts` | Menu, pausa da faixa, entrada dos modelos em sequência, CTA fixo no mobile |

**Padrões em todos os scripts:**
- **Melhoria progressiva:** o elemento que depende de JS nasce `hidden` no HTML (botão Copiar, CTA fixo, botão de pausa) e o script o revela.
- **`prefers-reduced-motion`:** lido uma vez; desliga autoplay, hover play, animação das barras e a faixa.
- **Detecção de recurso:** `IntersectionObserver` e `navigator.clipboard` são testados antes de usar.
- **A lista do lightbox é uma função** (`() => HTMLElement[]`), para respeitar o filtro do momento.

---

## 9. CSS (`src/styles/`)

- **`global.css`** (cerca de 460 linhas) é o sistema inteiro, em blocos por seção: fontes → `:root` (tokens) → base → nav → hero → faixa → sobre → portfólio → lightbox → resultados → público → formatos → contato → CTA fixo → nichos → reduced-motion → print → 404.
- **Tokens** em variáveis CSS no `:root` (`--bg`, `--text`, `--accent`, `--serif`, `--sans` etc.); a lista completa está no topo do `DESIGN.md`.
- **Fontes próprias** em `public/fonts`: Instrument Serif (normal e itálico) e Hanken Grotesk (variável 400–700), cada uma com subconjunto `latin` e `latin-ext` por `unicode-range`. Só os dois arquivos `latin` do primeiro desenho têm preload.
- **Breakpoints:** 480px (ações empilhadas), 720px (menu mobile, grade de 2 colunas, CTA fixo), 860px (texto fixo nos resultados), 1000px (hero e nicho em duas colunas). As grades usam `auto-fit/auto-fill` com `minmax(min(100%, Npx), 1fr)` e se adaptam sem breakpoint na maior parte dos casos.
- **Portfólio Creator:** `portfolio-creator.css` só redefine os tokens dentro de `.pc` (marrom, creme, rosa) e acrescenta o que é exclusivo da página. A estrutura vem do `global.css`.
- **Media kit:** usa o `global.css` e tem estilos próprios embutidos (`<style is:global>`) para a folha A4.

---

## 10. Mídia

| Tipo | Onde fica | Como chega à página |
|---|---|---|
| Vídeos do portfólio | Cloudinary `carol-limah/<id>.mp4` (cópia local em `media-backup/`) | `videoSrc(id)`: o MP4 original, sem transformação (`f_auto,q_auto` deixava o arquivo maior e gastava créditos) |
| Capas dos vídeos | Geradas pelo Cloudinary a partir do vídeo | `posterSrc(id, w)` → `so_<segundo>,w_<w>,f_auto,q_auto`. O segundo vem de `POSTER_T`. Duas larguras no `srcset` (360 e 720) |
| Fotos | `public/media/<id>.webp` e `<id>-600.webp` | `srcset` 600w/1100w |
| Capas dos reels mais vistos | `public/media/reels/r<k>.webp` | Recortes do print da aba Reels |
| Imagens do Portfólio Creator | `public/media/pc/` | Geradas por `portfolio-creator-shots.mjs` |

**Alternância local/Cloudinary:** se `PUBLIC_CLOUDINARY_CLOUD_NAME` não estiver definido, `videoSrc` e `posterSrc` apontam para `/media/`. Como os MP4 saíram de `public/media`, isso só funciona se você copiar os vídeos de volta para lá; na prática, o `.env` local precisa do cloud name.

**Carregamento:** a capa é um `<img loading="lazy">` (o `poster` do `<video>` baixaria todas de uma vez). O `<video>` do card tem `preload="none"` e só baixa no hover. O lightbox cria o `<video>` na hora e o destrói ao fechar. Na home, isso reduziu de 49 para cerca de 20 requisições.

---

## 11. Geradores (`site/scripts/`)

São rodados à mão, não fazem parte do build. **Os arquivos que eles geram são commitados**, porque o build no Cloudflare não roda Playwright.

| Script | Comando | Gera | Rodar quando |
|---|---|---|---|
| `media-kit-pdf.mjs` | `npm run pdf` (faz o build antes) | `public/carol-limah-media-kit{,-en,-es}.pdf` | Mudar `content.ts`, `ui.ts` (textos `mk*`) ou o `MediaKit` |
| `og-image.mjs` | `npm run og` | `public/og-{pt,en,es}.jpg` (1200×630) | Mudar o título do hero |
| `cloudinary-upload.mjs` | `node scripts/cloudinary-upload.mjs media-backup [--force]` | Vídeos no Cloudinary | Entrar vídeo novo em `MEDIA` |
| `portfolio-creator-shots.mjs` | `node scripts/portfolio-creator-shots.mjs <pasta do handoff>` | `public/media/pc/*` | Mudar o protótipo do Portfólio Creator |

Detalhes que importam:
- **PDF:** serve o `dist/` com um servidor HTTP próprio em porta aleatória, porque o `astro preview` do Astro 7 vira daemon e trava a segunda execução. Espera `document.fonts.ready` antes de imprimir e copia o PDF também para `dist/`.
- **OG:** o título está **repetido dentro do script** (não lê `ui.ts`). Se mudar `heroH1`, mude também em `og-image.mjs`. As fontes vêm do Google Fonts só nesse script; a foto vem de `scripts/og-photo.png`.
- **Upload:** lê os IDs de vídeo direto do texto de `content.ts` (regex `video: true, id: 'vNN'`). Uma mudança no formato dessa linha quebra o upload. Pula vídeos que já existem, a não ser com `--force`.
- **Capturas do Portfólio Creator:** os `.dc.html` do protótipo dependem de um runtime que não vem no pacote. O script preenche os valores no Node e só então abre a página no Chromium.

---

## 12. SEO e metadados

- **Por página:** título (até 60 caracteres) e descrição (até cerca de 125) vêm de `ui.ts` ou `niches.ts`. Canonical absoluto; `noindex` no media kit e na 404.
- **Prévia de link:** `og-<idioma>.jpg` por padrão; o Portfólio Creator passa a sua. `og:type=profile` na home.
- **Dados estruturados:** a home declara `ProfilePage` com `Person` (`@id` fixo na home em português, para os três idiomas apontarem para a mesma pessoa) e `sameAs` com Instagram e Threads. Os nichos declaram `CollectionPage` + `BreadcrumbList`.
- **Sitemap:** endpoint `sitemap.xml.ts` gerado no build: home e nichos nos três idiomas com `xhtml:link hreflang` e `x-default`, mais o Portfólio Creator. `robots.txt` em `public/`.
- **Ligação interna:** nichos linkados nos formatos, no portfólio e no rodapé.

---

## 13. Analytics

O `SeoHead` carrega o script da Amplitude (chave pública do projeto) em todas as páginas que o usam, ou seja, todas menos o media kit. A configuração é autocapture (cliques, páginas, formulários) e Session Replay com `sampleRate: 1` (todas as sessões), na região US.

Há um evento próprio, `Email Copied`, disparado pelo `main.ts` depois que a cópia dá certo. O código usa `window.amplitude?.track`, então, se um bloqueador barrar o CDN, o site segue funcionando sem erro.

---

## 14. Hospedagem e entrega

### Cloudflare Workers (`wrangler.jsonc`)
```jsonc
{ "main": "./src/server/worker.ts",
  "assets": { "binding": "ASSETS", "run_worker_first": true, "not_found_handling": "404-page" } }
```
- **Adapter (`@astrojs/cloudflare`, `output: 'static'`):** o `astro build` gera `dist/client/` (o site, com `_headers` e `404.html`) e `dist/server/` (Worker e `wrangler.json` final). `assets.directory` vem do adapter. `session: false` evita o KV `SESSION` que ele criaria sozinho; `imageService: 'passthrough'` evita o Cloudflare Images.
- **`run_worker_first`:** toda requisição passa pelo Worker antes dos arquivos.
- **`src/server/worker.ts`:** (1) se o host for `www.eucarollimah.com.br` ou o protocolo for `http`, responde 301 para `https://eucarollimah.com.br` mantendo o caminho (regra em `src/server/redirects.ts`, com teste); (2) entrega o resto ao adapter, que serve os estáticos e as rotas SSR; (3) se o adapter devolver 404 para uma página, pede ao `ASSETS`, que serve a `404.html` mais próxima (cada idioma tem a sua).
- **Rotas SSR:** só com `export const prerender = false` (hoje `src/pages/api/ping.ts`). O resto continua estático.
- **Testar local sem publicar:** `npm run build` e `npx wrangler dev --config dist/server/wrangler.json`.
- **Atenção no deploy:** a pasta servida mudou de `dist/` para `dist/client/` e o Worker é gerado em `dist/server/`. Antes de publicar, conferir no painel do Cloudflare (Builds) o comando de build e se o deploy usa o `wrangler.json` gerado (`wrangler deploy` lê `.wrangler/deploy/config.json` e já aponta para ele).

### Pastas do produto (Portfólio Creator)
Cada uma tem um `README.md` com a regra. Aliases do TypeScript (`tsconfig.json`, também no Vitest): `@app/*`, `@blocks/*`, `@themes/*`, `@lib/*`, `@server/*`.

| Pasta | Responsabilidade | Pode importar |
|---|---|---|
| `src/app/` | ilha React da creator em `/app` (área, editor, assistente) | `blocks`, `themes`, `lib` |
| `src/blocks/` | `registro.ts` (lista central dos blocos), um componente React por bloco (`Capa.tsx`…), `Bloco.tsx` (despachante), `blocos.css` (pele só com variáveis de tema), `exemplos.ts` (projeto de exemplo, tudo `exemplo: true`); **uma renderização só**, no editor e na página publicada | `themes`, `lib` |
| `src/themes/` | `paleta.ts` (cor de origem → 9 papéis claro/escuro, regra Material 3, contraste verificado), `tokens.ts` (fontes, cantos, respiro, ornamentos), `aplicar.ts` (variáveis CSS no elemento ou como `style` inline), `modelos/nuvem.ts` (primeiro modelo: estilo e 3 paletas) | nada do produto |
| `src/lib/` | `bloco.ts` (contrato de bloco e schema dos dados), `projeto.ts` (schema Zod do projeto, `validarProjeto`, limite de 15 blocos, modo iniciante), regras de acesso | nada de `app`, `blocks`, `server` |
| `src/server/` | só no Worker: Supabase (service role), Slack, WhatsApp, IA, PDF, redirects | `lib` |
| `src/ocr/` | reservada para a leitura de prints (depois da v1) | — |
| `../supabase/migrations/` | SQL versionado (na raiz do repositório) | — |

Prévia visual dos blocos (só em `npm run dev`, 404 em produção): `/app/blocos/?paleta=0..2&modo=claro|escuro`.

Dependência só para dentro: `app → blocks → themes/lib`; `server → lib`. Segredos nunca chegam a `app/` nem a `blocks/`.

### Rotas do produto (Portfólio Creator)
Todas fora da busca (`noindex`) e sem Amplitude (`analytics={false}` no `SeoHead`).

| Rota | O que é | Arquivo |
|---|---|---|
| `/app/` | entrada: leva ao assistente ou ao editor conforme haja rascunho | `app/App.tsx` |
| `/app/novo/` | assistente: modelo, 7 perguntas, vídeos e números (sem IA) | `app/assistente/`, `lib/montagem.ts` |
| `/app/editor/` | editor mobile: seleção por toque, gaveta de edição, Seções, Adicionar, Mídias, Estilo, Publicar (revisão final e link), Ver, números | `app/editor/` |
| `/app/midia-kit/` | mídia kit em 1 página A4 (mesmos blocos, escala automática, marca d'água de teste, PDF pela impressão) | `app/midia-kit/` |
| `/app/blocos/` | prévia dos blocos e do modelo Nuvem (só em `npm run dev`; 404 em produção) | `pages/app/blocos.astro` |
| `/api/upload/assinatura` | assina o envio de foto/vídeo ao Cloudinary (SSR) | `pages/api/upload/assinatura.ts` |
| `/api/ping` | teste do servidor (SSR) | `pages/api/ping.ts` |

**Estado hoje:** tudo salva no aparelho (`localStorage`: rascunho `pc:rascunho:v1`, mídias `pc:midias:v1`, aparelho `pc:aparelho`). Não há login, banco ligado nem publicação: a E2 (banco), E3 (login) e E11 a E13 (publicar, pedidos) dependem de um projeto Supabase novo. As migrations já estão em `supabase/migrations/` (validadas em PGlite, ainda não aplicadas) e o roteiro de RLS em `supabase/tests/rls.mjs`.

**Módulos de `src/lib/` (puros, sem interface):** `bloco.ts` (contrato), `projeto.ts` (schema do projeto e validação), `operacoes.ts` (mover, esconder, devolver…), `montagem.ts` (respostas → projeto), `numeros.ts` (números informados e seu preenchimento nos blocos), `progresso.ts` ("X de Y já são seus"), `revisao.ts` (alertas vermelhos e amarelos), `slug.ts` (link `/c/<link>`).

### Qualidade de código (`npm run check`)
Roda, em ordem: `astro check` (TypeScript estrito, inclusive `.astro`), ESLint, Prettier (só confere) e Vitest. Individuais: `npm run typecheck`, `lint`, `format:check`, `format` (reescreve), `test`; e2e à parte com `npm run test:e2e` (precisa do `npm run build` antes).
- **Escopo:** lint e Prettier valem só para o código do produto (`src/app`, `blocks`, `themes`, `lib`, `server`, `pages/app`, `pages/api`, `e2e` e configs). O site da Carol não é reformatado nem lintado (ver `eslint.config.js` e `.prettierignore`); o TypeScript estrito vale para tudo e já passa.
- **TypeScript 6, não 7:** `typescript-eslint` e `astro check` ainda não suportam o 7. Voltar ao 7 quando suportarem.
- **Sem `eslint-plugin-jsx-a11y`:** ainda não suporta o ESLint 10; acessibilidade fica nas revisões de design e no Playwright.

### Envio de fotos e vídeos (Cloudinary)
`POST /api/upload/assinatura` (`src/pages/api/upload/assinatura.ts`, SSR) assina `folder`, `timestamp` e `allowed_formats` com o segredo (`src/server/cloudinary.ts`); o celular envia o arquivo direto a `api.cloudinary.com` (`src/app/editor/upload.ts`, com progresso) na pasta `creators/<aparelho>`. A página usa só endereços de entrega transformados: foto `f_auto,q_auto,w_1200`, vídeo `f_mp4,q_auto,w_720` e capa `so_0` (quadro 0). Pendente: exigir sessão, limites definitivos, quadro de capa escolhido, corte com foco no rosto.

### Variáveis de ambiente e segredos
- **Onde estão declaradas:** `env.schema` em `astro.config.mjs`. Públicas (`PUBLIC_*`, vão para o navegador): `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`. Segredos (só servidor): `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_URL`, `SLACK_WEBHOOK_URL`, `WHATSAPP_TOKEN`, `AI_API_KEY`. Todas opcionais até as contas existirem.
- **Como ler:** `import { X } from 'astro:env/server'` (segredos, só em `src/server/` e rotas SSR) ou `astro:env/client`. O Astro recusa importar segredo no código do navegador. `PUBLIC_CLOUDINARY_CLOUD_NAME` continua em `import.meta.env`, como antes.
- **Local:** copiar `.env.example` para `.env` (Astro) e `.dev.vars.example` para `.dev.vars` (`wrangler dev`). Ambos ignorados pelo Git; `.env.production` (só o nome público do Cloudinary) é versionado.
- **Produção:** segredos com `npx wrangler secret put NOME`; públicos em `vars` no `wrangler.jsonc`. Nada de chave real no Git.
- **Teste:** `e2e/segredos.spec.ts` falha se o build do navegador contiver o nome de algum segredo. `/api/ping` mostra `true`/`false` por segredo, só em desenvolvimento.

### Cabeçalhos (`public/_headers`)
| Caminho | Cabeçalho |
|---|---|
| `/*` | `Strict-Transport-Security: max-age=31536000` |
| `/_astro/*`, `/fonts/*` | `Cache-Control: public, max-age=31536000, immutable` (o nome muda quando o conteúdo muda) |
| `/media/*` | `Cache-Control: public, max-age=2592000` (30 dias; arquivos podem ser trocados com o mesmo nome) |

### Deploy
O build roda no Cloudflare a partir do repositório no GitHub (branch `main`). Por isso `PUBLIC_CLOUDINARY_CLOUD_NAME` fica em `.env.production`, versionado. *(Inferido pela estrutura do repositório; confirme no painel do Cloudflare se é Workers Builds ou `wrangler deploy` manual.)*

---

## 15. Variáveis de ambiente e segredos

| Variável | Arquivo | Pública? | Uso |
|---|---|---|---|
| `PUBLIC_CLOUDINARY_CLOUD_NAME` | `.env` e `.env.production` | Sim (vai no HTML) | URLs de vídeos e capas |
| `CLOUDINARY_URL` | só `.env` | **Não** | Upload (`cloudinary://KEY:SECRET@CLOUD`) |
| Chave da Amplitude | no código (`SeoHead`) | Sim | Só envia eventos |

**O API secret do Cloudinary já foi colado num chat: gere um novo no painel (Settings → API Keys) e atualize o `.env`.**

---

## 16. Qualidade, testes e ferramentas

- **Testes automatizados:** o `package.json` tem `test:e2e` (Playwright), mas **não há testes nem `playwright.config`**. A verificação até aqui foi manual, em 1440×900 e 390×844, mais as críticas do `/impeccable`.
- **Checagem de tipos:** não há `tsconfig.json` nem `astro check` no fluxo. O editor aponta erros, mas o build não falha por tipo.
- **Fluxo de design:** `.impeccable/` guarda a configuração (inclusive exceções aceitas pelo detector) e os snapshots das críticas. O `impeccable detect` deve terminar com 0 achados.
- **Skills de agente** instaladas no repositório: `.claude/skills/` (`frontend-design`, `design-taste-frontend`), registradas em `skills-lock.json`.
- **Rodar local:** `npm run dev` na porta 4321, ou a configuração `site` em `../.claude/launch.json`.

---

## 17. Como estender

**Vídeo novo no portfólio**
1. Converter para MP4 720×1280 e pôr em `media-backup/<id>.mp4`.
2. Acrescentar o item em `MEDIA` (na posição da ordem) e o segundo da capa em `POSTER_T`.
3. `node scripts/cloudinary-upload.mjs media-backup`, depois `npm run pdf`.
4. Se ele pertence a uma parada de nicho, incluir o `id` em `ids` da parada em `niches.ts`.

**Nicho novo:** acrescentar um item em `SRC` (`niches.ts`) com `key`, `slug`, textos `L` e paradas. Rotas, rodapé, sitemap, hreflang e seletor de idioma se atualizam sozinhos. Para aparecer em Formatos, aponte `SERVICES[].niche` para a `key`.

**Página nova:** criar a view em `views/` recebendo `lang`, usar `SeoHead` com `alternates`, criar as três rotas finas em `pages/`, `pages/en/` e `pages/es/` e incluir a página no `sitemap.xml.ts`.

**Idioma novo:** acrescentar em `LANGS`, `LOCALE`, `OG_LOCALE`, `LANG_NAME` e `UNIT`; preencher o idioma em todos os `L` (o editor aponta os que faltam); criar `pages/<idioma>/`; incluir o idioma no hook `localized-404`, em `og-image.mjs` e em `media-kit-pdf.mjs`.

**Número novo:** escrever como o Instagram mostra em português (`'123 mil'`) e, se a página precisar calcular, acrescentar o campo numérico ao lado.

---

## 18. Dívidas e riscos conhecidos

| Item | Risco | Sugestão |
|---|---|---|
| Arquivos fora do git (`medias/`, `media-backup/`, `.zip`) | Perder a máquina é perder os originais e a especificação do Portfólio Creator | Cópia num drive |
| PDFs e `og-*.jpg` gerados à mão | Ficam desatualizados em silêncio se alguém esquecer de rodar | Checklist no PR, ou gerar no CI |
| Título do hero duplicado em `og-image.mjs` | Mudar o hero e não a prévia | Ler `heroH1` de `ui.ts` |
| Upload lê `content.ts` por regex | Mudar o formato da linha quebra o upload em silêncio | Importar `MEDIA` direto |
| Sem testes e sem checagem de tipos | Regressões passam sem aviso | `astro check` + 2 ou 3 testes de fumaça (home carrega, filtro, lightbox, Copiar) |
| Cloudinary no plano Free (25 créditos/mês) | Tráfego alto esgota os créditos e os vídeos param | Acompanhar o uso no painel |
| Session Replay em 100% das sessões | Cota da Amplitude e privacidade | Reduzir o `sampleRate` se o tráfego crescer |
| Segredo do Cloudinary exposto em chat | Uso indevido da conta | Trocar a chave |
