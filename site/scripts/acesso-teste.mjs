// Gera um código de acesso de 6 números para a conta de teste da Carol (vale 15 minutos). Não envia e-mail: é para
// desenvolvimento, enquanto o e-mail do login não tem SMTP próprio. Uso: `npm run acesso:teste [e-mail]`.
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
);
// conta de teste que fica (decisão de 31/out): a do usuário, também a dona do eu-carollimah no ar
const email = process.argv[2] ?? 'lfj182@gmail.com';
const r = await fetch(`${env.PUBLIC_SUPABASE_URL}/auth/v1/admin/generate_link`, {
  method: 'POST',
  headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'magiclink', email }),
});
const dados = await r.json();
if (!r.ok || !dados.email_otp) {
  console.error('Não deu para gerar o código:', dados.msg ?? dados.message ?? r.status);
  process.exit(1);
}
console.log(`\n  E-mail: ${email}\n  Código: ${dados.email_otp}   (vale 15 minutos)\n  Entre em: http://localhost:4321/app/entrar/?teste=${encodeURIComponent(email)}\n`);
