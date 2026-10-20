---
target: site/src/pages/index.astro (após contato P1)
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
target_identity: "file:/Users/felipelima/work/carol/site/src/pages/index.astro"
target_fingerprint: "sha256:44b4a9f6447c26af4957aeeb8eb6ac1170d4e7b4cadd3d966774cb50813468fb"
target_path: /Users/felipelima/work/carol/site/src/pages/index.astro
timestamp: 2026-10-20T19-10-20Z
slug: site-src-pages-index-astro
---
Method: dual-agent (A: revisão de design · B: detector + overlay)

## Nota: 24/32 (75%, Bom) · heurísticas 7 e 10 n/a (portfólio)
| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Status | 3 | Filtros com contagem, cópia com feedback, dock reage à rolagem; nav não marca a seção |
| 2 | Mundo real | 3 | Reel de 762 mil sem rótulo; "publi"/"UGC" ok para marketer |
| 3 | Controle | 3 | Marquee sem pausa (WCAG 2.2.2) |
| 4 | Consistência | 3 | "Fale comigo" / "Quero uma parceria" / "Vamos conversar?"; `.svc` com hover sem clique |
| 5 | Prevenção de erros | 3 | mailto com roteiro + copiar; a tela não diz que o roteiro já vem no e-mail |
| 6 | Reconhecimento | 3 | Roteiro de 5 itens para quem não usa o mailto |
| 7 | Flexibilidade | n/a | |
| 8 | Estética | 3 | Contato com 6 blocos e hierarquia invertida; barras 647–762 mil parecem iguais |
| 9 | Recuperação | 3 | mailto sem cliente de e-mail falha em silêncio (copiar compensa) |
| 10 | Ajuda | n/a | |

## Especificidade
Conteúdo autoral (voz, capas reais, Vale do Paraíba, case ML, selo Amazonas → SP); forma ainda de media kit genérico de criadora. Amazonas só no texto e no selo. O PDF A4 é a peça mais autoral.
Detector: fonte 0 achados; HTML gerado 49 (index 39: 25 low-contrast nos cards = falso positivo do placeholder #d9cfc2, 1 hover não reproduzido, padrões do brief, cramped-padding em seções full-bleed; media-kit 10: tiny-text 10–11px e leading 1,2 por densidade de impressão). Overlay: index 37/33, media-kit 8/9 (+ rolagem lateral a 390px, esperado numa folha A4 fixa). Console limpo, sem 4xx/5xx, PDF 200. Dock 189×48, contraste 15,95:1; contato 9,83:1.

## Problemas prioritários
- [P1] Hierarquia do contato invertida: ação mais forte é "Copiar"/"Baixar PDF"; o mailto com roteiro é link de texto; 5 opções iguais (6 com WhatsApp). Fix: botão primário "Escrever e-mail", copiar como link pequeno, PDF contorno, Instagram/Threads em linha de texto, "O e-mail já abre com este roteiro:" e 4 itens; rosto/voz da Carol junto. → distill + layout
- [P2] Gráfico de Resultados não prova a diferença: comparação 58,4 mil → 421 mil → 470 mil; rótulo nas linhas sem título; hero com "421 mil média por reel". → clarify
- [P2] Dock creme some sobre o portfólio creme e cobre legendas dos cards. Fix: dock escuro/caramelo sobre seções claras + padding-bottom na grade. → adapt
- [P2] Falta prova comercial (engajamento, stories, faixa de preço, links dos posts) — depende da Carol. → clarify
- [P3] Rótulo único do CTA, hover dos `.svc`, pausa no marquee, `aria-current`. → polish

## Personas
- Jordan: reel nº 1 sem título; roteiro em coluna no celular parece menu tocável.
- Riley: mailto sem cliente falha sem aviso; PDF 2,5 MB; 6 ações quando entrar o WhatsApp (número agora normalizado para dígitos).
- Casey: contato a ~10 telas (dock mitiga); rosto abaixo da dobra; "Copiar e-mail" largo domina.
- Marketer: tem o suficiente para shortlist; trava no orçamento (sem engajamento, stories, preço, links).

## Menores
`.about-tag` é um segundo link de e-mail sobre a foto; "79%" mistura capital e Vale; roteiro em maiúsculas destoa do tom; fonte dos dados pequena no PDF; PDF escuro imprime mal.

## Perguntas
1. O contato do site não deveria ser uma versão do PDF (rosto, 3 números, um botão)?
2. O que impede este visual de ser de outra criadora de SP? (Amazonas no visual)
3. Por que esconder o preço? Uma faixa "a partir de" dá contexto ao "Verba (opcional)".
