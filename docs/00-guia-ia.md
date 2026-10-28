# Guia para a IA — como construir o Portfólio Creator

Este guia é para o agente de IA que vai escrever o código. Leia inteiro antes da primeira tarefa e releia a seção "Regras que nunca quebram" antes de cada entrega. Quem guia o trabalho é uma pessoa que não escreve código: ela aprova planos, testa no celular e decide. Seu trabalho é construir exatamente o que foi planejado, uma tarefa por vez, e avisar quando algo não fecha.

## 0. Começo de toda sessão (obrigatório)

1. Confirme que está na branch `dev` (`git branch --show-current`). Se não estiver, pare e avise.
2. Leia `docs/PROGRESSO.md`, seção **"Onde parei"**. É dali que você continua.
3. Rode `git status` e confira se há algo não commitado que o PROGRESSO não explica. Se houver, pergunte antes de seguir.
4. Diga em uma frase onde parou e qual é o próximo passo, e só então comece.

## 1. O que ler, e em que ordem

| Ordem | Arquivo | Para quê |
|---|---|---|
| 1 | `docs/00-guia-ia.md` (este) | Como trabalhar e o que nunca fazer |
| 2 | `docs/01-prd.md` | O que estamos construindo, para quem, prioridades (P0, P1, P2) e critérios de aceite. **Em conflito, o PRD manda.** |
| 3 | `docs/02-construtor.md` | Como o produto funciona: editor, blocos, paletas, travas, área da creator, admin, arquitetura |
| 4 | `docs/03-backlog-dev.md` | A lista de tarefas `DEV-###`, na ordem, com "pronto quando" e dependências |
| 0 | `docs/PROGRESSO.md` | Onde parou, o que foi feito, o que está esperando aprovação |
| 5 | `docs/04-ocr-prints.md` | Especificação da leitura de prints (fica para depois da versão 1; use só o formato de dados da seção 3.2) |
| Sempre | `HANDOFF.md`, `site/HANDOFF.md`, `site/PRODUCT.md`, `site/DESIGN.md` | O site da Carol que já existe neste repositório |

## 2. O que é este repositório

- Um repositório, dois projetos que dividem `site/` e o deploy em `eucarollimah.com.br`:
  1. **Site da Carol** (Astro estático, 3 idiomas). Já está no ar. **Não mexa nele** a não ser que a tarefa peça.
  2. **Portfólio Creator**: a página de vendas em `/portfolio-creator/` (já existe) e o produto que você vai construir.
- O produto: um construtor no celular onde a creator iniciante monta **site**, **mídia kit** ou **os dois**, com blocos prontos, paletas prontas e conteúdo de exemplo que ela troca pelo dela.

## 3. Versão 1: o que NÃO construir agora

- **Leitura de prints** (OCR e IA de reserva): a creator digita os números (`DEV-130`).
- **IA no assistente:** nenhuma chamada de IA na versão 1.
- **Entrar com Google:** só código por e-mail.
- **Gateway de pagamento:** a Carol manda o link manualmente; o produto só registra o pedido e o status.

As tarefas dessas partes estão em "P1 → Adiado da versão 1" no backlog. Não comece nenhuma delas sem pedido. Mas desenhe o modelo de dados de forma que elas entrem depois sem retrabalho (por exemplo, os números já seguem o formato do `04-ocr-prints.md`).

## 3a. Skills obrigatórias

Use estas skills em toda tarefa que mexe em interface. Elas existem para o resultado ficar no nível que foi especificado, e não com cara de modelo genérico.

| Skill | Quando usar | O que entregar |
|---|---|---|
| **frontend-design** | Antes de desenhar qualquer tela, bloco ou estilo | Direção visual e tokens alinhados ao `02-construtor.md` e ao estilo padrão |
| **design-taste-frontend** | Junto com a frontend-design, antes de codar a interface | Revisão das escolhas (tipografia, ritmo, hierarquia) para evitar o visual padrão de IA |
| **impeccable** | Depois de construir a tela, antes de mostrar para aprovação | Rodar a crítica/auditoria, corrigir o que ela apontar e salvar o relatório em `.impeccable/critique/`. Respeite as exceções já registradas em `site/.impeccable/config.json` e registre novas exceções com motivo |
| **playwright** | Depois da impeccable, sempre | Abrir a tela em 390 px (e 1280 px), tema claro e escuro, percorrer o fluxo da tarefa, tirar prints e rodar os testes de `@playwright/test` |

Ordem em toda tarefa de interface: **frontend-design + design-taste-frontend → construir → impeccable → playwright → mostrar para aprovação.**

