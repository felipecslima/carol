# Crítica: etapa "Escolha as cores" do assistente (DEV-096)

Alvo: `src/app/assistente/Assistente.tsx` (`/app/novo/`, etapa `cores`). Modo: Operate (primeira impressão do produto).
Método: avaliação A (design) e avaliação B (detector + navegador) em subagentes isolados, síntese depois. Sem degradação.

## Detector
- CLI: limpo (`[]`, saída 0).
- Overlay: limpo em 390 px. Em 1280 px, `italic-serif-display` no h1. Fica: é o padrão de títulos do tema do app (Instrument Serif com ênfase itálica rosa), já usado em todas as telas.

## Medido
- Contraste: título 16,4:1; texto de apoio 10,1:1; opções (marcada e não marcada) 16,4:1; botão 4,9:1 (AA).
- Alvos: opções 48 px de altura; botão 56 px.
- Visível sem rolar: as 3 opções e o botão ficam livres em 320×640, 375×667, 390×844 e 1280×800.
- Console sem erros.

## Achados e o que foi feito
1. **Corrigido (medido).** O grupo de rádio não seguia o padrão do ARIA: as setas não faziam nada e cada opção era uma parada de Tab. Agora há tabindex móvel e as setas trocam a cor e o foco (testado: direita, direita, direita volta ao início, esquerda; o Tab sai para o botão).
2. **Testado e mantido como estava (medido).** No desktop a prévia tem 360 px e o botão 520 px, com os lados esquerdos alinhados (os dois em x = 380). Testei a prévia com 520 px: a miniatura cresce junto e, a 800 px de altura, só a foto aparece. Por isso a prévia e as opções voltaram para 360 px, a largura de um celular.
3. **Corrigido (opinião).** A prévia parecia cortada sem intenção. Agora some em degradê embaixo (`mask-image`).
4. **Corrigido (opinião).** O texto citava "Estilo", uma tela que ela ainda não viu. Agora diz "Dá para trocar quando quiser. Depois é só montar as seções do seu jeito."
5. **Mantido.** Em 320 px, "Menta" quebra para uma segunda linha; as 3 opções continuam visíveis e livres.
6. **Fora do escopo, levado ao usuário.**
   - Os colchetes do exemplo ("[seu nome]") dão cara de formulário à prévia. São o conteúdo de exemplo do produto todo, e trocar por um nome inventado esbarra na regra de não inventar.
   - A amostra de "Pêssego" sai num tom ferrugem (`claro.destaque` da paleta).

## Notas (0 a 4)
Visibilidade 3, correspondência 3, controle 3, consistência 3, prevenção de erros 4, reconhecimento 4, flexibilidade n/a, estética 2→3 após as correções, recuperação de erros n/a, ajuda 3.
