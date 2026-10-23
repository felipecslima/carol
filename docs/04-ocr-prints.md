# Leitura de prints do Instagram sem IA — especificação do script

Atualizado em 23/out/2026. Parte do Portfólio Creator (construtor de site e mídia kit).

## 1. Objetivo

Ler os prints do Instagram que a creator envia e devolver os números do mídia kit em JSON, **sem IA generativa** na extração. O script roda no navegador do celular da creator (o print não sai do aparelho), não tem custo por print e responde em poucos segundos.

Quando o script não consegue ler um campo com segurança, ele **não chuta**: marca o campo como não lido e o print segue para a reserva com IA (fora do escopo deste script, ver seção 11).

Regra de ouro herdada do produto: **nenhum número é inventado ou calculado na leitura.** O script transcreve o que está na tela. Médias e comparações são calculadas depois, por outro módulo, a partir dos dados lidos.

## 2. Entrada

- 1 a 7 imagens por envio (PNG, JPEG ou HEIC já convertido para PNG/JPEG no aparelho).
- Prints de iPhone e Android, tema claro ou escuro, interface em português ou inglês.
- Prints que a creator deve enviar (o app mostra um exemplo de cada):
  1. Perfil
  2. Insights > Visualizações (últimos 30 dias)
  3. Insights > Interações (últimos 30 dias)
  4. Insights > Seguidores / Público (cidades, faixa etária, gênero; pode ser mais de 1 print)
  5. Aba Reels do perfil (1 ou 2 prints da grade)
  6. Opcional: insight de um reel específico (para publis)

## 3. Saída

Um JSON por print, e um JSON consolidado da creator.

### 3.1 Por print

```json
{
  "arquivo": "IMG_1234.png",
  "tela": "visualizacoes",
  "idioma": "pt",
  "tema": "escuro",
  "periodo": { "texto": "Últimos 30 dias", "inicio": null, "fim": null, "dias": 30 },
  "conta": { "texto": "@joana", "valor": "joana" },
  "campos": {
    "visualizacoes":      { "texto": "1,2 mi", "valor": 1200000, "confianca": 0.97, "caixa": [84, 412, 190, 52] },
    "contas_alcancadas":  { "texto": "312 mil", "valor": 312000, "confianca": 0.95, "caixa": [84, 790, 160, 40] },
    "pct_nao_seguidores": { "texto": "78,4%", "valor": 78.4, "confianca": 0.93, "caixa": [610, 540, 110, 36] }
  },
  "nao_lidos": ["pct_seguidores"],
  "avisos": ["periodo_diferente_de_30_dias"],
  "precisa_reserva": true
}
```

- `texto`: exatamente como o OCR leu, depois da limpeza de ruído.
- `valor`: número normalizado (ver seção 7). `null` se não foi possível normalizar.
- `confianca`: de 0 a 1 (ver seção 9).
- `caixa`: `[x, y, w, h]` em pixels, na imagem original (tipo `Caixa` em `tipos.ts`), para destacar o número na tela "Confere pra mim?".
- `listas`: só na tela de público (`cidades`, `faixa_etaria`, `genero`), cada item com `nome`, `pct`, `texto`, `confianca`, `caixa`.
- `reels`: só na aba Reels, cada célula com `linha`, `coluna`, `texto`, `valor`, `confianca`, `caixa`.
- `fatores`: em cada campo, os quatro fatores da seção 9.2 (`ocr`, `rotulo`, `posicao`, `validacao`), para calibrar o limite com o conjunto anotado.
- `nao_lidos`: campos esperados naquela tela que não foram encontrados.
- `precisa_reserva`: `true` se algum campo essencial ficou em `nao_lidos`, com confiança abaixo do limite, ou se alguma validação falhou.

### 3.2 Consolidado da creator

```json
{
  "conta": "joana",
  "periodo": { "dias": 30, "inicio": "2026-09-20", "fim": "2026-10-19" },
  "perfil":        { "seguidores": 18400, "publicacoes": 212 },
  "visualizacoes": { "total": 1200000, "contas_alcancadas": 312000, "pct_seguidores": 21.6, "pct_nao_seguidores": 78.4 },
  "interacoes":    { "total": 48200, "contas_com_engajamento": 9100 },
  "publico": {
    "cidades":       [{ "nome": "Recife", "pct": 18.2 }],
    "faixa_etaria":  [{ "faixa": "25-34", "pct": 41.0 }],
    "genero":        { "mulheres": 72.5, "homens": 27.5 }
  },
  "reels": [{ "arquivo": "IMG_1236.png", "linha": 1, "coluna": 1, "views": 212000 }],
  "origem": { "perfil.seguidores": "IMG_1230.png" },
  "avisos": []
}
```

