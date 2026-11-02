-- Permissões da tabela registros_de_acesso para o servidor. O `grant all ... to service_role` da migração `grants`
-- só alcançou as tabelas que já existiam; tabela nova em `public` não recebe permissão sozinha neste projeto.
-- O servidor grava (/api/acesso) e apaga os vencidos (/api/interno/limpeza); ninguém mais tem acesso.
grant select, insert, delete on public.registros_de_acesso to service_role;
grant usage, select on sequence public.registros_de_acesso_id_seq to service_role;
