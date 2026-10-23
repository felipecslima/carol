-- DEV-014 e DEV-015: pedidos (criados pelo servidor ao publicar) e Premium liberado pela equipe.

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references public.projects (id) on delete cascade,
  dono uuid not null references public.profiles (id) on delete cascade,
  plano text not null,
  status text not null default 'aguardando_pagamento' check (status in ('aguardando_pagamento', 'pago', 'cancelado')),
  link_pagamento text,
  slack_thread_ts text,
  pago_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index orders_dono on public.orders (dono);

create trigger orders_atualizado before update on public.orders
  for each row execute function public.atualizar_data();

alter table public.orders enable row level security;
-- a creator só vê o próprio pedido; criar e mudar pedido é do servidor (service role ignora a RLS) e da equipe
create policy "creator le os proprios pedidos" on public.orders
  for select to authenticated using (dono = (select auth.uid()) or public.eh_equipe());
create policy "equipe altera pedidos" on public.orders
  for update to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

create table public.premium_grants (
  id uuid primary key default gen_random_uuid(),
  creator uuid not null references public.profiles (id) on delete cascade,
  molde text not null check (molde in ('site', 'midia-kit', 'os-dois')),
  motivo text not null default '',
  validade timestamptz,
  liberado_por uuid references auth.users (id) on delete set null,
  criado_em timestamptz not null default now()
);
create index premium_grants_creator on public.premium_grants (creator);

alter table public.premium_grants enable row level security;
create policy "creator le o proprio premium" on public.premium_grants
  for select to authenticated using (creator = (select auth.uid()) or public.eh_equipe());
create policy "equipe libera premium" on public.premium_grants
  for insert to authenticated with check (public.eh_equipe());
create policy "equipe muda premium" on public.premium_grants
  for update to authenticated using (public.eh_equipe()) with check (public.eh_equipe());
create policy "equipe tira premium" on public.premium_grants
  for delete to authenticated using (public.eh_equipe());
