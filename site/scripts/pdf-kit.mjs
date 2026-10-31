// Gera de verdade o PDF do mídia kit de um portfólio no ar, pelo navegador da Cloudflare, e baixa (docs/05-pdf-midia-kit.md).
// Usa a ação "gerar_pdf" do admin com a conta de teste (lfj182@gmail.com, papel admin; outra: PDF_EMAIL=…). Precisa do servidor rodando (npx astro dev).
//   npm run equipe:teste                              → código da conta da equipe
//   npm run pdf:kit -- <código> [link] [endereço]     → padrão: eu-carollimah, http://localhost:4321
// Cada geração gasta tempo do plano grátis (10 min/dia); várias seguidas batem no limite por minuto (429).
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const [codigo, slug = 'eu-carollimah', base = 'http://localhost:4321'] = process.argv.slice(2);
if (!codigo) {
  console.error('Uso: npm run pdf:kit -- <código da equipe> [link] [endereço]');
  process.exit(1);
}

const navegador = await chromium.launch();
const pagina = await (await navegador.newContext()).newPage();
// `?teste=` abre direto na etapa do código (só em `astro dev`)
const email = process.env.PDF_EMAIL ?? 'lfj182@gmail.com';
await pagina.goto(`${base}/admin/entrar/?teste=${encodeURIComponent(email)}`);
await pagina.fill('#codigo', codigo);
await pagina.keyboard.press('Enter');
await pagina.waitForURL(/admin\/(?!entrar)/, { timeout: 20000 });
const token = await pagina.evaluate(() => {
  const chave = Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
  return JSON.parse(localStorage.getItem(chave)).access_token;
});
await navegador.close();

const inicio = Date.now();
const resposta = await fetch(`${base}/api/admin/acao`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ acao: 'gerar_pdf', slug }),
});
const corpo = await resposta.json();
if (!corpo.link) {
  console.error(`Não gerou (${resposta.status}): ${corpo.erro}`);
  process.exit(1);
}
const arquivo = Buffer.from(await (await fetch(corpo.link)).arrayBuffer());
const destino = `mk-${slug}.pdf`;
writeFileSync(destino, arquivo);
const paginas = (arquivo.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
console.log(`PDF em ${destino}: ${Math.round(arquivo.length / 1024)} KB, ${paginas} página(s), ${Date.now() - inicio} ms`);
console.log('Tempo por etapa (ms):', corpo.etapas);
