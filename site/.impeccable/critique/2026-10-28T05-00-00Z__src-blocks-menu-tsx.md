# Crítica: menu do topo da página (DEV-098)

Alvo: `src/blocks/Menu.tsx` (página no ar, modo Ver e editor), grupo "No menu" em `CamposDoBloco.tsx` e o interruptor em `Paineis.tsx`. Modo: Experience (página da creator) e Operate (editor).
Método: avaliação A (design) e avaliação B (detector + navegador) em subagentes isolados. Sem degradação.

## Detector
CLI limpo nos dois arquivos. Overlay sem nenhum achado dentro do menu.

## Medido
- Contraste em todas as paletas (Lavanda, Pêssego, Menta) e nos dois climas:
  - itens inativos de 5,5 a 7,3:1; item ativo de 7,2 a 13,3:1;
  - sublinhado do ativo e pílula do Contato contra o fundo de 5,0 a 5,5:1; texto do Contato de 6,5 a 7,7:1;
  - foco de 7,2 a 13,3:1.
- A ordem do Tab segue a ordem visual. O nome da navegação é "Seções da página", e o `aria-current="location"` fica só no item ativo.
- Nada vaza da tela em 320, 390 e 1280 px. Sem erros no console.

## Corrigido depois da crítica
1. **Medido.** Em 320 e 390 px o Contato ficava fora da tela até a pessoa deslizar a faixa. Agora fica fora da faixa, fixo na ponta direita e sempre à vista.
2. **Medido.** Ao deslizar, a borda esquerda cortava o texto seco. Agora ela esmaece como a direita, e um recuo interno deixa o primeiro e o último item inteiros quando a faixa está parada.
3. **Medido.** A pílula do Contato tinha 38 px de altura. Agora tem 44 px.

## Levado ao usuário (opinião)
- No celular há dois chamados de contato fixos ao mesmo tempo: a pílula do menu e o botão flutuante "Chamar no WhatsApp", que leva direto ao WhatsApp.
- No editor, a faixa fica no começo da página. Quem renomeia uma seção lá embaixo não vê o menu sem rolar. O campo já mostra o nome, e o nome padrão aparece na dica.
- O peso 700 em todos os itens deixa pouca diferença para o ativo, que se distingue pelo sublinhado e pela cor. Mudar o peso no ativo faria a faixa pular.
