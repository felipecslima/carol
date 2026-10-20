# Handoff — Critique do portfólio Carol Limah + plano de correções

Data: 2026-10-20 · Alvo: `site/src/pages/index.astro` (Astro, servidor dev em `http://localhost:4321`, config `.claude/launch.json` → `site`)
Snapshot completo da critique: `.impeccable/critique/2026-10-20T17-23-29Z__site-src-pages-index-astro.md`
Spec original do design: `design_handoff_carol_portfolio/README.md` (fidelidade alta; fontes Instrument Serif + Hanken Grotesk e paleta espresso/caramelo são decisões fixas)

---

## 0. Estado atual e tudo o que falta (atualizado em 20/out/2026, depois da §13)

**Estado:** T1–T8 feitos, mais 3 rodadas extras (§9 print da aba Reels, §11 prova comercial). Critique atual: **24/32** (20 → 21 → 23 → 24), medida depois do contato (§12). Build ok, `impeccable detect` com 0 achados, sem rolagem horizontal em 1440 e 390.

### 0.1 Contato `[P1]`: feito (ver §12)
Decisões do usuário (20/out): prazo "Respondo em até 2 dias úteis."; canais além do e-mail = WhatsApp comercial + media kit em PDF.
- [x] Linha de prazo junto do e-mail (`RESPONSE_TIME` em `content.ts`).
- [x] Bloco "No e-mail, me conta:" com marca, objetivo, período/datas, formato, verba (opcional) (`BRIEF`).
- [x] `mailto` com `body` pré-preenchido a partir do `BRIEF` (`MAILTO`, usado no contato e no `.about-tag`).
- [x] WhatsApp: `WHATSAPP_NUMBER = '+55 12 99137-6550'` em `content.ts` (vira só dígitos). Botão "Chamar no WhatsApp" no contato e número na faixa do PDF.
- [x] Media kit em PDF, 1 página A4: página `/media-kit/` (`site/src/pages/media-kit.astro`, `noindex`) → `public/carol-limah-media-kit.pdf`. **Regenerar com `npm run pdf` (em `site/`) sempre que mudar `content.ts`.** O script (`scripts/media-kit-pdf.mjs`) faz o build, serve o `dist/` num servidor estático próprio (o `astro preview` do Astro 7 vira daemon e trava a 2ª execução) e imprime com Playwright.
- [x] CTA fixo no mobile (`.dock`, ≤720px, só com JS): aparece depois do hero e some quando o contato entra na tela.
- [x] Verificado em 1440×900 e 390×844, build ok, critique refeita (24/32).

### 0.2 Depende da Carol ou do usuário
- [x] Número do WhatsApp comercial: +55 12 99137-6550 (20/out).
- [ ] **`v01` "Bastidores":** a Carol aparece de jaleco "Cirurgiã Dentista". Fica no media kit? Com que título/categoria? (Hoje está no ar como Bem-estar.)
- [ ] Nome do restaurante do `v17` "Jantar a dois".
- [ ] Nome da hospedagem do `v21` (placa e fala: "Reserva", em Ilhabela) e se foi parceria (hoje sem selo de marca).
- [ ] Confirmar o título novo do `v14` "Jet ski e quadri em Igaratá".
- [x] Temas dos reels sem texto na capa: 1,1 mi = tacacá (v44), 1 mi = bumbá (v27), 762 mil = publi "Meus favoritos de beleza" do Mercado Livre (§15). Falta o vídeo do 762 mil, que não está em `medias/`.
- [ ] **Arquivos dos reels mais vistos**, que não estão em `medias/`: 762 mil, "Eu sou do Amazonas" (760), helicóptero (750 e 688), 9.9 do Mercado Livre (683), Mercado Livre (661 e 645), Trilogia amazônica (655), iPhone (647). Com eles, o portfólio passaria a mostrar o melhor desempenho do perfil.
- [ ] **URLs dos posts** no Instagram, para o botão "Ver no Instagram" no lightbox.
- [ ] **Domínio** do site: definir `site` em `site/astro.config.mjs`; o `og:image` passa a ser absoluto sozinho.
- [x] Data do print da aba Reels: 20/out/2026 (print completo, §14).
- [ ] Ampliar "Marcas e lugares com quem já criei"? O catálogo mostra publis de Palmolive, Arena Movie, Buddha Spa, Open Food e de uma loja infantil em Jacareí. Confirmar quais foram parcerias de fato antes de citar.
- [ ] Opcional, mas é o que marcas pedem: taxa de engajamento, alcance médio de stories (stories é vendido como formato e não tem métrica), faixa de investimento ou pacotes.

### 0.3 Melhorias que não dependem de ninguém (backlog da critique §10)
- [x] `[P2]` Gráfico de Resultados: comparação 58,4 mil → 421 mil → 470 mil antes da lista e "Reel sem texto na capa" visível nas linhas sem título (§13).
- [ ] `[P3]` Derivar de `content.ts` os tópicos do Sobre. ("1,67 milhão", "sete vezes" e a síntese do público já saem dos dados.)
- [x] Acessibilidade: `.aud-sum` virou `<ul>` alimentada por `AUDIENCE_SUMMARY` (não é mais lida grudada).
- [x] Acessibilidade: o marquee tem botão de pausa (§13).
- [x] Os cards de Formatos (`.svc`) não mudam mais no hover (§13).
- [ ] Mobile: o rosto da Carol fica abaixo da dobra em 390×844 e a página tem ~10,8 telas. Avaliar a colagem antes do texto ou uma foto menor no topo.
- [x] O nav marca a seção atual com `aria-current` (§13).
- [ ] O lightbox abre com foco em "Fechar". Avaliar focar o título ou a mídia.
- [ ] Limpeza: `p2.webp`/`p2-600.webp` não são mais usados em `public/media` (saíram da grade na §11).
- [x] Rodar `/impeccable critique` depois do contato: 24/32 (§12).
- [ ] `/impeccable init` + `/impeccable document` (o projeto não tem PRODUCT.md/DESIGN.md).

### 0.4 Pergunta de direção ainda aberta
- Identidade amazônica no visual (cor de rio, textura, foto regional) para que a origem não fique só no texto e no selo (Pergunta 1 da §6). A critique repete isso em todas as rodadas.

---