Cada número do consolidado guarda de qual print veio (`origem`, chave = caminho do número), para a tela de conferência. Número não lido ou com confiança abaixo do limite fica `null` (ou lista vazia) no consolidado.

Regras do consolidado:
- Campos **D** (como `publicacoes`) aparecem quando lidos; nunca são exigidos.
- `visualizacoes.total` e `interacoes.total` vêm das telas 4.4 e 4.5. A visão geral (4.3) só entra quando a tela específica não foi lida, e `origem` mostra qual print valeu.
- Mais de um print da aba Reels: as células são concatenadas, podendo repetir reels que aparecem nos dois prints (aviso `reels_de_varios_prints`); a tela de conferência resolve.

## 4. Telas e campos

Marcação: **E** = essencial (versão 1), D = depois.
Os rótulos abaixo são os esperados hoje e **precisam ser conferidos com prints reais** (iPhone e Android, PT e EN) antes de fechar o dicionário. Guardar os rótulos em um arquivo de dicionário, nunca espalhados no código, porque o Instagram muda os textos.

### 4.1 Em todo print

| Campo | Como achar | Tipo |
|---|---|---|
| `tela` | classificação por palavras-chave (seção 6) | E |
| `periodo` | "Últimos 30 dias" / "Last 30 days" / intervalo de datas ("20 set - 19 out", "Sep 20 - Oct 19") | E |
| `conta` | texto começando com @ no topo, quando existir | E (conferência) |
| `idioma` | a partir dos rótulos encontrados | E |
| `tema` | claridade média da imagem | E |

### 4.2 Perfil (`perfil`)

| Campo | Rótulos PT / EN | Tipo |
|---|---|---|
| `seguidores` | "seguidores" / "followers" | E |
| `publicacoes` | "publicações" / "posts" | D |
| `seguindo` | "seguindo" / "following" | D (só para não confundir com seguidores) |

Atenção: no perfil, o número fica **acima** do rótulo, não ao lado.

### 4.3 Insights > visão geral (`visao_geral`)

| Campo | Rótulos PT / EN | Tipo |
|---|---|---|
| `visualizacoes` | "Visualizações" / "Views" | E |
| `interacoes` | "Interações" / "Interactions" | E |
| `novos_seguidores` | "Seguidores" / "Followers" (nesta tela é o saldo do período) | D |
| `conteudo_compartilhado` | "Conteúdo compartilhado" / "Content you shared" | D |

### 4.4 Insights > visualizações (`visualizacoes`)

| Campo | Rótulos PT / EN | Tipo |
|---|---|---|
| `visualizacoes` | "Visualizações" / "Views" (número grande no topo) | E |
| `pct_seguidores` | "Seguidores" / "Followers" com % | E |
| `pct_nao_seguidores` | "Não seguidores" / "Non-followers" com % | E |
| `contas_alcancadas` | "Contas alcançadas" / "Accounts reached" | E |
| `por_formato` | "Reels", "Stories", "Publicações"/"Posts" com % | D |
| `visitas_perfil` | "Visitas ao perfil" / "Profile visits" | D |
| `toques_links` | "Toques em links externos" / "External link taps" | D |

### 4.5 Insights > interações (`interacoes`)

| Campo | Rótulos PT / EN | Tipo |
|---|---|---|
| `interacoes` | "Interações" / "Interactions" | E |
| `contas_com_engajamento` | "Contas com engajamento" / "Accounts engaged" | E |
| `curtidas`, `comentarios`, `salvamentos`, `compartilhamentos` | "Curtidas"/"Likes", "Comentários"/"Comments", "Salvamentos"/"Saves", "Compartilhamentos"/"Shares" | D |

### 4.6 Insights > público (`publico`)

| Campo | Rótulos PT / EN | Tipo |
|---|---|---|
| `cidades` | "Principais localizações" + aba "Cidades" / "Top locations" + "Cities"; lista nome + % (até 5) | E |
| `faixa_etaria` | "Faixa etária" / "Age range"; faixas 13-17, 18-24, 25-34, 35-44, 45-54, 55-64, 65+ com % | E |
| `genero` | "Gênero" / "Gender"; "Mulheres"/"Women", "Homens"/"Men" com % | E |
| `paises` | aba "Países" / "Countries" | D |
| `horarios_ativos` | "Horários mais ativos" / "Most active times" | D (gráfico, difícil sem IA) |

