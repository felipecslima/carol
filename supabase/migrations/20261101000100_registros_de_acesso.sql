-- Registros de acesso (Marco Civil da Internet, Lei 12.965/2014, art. 15; Política de Privacidade, item 1): data, hora
-- e IP de cada acesso à conta, guardados em sigilo por 6 meses e depois apagados pela rotina diária
-- (/api/interno/limpeza). Sem chave estrangeira de propósito: o registro precisa ficar os 6 meses mesmo que a conta
-- seja excluída antes. Só o servidor (service_role) lê e grava: RLS ligado e nenhuma política.

create table public.registros_de_acesso (
  id bigint generated always as identity primary key,
  conta uuid not null,
  ip text not null check (char_length(ip) <= 64),
  em timestamptz not null default now()
);

create index registros_de_acesso_em on public.registros_de_acesso (em);
create index registros_de_acesso_conta on public.registros_de_acesso (conta, em);

alter table public.registros_de_acesso enable row level security;
revoke all on public.registros_de_acesso from anon, authenticated;
