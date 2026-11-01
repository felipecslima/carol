# Portfólio Creator: Termos de Uso e Política de Privacidade, com o contexto da aplicação

Documento para **revisão jurídica**, gerado em 31/out/2026 a partir do código e dos documentos do projeto. Tem quatro partes: (1) o contexto do produto, (2) os pontos em que os textos publicados não batem com o que o produto faz, (3) as perguntas em aberto para quem revisar e (4) os dois textos na íntegra, como estão no ar. O que está nas partes 1 a 3 foi conferido no código ou nos documentos do projeto; onde não foi possível conferir, está escrito.

Endereços no ar: `https://eucarollimah.com.br/portfolio-creator/termos/` e `https://eucarollimah.com.br/portfolio-creator/privacidade/`.

> **Atualização de 01/nov/2026:** os textos da parte 4 são os antigos. Os textos em vigor no código são os revisados pelo usuário em 31/out, em `site/src/pages/portfolio-creator/termos.astro` e `privacidade.astro`. Os trechos ainda pendentes aparecem em amarelo nessas páginas. A pesquisa sobre transferência internacional está na parte 5.

---

## 1. Contexto da aplicação

### 1.1 Quem oferece
- Razão social: **62.952.994 Ana Caroline da Silva Lima** (MEI), CNPJ 62.952.994/0001-01, São José dos Campos/SP. Ativo desde 29/09/2025. Atividade única na Receita: 5912-0/99 (pós-produção de vídeo). Consulta pública de 28/10/2026.
- Contato jurídico e de privacidade usado nos textos: ana.carolinelima1987@gmail.com.
- O produto é vendido dentro do site da Carol Limah (`eucarollimah.com.br`), no caminho `/portfolio-creator/`. Não tem domínio próprio por ora.

### 1.2 O que é
Aplicação web, só em português, para **creators de conteúdo** (influenciadores, UGC) montarem um **portfólio** e um **mídia kit**. A pessoa escolhe cores, responde perguntas, edita seções (capa, números de público, vídeos, marcas, formatos de trabalho, contato) e publica. O resultado sai em dois formatos: uma **página própria** (`/c/<link>`) e um **PDF de mídia kit** (1 ou 2 páginas A4).

### 1.3 Como a pessoa usa (fluxo)
1. **Sem conta:** monta o portfólio inteiro; o rascunho fica só no navegador do aparelho. O resultado aparece com marca d'água.
2. **Entra** com a conta Google ou com um código de 6 números enviado por e-mail (sem senha). O pedido do código passa por uma verificação contra robôs (Cloudflare Turnstile). Ao entrar, o rascunho do aparelho vai para a conta.
3. **Publica:** escolhe um link e um plano (ver 1.5). A publicação abre um **pedido** e fica "aguardando pagamento".
4. **Pagamento:** hoje **não há gateway**. O pagamento é combinado pelo WhatsApp e a equipe marca o pedido como pago num painel interno (`/admin/`). Só então o portfólio vai ao ar. O app não recebe nem guarda dados de cartão.
5. **No ar:** a página `/c/<link>` é pública para quem tiver o link, mas está marcada como `noindex` (fora do Google). O PDF é gerado no servidor e guardado.
6. **Links para marcas:** a pessoa cria um link por marca (`/c/<link>/<código>`) e manda por WhatsApp. O app conta quantas vezes cada link foi aberto.
7. **Edição depois de publicar:** 7 dias livres; depois a edição trava até contratar um plano de edição. O portfólio continua no ar.

O produto lança em **beta**, sem selo de beta na interface, com os textos atuais e sem revisão jurídica (decisão do usuário em 31/out/2026).

### 1.4 Quem usa e quem opera
- **Pessoa que usa (a creator):** maior de 18 anos, segundo os Termos. No login existe só a frase "Ao entrar, você concorda com os Termos de Uso e a Política de Privacidade". **Não há verificação de idade** nem pergunta de data de nascimento.
- **Equipe:** painel `/admin/` com três papéis: `admin` e `operacao` agem (marcar pago, tirar do ar, liberar plano); `assistente` só vê. Toda ação grava em um registro de auditoria (`audit_log`) com quem fez.
- **Quem vê o conteúdo publicado:** qualquer pessoa com o link (marcas, público). O PDF pode ser baixado por quem receber o arquivo.

