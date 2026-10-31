-- DEV-234: limites por conta que valem mesmo para quem grava direto pela API do Supabase (o app grava links de marca
-- e mídias com a chave pública). Os números são os de src/lib/limites.ts.

create or replace function public.limitar_links_de_marca()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.brand_links where dono = new.dono and criado_em > now() - interval '1 day') >= 50 then
    raise exception 'Você criou muitos links hoje. Tente de novo amanhã.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists brand_links_limite on public.brand_links;
create trigger brand_links_limite before insert on public.brand_links
  for each row execute function public.limitar_links_de_marca();

create or replace function public.limitar_midias()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.media where dono = new.dono) >= 300 then
    raise exception 'Sua biblioteca chegou ao limite de 300 arquivos.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists media_limite on public.media;
create trigger media_limite before insert on public.media
  for each row execute function public.limitar_midias();

revoke execute on function public.limitar_links_de_marca() from public, anon, authenticated;
revoke execute on function public.limitar_midias() from public, anon, authenticated;
