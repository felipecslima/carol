-- Testes das regras de linha e de acesso (DEV-231). Roda tudo numa transação e desfaz no fim (rollback): cria duas
-- creators e uma assistente de mentira, tenta o que cada uma não pode e para no primeiro erro com a explicação.
-- Rodar no SQL Editor do Supabase (como postgres). Espera as migrações até `limites` aplicadas; antes da `protecao`,
-- o teste da assistente falha de propósito (é a brecha que ela fecha).
begin;

-- pessoas de teste (o trigger cria o perfil de cada uma)
insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('a0000000-0000-4000-8000-00000000000a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-a@teste.invalid', '{}', '{}', now(), now()),
  ('b0000000-0000-4000-8000-00000000000b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-b@teste.invalid', '{}', '{}', now(), now()),
  ('c0000000-0000-4000-8000-00000000000c', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-c@teste.invalid', '{"papel":"assistente"}', '{}', now(), now());
insert into public.profiles (id) values
  ('a0000000-0000-4000-8000-00000000000a'), ('b0000000-0000-4000-8000-00000000000b'), ('c0000000-0000-4000-8000-00000000000c')
  on conflict do nothing;
insert into public.projects (id, dono, tipo, modelo, paleta, fontes, cantos, clima, blocos, guardados) values
  ('a1000000-0000-4000-8000-00000000000a', 'a0000000-0000-4000-8000-00000000000a', 'site', 'nuvem', 0, 'par-nuvem', 'redondos', 'claro', '[]', '[]'),
  ('b1000000-0000-4000-8000-00000000000b', 'b0000000-0000-4000-8000-00000000000b', 'site', 'nuvem', 0, 'par-nuvem', 'redondos', 'claro', '[]', '[]');
insert into public.orders (projeto_id, dono, plano) values
  ('b1000000-0000-4000-8000-00000000000b', 'b0000000-0000-4000-8000-00000000000b', 'pdf');
insert into public.registros_de_acesso (conta, ip) values ('b0000000-0000-4000-8000-00000000000b', '200.0.0.1');

create temp table _passos (n serial, teste text);
grant all on _passos to authenticated, anon;
grant usage on sequence _passos_n_seq to authenticated, anon;

-- ===== creator A =====
set local role authenticated;
set local request.jwt.claims = '{"sub":"a0000000-0000-4000-8000-00000000000a","role":"authenticated","app_metadata":{}}';

do $$ begin
  if (select count(*) from public.projects where dono = 'b0000000-0000-4000-8000-00000000000b') <> 0 then
    raise exception 'FALHOU: A enxerga o projeto de B';
  end if;
  if (select count(*) from public.orders where dono = 'b0000000-0000-4000-8000-00000000000b') <> 0 then
    raise exception 'FALHOU: A enxerga o pedido de B';
  end if;
  if (select count(*) from public.profiles where id = 'b0000000-0000-4000-8000-00000000000b') <> 0 then
    raise exception 'FALHOU: A enxerga o perfil de B';
  end if;
  if (select count(*) from public.audit_log) <> 0 then raise exception 'FALHOU: A lê o registro de ações'; end if;
  insert into _passos (teste) values ('A só lê o que é dela');
end $$;

do $$ declare n int; begin
  update public.projects set blocos = '[1]' where id = 'b1000000-0000-4000-8000-00000000000b';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALHOU: A alterou o projeto de B'; end if;
  delete from public.projects where id = 'b1000000-0000-4000-8000-00000000000b';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALHOU: A apagou o projeto de B'; end if;
  insert into _passos (teste) values ('A não altera nem apaga o projeto de B');
end $$;

do $$ begin
  begin
    update public.projects set status = 'no_ar' where id = 'a1000000-0000-4000-8000-00000000000a';
    raise exception 'FALHOU: A pôs o próprio projeto no ar sem pagar';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.projects set slug = 'roubado' where id = 'a1000000-0000-4000-8000-00000000000a';
    raise exception 'FALHOU: A escolheu o link direto no banco';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.projects set dono = 'b0000000-0000-4000-8000-00000000000b' where id = 'a1000000-0000-4000-8000-00000000000a';
    raise exception 'FALHOU: A passou o projeto para B';
  exception when insufficient_privilege then null;
  end;
  insert into _passos (teste) values ('A não muda estado, link nem dono do próprio projeto');
end $$;

do $$ begin
  begin
    insert into public.projects (dono, tipo, modelo, paleta, fontes, cantos, clima, blocos, guardados, status)
    values ('a0000000-0000-4000-8000-00000000000a', 'midia-kit', 'nuvem', 0, 'par-nuvem', 'redondos', 'claro', '[]', '[]', 'no_ar');
    raise exception 'FALHOU: A criou projeto já no ar';
  exception when insufficient_privilege or check_violation then null;
  end;
  begin
    insert into public.orders (projeto_id, dono, plano, status)
    values ('a1000000-0000-4000-8000-00000000000a', 'a0000000-0000-4000-8000-00000000000a', 'pdf', 'pago');
    raise exception 'FALHOU: A criou um pedido pago';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.premium_grants (creator, molde) values ('a0000000-0000-4000-8000-00000000000a', 'site');
    raise exception 'FALHOU: A se deu Premium';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.brand_links (codigo, nome_marca, projeto_id, dono)
    values ('rlsxyz', 'Marca', 'b1000000-0000-4000-8000-00000000000b', 'a0000000-0000-4000-8000-00000000000a');
    raise exception 'FALHOU: A criou link de marca para o projeto de B';
  exception when insufficient_privilege then null;
  end;
  insert into _passos (teste) values ('A não cria projeto no ar, pedido pago, Premium nem link no projeto de B');
end $$;

-- registros de acesso (Marco Civil, DEV-243): só o servidor lê e grava
do $$ begin
  begin
    perform count(*) from public.registros_de_acesso;
    raise exception 'FALHOU: creator lê os registros de acesso';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.registros_de_acesso (conta, ip) values ('a0000000-0000-4000-8000-00000000000a', '1.1.1.1');
    raise exception 'FALHOU: creator grava registro de acesso direto';
  exception when insufficient_privilege then null;
  end;
  insert into _passos (teste) values ('creator não lê nem grava registros de acesso');
end $$;

-- ===== assistente da equipe: lê tudo, não grava nada direto (só pelo servidor, com registro) =====
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"c0000000-0000-4000-8000-00000000000c","role":"authenticated","app_metadata":{"papel":"assistente"}}';

