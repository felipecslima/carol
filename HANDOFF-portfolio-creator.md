# Handoff: Portfólio Creator

Atualizado em 23/out/2026. **Em andamento: nada desta página foi commitado ainda.**

---

## 1. Propósito

O Portfólio Creator é um **produto da Carol Limah** para **creators iniciantes** em UGC e influência. A creator monta portfólio e mídia kit a partir de 15 modelos e recebe um PDF, um link próprio (`portfoliocreator.com.br/nome`) ou um site com domínio `.com.br` no próprio nome.

Ele resolve três dores de quem está começando:
- trava quando a marca pede um mídia kit, que leva dias para montar e costuma ficar com cara de amador;
- tem números bons (views acima dos seguidores) que não aparecem bem;
- paga de novo ao designer toda vez que os números crescem.

A promessa: **"Seu primeiro portfólio de creator. Mesmo com 0 publi."** O modo iniciante esconde números e marcas e destaca vídeos de exemplo, feitos com produtos que a creator já tem em casa.

**Por que a Carol:** ela largou a odontologia, hoje é criadora de conteúdo, influencer e UGC, e tem mais de 400 publis, mais de 40 marcas atendidas e mais de 58 mil seguidores. A estrutura dos modelos foi pensada por quem já fechou essas publis, e esse é o argumento contra os editores genéricos, que entregam um modelo em branco.

---

## 2. As duas partes do projeto

| Parte | Onde | Estado |
|---|---|---|
| **O produto** (cadastro, editor, IA que lê os prints, PDF, link, pagamento, painel) | A ser construído neste repositório (`site/`): **Astro + React + Supabase + Cloudflare Workers**, conforme `docs/00-guia-ia.md` | Especificado; construção começando pela E1 (DEV-001) |
| **A página de vendas** | Neste repositório, em `eucarollimah.com.br/portfolio-creator/` | Feita e commitada na `dev` |

A página de vendas vive no site da Carol para começar a captar interesse antes de o produto existir. Enquanto não há cadastro nem pagamento, **todo botão de ação abre a DM da Carol** no Instagram, e a página avisa isso.

---

## 3. Como foi pensado

### Fonte
Tudo vem do pacote `portfolio-creator-handoff.zip`, na raiz do projeto. **O arquivo está fora do git** (`*.zip` é ignorado) e só existe nesta máquina, então vale guardar uma cópia:

| Arquivo | Conteúdo |
|---|---|
| `LEIA-ME.md` | Visão geral e links do protótipo, do plano de preços, do kit de lançamento e do manual |
| `01-especificacao.md` | **A regra**: páginas, planos, preços, cadastro, editor, link automático, segurança |
| `02-planos-e-precos.md` | Planos, margem por venda e cenários de faturamento |
| `03-ordem-de-construcao.md` | Etapas da versão 1 e da versão 2, (a execução agora segue `docs/03-backlog-dev.md`) |
| `04-pendencias.md` | O que falta decidir ou preencher antes de lançar |
| `05-telas.md` | As 38 telas do protótipo e para onde cada uma leva |
| `conteudo/` | Textos das ferramentas grátis, mensagens prontas, ganchos, desafio, termos, lista de apps de vagas (CSV) |
| `marca/` | Cores, fontes e fotos da Carol |
| `prototipo/` | Código das telas (`.dc.html`), referência visual exata |

**O protótipo é a referência visual; a especificação é a regra.** Frases que só existiam no protótipo e não na especificação ("menos de 15 minutos", "acompanhamento da Carol", "contato que fecha") ficaram de fora da página até a Carol confirmar.

### Regras de texto da especificação
- Sempre "creators", nunca "fundadoras".
- Não escrever "só libera quando o pagamento cair". Mostrar "7 dias para desistir da compra" (CDC, art. 49) e o link para os Termos.
- A vitrine mostra só 3 planos. Upgrade, aba Editar avulsa e renovação aparecem só na hora certa (painel, pós-compra, FAQ).

