// Gera as imagens da página /portfolio-creator/ a partir do editor de verdade (modo Ver, o que a marca vê): a vitrine
// de seções, as imagens do topo (o celular e as capas clara e escura) e a prévia de link. O conteúdo é o portfólio real da Carol, da conta de teste
// preenchida por `npm run seed:carol` só com dados do site dela; o projeto é só lido do banco e entra como rascunho
// no navegador (nada é gravado). Substitui as capas dos modelos, que deixaram de existir (DEV-096/097).
// Uso: com o servidor de desenvolvimento no ar (`npm run dev`), `node scripts/portfolio-creator-secoes.mjs [url]`.
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = fileURLToPath(new URL('../public/media/pc/', import.meta.url));
mkdirSync(out, { recursive: true });

// mesmos arquivos usados em src/data/portfolio-creator.ts (SECOES) e no topo de src/views/PortfolioCreator.astro;
// uma cor só (a da Carol) e um cartão na página escura, para mostrar a opção sem brigar com a página
const SECOES = [
  { arquivo: 'secao-capa', bloco: 'capa', clima: 'claro' },
  { arquivo: 'secao-videos', bloco: 'videos', clima: 'claro' },
  { arquivo: 'secao-numeros', bloco: 'numeros', clima: 'claro' },
  { arquivo: 'secao-publico', bloco: 'publico', clima: 'escuro' },
  { arquivo: 'secao-marcas', bloco: 'marcas', clima: 'claro' },
  { arquivo: 'secao-formatos', bloco: 'formatos', clima: 'claro' },
];
const TOPO = [
  // as duas imagens pequenas ao lado do celular (que já mostra a capa): outras partes da página, clara e escura
  { arquivo: 'exemplo-claro', bloco: 'videos', clima: 'claro' },
  { arquivo: 'exemplo-escuro', bloco: 'numeros', clima: 'escuro' },
];

// proporção do cartão da página: 480 × 549; a imagem sai com 780 px de largura (o dobro dos 390 px da tela), para
// ficar nítida no cartão de 375 px do desktop em tela retina
const LARGURA = 390;
const ALTURA = Math.round((LARGURA * 549) / 480);
const SAIDA = { width: LARGURA * 2, height: Math.round((LARGURA * 2 * 549) / 480) };

