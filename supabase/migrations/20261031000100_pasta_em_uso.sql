-- Trava da exclusão definitiva (31/out). A rotina diária apaga a pasta `creators/<id>/` do Cloudinary de quem pediu a
-- exclusão. Em 31/out uma pasta assim tinha arquivos que outra conta usava (mídias passadas de uma conta para outra sem
-- mover os arquivos) e eles se perderam. Antes de apagar, a rotina pergunta se alguma mídia ou projeto de OUTRA conta
-- cita a pasta; se sim, não apaga nada daquela conta e registra o bloqueio para a equipe resolver.
-- Só o servidor (service_role) chama.

create or replace function public.pasta_em_uso_por_outros(p_dono uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
      select 1 from public.media m
      where m.dono <> p_dono
        and (m.public_id like 'creators/' || p_dono::text || '/%'
             or m.url like '%creators/' || p_dono::text || '/%'
             or coalesce(m.capa, '') like '%creators/' || p_dono::text || '/%')
    )
    or exists (
      select 1 from public.projects p
      where p.dono <> p_dono
        and (p.blocos::text like '%creators/' || p_dono::text || '/%'
             or coalesce(p.publicado::text, '') like '%creators/' || p_dono::text || '/%'
             or coalesce(p.guardados::text, '') like '%creators/' || p_dono::text || '/%')
    );
$$;

revoke all on function public.pasta_em_uso_por_outros(uuid) from public, anon, authenticated;
grant execute on function public.pasta_em_uso_por_outros(uuid) to service_role;
