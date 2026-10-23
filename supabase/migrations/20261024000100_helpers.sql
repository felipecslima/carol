-- Funções de apoio. O papel da equipe (admin, operacao, assistente) fica em app_metadata do usuário no Supabase
-- Auth: só o servidor (service role) consegue gravar app_metadata, então a creator não consegue se promover.

create or replace function public.papel_da_equipe()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'papel', '')
$$;

create or replace function public.eh_equipe()
returns boolean
language sql
stable
as $$
  select public.papel_da_equipe() in ('admin', 'operacao', 'assistente')
$$;

create or replace function public.atualizar_data()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;
