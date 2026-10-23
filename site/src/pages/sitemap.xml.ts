// sitemap.xml gerado no build: home + páginas de nicho nos três idiomas, cada URL com as versões nos outros
// (xhtml:link hreflang). /media-kit/ fica de fora, é noindex.
import type { APIRoute } from 'astro';
import { nicheAlternates, nichesIn } from '../data/niches';
import { LANGS, LOCALE, sameIn, type L } from '../i18n';

export const GET: APIRoute = ({ site }) => {
  const pages: L[] = [sameIn(), ...nichesIn('pt').map((n) => nicheAlternates(n.key))];
  const lastmod = new Date().toISOString().slice(0, 10);
  const abs = (p: string) => new URL(p, site).href;
  const urls = pages.flatMap((alt) => LANGS.map((lang) => [
    '  <url>',
    `    <loc>${abs(alt[lang])}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${LOCALE[l]}" href="${abs(alt[l])}" />`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(alt.pt)}" />`,
    '  </url>',
  ].join('\n'))).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
