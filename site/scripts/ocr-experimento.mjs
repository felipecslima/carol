// Experimento da segunda passada: lê as faixas de número de uma grade de reels com variantes de
// pré-processamento e segmentação, imprime o que o Tesseract leu e salva as imagens em /tmp/recortes.
// Uso: node scripts/ocr-experimento.mjs ocr/tests/prints/felipe-7.png 712,1139,1566
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const [arquivo, pes] = process.argv.slice(2);
const nome = basename(arquivo, '.png');
mkdirSync('/tmp/recortes', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('pageerror', e.message));
await page.goto('http://localhost:4321/ocr-teste/');
await page.setInputFiles('#arquivos', arquivo);

// mesma geometria de extrair/grade-reels.ts
const W = 721;
const cellW = W / 3, cellH = cellW * 16 / 9;
const faixa = (col, pe) => [col * cellW + 0.19 * cellW, pe - 0.125 * cellH, (0.85 - 0.19) * cellW, (0.125 - 0.015) * cellH];
const caixas = pes.split(',').map(Number).flatMap((pe) => [0, 1, 2].map((c) => faixa(c, pe)));

const variantes = {
  'isolar+linha+wl': { preparo: 'isolar', psm: '7', whitelist: true },
  'isolar+linha': { preparo: 'isolar', psm: '7', whitelist: false },
  'inverter+linha+wl': { preparo: 'inverter', psm: '7', whitelist: true },
  'isolar+bloco+wl': { preparo: 'isolar', psm: '6', whitelist: true },
  'isolar+raw+wl': { preparo: 'isolar', psm: '13', whitelist: true },
};
for (const [rotulo, recorte] of Object.entries(variantes)) {
  const t0 = Date.now();
  const saida = await page.evaluate(({ caixas, recorte }) => window.__experimento(0, caixas, 'numero_branco', recorte), { caixas, recorte });
  console.log(`\n## ${rotulo} (${Date.now() - t0} ms)`);
  saida.forEach((s, i) => {
    console.log(`  faixa ${i} y=${Math.round(s.caixa[1])}: ${s.texto || '∅'}`);
    if (s.imagem && rotulo === 'isolar+linha+wl') writeFileSync(`/tmp/recortes/${nome}-${i}.png`, Buffer.from(s.imagem.split(',')[1], 'base64'));
  });
}
await browser.close();