### 0.5 Regra de conteúdo
- **Não mencionar a avó da Carol** ("vozinha") em nenhum lugar do site, do media kit ou de textos novos: ela faleceu e é doloroso. Removido do Sobre e do marquee em 20/out/2026.

---

## 1. Resultado da critique

**Nota: 20/32 (62%, Aceitável)** — heurísticas 7 e 10 = n/a (portfólio de uma página).

| # | Heurística | Nota |
|---|---|---|
| 1 | Visibilidade do status | 2 |
| 2 | Mundo real | 3 |
| 3 | Controle e liberdade | 3 |
| 4 | Consistência | 3 |
| 5 | Prevenção de erros | 2 |
| 6 | Reconhecimento | 3 |
| 8 | Estética | 3 |
| 9 | Recuperação de erros | 1 |

**Veredito:** a voz/cópia é autêntica da Carol; o sistema visual é um media kit genérico de criadora (estrutura jumoura, 6× H2 serifa + final itálico caramelo, paleta "lifestyle quente"). O Amazonas só existe no texto. Funciona como vitrine, falha como media kit: não responde *quem é o público*, *quanto alcança* (com contexto) e *como fechar*.

**O que está bom (preservar):** voz PT-BR; execução tipográfica; ritmo escuro → creme (portfólio) → escuro → caramelo (contato); vídeos do grid com `preload="none"` + play no hover/foco; lightbox com Esc/setas e retorno de foco; `prefers-reduced-motion` respeitado; contraste do texto no escuro (6,8–10,4:1).

**Detector (`impeccable detect`):** CLI = 0 achados. Overlay no browser = 37:
- 28 low-contrast nos cards → **falso positivo** (mediu contra o placeholder `#d9cfc2`, não contra mídia + degradê).
- 1 low-contrast **real**: eyebrow "Portfólio" `#7a6a5a` sobre `#f3ece2` = 4,44:1 (precisa 4,5).
- 6 italic-serif-display, 5 kicker-above-heading, 1 oversized-h1, 1 hero-eyebrow-chip, 1 marquee → padrões do handoff; o oversized-h1 coincide com o problema P2-5.
- `site/.impeccable/config.json` já ignora `overused-font: instrument serif` (decisão do handoff).

---

## 2. Decisões do usuário

- **Prioridade:** dados + gráfico primeiro.
- **Hero:** manter a frase, **encolher o H1** (~84px máx) para CTAs e números caberem na 1ª dobra.
- **Títulos:** corrigir o que dá para verificar no próprio vídeo/foto; marcar o resto para a Carol confirmar.
- **Escopo:** **tudo** (P1 + P2 + P3).

---

## 3. Dados do Instagram (fornecidos pelo usuário, prints de 19/out/2026)

**Resumo — últimos 30 dias (20/set → 19/out/2026)**
- Visualizações: **1.670.640** (+94,4% vs. período anterior)
- Seguidores: **58.444** (+11,9%)
- Seguidores líquidos: **+6.248**

**Gênero:** Mulheres **67,7%** · Homens **32,3%**

**Faixa etária**
| Faixa | % |
|---|---|
| 13–17 | 1,8 |
| 18–24 | 11,4 |
| 25–34 | **38,5** |
| 35–44 | **29,7** |
| 45–54 | 13,3 |
| 55–64 | 3,9 |
| 65+ | 1,5 |

(25–44 = 68,2%)

**Principais cidades:** São Paulo **45%** · São José dos Campos **22%** · Jacareí **12%** · Ribeirão Preto **2,3%**
(SP + Vale do Paraíba = 79%)

---

## 4. Tarefas (em ordem de execução)

### Status da execução (20/out/2026, sessão de implementação)

| Tarefa | Status | O que foi feito |
|---|---|---|
| T1 Títulos | ✅ feito (com pendências) | Folha de contato de todos os vídeos/fotos conferida. `v14` → "Jet ski e quadri em Igaratá" (abre com quadriciclo, jet ski e lancha). `p7` → título "Kome Bela Vista" (mesmo padrão do card Churrasco On Fire). Demais títulos não contradizem a mídia. Comentário em `content.ts` lista o que depende da Carol. |
| T2 Público + gráfico + hero | ✅ feito | `INSIGHTS` e `AUDIENCE` em `content.ts`. Bloco "Quem me assiste" dentro de `#resultados` (`#publico`): síntese (68% 25–44 · 79% SP + Vale · 2 em cada 3 mulheres), selo "Dados do Instagram · 20/set–19/out/2026", barra dividida de gênero, 7 barras de idade (25–34/35–44 em destaque), 4 cidades (SP+Vale em destaque). Hero: 58,4 mil (+11,9% em 30 dias) · 1,67 mi views em 30 dias · 489 mil no reel mais visto (**corrigido na §9 para 762 mil**) ("2,6 mi em 11 reels" removido). Gráfico de reels virou `<figure>` + `<ol>` com título "Views dos 8 reels mais vistos do perfil"; barras visíveis por padrão (`width: var(--w)`), animação de 0 só com JS, sem reduced-motion e quando o gráfico começa abaixo da dobra; regra de print. Nomes das barras: **não** adicionados (sem mapeamento). |
| T3 Hero desktop | ✅ feito | `.h1` = `clamp(48px, 6vw, 84px)`; ≥1000px `grid-template-columns: 1.15fr 1fr`. Em 1440×900: H1 em 4 linhas (210→526), CTAs 670→722, stats 750→855, tudo acima da dobra. |
| T4 Contato | ✅ feito | Pílula com `<a href="mailto:…?subject=Parceria com Carol Limah">` + botão "Copiar e-mail" separado (escondido sem JS/sem Clipboard API). "Copiado!" só quando `writeText` resolve; no erro seleciona o e-mail e mostra "Não deu pra copiar. O e-mail está selecionado: é só copiar." em `role=status`/`aria-live`. `.about-tag` virou link `mailto`. ≤480px a pílula vira coluna com raio 22px. |
| T5 Acessibilidade | ✅ feito | Lightbox em `<dialog>` + `showModal()`, `aria-labelledby="lb-title"` (agora `<h2>`), contador "3 de 12" com `aria-live`, categoria mostra "Vídeo · …"/"Foto · …", clique no fundo fecha, Esc passa pelo mesmo caminho (`cancel`) e o foco volta ao card do **último item visto** (testado). Cards: `aria-label` "Foto: Churrasco On Fire · Experiências · parceria com Churrasco On Fire". Foco escuro (`--focus: var(--bg)`) no creme e no caramelo; caramelo dentro da pílula escura. Eyebrow do creme `#6f5f50` (5,22:1). `<main id="conteudo">` + link "Pular para o conteúdo". Vídeo do hero sem `autoplay` no HTML: JS toca só sem reduced-motion, com botão pausar/tocar. Menu mobile fecha com Esc (foco volta ao hambúrguer) e clique fora. Chips do Sobre viraram lista de texto com separadores. Ícones unicode (▶ ← →) trocados por SVG. Marquee pausa no hover. |
| T6 Mobile | ✅ feito | <720px: grid com 2 colunas (gap 10px, legenda 18px), filtros com 44px de altura numa linha com rolagem horizontal e fade na borda. Número de filtros mantido (Pergunta 3 segue aberta). |
| T7 Performance/metadados | ✅ feito (og absoluto pendente) | `v14` 10,6→4,8 MB, `v17` 6,5→4,5 MB (H.264 a partir dos `.mov` originais, que já eram 320×568; `+faststart`); demais vídeos remuxados com `+faststart`. Fotos com variante `-600.webp` + `srcset/sizes` (cards, Sobre, colagem). Lightbox começa **mudo**. Favicon: `favicon.ico`, `favicon-64.png`, `apple-touch-icon.png` com monograma "CL" (Instrument Serif renderizada; SVG não carrega webfont, por isso PNG/ICO). `og.jpg` 1200×630 gerado; `og:image` usa URL absoluta automaticamente quando `site` for definido em `astro.config.mjs` (hoje sai `/og.jpg`). |
| T8 Polish + critique | ✅ feito | Verificação em 1440×900 e 390×844 (sem rolagem horizontal, console sem erros); `npm run build` ok. Nova critique: ver seção 8. |

