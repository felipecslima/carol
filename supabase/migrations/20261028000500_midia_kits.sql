-- DEV-151: PDFs do mídia kit gerados no servidor. Bucket privado; só o servidor (chave de serviço) grava, e a creator
-- baixa por link assinado pedido em /api/pdf/link. Um arquivo por projeto: <id do projeto>.pdf.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('midia-kits', 'midia-kits', false, 20971520, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 20971520, allowed_mime_types = array['application/pdf'];