// ---- o projeto da Carol (conta de teste), só leitura ----
const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
);
const cabecalho = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` };
const ler = async (caminho) => {
  const r = await fetch(env.PUBLIC_SUPABASE_URL + caminho, { headers: cabecalho });
  if (!r.ok) throw new Error(`${caminho} → ${r.status}`);
  return r.json();
};
const EMAIL = process.env.SEED_EMAIL ?? 'carol.limah.teste@example.com';
const usuario = (await ler('/auth/v1/admin/users?per_page=200')).users.find((u) => u.email === EMAIL);
const linha = usuario && (await ler(`/rest/v1/projects?dono=eq.${usuario.id}&tipo=eq.site&select=*`))[0];
if (!linha) {
  console.error(`Sem projeto para ${EMAIL}. Rode antes: npm run seed:carol <foto>`);
  process.exit(1);
}
// mesmo mapeamento de carregarDaNuvem (src/app/nuvem.ts)
const projeto = {
  tipo: linha.tipo,
  modelo: linha.modelo,
  paleta: linha.paleta,
  ...(linha.cor_propria ? { corPropria: linha.cor_propria } : {}),
  fontes: linha.fontes,
  cantos: linha.cantos,
  clima: linha.clima,
  modoIniciante: linha.modo_iniciante,
  ...(linha.link_desejado ? { link: linha.link_desejado } : {}),
  ...(linha.numeros ? { numeros: linha.numeros } : {}),
  blocos: linha.blocos,
  guardados: linha.guardados,
};

const navegador = await chromium.launch();

/** Abre o modo Ver do editor com o projeto da Carol como rascunho do aparelho, no clima pedido. */
async function abrirVer(clima) {
  const ctx = await navegador.newContext({
    viewport: { width: LARGURA, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.addInitScript((p) => {
    localStorage.setItem('pc:dica-toque', '1');
    localStorage.setItem('pc:rascunho:v1', JSON.stringify(p));
  }, { ...projeto, clima });
  await page.goto(`${base}/app/editor/?ver=1`);
  await page.waitForSelector('.ed-ver section.bl');
  // o botão "Voltar a editar" não entra na foto
  await page.addStyleTag({ content: '.ed-sair-ver { display: none !important; }' });
  return { ctx, page };
}

/** Espera as imagens visíveis (foto e capas dos vídeos, no Cloudinary) terminarem de carregar. */
const imagensProntas = (page) =>
  page.evaluate(() =>
    Promise.all(
      [...document.images]
        .filter((i) => i.getBoundingClientRect().top < innerHeight)
        .map((i) => (i.complete ? null : new Promise((ok) => ((i.onload = ok), (i.onerror = ok))))),
    ),
  );

async function salvar(png, arquivo) {
  await sharp(png).resize({ ...SAIDA, fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(join(out, `${arquivo}.webp`));
  console.log(`${arquivo}.webp`);
}

for (const s of [...SECOES, ...TOPO]) {
  const { ctx, page } = await abrirVer(s.clima);
  const secao = page.locator(`.ed-ver section.bl-${s.bloco}`);
  await page.evaluate((b) => document.querySelector(`.ed-ver section.bl-${b}`)?.scrollIntoView({ block: 'start' }), s.bloco);
  await page.waitForTimeout(900); // a seção entra na tela e aparece (com movimento reduzido, sem animação)
  await imagensProntas(page);
  const caixa = await secao.boundingBox();
  // sempre a altura inteira do cartão a partir do topo da seção (seção mais baixa mostra o começo da seguinte, sem
  // ampliar nem cortar as laterais)
  const png = await page.screenshot({ clip: { x: 0, y: caixa.y, width: LARGURA, height: ALTURA } });
  await salvar(png, s.arquivo);
  await ctx.close();
}

// celular grande do topo: a página dela inteira de cima, como num iPhone (390 × 800, imagem de 624 × 1280)
{
  const { ctx, page } = await abrirVer('claro');
  await page.setViewportSize({ width: LARGURA, height: 800 });
  await page.waitForTimeout(900);
  await imagensProntas(page);
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: LARGURA, height: 800 } });
  await sharp(png).resize({ width: 624 }).webp({ quality: 82 }).toFile(join(out, 'portfolio-carol.webp'));
  console.log('portfolio-carol.webp');
  await ctx.close();
}

// prévia de link (WhatsApp/Instagram) da página, 1200×630, com o título do topo e o celular da Carol
const celular = readFileSync(join(out, 'portfolio-carol.webp')).toString('base64');
const og = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(
  `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@500;600&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #24130F; color: #FBF4EC; display: flex; align-items: center; padding: 0 64px 0 72px; gap: 56px; }
  .text { flex: 1; }
  .logo { font-family: 'Instrument Serif', serif; font-size: 30px; letter-spacing: -0.01em; }
  i, em { color: #FF8FB0; }
  h1 { margin: 34px 0 30px; font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 76px; line-height: 0.96; letter-spacing: -0.02em; text-wrap: balance; }
  p { font-family: 'Hanken Grotesk', sans-serif; font-weight: 500; font-size: 22px; line-height: 1.45; color: #D2BFB6; max-width: 560px; }
  .cta { display: inline-flex; align-items: center; margin-top: 34px; padding: 15px 26px; border-radius: 999px; background: #D42A5B; color: #fff; font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 20px; }
  .art { width: 280px; flex: none; margin-right: 24px; }
  .phone { background: #2D1A14; padding: 8px; border-radius: 34px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45); transform: rotate(3deg); }
  .phone img { display: block; width: 100%; border-radius: 27px; }
</style></head><body>
  <div class="text">
    <div class="logo">Portfólio <i>Creator</i></div>
    <h1>Seu primeiro portfólio de <em>creator.</em></h1>
    <p>Mesmo com zero publi. Seções prontas, PDF e link próprio, por Carol Limah.</p>
    <div class="cta">Testar grátis</div>
  </div>
  <div class="art"><div class="phone"><img src="data:image/webp;base64,${celular}" alt=""></div></div>
</body></html>`,
  { waitUntil: 'networkidle' },
);
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: fileURLToPath(new URL('../public/og-portfolio-creator.jpg', import.meta.url)), type: 'jpeg', quality: 88 });
console.log('og-portfolio-creator.jpg');

await navegador.close();
