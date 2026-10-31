-- DEV-203: exclusão definitiva na ordem certa (Cloudinary, Storage, banco, Auth), feita pelo servidor
-- (src/server/exclusao.ts, chamado todo dia pelo cron do Worker). A rotina antiga do pg_cron apagava direto o usuário
-- do Auth: os arquivos no Cloudinary ficavam para trás e o cascade levava junto os pedidos.

select cron.unschedule('excluir-contas-pedidas')
where exists (select 1 from cron.job where jobname = 'excluir-contas-pedidas');

-- o registro de pagamentos fica (obrigação fiscal), sem ligação com a pessoa nem com o projeto apagados
alter table public.orders alter column dono drop not null;
alter table public.orders alter column projeto_id drop not null;
alter table public.orders drop constraint if exists orders_dono_fkey;
alter table public.orders drop constraint if exists orders_projeto_id_fkey;
alter table public.orders
  add constraint orders_dono_fkey foreign key (dono) references public.profiles (id) on delete set null;
alter table public.orders
  add constraint orders_projeto_id_fkey foreign key (projeto_id) references public.projects (id) on delete set null;