Tarefas sem interface (banco, servidor) pulam as skills de design, mas usam testes (Vitest e, quando houver fluxo, Playwright).

Se alguma skill não estiver disponível na sessão, avise na primeira mensagem e não finja que ela rodou.

## 3b. Git, aprovação e publicação

- **Todo o trabalho acontece na branch `dev`.** Nunca commite direto na `main`.
- **Commit só quando algo é aprovado.** Você mostra o resultado (prints, testes, relatório da impeccable); quando a pessoa disser que aprovou, você atualiza o `docs/PROGRESSO.md` e faz o commit na `dev`. Mensagem: `DEV-061: bloco Capa (2 variações)`. Enquanto não houver aprovação, o trabalho fica sem commit e o PROGRESSO marca "esperando aprovação".
- Um commit por aprovação; nunca junte tarefas diferentes num commit só.
- **Publicar** só quando a pessoa pedir "publica":
  1. `git checkout main && git merge --no-ff dev -m "Publica: <resumo>"`
  2. Build e deploy da `main` (como descrito em `site/HANDOFF.md`).
  3. `git push` da `main`.
  4. `git checkout dev && git merge main` (a `dev` fica igual à `main`) e `git push` da `dev`.
  5. Registrar a publicação no PROGRESSO.
- Nunca use `--force`, nunca reescreva histórico, nunca apague branch sem pedido.
- `.env` e segredos nunca entram em commit.

## 3c. Registro: docs/PROGRESSO.md

É o diário do projeto e a memória entre sessões. Mantenha sempre atualizado:

- **Onde parei:** tarefa atual, o que falta nela, próximo passo. Atualize ao fim de cada tarefa e antes de encerrar a sessão, mesmo no meio de uma tarefa.
- **Esperando aprovação:** o que foi mostrado e ainda não foi aprovado.
- **Diário:** uma entrada por dia de trabalho, mais recente em cima: data, tarefas, arquivos principais, decisões, commit (hash) quando houver.
- **Publicações:** data, o que foi para a `main`, commit do merge.

Escreva para quem chega frio: uma pessoa ou outra IA deve conseguir continuar só lendo o PROGRESSO.

## 4. Stack decidida (não troque sem perguntar)

| Camada | Escolha |
|---|---|
| Site e páginas publicadas | **Astro** no **Cloudflare Workers** (adapter do Cloudflare; o site da Carol continua estático) |
| Editor, área da creator e admin | **React** em ilhas do Astro (`client:only`) |
| Banco, login e arquivos pequenos | **Supabase** (Postgres + RLS, Auth com código de 6 dígitos por e-mail, Storage só para PDFs e exportações) |
| Fotos e vídeos | **Cloudinary** (conta que o site da Carol já usa) |
| Cores | `@material/material-color-utilities` (cor dinâmica do Material 3, esquema Fidelity por padrão) |
| Estado do editor | Zustand + zundo (desfazer/refazer) |
| Componentes de interface | dnd-kit, Vaul (gaveta), Motion, Radix/shadcn/ui |
| Uploads | Uppy + TUS / upload assinado do Cloudinary |
| Base do editor | Puck **só depois** do teste da `DEV-080`; até lá, não instale |
| Admin (P1) | Refine + shadcn/ui + TanStack Table + React Hook Form + Zod + Recharts |
| PDF | Cloudflare Browser Rendering a partir da mesma página |
| Leitura de prints (depois da versão 1) | Tesseract.js no aparelho; IA (Claude Haiku 5.5, depois Sonnet 5.5) só como reserva no servidor |
| Avisos | WhatsApp Cloud API (oficial) e app do Slack |
| Testes | Vitest (unidade) e Playwright (ponta a ponta, tamanho de celular) |

**Não use:** Lovable, Angular, Next.js, Firebase, outro banco, APIs não oficiais de WhatsApp, Mercado Pago automático (o pagamento é manual no lançamento), bibliotecas de editor livre (GrapesJS, Craft.js) sem pedido.

## 5. Como trabalhar, tarefa por tarefa

