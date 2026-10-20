# Handoff: Portfólio Carol Limah (@eu.carollimah)

## Overview
Site-portfólio / media kit de uma página para a criadora de conteúdo Carol Limah (amazonense em São Paulo; viagem, gastronomia, hospedagem, lifestyle). Objetivo: apresentar a Carol para marcas e converter em contato de parceria (e-mail `parceria.eucarollimah@gmail.com`). Estrutura inspirada em jumoura.com.br (hero com headline + números, faixa animada, sobre, grid de reels, serviços, CTA final).

## About the Design Files
Os arquivos deste pacote são **referências de design feitas em HTML** — protótipos que mostram aparência e comportamento, não código de produção. A tarefa é **recriar este design no ambiente do projeto alvo** (ex.: Next.js/React, Astro, Webflow) usando os padrões dele. Se não houver projeto ainda, recomenda-se **Next.js ou Astro** com CSS (Tailwind ou CSS Modules), imagens otimizadas e vídeos convertidos para MP4 (H.264) + poster JPG.

Para abrir o protótipo: sirva a pasta com um servidor local (ex. `npx serve .`) e abra `Carol Limah Portfolio.dc.html`. Toda a marcação/estilos estão inline no arquivo; a lógica fica no `<script data-dc-script>` (classe `Component`). `support.js` é apenas o runtime do protótipo — não portar.

## Fidelity
**High-fidelity.** Cores, tipografia, espaçamentos e interações são finais. Recriar fielmente.

## Layout global
- Fundo da página `#17110d`, texto `#f3ece2`.
- Container: `max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 4vw, 40px)`.
- Totalmente fluido; grids usam `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` para colapsar em mobile.
- `scroll-behavior: smooth`; seções com `scroll-margin-top: 60–70px` por causa do nav fixo.
- Eyebrow padrão (rótulo de seção): 13px, 600, `letter-spacing: .14em`, uppercase, cor `#a89a8a` (no fundo creme: `#7a6a5a`).
- H2 padrão: Instrument Serif 400, `clamp(40px, 5vw, 68px)`, line-height 1, `letter-spacing: -.015em`, `text-wrap: balance`. Trecho final em itálico na cor de destaque.

## Screens / Seções (ordem da página)

### 1. Nav (sticky)
- `position: sticky; top: 0; z-index: 20`; fundo `rgba(23,17,13,.78)` + `backdrop-filter: blur(14px)`; borda inferior `1px rgba(243,236,226,.08)`.
- Padding 16px vertical. Flex space-between, wrap.
- Logo: "Carol *Limah*" — Instrument Serif 26px; "Limah" itálico, cor destaque.
- Links (Hanken Grotesk 14px/500, cor `#cbbfb1`, gap `clamp(14px,2.4vw,30px)`): Sobre `#sobre` · Portfólio `#portfolio` · Resultados `#resultados` · Formatos `#servicos`.
- Botão "Fale comigo" → `#contato`: pill, padding 9×16, fundo `#f3ece2`, texto `#17110d`, 600.

### 2. Hero (`#topo`)
- Grid 2 colunas `minmax(min(100%,440px),1fr)`, gap `clamp(40px,5vw,72px)`, padding `clamp(40px,7vw,96px)` topo / `clamp(48px,6vw,80px)` base.
- **Coluna texto** (flex column, gap 28px):
  - Eyebrow com bolinha 8px na cor destaque: "Criadora de conteúdo · São Paulo" (cor destaque).
  - H1: "Uma amazonense perdida em SP te levando em *lugares incríveis.*" — Instrument Serif 400, `clamp(52px,7.4vw,104px)`, line-height .94, `letter-spacing: -.02em`.
  - Parágrafo (max 520px, `clamp(17px,1.4vw,19px)`, lh 1.55, `#cbbfb1`): "Restaurantes, hotéis, pousadas e viagens de fim de semana, mostrados do jeito que eu vivo: com humor, de perto e sem roteiro decorado."
  - CTAs (gap 12px): "Ver portfólio" (pill 15×26, fundo destaque, texto `#17110d`, 700, 15px) → `#portfolio`; "Quero uma parceria" (pill outline `1px rgba(243,236,226,.25)`, 600) → `#contato`.
  - Números (borda superior `1px rgba(243,236,226,.12)`, padding-top 20px, gap `clamp(24px,4vw,48px)`): valor Instrument Serif 44px / legenda 13px `#a89a8a`:
    - 58,4 mil — seguidores no Instagram
    - 489 mil — views no reel mais visto
    - 2,6 mi — views somadas em 11 reels
