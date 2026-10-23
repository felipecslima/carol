-- DEV-011: perfil da creator (1 por usuário do Auth). O papel de equipe NÃO fica aqui: está em app_metadata.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '' check (char_length(nome) <= 60),
  arroba text not null default '' check (char_length(arroba) <= 40),
  whatsapp text not null default '' check (char_length(whatsapp) <= 30),
  cidade text not null default '' check (char_length(cidade) <= 60),
  nicho text not null default '' check (char_length(nicho) <= 40),
  modo_iniciante boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create trigger profiles_atualizado before update on public.profiles
  for each row execute function public.atualizar_data();

-- toda conta nova ganha um perfil vazio
create or replace function public.criar_perfil_do_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger auth_usuario_criado after insert on auth.users
  for each row execute function public.criar_perfil_do_usuario();

alter table public.profiles enable row level security;

create policy "creator le o proprio perfil" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or public.eh_equipe());
create policy "creator altera o proprio perfil" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "equipe altera perfis" on public.profiles
  for update to authenticated using (public.eh_equipe()) with check (public.eh_equipe());
-- sem policy de insert/delete: o perfil nasce pelo gatilho e some junto com a conta (on delete cascade)
