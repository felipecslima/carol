---
target: site/src/pages/index.astro (rodada 3)
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/felipelima/work/carol/site/src/pages/index.astro"
target_fingerprint: "sha256:aa15369c43b9eaeced17b85ec9e4c26a649cf1e06f59c01c6f84dd8e8b33dca0"
target_path: /Users/felipelima/work/carol/site/src/pages/index.astro
timestamp: 2026-10-20T18-27-27Z
slug: site-src-pages-index-astro
---
Method: dual-agent (A: design review · B: detector + browser). Rodada 3, após print da aba Reels e catálogo.

## Design Health Score — 23/32 (72%, Bom) · heurísticas 7 e 10 n/a · histórico 20 → 21 → 23

| # | Heurística | Nota | Problema-chave |
|---|---|---|---|
| 1 | Visibilidade do status | 3 | Cards não mostram views; só o lightbox |
| 2 | Mundo real | 3 | Três taxonomias (tópicos do Sobre, filtros, formatos) |
| 3 | Controle e liberdade | 3 | Marquee só pausa no hover |
| 4 | Consistência | 2 | Números fixos no markup (1,67 milhão, síntese do público, "sete vezes"); hover em `.svc` não clicável |
| 5 | Prevenção de erros | 3 | mailto + copiar com fallback |
| 6 | Reconhecimento | 3 | Reels #1 e #8 sem título |
| 8 | Estética | 3 | Acabamento forte; ~10,8 telas no mobile; barras 647–762 mil quase iguais |
| 9 | Recuperação de erros | 3 | Fallback do clipboard humano |

## Especificidade
Metade autoral (copy, selo, marquee, capas reais, público do Vale do Paraíba), metade template "creator editorial". Origem amazonense ainda só no texto.
Detector: CLI 0 achados. Overlay 1440: 37 (24 low-contrast falso positivo: pixels reais 5,56:1 no pior caso; 13 padrões do brief; oversized-h1 julgamento). Overlay 390: 9, todos padrões do brief. Sem overflow, sem erros de console, sem 4xx/5xx. Contrastes novos: .reel-title 13,3:1, .reel-brand 9,8:1, .source/.aud-stamp 6,8:1.

## Problemas prioritários
- [P1] Contato sem segurança nem próximo passo (prazo, o que mandar, PDF/WhatsApp, CTA fixo no mobile). /impeccable clarify
- [P1] Prova comercial desconectada da oferta: 1 hospedagem, views só em 2 itens e só no lightbox, sem link para o post. /impeccable layout
- [P2] Filtro com 6 opções (2 com 1 item), taxonomia incoerente → ≤4 (Todos · Publis · Viagem & hospedagem · Gastronomia). /impeccable distill
- [P2] Gráfico esconde a melhor história (barras quase iguais; 2 linhas sem título; "7×" não desenhado). /impeccable clarify
- [P3] Números espalhados entre markup e content.ts. /impeccable harden

## Personas
- Brand manager: falta engajamento, alcance de stories, case de hotel/restaurante, faixa de investimento.
- Mobile da bio: rosto abaixo da dobra; ~10,8 telas.
- Leitor de tela: `.aud-sum` lido grudado ("44 anos79%"); "Reel sem título na capa" é ruído; marquee sem pausa fora do hover.

## Menores
Setas no lightbox com "1 de 1"; p6 e v04 repetem hero e grade; v01 (dentista) no ar como Bem-estar; eyebrow do hero omite Amazonas.

## Perguntas
1. Que evidência prova a uma pousada que a Carol enche quartos?
2. Portfólio ou media kit? Por que 12 cards sem desempenho vêm antes dos números?
3. Sem texto, o que continua inconfundivelmente amazonense?