### 1.5 Planos e preços (como estão nos Termos)
| Plano | Valor | Observação |
|---|---|---|
| Portfólio em PDF + link | R$ 49,90 | pagamento único; PDF sem marca d'água e link para compartilhar |
| Portfólio em site | R$ 149,90 + R$ 40,00 do domínio no 1º ano | tudo do PDF, num site com domínio .com.br registrado no Registro.br **em nome e CPF da creator**; renovação do 2º ano em diante direto no Registro.br |
| Atualização mensal | R$ 19,90/mês | edição liberada por 1 mês a cada pagamento; sem cobrança automática, é um pedido novo por mês |
| Atualização anual | R$ 179,00 | pagamento único; edição por 12 meses |
| Edição por 30 dias | R$ 49,90 | pagamento único; edição por 30 dias |

Lançamento **sem cupom**. Arrependimento de 7 dias (art. 49 do CDC) devolve tudo, menos a taxa do domínio já registrado.

### 1.6 Dados pessoais tratados e onde ficam
| Dado | Onde | Para quê |
|---|---|---|
| E-mail (e, no login Google, nome e foto do perfil Google, que ficam no cadastro de login mas não são usados no portfólio) | Supabase (login) | entrar na conta |
| Perfil: nome, @, WhatsApp, cidade, nicho | Supabase, tabela `profiles` | montar o portfólio; falar com a pessoa sobre o pedido |
| Conteúdo do portfólio: textos, números de público, marcas, formatos e valores, contato | Supabase, tabela `projects` (rascunho e versão publicada) | publicar a página e o PDF |
| Fotos e vídeos | Cloudinary, pasta `creators/<id da conta>/`; lista na tabela `media` | publicar |
| PDF do mídia kit | Supabase Storage | entrega do PDF |
| Pedidos: plano, situação, datas | Supabase, tabela `orders` | cobrança e liberação |
| Links para marcas: nome da marca, código; aberturas (só data e hora) | `brand_links`, `brand_opens` | contar aberturas. **O app não grava IP nem identificação de quem abriu**; robôs de prévia e a própria dona do link não contam |
| Eventos de uso ligados à conta (por exemplo `pedido_criado`) | `events` | entender o uso do produto |
| Registro de ações da equipe | `audit_log` | auditoria |
| Mensagem de erro, página e navegador | registros (logs) do Cloudflare | corrigir erros; sem conteúdo do portfólio |
| Visitas e cliques da página de apresentação e do site da Carol | Amplitude | medição; **sem gravação de sessão**, com aviso na primeira visita; desligado no app e nos portfólios publicados |
| Nome completo e CPF (plano Site) | **não existe no banco nem no app** (ver ponto 2.3) | registrar o domínio no Registro.br |
| Lista de espera: nome, WhatsApp, @ | tabela `waitlist` existe, mas **ainda não há formulário no ar** | — |

### 1.7 Serviços de terceiros em uso
- **Supabase**: banco, login e Storage. Projeto na região **us-east-1 (EUA)**.
- **Google**: login com a conta Google.
- **Cloudinary**: fotos e vídeos.
- **Cloudflare**: hospedagem (Workers), geração do PDF (Browser Run), logs de erro e Turnstile.
- **Resend**: envio do e-mail com o código de login, a partir de `envio.eucarollimah.com.br`.
- **Amplitude**: medição só na página de apresentação e no site da Carol.
- **Registro.br**: domínio do plano Site.
- Previstos para depois, **ainda não em uso**: Slack, WhatsApp oficial (Meta), gateway de pagamento, IA.

### 1.8 Limites e exclusão
- Por conta: até 300 arquivos e 1 GB de biblioteca; até 50 links de marca por dia.
- **Excluir conta** (área Conta): a conta fica desativada por 7 dias e os portfólios saem do ar; entrar de novo cancela. Depois, uma rotina diária apaga, nesta ordem, os arquivos no Cloudinary, os PDFs no Storage e o usuário (o que leva perfil, projetos, mídias e links). **Os pedidos ficam, sem ligação com a pessoa**, como registro de pagamentos. Há uma trava nova: se outra conta usa arquivos da pasta, nada daquela conta é apagado e o bloqueio fica registrado.
- **Baixar meus dados:** a área Conta gera um arquivo JSON. O pacote .zip com os arquivos ainda não existe.
- Segurança: regras de acesso por linha no banco (cada conta só lê o que é dela; a equipe só altera pelo painel); existe um roteiro de teste dessas regras, rodado à mão.

