-- Exclusão de conta (LGPD): a creator pede, a conta fica desativada por 7 dias (projetos no ar saem do ar) e pode
-- voltar atrás entrando de novo; depois disso uma rotina diária apaga o usuário, e o `on delete cascade` leva perfil,
-- projetos, mídias, pedidos e links. Os arquivos no Cloudinary são apagados por uma rotina do servidor (pendente).

alter table public.profiles add column exclusao_pedida_em timestamptz;

create or replace function public.pedir_exclusao_da_conta()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para pedir a exclusão.' using errcode = '42501';
  end if;
  update public.profiles set exclusao_pedida_em = now() where id = auth.uid();
  update public.projects set status = 'fora_do_ar' where dono = auth.uid() and status = 'no_ar';
end;
$$;

create or replace function public.cancelar_exclusao_da_conta()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para cancelar a exclusão.' using errcode = '42501';
  end if;
  update public.profiles set exclusao_pedida_em = null where id = auth.uid();
end;
$$;

revoke execute on function public.pedir_exclusao_da_conta() from public, anon;
revoke execute on function public.cancelar_exclusao_da_conta() from public, anon;
grant execute on function public.pedir_exclusao_da_conta() to authenticated;
grant execute on function public.cancelar_exclusao_da_conta() to authenticated;

create extension if not exists pg_cron with schema pg_catalog;

-- todo dia às 03:17 UTC: apaga as contas cujo prazo de 7 dias acabou
select cron.schedule(
  'excluir-contas-pedidas',
  '17 3 * * *',
  $$ delete from auth.users where id in (select id from public.profiles where exclusao_pedida_em < now() - interval '7 days') $$
);