- **Coluna mídia — variante "colagem" (padrão)**: caixa `aspect-ratio 4/5`, max 540px, `position: relative`:
  - Foto `p8.png` (retrato): left 14%, top 0, w 62%, h 78%, `object-position: center 20%`, radius 20px, sombra `0 30px 60px rgba(0,0,0,.45)`.
  - Foto `p6.jpg`: left 0, bottom 2%, w 42%, aspect 3/4, radius 16px, `rotate(-5deg)`, borda 5px `#17110d`, sombra `0 20px 40px rgba(0,0,0,.4)`.
  - Vídeo `v04` (autoplay, mudo, loop): right 0, bottom 8%, w 38%, aspect 9/16, radius 18px, `rotate(4deg)`, borda 5px `#17110d`.
  - Selo: right 4%, top 6%, fundo `#f3ece2`, radius 14px, `rotate(3deg)`, "Amazonas" (13px/600) + "→ São Paulo" (Instrument Serif itálico 20px).
- **Variante "video"** (alternativa): vídeo `v05` 9:16, max 400px, radius 28px, com chip "eu.carollimah" + avatar 26px no canto superior esquerdo (fundo `rgba(23,17,13,.6)` + blur 8px).

### 3. Faixa animada (marquee)
- Fundo `#1d1611`, bordas topo/base `1px rgba(243,236,226,.1)`, padding 18px 0, `overflow: hidden`.
- Texto Instrument Serif `clamp(24px,2.6vw,34px)`, `#e4d8c9`, separador "✦" na cor destaque. Conteúdo duplicado; animação `translateX(0 → -50%)` 42s linear infinita.
- Itens (atualizado em 20/out/2026): Lifestyle — *Viagens* — Experiências — *Gastronomia* — Moda — *UGC*, separados por um fio fino caramelo (sem ✦).

### 4. Sobre (`#sobre`)
- Grid 2 col `minmax(min(100%,380px),1fr)`, gap `clamp(40px,6vw,88px)`, padding vertical `clamp(64px,9vw,128px)`.
- Foto `p4.jpg` (max 460px, aspect 4/5, radius 20px) com etiqueta sobreposta (right -14px, bottom 28px, fundo destaque, radius 16px, 14px/600): "parceria.eucarollimah@gmail.com".
- Texto: eyebrow "Sobre mim"; H2 "Do Amazonas pra São Paulo, *te mostrando tudo.*"; 2 parágrafos 18px lh 1.6 `#cbbfb1` (ver arquivo para cópia exata); chips (pill outline `rgba(243,236,226,.2)`, 14px, `#e4d8c9`): Viagem, Gastronomia, Hospedagem, Moda, Lifestyle.

### 5. Portfólio (`#portfolio`) — seção clara
- Fundo `#f3ece2`, texto `#17110d`, padding `clamp(64px,8vw,112px)`. Itálico do H2 em `#9a5b22`.
- Header: eyebrow "Portfólio", H2 "Conteúdos que eu *já criei*", filtros à direita.
- **Filtros** (pills 9×16, 14px/600): Todos, Viagem, Gastronomia, Experiências, Moda, Bem-estar. Ativo: fundo/borda `#17110d`, texto `#f3ece2`. Inativo: transparente, borda `rgba(23,17,13,.2)`.
- **Grid**: `repeat(auto-fill, minmax(min(100%,230px),1fr))`, gap 14px. Card 9:16, radius 16px, fundo `#d9cfc2`, cursor pointer; hover sombra `0 18px 40px rgba(23,17,13,.25)`; entrada com fade .4s.
  - Mídia `object-fit: cover`. Gradiente inferior `transparent 50% → rgba(23,17,13,.85)`.
  - Badge de marca (opcional) top-left: pill `#f3ece2`, 12px/700.
  - Ícone ▶ (vídeos) top-right: círculo 30px, `rgba(23,17,13,.55)` + blur.
  - Rodapé: categoria (11px/600, `.12em`, uppercase, `oklch(0.85 0.1 65)`) + título (Instrument Serif 22px).
- Itens (ordem): ver tabela em **Assets**.