### 1.9 Decisões já tomadas pelo usuário
Só maiores de 18; domínio do plano Site no nome e CPF da creator; devolução do arrependimento sem a taxa do domínio; foro do domicílio da consumidora e, nos demais casos, São José dos Campos/SP; resposta a pedidos da LGPD em 15 dias; Amplitude sem gravação de sessão e com aviso; lançamento em beta sem revisão jurídica; página `/c/<link>` fora do Google; sem cupom.

---

## 2. Pontos em que os textos não batem com o produto (conferidos)

1. **A Política de Privacidade não cita o Resend.** O e-mail com o código de login é enviado pelo Resend, que trata o e-mail da pessoa. Ele não está na lista de terceiros do item 3 da Política.
2. **Os Termos não mencionam o login com Google.** O item 2 diz que a pessoa entra "com o seu e-mail, recebendo um código de 6 números, sem senha", e o item 1 diz que o e-mail "é a forma de entrar na conta". Hoje há também o login com Google. Os Termos são de 28/out e a Política de 31/out; a Política já cita o Google.
3. **CPF.** A Política diz que guarda nome completo e CPF no plano Site, mas o app **não coleta nem guarda CPF**: não há campo nem coluna. A coleta parece acontecer fora do app (WhatsApp). Falta definir como é coletada, onde fica e por quanto tempo.
4. **Datas diferentes:** Termos "28 de outubro de 2026"; Política "31 de outubro de 2026".
5. **Os Termos não mencionam o beta.**

## 3. Perguntas em aberto para quem revisar
1. **MEI:** vender assinatura de sistema online cabe na atividade 5912-0/99 e no MEI? Qual o teto de faturamento? (pendência com o contador, antes do primeiro pagamento)
2. **Transferência internacional:** os dados ficam em servidores fora do Brasil (Supabase em us-east-1 e outros). O texto cita "garantias previstas na LGPD" de forma genérica. É suficiente? Há cláusulas ou contratos com os fornecedores a anexar?
3. **Bases legais:** a Política usa execução de contrato, obrigação legal e legítimo interesse (segurança e melhoria do produto). Estão adequadas, inclusive para os eventos de uso e a Amplitude?
4. **Encarregado (DPO):** o texto diz "a pessoa encarregada" e usa o mesmo e-mail da empresa. Basta isso para um MEI?
5. **Maiores de 18:** só a declaração nos Termos e a frase no login. É suficiente, ou é preciso confirmar a idade?
6. **Conteúdo de terceiros:** a creator garante ter direito sobre fotos, vídeos, músicas e pessoas que aparecem, e sobre as marcas citadas e os números informados. A cláusula e a possibilidade de tirar conteúdo do ar protegem a empresa?
7. **Pagamento pelo WhatsApp:** sem gateway, o pedido e a cobrança são combinados por mensagem. Há exigência de comprovante, nota fiscal ou contrato?
8. **Plano mensal:** não há cobrança automática; cada mês é um pedido novo. A redação deixa isso claro o bastante para o consumidor?
9. **Reembolso:** arrependimento de 7 dias devolve tudo menos a taxa do domínio já registrado. Está de acordo com o CDC? E quanto ao plano de edição de 30 dias e aos planos não usados na exclusão?
10. **Retenção:** pedidos e pagamentos ficam "pelo prazo exigido pela lei fiscal". Qual é o prazo a escrever? Os registros de auditoria e de eventos entram nessa regra?
11. **Cookies e medição:** a Amplitude (visitas e cliques) tem aviso discreto de primeira visita ("Ok"). É suficiente para a LGPD?
12. **Dados de quem abre os links de marca:** o app não grava IP, mas a Cloudflare, como hospedagem, vê as conexões. A frase "não guardamos o IP" precisa de ressalva?
13. **Beta:** convém avisar nos Termos que o serviço está em fase beta?

---

## 4. Textos na íntegra (como estão no ar em 31/out/2026)

## Termos de Uso
Atualizado em 28 de outubro de 2026

O Portfólio Creator é um serviço para montar portfólio e mídia kit de creators, com página própria e PDF. Ele é oferecido por **62.952.994 Ana Caroline da Silva Lima**, CNPJ 62.952.994/0001-01, com sede em São José dos Campos/SP. Ao criar uma conta ou contratar um plano, você concorda com estes termos e com a Política de Privacidade.