1. **Receba uma tarefa `DEV-###`.** Uma por vez. Se pedirem várias, faça na ordem do backlog.
2. **Confira as dependências.** Se uma tarefa da qual ela depende não está pronta, avise e pare.
3. **Leia as seções dos documentos que tocam a tarefa** (PRD, construtor, OCR).
4. **Mostre um plano curto antes de escrever código:** arquivos que vai criar ou mudar, decisões que vai tomar, como vai testar. Espere o "ok" quando a tarefa tocar banco, segurança, dinheiro ou dados pessoais.
5. **Construa só o escopo da tarefa.** Nada de "aproveitei e também...". Ideia boa fora do escopo vai para `docs/ideias.md`.
6. **Rode as skills** da seção 3a (tarefas de interface) e os testes da seção 9, e mostre a evidência: prints em 390 px claro e escuro, saída dos testes, resumo da impeccable.
7. **Atualize o `docs/PROGRESSO.md`** como "esperando aprovação".
8. **Depois da aprovação:** marque a tarefa no `docs/03-backlog-dev.md` (`- [x]`), registre decisões novas em `docs/decisoes.md`, atualize o PROGRESSO e faça **um commit na `dev`** com a mensagem começando pelo código: `DEV-012: tabela projects com RLS`.
9. Se a pessoa pedir ajustes, ajuste, rode de novo as skills e os testes, e volte ao passo 7.

**Quando parar e perguntar:**
- O documento é ambíguo ou dois documentos se contradizem.
- A tarefa exige algo que está como "a definir" (preços, limites do Cloudinary, quantidade de IA grátis).
- Você precisa de uma chave, conta ou permissão que não existe.
- A solução exige mudar a stack, o modelo de dados ou uma regra da seção 7.
- Algo vai afetar o site da Carol.

## 6. Arquitetura e pastas

```
site/
  src/
    pages/            rotas Astro (site da Carol, /portfolio-creator, /app, /admin, /c/[slug])
    app/              ilha React da creator: área (Início, Projetos, Mídias, Conta), editor, assistente
    admin/            ilha React do admin (P1)
    blocks/           componentes dos blocos (usados no editor E na página publicada)
    themes/           estilo padrão Nuvem em themes/modelos/ (tokens de fonte, cantos, respiro) e paletas
    ocr/              leitura de prints (depois da versão 1; ver 04-ocr-prints.md)
    server/           código que só roda no Worker: Supabase com service role, Slack, WhatsApp, IA, PDF
    lib/              tipos, schema do projeto (Zod), regras de acesso ("pode fazer X?")
  supabase/
    migrations/       SQL versionado
  tests/
docs/
```

**Uma renderização só:** cada bloco é um componente React que recebe dados e variação. O mesmo componente roda no editor (interativo) e no servidor para a página publicada (HTML puro, quase sem JavaScript). Nunca crie duas versões de um bloco.

**O projeto é um JSON** validado por um schema Zod em `lib/`:

```ts
{ tipo: 'site' | 'midia-kit' | 'os-dois',
  modelo: 'nuvem', // valor interno fixo; sem modelos desde 27/out/2026
  paleta: 2, fontes: 'par-1', cantos: 'suaves',
  modoIniciante: false,
  blocos: [
    { id: 'b1', tipo: 'capa', variacao: 'foto-grande', oculto: false, dados: { ... } },
  ],
  guardados: [ ... ] }
```

Os blocos guardam **dados**, não visual. Trocar paleta, estilo ou formato muda só a pele; o conteúdo vai junto e o que não cabe vai para `guardados`.

**Sem modelos (decisão de 27/out/2026):** não existe escolha nem troca de modelo. A creator monta o portfólio com as seções (adicionar, esconder, remover, reordenar) e ajusta o visual na aba Estilo (3 paletas ou cor própria, fonte, cantos, claro ou escuro). O campo `modelo` continua no JSON e na coluna `projects.modelo` como valor interno fixo `'nuvem'`, porque o `projetoSchema` exige o campo e a coluna é `not null`. Não ofereça escolha de modelo nem crie modelos novos. Remover a coluna é dívida técnica para uma migração futura.

## 7. Regras que nunca quebram

**Conteúdo e verdade**
1. Nunca inventar números, depoimentos, cases, marcas ou preços, nem em exemplo que possa ir para o ar.
2. Placeholder (conteúdo de exemplo) **nunca** é publicado. Número de exemplo bloqueia a publicação.
3. A leitura de prints transcreve; nunca calcula ou chuta. Campo duvidoso vai para a reserva ou para a creator confirmar.
4. Nunca mencionar a avó da Carol em nenhum texto.

**Liberdade com travas**
5. A creator escolhe entre opções prontas; nunca aparece para ela campo de margem, tamanho em número, código de cor, posição livre ou CSS.
6. Os blocos só usam os **papéis de cor** (`--destaque`, `--fundo`, `--texto`...), nunca cor fixa. Todo par texto/fundo passa 4,5:1.
7. Nada se perde: trocar paleta, estilo ou formato nunca apaga conteúdo; toda ação destrutiva tem desfazer; fim do prazo de edição trava a edição, mas não tira nada do ar.
8. Capa e Contato são obrigatórios; máximo de uns 15 blocos.

