-- DEV-034: proteção por sessão e papel.
-- A equipe só lê direto do banco; toda alteração passa por /api/admin/acao (chave de serviço), que confere o papel
-- (assistente só vê) e grava no audit_log. As políticas abaixo deixavam qualquer papel da equipe, inclusive
-- assistente, gravar direto pela API do Supabase, sem conferência nem registro.
drop policy if exists "equipe altera projetos" on public.projects;
drop policy if exists "equipe altera pedidos" on public.orders;
drop policy if exists "equipe altera perfis" on public.profiles;
drop policy if exists "equipe libera premium" on public.premium_grants;
drop policy if exists "equipe muda premium" on public.premium_grants;
drop policy if exists "equipe tira premium" on public.premium_grants;

-- Estado, link e versão publicada só mudam pelo servidor, para todo mundo logado (antes a equipe era isenta e podia
-- pôr o próprio projeto no ar sem pagamento). A chave de serviço não roda como `authenticated`, então segue livre.
create or replace function public.proteger_colunas_do_projeto()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user = 'authenticated' then
    if (new.status, new.slug, new.publicado, new.publicado_em, new.prazo_edicao, new.dono)
       is distinct from (old.status, old.slug, old.publicado, old.publicado_em, old.prazo_edicao, old.dono) then
      raise exception 'Estado, link e versão publicada só podem ser alterados pelo servidor.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

-- search_path fixo: ninguém troca uma função por outra de mesmo nome num schema próprio
alter function public.papel_da_equipe() set search_path = '';
alter function public.eh_equipe() set search_path = '';
alter function public.atualizar_data() set search_path = '';

-- funções de trigger: não são para ser chamadas pela API
revoke execute on function public.criar_perfil_do_usuario() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