### 1. Quem pode usar
O serviço é só para pessoas com 18 anos ou mais. Você é responsável pelos dados que informa e por manter o acesso ao seu e-mail, que é a forma de entrar na conta.

### 2. Conta e acesso
Dá para montar o portfólio sem conta: o rascunho fica guardado no seu aparelho. Para guardar na nuvem, publicar ou baixar o PDF, você entra com o seu e-mail, recebendo um código de 6 números, sem senha. Não compartilhe esse código com ninguém.

### 3. Teste grátis
Você pode montar o portfólio inteiro e ver como ele fica sem pagar e sem cartão. No teste, o resultado aparece com marca d’água. Para pôr o portfólio no ar com link próprio e baixar o PDF sem marca d’água, é preciso contratar um plano.

### 4. Planos e preços

#### Para publicar

- **Portfólio em PDF + link:** R$ 49,90. Pagamento único. PDF sem marca d’água e um link para compartilhar.
- **Portfólio em site:** R$ 149,90, mais R$ 40,00 do domínio no 1º ano. Tudo do PDF, num site com domínio .com.br no seu nome.
Depois da primeira publicação, você pode editar e publicar de novo por 7 dias. Passado esse prazo, o portfólio continua no ar, e a edição fica travada até você contratar um plano de edição.

#### Para continuar editando

- **Atualização mensal:** R$ 19,90/mês. Edição liberada por 1 mês a cada pagamento.
- **Atualização anual:** R$ 179,00. Pagamento único. Edição liberada por 12 meses.
- **Edição por 30 dias:** R$ 49,90. Pagamento único, sem assinatura. Edição liberada por 30 dias.
Os preços podem mudar; a mudança não afeta o que você já pagou.
No plano Portfólio em site, o domínio .com.br é registrado no Registro.br em seu nome, com o seu CPF, e é seu. A taxa cobrada cobre o primeiro ano. Do segundo ano em diante, você renova o domínio direto no Registro.br, no valor cobrado por ele; se não renovar, o domínio expira e o portfólio continua no link do Portfólio Creator.

### 5. Pagamento
Por enquanto, o pagamento é combinado pelo WhatsApp e confirmado pela nossa equipe. O plano é liberado depois da confirmação. Não guardamos dados de cartão. O plano mensal é cobrado mês a mês, como um novo pedido a cada mês; se você não pagar um mês, a edição volta a travar, e o portfólio continua no ar.

### 6. Arrependimento e reembolso
Pelo Código de Defesa do Consumidor (art. 49), você pode desistir da compra em até 7 dias depois do pagamento e receber o valor de volta, sem precisar explicar o motivo. Para isso, escreva para ana.carolinelima1987@gmail.com (mailto:ana.carolinelima1987@gmail.com). Se o domínio do plano Portfólio em site já tiver sido registrado, a taxa do domínio não é devolvida, e o domínio continua seu.

### 7. Seu conteúdo
Os textos, fotos, vídeos, números e marcas que você põe no portfólio continuam sendo seus. Para o serviço funcionar, você nos autoriza a guardar, processar e mostrar esse conteúdo na sua página, nos links que você cria e no PDF, só para esse fim. A autorização termina quando você apaga o conteúdo ou a conta.
Ao publicar, você garante que:

- tem direito de usar as fotos, os vídeos e as músicas, e a autorização das pessoas que aparecem neles;
- os números de público e de resultados são verdadeiros;
- pode citar as marcas e os trabalhos que mostra, conforme os contratos que você tem com elas;
- o conteúdo não é ilegal, ofensivo, enganoso nem viola direitos de outras pessoas.
Podemos tirar do ar conteúdo que viole estes termos ou a lei, avisando você sempre que possível. O que for publicado fica visível para qualquer pessoa que tiver o link.

### 8. Limites de uso
Para manter o serviço estável para todo mundo, cada conta tem até 300 fotos e vídeos e até 1 GB de espaço na biblioteca, e pode criar até 50 links de marca por dia. Não é permitido usar o serviço para enviar spam, tentar acessar contas de outras pessoas ou sobrecarregar o sistema.

### 9. Disponibilidade
Trabalhamos para o serviço ficar no ar o tempo todo, mas pode haver pausas para manutenção ou por falhas dos serviços que usamos. Não prometemos resultados com marcas: o Portfólio Creator ajuda a apresentar o seu trabalho, e as parcerias dependem de cada negociação.