**Celular primeiro**
9. Tudo é desenhado e testado primeiro em 390 px de largura. Áreas de toque de 44 px, controles na parte de baixo, nenhuma gaveta dentro de outra, nenhum gesto escondido sem botão equivalente.
10. Salva sozinho, mostra "Salvo ✓" e aguenta internet ruim.

**Segurança e dados**
11. RLS em todas as tabelas; uma creator nunca lê nem altera dados de outra. Teste isso.
12. Chave de service role do Supabase, tokens do Slack, WhatsApp, Cloudinary e IA **só no servidor**. Nada de segredo no navegador ou no Git.
13. Webhooks (Slack, WhatsApp) sempre com verificação de assinatura.
14. O aviso de abertura não guarda dado pessoal de quem abriu.
15. "Baixar meus dados" entrega só os dados da creator, nunca estilos, blocos ou PDF.
16. Toda ação da equipe que muda dado de creator vai para `audit_log`.

**Escopo**
17. Não construir nada que o PRD lista como não-objetivo: loja, marketplace, editor livre, API do Instagram no lançamento, pagamento automático.

## 8. Texto e interface

- Português do Brasil, tratamento "você", frases curtas, sem jargão técnico para a creator.
- Sempre "creators", nunca "fundadoras".
- Botão diz exatamente o que acontece ("Publicar", depois "Publicado").
- Erro explica o que houve e como resolver, sem pedir desculpas ("Esse vídeo tem 1min20. Use até 60s.").
- Placeholders e dicas no tom da Carol; os textos finais de exemplo vêm da Carol: use rascunhos marcados como `TODO(Carol)` quando não existirem.
- Visual do estilo padrão e das seções: os protótipos `portfolio-creator-handoff.zip > prototipo/Modelo*.dc.html` servem de referência visual, não são modelos para construir. Sempre **adaptados para celular** (os protótipos têm 1200 px fixos e conteúdo de exemplo escrito no HTML).

## 9. Definição de pronto (vale para toda tarefa)

- [ ] O "pronto quando" da tarefa no backlog foi atendido.
- [ ] TypeScript estrito sem erros; lint e formatação passando.
- [ ] Testes de unidade para regras e funções puras (paleta, normalização de números, regras de acesso, validação do JSON).
- [ ] Mudou banco ou permissão: teste de RLS passando.
- [ ] Mudou tela: verificado no Playwright em 390 px, tema claro e escuro, sem rolagem horizontal; print anexado.
- [ ] Acessibilidade: foco visível, rótulos nos controles, contraste.
- [ ] Nenhum segredo no código; nenhuma regra da seção 7 quebrada.
- [ ] O site da Carol continua funcionando (`npm run build` e as páginas existentes intactas).
- [ ] Interface: frontend-design e design-taste-frontend usadas antes; impeccable sem pendências graves; playwright com prints em 390 px claro e escuro.
- [ ] Aprovado pela pessoa.
- [ ] Backlog marcado, decisão registrada se houve, PROGRESSO atualizado, um commit na `dev` com `DEV-###`.

## 10. Ordem de construção

Siga o backlog. Em resumo:

1. **Base:** E1 (infra), E2 (banco e RLS), E3 (login), E4 (área da creator).
2. **Visual:** E5 (cores), E6 (blocos no estilo padrão Nuvem).
3. **Editor:** E7, depois E8 (assistente). Teste com creators reais antes de seguir.
4. **Conteúdo:** E9 (mídias), E10 (números informados), E11 e E12 (publicação e PDF).
5. **Operação:** E13 (pedidos e Slack), E14 (WhatsApp), E15 (aviso de abertura), E16 (planos e Premium).
6. **Fechamento:** E17 (LGPD), E18 (operação mínima), E19 (lista de espera), E20 (qualidade).

Os modelos Clean, Pop Color, Casual e Glow Rosé foram descartados em 27/out/2026: sem modelos, as seções montam o portfólio.

## 11. Como pedir uma tarefa (modelo para quem guia)

```
Faça a DEV-061 (Bloco Capa).
Leia docs/00-guia-ia.md e as seções de blocos e paletas do docs/02-construtor.md.
Mostre o plano antes de codar. Use frontend-design e design-taste-frontend antes, impeccable e playwright depois.
Ao terminar, mostre os testes, o resumo da impeccable e prints em 390 px no claro e no escuro.
Só commite na dev depois que eu aprovar.
```
