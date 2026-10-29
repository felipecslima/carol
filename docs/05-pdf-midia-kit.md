# PDF do mídia kit: como foi feito e como mudar o layout

O mídia kit é um resumo do portfólio em **2 páginas A4** (ou 1, quando o conteúdo cabe), diagramado como matéria de revista (DEV-154). O conteúdo é o do site, mas a diagramação é própria: não usa os blocos do site. Ele existe em dois lugares:

| Onde | Para quem | De onde vem o conteúdo | Marca d'água |
| --- | --- | --- | --- |
| `/app/midia-kit/` | a creator, enquanto monta | rascunho guardado no aparelho | sim, até pagar um plano |
| `/c/<link>/midia-kit/` | o servidor, para gerar o PDF guardado | versão **publicada** (`projects.publicado`) | não; só o selo "Feito com Portfólio Creator" |

As duas rotas desenham **as mesmas folhas** (`Folha.tsx`). Mudou o layout num lugar, mudou nos dois.

Tarefas do backlog: DEV-150 (folha A4), DEV-151 (PDF no servidor), DEV-152 (marca d'água e selo), DEV-153 (gerar de novo a cada publicação), DEV-154 (kit editorial em 2 páginas).

---

## 1. Como o PDF é gerado

Grátis e na nossa estrutura: o Worker da Cloudflare, o navegador da Cloudflare (Browser Run) e o Supabase Storage. Não usa AWS nem servidor próprio.

```
creator toca "Baixar mídia kit em PDF" (área → Projetos)
  │  POST /api/pdf/kit  (com a sessão dela)
  ▼
Worker (src/pages/api/pdf/kit.ts)
  │  já existe o PDF?  sim → devolve link de 1 hora
  │                    não → gerarPdfDoKit()
  ▼
src/server/pdf.ts
  │  1. abre o navegador da Cloudflare (binding BROWSER)
  │  2. manda abrir https://kit.interno/c/<link>/midia-kit/
  │     cada pedido para "kit.interno" é interceptado e respondido pelo próprio Worker,
  │     que busca a página e os arquivos no site (o navegador nunca fala direto com o site)
  │  3. espera a página dizer window.renderState === 'ready'
  │  4. imprime em A4 (printBackground, preferCSSPageSize)
  │  5. guarda no Supabase Storage: bucket privado "midia-kits", arquivo "<id do projeto>.pdf"
  ▼
link assinado de 1 hora → o navegador da creator baixa
```

Também gera:
- **Ao ir ao ar** (DEV-153): `/api/publicar` (quando já pagou), "Marcar como pago" no admin e `/api/pedido/pago` chamam `regerarKitDepois()`. Roda em segundo plano (`waitUntil`) e não atrasa a resposta. Se falhar, fica no log e a creator gera pelo botão.
- **Pelo admin**: ação `gerar_pdf` em `/api/admin/acao` (suporte), com registro no `audit_log`.

### Por que o navegador abre um endereço interno

O navegador da Cloudflare roda na rede deles: não enxerga `localhost` e não precisa de acesso direto ao site. A ideia veio do `document-renderer`, em que o Chromium só fala com um servidor interno. Aqui o Worker faz esse papel: responde os pedidos para `kit.interno` buscando no próprio site (`origemDoSite(request)`). O mesmo código funciona em localhost e em produção, sem túnel e sem expor nada. As imagens do Cloudinary seguem direto.

### Como a página avisa que está pronta

`KitParaPdf.tsx` põe `window.renderState = 'ready'` quando:
1. a folha está diagramada (tamanho da manchete e `data-apertada` decididos), com as fontes carregadas;
2. todas as `<img>` terminaram de carregar (no kit tudo é `<img>`: foto, capas dos vídeos, logos);
3. passaram 300 ms, para o navegador pintar.

O kit não tem `<video>` nem animação.

### Limites e custos

- **Plano grátis da Cloudflare:** 10 minutos de navegador por dia e um limite de navegadores abertos por minuto. Medido no build de produção com a versão de 1 página: **10 a 20 s por PDF** (em localhost, a versão de 2 páginas levou ~40 s pelo servidor de desenvolvimento), ou seja, uns 30 a 60 PDFs por dia.
- **Passou do limite:** a rota responde 429 com uma mensagem em português, e a creator salva pelo próprio navegador em `/app/midia-kit/`.
- **Plano pago do Workers:** só se o volume crescer. Inclui 10 horas por mês; depois, US$ 0,09 por hora.
- **Supabase Storage:** 1 GB grátis. Cada PDF tem uns 300 KB.

### Arquivos

| Arquivo | O que faz |
| --- | --- |
| `site/src/app/midia-kit/Folha.tsx` | **As 2 folhas A4**: monta o `Kit`, tamanho da manchete, `data-apertada`, escala só de tela. |
| `site/src/app/midia-kit/kit/dadosDoKit.ts` | **O conteúdo do kit**: ordem editorial, itens de exemplo fora, seções somadas, limites e os avisos de corte da Revisão. |
| `site/src/app/midia-kit/kit/Paginas.tsx` e `partes.tsx` | As regiões de cada página (abertura, números, público, sobre, vídeos, créditos, formatos, contato com QR, rodapé). |
| `site/src/app/midia-kit/kit/kit.css` | **A diagramação**: grade, tipos, cores, regiões. É aqui que se mexe no visual. |
| `site/src/app/midia-kit/midia-kit.css` | Tela (folhas empilhadas, barra) e impressão (uma folha por página). |
| `site/src/app/midia-kit/MidiaKit.tsx` | Página da creator (`/app/midia-kit/`): rascunho, barra com "Salvar como PDF", marca d'água até pagar. |
| `site/src/app/midia-kit/KitParaPdf.tsx` | Página do PDF: versão publicada, imagens em JPEG, sinal de pronto. |
| `site/src/pages/c/[slug]/midia-kit.astro` | Rota do servidor para o PDF; 404 se o portfólio não está no ar. |
| `site/src/server/pdf.ts` | Abre o navegador, intercepta os pedidos, imprime e guarda. |
| `site/src/pages/api/pdf/kit.ts` | Rota da creator: link do PDF (gera se faltar). |
| `site/src/server/banco.ts` | `guardarArquivo` e `linkAssinado` (Supabase Storage). |
| `site/wrangler.jsonc` | Binding `"browser": { "binding": "BROWSER", "remote": true }`. |
| `supabase/migrations/20261028000500_midia_kits.sql` | Bucket privado `midia-kits` (só PDF, até 20 MB). |

---

## 2. Como mudar o layout

### A ideia

O kit é a matéria de capa da creator numa revista: o título da capa vira a manchete, os vídeos viram as fotos da página e o QR leva do papel para a página no ar, com os vídeos tocando. Referências e decisões: plano da DEV-154 (LANVIN, Sara Shun, Firenze, L'Oréal Professionnel, Griffin Wooldridge; contraexemplo: modelos de Canva).

### Sistema da folha

- **Arranjo, medido.** A `Folha` tenta, nesta ordem, e fica com o primeiro que cabe com folga: (1) sem vídeos, tudo numa folha só (o contato vai para o pé da página 1; nunca sai página só com a faixa do contato); (2) cada parte na sua página; (3) as marcas sobem para o pé da página 1. O último é aceito mesmo apertado.
- **Espaço distribuído, sem buraco.** Nada de espaço fixo. A `Folha` mede cada página e distribui a sobra: os intervalos entre regiões crescem até 40 px, depois a foto da abertura cresce até 640 px (sem foto, cresce o espaço acima da manchete), depois os intervalos até 64 px; o resto vai para cima do contato. Faltando espaço, a foto desce até 400 px e os intervalos até 16 px. Variáveis: `--mk-espaco`, `--mk-foto`, `--mk-resto`.
- **Eixos.** Tudo se prende às colunas 1, 4, 7 e 10: os 4 números e as 4 colunas de marcas usam os quatro; a manchete e o Sobre começam na coluna 7; cada capa de vídeo ocupa 2 colunas; os rótulos do público ocupam as colunas 1 e 2 e as barras começam na 3.
- **A4 real, 794 × 1123 px, sem redução.** O que não cabe fica de fora pelos limites de cada região; a folha nunca encolhe.
- **Margens de 48 px**, grade de **12 colunas** com 16 px entre elas e ritmo de 8 px. Só a foto da abertura e a faixa dos números chegam à borda.
- **Serifa do kit (`--mk-display`, Instrument Serif)** nos títulos, manchete, números, capitular, frase e marcas, seja qual for a fonte do site da creator; a fonte dela fica no texto corrido e nas legendas (decisão de 28/out, depois da crítica).
- **Cinco tamanhos:** manchete 56, 44 ou 36 px (ao lado da foto, o maior que cabe na coluna, até 6 linhas; sem foto, o maior que cabe em 3 linhas; medido com a fonte carregada); números 44 px em serifa e algarismos tabulares; títulos de seção 24 px; corpo 14 px com entrelinha 1,5; legendas 13,5 px, **o mínimo**. Abaixo disso só o rodapé (8 pt). A capitular e os nomes das marcas (18 px, serifa) são as exceções; a frase em destaque usa os 24 px dos títulos, em itálico. A frase some quando repete a manchete ou o Sobre, e o período do público some quando é igual ao dos números.
- **Cor:** papel `--fundo`, tinta `--texto`. Um destaque (`--destaque`) só nas barras do público e na faixa do contato; um campo de cor (`--destaque-suave`) só na faixa dos números. Sem sombras, cartões, pílulas, botões, rótulos em caixa-alta espaçada nem numeração de seções. Filete só no pontilhado dos formatos, que é uma tabela de verdade.
- **Rodapé** em cada página: @ à esquerda, selo "Feito com Portfólio Creator" no meio (ou a marca d'água por página, sem plano pago) e "1/2" ou "2/2" à direita.

### Regiões

| Página | Região | De onde vem |
| --- | --- | --- |
| 1 | Abertura: foto em sangria (colunas 1 a 6) e, nas colunas 7 a 12, o resumo no alto e a manchete embaixo | `foto` da capa, ou `fundo` na variação com fundo, com o enquadramento dela. Sem foto, a manchete ocupa a largura. |
| 1 | Faixa de números | Números (até 4) em 4 vagas de 3 colunas; com até 3 números, o período ocupa a última vaga |
| 1 | Resumo (no alto da coluna da manchete) | "Em 1 olhada", sem repetir valores que já estão na faixa nem a cidade do @ |
| 1 | Público em barras e Sobre com capitular | Público (até 6), separado em grupos com nome (Idade, Gênero, Cidades) quando há mais de um; Sobre (até ~520 letras). O título do Sobre vira "Sobre mim" se repetir a manchete. |
| 1 | Frase em destaque | Subtítulo da capa: embaixo do Sobre curto, ou embaixo de até 4 barras, ou sob a manchete (linha fina) se não houver lugar |
| 2 | Vídeos | Até 6 capas 9:16; com até 3, as capas ficam em 4 colunas; cada capa é link para `/c/<link>/#videos` |
| 2 (ou pé da 1) | Marcas | 12 logos na mesma altura (só se todas tiverem logo) ou 16 nomes em 4 colunas |
| 2 | Formatos | Até 4, em `<table>`: nome, pontilhado, preço ou "Sob consulta"; o que inclui e o prazo como legenda. Sem nenhum preço, uma linha "Valores sob consulta" e nada de pontilhado. |
| 2 | Contato (sempre na base da última página) | E-mail (`mailto:`) e WhatsApp (`wa.me`) como texto com link, prazo e QR para `https://eucarollimah.com.br/c/<link>/` |

**Regras:**
1. A ordem é editorial e fixa; não segue a ordem das seções no site.
2. Seção ausente ou escondida some e o espaço fecha.
3. Seção repetida soma os itens na mesma região, até o limite.
4. Quando um limite corta conteúdo, a Revisão do editor mostra um aviso amarelo (ex.: "No mídia kit entram os 6 primeiros vídeos").
5. Ficam fora do kit: Por que eu (`motivos`), Como eu trabalho (`processo`) e itens de exemplo.
6. Sem `projeto.link` (rascunho que ainda não escolheu o link), o QR e os links dos vídeos somem e o contato ocupa a faixa inteira.

### Receitas

- **Mudar um limite:** `LIMITES` em `dadosDoKit.ts`. Confira o caso extremo (abaixo), porque o limite é o que garante que a página cabe.
- **Mudar tamanhos, espaços ou cores:** `kit.css`. Não use tamanhos fora dos cinco.
- **Mudar o que entra numa região:** a função `montar` em `dadosDoKit.ts`.
- **Mudar a disposição de uma página:** `Paginas.tsx`.
- **Os blocos do site (`site/src/blocks/`) não são usados no kit.** Mudar um bloco não muda o kit, e vice-versa.

### Cuidados

1. **Nada passa da margem de baixo.** Se uma página vazar mesmo com a foto em 400 px e os intervalos em 16 px, reduza um limite. Os roteiros de teste mostram `--mk-espaco`, `--mk-foto` e `--mk-resto` de cada página: intervalo abaixo de 24 px é sinal de página cheia demais.
2. **Nada mais largo que a folha.** Se algo vazar da largura, o Chrome encolhe a página inteira na impressão.
3. **Imagens em JPEG no PDF.** WebP e AVIF entram regravados sem compressão. `KitParaPdf.tsx` troca para `f_jpg`; a foto da abertura vai em 900 px de largura.
4. **Endereço do QR:** vem de `import.meta.env.SITE`, nunca da origem da página (no PDF ela é `kit.interno`).
5. **1 ou 2 páginas.** `@page { size: A4; margin: 0 }` e `break-after: page` entre as folhas.
6. **Nomes de classe do kit não podem colidir com os da tela.** A impressão esconde a barra de ferramentas da tela (`.mk-barra`). A barra do público se chamava assim e sumia só no PDF; hoje é `.mk-publico-barra`. Classe nova no kit: confira se não existe em `midia-kit.css` nem em `src/app/tema.css`.
7. **Fontes antes de decidir.** A `Folha` só escolhe o arranjo depois de carregar a Instrument Serif (as duas faces) e esperar `document.fonts.ready`. Medir com a fonte reserva escolhe o arranjo errado.

---

## 3. Como testar uma mudança

1. **Na tela:** abra `http://localhost:4321/app/midia-kit/` (rascunho do aparelho). A folha é a mesma do PDF.
2. **Igual ao PDF, no seu navegador:** abra `http://localhost:4321/c/<link no ar>/midia-kit/` e imprima com Ctrl/Cmd+P → "Salvar como PDF", margens "Nenhuma", com gráficos de fundo.
3. **PDF de verdade, pelo navegador da Cloudflare:** com o servidor de desenvolvimento rodando (`cd site && npx astro dev`), use a ação do admin:
   ```sh
   cd site
   npm run equipe:teste                         # código da conta da equipe de teste
   npm run pdf:kit -- <código>                  # gera o PDF do eu-carollimah e salva em site/mk-eu-carollimah.pdf
   npm run pdf:kit -- <código> outro-link       # outro portfólio no ar
   ```
   A resposta traz o tempo de cada etapa (abrir, carregar, imprimir, guardar). Cada teste gasta tempo do plano grátis, e várias seguidas batem no limite por minuto (429).
4. **Ver o PDF como imagem:** `pdftoppm -png -r 70 -singlefile kit.pdf saida`.
5. **Tamanho e páginas:** o PDF deve ter **2 páginas (1 com pouco conteúdo) e menos de 1 MB** (`pdfinfo kit.pdf`).
6. **Casos de conteúdo:** `/tmp/dev154/app.mjs <variante> [largura]` abre `/app/midia-kit/` com um rascunho de teste (cheio, mínimo, sem foto, serifa, extremo) e mede fontes abaixo de 13,5 px e o que passa da margem.
7. **O que pesa dentro do PDF:** o script em Python usado na DEV-151 lista as imagens por tamanho. Uma imagem grande com `FlateDecode` quase sempre é WebP ou quadro de vídeo regravado.

O script fica em `site/scripts/pdf-kit.mjs`. Os testes automáticos pendentes estão em `docs/TESTES-PENDENTES.md` ("PDF do mídia kit no servidor").

---

## 4. Produção

- O binding `BROWSER` já está no `wrangler.jsonc`. Na conta da Cloudflare, o Browser Run precisa estar disponível (no plano grátis, está).
- Segredos do Worker necessários: `SUPABASE_SERVICE_ROLE_KEY` (para guardar e assinar os links).
- Logs: cada geração escreve `{"tipo":"pdf-do-kit", ...}` com o resultado e o tempo por etapa (Cloudflare → Workers → Logs).