### 10. Exclusão da conta
Você pode pedir a exclusão da conta quando quiser, na área Conta. A conta fica desativada por 7 dias e seus portfólios saem do ar; nesse prazo, basta entrar de novo para desistir. Depois disso, apagamos sua conta, seus portfólios, fotos, vídeos e links. Planos pagos e não usados não são reembolsados na exclusão, exceto no caso do item 6. Também podemos encerrar contas que violem estes termos.

### 11. Mudanças nestes termos
Se os termos mudarem, avisamos por e-mail ou dentro do app antes de a mudança valer. A data no topo desta página mostra a última atualização.

### 12. Lei e foro
Estes termos seguem a lei brasileira. Fica eleito o foro do seu domicílio, como garante o Código de Defesa do Consumidor; nos demais casos, o foro de São José dos Campos/SP.

### Contato
Dúvidas sobre estes termos: ana.carolinelima1987@gmail.com (mailto:ana.carolinelima1987@gmail.com).

---

## Política de Privacidade
Atualizado em 31 de outubro de 2026

Esta política explica como o Portfólio Creator trata os seus dados, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD). A controladora dos dados é **62.952.994 Ana Caroline da Silva Lima**, CNPJ62.952.994/0001-01, de São José dos Campos/SP. Para qualquer assunto de privacidade, inclusive falar com a pessoa encarregada dos dados, escreva para ana.carolinelima1987@gmail.com (mailto:ana.carolinelima1987@gmail.com).

### 1. Quais dados guardamos

#### Da sua conta

- **E-mail**, para você entrar com o código de 6 números ou com a sua conta Google.
- **Se você entrar com o Google**: o Google nos envia o seu e-mail, nome e foto do perfil, que ficam guardados junto do seu login. Usamos só o e-mail; o nome e a foto não aparecem no seu portfólio. Não recebemos a sua senha do Google.
- **Perfil**: nome, @ das redes, WhatsApp, cidade e nicho, se você preencher. O WhatsApp é usado para combinar o pagamento e falar com você sobre o seu pedido.

#### Do plano Portfólio em site

- Nome completo e CPF, só para registrar o domínio .com.br em seu nome no Registro.br, que também passa a tratar esses dados como responsável pelo registro.

#### Do seu portfólio

- Textos, fotos, vídeos, números de público, marcas, formatos e valores que você coloca. Você escolhe o que entra. Ao publicar, esse conteúdo fica visível para qualquer pessoa com o link, e o PDF pode ser baixado por quem receber o arquivo.
- Sem conta, o rascunho fica só no seu aparelho, no armazenamento do navegador. Com conta, ele também fica no aparelho até ser salvo na nuvem, e a cópia do aparelho é apagada quando você sai da conta.

#### Dos pedidos

- Plano escolhido, situação do pedido e datas. Não recebemos nem guardamos dados de cartão.

#### Dos links para marcas

- O nome da marca que você informa ao criar o link e a data e hora em que o link foi aberto. Não guardamos o IP nem qualquer dado que identifique quem abriu.

#### De uso e de erros

- Alguns momentos do uso do app ligados à sua conta, como criar um pedido ou publicar, para entender o que funciona e o que precisa melhorar.
- Quando algo dá erro, a mensagem do erro, a página e o tipo de navegador, para corrigir o problema. Isso fica nos registros do servidor e não inclui o conteúdo do seu portfólio.
- Na página de apresentação do Portfólio Creator e no site da Carol Limah (fora do app e fora dos portfólios publicados), usamos o Amplitude para contar visitas e cliques. Não gravamos a sua navegação. Um aviso aparece na primeira visita.

### 2. Para que usamos

- Criar e manter a sua conta e guardar o seu portfólio (execução do contrato).
- Publicar a sua página, gerar o PDF e contar as aberturas dos seus links (execução do contrato).
- Combinar e confirmar pagamentos e cumprir obrigações fiscais (execução do contrato e obrigação legal).
- Proteger o serviço contra abuso e corrigir erros (legítimo interesse).
- Melhorar o produto com dados de uso (legítimo interesse).
Não vendemos os seus dados e não usamos o seu conteúdo para anúncios.

