// Cria (ou atualiza) um usuário da equipe de teste com papel `admin` e gera o código de acesso dele. Só desenvolvimento.
// O papel fica em app_metadata, que só o servidor consegue gravar. Uso: `npm run equipe:teste [e-mail] [papel]`.
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
);
const email = process.argv[2] ?? 'equipe.teste@example.com';
const papel = process.argv[3] ?? 'admin';
const chamar = (caminho, init = {}) =>
  fetch(`${env.PUBLIC_SUPABASE_URL}${caminho}`, {
    ...init,
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
  });

const link = await (await chamar('/auth/v1/admin/generate_link', { method: 'POST', body: JSON.stringify({ type: 'magiclink', email }) })).json();
if (!link.id || !link.email_otp) {
  console.error('Não deu para gerar o código:', link.msg ?? link.message);
  process.exit(1);
}
const r = await chamar(`/auth/v1/admin/users/${link.id}`, { method: 'PUT', body: JSON.stringify({ app_metadata: { papel } }) });
if (!r.ok) {
  console.error('Não deu para dar o papel de equipe:', r.status);
  process.exit(1);
}
console.log(`\n  Equipe (${papel}): ${email}\n  Código: ${link.email_otp}   (vale 15 minutos)\n  Entre em: http://localhost:4321/app/entrar/ e depois abra http://localhost:4321/admin/\n`);
