# PDF do mídia kit: como foi feito e como mudar o layout

O mídia kit é um resumo do portfólio em **1 página A4**, com as mesmas seções do site. Ele existe em dois lugares:

| Onde | Para quem | De onde vem o conteúdo | Marca d'água |
| --- | --- | --- | --- |
| `/app/midia-kit/` | a creator, enquanto monta | rascunho guardado no aparelho | sim, até pagar um plano |
| `/c/<link>/midia-kit/` | o servidor, para gerar o PDF guardado | versão **publicada** (`projects.publicado`) | não; só o selo "Feito com Portfólio Creator" |

As duas páginas desenham **a mesma folha** (`Folha.tsx`). Mudou o layout num lugar, mudou nos dois.

Tarefas do backlog: DEV-150 (folha A4), DEV-151 (PDF no servidor), DEV-152 (marca d'água e selo), DEV-153 (gerar de novo a cada publicação).

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
1. a folha calculou a escala para caber em 1 página, com as fontes carregadas;
2. todas as `<img>` terminaram de carregar;
3. passaram 1,5 s, para as imagens de fundo (capa, fotos) e as entradas suaves dos blocos.

O servidor espera esse sinal, e não a rede parar, porque os vídeos deixam a rede sempre ocupada.

### Limites e custos

- **Plano grátis da Cloudflare:** 10 minutos de navegador por dia e um limite de navegadores abertos por minuto. Medido no build de produção: **10 a 20 s por PDF**, ou seja, uns 30 a 60 PDFs por dia.
- **Passou do limite:** a rota responde 429 com uma mensagem em português, e a creator salva pelo próprio navegador em `/app/midia-kit/`.
- **Plano pago do Workers:** só se o volume crescer. Inclui 10 horas por mês; depois, US$ 0,09 por hora.
- **Supabase Storage:** 1 GB grátis. Cada PDF tem uns 300 KB.

### Arquivos

| Arquivo | O que faz |
| --- | --- |
| `site/src/app/midia-kit/Folha.tsx` | **A folha A4**: escolhe as seções, calcula a escala, marca d'água ou selo. É aqui que se mexe no layout. |
| `site/src/app/midia-kit/midia-kit.css` | **Todo o estilo do kit**: grade de 2 colunas, versão compacta das seções, impressão. |
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

### Onde mexer

Quase tudo se resolve em dois arquivos:
- **`midia-kit.css`**: tamanhos, espaços, colunas e versões compactas das seções. Comece por aqui.
- **`Folha.tsx`**: quais seções entram, a largura do layout e o selo.

Os blocos (`site/src/blocks/`) são os mesmos do site. **Não mude um bloco só por causa do kit**: escreva a regra no `midia-kit.css`, sempre começando por `.mk-conteudo`, para não afetar o site.

### Como a folha funciona

- O conteúdo é montado numa largura fixa de **1000 px**, em 2 colunas (constante `LAYOUT` em `Folha.tsx`).
- Depois é **reduzido** até caber na largura (794 px) e na altura (1123 px) do A4, e centralizado. Nunca é ampliado.
- Por isso, **quanto mais alto o conteúdo, menor tudo fica**. Para o kit ficar maior e mais legível, o caminho é encurtar as seções: menos itens, versões compactas, menos espaço. Aumentar fonte não resolve.

### Receitas

**Tirar ou pôr uma seção no kit.** Em `Folha.tsx`, a lista `NAO_VAI_PARA_O_KIT` diz o que fica só no site (hoje `motivos` e `processo`). Os nomes são os `tipo` do `site/src/blocks/registro.ts`. Seção escondida pela creator também não entra.

**Mudar quais seções ficam lado a lado.** Em `midia-kit.css`:

```css
.mk-conteudo > .bl {                       /* toda seção ocupa a linha inteira */
  grid-column: 1 / -1;
}
.mk-conteudo > :is(.bl-numeros, .bl-publico, .bl-sobre, .bl-formatos) {
  grid-column: span 1;                     /* estas ficam em meia coluna e formam pares */
}
```

A ordem é a que a creator escolheu. As meias colunas se juntam em pares (`grid-auto-flow: row dense`). **Não use `grid-template-areas`**: com nomes fixos, duas seções do mesmo tipo caem uma por cima da outra (aconteceu com duas seções de formatos).

**Deixar uma seção mais compacta.** Há um trecho "versão compacta das seções para caber em 1 página" no `midia-kit.css`. Siga o padrão:

```css
.mk-conteudo .bl-marcas .bl-tags { gap: 4px; }      /* sempre prefixado por .mk-conteudo */
```

**Margens e espaço entre seções.** `--respiro` em `.mk-conteudo` (hoje 20 px) e `padding-inline` em `.mk-conteudo > .bl` (32 px).

**Marca d'água e selo.** O texto está em `Folha.tsx`; o estilo, em `.mk-marca` e `.mk-selo` no CSS.

### Cuidados (aprendidos na prática)

1. **Nada mais largo que a folha.** Se algo vazar da largura, o Chrome encolhe a página inteira na impressão.
2. **Imagens em JPEG no PDF.** WebP e AVIF (o que o `f_auto` do Cloudinary entrega) entram no PDF regravados sem compressão: um kit de 1 página chegou a 8,4 MB. `KitParaPdf.tsx` troca para `f_jpg` e 640 px. Imagem nova de outro lugar deve seguir a mesma regra.
3. **Sem quadro de vídeo.** Na página do PDF, `.mk--pdf video` fica `visibility: hidden`. Usar `display: none` faz a moldura perder a altura, porque é o vídeo que dá a proporção. No lugar aparece a miniatura em JPEG que está embaixo.
4. **Miniaturas com `loading="lazy"`.** A folha força `eager`, senão elas saem vazias.
5. **1 página só.** `@page { size: A4; margin: 0 }`. Se o conteúdo crescer, a escala diminui e nunca pula para a página 2. Confira se continua legível.
6. **Animações.** O servidor pede `prefers-reduced-motion: reduce` e espera 1,5 s. Entrada nova que demore mais que isso sai pela metade no PDF.

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
5. **Tamanho e páginas:** o PDF deve ter **1 página e menos de 1 MB**.
6. **O que pesa dentro do PDF:** o script em Python usado na DEV-151 lista as imagens por tamanho. Uma imagem grande com `FlateDecode` quase sempre é WebP ou quadro de vídeo regravado.

O script fica em `site/scripts/pdf-kit.mjs`. Os testes automáticos pendentes estão em `docs/TESTES-PENDENTES.md` ("PDF do mídia kit no servidor").

---

## 4. Produção

- O binding `BROWSER` já está no `wrangler.jsonc`. Na conta da Cloudflare, o Browser Run precisa estar disponível (no plano grátis, está).
- Segredos do Worker necessários: `SUPABASE_SERVICE_ROLE_KEY` (para guardar e assinar os links).
- Logs: cada geração escreve `{"tipo":"pdf-do-kit", ...}` com o resultado e o tempo por etapa (Cloudflare → Workers → Logs).