### 6. Lightbox (modal do portfólio)
- `position: fixed; inset: 0; z-index: 50`, fundo `rgba(10,7,5,.88)` + blur 10px, fade .25s.
- Mídia: altura `min(86vh, 820px)`, 9:16, radius 20px. Vídeo com controles, autoplay **com som**.
- Painel lateral (max 300px): categoria, título (Instrument Serif 40px), "Parceria com {marca}" quando houver; botões ← → (círculo 44px outline) e "Fechar" (pill creme).
- Fechar ao clicar no fundo; clique na mídia/painel não fecha. ← → navegam em loop dentro da lista filtrada. (Sugestão para produção: Esc fecha, setas do teclado navegam.)

### 7. Resultados (`#resultados`)
- Grid 2 col (`minmax(min(100%,360px),1fr)`). Coluna texto `position: sticky; top: 110px`.
- H2 "Alcance que vai *muito além* dos seguidores"; parágrafo explicativo.
- Gráfico de barras horizontais: linha = grid `76px | 1fr`, gap 16px; valor Instrument Serif 26px; trilho 34px, radius 8px, `rgba(243,236,226,.07)`; barra proporcional ao maior (489 mil = 100%).
  - 489 mil 100% · 458 mil 93,7% · 380 mil 77,7% · 287 mil 58,7% · 267 mil 54,6% · 243 mil 49,7% (rótulo "Mercado Livre") · 203 mil 41,5% · 118 mil 24,1%
  - Cores em degradê por faixa: `oklch(0.8 0.11 65)` (2 primeiras) → `oklch(0.72 0.1 65)` → `oklch(0.64 0.09 65)` → `oklch(0.56 0.08 65)` (2 últimas).
  - Nota: "Fonte: aba Reels do Instagram @eu.carollimah" (13px `#a89a8a`).
- Sugestão: animar barras de 0 → largura ao entrar na viewport.

### 8. Formatos de parceria (`#servicos`) + Marcas
- Borda superior `1px rgba(243,236,226,.1)`.
- H2 "Como a sua marca pode *aparecer comigo*".
- Grid 4 cards (`minmax(min(100%,260px),1fr)`) com divisórias de 1px (gap 1px sobre fundo `rgba(243,236,226,.12)`), container radius 20px. Card: padding 32/28/36, fundo `#17110d`, hover `#1f1813`. Número (Instrument Serif 20px destaque), título (Instrument Serif 32px), texto 16px lh 1.55 `#cbbfb1`.
  1. Reels & *stories* 2. Hotéis & *pousadas* 3. Restaurantes *em SP* 4. Vídeos *UGC*
- Marcas: eyebrow "Marcas e lugares com quem já criei" + wordmarks em Instrument Serif `clamp(28px,3.4vw,44px)` `#e4d8c9`: Mercado Livre · *Shein* · Churrasco On Fire · *Kome Bela Vista*. (Em produção, pode trocar por logos oficiais em monocromático.)

