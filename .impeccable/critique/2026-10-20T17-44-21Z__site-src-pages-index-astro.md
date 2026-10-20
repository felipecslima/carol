---
target: site/src/pages/index.astro (pós T1–T8)
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 2
target_identity: "file:/Users/felipelima/work/carol/site/src/pages/index.astro"
target_fingerprint: "sha256:636ccdf73abb2ed4d69970b0a867d76dacea166ca9bfd1a97f14afc1b7fe7483"
target_path: /Users/felipelima/work/carol/site/src/pages/index.astro
timestamp: 2026-10-20T17-44-21Z
slug: site-src-pages-index-astro
---
Method: dual-agent (A: design review · B: detector + browser), executado após a implementação de T1–T8.

## Design Health Score — 21/32 (66%, Aceitável) · heurísticas 7 e 10 n/a · base anterior 20/32

| # | Heurística | Nota | Problema-chave |
|---|---|---|---|
| 1 | Visibilidade do status | 3 | Filtros com aria-pressed, contador no lightbox; o nav não marca a seção atual |
| 2 | Mundo real | 3 | Voz ótima; barras de reels sem nome |
| 3 | Controle e liberdade | 3 | Esc, fundo e devolução de foco ok |
| 4 | Consistência | 2 | Três taxonomias (temas do Sobre, filtros, serviços) |
| 5 | Prevenção de erros | 2 | Overflow horizontal no mobile (corrigido depois da avaliação) |
| 6 | Reconhecimento | 3 | Gestor precisa adivinhar a que conteúdo cada barra se refere |
| 8 | Estética | 2 | 489 mil repetido 3×; portfólio longo antes da prova; quebra no mobile (corrigida) |
| 9 | Recuperação de erros | 3 | Fallback do clipboard exemplar (era 1) |

## Especificidade
Copy autoral, forma de media kit de criadora (jumoura). O Amazonas continua só no texto e no selo.
Detector: CLI limpa a partir de `site/` (1 overused-font só quando rodado da raiz, porque o config fica em `site/.impeccable`). Overlay 1440: 24 low-contrast (falso positivo: amostragem real 6,16–10,76:1 no branco; laranja 4,48:1 no pior pixel do v17 → degradê reforçado), 13 padrões do brief. Overlay 390: 10 padrões do brief e 1 cramped-padding falso no marquee. Sem erros de console nem 404.

## Problemas prioritários
- [P0, corrigido após a avaliação] Overflow horizontal em 390px (`.pf-head` com flex-wrap em coluna) → `flex-wrap: nowrap` + `min-width: 0`.
- [P0, corrigido após a avaliação] Texto de Resultados sticky por cima do gráfico em 1 coluna → sticky só ≥860px.
- [P1] Prova sem rosto: barras sem título/thumbnail, portfólio sem métricas → depende do mapeamento reel → views (Carol). /impeccable clarify
- [P1] Contato não tranquiliza: falta prazo de resposta e o que mandar; mailto sem body → depende de a Carol definir prazo/briefing. /impeccable clarify
- [P2] Taxonomia/filtros: 6 filtros, 3 com 1 item, nenhum item de hotel → Pergunta 3 do handoff. /impeccable distill

Também corrigidos após a avaliação: lightbox no celular com mídia em 66vh (controles visíveis), play no hover/foco respeita reduced-motion, aria-live anuncia "título, n de N", categoria dos cards no mobile em 11px.

## Personas
- Gestor de marca (2 min): rola 12 cards antes da prova; sem engajamento, preço ou conteúdo de hotel; v01 (jaleco de dentista) e p7 (print de anúncio) enfraquecem.
- Mobile, primeira visita: overflow, sticky e lightbox (todos corrigidos depois).
- Teclado/leitor de tela: bom no geral; foco inicial do lightbox vai para "Fechar".

## Observações menores
489 mil citado no hero, no parágrafo e na barra; marcas como wordmarks serifados; selo "Amazonas → São Paulo" pequeno demais para carregar a narrativa.

## Perguntas
1. Se a migração Amazonas → SP é o diferencial, por que ela não aparece no sistema visual?
2. O grid de 12 conteúdos é a prova certa para quem decide verba, ou 2–3 cases de parceria com resultado?
3. Uma âncora de preço qualificaria os leads antes do e-mail?
