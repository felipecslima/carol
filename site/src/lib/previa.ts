// Prévia do link no WhatsApp e no Instagram (DEV-144): título, descrição e imagem do portfólio publicado. A imagem
// sai do Cloudinary já recortada em 1200x630 (rosto no centro) e em JPG, que é o que o WhatsApp mostra; sem foto da
// creator, vale a imagem do produto, nunca a do site da Carol (padrão do SeoHead).
import type { Projeto } from './projeto';

export const IMAGEM_PADRAO = '/og-portfolio-creator.jpg';
const RECORTE = 'c_fill,g_auto,w_1200,h_630,f_jpg,q_auto';

export interface PreviaDoLink {
  titulo: string;
  descricao: string;
  imagem: string;
  alt: string;
}

/**
 * Endereço do Cloudinary com o recorte da prévia no lugar das transformações que vieram do upload. Vídeo vira o
 * primeiro quadro. Fora do Cloudinary devolve `null`.
 */
export function imagemDePrevia(url: string): string | null {
  const achou = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+)\/(image|video)\/upload\/(.+)$/);
  if (!achou) return null;
  const [, base, tipo, resto] = achou;
  // tira as transformações do upload (segmentos como "f_auto,q_auto,w_1200" ou "so_0"); a versão (v123) fica
  const partes = resto!.split('/');
  while (partes.length > 1 && /^[a-z]{1,3}_[^/]*$/.test(partes[0]!)) partes.shift();
  let caminho = partes.join('/');
  if (tipo === 'video') caminho = caminho.replace(/\.[a-z0-9]+$/i, '') + '.jpg';
  return `${base}/${tipo}/upload/${tipo === 'video' ? `so_0,${RECORTE}` : RECORTE}/${caminho}`;
}

export function previaDoLink(projeto: Projeto): PreviaDoLink {
  const capa = projeto.blocos.find((b) => b.tipo === 'capa');
  const dados = (capa?.dados ?? {}) as Record<string, unknown>;
  const texto = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const tituloDaCapa = texto(dados.titulo);
  const titulo = tituloDaCapa ? `${tituloDaCapa} · portfólio` : 'Portfólio de creator';
  const descricao = texto(dados.subtitulo) || texto(dados.arroba) || 'Portfólio de creator';
  // a imagem que aparece na capa: fundo na variação "fundo", foto nas outras; a outra serve de reserva
  const ordem = capa?.variacao === 'fundo' ? [dados.fundo, dados.video_fundo, dados.foto] : [dados.foto, dados.fundo];
  const imagem = ordem.map((u) => imagemDePrevia(texto(u))).find(Boolean) ?? IMAGEM_PADRAO;
  return { titulo, descricao, imagem, alt: tituloDaCapa || 'Portfólio de creator' };
}

/**
 * Imagem que aparece primeiro na capa publicada (DEV-146): a página pede essa imagem com prioridade alta no <head>,
 * antes do JavaScript. Na variação "fundo" é o fundo (que também é o pôster do vídeo); nas outras, a foto.
 */
export function imagemDaCapa(projeto: Projeto): string | null {
  const capa = projeto.blocos.find((b) => b.tipo === 'capa');
  const dados = (capa?.dados ?? {}) as Record<string, unknown>;
  const url = capa?.variacao === 'fundo' ? dados.fundo : dados.foto;
  return typeof url === 'string' && /^https:\/\//.test(url) ? url : null;
}
