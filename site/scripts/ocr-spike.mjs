// Spike da leitura de prints: abre o harness /ocr-teste/ (precisa do `astro dev` rodando) num
// Chromium headless, lê cada print sozinho com o Tesseract.js de verdade e grava tudo que o
// motor devolveu em ocr/tests/fixtures/<print>.json. Os testes repetem a leitura sem navegador.
// Uso: node scripts/ocr-spike.mjs ocr/tests/prints/*.png
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const arquivos = process.argv.slice(2);
const destino = join(import.meta.dirname, '..', 'ocr', 'tests', 'fixtures');
mkdirSync(destino, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('pageerror', e.message));
await page.goto('http://localhost:4321/ocr-teste/');

for (const arquivo of arquivos) {
  await page.setInputFiles('#arquivos', arquivo);
  await page.click('#ler');
  await page.waitForFunction(() => /^(Pronto|Erro)/.test(document.getElementById('estado').textContent), null, { timeout: 180000 });
  const estado = await page.textContent('#estado');
  const gravacoes = await page.evaluate(() => window.__gravacoes);
  const nome = basename(arquivo);
  const g = gravacoes?.[nome];
  if (!g) {
    console.error(`${nome}: ${estado}`);
    continue;
  }
  writeFileSync(join(destino, nome.replace(/\.\w+$/, '.json')), JSON.stringify(g));
  const t = g.tempos;
  console.log(`${nome}: ${estado} página ${Math.round(t.pagina)} ms, ${g.regioes.length} recortes em ${Math.round(t.regioes)} ms`);
}
await browser.close();
