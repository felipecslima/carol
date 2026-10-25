// Lê do banco a versão NO AR de um portfólio (`projects.publicado`), nunca o rascunho (DEV-142, 143).
import { projetoSchema, type Projeto } from '@lib/projeto';
import { consulta } from './banco';

export interface PaginaNoAr {
  projeto: Projeto;
  slug: string;
  projetoId: string;
  dono: string;
}

export async function paginaNoAr(slug: string): Promise<PaginaNoAr | null> {
  if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(slug)) return null;
  const { dados } = await consulta<{ id: string; dono: string; slug: string; status: string; publicado: unknown }>(
    `projects?slug=ilike.${slug}&status=in.(no_ar,edicao_travada)&select=id,dono,slug,status,publicado&limit=1`,
  );
  const linha = dados[0];
  if (!linha?.publicado) return null;
  const lido = projetoSchema.safeParse(linha.publicado);
  return lido.success ? { projeto: lido.data, slug: linha.slug, projetoId: linha.id, dono: linha.dono } : null;
}

/** O código do link da marca existe para este portfólio? */
export async function linkDaMarca(projetoId: string, codigo: string): Promise<{ id: string; nome: string } | null> {
  if (!/^[a-z0-9]{4,12}$/.test(codigo)) return null;
  const { dados } = await consulta<{ id: string; nome_marca: string }>(
    `brand_links?codigo=eq.${codigo}&projeto_id=eq.${projetoId}&select=id,nome_marca&limit=1`,
  );
  return dados[0] ? { id: dados[0].id, nome: dados[0].nome_marca } : null;
}
