// Idiomas do site: português na raiz (/), inglês em /en/ e espanhol em /es/ (latino-americano neutro).
// Textos das páginas em i18n/ui.ts; textos do conteúdo (títulos, nichos, formatos) ao lado do dado, em data/.
export const LANGS = ['pt', 'en', 'es'] as const;
export type Lang = (typeof LANGS)[number];
/** o mesmo texto (ou valor) nos três idiomas */
export type L<T = string> = Record<Lang, T>;

/** <html lang>, hreflang e Intl */
export const LOCALE: L = { pt: 'pt-BR', en: 'en', es: 'es' };
export const OG_LOCALE: L = { pt: 'pt_BR', en: 'en_US', es: 'es_LA' };
export const LANG_NAME: L = { pt: 'Português', en: 'English', es: 'Español' };

/** início do site no idioma: '/', '/en/', '/es/' */
export const home = (lang: Lang) => (lang === 'pt' ? '/' : `/${lang}/`);
/** o mesmo caminho em cada idioma, para páginas sem slug traduzido ('media-kit/' → '/en/media-kit/') */
export const sameIn = (rest = ''): L => ({ pt: `/${rest}`, en: `/en/${rest}`, es: `/es/${rest}` });

/** gerado por `npm run pdf` a partir de /media-kit/, /en/media-kit/ e /es/media-kit/ */
export const mediaKitPdf = (lang: Lang) => (lang === 'pt' ? '/carol-limah-media-kit.pdf' : `/carol-limah-media-kit-${lang}.pdf`);

const NBSP = ' ';
// "1,1 mi" e "478 mil" como o Instagram mostra em pt; em inglês 1.1M e 478K, em espanhol 1,1 M e 478 mil
const UNIT: Record<'en' | 'es', Record<'mi' | 'mil' | '%', string>> = {
  en: { mi: 'M', mil: 'K', '%': '%' },
  es: { mi: `${NBSP}M`, mil: `${NBSP}mil`, '%': `${NBSP}%` },
};

/** número escrito em pt ("1,1 mi", "478 mil", "6.248", "+11,9%") → valor e unidade */
export function parseNum(pt: string) {
  const m = pt.match(/^([+-]?)([\d.,]+)\s*(mi|mil|%)?$/);
  if (!m) throw new Error(`i18n: número em formato desconhecido: "${pt}"`);
  return { sign: m[1], n: Number(m[2].replace(/\./g, '').replace(',', '.')), unit: m[3] as 'mi' | 'mil' | '%' | undefined };
}

/** número escrito em pt, reescrito no idioma (em pt volta igual) */
export function num(pt: string, lang: Lang) {
  if (lang === 'pt') return pt;
  const { sign, n, unit } = parseNum(pt);
  return sign + n.toLocaleString(LOCALE[lang], { maximumFractionDigits: 2 }) + (unit ? UNIT[lang][unit] : '');
}

/** "1,67 mi" → "1,67 milhão" / "1.67 million" / "1,67 millones" */
export function numLong(pt: string, lang: Lang) {
  const { n, unit } = parseNum(pt);
  if (unit !== 'mi') return num(pt, lang);
  const word = { pt: n < 2 ? 'milhão' : 'milhões', en: 'million', es: n === 1 ? 'millón' : 'millones' }[lang];
  return `${n.toLocaleString(LOCALE[lang], { maximumFractionDigits: 2 })} ${word}`;
}

/** 67.7 → "67,7%" / "67.7%" / "67,7 %" */
export const pct = (n: number, lang: Lang) =>
  new Intl.NumberFormat(LOCALE[lang], { style: 'percent', maximumFractionDigits: 1 }).format(n / 100);