Arquivos alterados: `site/src/pages/index.astro`, `site/src/styles/global.css`, `site/src/scripts/main.ts`, `site/src/data/content.ts`, `site/astro.config.mjs` (só comentário/TODO), `site/public/` (`og.jpg`, ícones, `media/*-600.webp`, `media/v14.mp4`, `media/v17.mp4`, remux dos demais `.mp4`).


### T1 — Verificar títulos do portfólio contra a mídia `[P1]` · `/impeccable clarify`
- Arquivo: `site/src/data/content.ts:15-29`.
- Gerar folha de contato (ffmpeg, 3–4 frames por vídeo + fotos) de `site/public/media/` e conferir cada `title`/`cat`.
- **Confirmado errado:** `v14` "Pôr do sol de lancha" é passeio de **quadriciclo em Igaratá/SP** (texto "MODO AVIÃO · Igaratá SP" no próprio vídeo). Note que `v04` já é "Quadriciclo na serra" — diferenciar os dois títulos.
- `p7` "Reels patrocinado" é rótulo, não título, e o arquivo é print de anúncio → renomear com base no conteúdo (marca Kome Bela Vista) e listar como pendente "trocar pelo vídeo original".
- Manter o comentário em `content.ts:15` atualizado com quais títulos ainda dependem da Carol.
- Aceite: nenhum título contradiz o que aparece na mídia; lista de pendências registrada na seção 5 deste arquivo.

### T2 — Bloco de público + gráfico legível + hero `[P1]` · `/impeccable clarify` + `/impeccable layout`
- **Novo bloco "Quem me assiste"** (dentro de `#resultados` ou seção logo após), no mesmo sistema visual das barras (trilho `rgba(243,236,226,.07)`, preenchimento `--bar-*`, números em Instrument Serif):
  - Gênero (67,7 / 32,3), faixa etária (7 barras; destacar 25–34 e 35–44), cidades (4 barras).
  - Frase-síntese para a marca, ex.: "68% têm entre 25 e 44 anos · 79% estão em SP e no Vale do Paraíba".
  - Selo de data: "Dados do Instagram · 20/set–19/out/2026".
- **Hero stats** (`index.astro:54-58`): atualizar para 58,4 mil seguidores (+11,9% em 30 dias) · 1,67 mi views em 30 dias · 489 mil no reel mais visto. Revisar "2,6 mi views somadas em 11 reels" (o gráfico mostra 8; soma das 8 barras = 2,445 mi) — ou remover ou deixar coerente com o gráfico.
- **Barras de reels** (`content.ts:31-40`, `index.astro:148-157`):
  - Texto do parágrafo: deixar claro que são "os 8 reels mais vistos".
  - Nome por barra **só se soubermos o mapeamento** reel → views (não está nos dados atuais; perguntar). Não inventar.
  - **Barras visíveis por padrão:** em `global.css:166-167`, o default deve ser `width: var(--w)`; animar de 0 apenas como melhoria (ex.: classe `.js-anim` adicionada por JS antes do observer). Hoje, sem JS / scroll rápido / print, as barras ficam vazias.
- **Dados em `content.ts`** (novo `AUDIENCE` com gênero/idade/cidades/período), não hardcoded no `.astro`.
- Aceite: brand manager vê público e alcance datados; gráfico legível sem JS.

### T3 — Hero no desktop `[P2]` · `/impeccable layout`
- `global.css:86` `.h1`: limitar o clamp a ~84px (ex.: `clamp(48px, 6vw, 84px)`) e/ou coluna de texto mais larga (`grid-template-columns` ~`1.15fr 1fr` acima de ~1000px).
- Aceite: em 1440×900, CTAs **e** stats acima da dobra (hoje H1 = 6 linhas / 587px; stats terminam em y≈1106).

### T4 — Contato à prova de falha `[P1]` · `/impeccable harden`
- `index.astro:188-191`: e-mail principal vira `<a href="mailto:parceria.eucarollimah@gmail.com?subject=Parceria%20com%20Carol%20Limah">`; "Copiar e-mail" vira botão secundário ao lado.
- `main.ts:126-131`: só mostrar "Copiado!" se `writeText` resolver; no erro, selecionar o texto do e-mail e mostrar "Não deu pra copiar — selecione o e-mail". Usar região `aria-live="polite"` para o feedback.
- `index.astro:83` `.about-tag` (e-mail sobre a foto do Sobre): tornar link `mailto` real ou tirar a aparência de botão.
- `.email-btn` no mobile vira "bolha" de 2 linhas (flex-wrap + radius 999px) → layout em coluna com radius menor abaixo de ~480px, ou e-mail e copiar como dois elementos.
- **Atenção nos testes:** NÃO usar `navigator.clipboard.readText()` no Playwright — trava esperando permissão (aconteceu nesta sessão). Verificar pelo texto do label.