do $$ declare n int; begin
  if (select count(*) from public.projects where dono in ('a0000000-0000-4000-8000-00000000000a', 'b0000000-0000-4000-8000-00000000000b')) <> 2 then
    raise exception 'FALHOU: a equipe não enxerga os projetos';
  end if;
  update public.projects set blocos = '[1]' where id = 'a1000000-0000-4000-8000-00000000000a';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALHOU: a assistente alterou um projeto direto no banco (aplique a migração protecao)'; end if;
  update public.orders set status = 'pago' where dono = 'b0000000-0000-4000-8000-00000000000b';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALHOU: a assistente marcou um pedido como pago direto no banco'; end if;
  update public.orders set status = 'reembolsado' where dono = 'b0000000-0000-4000-8000-00000000000b';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALHOU: a assistente marcou um pedido como reembolsado direto no banco'; end if;
  begin
    perform count(*) from public.registros_de_acesso;
    raise exception 'FALHOU: a equipe lê os registros de acesso pelo app';
  exception when insufficient_privilege then null;
  end;
  insert into _passos (teste) values ('assistente lê tudo, não grava direto (nem reembolsado) e não lê registros de acesso');
end $$;

-- ===== sem conta =====
reset role;
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';

-- sem conta: zero linhas ou nem permissão de ler a tabela (as duas respostas protegem)
do $$ declare t text; n int; begin
  foreach t in array array['projects', 'profiles', 'orders', 'media', 'brand_links', 'registros_de_acesso'] loop
    begin
      execute format('select count(*) from public.%I', t) into n;
      if n <> 0 then raise exception 'FALHOU: sem conta enxerga %', t; end if;
    exception when insufficient_privilege then null;
    end;
  end loop;
  insert into _passos (teste) values ('sem conta não enxerga nada (inclusive registros de acesso)');
end $$;

reset role;
select n, teste as passou from _passos order by n;
rollback;
