// Gera as imagens da página /portfolio-creator/ a partir do editor de verdade (modo Ver, o que a marca vê):
// a vitrine de seções e as duas imagens do topo (portfólio de exemplo claro e escuro). Substitui as capas dos
// modelos, que deixaram de existir (DEV-096/097).
// Uso: com o servidor de desenvolvimento no ar (`npm run dev`), `node scripts/portfolio-creator-secoes.mjs [url]`.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = fileURLToPath(new URL('../public/media/pc/', import.meta.url));
mkdirSync(out, { recursive: true });

// mesmos arquivos usados em src/data/portfolio-creator.ts (SECOES) e no topo de src/views/PortfolioCreator.astro
const SECOES = [
  { arquivo: 'secao-capa', bloco: 'capa', cor: 'Lavanda', clima: 'Claro' },
  { arquivo: 'secao-videos', bloco: 'videos', cor: 'Pêssego', clima: 'Claro' },
  { arquivo: 'secao-numeros', bloco: 'numeros', cor: 'Menta', clima: 'Claro' },
  { arquivo: 'secao-motivos', bloco: 'motivos', cor: 'Lavanda', clima: 'Escuro' },
  { arquivo: 'secao-formatos', bloco: 'formatos', cor: 'Pêssego', clima: 'Claro' },
  { arquivo: 'secao-processo', bloco: 'processo', cor: 'Menta', clima: 'Escuro' },
];
const TOPO = [
  { arquivo: 'exemplo-claro', cor: 'Lavanda', clima: 'Claro' },
  { arquivo: 'exemplo-escuro', cor: 'Lavanda', clima: 'Escuro' },
];

// cartão da página na proporção 480 × 549 (a das imagens antigas, para não mexer no layout); a imagem sai com 780 px
// de largura, o dobro dos 390 px da tela, para ficar nítida no cartão de 375 px do desktop em tela retina
const LARGURA = 390;
const SAIDA = { width: LARGURA * 2, height: Math.round((LARGURA * 2 * 549) / 480) };
const ALTURA = Math.round((LARGURA * 549) / 480);

const navegador = await chromium.launch();

/** Abre o editor com o projeto de exemplo, escolhe cor e clima pelo painel Estilo e passa para o modo Ver. */
async function abrirVer(cor, clima) {
  const ctx = await navegador.newContext({
    viewport: { width: LARGURA, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem('pc:dica-toque', '1'));
  await page.goto(`${base}/app/editor/`);
  await page.waitForSelector('.ed-tela');
  await page.click('.ed-abas button:has-text("Estilo")');
  await page.click(`.ed-gaveta [role="radio"]:has-text("${cor}")`);
  await page.click(`.ed-gaveta [role="radio"]:has-text("${clima}")`);
  await page.waitForTimeout(1200); // salvar sozinho grava no aparelho
  await page.goto(`${base}/app/editor/?ver=1`);
  await page.waitForSelector('.ed-ver section.bl');
  // o botão "Voltar a editar" não entra na foto
  await page.addStyleTag({ content: '.ed-sair-ver { display: none !important; }' });
  return { ctx, page };
}

async function salvar(png, arquivo) {
  await sharp(png).resize({ ...SAIDA, fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(join(out, `${arquivo}.webp`));
  console.log(`${arquivo}.webp`);
}

for (const s of SECOES) {
  const { ctx, page } = await abrirVer(s.cor, s.clima);
  const secao = page.locator(`.ed-ver section.bl-${s.bloco}`);
  await page.evaluate((b) => document.querySelector(`.ed-ver section.bl-${b}`)?.scrollIntoView({ block: 'start' }), s.bloco);
  await page.waitForTimeout(900); // a seção entra na tela e aparece (com movimento reduzido, sem animação)
  const caixa = await secao.boundingBox();
  // sempre a altura inteira do cartão a partir do topo da seção (seção mais baixa mostra o começo da seguinte, sem
  // ampliar nem cortar as laterais)
  const png = await page.screenshot({ clip: { x: 0, y: caixa.y, width: LARGURA, height: ALTURA } });
  await salvar(png, s.arquivo);
  await ctx.close();
}

for (const t of TOPO) {
  const { ctx, page } = await abrirVer(t.cor, t.clima);
  await page.waitForTimeout(900);
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: LARGURA, height: ALTURA } });
  await salvar(png, t.arquivo);
  await ctx.close();
}

await navegador.close();
