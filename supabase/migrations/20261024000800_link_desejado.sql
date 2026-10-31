-- Link que a creator escolheu para publicar. O `slug` de verdade só o servidor grava (ao reservar/publicar);
-- este campo é o pedido dela, no mesmo formato, e pode ser mudado à vontade enquanto for rascunho.
alter table public.projects
  add column link_desejado text check (link_desejado ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$');