### T5 — Acessibilidade: lightbox, foco, landmarks `[P1]` · `/impeccable audit` + `/impeccable harden`
- Lightbox (`index.astro:128-140`, `main.ts:50-114`): trocar a `div role=dialog` por `<dialog>` + `showModal()` (foco preso e fundo inerte nativos); Esc nativo; fechar no clique do backdrop.
  - `aria-labelledby="lb-title"`; contador visível e anunciado "3 de 5".
  - Ao fechar, devolver foco ao card **do último item visto**, não ao que abriu.
  - Mostrar marca/categoria no `aria-label` do card (hoje só "Abrir Fit check"); indicar vídeo vs foto.
- Foco (`global.css:40`): outline caramelo tem 1,0:1 no contato e 1,6:1 no creme → `outline-color: var(--bg)` em `.portfolio` e `.contact`.
- Eyebrow no creme `#7a6a5a` → escurecer levemente (≥4,5:1), ex. `#6f5f50`.
- Adicionar `<main>` envolvendo as seções e link "Pular para o conteúdo".
- Vídeo do hero em loop sem controle (WCAG 2.2.2): botão de pausa discreto sobre o `.vid`, ou parar após alguns loops; respeitar `prefers-reduced-motion` (não dar autoplay).
- Menu mobile: fechar com Esc e clique fora.
- Chips do Sobre (`index.astro:90-92`) parecem botões e não fazem nada → visual de texto (separadores) ou virar atalhos para os filtros.

### T6 — Mobile `[P2]` · `/impeccable adapt`
- Grid do portfólio (`global.css:133`): `minmax(min(100%,230px),1fr)` dá 1 coluna no celular (~9 telas de rolagem) → 2 colunas abaixo de 720px (gap menor, legenda menor) ou carrossel horizontal com scroll-snap.
- Filtros: altura ≥44px; avaliar rolagem horizontal numa linha em vez de quebrar em 2.
- Filtros com 6 opções para 12 itens (3 categorias com 1 item só) → considerar reduzir/agrupar (ver Pergunta 3 na seção 6).

### T7 — Performance e metadados `[P3]` · `/impeccable optimize`
- Reencodar `v14.mp4` (10,6 MB) e `v17.mp4` (6,5 MB) para H.264 ~720p < 5 MB (meta do handoff); `-movflags +faststart`. Checar os demais.
- Imagens: `p7.webp` é 1100×2381 renderizada a ~280px; gerar larguras (ex. 480/960) e usar `srcset`/`sizes` nos cards e no Sobre. Considerar `astro:assets`.
- Lightbox: avaliar começar vídeo **mudo** (hoje autoplay com som, pesado e intrusivo no celular).
- Favicon: criar (`/favicon.svg` com monograma "CL" em Instrument Serif/caramelo) + `<link rel="icon">` (hoje 404).
- `og:image` (`index.astro:22`): é relativo e WebP → gerar JPG 1200×630 e usar URL absoluta. **Requer domínio** (definir `site` em `astro.config.mjs`) — perguntar ao usuário.

### T8 — Polish final + nova critique · `/impeccable polish` → `/impeccable critique`
- Uma passada de verificação em 1440×900 e 390×844 (screenshots), console sem erros, `npm run build` ok.
- Rodar `/impeccable critique` de novo para medir a evolução (base: 20/32).

---

## 5. Pendências que dependem da Carol / do usuário

> Lista histórica. A lista atual e completa está na **§0**.

- Confirmar títulos/categorias do portfólio (`content.ts`). Em aberto especificamente:
  - **`v01` "Bastidores" / Bem-estar:** o vídeo mostra a Carol de jaleco bordado "Carol Lima · Cirurgiã Dentista" num consultório odontológico. Confirmar título, categoria e se esse vídeo deve entrar no media kit.
  - `v17` "Jantar a dois": nome do restaurante (no prato aparece algo como "Meet & Eat", não confirmado).
  - ~~`p4` "Almoço em SP"~~ → saiu da grade (repetia a foto do Sobre).
  - `v14` "Jet ski e quadri em Igaratá": título novo, confirmar com a Carol.
- ~~Vídeo original do reel da Kome Bela Vista~~ → resolvido: `v20` (rodízio executivo) substituiu o print `p7` (§9).
- ~~Mapeamento reel → views~~ → resolvido com o print da aba Reels (§9). Ainda falta o tema de 2 dos 8 mais vistos (762 mil e 647 mil, capas sem texto).
- ~~Origem do "2,6 mi em 11 reels"~~ → resolvido: removido do hero e trocado pelo dado de 30 dias (1,67 mi).
- Domínio final do site: definir `site` em `site/astro.config.mjs`; o `og:image` passa a sair absoluto sozinho.
- Opcional: taxa de engajamento, alcance médio de stories, média de views por reel — são os próximos dados que marcas costumam pedir.

## 6. Perguntas de direção em aberto (não decididas)

1. Elemento visual amazônico (cor de rio, textura, foto regional) para tirar a identidade só do texto?
2. Hero com número como headline — usuário escolheu **não** (encolher H1). Registrado.
3. ~~Filtrar o portfólio pelo que a marca compra~~ → decidido e feito na §11: Todos · Publis · Viagem & hospedagem · Gastronomia.

## 7. Notas operacionais

- Rodar o site: preview `site` (porta 4321) — às vezes já há um `astro dev` rodando (PID anterior); reutilizar.
- Contexto impeccable: não há `PRODUCT.md`/`DESIGN.md`; refinamentos podem seguir o código como autoridade. Depois das correções, oferecer `/impeccable init` e `/impeccable document`.
- Assets originais em `medias/` (nomes originais mapeados na tabela de Assets do README do handoff).

## 8. Nova critique após a implementação (20/out/2026)

Snapshot: `.impeccable/critique/2026-10-20T17-44-21Z__site-src-pages-index-astro.md` · método dual-agent (A revisão de design · B detector + overlay).

**Nota: 21/32 (era 20/32).** Heurísticas: status 3 (=2→3), mundo real 3, controle 3, consistência 2 (3→2), prevenção de erros 2, reconhecimento 3, estética 2 (3→2), recuperação de erros 3 (1→3). 7 e 10 n/a.

