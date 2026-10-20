// Sobe os vídeos do portfólio para o Cloudinary (pasta carol-limah/, public_id = id do vídeo, ex. carol-limah/v20).
// Credenciais em site/.env: CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// Uso: node scripts/cloudinary-upload.mjs [pasta-dos-mp4] [--force]   (padrão: public/media; --force sobrescreve)
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';

const root = fileURLToPath(new URL('..', import.meta.url));
if (existsSync(join(root, '.env'))) process.loadEnvFile(join(root, '.env'));
if (!process.env.CLOUDINARY_URL) {
  console.error('Falta CLOUDINARY_URL em site/.env (cloudinary://API_KEY:API_SECRET@CLOUD_NAME).');
  process.exit(1);
}
// o SDK lê CLOUDINARY_URL no import, antes do .env carregar: passa a credencial explicitamente
const cfg = new URL(process.env.CLOUDINARY_URL);
cloudinary.config({ cloud_name: cfg.hostname, api_key: cfg.username, api_secret: decodeURIComponent(cfg.password), secure: true });

const args = process.argv.slice(2);
const force = args.includes('--force');
const dir = join(root, args.find((a) => !a.startsWith('--')) ?? 'public/media');
// só os vídeos que estão no portfólio (MEDIA em src/data/content.ts)
const content = readFileSync(join(root, 'src/data/content.ts'), 'utf8');
const used = [...content.matchAll(/video: true, id: '(v\d+)'/g)].map((m) => m[1]);
const files = used.map((id) => `${id}.mp4`).filter((f) => existsSync(join(dir, f)));
const missing = used.filter((id) => !existsSync(join(dir, `${id}.mp4`)));
if (missing.length) console.log(`Sem arquivo local (pulados): ${missing.join(', ')}`);
console.log(`${files.length} vídeos em ${dir}`);

let ok = 0;
const failed = [];
for (const f of files) {
  const id = f.replace('.mp4', '');
  try {
    const r = await cloudinary.uploader.upload(join(dir, f), {
      resource_type: 'video',
      folder: 'carol-limah',
      public_id: id,
      use_filename: false,
      unique_filename: false,
      overwrite: force,
    });
    ok++;
    console.log(`${id} ok ${(r.bytes / 1048576).toFixed(1)} MB${r.existing ? ' (já existia)' : ''}`);
  } catch (e) {
    failed.push(id);
    console.log(`${id} FALHOU: ${e.message ?? e.error?.message ?? e}`);
  }
}
console.log(`\n${ok} enviados, ${failed.length} falharam${failed.length ? ': ' + failed.join(', ') : ''}`);
process.exit(failed.length ? 1 : 0);