### Decisão visual da página de vendas
A página usa **o mesmo esqueleto do site da Carol** (estrutura, classes, Instrument Serif + Hanken Grotesk, movimento) com **as cores do produto** por cima: base marrom-escuro `#24130F`, faixas em creme `#FBF4EC` e rosa `#E5386A` como acento, além de amarelo e verde do handoff. O rosa cheio só aparece em superfícies grandes e títulos, porque com texto branco em tamanho pequeno ele não passa no contraste.

As fontes da marca do produto (Bricolage Grotesque, DM Sans, Caveat) estão liberadas no `.impeccable/config.json` para quando o produto for construído, mas a página de vendas não as usa.

---

## 4. A página de vendas (`/portfolio-creator/`)

Só em português. A ordem segue o argumento: promessa, dor, para quem é, como funciona, o que a marca vê, modelos, quem fez, preço, teste e primeiras creators, dúvidas, ferramentas que vêm aí, fechamento.

| Seção | Título |
|---|---|
| Hero | Seu primeiro portfólio de *creator.* (com o celular no modo iniciante) |
| Dor | Ninguém fecha publi *sem portfólio.* |
| `#iniciante` | Para quem começa do *zero.* |
| `#como` | Do zero ao portfólio em *3 passos* (modelo → vídeos e prints → PDF ou site) |
| `#marca` | O que a marca *quer ver* |
| `#modelos` | 15 modelos, *45 combinações* (15 modelos × 3 paletas) |
| `#sobre` | Oi, eu sou a *Carol.* |
| `#plano` | Planos que cabem em *uma publi* |
| `#teste` | Monte o seu *antes de pagar.* + seja uma das 5 primeiras creators |
| `#duvidas` | Dúvidas (FAQ) |
| `#gratis` | Vem aí, *de graça* (5 ferramentas grátis, todas "em breve") |
| `#contato` | Mande seu mídia kit *sem medo.* |

Há ainda a faixa do cupom no topo, um CTA fixo no mobile (some nas seções que já têm botão) e uma prévia de link própria (`og-portfolio-creator.jpg`). A página entra no `sitemap.xml` sem hreflang.

### Planos na vitrine
| Plano | Preço | O que dá |
|---|---|---|
| PDF + link | R$ 49,90, pagamento único | 15 modelos e 3 paletas, IA que lê os prints, PDF sem marca d'água, mídia kit de 1 página, link `portfoliocreator.com.br/nome`, edição até concluir + 7 dias, revisão guiada |
| Site | R$ 149,90 + R$ 40 de domínio no 1º ano (R$ 189,90) | Tudo do PDF + 12 meses no ar com `.com.br` no nome e CPF da creator; a equipe publica e chama no WhatsApp em até 2 dias úteis; renovação opcional R$ 79,90 |
| Atualização | R$ 19,90/mês ou R$ 179/ano | Libera a aba Editar e mantém o link; cancela quando quiser |

Fora da vitrine (especificação): aba Editar avulsa por R$ 49,90 por 30 dias. Cupom `LANCAMENTO10`: 10% só no plano, até 30/11, não soma e não vale para o domínio.

### Arquivos
```
site/src/data/portfolio-creator.ts     ← textos, preços, planos, FAQ, modelos e a config PC (ver abaixo)
site/src/views/PortfolioCreator.astro  ← a página
site/src/pages/portfolio-creator/      ← rota
site/src/styles/portfolio-creator.css  ← tokens de cor do produto sobre o global.css
site/src/scripts/portfolio-creator.ts  ← menu, pausa da faixa, revelação dos modelos, CTA fixo
site/scripts/portfolio-creator-shots.mjs ← gera as imagens a partir do protótipo
site/public/media/pc/                  ← capas dos 15 modelos, portfólio iniciante, fotos da Carol
site/public/og-portfolio-creator.jpg   ← prévia de link
```
Também mudaram por causa da página: `SeoHead.astro` (aceita página só em PT, prévia de link, cor de tema e fontes próprias), `sitemap.xml.ts` (inclui a página), `.gitignore` e `.impeccable/config.json`.

