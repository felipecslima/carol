// sitemap.xml gerado no build: home + páginas de nicho (/media-kit/ fica de fora, é noindex).
import type { APIRoute } from 'astro';
import { NICHES } from '../data/niches';

export const GET: APIRoute = ({ site }) => {
  const paths = ['/', ...NICHES.map((n) => `/${n.slug}/`)];
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = paths.map((p) => `  <url>\n    <loc>${new URL(p, site).href}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