### 3. Com quem compartilhamos
Usamos serviços de terceiros para o Portfólio Creator funcionar. Eles tratam os dados só para prestar esse serviço:

- **Supabase**: banco de dados, login e o arquivo PDF do mídia kit.
- **Google**: login com a sua conta Google, se você escolher entrar assim.
- **Cloudinary**: fotos e vídeos do portfólio.
- **Cloudflare**: hospedagem das páginas, geração do PDF, registros de erro e a verificação contra robôs ao pedir o código de entrada (Turnstile).
- **Amplitude**: medição da página de apresentação.
- **Registro.br**: registro do domínio, no plano Portfólio em site.
Alguns desses serviços guardam dados em servidores fora do Brasil, com as garantias previstas na LGPD para transferência internacional. Também podemos informar dados a autoridades quando a lei exigir.

### 4. Por quanto tempo
Guardamos os seus dados enquanto a sua conta existir. Quando você pede a exclusão na área Conta, a conta fica desativada por 7 dias e os seus portfólios saem do ar; nesse prazo, basta entrar de novo para desistir. Depois, apagamos a conta, o perfil, os portfólios, as fotos, os vídeos, os PDFs e os links. Os registros de pedidos e pagamentos ficam guardados sem ligação com você, pelo prazo exigido pela lei fiscal.

### 5. Os seus direitos
Pela LGPD, você pode pedir, a qualquer momento:

- confirmação de que tratamos os seus dados e acesso a eles;
- correção de dados incompletos ou errados;
- anonimização, bloqueio ou eliminação de dados desnecessários;
- portabilidade dos dados;
- eliminação dos dados, que também pode ser feita direto na área Conta;
- informação sobre com quem compartilhamos os dados;
- revisão de decisões tomadas só de forma automática.
Para isso, escreva para ana.carolinelima1987@gmail.com (mailto:ana.carolinelima1987@gmail.com). Respondemos em até 15 dias. Você também pode reclamar na Autoridade Nacional de Proteção de Dados (ANPD).

### 6. Segurança
O acesso aos dados é restrito: cada conta só enxerga o que é dela, e a equipe só altera dados pelo painel, com registro de cada ação. A conexão é sempre criptografada. Nenhum sistema é totalmente imune a falhas; se houver um incidente que coloque os seus dados em risco, avisamos você e a ANPD.

### 7. Menores de idade
O Portfólio Creator é só para maiores de 18 anos. Se soubermos que uma conta é de alguém mais novo, ela será excluída junto com os dados.

### 8. Mudanças nesta política
Se esta política mudar, avisamos por e-mail ou dentro do app. A data no topo mostra a última atualização.

---

## 5. Pesquisa de 31/out/2026: transferência internacional de dados (Supabase nos EUA)

Feita a pedido do usuário para corrigir o texto do Supabase com base na lei. As fontes primárias foram conferidas (Resolução 19 no DOU e contrato do Supabase). A mudança de nome da ANPD foi conferida em notícia da Câmara.

### 5.1 O que diz a lei
- **Não há decisão de adequação para os EUA.** A LGPD (art. 33) só permite a transferência por um dos mecanismos listados. Para um app privado, os que servem são:
  - cláusulas-padrão da ANPD (II, "b");
  - consentimento específico e em destaque (VIII);
  - transferência necessária para executar um contrato com o titular (IX, combinado com o art. 7º, V).
- **Cláusulas-padrão (Resolução CD/ANPD nº 19/2024):**
  - o texto do Anexo II tem de ser adotado na íntegra e sem alteração, em contrato entre exportador e importador (art. 16);
  - o prazo para incorporá-las terminou em 23/08/2025 (art. 2º, parágrafo único);
  - desde então, as cláusulas da União Europeia não valem no Brasil. A ANPD não reconheceu cláusulas de nenhum outro país como equivalentes (página "Repositório de mecanismos" da ANPD).
- **Transparência (art. 17 e cláusula 14 do Anexo II):** com cláusulas-padrão, o controlador publica no site, em português simples, um texto em página própria ou destacado na Política. Ele precisa trazer:
  - forma, duração e finalidade;
  - país de destino;
  - contatos do controlador;
  - uso compartilhado;
  - responsabilidades e medidas de segurança;
  - direitos e canal do titular, incluindo o direito de peticionar à ANPD;
  - transferências posteriores.

  A íntegra das cláusulas deve ser entregue em até 15 dias a quem pedir.
