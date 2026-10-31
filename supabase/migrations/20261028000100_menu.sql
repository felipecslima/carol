-- Menu no topo da página (DEV-098): a creator liga ou desliga em Estilo. O nome e o "mostrar no menu" de cada seção
-- ficam dentro do JSON de `blocos`; aqui só o interruptor da página inteira. Ligado por padrão, inclusive para os
-- projetos que já existem.
alter table public.projects
  add column menu boolean not null default true;
