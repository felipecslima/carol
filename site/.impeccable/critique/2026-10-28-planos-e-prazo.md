# Crítica: escolha de plano e prazo de edição vencido (DEV-160, 190, 192, 193)

Dois revisores isolados (A: hierarquia e acessibilidade; B: entendimento da compra). Capturas em 390 e 1280 px.

## A (notas antes das correções)
Hierarquia 6, clareza 6, acessibilidade 8, consistência 8.
1. Editor travado mostrava "pronto para publicar", aviso de prazo e Publicar desligado juntos. **Corrigido:** o aviso é a única mensagem; "Liberar a edição no Início" substitui o Publicar.
2. "Liberar a edição" 3 vezes e dois botões rosa no Início; barra de progresso no estado travado. **Corrigido:** o cartão leva só o link "Abrir meu link"; a seção tem o único rosa; barra escondida.
3. Link do aviso sem destino claro. **Corrigido:** "Liberar a edição no Início", como botão.
4. Rádio desmarcado com pouco contraste no escuro. **Corrigido:** anel desenhado em `--ed-suave`, marcado em `--ed-rosa-escuro`.
5. "/mês" e frase do domínio montados no componente. **Corrigido:** `periodo` e `extra.nome` em `lib/planos.ts`; total calculado.

## B
1. "Publicar" sem dizer que nada é cobrado. **Corrigido:** botão "Reservar meu link" e "Nada é cobrado agora…" acima dele, com os 7 dias.
2. Site parecia ter domínio incluído e cobrado. **Corrigido:** "num site com domínio .com.br no seu nome. Mais R$ 40,00 do domínio no 1º ano (total R$ 189,90)."
3. Saída escondida no editor travado. **Corrigido** (ver A1 e A3); o aviso diz que o que ela muda fica salvo.
4. "Assinatura/cancele quando quiser" sem cobrança automática. **Corrigido:** mensal "Edição liberada por 1 mês a cada pagamento"; avulsa "Pagamento único, sem assinatura".
5. Pedido de liberação sumia ao recarregar; subtítulo confuso. **Corrigido:** `edicaoPedida` vem dos pedidos; cartão diz "No ar · edição travada".

Verificação: `/tmp/rev/dev160.mjs` (40/40), `/tmp/rev/admin-planos.mjs` (5/5), `/tmp/rev/acesso-check.ts` (10/10).