- **União Europeia:** a adequação Brasil–UE está em vigor desde 27/01/2026 (Resolução ANPD nº 32/2026). Dados guardados em servidores na UE dispensam as cláusulas.
- **Nome do órgão:** a ANPD passou a ser a Agência Nacional de Proteção de Dados (Lei 15.352, de 25/02/2026). A Política já foi corrigida.
- **Pequeno porte:** a Resolução 19 não dá regime mais leve para agentes de pequeno porte.

### 5.2 Fornecedores (contratos lidos em 31/out)
| Serviço | Cláusulas da ANPD no contrato? | Observação |
|---|---|---|
| Supabase | Não | O DPA (versão 1, 01/08/2026) define as cláusulas-padrão como as da UE (Decisão 2021/914) e não cita a LGPD. O Anexo 2, item 4.4, obriga o Supabase a firmar um acordo suplementar quando a autoridade do país adotar cláusulas próprias: é o caminho para pedir as da ANPD. |
| Google (login) | Não se aplica | No login, o Google é responsável próprio pelos dados e os envia ao app (interpretação, não confirmada pela ANPD). |
| Resend | Não encontrado | O DPA cobre só as cláusulas da UE e do Reino Unido. |
| Cloudinary | Não encontrado | O DPA cobre o acordo EUA–UE, as cláusulas da UE e o Reino Unido. |
| Cloudflare | Não | O DPA 6.4 cobre UE, Reino Unido e Suíça, e o selo Global CBPR. O Brasil não participa desse selo. |
| WhatsApp (Meta) | Sim, se for conta WhatsApp Business | O adendo de transferência (DTA, 22/08/2025) traz o Anexo II da Resolução 19, e a empresa responde pelas cláusulas 14 a 16. Não está claro se aceitar os termos online conta como "instrumento firmado". |
| Amplitude | Não encontrado | O DPA (13/05/2026) cobre só saídas da UE, do Reino Unido e da Suíça. |

### 5.3 Caminhos (decisão da empresa e do advogado)
1. **Assinar as cláusulas da ANPD** com Supabase, Resend, Cloudinary, Cloudflare e Amplitude. A frase da Política continua como o usuário escreveu, e a parte de transferência ganha destaque, duração e transferências posteriores (art. 17). É o caminho mais robusto. Com o Supabase, há a base contratual do item 4.4.
2. **Basear Supabase, Resend, Cloudinary e Cloudflare na execução do contrato** (art. 33, IX). É defensável, mas incerto:
   - a ANPD não definiu o que é "necessário";
   - existir uma região do Supabase em São Paulo enfraquece o argumento;
   - não cobre os registros de erro nem quem só visita um portfólio publicado.
3. **Amplitude:** sem as cláusulas da ANPD, as saídas são três:
   - consentimento (art. 33, VIII), que exige aceite antes de medir, e não só a opção de recusar que existe hoje;
   - mover a medição para servidores na UE, que é adequada;
   - tirar o Amplitude da página do Creator.
4. **WhatsApp:** confirmar que o número oficial (+55 12 99137-6550) é uma conta WhatsApp Business.

### 5.4 Fontes
- LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Resolução CD/ANPD nº 19/2024: https://www.in.gov.br/en/web/dou/-/resolucao-cd/anpd-n-19-de-23-de-agosto-de-2024-580095396
- ANPD, transferência internacional e repositório de mecanismos: https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados
- Resolução ANPD nº 32/2026 (adequação UE): https://www.in.gov.br/web/dou/-/resolucao-n-32-de-26-de-janeiro-de-2026-683334547
- Lei 15.352/2026: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/L15352.htm e https://www.camara.leg.br/noticias/1248401-ENTRA-EM-VIGOR-LEI-QUE-CRIA-A-AGENCIA-NACIONAL-DE-PROTECAO-DE-DADOS
- Supabase DPA: https://supabase.com/legal/dpa
- Resend DPA: https://resend.com/legal/dpa
- Cloudinary DPA: https://cloudinary.com/gdpr/dpa
- Cloudflare DPA: https://www.cloudflare.com/cloudflare-customer-dpa/
- WhatsApp DTA: https://www.whatsapp.com/legal/DTA
- Amplitude DPA: https://amplitude.com/dpa
- Google Cloud, cláusulas Brasil (não cobrem o login): https://cloud.google.com/sccs/br-c2p

