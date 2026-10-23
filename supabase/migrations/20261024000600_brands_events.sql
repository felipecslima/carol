-- DEV-016, 017 e 018: links para marcas e aberturas, eventos do editor, auditoria da equipe e lista de espera.

create table public.brand_links (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique check (codigo ~ '^[a-z0-9]{4,12}$'),
  nome_marca text not null check (char_length(nome_marca) between 1 and 80),
  projeto_id uuid not null references public.projects (id) on delete cascade,
  dono uuid not null references public.profiles (id) on delete cascade,
  criado_em timestamptz not null default now()
);
create index brand_links_dono on public.brand_links (dono);

alter table public.brand_links enable row level security;
create policy "creator le os proprios links" on public.brand_links
  for select to authenticated using (dono = (select auth.uid()) or public.eh_equipe());
create policy "creator cria link para marca" on public.brand_links
  for insert to authenticated with check (
    dono = (select auth.uid())
    and exists (select 1 from public.projects p where p.id = projeto_id and p.dono = (select auth.uid()))
  );
create policy "creator apaga o proprio link" on public.brand_links
  for delete to authenticated using (dono = (select auth.uid()));

-- aberturas: só o servidor grava (depois de filtrar robôs); a creator lê as dos próprios links
create table public.brand_opens (
  id bigint generated always as identity primary key,
  link_id uuid not null references public.brand_links (id) on delete cascade,
  aberto_em timestamptz not null default now()
);
create index brand_opens_link on public.brand_opens (link_id, aberto_em);

alter table public.brand_opens enable row level security;
create policy "creator le aberturas dos proprios links" on public.brand_opens
  for select to authenticated using (
    public.eh_equipe()
    or exists (select 1 from public.brand_links l where l.id = link_id and l.dono = (select auth.uid()))
  );

create table public.events (
  id bigint generated always as identity primary key,
  dono uuid references public.profiles (id) on delete cascade,
  nome text not null check (char_length(nome) <= 60),
  propriedades jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);
create index events_nome on public.events (nome, criado_em);

alter table public.events enable row level security;
-- o editor registra os próprios eventos; só a equipe lê
create policy "creator registra os proprios eventos" on public.events
  for insert to authenticated with check (dono = (select auth.uid()));
create policy "equipe le eventos" on public.events
  for select to authenticated using (public.eh_equipe());

create table public.audit_log (
  id bigint generated always as identity primary key,
  ator uuid references auth.users (id) on delete set null,
  acao text not null,
  alvo text,
  detalhes jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

alter table public.audit_log enable row level security;
-- só a equipe lê; gravar é do servidor (service role)
create policy "equipe le a auditoria" on public.audit_log
  for select to authenticated using (public.eh_equipe());

create table public.waitlist (
  id bigint generated always as identity primary key,
  nome text not null check (char_length(nome) between 1 and 80),
  whatsapp text not null check (char_length(whatsapp) between 8 and 30),
  arroba text not null default '' check (char_length(arroba) <= 40),
  criado_em timestamptz not null default now()
);

alter table public.waitlist enable row level security;
-- sem policy para anon nem authenticated: a lista é gravada e lida só pelo servidor e pelo admin
create policy "equipe le a lista de espera" on public.waitlist
  for select to authenticated using (public.eh_equipe());
