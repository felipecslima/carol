// Jornada sem conta no tamanho de celular (DEV-230): começar pelo assistente, cair no editor com o que respondeu,
// editar, recarregar sem perder, ver como a marca vê e chegar em "Entrar para publicar". Publicar e a marca abrir
// precisam de conta e do servidor (rotas SSR), fora deste build estático: ficam nos roteiros com a conta de teste.
import { devices, expect, test } from '@playwright/test';

test.use({ ...devices['iPhone 13'], defaultBrowserType: 'chromium' });

test('começa sem conta, monta pelo assistente e chega no editor com as respostas', async ({ page }) => {
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto('/app/');
  await page.getByRole('link', { name: 'Começar' }).click();
  await expect(page).toHaveURL(/\/app\/novo\/$/);

  // etapas: cores, nome, @, cidade, nicho, publi, o que grava, título, frase (e números, se respondeu que já fez publi)
  const respostas: Record<string, string> = {
    nome: 'Bia Teste',
    arroba: 'biateste',
    cidade: 'Belém',
    grava: 'receitas rápidas',
    frase: 'Receitas de 15 minutos',
  };
  for (let passo = 0; passo < 14 && !page.url().includes('/app/editor/'); passo++) {
    for (const [id, valor] of Object.entries(respostas)) {
      const campo = page.locator(`#${id}`);
      if (await campo.isVisible().catch(() => false)) await campo.fill(valor);
    }
    const nicho = page.getByRole('group', { name: 'Nicho' });
    if (await nicho.isVisible().catch(() => false)) await nicho.getByRole('button').first().click();
    const publi = page.getByRole('radiogroup', { name: 'Já fez publi' });
    if (await publi.isVisible().catch(() => false)) await publi.getByRole('radio').last().click();
    await page.locator('.as-acoes .as-botao:not(.as-botao--vazado)').click();
    await page.waitForTimeout(400);
  }
  await expect(page).toHaveURL(/\/app\/editor\/$/);
  await expect(page.locator('.ed-tela')).toContainText('Bia Teste');
  await expect(page.locator('.ed-salvo')).toHaveAttribute('title', 'Salvo no aparelho');
  expect(erros).toEqual([]);
});

test('edita, recarrega sem perder, vê como a marca vê e precisa entrar para publicar', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('pc:dica-toque', '1'));
  await page.goto('/app/editor/');
  const capa = page.locator('.ed-bloco').first();
  await capa.tap();
  await capa.tap();
  const titulo = page.locator('.ed-gaveta textarea, .ed-gaveta input[type=text]').first();
  await titulo.fill('Portfólio de teste da jornada');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
  await page.reload();
  await expect(page.locator('.ed-tela')).toContainText('Portfólio de teste da jornada');

  // esconder pelo menu Mais e desfazer
  const total = await page.locator('.ed-bloco').count();
  await page.locator('.ed-bloco').nth(2).tap();
  await page.getByRole('button', { name: /Mais ações/ }).tap();
  await page.getByRole('menuitem', { name: /Esconder/ }).tap();
  await expect(page.locator('.ed-bloco')).toHaveCount(total - 1);
  await page.locator('.ed-toast').getByRole('button', { name: 'Desfazer' }).tap();
  await expect(page.locator('.ed-bloco')).toHaveCount(total);

  // como a marca vê
  await page.getByRole('button', { name: 'Ver como a marca vê' }).tap();
  await expect(page.getByRole('button', { name: 'Voltar a editar' })).toBeVisible();
  await page.getByRole('button', { name: 'Voltar a editar' }).tap();

  // publicar pede conta
  await page.locator('.ed-abas').getByRole('button', { name: /Publicar/ }).tap();
  await expect(page.getByRole('link', { name: 'Entrar para publicar' })).toBeVisible();
});
