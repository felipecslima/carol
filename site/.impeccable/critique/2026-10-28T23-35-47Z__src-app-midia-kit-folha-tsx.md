---
target: mídia kit em 2 páginas (DEV-154)
total_score: 18
max_score: 28
na_heuristics: 1,3,9
p0_count: 0
p1_count: 3
target_identity: "file:/Users/felipelima/work/carol/site/src/app/midia-kit/Folha.tsx"
target_fingerprint: "sha256:1a5389d16a66f83aad3378db60a5b1e785542e12028142330a7cdcf8079a5bdc"
target_path: /Users/felipelima/work/carol/site/src/app/midia-kit/Folha.tsx
timestamp: 2026-10-28T23-35-47Z
slug: src-app-midia-kit-folha-tsx
---
Method: dual-agent (A: revisão de design · B: detector + navegador)

# Crítica: mídia kit "Revista" em 2 páginas A4 (DEV-154)

## Nota de design (Nielsen)
| # | Heurística | Nota | Ponto principal |
|---|---|---|---|
| 1 | Estado do sistema | n/a | documento impresso; o período dos números faz esse papel |
| 2 | Mundo real | 3 | termos de marca ("views em 30 dias", "Sob consulta"); "Informado pela creator" é honesto |
| 3 | Controle | n/a | nada a desfazer; QR e capas clicáveis são as saídas |
| 4 | Consistência | 2 | tamanhos fora dos cinco (frase 22, créditos 18), período repetido duas vezes |
| 5 | Prevenção de erro | 2 | manchete longa passa de 3 linhas na Nunito; página 2 vazia no caso mínimo |
| 6 | Reconhecer | 3 | cada número tem o rótulo junto |
| 7 | Eficiência | 3 | dá para ler em 10 s: foto, números, público |
| 8 | Estética e mínimo | 2 | frase da capa repetida 3 vezes na página 1; 4 "Sob consulta" seguidos |
| 9 | Recuperação | n/a | — |
| 10 | Ajuda | 3 | prazo de resposta e legenda do QR |
| **Total** | | **18/28** | n/a: 1, 3, 9 |

## Especificidade
O esqueleto é de revista de verdade (sangria, faixa de cor, capitular, créditos). Com a Instrument Serif fica com cara de matéria; com a Nunito 900 da conta de teste vira um modelo bonito, mas genérico. A cópia repetida (manchete, título do Sobre e frase dizem "amazonense morando em São Paulo") era o maior sinal de molde.

Detector: 0 achados nos TSX. No CSS, 6 avisos de cor e canto fora do DESIGN.md (o DESIGN.md é o do site da Carol, não o do app: o `#e9e1d8`, o `#d42a5b` e os `#fff` da impressão são da tela do app e da impressão, falsos positivos; o canto de 2 px da barra foi tirado). No navegador: parágrafo do Sobre com "sincera." sozinho na última linha (corrigido com `text-wrap: pretty`); o "113 letras por linha" é artefato da capitular (a coluna tem 341 px, ~50 letras). Nenhum texto abaixo de 13,5 px; legendas com contraste mínimo de 6,45:1; nada passa da margem.

## O que funciona
1. Grade e contenção reais: 12 colunas, 48 px, um destaque e um campo de cor, sem cartões nem sombras.
2. Dados honestos: período, "Informado pela creator", "Sob consulta" em vez de preço inventado.
3. Capas 9:16 com título, views e marca: prova de trabalho que a marca lê em segundos.

## Problemas prioritários
1. **[P1] A mesma frase 3 vezes na página 1.** Corrigido: a frase em destaque some quando metade das palavras dela já está na manchete ou no Sobre.
2. **[P1] Nunito 900 quebra a direção Revista** (manchete, números e capitular pesados e arredondados). Decisão sua: kit com serifa própria ou fonte da creator.
3. **[P1] Página 2 quase vazia no caso mínimo.** O plano fixou 2 páginas; decisão sua.
4. **[P2] Período repetido e tamanhos extras.** Corrigido: o período do público some quando é igual ao dos números; frase em 24 px itálico. Os créditos ficam em 18 px (exceção documentada: em 24 px, 18 nomes não cabem).
5. **[P2] Público mistura idade e gênero na mesma escala** ("mulheres 67,7%" ao lado das faixas de idade). Fica para depois: os itens não dizem o tipo.
(O "P0 manchete cortada em …do Bras" era o meu dado de teste, cortado em 90 letras; o código não corta o título.)

## Personas
- **Gerente de marketing, 10 s:** foto, números e nicho rápido; quatro "Sob consulta" não dão base de orçamento.
- **Planejador de agência que imprime:** a sangria pode ganhar borda branca em impressora de escritório; o QR de ~25 mm lê bem.
- **Creator com pouco conteúdo:** página 2 é uma folha em branco com a faixa no pé.

## Observações menores
- Com 3 números, a grade espalha os números pela largura toda.
- Legendas dos vídeos com 3 a 4 linhas desiguais.
- A faixa do contato em âmbar pode lembrar "faixa de promoção"; questão de gosto.

## Perguntas
- Se o kit precisa de serifa para parecer revista, ele deve herdar a fonte do site da creator?
- Quatro "Sob consulta" seguidos ajudam a marca, ou uma linha só diz o mesmo?
- Creator com pouco conteúdo deveria ganhar 1 página bem feita em vez de 2 vazias?