A nota sobe pouco porque a avaliação A pegou dois P0 de mobile que eu tinha introduzido/deixado passar; **os dois foram corrigidos logo depois** (não há nova nota medida após as correções):
- Overflow horizontal em 390px (`.pf-head` em coluna com `flex-wrap: wrap` esticava até os filtros, 623px) → `flex-wrap: nowrap` + `min-width: 0`. Verificado: `scrollWidth` = 390 e filtros rolando dentro da faixa.
- Texto de Resultados `sticky` por cima do gráfico em 1 coluna → sticky só a partir de 860px.
- Também corrigidos: lightbox no celular (mídia 66vh, setas e "Fechar" visíveis, botão termina em y=771/844), play no hover/foco dos cards respeita reduced-motion, `aria-live` anuncia "título, n de N", legenda de categoria dos cards no mobile 10→11px, degradê dos cards reforçado (legenda laranja chegava a 4,48:1 no pior pixel do v17).

Detector: CLI limpa rodando de `site/` (da raiz aparece `overused-font`, porque o config com a exceção fica em `site/.impeccable/config.json`). Overlay: low-contrast dos cards = falso positivo (contraste real amostrado 6,16–10,76:1); o resto são padrões do brief (itálico serifado, eyebrows, marquee). Sem erros de console nem 404 (favicon resolvido).

**Ainda abertos (próximos passos):**
- [P1] Prova sem rosto: barras sem título/thumbnail; ligar cada barra ao conteúdo e mostrar views/marca no lightbox → depende do mapeamento reel → views (§5).
- [P1] Contato não tranquiliza: prazo de resposta, o que mandar no e-mail, body pré-preenchido no mailto, PDF do media kit → depende da Carol definir prazo/briefing (não inventei "48h").
- [P2] Taxonomia: 6 filtros, 3 com 1 item só, e nenhum conteúdo de hotel apesar de "Hotéis & pousadas" ser serviço → Pergunta 3 (§6).
- Menores: "489 mil" aparece 3× (hero, parágrafo, barra); nav não marca a seção atual; foco inicial do lightbox vai para "Fechar"; selo "Amazonas → São Paulo" pequeno para carregar a narrativa (Pergunta 1).
- Oferecer `/impeccable init` + `/impeccable document` (não há PRODUCT.md/DESIGN.md).

## 9. Rodada 2: print da aba Reels + catálogo dos vídeos (20/out/2026)

**Fontes novas:** print da aba Reels com 36 reels e contador visível (os 36 números foram conferidos ampliando cada um) e `CATALOGO-videos.md` (56 vídeos de `medias/` transcritos com Whisper e com frames).

**Correção de dado:** o gráfico antigo (489 → 118 mil) era só a primeira linha e meia do print. O reel mais visto tem **762 mil**, então "489 mil no reel mais visto" estava errado.

**O que mudou no site:**
- Hero: o terceiro número virou "762 mil · views num só reel".
- Resultados: o texto agora traz os 30 dias, mais "em 36 reels, média de 421 mil views (7× os seguidores)" e o case "6 reels para o Mercado Livre, média de 506 mil".
- Gráfico: "Os 8 reels mais vistos, entre 36 do perfil", cada barra com a capa do reel (recortada do print, `public/media/reels/r*.webp`), um título quando a capa diz o tema, um selo Mercado Livre e as views. As barras começam no zero.
- Portfólio (continua com 12 itens):
  - Entraram `v20` (rodízio executivo do Kome, que substitui o print `p7`), `v21` (hospedagem em Ilhabela, que preenche a falta de hotel apontada na critique) e `v22` (montagem do On Fire, 293 mil views).
  - Saíram `p4` (repetia a foto do Sobre), `p5` (terceira foto de cavalo) e `p7` (print de anúncio).
  - Os itens com views confirmadas mostram o número no lightbox, por exemplo o Fit check Shein com 478 mil.
- Dados: `REELS_STATS` e `TOP_REELS` em `content.ts`, com a origem de cada conta comentada; `REELS` foi removido.

**Capas casadas com vídeo do catálogo:** 478 mil = Shein (`v02`) · 335 mil = grupo de quadriciclo (`e87ce3f2…`) · 293 mil = montagem do On Fire (`v22`) · 287 mil = fazenda/jipe (`copy_DD7ECB2C…`) · 118 mil = cavalgada em Campos do Jordão (`copy_EE00398A…`) · 67 mil = Churrasco On Fire (`IMG_7638`). Não casaram: 479 mil (atum), 203 mil (mapa) e 655 mil (Trilogia amazônica). Depois, uma comparação automática de todos os vídeos (frames a 2 fps × 36 capas) achou mais três correspondências exatas: **458 mil** = microfone Hollyland (Mercado Livre), **267 mil** = 10/10 (Mercado Livre) e **252 mil** = quadriciclo no rancho. O case do Mercado Livre passou de 6 reels/506 mil para **8 reels/470 mil**. Os 10 mais vistos continuam fora de `medias/` (o usuário confirmou que não há vídeos novos).

**Pendências desta rodada:**
- Tema dos reels de 762 mil e 647 mil (as capas não têm texto).
- Os 10 reels mais vistos (helicóptero, "Eu sou do Amazonas", Trilogia amazônica, iPhone) **não estão** em `medias/`. Vale pedir os arquivos à Carol para levá-los ao portfólio.
- O print pode não ser contíguo (2 telas): por isso o texto diz "36 reels do perfil", não "os 36 mais recentes".
- Nome exato da hospedagem em Ilhabela (a placa diz "Reserva").

## 10. Critique rodada 3 (20/out/2026, depois do print da aba Reels)

Snapshot: `.impeccable/critique/2026-10-20T18-27-27Z__site-src-pages-index-astro.md` · dual-agent. **Nota: 23/32** (histórico 20 → 21 → 23). Detector: CLI 0 achados; overlay só com falsos positivos (contraste real das legendas dos cards ≥ 5,56:1) e padrões do brief; sem overflow, erros de console ou 4xx/5xx nas duas larguras.

