// Gera as imagens da página /portfolio-creator/ a partir do protótipo do handoff (portfolio-creator-handoff.zip):
// o portfólio no modo iniciante (dentro do celular) e as fotos da Carol. As imagens das seções e do
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

// a prévia de link (og-portfolio-creator.jpg) sai de scripts/portfolio-creator-secoes.mjs, com o celular da Carol
await browser.close();

// fotos da Carol: retrato 4:5 da seção "Oi, eu sou a Carol" e miniatura redonda do topo
await sharp(join(src, 'marca/fotos/carol-retrato.jpg')).resize({ width: 720 }).webp({ quality: 80 }).toFile(join(out, 'carol-retrato.webp'));
await sharp(join(src, 'marca/fotos/carol-rosto.jpg')).resize({ width: 96 }).webp({ quality: 80 }).toFile(join(out, 'carol-rosto.webp'));
console.log('gravadas carol-retrato.webp e carol-rosto.webp');
