// Gera as imagens da página /portfolio-creator/ a partir do protótipo do handoff (portfolio-creator-handoff.zip):
// o portfólio no modo iniciante (dentro do celular), a prévia de link e as fotos da Carol. As imagens das seções e do
// exemplo vêm do editor de verdade: scripts/portfolio-creator-secoes.mjs (os modelos deixaram de existir, DEV-096).
// Uso: node scripts/portfolio-creator-shots.mjs <pasta portfolio-creator-handoff descompactada>
// Os .dc.html do protótipo dependem do support.js do canvas de design, que não vem no pacote; aqui o
// renderVals() de cada tela roda no Node e os {{valores}} e <sc-for> são preenchidos antes de abrir no Chromium.
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const src = process.argv[2];
if (!src) {
  console.error('Uso: node scripts/portfolio-creator-shots.mjs <pasta portfolio-creator-handoff>');
  process.exit(1);
}
const out = fileURLToPath(new URL('../public/media/pc/', import.meta.url));
mkdirSync(out, { recursive: true });


const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);
const fill = (html, vals) => html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, p) => {
  const v = get(vals, p);
  if (v === undefined) throw new Error(`valor sem dado: {{${p}}}`);
  return String(v);
});

/** .dc.html → HTML comum, com a paleta padrão */
function render(file) {
  const raw = readFileSync(join(src, 'prototipo', file), 'utf8');
  const script = raw.match(/<script type="text\/x-dc"[^>]*data-props='([^']*)'[^>]*>([\s\S]*?)<\/script>/);
  const props = Object.fromEntries(Object.entries(JSON.parse(script[1])).filter(([k, v]) => !k.startsWith('$') && 'default' in v).map(([k, v]) => [k, v.default]));
  class DCLogic { constructor(p) { this.props = p; } }
  const Component = new Function('DCLogic', `${script[2]}; return Component;`)(DCLogic);
  const vals = new Component(props).renderVals();
  let body = raw.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1].replace(/<\/?helmet>/g, '');
  body = body.replace(/<sc-for list="\{\{([\w.]+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (_, list, as, inner) =>
    get(vals, list).map((item) => fill(inner, { ...vals, [as]: item })).join(''));
  if (body.includes('<sc-')) throw new Error(`${file}: sobrou marcação do protótipo`);
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"></head><body>${fill(body, vals)}</body></html>`;
}

const browser = await chromium.launch();
async function shot(file, { width, height, scale, name, outWidth }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.setContent(render(file), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ clip: { x: 0, y: 0, width, height } });
  await page.close();
  await sharp(png).resize({ width: outWidth }).webp({ quality: 82 }).toFile(join(out, name));
  console.log(`gravada ${name}`);
}

// celular no modo iniciante: a tela tem 390 px, como num iPhone
await shot('PortfolioIniciante.dc.html', { width: 390, height: 800, scale: 2, name: 'portfolio-iniciante.webp', outWidth: 624 });

// prévia de link (WhatsApp/Instagram) da página, 1200×630, com o título do hero e o celular do modo iniciante
const phone = readFileSync(join(out, 'portfolio-iniciante.webp')).toString('base64');
const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(`<!doctype html><html><head><meta charset="utf-8">
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
  <div class="art"><div class="phone"><img src="data:image/webp;base64,${phone}" alt=""></div></div>
</body></html>`, { waitUntil: 'networkidle' });
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: fileURLToPath(new URL('../public/og-portfolio-creator.jpg', import.meta.url)), type: 'jpeg', quality: 88 });
console.log('gravada og-portfolio-creator.jpg');
await browser.close();

// fotos da Carol: retrato 4:5 da seção "Oi, eu sou a Carol" e miniatura redonda do topo
await sharp(join(src, 'marca/fotos/carol-retrato.jpg')).resize({ width: 720 }).webp({ quality: 80 }).toFile(join(out, 'carol-retrato.webp'));
await sharp(join(src, 'marca/fotos/carol-rosto.jpg')).resize({ width: 96 }).webp({ quality: 80 }).toFile(join(out, 'carol-rosto.webp'));
console.log('gravadas carol-retrato.webp e carol-rosto.webp');
