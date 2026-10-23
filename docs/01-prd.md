# PRD — Portfólio Creator

Versão 1 do PRD, 23/out/2026. Quando houver conflito entre documentos, este PRD manda. Os detalhes de desenho estão em `02-construtor.md`, as tarefas de código em `03-backlog-dev.md` e a leitura de prints em `04-ocr-prints.md`.

## 0. Versão 1: o que fica de fora

Decidido em 23/out/2026 para lançar mais rápido. Tudo abaixo continua planejado, só sai da versão 1:

- **Leitura de prints (OCR e IA de reserva):** na versão 1 a creator **digita os números** com um guia de onde achar cada um no Insights.
- **IA no assistente:** a bio não é escrita pela IA; as respostas dela preenchem os blocos e os placeholders trazem as dicas.
- **Entrar com Google:** só código de 6 dígitos por e-mail.
- **Gateway de pagamento:** a Carol manda o link de pagamento manualmente (já era assim).

Quando este bloco conflitar com o resto do documento, ele vale.

## 1. Problema

A creator iniciante de UGC e influência trava quando a marca pede portfólio ou mídia kit: não sabe o que colocar, leva dias para montar no Canva, o resultado fica com cara de amador, e se ainda não fez nenhuma publi acha que não tem o que mostrar. As ferramentas que existem são grátis mas entregam um modelo em branco (Canva) ou dependem de números e conta profissional conectada (Beacons, Meu Airfluencers), deixando de fora justamente quem está começando. Sem portfólio, ela não consegue se apresentar às marcas e não fecha a primeira publi.

## 2. Para quem

- **Creator iniciante** (principal): de 0 a poucas publis, edita pelo celular, pouca familiaridade com design. Inclui alunas do curso e seguidoras da Carol.
- **Creator em crescimento** (secundária): já tem números bons e quer mostrá-los bem.
- **Marca** (quem recebe): abre o link no celular e decide rápido se a creator combina com a campanha.
- **Equipe** (você, Carol, assistente): opera pedidos, pagamentos, Premium e suporte.

## 3. Objetivos

As metas abaixo são **hipóteses iniciais**; revisar depois das 5 primeiras creators.

1. **A creator manda o portfólio para marcas.** Métrica principal: % das creators publicadas com o portfólio aberto por pelo menos 1 marca em 14 dias. Meta: 50%.
2. **Fica pronto rápido, no celular.** Mediana do tempo entre começar e o portfólio pronto para publicar: até 30 minutos.
3. **Números confiáveis.** 0 números de exemplo publicados. Quando a leitura de prints entrar: 98% dos campos lidos corretos.
4. **O teste vira venda.** Conversão do teste grátis para pago: meta a definir com os primeiros dados.
5. **Prova real para a Carol.** Publis fechadas reportadas pelas creators, viradas em depoimento com permissão.

## 4. Não-objetivos

- **Loja, venda de cursos e cobrança dentro do produto.** Stan e Beacons fazem; não é a dor da iniciante.
- **Marketplace de marcas.** O Meu Airfluencers faz; pode virar parceria, não produto.
- **Editor livre (posição livre, margens, CSS).** Liberdade total faz a iniciante travar e deixa a página feia; o Canva já ganha nisso de graça.
- **Conexão com a API do Instagram no lançamento.** Depende de CNPJ verificado e revisão da Meta; e não serve para contas pequenas ou pessoais. Fica para depois.
- **Pagamento automático no lançamento.** A Carol manda o link de pagamento; automatizar só quando o volume pedir.
- **Link na bio completo.** O link `/nome` já serve de bio.

## 5. Histórias de usuário

**Creator iniciante**

1. Como creator sem nenhuma publi, quero um portfólio que valorize meus vídeos de exemplo, para ter algo para mandar às marcas mesmo começando do zero.
2. Como creator, quero responder algumas perguntas e mandar meus vídeos e prints, para já começar com o portfólio quase pronto.
3. Como creator, quero trocar textos, fotos, vídeos e a ordem dos blocos pelo celular, para deixar o portfólio do meu jeito sem saber design.
4. Como creator, quero trocar de modelo e de cores sem perder nada, para experimentar sem medo.
5. Como creator, quero que meus números saiam dos prints sem digitar, e conferir antes de publicar, para não errar.
6. Como creator, quero publicar num link com meu nome e baixar o PDF do mídia kit, para mandar do jeito que a marca pedir.
7. Como creator, quero mandar o portfólio para uma marca e saber quando ela abriu, para saber a hora de fazer o follow-up.
8. Como creator, quero ser avisada no WhatsApp sobre pagamento, publicação e aberturas, para não precisar ficar entrando no app.
9. Como creator, quero baixar meus dados e excluir minha conta quando quiser, para ter controle do que é meu.

**Casos de borda**

10. Como creator, se eu sair no meio da edição ou a internet cair, quero encontrar tudo salvo.
11. Como creator, se o print estiver ruim, quero saber o que reenviar em vez de ver um número errado.
12. Como creator, se meu prazo de edição acabar, quero que meu portfólio continue no ar.

