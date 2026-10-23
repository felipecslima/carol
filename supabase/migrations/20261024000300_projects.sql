-- DEV-012 e DEV-143: projetos (site, mídia kit ou os dois). `blocos` é o JSON validado no app (lib/projeto.ts).
-- O que está no ar (`publicado`) é separado do rascunho: editar não muda o que está publicado até publicar de novo.
-- Estado, link e versão publicada só o servidor altera (gatilho abaixo); a creator mexe no conteúdo.

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  dono uuid not null references public.profiles (id) on delete cascade,
  tipo text not null check (tipo in ('site', 'midia-kit', 'os-dois')),
  modelo text not null,
  paleta integer not null default 0 check (paleta >= 0),
  cor_propria text check (cor_propria ~ '^#[0-9a-fA-F]{6}$'),
  fontes text not null,
  cantos text not null check (cantos in ('retos', 'suaves', 'redondos')),
  clima text not null default 'claro' check (clima in ('claro', 'escuro')),
  modo_iniciante boolean not null default false,
  blocos jsonb not null default '[]'::jsonb check (jsonb_typeof(blocos) = 'array' and jsonb_array_length(blocos) <= 15),
  guardados jsonb not null default '[]'::jsonb check (jsonb_typeof(guardados) = 'array'),
  numeros jsonb,
  -- só o servidor altera daqui para baixo
  status text not null default 'rascunho'
    check (status in ('rascunho', 'aguardando_pagamento', 'no_ar', 'edicao_travada', 'fora_do_ar')),
  slug text check (slug ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'),
  publicado jsonb,
  publicado_em timestamptz,
  prazo_edicao timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- um link por creator no sistema todo; 1 site e 1 mídia kit por creator
create unique index projects_slug_unico on public.projects (lower(slug)) where slug is not null;
create unique index projects_um_por_tipo on public.projects (dono, tipo);
create index projects_dono on public.projects (dono);

create trigger projects_atualizado before update on public.projects
  for each row execute function public.atualizar_data();

-- a creator (role authenticated, fora da equipe) não pode mudar estado, link, versão publicada nem prazo
create or replace function public.proteger_colunas_do_projeto()
returns trigger
language plpgsql
as $$
begin
  if current_user = 'authenticated' and not public.eh_equipe() then
    if (new.status, new.slug, new.publicado, new.publicado_em, new.prazo_edicao, new.dono)
       is distinct from (old.status, old.slug, old.publicado, old.publicado_em, old.prazo_edicao, old.dono) then
      raise exception 'Estado, link e versão publicada só podem ser alterados pelo servidor.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

create trigger projects_proteger before update on public.projects
  for each row execute function public.proteger_colunas_do_projeto();

alter table public.projects enable row level security;

create policy "creator le os proprios projetos" on public.projects
  for select to authenticated using (dono = (select auth.uid()) or public.eh_equipe());
-- criar: sempre como rascunho, sem link nem versão publicada
create policy "creator cria projeto em rascunho" on public.projects
  for insert to authenticated
  with check (dono = (select auth.uid()) and status = 'rascunho' and slug is null and publicado is null and prazo_edicao is null);
create policy "creator edita o proprio projeto" on public.projects
  for update to authenticated using (dono = (select auth.uid())) with check (dono = (select auth.uid()));
create policy "creator apaga o proprio projeto" on public.projects
  for delete to authenticated using (dono = (select auth.uid()));
create policy "equipe altera projetos" on public.projects
  for update to authenticated using (public.eh_equipe()) with check (public.eh_equipe());
