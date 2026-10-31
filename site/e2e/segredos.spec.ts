import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

// Nenhum segredo (nome ou valor do .env) pode aparecer no que vai para o navegador (dist/client).
const SEGREDOS = ['SUPABASE_SERVICE_ROLE_KEY', 'CLOUDINARY_URL', 'SLACK_WEBHOOK_URL', 'WHATSAPP_TOKEN', 'AI_API_KEY'];

function arquivos(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? arquivos(join(dir, e.name))
      : /\.(html|js|css|json|txt|xml)$/.test(e.name)
        ? [join(dir, e.name)]
        : [],
  );
}

test('o build do navegador não contém nomes de segredos', () => {
  const achados = arquivos('dist/client').flatMap((f) => {
    const texto = readFileSync(f, 'utf8');
    return SEGREDOS.filter((s) => texto.includes(s)).map((s) => `${f}: ${s}`);
  });
  expect(achados).toEqual([]);
});
