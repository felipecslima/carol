// Gera public/carol-limah-media-kit.pdf (e -en.pdf, -es.pdf) a partir de /media-kit/, /en/media-kit/ e /es/media-kit/
// (rode depois do build: `npm run pdf`).
// Serve o dist/ com um servidor estático próprio: o `astro preview` do Astro 7 vira daemon e não encerra junto.
import { copyFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
// mesmo nome de i18n/index.ts (mediaKitPdf)
const KITS = [
  { path: '/media-kit/', file: 'carol-limah-media-kit.pdf' },
  { path: '/en/media-kit/', file: 'carol-limah-media-kit-en.pdf' },
  { path: '/es/media-kit/', file: 'carol-limah-media-kit-es.pdf' },
];
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(dist, path));
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const { path, file } of KITS) {
    const out = join(publicDir, file);
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    copyFileSync(out, join(dist, file));
    console.log(`PDF gravado em ${out}`);
  }
  await browser.close();
} finally {
  server.close();
}