Atenção: a faixa etária pode estar em uma aba ("Todos", "Homens", "Mulheres"). Ler só a aba "Todos"/"All"; se outra aba estiver selecionada, avisar `aba_errada_faixa_etaria`.

### 4.7 Aba Reels (`aba_reels`)

| Campo | Como achar | Tipo |
|---|---|---|
| `reels[]` | grade de 3 colunas; em cada célula, o número ao lado do ícone ▷ no canto inferior esquerdo | E |
| `linha`, `coluna` | posição da célula na grade | E |

Atenção:
- Células cortadas no topo ou no pé do print: ignorar se o número não estiver inteiro.
- Reels fixados (ícone de alfinete) podem aparecer primeiro: guardar `fixado: true` se o ícone for detectável; se não, ignorar.
- O script não liga número a vídeo. Isso é feito depois, na tela de conferência (a creator toca no vídeo correspondente).

### 4.8 Insight de um reel (`reel_individual`) — opcional

| Campo | Rótulos PT / EN | Tipo |
|---|---|---|
| `visualizacoes` | "Visualizações" / "Views" | E (quando enviado) |
| `contas_alcancadas` | "Contas alcançadas" / "Accounts reached" | D |
| `curtidas`, `comentarios`, `compartilhamentos`, `salvamentos` | ícones + números | D |
| `tempo_medio` | "Tempo médio de visualização" / "Average watch time" | D |

## 5. Pipeline

```
imagem
 → 1. pré-processamento
 → 2. OCR com posições (palavras e linhas)
 → 3. classificação da tela
 → 4. extração dos campos da tela
 → 5. normalização dos números e do período
 → 6. validações
 → 7. confiança e decisão (ok | precisa_reserva)
 → JSON
```

### 5.1 Pré-processamento (canvas, no aparelho)

1. Ler a imagem original e guardar largura e altura (as caixas finais voltam para essa escala).
2. Detectar o tema: claridade média > 0,5 é claro; senão escuro. No escuro, inverter as cores.
3. Converter para tons de cinza.
4. Escalar para que a altura da fonte de rótulo fique por volta de 30 px (na prática, 2× em prints de iPhone).
5. Aumentar o contraste (limiar adaptativo / Otsu). Guardar as duas versões, com e sem limiar: rodar o OCR na sem limiar e, se a confiança média for baixa, repetir na com limiar.
6. Recortar a barra de status (hora, bateria) do topo, para não poluir: os primeiros ~5% da altura.
7. Print muito comprido (proporção acima de 1:2,4): dividir em blocos com sobreposição de ~10% e juntar os resultados descartando duplicados pela posição.

### 5.2 OCR

- Motor sugerido: **Tesseract.js** (WASM, roda no navegador), modelos `por` + `eng`.
- Usar o modelo rápido para classificar a tela e o modelo de melhor qualidade só nas regiões de números, se o tempo permitir.
- Pedir saída com nível de palavra e linha, com caixa e confiança por palavra.
- Para regiões de número, rodar uma segunda passada com lista de caracteres permitidos: `0123456789.,%-` mais as letras de `mil mi k m`.
- Carregar os modelos uma vez e guardar em cache (IndexedDB) para não baixar de novo.
- Rodar em Web Worker para não travar a tela.

Alternativa a testar se a precisão do Tesseract não bastar: PaddleOCR via ONNX Runtime Web (modelo de OCR, não é IA generativa). Mais preciso em telas, mais pesado para baixar.

## 6. Classificação da tela

Pontuação por palavras-chave encontradas no texto inteiro. A tela com mais pontos vence; empate ou pontuação baixa → `tela: "desconhecida"`, `precisa_reserva: true`.

| Tela | Palavras-chave PT | Palavras-chave EN |
|---|---|---|
| perfil | seguidores, seguindo, publicações, Editar perfil | followers, following, posts, Edit profile |
| visao_geral | Visão geral, Visualizações, Interações, Conteúdo compartilhado | Overview, Views, Interactions, Content you shared |
| visualizacoes | Contas alcançadas, Não seguidores, Por tipo de conteúdo | Accounts reached, Non-followers, By content type |
| interacoes | Contas com engajamento, Curtidas, Salvamentos | Accounts engaged, Likes, Saves |
| publico | Principais localizações, Faixa etária, Gênero | Top locations, Age range, Gender |
| aba_reels | ícone ▷ repetido em grade + ausência dos rótulos acima | idem |
| reel_individual | Tempo médio de visualização, Visão geral do reel | Average watch time, Reel insights |

