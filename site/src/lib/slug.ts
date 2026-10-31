// Link do portfólio (DEV-141): regras de formato, nomes reservados e sugestões. A checagem de "já está em uso" depende
// do banco (índice único em projects.slug) e entra com a E2. O formato aqui é o mesmo da restrição do banco.

export const SLUG_MINIMO = 3;
export const SLUG_MAXIMO = 30;
const FORMATO = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

/** Nomes que não podem ser de ninguém: rotas do produto, páginas institucionais e golpes óbvios. */
export const RESERVADOS = new Set([
  'app',
  'admin',
  'api',
  'c',
  'login',
  'entrar',
  'sair',
  'cadastro',
  'conta',
  'planos',
  'preco',
  'precos',
  'termos',
  'privacidade',
  'ajuda',
  'suporte',
  'contato',
  'blog',
  'sobre',
  'www',
  'mail',
  'email',
  'status',
  'portfolio-creator',
  'portfoliocreator',
  'creator',
  'creators',
  'carol',
  'carollimah',
  'eucarollimah',
  'midia-kit',
  'media-kit',
  'novo',
  'editor',
  'publicar',
  'static',
  'assets',
  'public',
  'robots',
  'sitemap',
  'oficial',
  'equipe',
  'staff',
]);

/** "Joana Lima!" → "joana-lima": sem acento, minúsculas, só letras, números e hífen. */
export function normalizarSlug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, SLUG_MAXIMO)
    .replace(/-$/, '');
}

/** Mensagem clara se o link não serve; `null` se o formato está certo. */
export function problemaDoSlug(slug: string): string | null {
  if (slug.length < SLUG_MINIMO) return `Use pelo menos ${SLUG_MINIMO} letras ou números.`;
  if (slug.length > SLUG_MAXIMO) return `Use no máximo ${SLUG_MAXIMO} letras ou números.`;
  if (!FORMATO.test(slug)) return 'Use só letras minúsculas, números e hífen, sem começar nem terminar com hífen.';
  if (RESERVADOS.has(slug)) return 'Esse nome é reservado. Escolha outro.';
  return null;
}

/** Até 4 sugestões a partir do nome e do @, já válidas e sem repetir. */
export function sugerirSlugs(nome: string, arroba: string): string[] {
  const doNome = normalizarSlug(nome);
  const doArroba = normalizarSlug(arroba.replace(/^@/, ''));
  const primeiroNome = doNome.split('-')[0] ?? '';
  const candidatos = [doArroba, doNome, doNome.replace(/-/g, ''), primeiroNome && `${primeiroNome}-creator`];
  const vistos = new Set<string>();
  return candidatos
    .filter((c): c is string => Boolean(c))
    .filter((c) => !vistos.has(c) && vistos.add(c) && problemaDoSlug(c) === null)
    .slice(0, 4);
}
