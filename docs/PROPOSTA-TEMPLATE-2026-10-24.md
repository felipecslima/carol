# Proposta para o template (24/out/2026)

**Nota de 27/out/2026: sem modelos.** Desde 27/out não existem modelos para escolher; as seções montam o portfólio e o visual se ajusta na aba Estilo. O item 14 ("Editorial") deixa de ser um segundo modelo e vira candidato a opção de Estilo (par de fontes com serifa e fundo espresso ou creme) ou a variações de seção, a decidir depois. A pergunta aberta 2 foi superada por essa decisão. O resto da proposta (as seções e as ondas) segue valendo.

Entrada: pedido do usuário de uma crítica voltada ao template e à finalidade dele (a creator conseguir publicidade), com propostas de melhoria e peças novas. Não existe skill de PM instalada; a organização de produto abaixo foi feita à mão, a partir do PRD (`01-prd.md`). A crítica seguiu o método do impeccable: avaliador A (design, olhando como a marca) e avaliador B (detector e medições), isolados. Nada foi construído nesta rodada.

## 1. Organização de produto

**Objetivo do usuário (creator):** fechar publicidade. O portfólio existe para uma marca abrir o link e responder.
**Métrica que importa:** marca abriu (já no PRD, 50% em 14 dias) e **marca clicou em contato** (falta medir; é a métrica mais próxima de "fechar").
**A marca decide em ~10 s no celular** e precisa de 5 respostas, nesta ordem:
1. Quem é e o que faz? 2. Combina com a minha marca? 3. Já provou que entrega? 4. O que posso pedir e como funciona? 5. Como chamo?

**Tensão central:** o produto é vendido a quem tem pouco (0 a poucas publis), mas hoje a prova que ele destaca (números e marcas) é justamente a que a iniciante não tem. O modo iniciante só esconde blocos e sobra uma página vazia de prova.
**Tese:** para a iniciante, trocar "prova por números" por **"prova por ofício"**: vídeos tocando, entregáveis claros, jeito de trabalhar, fit de marca. Tudo honesto, nada inventado.

**Regras que não mudam:** nenhum número, depoimento, case ou preço inventado; preço só se ela digitar; "quero trabalhar com" nunca no mesmo bloco de "já trabalhei"; tom chique e contido; sem alterar o site da Carol.

## 2. Resultado da crítica

**Avaliador A (design, ótica da marca)**
- A capa funciona; depois tudo tem o mesmo peso e a página parece inventário (8 seções, ~3.800 px no celular), não proposta.
- Com a Carol dentro, o Nuvem fica genérico (lavanda, cartões, sans pesada): outro produto o usaria sem mudar. Abaixo de "tão bom quanto o site da Carol", que tem serifa, itálico no trecho-chave, números sem caixa e dado na primeira dobra.
- Primeira dobra sem prova: os números só aparecem depois de rolar; no modo iniciante a dobra é "Oi, eu sou…" e um botão.
- Vídeos (a única prova real) são miniaturas mudas, sem play, sem abrir o post. Formatos sem entregável. Marcas como lista de nomes. Contato a 3,5 telas de distância, sem CTA no meio.
- Fortes: capa clara, trava de número de exemplo (honestidade), rodapé com prazo de resposta.
- Heurísticas (9 aplicáveis): 3 em quase todas; 4 em prevenção de erro; 2 em flexibilidade (2 variações por bloco, ordem sem narrativa).

**Avaliador B (detector e medições)**
- Detector: 0 achados em blocos e temas; 10 em `midia-kit.css`, todos falsos positivos (o `DESIGN.md` é do site da Carol).
- Contraste de texto 0 falhas nas 12 combinações (3 paletas × claro/escuro, 2 larguras), 0 overflow, 0 erros de console, CLS ~0,002, alvos de toque todos ≥ 48 px, 3 raios de canto, nenhuma seção acima de 1,6 tela.
- **Defeitos reais:** (1) mídia kit com texto de ~8,9 px na folha (≈ 6,6 pt no PDF), pequeno demais; (2) mídia kit com buraco à direita da linha de vídeos e contato colado na borda inferior; (3) anel de foco fixo e escuro, pode ter pouco contraste nas paletas escuras (não medido); (4) `.bl-exemplo` com 12 px (só no editor); (5) rota de prévia sem `<main>`.
- Não medido: foto e vídeo reais, teclado em sequência, texto sobre imagem de fundo, mídia kit com conteúdo cheio, impressão real.

## 3. Propostas, por prioridade

Critério: quanto ajuda a marca a responder × esforço × risco de inventar dado.

