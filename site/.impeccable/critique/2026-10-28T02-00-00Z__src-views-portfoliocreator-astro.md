# Crítica: página de vendas sem modelos (DEV-097)

Alvo: `src/views/PortfolioCreator.astro` (`/portfolio-creator/`). Modo: Persuade. Escopo: só o que mudou (topo, Como funciona, vitrine `#secoes`, planos, teste e perguntas).
Método: avaliação A (design) e avaliação B (detector + navegador) em subagentes isolados. Sem degradação.

## Detector
- CLI: saída 0. Há 3 avisos `design-system-color` na linha 177 (#F9C9DA, #D9CCFA, #CDEFE0), que já existiam antes.
- Overlay:
  - `italic-serif-display` em todos os títulos (padrão da marca, fica).
  - `low-contrast` 4,3:1 em texto escuro sobre o rosa `#e5386a`, em 3 ou 4 pontos que já existiam antes e ficam fora deste escopo.
  - Um caso de 1,0:1 que parece falso positivo de fundo herdado.
  - `straggler` em 6 parágrafos.
  - `marquee`, que é intencional.

## Medido
- Contraste: título da vitrine 16,4:1; texto ao lado 9,9:1; legendas 16,4:1 (nome) e 6,3:1 (layouts); números do topo 7,6:1 (rótulos) e 16,4:1 (valores).
- Grade: 3 colunas no desktop e 2 no celular, sem cartão sozinho na última linha. Nada vaza da tela. Nenhum 404 e nenhum erro no console.
- **Corrigido:** as imagens da vitrine tinham 480 px e eram exibidas a 375 px no desktop (1,28 vezes, abaixo do dobro pedido em tela retina). Agora saem com 780×892.

## Achados levados ao usuário (decisão de conteúdo)
1. As capturas mostram o conteúdo de exemplo vazio ("Sua foto", "[seu nome]", "00 mil"). Parecem rascunho, e uma galeria vende pelo desejo de "quero ficar assim".
2. Cada cartão tem uma paleta diferente, e os pastéis saturados destoam do tom editorial da página.
3. No topo, o celular "Bia" (protótipo, preenchido) aparece ao lado de dois exemplos vazios do editor.

## Fatos conferidos
Os textos novos batem com o produto: 11 seções, 3 cores ou a sua, o Estilo, o teste sem PDF nem publicação e os números digitados. O modo iniciante existe (DEV-091).
