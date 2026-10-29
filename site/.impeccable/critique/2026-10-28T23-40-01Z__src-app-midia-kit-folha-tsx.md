---
target: mídia kit em 2 páginas (DEV-154), 2ª rodada
total_score: 16
max_score: 28
na_heuristics: 3,9,10
p0_count: 1
p1_count: 3
target_identity: "file:/Users/felipelima/work/carol/site/src/app/midia-kit/Folha.tsx"
target_fingerprint: "sha256:1a5389d16a66f83aad3378db60a5b1e785542e12028142330a7cdcf8079a5bdc"
target_path: /Users/felipelima/work/carol/site/src/app/midia-kit/Folha.tsx
timestamp: 2026-10-28T23-40-01Z
slug: src-app-midia-kit-folha-tsx
---
Method: dual-agent (A: revisão de design · B: detector + navegador)

# Crítica 2: mídia kit "Revista" em 2 páginas (DEV-154), depois das correções da 1ª rodada

## Nota (Nielsen, adaptada ao papel)
| # | Heurística | Nota | Ponto principal |
|---|---|---|---|
| 1 | Estado | 3 | números com fonte e período |
| 2 | Mundo real | 3 | pt-BR natural; "pela creator" soa estranho |
| 3 | Controle | n/a | documento estático |
| 4 | Consistência | 2 | barras misturam idade, gênero e cidade; marca sozinha na linha da legenda dos vídeos |
| 5 | Prevenção de erro | 1 | página 2 vazia no caso mínimo; manchete com 4 linhas na Nunito |
| 6 | Reconhecer | 3 | rótulo sob cada número; legenda no QR |
| 7 | Eficiência | 2 | 4 linhas de "Sob consulta" |
| 8 | Estética | 2 | título do Sobre repete a manchete; ~170 px de sobra no pé da página 1 |
| 9 | Recuperação | n/a | — |
| 10 | Ajuda | n/a | o QR faz esse papel |
| **Total** | | **16/28** | n/a: 3, 9, 10 |

## Especificidade
Parcial. A abertura (foto em sangria + manchete + faixa de números) é de revista; da faixa para baixo vira página de uma coluna de seções. Falta um gesto editorial (contraste de escala, branco planejado). Com a Instrument Serif a direção aparece; com a Nunito 900, parece app.

Detector: saída 0; 5 avisos de cor em `midia-kit.css` (tela do app e impressão; falsos positivos para o kit). Navegador: "~105 letras por linha" no parágrafo com capitular (falso positivo: a coluna tem 341 px, ~50 letras). Tudo ≥ 13,5 px; contraste mínimo 6,45:1; nada passa da margem. A página 2 da conta de teste já sai com `data-apertada`.

## O que funciona
1. Abertura e faixa de números como uma unidade, com período honesto.
2. Destaque disciplinado; sem cartões, sombras ou pílulas.
3. Faixa do contato é um fecho de verdade: e-mail, WhatsApp, prazo e QR.

## Problemas prioritários
1. **[P0] Caso mínimo sai com página 2 vazia** (só a faixa do contato). Decisão do usuário (2 páginas fixas).
2. **[P1] Manchete passa de 3 linhas na Nunito** (4 linhas na conta de teste; o laço medido não desce abaixo de 36 px). O "…do Bras" do caso extremo é o dado de teste cortado em 90 letras, não o código.
3. **[P1] Público mistura dimensões numa escala só** (mulheres, idades, cidades).
4. **[P1] Repetição na página 1:** título do Sobre repete a manchete; "Cidade: São Paulo" repete o @ e cidade.
5. **[P2] "Sob consulta" em todas as linhas** com pontilhado.

## Personas
- Gerente de marketing (10 s): números ok; público ambíguo; marcas grandes enterradas numa lista de 18.
- Agência que imprime: sangria cortada em impressora de escritório; e-mail e telefone legíveis no papel.
- Creator com pouco conteúdo: página 2 vazia; sem foto, metade direita vazia.

## Menores
- Legenda dos vídeos: marca quebra sozinha ("· Shein"); pôr numa linha própria.
- Créditos em 18 px pesam na Nunito; capitular Nunito 900 pesada.
- Espaço acima do contato desigual na página 2.

## Perguntas
- A marca deve lembrar "58,4 mil" ou uma frase sobre o público?
- 1 página por padrão, 2 só quando há conteúdo para encher?
- Nunito 900 cabe na direção Revista?
