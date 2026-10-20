// Gera public/og.jpg (1200×630, prévia de link no WhatsApp/Instagram) com o mesmo título do hero.
// Rode de novo sempre que o título mudar: `npm run og`. A foto vem de scripts/og-photo.png.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const photo = readFileSync(fileURLToPath(new URL('./og-photo.png', import.meta.url))).toString('base64');
const out = fileURLToPath(new URL('../public/og.jpg', import.meta.url));

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@500&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #16110d; color: #f1e9de; display: flex; align-items: center; padding: 0 64px 0 72px; gap: 56px; }
  .text { flex: 1; }
  .logo { font-family: 'Instrument Serif', serif; font-size: 30px; letter-spacing: -0.01em; }
  i, em { color: oklch(0.8 0.11 65); }
  h1 { margin: 34px 0 30px; font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 60px; line-height: 1; letter-spacing: -0.02em; text-wrap: balance; }
  p { font-family: 'Hanken Grotesk', sans-serif; font-weight: 500; font-size: 19px; color: #cbbfb1; }
  img { width: 400px; height: 520px; border-radius: 22px; object-fit: cover; }
</style></head><body>
  <div class="text">
    <div class="logo">Carol <i>Limah</i></div>
    <h1>Uma amazonense morando em São&nbsp;Paulo te levando em <em>lugares incríveis.</em></h1>
    <p>Viagem · Gastronomia · Hospedagem &nbsp;—&nbsp; @eu.carollimah</p>
  </div>
  <img src="data:image/png;base64,${photo}" alt="">
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
await browser.close();
console.log(`OG gravada em ${out}`);