### 9. Contato (`#contato`)
- Fundo destaque `oklch(0.8 0.11 65)`, texto `#17110d`, centralizado, padding `clamp(72px,10vw,140px)`.
- Eyebrow "Vamos conversar?"; H2 "Bora levar a sua marca pra *um lugar incrível?*" (`clamp(48px,7.4vw,112px)`, lh .95).
- Botão grande (pill, fundo `#17110d`, texto `#f3ece2`, `clamp(16px,1.6vw,20px)`/600): e-mail + chip interno "Copiar e-mail" → ao clicar copia para o clipboard e mostra "Copiado!" por 2s.
- Links outline (borda 1.5px `#17110d`): Instagram @eu.carollimah (https://www.instagram.com/eu.carollimah), Threads @eu.carollimah.

### 10. Footer
- Logo (Instrument Serif 20px) + "© 2026 Carol Limah · São Paulo, SP" (13px `#a89a8a`).

## Interactions & Behavior
- Âncoras do nav com scroll suave.
- Vídeos do hero: autoplay, mudo, loop, `playsinline` (garantir atributo `muted` no HTML para o autoplay funcionar).
- Grid do portfólio: por padrão vídeos ficam pausados no primeiro frame (`#t=0.8` como poster) e tocam mudos no hover; pausam ao sair. Opção de autoplay geral (flag).
- Clique em card → lightbox. Filtro troca a lista (re-render com fade).
- Copiar e-mail com feedback de 2s.
- Mobile: todos os grids colapsam para 1 coluna; nav quebra linha (em produção, considerar menu hambúrguer).

## State Management
- `filter: 'Todos' | 'Viagem' | 'Gastronomia' | 'Experiências' | 'Moda' | 'Bem-estar'`
- `lightboxIndex: number | null` (índice na lista filtrada)
- `copied: boolean` (timeout 2s)
- Flags de configuração do protótipo: `heroVariant: 'colagem' | 'video'` (padrão colagem), `autoplayReels: boolean` (false), `showChart: boolean` (true).
- Sem fetch de dados; conteúdo estático (ideal em CMS/JSON para a Carol atualizar).

## Design Tokens
**Cores**
- Fundo: `#17110d` · Fundo faixa: `#1d1611` · Hover card: `#1f1813` · Superfície vídeo: `#221a15`
- Texto: `#f3ece2` · Texto 2: `#e4d8c9` · Texto muted: `#cbbfb1` · Texto sutil: `#a89a8a`
- Creme (seção portfólio): `#f3ece2` · Placeholder card: `#d9cfc2` · Eyebrow no creme: `#7a6a5a` · Itálico no creme: `#9a5b22`
- Destaque (caramelo): `oklch(0.8 0.11 65)` ≈ `#e0a86a` · Variações: `oklch(0.85 0.1 65)`, `0.72 0.1 65`, `0.64 0.09 65`, `0.56 0.08 65`
- Linhas: `rgba(243,236,226,.08 / .1 / .12 / .2 / .25)`

**Tipografia** (Google Fonts)
- Display: **Instrument Serif** 400 (regular + itálico) — títulos, números, wordmarks.
- Texto/UI: **Hanken Grotesk** 400/500/600/700.

**Raios**: pills 999px · cards portfólio 16px · fotos 16–20px · lightbox 20px · vídeo hero 18/28px · grid serviços 20px · barras 8px.
**Sombras**: `0 30px 60px rgba(0,0,0,.45)` (foto hero) · `0 20px 40px rgba(0,0,0,.4)` (colagem) · `0 18px 40px rgba(23,17,13,.25)` (hover card) · `0 30px 80px rgba(0,0,0,.6)` (lightbox).
**Espaçamento**: seções `clamp(64px,9vw,128px)` vertical; gaps 8/10/12/14/16/24/28/36/44px.

## Assets (pasta `media/`)
Origem: pasta `carol/medias` da Carol (nomes originais entre parênteses).

| Arquivo | Uso | Categoria / Título / Marca |
|---|---|---|
| p8.png (IMG_3806.PNG) | Hero retrato, avatar | — |
| p6.jpg (D8545BD4…) | Hero colagem + grid | Viagem / Cavalgada ao pôr do sol |
| p4.jpg (A6659264…) | Sobre + grid | Gastronomia / Almoço em SP |
| v04.mov (44b819c6…) | Hero colagem + grid | Viagem / Quadriciclo na serra |
| v05.mov (588757f2…) | Hero variante vídeo + grid | Gastronomia / “Virei blogueira” |
| v02.mov (2dfba9df…) | Grid | Moda / Fit check / **Shein** |
| p1.jpg (2B9F7A53…) | Grid | Experiências / Churrasco On Fire / **Churrasco On Fire** |
| v17.mov (copy_1901DE88…) | Grid | Gastronomia / Jantar a dois |
| p7.jpg (EED215BA…) | Grid | Gastronomia / Reels patrocinado / **Kome Bela Vista** |
| v14.mov (copy_0C0B7791…) | Grid | Viagem / Pôr do sol de lancha |
| p2.jpg (2F7D4CBD…) | Grid | Viagem / Trilha a cavalo |
| v01.mov (25ace171…) | Grid | Bem-estar / Bastidores |
| p5.png (C3243114…, reduzida) | Grid | Viagem / Dia no haras |

Observações:
- Títulos/categorias dos vídeos foram inferidos — confirmar com a Carol.
- Vídeos >30 MB e fotos HEIC da pasta original não entraram no protótipo; em produção, converter tudo para MP4 H.264 (~720p, <5 MB) + poster JPG/WebP, e imagens para WebP/AVIF responsivas.
- `p7.jpg` é print de um anúncio do Instagram; idealmente substituir pelo vídeo original.
- Números (58,4 mil seguidores; views dos reels) vêm de prints do Instagram de out/2026 — atualizar periodicamente.

## Files
- `Carol Limah Portfolio.dc.html` — protótipo completo (toda a página).
- `support.js` — runtime do protótipo (não portar).
- `media/` — imagens e vídeos usados.
