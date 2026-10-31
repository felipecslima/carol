// Roteiro de verificação das migrations e da RLS (DEV-019) num Postgres local em WebAssembly (PGlite), com um stub do
// schema auth do Supabase. Ainda NÃO está ligado a nenhum comando do npm: vira o teste automatizado na rodada de testes
// (docs/TESTES-PENDENTES.md). Para rodar: instalar @electric-sql/pglite e executar com node.
// Dois itens da lista são falhas conhecidas do roteiro, não do banco: "A não escolhe link já usado" (A é dona do projeto
// que já tem esse link, então não muda nada) e "anônimo não lê projetos" (o stub só dá permissão ao papel authenticated;
// no Supabase o anon tem permissão e a RLS devolve zero linhas). Trocar o caminho de 'dir' se o repositório mudar de lugar.
import { PGlite } from '@electric-sql/pglite';
import { readdirSync, readFileSync } from 'node:fs';
const dir = new URL('../migrations/', import.meta.url).pathname;
const db = new PGlite();
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
  grant usage on schema auth, public to anon, authenticated, service_role;
  grant execute on all functions in schema auth to anon, authenticated, service_role;
`);
for (const f of readdirSync(dir).filter(f=>f.endsWith('.sql')).sort()) { try { await db.exec(readFileSync(dir+f,'utf8')); console.log('ok  ', f); } catch (e) { console.log('ERRO', f, e.message); process.exit(1); } }
await db.exec(`grant select, insert, update, delete on all tables in schema public to authenticated; grant usage on all sequences in schema public to authenticated;`);

const A = (await db.query(`insert into auth.users (email) values ('a@x.com') returning id`)).rows[0].id;
const B = (await db.query(`insert into auth.users (email) values ('b@x.com') returning id`)).rows[0].id;
const E = (await db.query(`insert into auth.users (email) values ('equipe@x.com') returning id`)).rows[0].id;
console.log('perfis criados pelo gatilho:', (await db.query('select count(*)::int n from public.profiles')).rows[0].n);

async function como(id, papel, fn) {
  const claims = JSON.stringify({ sub: id, role: 'authenticated', app_metadata: papel ? { papel } : {} });
  await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub','${id}',false), set_config('request.jwt.claims','${claims}',false);`);
  try { return await fn(); } finally { await db.exec('reset role'); }
}
const tenta = async (nome, fn, esperaErro) => { try { const r = await fn(); console.log(esperaErro ? 'FALHOU (devia dar erro)' : 'ok  ', nome, r ?? ''); } catch (e) { console.log(esperaErro ? 'ok  ' : 'FALHOU', nome, '→', e.message.slice(0,70)); } };
const proj = (dono, tipo='site') => `insert into public.projects (dono,tipo,modelo,fontes,cantos) values ('${dono}','${tipo}','nuvem','par-nuvem','redondos') returning id`;

