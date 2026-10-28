# Proposta: página de vendas sem modelos (DEV-097)

Data: 28/out/2026. Status: **aprovada e aplicada em localhost em 28/out.** Decisões do usuário:
- Teste grátis: monta tudo e só visualiza, com marca d'água.
- Corrigir junto a promessa da IA dos prints e o "até 10 vídeos".

A página `/portfolio-creator/` fica em `site/` e só vai para produção no merge na `main`.

Motivo: desde 27/out não há modelos para escolher (DEV-096). A página ainda promete "15 modelos, 45 combinações", uma galeria de modelos e "5 dos 15 liberados no teste". Abaixo, cada trecho atual com o texto novo, usando só o que existe hoje no produto.

## O que é verdade hoje (base do texto novo)

- **11 seções prontas:** Capa, Em 1 olhada, Vídeos, Números, Por que eu, Sobre mim, Público, Marcas, Formatos e pacotes, Como eu trabalho e Contato.
  - Cada uma tem 2 ou 3 layouts, somando 24 no total.
  - Por exemplo, a Capa pode ter foto grande, foto redonda ou foto e vídeo de fundo.
- Ela adiciona, esconde, remove e reordena seções, com até 15 na página.
- **Estilo:** 3 paletas prontas (Lavanda, Pêssego e Menta) ou a cor dela, 2 pares de fonte, 3 tipos de cantos (retos, suaves e redondos) e página clara ou escura.
- Tudo se edita no celular, em cima do resultado final.

## Trechos: atual e proposta

### `src/data/portfolio-creator.ts`

**1. Passo 1 de "Como funciona" (`STEPS`, linha 49)**
- Atual: título "Escolha seu modelo", texto "15 modelos com layouts diferentes: suave, colorido, sério, casual, luxo, neon… e 3 paletas em cada um."
- Proposta: título "Monte com seções prontas", texto "11 seções pensadas para o que a marca procura: capa, vídeos, números, público, marcas e mais. Você escolhe quais entram, a ordem e o layout de cada uma."

**2. Galeria `MODELS` (linhas 68-84)**
- Atual: lista dos 15 modelos com as imagens `modelo-*.webp`.
- Proposta: trocar por `SECOES`, uma vitrine de 6 seções com imagem de cada uma, geradas a partir das seções reais do editor. Sugestão: Capa, Vídeos, Números, Público, Marcas e Contato, com o nome e os layouts disponíveis. Exemplo: **Vídeos**, "carrossel, grade ou um grande e os outros pequenos".
- As imagens precisam ser refeitas. O script `scripts/portfolio-creator-shots.mjs` hoje fotografa os protótipos dos modelos, e passaria a fotografar `/app/blocos/` (a prévia das seções que já existe).

**3. Teste grátis (`TRIAL`, linha 89)**
- Atual: "5 dos 15 modelos liberados para montar, com marca d'água".
- Proposta: "Todas as seções liberadas para montar, com marca d'água".
- **Precisa da sua decisão:** o que o teste libera agora que não há modelos para travar. Esta proposta parte de "tudo liberado para montar; PDF e publicar só no plano", que é o que o produto faz hoje.

**4. Plano PDF + link (`PLANS`, linha 115)**
- Atual: "Escolha entre os 15 modelos e 3 paletas".
- Proposta: "Todas as seções e o Estilo completo (cores, fontes e cantos)".

**5. Plano de atualização mensal (`PLANS`, linha 151)**
- Atual: "Troque de modelo e de cores quando quiser".
- Proposta: "Troque seções, layouts e cores quando quiser".

**6. Pergunta frequente (`FAQ`, linha 166)**
- Atual: "No teste, 5 modelos ficam liberados para você montar seu portfólio, com marca d'água. Os outros 10 aparecem com cadeado e são liberados quando você escolhe um plano, assim como baixar o PDF e publicar o site."
- Proposta: "No teste você monta seu portfólio inteiro, com todas as seções, e vê o resultado com marca d'água. Baixar o PDF e publicar o site são liberados quando você escolhe um plano." Depende da decisão do item 3.