### Onda 1 — o que mais move a agulha (recomendo começar aqui)
| # | Peça | O que a marca vê | O que a creator dá | Iniciante |
|---|---|---|---|---|
| 1 | **Resumo "em 1 olhada"** (faixa logo após a capa) | nicho, cidade, plataforma, 1 número (se tiver), o que entrega | 3 campos | sem número: nicho, cidade, formato principal |
| 2 | **Vídeo em destaque com player** (bloco Vídeos ganha variação "um grande") | a creator em ação, tocando, com marca se houver | 1 vídeo | "Conteúdo meu", nunca rotulado como publi |
| 3 | **Formatos com entregável** (evolução do bloco Formatos) | o que inclui, prazo, "sob consulta" ou valor | marca os formatos que faz (Reels, Stories, UGC, foto) | padrão "sob consulta"; nenhum preço sugerido |
| 4 | **Por que trabalhar comigo** (3 motivos) | argumento em 3 linhas | escolhe de frases-modelo editáveis ou escreve | vira o argumento principal |
| 5 | **Como trabalho** (briefing, roteiro, gravação, entrega) | segurança de processo | ajusta o modelo; prazo opcional | serve a quem não tem histórico |
| 6 | **Botão de contato fixo no celular** | "Chamar no WhatsApp" sempre à mão | nada (usa o contato) | igual |
| 7 | **Ordem por narrativa** | quem sou → provo → o que entrego → chamo | nada (ordem padrão por modo) | ordem própria do modo iniciante |

### Onda 2 — reforço de prova
8. **Case simples (3 linhas):** marca, o que fiz, o que entreguei, link do post. Só aparece com publi real; resultado só com dado dela. Sem publi: bloco "conteúdo-exemplo / proposta" claramente rotulado.
9. **Marcas: logos e tipo de trabalho; "marcas que combinam comigo"** em bloco separado e rotulado "quero trabalhar com".
10. **Bastidores / como gravo** (2 mídias): mostra set e luz, profissionalismo sem número.
11. **"O que a marca vê em 10 s"** (para a creator): simula a primeira dobra e lista o que falta ("sem vídeo", "sem contato"). Reforça o `PainelRevisao`.

### Onda 3 — depois
12. **Selo de dado verificado** (print do Insights com data), junto com a leitura de prints (P1 do PRD).
13. **Antes e depois**, depoimento com permissão (já previsto no PRD como "Fechei uma publi!").

### Identidade (a pergunta mais séria da crítica)
14. *(Superado em 27/out/2026: sem modelos; o Editorial vira candidato a opção de Estilo ou a variações de seção, a decidir depois.)* **Segundo modelo "Editorial"** na voz do site da Carol (serifa, itálico no trecho-chave, números sem caixa, fundo espresso ou creme) como a opção chique. O Nuvem fica como o jeito leve. Hoje os modelos Clean/Pop/Casual/Glow Rosé (DEV-070 a 073) só trocariam cor; proponho que cada um tenha voz própria e que o Editorial entre antes deles. **Precisa de decisão sua.**

### Simplificar ou remover
- "Exemplo · toque para trocar" repetido em cada cartão: uma faixa única no topo basta.
- Público com 3 cartões iguais misturando idade e gênero: uma frase ("mulheres de 25 a 44") e uma barra.
- Variação "Barras comparando" em Números, sem base de comparação.
- Botão "Voltar a editar" cobrindo conteúdo no modo Ver.

### Correções técnicas (sem decisão, pequenas)
- Mídia kit: texto mínimo de ~9 px para ao menos 11 px na folha (priorizar menos blocos ou 2 páginas opcionais), linha de vídeos preenchendo a largura, margem do contato.
- Anel de foco com contraste nas paletas escuras; `<main>` na prévia; `.bl-exemplo` em 14 px.

## 4. Impacto no escopo (decisões)
O PRD fixa 8 blocos × 2 variações na versão 1. As ondas 1 e 2 criam 4 a 6 blocos novos e variações. Isso é mudança de escopo: confirmar antes.
Há também uma métrica nova a registrar: clique em contato na página publicada (depende da publicação, E11).

## 5. Perguntas abertas
1. A iniciante precisa dos mesmos 8 blocos de quem tem 50 publis, ou de uma página curta e honesta sobre o que ela entregaria?
2. ~~"Tão bom quanto o site da Carol" = voz própria por modelo? (item 14)~~ Superada em 27/out/2026: sem modelos. Fica a pergunta de quanto da voz do site da Carol entra como opção de Estilo.
3. Quantas telas a marca tolera até o contato? (hoje 3,5)

Artefatos da crítica: capturas em `/tmp/crit/` e `/tmp/blocos-*.png` (temporárias).