**Marca**

13. Como marca, quero abrir o portfólio no celular e ver em segundos vídeos, números e público, para decidir se chamo a creator.

**Equipe**

14. Como equipe, quero ser avisada no Slack de cada pedido e marcar o pagamento com um toque, para operar sem planilha.
15. Como equipe, quero liberar Premium por molde (Site, Mídia kit ou os dois) para alunas e parceiras, com motivo e validade.
16. Como equipe, quero tirar do ar um portfólio problemático, para proteger a marca da Carol.

## 6. Requisitos

### P0 — sem isso não lança

**P0.1 Conta e área da creator**

- [ ] Login sem senha com código de 6 dígitos por e-mail.
- [ ] Pode começar sem conta; o rascunho vai junto ao criar a conta.
- [ ] 4 abas: Início (próximo passo), Projetos, Mídias, Conta.
- [ ] 1 site e 1 mídia kit por conta (ou os dois juntos), 1 link `/nome`.
- [ ] Cada creator só vê e altera o que é dela (RLS).

**P0.2 Assistente de início**

- [ ] Pergunta nome, @, cidade, nicho, "já fez publi?", o que mais grava e uma frase dela; pede vídeos e prints.
- [ ] "Ainda não" liga o modo iniciante (esconde números, público e marcas; destaca vídeos de exemplo).
- [ ] Ao terminar, a creator chega ao editor com as respostas dela, os vídeos e os números que informou já nos blocos; placeholder só onde faltou informação. Sem IA nesta versão.

**P0.3 Construtor (editor)**

- [ ] Edição em cima do resultado; tocar no bloco mostra Editar, ↑, ↓, Esconder; edição em gaveta de baixo com mudança ao vivo.
- [ ] Adicionar, esconder, devolver e reordenar blocos; Capa e Contato obrigatórios.
- [ ] 8 blocos com 2 variações cada, em 5 modelos (Nuvem, Clean, Pop Color, Casual, Glow Rosé) e 3 paletas prontas por modelo.
- [ ] Trocar modelo, paleta ou formato não apaga conteúdo; o que não cabe vai para Guardados.
- [ ] Salva sozinho, "Salvo ✓" visível, desfazer sempre à mão, funciona com internet ruim.
- [ ] Nenhum controle de margem, tamanho em número, posição livre ou CSS.
- [ ] Contraste de texto garantido em qualquer paleta (regra Material 3).

**P0.4 Mídias**

- [ ] Fotos e vídeos da galeria vão para o Cloudinary, com conversão de HEIC e .mov, compressão e capa automática.
- [ ] Envio em segundo plano com progresso; ela continua editando.
- [ ] Limites de duração, tamanho e espaço aplicados (valores a definir pelo plano do Cloudinary).

**P0.5 Números informados pela creator**

- [ ] Campos de números (seguidores, visualizações, contas alcançadas, interações, público, views por reel) com guia visual de onde achar cada um no Insights.
- [ ] Período informado junto ("últimos 30 dias").
- [ ] Selo "informado pela creator"; nenhum número de exemplo pode ser publicado.
- [ ] O formato dos dados já é o mesmo que a leitura de prints vai preencher depois (`04-ocr-prints.md`).

**P0.6 Publicação e mídia kit**

- [ ] Revisão final: alertas vermelhos bloqueiam (placeholder não trocado, número de exemplo, sem contato); amarelos ela pode ignorar.
- [ ] Escolha do link `/nome` com checagem na hora e nomes reservados bloqueados.
- [ ] Portfólio publicado leve, renderizado no servidor, abre rápido no 4G.
- [ ] PDF do mídia kit de 1 página gerado do mesmo conteúdo.
- [ ] Prévia do link (imagem e título) no WhatsApp e no Instagram.
- [ ] Selo "Feito com Portfólio Creator" no site e no PDF.

**P0.7 Regras de plano**

- [ ] Conta grátis: modelos do teste, prévia e PDF com marca d'água, sem publicar.
- [ ] Pago: todos os modelos do lançamento, sem marca d'água, publicação, PDF; edição até concluir + 7 dias.
- [ ] Edição liberada (assinatura ou avulsa): edita sempre.
- [ ] Fim do prazo trava a edição, mas nada sai do ar e nada se perde.

**P0.8 Pedido, pagamento e avisos**

- [ ] Publicar gera pedido: card no Slack; a Carol cola o link de pagamento na thread e o bot envia pelo WhatsApp; botão Pago publica de verdade.
- [ ] Avisos de WhatsApp (API oficial, modelos aprovados): pedido recebido, link de pagamento, pago, no ar, edição perto de travar, conta excluída.

**P0.9 Aviso de abertura**

