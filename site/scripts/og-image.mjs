// Gera public/og.jpg, og-en.jpg e og-es.jpg (1200×630, prévia de link no WhatsApp/Instagram) com o mesmo título
// do hero em cada idioma (heroH1 em src/i18n/ui.ts). Rode de novo sempre que o título mudar: `npm run og`.
// A foto vem de scripts/og-photo.png.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const photo = readFileSync(fileURLToPath(new URL('./og-photo.png', import.meta.url))).toString('base64');
// mesmo nome usado no SeoHead
const OG = [
  {
    file: 'og.jpg',
    title: 'Uma amazonense morando em São&nbsp;Paulo te levando em <em>lugares incríveis.</em>',
    topics: 'Viagem · Gastronomia · Hospedagem',
    cta: 'Portfólio e media kit',
  },
  {
    file: 'og-en.jpg',
    title: 'A girl from the Amazon living in São&nbsp;Paulo, taking you to <em>incredible places.</em>',
    topics: 'Travel · Food · Stays',
    cta: 'Portfolio and media kit',
  },
  {
    file: 'og-es.jpg',
    title: 'Una amazonense viviendo en São&nbsp;Paulo que te lleva a <em>lugares increíbles.</em>',
    topics: 'Viajes · Gastronomía · Hospedaje',
    cta: 'Portafolio y media kit',
  },
];

const html = ({ title, topics, cta }) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@500;600&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #16110d; color: #f1e9de; display: flex; align-items: center; padding: 0 64px 0 72px; gap: 56px; }
  .text { flex: 1; }
  .logo { font-family: 'Instrument Serif', serif; font-size: 30px; letter-spacing: -0.01em; }
  i, em { color: oklch(0.8 0.11 65); }
  h1 { margin: 34px 0 30px; font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 60px; line-height: 1; letter-spacing: -0.02em; text-wrap: balance; }
  p { font-family: 'Hanken Grotesk', sans-serif; font-weight: 500; font-size: 19px; color: #cbbfb1; }
  /* chamada no mesmo creme do botão "Quero uma parceria" da nav */
  .cta { display: inline-flex; align-items: center; gap: 12px; margin-top: 34px; padding: 15px 26px; border-radius: 999px; background: #f3ece2; color: #17110d; font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 20px; }
  .cta span { font-weight: 500; color: #6f5f50; }
  img { width: 400px; height: 520px; border-radius: 22px; object-fit: cover; }
</style></head><body>
  <div class="text">
    <div class="logo">Carol <i>Limah</i></div>
    <h1>${title}</h1>
    <p>${topics} &nbsp;—&nbsp; @eu.carollimah</p>
    <div class="cta">${cta} <span>→</span></div>
  </div>
  <img src="data:image/png;base64,${photo}" alt="">
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const og of OG) {
  const out = fileURLToPath(new URL(`../public/${og.file}`, import.meta.url));
  await page.setContent(html(og), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
  console.log(`OG gravada em ${out}`);
}
await browser.close();