Próximos passos sugeridos pela critique:
- [P1] Contato: prazo de resposta, o que mandar no e-mail, PDF/WhatsApp, CTA fixo no mobile (precisa de definição da Carol para prazo/canais).
- [P1] Prova comercial ligada à oferta: chip de views nos cards com dado, "Ver no Instagram" no lightbox, publis primeiro na grade.
- [P2] Filtros: ≤4 opções alinhadas aos formatos (ex.: Todos · Publis · Viagem & hospedagem · Gastronomia) = Pergunta 3.
- [P2] Gráfico: mostrar a comparação 58,4 mil seguidores → 421 mil de média → 470 mil nas publis ML antes da lista; rótulo neutro visível nas linhas sem título.
- [P3] Derivar do `content.ts` os números que ainda estão fixos no markup (1,67 milhão, síntese do público, "sete vezes").
- Menores: `.aud-sum` lido grudado por leitor de tela; setas do lightbox com "1 de 1"; p6/v04 repetem hero e grade; v01 (dentista) ainda no ar.

## 11. Prova comercial no portfólio (20/out/2026)

Atende os itens P1 "prova comercial" e P2 "filtros" da §10.
- **Filtros:** passaram de 6 para 4 e mostram a contagem: Todos 12 · Publis 6 · Viagem & hospedagem 3 · Gastronomia 4. "Publis" é qualquer item com marca. O rótulo do card (Moda, Achadinhos, Evento, Hospedagem…) ficou separado do grupo de filtro (`FILTERS` + `groupsOf()` em `content.ts`; `data-groups` no card). Isso resolve a Pergunta 3 da §6.
- **Publis primeiro**, por views: Shein 478 mil · Mercado Livre/microfone 458 mil (`v23`, novo) · On Fire 293 mil · Mercado Livre/10/10 267 mil (`v24`, novo) · Kome · Churrasco On Fire (foto).
- **Views no card**, com ícone de olho, nos 5 itens com capa casada no print; também aparecem no lightbox. Entrou `v25` (dia na fazenda, 287 mil) no lugar da foto `p2`.
- **Saíram** `v04` e `p6`, que repetiam a colagem do hero, e `p2`. Os arquivos continuam em `public/media` porque o hero usa `v04` e `p6`.
- O lightbox esconde as setas quando o filtro deixa um item só.
- Verificado em 1440×900 e 390×844 (sem rolagem horizontal, filtros rolando dentro da faixa no mobile), `npm run build` ok e `impeccable detect` com 0 achados.

**Pendente:** "Ver no Instagram" no lightbox depende da URL de cada post. A Carol, ou um print com os links, precisa fornecer.

## 12. Contato [P1] + media kit em PDF (20/out/2026)

**O que mudou:**
- `content.ts`: `WHATSAPP_NUMBER`/`WHATSAPP` (vazio), `RESPONSE_TIME`, `BRIEF`, `MAILTO` (subject + body com o roteiro), `WA_HREF` (ou `null`), `AUDIENCE_SUMMARY` (68% / 79% / 2 em cada 3 calculados de `AUDIENCE`) e `MEDIA_KIT_PDF`.
- `#contato`: e-mail → prazo → "No e-mail, me conta:" (lista com `·`; em coluna até 480px) → "Baixar media kit (PDF)" (+ "Chamar no WhatsApp" quando houver número) → redes.
- `.dock` "Quero uma parceria" fixo no celular, entre o fim do hero e o começo do contato (IntersectionObserver em `main.ts`; some no print e em telas >720px; sem transição com reduced-motion; footer com padding extra no mobile).
- Media kit A4 (`/media-kit/`): nome, frase do hero, selo, foto `p8`, 4 números (seguidores, views 30 dias, média por reel, recorde), público (síntese + gênero + idade + cidades), 6 publis com views, case Mercado Livre, formatos, fonte/período dos dados e faixa caramelo de contato. Texto mínimo de 10–11px (≈8pt impresso). PDF ≈2,5 MB.

**Verificação:** build e `npm run pdf` ok, PDF com 1 página A4; 1440 e 390 sem rolagem horizontal; prazo, roteiro e botão do PDF presentes (PDF 200); `body=` no mailto; nenhum `wa.me` com número vazio; dock oculto no topo, visível no portfólio e oculto no contato; console sem erros; `impeccable detect` na fonte = 0 achados.

**Critique rodada 4:** `.impeccable/critique/2026-10-20T19-10-20Z__site-src-pages-index-astro.md` · dual-agent. **Nota: 24/32** (20 → 21 → 23 → 24). Detector no HTML gerado: só os falsos positivos já conhecidos (cards contra o placeholder `#d9cfc2`), padrões do brief e, no media kit, tiny-text de impressão e rolagem lateral a 390px (folha A4 fixa, esperado). Contraste do contato 9,83:1; dock 15,95:1, 189×48.

Próximos passos sugeridos:
- [P1] Hierarquia do contato: botão primário "Escrever e-mail" (mailto), copiar como link pequeno, PDF como contorno, Instagram/Threads em linha de texto; trocar o título do roteiro por "O e-mail já abre com este roteiro:"; um rosto ou uma frase da Carol junto do CTA.
- [P2] Dock creme some sobre o portfólio creme e cobre as legendas dos cards: dock escuro/caramelo sobre seções claras e respiro no fim da grade.
- [P2] Gráfico de Resultados (já no backlog §0.3) e hero com "421 mil média por reel" no lugar do recorde.
- [P2] Prova comercial que depende da Carol: engajamento, stories, faixa de investimento, links dos posts.
- [P3] Um rótulo só para o CTA ("Quero uma parceria"), hover dos `.svc`, pausa no marquee, `aria-current`.

## 13. Correções da critique rodada 4 (20/out/2026)