### O que se controla pela config `PC` (`portfolio-creator.ts`)
| Campo | Hoje | O que faz |
|---|---|---|
| `cta` | DM da Carol | Destino de todo botão de ação. Trocar quando existir cadastro (ex. `/portfolio-creator/criar-conta/`) e tirar da view os avisos de "direct" |
| `whatsapp` | vazio | Vazio esconde os links de WhatsApp |
| `termos` | vazio | Vazio mostra o texto sem link. Preencher antes de vender |
| `cupom`, `cupomAte`, `cupomFim` | `LANCAMENTO10`, 30/11 | Depois de `cupomFim` (30/11, 23h59 de Brasília) a faixa e os avisos de cupom somem sozinhos |
| `vagas` | `null` | Número de vagas para as 5 primeiras creators; `null` esconde a contagem |

As ferramentas grátis (`FREE`) aparecem como "em breve" enquanto o `href` estiver vazio. Cada uma ganha um link quando tiver página.

### Regerar as imagens
```
unzip portfolio-creator-handoff.zip -d /tmp/pc
cd site && node scripts/portfolio-creator-shots.mjs /tmp/pc/portfolio-creator-handoff
```
Os `.dc.html` do protótipo dependem de um runtime que não vem no pacote. O script preenche os valores de cada tela no Node antes de abrir no Chromium.

---

## 5. O que falta

### Para a página de vendas ir ao ar
- [ ] Revisar a página com a Carol e commitar.
- [ ] Página de Termos e Privacidade publicada → `PC.termos`.
- [ ] WhatsApp do produto → `PC.whatsapp`.
- [ ] Decidir se mostra a contagem de vagas → `PC.vagas`.

### Para lançar o produto (de `04-pendencias.md`)
**Decisões**
- [ ] Data de lançamento (o cupom vence em 30/11; a segunda metade de novembro tem viagens).
- [ ] Selo "Números conferidos com prints oficiais": manter, trocar por "lido dos prints enviados" ou dar selo só com o Instagram conectado.
- [ ] Quantas vagas para as 5 primeiras creators e até quando escolher.
- [ ] Confirmar os segmentos do "Oi, eu sou a Carol" (restaurantes, hotéis, turismo, eventos e shows, lifestyle).
- [ ] Revisar as "10 dicas de ouro da Carol" do Desafio.

**Dados**
- [ ] Termos: razão social, CNPJ, e-mail de contato, e-mail de privacidade, responsável pelos dados; revisão por advogado.
- [ ] Faixa de imposto com o contador; valor da assistente.

**Contas e serviços**
- [ ] Projeto Supabase e acesso ao painel do Cloudflare (ver `docs/00-guia-ia.md`).
- [ ] Conta de vendedor no Mercado Pago e Access Token (guardar só como secret do Worker, nunca no Git).
- [ ] Registrar `portfoliocreator.com.br` no Registro.br e conferir o nome no INPI.
- [ ] Tutorial para as clientes do plano site criarem a conta no Registro.br no próprio CPF.
- [ ] ManyChat (plano grátis no início) para a DM automática.

### Ordem de construção do produto (`03-ordem-de-construcao.md`)
- **Versão 1, o mínimo para vender:** base e página inicial → cadastro e painel → galeria de modelos e quiz → editor → PDF e mídia kit → pagamento do plano PDF + link → link automático → páginas grátis.
- **Versão 2, depois das primeiras creators:** assinatura e aba Editar → site com domínio próprio → renovações e avisos → automação de mensagens.

Quando o produto existir, a página de vendas pode continuar aqui (trocando `PC.cta`) ou migrar para `portfoliocreator.com.br`.