### `src/views/PortfolioCreator.astro`

**7. Descrição da página para o Google (linha 17)**
- Atual: "Monte portfólio e mídia kit de UGC e influência em 15 modelos, com PDF e link próprio. Criado pela Carol Limah. Teste grátis."
- Proposta: "Monte portfólio e mídia kit de UGC e influência com seções prontas, com PDF e link próprio. Criado pela Carol Limah. Teste grátis."

**8. Menu (linha 75)**
- Atual: "Modelos", com âncora `#modelos`.
- Proposta: "Seções", com âncora `#secoes`.

**9. Texto de abertura (linha 89)**
- Atual: "Mesmo sem nenhuma publi, você escolhe um modelo, sobe os vídeos que gravou em casa e monta um portfólio…"
- Proposta: "Mesmo sem nenhuma publi, você escolhe as seções, sobe os vídeos que gravou em casa e monta um portfólio…" O resto da frase fica igual.

**10. Número em destaque (linha 98)**
- Atual: "modelos de layout: 15".
- Proposta: "seções prontas: 11".

**11. Imagens do topo (linhas 106-107)**
- Atual: "Modelo Nuvem" e "Modelo Assinatura". O modelo Assinatura nunca existiu no produto.
- Proposta: duas imagens do portfólio de exemplo no editor real, uma clara (Lavanda) e uma escura (página escura). Texto alternativo: "Portfólio de exemplo com a capa de foto redonda, cor Lavanda" e "O mesmo portfólio com a página escura".

**12. Seção da galeria (linhas 182-196)**
- Atual: título "15 modelos, *45 combinações*" e o texto "Cada modelo tem layout próprio e 3 paletas de cor."
- Proposta: título "11 seções, *do seu jeito*" e o texto "Cada seção tem 2 ou 3 layouts. Você escolhe quais entram, em que ordem, e ajusta cor, fonte e cantos." A grade passa a mostrar a vitrine do item 2. A animação de revelação (`src/scripts/portfolio-creator.ts`, classe `.models`) continua, mudando só o nome da classe.

**13. "Por que não montar em outro lugar?" (linha 241)**
- Atual: "Editores comuns te dão um modelo em branco. Aqui você recebe uma estrutura pensada por mim…"
- Proposta: fica como está. O argumento continua verdadeiro: ela recebe as seções prontas, já na ordem que a marca procura.

**14. Chamada do teste (linha 252)**
- Atual: "No teste grátis você escolhe um modelo, sobe seus vídeos e prints e vê o seu portfólio de verdade…"
- Proposta: "No teste grátis você monta suas seções, sobe seus vídeos e prints e vê o seu portfólio de verdade…" O resto fica igual.

## Fora desta proposta, mas notei ao ler a página

Não mexi em nada disso. Fica registrado para você decidir.

- **"A IA lê os prints e preenche os números"** (passo 2 de `STEPS` e o plano PDF: "IA que lê seus prints do Instagram"): a leitura de prints ficou para depois da versão 1 (DEV-130). Hoje ela digita os números.
- **"até 10 vídeos"** (passo 2 e `BENEFITS`): o editor hoje não limita a quantidade de vídeos na seção Vídeos (a lista não tem máximo de itens em `src/blocks/registro.ts`). Ou a página deixa de dizer "até 10", ou o editor passa a limitar em 10.

## Como aplicar, depois do seu "aprovado"

1. Trocar os textos dos itens 1 e 3 a 14 em `src/data/portfolio-creator.ts` e `src/views/PortfolioCreator.astro`.
2. Gerar as imagens novas (itens 2 e 11) a partir do editor real e apagar as `modelo-*.webp` que deixarem de ser usadas.
3. Fazer as capturas em 390 e 1280 px, rodar o impeccable e o Playwright, e mostrar antes do commit.
4. O site só muda em produção no merge na `main`, quando você pedir para publicar.