Comparar sem acento e sem caixa (normalizar para minúsculas e remover diacríticos) e com tolerância a 1 ou 2 letras erradas (distância de edição), porque o OCR troca "ç" por "c", "ã" por "a", "l" por "I".

## 7. Normalização

### 7.1 Números

O formato do texto decide, não o idioma da tela. Gramática aceita (depois de remover espaços dentro do número):

| Texto | Valor |
|---|---|
| `1.234` / `1,234` / `1.234.567` | 1234 / 1234 / 1234567 (grupos de exatamente 3 dígitos = milhar, com ponto ou vírgula) |
| `12,3 mil` / `12.3K` / `12,3K` | 12300 |
| `1,2 mi` / `1.2M` | 1200000 |
| `48,6%` / `48.6%` | 48.6 |
| `—` / `-` | `null` (sem dado; o extrator ignora traço solto) |

Regras:
- Decimal (1 ou 2 casas) só é aceito **com sufixo** (`mil`, `K`, `mi`, `M`) **ou `%`**.
- Número sem sufixo com separador e sem exatamente 3 casas (`12,3`, `1,23`) é ambíguo: vira não lido e o print vai para a reserva. O mesmo vale para `1.234 mil` e `1.234%`.
- `%` acima de 100 é recusado. Campo de percentual só aceita número com `%`; campo de contagem só aceita número sem `%`.
- `mil`/`K` multiplica por 1.000; `mi`/`M` por 1.000.000 (aritmética inteira, sem erro de ponto flutuante).
- Correções de OCR (`O`→`0`, `l`/`I`→`1`, `S`→`5`, `B`→`8`) valem só dentro de um token que já parece número: pelo menos 1 dígito de verdade e pelo menos 50% dos caracteres sendo dígito ou confusável. Fora disso, nunca.
- Guardar sempre o `texto` original ao lado do `valor`.

### 7.2 Período

- "Últimos 7/14/30/90 dias" e "Last 7/14/30/90 days" → `dias`.
- Intervalo "20 set - 19 out" / "Sep 20 - Oct 19" → `inicio`, `fim` (ano resolvido a partir do **fim**: o atual, ou o anterior se a data ficar no futuro; o início fica no mesmo ano do fim, ou no anterior se cruzar janeiro, como "20 dez - 18 jan") e `dias` calculado contando os dois extremos ("20 set - 19 out" = 30).
- Meses PT: jan fev mar abr mai jun jul ago set out nov dez. EN: Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec.
- Se `dias` ≠ 30: aviso `periodo_diferente_de_30_dias` (a creator pode aceitar, mas o mídia kit mostra o período certo).

## 8. Extração dos campos

### 8.1 Rótulo + número vizinho (telas de Insights)

Para cada campo da tela:
1. Achar o rótulo (por linha de OCR, com a mesma tolerância da seção 6).
2. Procurar o número candidato, nesta ordem:
   a. na mesma linha, à direita do rótulo (alinhado verticalmente com tolerância de meia altura de linha);
   b. na linha imediatamente abaixo, começando perto da mesma coluna;
   c. na linha imediatamente acima (caso do número grande sobre o rótulo).
3. O candidato tem que passar na gramática da seção 7. Se mais de um candidato, ficar com o mais próximo e baixar a confiança.
4. Um número só pode ser usado por um campo; se dois campos disputarem o mesmo número, os dois vão para `nao_lidos`.

### 8.2 Listas com percentual (público)

- Achar o título da seção (ex.: "Faixa etária").
- Ler as linhas abaixo até o próximo título: cada linha = rótulo (cidade / faixa / gênero) + percentual.
- Faixas etárias: só aceitar as faixas conhecidas.
- Cidades: aceitar qualquer texto como nome; até 5 itens.

### 8.3 Grade de reels

1. Detectar as 3 colunas pela largura da imagem (cada coluna = 1/3) e as linhas pelas posições dos números encontrados.
2. Em cada célula, procurar o número no quarto inferior esquerdo.
3. Ordenar por linha e coluna.

### 8.4 Perfil

O número fica acima do rótulo ("18,4 mil" em cima, "seguidores" embaixo): usar a regra 8.1 com prioridade para a linha de cima.

## 9. Validações e confiança

### 9.1 Validações (todas sem IA)