Escopo escolhido pelo usuário: tudo, começando pela hierarquia do contato; Instagram e Threads vão para o rodapé.
- **Contato:** botão primário "Escrever e-mail" (mailto com roteiro); endereço em texto com "Copiar" como link ao lado (cópia com `aria-label="Copiar e-mail"`; se falhar, seleciona o endereço); depois de um fio, avatar da Carol (`public/media/carol-avatar.webp`, 160px recortado do `p8`) + "Respondo em até 2 dias úteis."; "O e-mail já abre com este roteiro:" com 4 itens (o `MAILTO` ainda começa com "Marca:"); "Baixar media kit (PDF)" como contorno (o WhatsApp entra com o mesmo estilo).
- **Redes:** saíram do contato e estão no rodapé (links de 44px).
- **CTA único:** o nav diz "Quero uma parceria", como o hero e o dock.
- **Dock:** caramelo, igual à seção de destino; aparece no escuro e no creme. O portfólio ganha respiro de 104px no fim no celular.
- **Resultados:** comparação "Views por reel comparadas aos seguidores" (seguidores em tom apagado × média × publis ML) antes dos 8 reels; linhas sem título mostram "Reel sem texto na capa"; "1,67 milhão" e "sete vezes" vêm de `content.ts` (`followersK`, `averageK`, `mlAverageK`, `REACH_MULTIPLE`).
- **Hero:** o 3º número agora é "421 mil · média de views por reel" (o recorde de 762 mil segue no gráfico e no PDF).
- **P3:** sem hover nos `.svc`; botão de pausa no marquee (oculto com reduced-motion, que já deixa o marquee parado); `aria-current` no nav por IntersectionObserver.
- Verificado: build e `npm run pdf` ok (1 página); 1440 e 390 sem rolagem horizontal; `body=` no mailto; PDF 200; dock oculto no topo, visível no portfólio e oculto no contato; marquee pausa e troca o rótulo; console sem erros; `impeccable detect` na fonte = 0 achados.

Ainda aberto: prova comercial que depende da Carol (engajamento, stories, faixa de investimento, links dos posts) e a identidade amazônica no visual (§0.4). Próximo passo sugerido: `/impeccable critique` para medir a rodada.

## 14. Print completo da aba Reels (20/out/2026, 15h32)

Fonte: `~/Downloads/screencapture-instagram-eu-carollimah-reels-2026-10-20-15_32_28.png` + `…-2.png` (3420px de largura; a 2ª continua a 1ª sem repetir linhas). Leitura de cada contador feita por um agente; dados brutos em `/tmp/newprint/reels.json` (temporário).

- **165 reels**, nenhum fixado. Soma 39,9 mi · **média 242 mil** · mediana 183 mil · 74 acima de 200 mil · **18 acima de 500 mil** · **2 com 1 milhão ou mais** (1,1 mi e 1 mi).
- O print antigo (36 reels, média 421 mil) era só um recorte. Com o perfil inteiro a média cai para 242 mil, e o site passou a dizer "mais de quatro vezes o número de seguidores" (calculado em `REACH_MULTIPLE`).
- **Top 8 novo:** 1,1 mi · 1 mi · 762 · 760 · 750 · 688 · 683 (9.9 ML) · 669 mil ("Coisas que eu acho chique"). Saíram 661 (ML), 655 (Trilogia amazônica) e 647 mil. Miniaturas novas `public/media/reels/r1100.webp`, `r1000.webp`, `r669.webp`. **`r647`, `r655` e `r661.webp` não são mais usadas** (podem ser apagadas).
- **Mercado Livre:** continua 8 reels com média de 470 mil (683, 661, 645, 601, 458, 267, 243, 201). Há mais 2 prováveis não contados: 277 mil (código "ID: 31HZ1H…") e 315 mil (tela amarela de app de compras).
- **Cabeçalho do perfil no print:** 258 posts · 58,4 mil seguidores · 7.116 seguindo. Bio: "Eu sou uma Amazonense morando em SP te mostrando tudo / Te levo em lugares incríveis" (bate com o novo título do hero).
- **Outras marcas e lugares nas capas** (para a lista "Marcas e lugares com quem já criei", depois de a Carol confirmar o que foi parceria):
  - Lugares e eventos: TEMPO by Porsche 475 mil · Paparoto Cucina 514 mil · CASACOR 245 e 185 mil · Café de la Musique 178 mil · Gusto Cucina 179 mil · Mana Poke 47,1 mil.
  - Produtos: iPhone 647 mil · Bloomie 90,3 e 56,1 mil · Alva 158 mil · Emma 44,9 mil.
  - Serviços e lojas: HC Helicópteros 750 mil · Espaço Simone Zagallo 83,1 mil · Casas Bahia 15,3 mil · Sephora 13,5 mil.
  - Já citadas no site: Kome (110, 188 e 196 mil), Shein (478 e 134 mil), On Fire (63 mil).
- Site e PDF atualizados (hero "242 mil · média de views por reel", texto e gráficos de Resultados, PDF com "1,1 mi views num só reel"). PDF regerado com 1 página.

## 15. Vídeos novos no portfólio (20/out/2026)