- [ ] "Mandar para uma marca" gera um link com código por marca e a mensagem pronta.
- [ ] Abertura registrada só em navegador de verdade (prévias automáticas filtradas) e nunca pela própria creator.
- [ ] Aviso no app e no WhatsApp; lista "Marcas" com envio, aberturas e data.
- [ ] Nenhum dado pessoal de quem abriu é guardado.

**P0.10 LGPD**

- [ ] Termos e Política de Privacidade publicados antes da primeira venda.
- [ ] Baixar meus dados (.zip só com os dados dela, nunca os produtos).
- [ ] Excluir conta: confirmação por código, 7 dias para voltar atrás, apaga Cloudinary, Storage, banco e login; mantém só registro de pagamentos pelo prazo legal.

**P0.11 Operação mínima**

- [ ] Admin provisório pelo Supabase Studio.
- [ ] Liberar Premium por molde, com motivo e validade (pode começar como ação no Studio ou botão simples).
- [ ] Tirar portfólio do ar.
- [ ] Eventos do editor registrados desde o primeiro dia.

### P1 — logo depois do lançamento

- Leitura de prints: OCR no aparelho + IA de reserva, conforme `04-ocr-prints.md`.
- IA no assistente (bio escrita a partir das respostas).
- Entrar com Google.
- Admin no Refine + shadcn: Painel, Pedidos, Creators, Mensagens, Exclusões, Registro de ações.
- Cor própria e "usar a cor da minha foto" (a regra Material 3 já estará pronta).
- Revisão da Carol (pago): 3 ajustes em áudio de WhatsApp.
- Plano Site com domínio próprio `.com.br`.
- Levar o site para outro lugar, pagando o valor do mídia kit.
- Botão "Fechei uma publi!" com pedido de depoimento.
- Histórico de versões (cada publicação restaurável).
- IA nos textos ("Melhorar", "Mais curto", "Mais meu jeito").

### P2 — futuro (desenhar sem bloquear)

- Os outros 10 modelos (total de 15) e mais variações de blocos.
- Conectar o Instagram pela API (números automáticos; selo "números conferidos").
- Código por WhatsApp no login.
- Remover o selo como benefício de plano.
- Pagamento automático.
- Blocos salvos e botão "surpresa" de estilo.

## 7. Métricas

| Métrica | Tipo | Meta inicial (hipótese) | Quando avaliar |
| --- | --- | --- | --- |
| Creators publicadas com portfólio aberto por ≥1 marca em 14 dias | Principal | 50% | Mensal |
| Tempo mediano até o portfólio ficar pronto | Adesão | até 30 min | Semanal |
| % que termina o assistente | Adesão | 70% | Semanal |
| % de testes que viram pago | Negócio | definir após 5 primeiras | Mensal |
| Campos de prints corretos (fora da reserva) | Qualidade | 98% | Quando a leitura de prints entrar |
| Publis fechadas reportadas | Resultado | crescer mês a mês | Trimestral |

Todas medidas pelos eventos do editor, pela tabela de pedidos e pelos registros de abertura.

## 8. Perguntas em aberto

| Pergunta | Quem responde | Bloqueia? |
| --- | --- | --- |
| Preços e nomes dos planos | Carol e você | Sim, antes de vender |
| Limites de vídeo, foto e espaço pelo plano do Cloudinary | Engenharia | Sim, antes do editor de mídias |
| Quanto de IA a conta grátis pode usar | Carol e você | Não |
| CNPJ, razão social, Termos e revisão jurídica | Jurídico / contador | Sim, antes da primeira venda |
| Preço e prazo da Revisão da Carol | Carol | Não (P1) |
| Remover o selo é benefício de plano? | Carol e você | Não |
| Nome do selo de números ("lido dos prints enviados")? | Carol | Não |
| Usar o Puck como base do editor? (teste de 1 a 2 dias) | Engenharia | Sim, antes do editor |
| Esquema de cor Material por modelo e mapa de papéis | Design | Sim, antes dos modelos |
| Número e modelos de mensagem do WhatsApp aprovados pela Meta | Engenharia | Sim, antes do lançamento |
| Rótulos reais do Insights (iPhone/Android, PT/EN) | Engenharia | Não (leitura de prints fica para depois) |

## 9. Prazo e fases

- **Atenção ao cupom:** o cupom de lançamento vence em 30/11. Com todo o P0 acima, o lançamento dificilmente cabe até lá. Decidir entre mover a data do cupom ou cortar P0.
- **Dependências que demoram e devem começar já:** CNPJ e Termos; número e modelos de mensagem do WhatsApp na Meta.
- **Ordem sugerida:**
  1. Base: Supabase, login, estrutura de dados, papéis de cor, 1 modelo (Nuvem) com os 8 blocos.
  2. Editor e assistente no celular, testados com creators reais.
  3. Mídias, números informados e publicação com PDF.
  4. Pedido, Slack, WhatsApp, aviso de abertura e regras de plano.
  5. Os outros 4 modelos do lançamento, LGPD e operação mínima.
  6. Lançamento com as 5 primeiras creators; depois P1.