| Regra | Aviso |
|---|---|
| `pct_seguidores` + `pct_nao_seguidores` entre 98 e 102 | `soma_seguidores_invalida` |
| soma das faixas etárias entre 97 e 103 | `soma_faixa_etaria_invalida` |
| soma de gênero entre 97 e 103 (pode haver "outros") | `soma_genero_invalida` |
| `contas_alcancadas` ≤ `visualizacoes` | `alcance_maior_que_visualizacoes` |
| `contas_com_engajamento` ≤ `contas_alcancadas` (quando os dois existirem) | `engajamento_maior_que_alcance` |
| seguidores iguais entre prints diferentes (tolerância de 1%) | `seguidores_divergentes` |
| @ igual em todos os prints que mostram a conta, e igual ao @ cadastrado | `conta_diferente` |
| todos os prints de Insights com o mesmo período | `periodos_diferentes` |
| nenhum valor negativo | `valor_negativo` |

### 9.2 Confiança por campo

`confianca = conf_ocr × fator_rotulo × fator_posicao × fator_validacao`

- `conf_ocr`: média da confiança das palavras do número (0 a 1).
- `fator_rotulo`: 1,0 se o rótulo bateu exato; 0,9 se precisou de tolerância.
- `fator_posicao`: 1,0 para candidato único; 0,8 se havia mais de um.
- `fator_validacao`: 1,0 se passou nas validações que o envolvem; 0,5 se alguma falhou.

Campo com `confianca` < 0,85 → vai para `precisa_reserva`. Ajustar o limite com o conjunto de testes.

## 10. Testes

- **Conjunto de prints anotados**: 20 a 30 para começar (os prints da Carol e de 3 ou 4 creators voluntárias), cobrindo iPhone e Android, claro e escuro, PT e EN, contas pequenas e grandes. Para cada print, um `.json` com a resposta certa.
- **Métricas**: % de campos corretos (valor exato), % de prints sem nenhum erro, % de prints mandados para a reserva, tempo por print no celular.
- **Meta da versão 1**: 98% dos campos essenciais corretos **entre os que o script não mandou para a reserva**. Errar com confiança alta é o pior caso; mandar para a reserva é aceitável.
- **Teste de regressão**: todo ajuste no dicionário ou nas regras roda o conjunto inteiro antes de publicar.
- **Monitoramento**: o Admin mostra a % de prints que foram para a reserva por semana. Subiu de repente = o Instagram mudou algo.

## 11. Fora do escopo deste script

- Prints com interface em espanhol (ou outro idioma além de PT e EN): o idioma fica `desconhecido`, a tela cai em `desconhecida` e o print vai para a reserva. O site de vendas já tem ES, então avisar a creator na tela de envio.
- Ligar cada número da aba Reels ao vídeo certo (feito na tela de conferência).
- Ler gráficos sem números escritos (horários mais ativos).
- A reserva com IA (Claude Haiku 5.5, depois Sonnet 5.5) para prints marcados com `precisa_reserva`.
- Cálculos do mídia kit (média por reel, views × seguidores, média nas publis).
- Conexão com a API do Instagram.

## 12. Estrutura sugerida

```
site/ocr/            (pacote TypeScript isolado, portável para o Lovable)
  dicionario.ts        rótulos PT/EN por tela e campo, palavras-chave de classificação
  preprocessar.ts      tema, cinza, escala, limiar, corte da barra de status, blocos
  ocr.worker.ts        Tesseract.js em Web Worker, cache dos modelos
  classificar.ts       pontuação por palavras-chave
  extrair/
    rotulo-numero.ts   regra 8.1
    listas.ts          regra 8.2
    grade-reels.ts     regra 8.3
  tipos.ts             tipos de entrada, saída e do motor de OCR
  util.ts, rotulo.ts   texto sem acento, distância de edição, busca de rótulo com tolerância
  normalizar.ts        números e períodos
  validar.ts           regras 9.1
  confianca.ts         regra 9.2
  consolidar.ts        junta os prints no JSON da creator
  index.ts             lerPrints(arquivos, contaCadastrada) → { prints, consolidado }
tests/
  *.test.ts            testes da base pura (Vitest, texto e caixas simulados)
  prints/              imagens anotadas
  esperado/            JSON com a resposta certa de cada print
  ocr.spec.ts          roda o conjunto e calcula as métricas (depois do spike)
```

## 13. Critérios de pronto (versão 1)

- [ ] Lê todos os campos **E** das telas 4.2 a 4.7 (a 4.3, visão geral, só como alternativa para os totais; ver seção 3.2) em iPhone e Android, claro e escuro, PT e EN.
- [ ] Atinge a meta da seção 10 no conjunto anotado.
- [ ] Nunca devolve número que não está no print (nenhum valor calculado na leitura).
- [ ] Marca `precisa_reserva` em vez de chutar.
- [ ] Roda em até 3 s por print em um celular intermediário, com os modelos já em cache.
- [ ] O print não sai do aparelho.
