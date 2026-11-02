-- Pedido reembolsado (31/out). No arrependimento de 7 dias (Termos, item 6) a equipe devolve o valor fora do sistema e
-- marca o pedido como `reembolsado` no Admin. O status novo só entra na regra de valores; quem muda o status continua
-- sendo só o servidor (a equipe pelo painel). Os pedidos reembolsados deixam de contar como pagos: o acesso (`acessoDa`)
-- e as somas do painel olham só `status = 'pago'`.

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check check (status in ('aguardando_pagamento', 'pago', 'cancelado', 'reembolsado'));