let pa, pb;
await como(A, null, async () => { pa = (await db.query(proj(A))).rows[0].id; });
await como(B, null, async () => { pb = (await db.query(proj(B))).rows[0].id; });
await como(A, null, async () => {
  await tenta('A le só os próprios projetos', async () => { const n=(await db.query('select count(*)::int n from public.projects')).rows[0].n; if (n!==1) throw new Error('viu '+n); return n; });
  await tenta('A não lê o projeto de B por id', async () => { const n=(await db.query(`select count(*)::int n from public.projects where id='${pb}'`)).rows[0].n; if (n!==0) throw new Error('vazou'); return n; });
  await tenta('A não altera o projeto de B', async () => { const r=await db.query(`update public.projects set modelo='x' where id='${pb}'`); if (r.affectedRows!==0) throw new Error('alterou'); return r.affectedRows; });
  await tenta('A não cria projeto no nome de B', () => db.query(proj(B,'midia-kit')), true);
  await tenta('A não cria projeto já "no ar"', () => db.query(`insert into public.projects (dono,tipo,modelo,fontes,cantos,status) values ('${A}','midia-kit','nuvem','p','suaves','no_ar')`), true);
  await tenta('A edita o conteúdo do próprio projeto', async () => (await db.query(`update public.projects set clima='escuro' where id='${pa}'`)).affectedRows);
  await tenta('A não muda o status do próprio projeto', () => db.query(`update public.projects set status='no_ar' where id='${pa}'`), true);
  await tenta('A não escolhe o próprio link', () => db.query(`update public.projects set slug='joana' where id='${pa}'`), true);
  await tenta('A não passa o projeto para B', () => db.query(`update public.projects set dono='${B}' where id='${pa}'`), true);
  await tenta('não duplica o mesmo tipo', () => db.query(proj(A)), true);
  await tenta('A não lê o perfil de B', async () => { const n=(await db.query(`select count(*)::int n from public.profiles where id='${B}'`)).rows[0].n; if (n!==0) throw new Error('vazou'); return n; });
  await tenta('A altera o próprio perfil', async () => (await db.query(`update public.profiles set nome='Joana' where id='${A}'`)).affectedRows);
  await tenta('A não altera o perfil de B', async () => { const r=await db.query(`update public.profiles set nome='hack' where id='${B}'`); if (r.affectedRows!==0) throw new Error('alterou'); return r.affectedRows; });
  await tenta('A não cria pedido', () => db.query(`insert into public.orders (projeto_id,dono,plano) values ('${pa}','${A}','pdf')`), true);
  await tenta('A não libera Premium para si', () => db.query(`insert into public.premium_grants (creator,molde) values ('${A}','site')`), true);
  await tenta('A não lê a auditoria', async () => (await db.query('select count(*)::int n from public.audit_log')).rows[0].n);
  await tenta('A não lê a lista de espera', async () => (await db.query('select count(*)::int n from public.waitlist')).rows[0].n);
  await tenta('A registra a própria mídia', async () => (await db.query(`insert into public.media (dono,tipo,public_id,url,capa) values ('${A}','image','a','u','c')`)).affectedRows);
  await tenta('A não registra mídia no nome de B', () => db.query(`insert into public.media (dono,tipo,public_id,url,capa) values ('${B}','image','b','u','c')`), true);
  await tenta('A cria link para marca do próprio projeto', async () => (await db.query(`insert into public.brand_links (codigo,nome_marca,projeto_id,dono) values ('abcd12','Marca','${pa}','${A}')`)).affectedRows);
  await tenta('A não cria link para projeto de B', () => db.query(`insert into public.brand_links (codigo,nome_marca,projeto_id,dono) values ('zzzz99','Marca','${pb}','${A}')`), true);
  await tenta('A não grava aberturas', () => db.query(`insert into public.brand_opens (link_id) select id from public.brand_links`), true);
  await tenta('A registra evento próprio', async () => (await db.query(`insert into public.events (dono,nome) values ('${A}','bloco_adicionado')`)).affectedRows);
  await tenta('A não lê eventos', async () => (await db.query('select count(*)::int n from public.events')).rows[0].n);
});
await como(E, 'operacao', async () => {
  await tenta('equipe lê todos os projetos', async () => { const n=(await db.query('select count(*)::int n from public.projects')).rows[0].n; if (n!==2) throw new Error('viu '+n); return n; });
  await tenta('equipe muda status e link', async () => (await db.query(`update public.projects set status='no_ar', slug='joana' where id='${pa}'`)).affectedRows);
  await tenta('equipe libera Premium', async () => (await db.query(`insert into public.premium_grants (creator,molde,motivo) values ('${A}','site','teste')`)).affectedRows);
  await tenta('equipe lê eventos', async () => (await db.query('select count(*)::int n from public.events')).rows[0].n);
});
await como(A, null, async () => {
  await tenta('A vê o próprio Premium', async () => (await db.query('select count(*)::int n from public.premium_grants')).rows[0].n);
  await tenta('A não escolhe link já usado', () => db.query(`update public.projects set slug='joana' where id='${pa}'`), true);
});
await db.exec(`reset role; set role anon;`);
await tenta('anônimo não lê projetos', async () => (await db.query('select count(*)::int n from public.projects')).rows[0].n);
