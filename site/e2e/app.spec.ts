import { expect, test } from '@playwright/test';

test('/app abre a tela React sem erros e fica fora da busca', async ({ page }) => {
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto('/app/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Monte seu portfólio');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  expect(erros).toEqual([]);
});

test('/app não aparece no sitemap', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).not.toContain('/app/');
});