O usuário listou 24 vídeos de `medias/` para usar "por ora". Seis já estavam no site (v17, v20, v21, v22, v23, v24). Os outros 18 viraram `v26`–`v43` em `public/media` (H.264 720×1280, AAC 64k, faststart; os em HDR/HLG passaram por `avconvert` antes, para não lavar a cor; os longos recomprimidos a 30 fps/CRF 28; posters 360×640 no melhor momento).
- **Duplicado removido:** `copy_D30C471A…` (v42) é outra edição do `3b18ea40…` (v26, conjunto fitness); ficou o v26 (mais longo e com 109 mil views).
- **Views casadas frame a frame com o print de 165 reels:** v27 **1 mi** (é o 2º reel mais visto do perfil; agora tem vídeo e título no gráfico), v41 425 mil, v32 307 mil, v37 208 mil, v28 185 mil, v26 109 mil. Provável e não usado: v29 = 141 mil.
- `copy_101D2895…` (v35, cavalgada em Campos do Jordão) é um corte menor do `copy_EE00398A…`, que é o reel de 118 mil; ficou o da lista.
- **Grade:** 29 itens. Ordem: o reel de 1 mi, publis por views, resto por views. Em "Todos" mostra 12 e um botão "Ver todos os 29 conteúdos" (sem JS aparece tudo). Filtros: Todos 29 · Publis 11 · Viagem & hospedagem 7 · Gastronomia 5. Categorias novas: Beleza e UGC.
- **Media kit:** a seção de publis agora pega 6 (ordem do portfólio, no máximo 2 por marca), senão a folha estoura.
- **Para a Carol confirmar:** nome da festa do v27 (palco "Sampa Tribal"; título provisório "Noite de bumbá em SP"); nome da pousada do v30 ("…imê Pousada em…"); restaurante do v34 ("DaSel…"); se Buddha Spa (v38), Studio de Pilates Fernanda Honorato (v40) e Rancho do Tinho (v35) foram parcerias; quem é a jovem do v38 (legenda do reel fala em "sua filha"); se o v29 (protocolo facial) é a Carol; se v01/v43 (consultório) ficam.
- **1,1 mi resolvido:** a capa do reel mais visto bate frame a frame com `f142eca5…` (bar de comida do Norte perto da Paulista, tacacá). Virou `v44` "Tacacá perto da Paulista" (Gastronomia), primeiro item da grade, e ganhou título no gráfico. Grade: 30 itens (Gastronomia 6).
- **762 mil resolvido** pelo print do post enviado pelo usuário: "Meus favoritos de beleza…", #Publi @mercadolivre, 18/set (mesma blusa marrom e cenário da capa). A legenda mostra que "31HZ1H-…" é código de produto do Mercado Livre, o que confirma também o reel de 277 mil ("ID: 31HZ1H-VQYY"). **Case Mercado Livre: 10 reels, média de 480 mil** (era 8 reels/470 mil). O de 315 mil (tela amarela de app) segue de fora por não ter a marca escrita.
- **Vídeo do hero trocado** a pedido do usuário: o quadriciclo (`v04`) deu lugar a `copy_FFBD046B…` → `v45` (consultório, 9,9s, sem áudio, HLG convertido com `avconvert`). Como é o mesmo vídeo do `v01` "Bastidores", o v01 saiu da grade (29 itens). `v04.*` e `v01.*` continuam em `public/media`, sem uso.
- **Foto principal do hero trocada** a pedido do usuário: `p8` (camiseta amarela) → `p9` (`medias/1019D9F9…heic`, conjunto rosa, ao telefone no parque), em `p9.webp` 1100px + `p9-600.webp`, com srcset. O media kit e o avatar do contato continuam com o `p8`.
- **Mais 7 vídeos** a pedido do usuário (o `f142eca5…` já era o v44), views casadas por cena com as capas do print de 165 reels:
  - Publis: `v46` Buddha Spa "Presente de Dia dos Pais" 292 mil (`D5682831…`) · `v50` Kome "Sushi e sashimi no Kome" 237 mil (`9b251bc3…`, não repete frames do v20) · `v48` "Noite no Churrasco On Fire" 67 mil (`IMG_7638`, horizontal recortado em 9:16).
  - Outros: `v47` "Quadriciclo em grupo" 335 mil (`e87ce3f2…`, horizontal recortado) · `v52` "Jantar no Kome" 188 mil (`2828d00b…`, sem selo: parceria não confirmada) · `v49` "Almoço no Gusto Cucina" 179 mil (`9a2b069d…`) · `v51` "Almoço no jardim" 161 mil (`944eb5dd…`).
  - Grade: 36 itens (Publis 14 · Viagem & hospedagem 8 · Gastronomia 10), ordenada automaticamente (dois reels de 1 mi+, publis por views, resto por views). PDF: as 6 publis agora são Shein, ML microfone, ML 8.8, On Fire, Buddha Spa e Kome.
- **Parcerias confirmadas pelo usuário:** `v52` "Jantar no Kome" (selo "Kome") e `v49` "Almoço no Gusto Cucina" (selo "Gusto Cucina"). Publis: 16. A linha "Marcas e lugares com quem já criei" virou: Mercado Livre · *Shein* · Churrasco On Fire · *Kome* · Gusto Cucina · *Buddha Spa*.
- **"Marcas e lugares com quem já trabalhei"** (título novo) virou uma faixa animada igual à do marquee do topo (fio caramelo, nomes alternando romano/itálico, `BRANDS` em `content.ts`, 27 nomes): lista do usuário (Casas Bahia, LG, Samsung Brasil, Reserva Ilhabela, Aimê Pousada, Tempo by Porsche, Paparoto Cucina) + marcas das publis e das capas do print (HC Helicópteros, CASACOR, Sephora, Palmolive, Illustratum, Bloomie, Alva, Emma, Café de la Musique, Mana Poke, Arena Movie, Open Food, Espaço Simone Zagallo, Vagas Goiânia…). Cada faixa tem um botão de pausa e os dois pausam as duas faixas juntas; leitor de tela recebe a lista em `<ul class="sr-only">`. Conferir com a Carol se todas foram parcerias de fato (Bloomie, Alva, Emma, Café de la Musique e Mana Poke vieram só das capas).
- Removidos da faixa de marcas a pedido do usuário: Illustratum, Bloomie, Sephora, Open Food, Vagas Goiânia (22 nomes). Os vídeos de Illustratum e Vagas Goiânia continuam no portfólio com selo.
- **Media kit atualizado (20/out, 17h51):** foto `p9` (conjunto rosa) no lugar da `p8`; nova linha "Marcas e lugares com quem já trabalhei" com os 22 nomes de `BRANDS` (alternando romano/itálico); publis em formato quadrado; barras de público abaixo de 5% (55–64 anos, Ribeirão Preto) saem só do PDF; margens enxutas. Continua 1 página A4. Cópia em `~/Downloads/carol-limah-media-kit.pdf` substituída.

## 16. Vídeos no Cloudinary (20/out/2026)

- Conta Cloudinary `nepuxjxx` (plano Free, 25 créditos/mês). Credenciais em `site/.env` (permissão 600, fora do build): `CLOUDINARY_URL` (upload) e `PUBLIC_CLOUDINARY_CLOUD_NAME` (URLs públicas). **O API secret foi colado no chat: gerar um novo no painel (Settings → API Keys) e atualizar o `.env`.**
- Upload: `node scripts/cloudinary-upload.mjs [pasta] [--force]` (em `site/`) sobe só os vídeos de `MEDIA` para `carol-limah/<id>`. Padrão lê `public/media`; depois da migração os mp4 ficam em `site/media-backup/`, então use `node scripts/cloudinary-upload.mjs media-backup`.
- Site: `videoSrc(id)` → `…/video/upload/carol-limah/<id>.mp4` (original, sem transformação: `f_auto,q_auto` deixava o arquivo maior); `posterSrc(id, w)` → `…/so_<seg>,w_<w>,f_auto,q_auto/carol-limah/<id>.jpg` com os segundos de `POSTER_T` em `content.ts` (os mesmos quadros dos antigos `*-poster.jpg`). Sem `PUBLIC_CLOUDINARY_CLOUD_NAME`, tudo volta para `public/media`. O lightbox lê `data-src`/`data-poster` do card.
- Vídeo novo: converter para mp4 720×1280, pôr em `media-backup/`, adicionar em `MEDIA` e no `POSTER_T`, rodar o upload e `npm run pdf`.
