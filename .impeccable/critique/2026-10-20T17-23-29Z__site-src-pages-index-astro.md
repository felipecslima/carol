---
target: portfólio
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:/Users/felipelima/work/carol/site/src/pages/index.astro"
target_fingerprint: "sha256:4e1f06bc38154cafb4e79c855eedb50461b5af41871713ec7221a32fd1bfb6e6"
target_path: /Users/felipelima/work/carol/site/src/pages/index.astro
timestamp: 2026-10-20T17-23-29Z
slug: site-src-pages-index-astro
---
Method: dual-agent (A: design review · B: detector + browser). Note: A saw detector overlays in 2 screenshots (shared Playwright context kept B's injection).

## Design Health Score
| # | Heurística | Nota | Problema-chave |
|---|---|---|---|
| 1 | Visibilidade do status | 2 | "Copiado!" aparece mesmo se a cópia falhar; lightbox sem "3 de 5" |
| 2 | Correspondência com o mundo real | 3 | Voz PT-BR natural; títulos de reels não batem com o vídeo |
| 3 | Controle e liberdade | 3 | Esc/fundo/Fechar ok; menu mobile sem Esc |
| 4 | Consistência | 3 | Chips do Sobre ≠ filtros ≠ formatos; chips parecem botão |
| 5 | Prevenção de erros | 2 | Títulos inferidos e errados; cópia falha em silêncio |
| 6 | Reconhecimento vs memória | 3 | Barras de resultado sem nome do reel |
| 7 | Flexibilidade | n/a | Portfólio de uma página |
| 8 | Estética e minimalismo | 3 | Ritmo bom; H1 desktop gigante |
| 9 | Recuperação de erros | 1 | catch vazio em main.ts:127, sem mailto |
| 10 | Ajuda | n/a | Portfólio |
| **Total** | | **20/32** | **Aceitável (62%)** |

## Specificity
Copy is Carol's; system is generic creator media kit (jumoura template, 6x serif+italic-accent H2, generic warm palette, Amazonas only in words).
Detector: CLI 0 findings. Overlay 37: 28 low-contrast on cards = false positive (measured vs placeholder #d9cfc2); eyebrow cream 4.44:1 real; italic-serif-display x6; kicker-above-heading x5; oversized-h1; hero-eyebrow-chip; marquee (reduced-motion guard exists).

## Priority issues
1. [P1] Contact path fragile: no mailto, false "Copiado!" (index.astro:188, main.ts:127), about-tag looks clickable.
2. [P1] Media kit lacks audience data; chart bars anonymous, "11 reels" vs 8 bars, bars empty without JS/fast scroll (global.css:166).
3. [P1] Wrong titles: v14 "Pôr do sol de lancha" is a quad bike in Igaratá; p7 is an ad screenshot titled "Reels patrocinado".
4. [P1] Lightbox focus escapes to #copy; static dialog name; focus ring 1.0:1 on amber, 1.6:1 on cream.
5. [P2] Desktop H1 6 lines/587px pushes stats below fold; mobile grid 1 column ~9 screens.
P3: v14 10.6MB, v17 6.5MB; no srcset; favicon 404; relative og:image webp.

## Personas
Jordan (brand manager): no demographics/engagement, no numbers above fold on desktop, no mailto/forwardable kit.
Sam: focus escapes lightbox, invisible focus on amber, no main/skip link, no aria-live, hero video no pause.
Casey: ~9 screens of portfolio, 38px filter pills, 10.6MB video with sound, email button wraps into blob.

## Questions
- Hero headline = the number?
- One Amazonian visual element?
- Filter by what brands buy instead of what Carol films?
