-- Permissões de tabela. No Supabase atual, tabelas novas em `public` NÃO ficam acessíveis ao papel `authenticated`
-- por padrão: sem estes GRANTs a API recusa tudo, mesmo com as políticas de RLS certas. Aqui vai só o mínimo que cada
-- tabela precisa; a RLS decide quais linhas. `anon` não recebe nada (nada no produto é público sem passar pelo servidor).

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, delete on public.media to authenticated;
grant select, update on public.orders to authenticated;
grant select, insert, update, delete on public.premium_grants to authenticated;
grant select, insert, delete on public.brand_links to authenticated;
grant select on public.brand_opens to authenticated;
grant select, insert on public.events to authenticated;
grant select on public.audit_log to authenticated;
grant select on public.waitlist to authenticated;

-- o servidor (service role) faz o resto: pedidos, aberturas de link, auditoria, lista de espera
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
