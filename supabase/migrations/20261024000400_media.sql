-- DEV-013: mídias da creator (arquivos no Cloudinary; aqui só o registro). Reaproveitáveis em qualquer projeto.

create table public.media (
  id uuid primary key default gen_random_uuid(),
  dono uuid not null references public.profiles (id) on delete cascade,
  tipo text not null check (tipo in ('image', 'video')),
  public_id text not null,
  url text not null,
  capa text not null,
  nome text not null default '',
  bytes bigint not null default 0 check (bytes >= 0),
  duracao_s numeric check (duracao_s >= 0),
  criado_em timestamptz not null default now(),
  unique (dono, public_id)
);
create index media_dono on public.media (dono, criado_em desc);

alter table public.media enable row level security;

create policy "creator le as proprias midias" on public.media
  for select to authenticated using (dono = (select auth.uid()) or public.eh_equipe());
create policy "creator registra a propria midia" on public.media
  for insert to authenticated with check (dono = (select auth.uid()));
create policy "creator apaga a propria midia" on public.media
  for delete to authenticated using (dono = (select auth.uid()));
